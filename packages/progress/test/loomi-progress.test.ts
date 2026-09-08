import { html, fixture, expect, nextFrame, oneEvent } from "@open-wc/testing";
import "../dist/loomi-progress.js";
import "../../button/dist/index.js";
import type { LoomiProgressArc, LoomiProgressBar, LoomiProgressStep, LoomiProgressSteps } from "../dist/index.js";

describe("loomi-progress-bar", () => {
  it("keeps the inline label by default", async () => {
    const el = await fixture<LoomiProgressBar>(
      html`<loomi-progress-bar percentage="50" show-percentage-label></loomi-progress-bar>`,
    );
    expect(el.inline).to.be.true;
    expect(el.shadowRoot!.querySelector(".loomi-fill-label")).to.exist;
    expect(el.shadowRoot!.querySelector(".loomi-bar-label-out")).to.not.exist;
  });

  it('moves the label outside when show-percentage-label-inline="false"', async () => {
    const el = await fixture<LoomiProgressBar>(
      html`<loomi-progress-bar
        percentage="50"
        show-percentage-label
        show-percentage-label-inline="false"
      ></loomi-progress-bar>`,
    );
    expect(el.inline, "the string \"false\" attribute value must actually disable the boolean").to.be
      .false;
    expect(el.shadowRoot!.querySelector(".loomi-fill-label")).to.not.exist;
    expect(el.shadowRoot!.querySelector(".loomi-bar-label-out")).to.exist;
  });

  it("positions the outside label and applies prefix/suffix verbatim", async () => {
    const el = await fixture<LoomiProgressBar>(
      html`<loomi-progress-bar
        percentage="75"
        show-percentage-label
        show-percentage-label-inline="false"
        percentage-label-position="top-center"
        percentage-suffix=" complete"
      ></loomi-progress-bar>`,
    );
    const outside = el.shadowRoot!.querySelector(".loomi-bar-label-out")!;
    expect(outside.classList.contains("center")).to.be.true;
    expect(outside.textContent!.trim()).to.equal("75% complete");
  });
});

describe("loomi-progress-arc", () => {
  for (const size of ["small", "medium", "large", "300"]) {
    it(`reserves space for slotted content at size ${size}`, async () => {
      const wrapper = await fixture<HTMLDivElement>(html`
        <div>
          <loomi-progress-arc size=${size} percentage="68" caption="On track for 80% target">
            <loomi-button size="small" color="gray">Show details</loomi-button>
          </loomi-progress-arc>
          <div class="following">Following content</div>
        </div>
      `);
      await nextFrame();
      const arc = wrapper.querySelector<LoomiProgressArc>("loomi-progress-arc")!;
      const button = wrapper.querySelector("loomi-button")!;
      const following = wrapper.querySelector(".following")!;
      const assertContained = () => {
        const body = arc.shadowRoot!.querySelector(".loomi-arc-body")!.getBoundingClientRect();
        expect(arc.getBoundingClientRect().bottom).to.be.at.least(body.bottom - 0.5);
        expect(following.getBoundingClientRect().top).to.be.at.least(button.getBoundingClientRect().bottom - 0.5);
      };
      assertContained();
      const initialHeight = arc.getBoundingClientRect().height;
      const extra = document.createElement("div");
      extra.style.height = "100px";
      extra.textContent = "Additional details";
      arc.append(extra);
      await nextFrame();
      assertContained();
      expect(arc.getBoundingClientRect().height).to.be.greaterThan(initialHeight + 90);
    });
  }

  it("renders the percentage and caption", async () => {
    const el = await fixture<LoomiProgressArc>(
      html`<loomi-progress-arc percentage="68" caption="On track for 80% target"></loomi-progress-arc>`,
    );
    await nextFrame();
    expect(el.shadowRoot!.querySelector(".loomi-arc-value")!.textContent!.trim()).to.equal("68%");
    expect(el.shadowRoot!.querySelector(".loomi-arc-caption")!.textContent!.trim()).to.equal(
      "On track for 80% target",
    );
    const ticks = el.shadowRoot!.querySelectorAll(".tick");
    const active = el.shadowRoot!.querySelectorAll(".tick.active");
    expect(ticks.length).to.be.greaterThan(0);
    expect(active.length).to.be.greaterThan(0).and.to.be.lessThan(ticks.length);
  });

  it("hides the value when show-percent is false", async () => {
    const el = await fixture<LoomiProgressArc>(
      html`<loomi-progress-arc percentage="30" show-percent="false"></loomi-progress-arc>`,
    );
    expect(el.shadowRoot!.querySelector(".loomi-arc-value")).to.not.exist;
  });
});

describe("loomi-progress-steps", () => {
  for (const size of ["regular", "small"]) {
    it(`keeps ${size} horizontal markers aligned inside prose content`, async () => {
      const wrapper = await fixture<HTMLDivElement>(html`
        <div class="progress-prose-regression">
          <style>
            .progress-prose-regression loomi-progress-step + loomi-progress-step {
              margin-top: 1rem;
            }
          </style>
          <loomi-progress-steps current="2" size=${size} interactive="false" style="width: 720px">
            <loomi-progress-step label="Account" description="Create your profile"></loomi-progress-step>
            <loomi-progress-step label="Billing" description="Add payment details"></loomi-progress-step>
            <loomi-progress-step label="Confirm" description="Review and finish"></loomi-progress-step>
          </loomi-progress-steps>
        </div>
      `);
      await nextFrame();
      const steps = Array.from(wrapper.querySelectorAll<LoomiProgressStep>("loomi-progress-step"));
      await Promise.all(steps.map((step) => step.updateComplete));
      const bounds = (step: LoomiProgressStep, selector: string) =>
        step.shadowRoot!.querySelector(selector)!.getBoundingClientRect();
      const markers = steps.map((step) => bounds(step, ".loomi-step-marker"));
      const labels = steps.map((step) => bounds(step, ".loomi-step-label"));
      for (let index = 1; index < steps.length; index++) {
        expect(markers[index].top).to.be.closeTo(markers[0].top, 0.5);
        expect(labels[index].top).to.be.closeTo(labels[0].top, 0.5);
      }
      for (const step of steps.slice(0, -1)) {
        const line = bounds(step, ".loomi-step-line");
        const card = wrapper.querySelector("loomi-progress-steps")!.shadowRoot!.querySelector(".loomi-steps")!.getBoundingClientRect();
        expect(line.top).to.be.closeTo(card.top + 1, 0.5);
        expect(line.bottom).to.be.closeTo(card.bottom - 1, 0.5);
        expect(line.width).to.be.closeTo(18, 0.5);
      }
    });
  }

  for (const size of ["regular", "small"]) {
    for (const control of ["static", "button", "link"]) {
      it(`centers ${size} vertical connectors beneath ${control} markers`, async () => {
        const el = await fixture<LoomiProgressSteps>(html`
          <loomi-progress-steps orientation="vertical" current="2" size=${size}
            interactive="false" ?clickable=${control === "button"} style="width: 280px">
            <loomi-progress-step label="Account" description="Create your profile"></loomi-progress-step>
            <loomi-progress-step label="Billing" description="Add payment details">
              Additional payment information that wraps across multiple lines.
            </loomi-progress-step>
            <loomi-progress-step label="Confirm" description="Review and finish"></loomi-progress-step>
          </loomi-progress-steps>
        `);
        const steps = Array.from(el.querySelectorAll<LoomiProgressStep>("loomi-progress-step"));
        if (control === "link") steps.forEach((step) => { step.href = "#billing"; });
        await Promise.all(steps.map((step) => step.updateComplete));
        await nextFrame();
        for (const step of steps.slice(0, -1)) {
          const bounds = (selector: string) => step.shadowRoot!.querySelector(selector)!.getBoundingClientRect();
          const marker = bounds(".loomi-step-marker");
          const line = bounds(".loomi-step-line");
          expect(line.width).to.equal(2);
          expect(line.left + line.width / 2).to.be.closeTo(marker.left + marker.width / 2, 0.5);
          expect(line.top).to.be.at.least(marker.bottom);
          expect(bounds(".loomi-step-body").left).to.be.closeTo(bounds(".loomi-step-copy").left, 0.5);
        }
        expect(steps[2].shadowRoot!.querySelector(".loomi-step-line")!.getBoundingClientRect().width).to.equal(0);
      });
    }
  }

  it("derives child step state from the current step", async () => {
    const el = await fixture<LoomiProgressSteps>(html`
      <loomi-progress-steps current="2">
        <loomi-progress-step label="Cart"></loomi-progress-step>
        <loomi-progress-step label="Shipping"></loomi-progress-step>
        <loomi-progress-step label="Payment"></loomi-progress-step>
      </loomi-progress-steps>
    `);

    const steps = el.querySelectorAll<LoomiProgressStep>("loomi-progress-step");
    expect(steps[0].completed).to.be.true;
    expect(steps[1].active).to.be.true;
    expect(steps[2].active).to.be.false;
    expect(steps[2].completed).to.be.false;
    expect(steps[1].shadowRoot!.querySelector("[aria-current='step']")).to.exist;
  });

  it("lets clickable child steps update current and emit a change event", async () => {
    const el = await fixture<LoomiProgressSteps>(html`
      <loomi-progress-steps current="1" clickable>
        <loomi-progress-step label="Profile"></loomi-progress-step>
        <loomi-progress-step label="Team"></loomi-progress-step>
        <loomi-progress-step label="Billing"></loomi-progress-step>
      </loomi-progress-steps>
    `);
    const steps = el.querySelectorAll<LoomiProgressStep>("loomi-progress-step");
    const changed = oneEvent(el, "loomi-progress-steps-change");

    steps[2].shadowRoot!.querySelector<HTMLButtonElement>("button")!.click();
    const event = await changed;
    await el.updateComplete;

    expect(el.current).to.equal(3);
    expect(event.detail.current).to.equal(3);
    expect(steps[2].active).to.be.true;
  });

  it("preserves explicit child states while syncing layout attributes", async () => {
    const el = await fixture<LoomiProgressSteps>(html`
      <loomi-progress-steps current="3" orientation="vertical" size="small">
        <loomi-progress-step label="Account" completed></loomi-progress-step>
        <loomi-progress-step label="Verification" state="error"></loomi-progress-step>
        <loomi-progress-step label="Finish"></loomi-progress-step>
      </loomi-progress-steps>
    `);

    const steps = el.querySelectorAll<LoomiProgressStep>("loomi-progress-step");
    expect(steps[1].state).to.equal("error");
    expect(steps[1].error).to.be.false;
    expect(steps[1].orientation).to.equal("vertical");
    expect(steps[1].size).to.equal("small");
    expect(steps[2].active).to.be.true;
  });

  it("clamps a percentage outside 0–100", async () => {
    const over = await fixture(html`<loomi-progress-bar percentage="140"></loomi-progress-bar>`);
    await (over as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;
    expect(
      over.shadowRoot!.querySelector('[role="progressbar"]')!.getAttribute("aria-valuenow"),
    ).to.equal("100");

    const under = await fixture(html`<loomi-progress-bar percentage="-20"></loomi-progress-bar>`);
    await (under as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;
    expect(
      under.shadowRoot!.querySelector('[role="progressbar"]')!.getAttribute("aria-valuenow"),
    ).to.equal("0");
  });

  it("names the progressbar even without an explicit label", async () => {
    const el = await fixture(html`<loomi-progress-bar percentage="30"></loomi-progress-bar>`);
    await (el as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;
    const bar = el.shadowRoot!.querySelector('[role="progressbar"]')!;
    expect(bar.getAttribute("aria-label")).to.be.a("string").and.not.be.empty;
  });

  it("uses an explicit label when given one", async () => {
    const el = await fixture(
      html`<loomi-progress-bar percentage="30" label="Upload"></loomi-progress-bar>`,
    );
    await (el as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;
    expect(
      el.shadowRoot!.querySelector('[role="progressbar"]')!.getAttribute("aria-label"),
    ).to.equal("Upload");
  });
});

describe("loomi-progress-steps", () => {
  const steps = () =>
    fixture(html`
      <loomi-progress-steps current="2">
        <loomi-progress-step label="Details"></loomi-progress-step>
        <loomi-progress-step label="Payment"></loomi-progress-step>
        <loomi-progress-step label="Done"></loomi-progress-step>
      </loomi-progress-steps>
    `);

  const items = (el: Element) => Array.from(el.querySelectorAll("loomi-progress-step"));

  it("numbers its steps in document order", async () => {
    const el = await steps();
    await nextFrame();
    expect(items(el).map((s) => s.stepIndex)).to.eql([1, 2, 3]);
  });

  it("derives completed, active and upcoming from current", async () => {
    const el = await steps();
    await nextFrame();
    const [first, second, third] = items(el);
    expect(first.completed, "before current is complete").to.be.true;
    expect(second.active, "current is active").to.be.true;
    expect(third.state, "after current is upcoming").to.equal("upcoming");
  });

  it("re-derives the states when current moves", async () => {
    const el = await steps();
    await nextFrame();
    (el as HTMLElement & { current: number }).current = 3;
    await (el as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;
    await nextFrame();

    const [first, second, third] = items(el);
    expect(first.completed).to.be.true;
    expect(second.completed).to.be.true;
    expect(third.active).to.be.true;
  });

  it("marks the last step so it can drop its trailing connector", async () => {
    const el = await steps();
    await nextFrame();
    expect(items(el).at(-1)!.last).to.be.true;
    expect(items(el)[0].last).to.be.false;
  });

  it("defaults to the circle variant and propagates variant to children", async () => {
    const el = await steps();
    await nextFrame();
    expect(el.variant).to.equal("circle");
    for (const step of items(el)) expect(step.variant).to.equal("circle");
  });

  it("renders bar-variant steps without a marker or connector, with a step eyebrow", async () => {
    const el = await fixture<LoomiProgressSteps>(html`
      <loomi-progress-steps current="2" variant="bar">
        <loomi-progress-step label="Details"></loomi-progress-step>
        <loomi-progress-step label="Payment"></loomi-progress-step>
        <loomi-progress-step label="Done"></loomi-progress-step>
      </loomi-progress-steps>
    `);
    await nextFrame();
    const [first, second] = items(el) as LoomiProgressStep[];
    await Promise.all([first, second].map((step) => step.updateComplete));

    expect(first.shadowRoot!.querySelector(".loomi-step-marker")).to.not.exist;
    expect(first.shadowRoot!.querySelector(".loomi-step-line")).to.not.exist;
    expect(first.shadowRoot!.querySelector(".loomi-step-bar")).to.exist;
    expect(second.shadowRoot!.querySelector(".loomi-step-eyebrow")!.textContent!.trim()).to.equal(
      "Step 2",
    );
  });

  it("still honours a state the author set explicitly", async () => {
    const el = await fixture(html`
      <loomi-progress-steps current="1">
        <loomi-progress-step label="Details"></loomi-progress-step>
        <loomi-progress-step label="Payment" error></loomi-progress-step>
      </loomi-progress-steps>
    `);
    await nextFrame();
    const [, second] = Array.from(el.querySelectorAll("loomi-progress-step"));
    expect(second.error, "an authored state survives the group's sync").to.be.true;

    (el as HTMLElement & { current: number }).current = 2;
    await (el as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;
    await nextFrame();
    expect(second.error, "and survives current moving onto it").to.be.true;
  });
});


describe("interactive progress steps", () => {
  const setup = () => fixture<LoomiProgressSteps>(html`
    <loomi-progress-steps interactive validate>
      <loomi-progress-step label="Account"><input required aria-label="Name"></loomi-progress-step>
      <loomi-progress-step label="Billing"><p>Payment content</p></loomi-progress-step>
      <loomi-progress-step label="Confirm"><p>Review content</p></loomi-progress-step>
    </loomi-progress-steps>
  `);
  it("blocks invalid forms, recovers after correction, and preserves hidden content", async () => {
    const el = await setup();
    const steps = Array.from(el.querySelectorAll<LoomiProgressStep>("loomi-progress-step"));
    const input = el.querySelector("input")!;
    expect(await el.next()).to.equal(false);
    expect(el.current).to.equal(1);
    expect(steps[0].error).to.equal(true);
    input.value = "Alex";
    expect(await el.next()).to.equal(true);
    await nextFrame();
    expect(steps[0].error).to.equal(false);
    expect(steps[0].shadowRoot!.querySelector<HTMLElement>(".loomi-step-body")!.hidden).to.equal(true);
    expect(steps[1].shadowRoot!.querySelector<HTMLElement>(".loomi-step-body")!.hidden).to.equal(false);
    expect(await el.previous()).to.equal(true);
    expect(input.value).to.equal("Alex");
  });
  it("blocks explicit errors and disabled targets while allowing backward navigation", async () => {
    const el = await setup();
    el.validate = false;
    const steps = Array.from(el.querySelectorAll<LoomiProgressStep>("loomi-progress-step"));
    steps[0].error = true;
    expect(await el.goTo(3)).to.equal(false);
    steps[0].error = false;
    steps[1].disabled = true;
    expect(await el.next()).to.equal(false);
    expect(await el.goTo(3)).to.equal(true);
    steps[2].error = true;
    expect(await el.goTo(1)).to.equal(true);
    expect(await el.goTo(0)).to.equal(false);
  });
  it("awaits custom validation and ignores concurrent navigation", async () => {
    const el = await setup();
    el.validate = false;
    let finish!: (valid: boolean) => void;
    el.validateStep = () => new Promise<boolean>((resolve) => { finish = resolve; });
    const pending = el.next();
    expect(await el.goTo(3)).to.equal(false);
    expect(el.current).to.equal(1);
    finish(false);
    expect(await pending).to.equal(false);
    el.validateStep = async () => true;
    expect(await el.next()).to.equal(true);
  });
  it("handles rejected validators and stale results without changing the selected step", async () => {
    const el = await setup();
    el.validate = false;
    el.validateStep = async () => { throw new Error("Unavailable"); };
    expect(await el.next()).to.equal(false);
    let finish!: (valid: boolean) => void;
    el.validateStep = () => new Promise<boolean>((resolve) => { finish = resolve; });
    const pending = el.next();
    el.current = 3;
    finish(true);
    expect(await pending).to.equal(false);
    expect(el.current).to.equal(3);
  });
  it("switches content through header buttons and emits a change only on success", async () => {
    const el = await setup();
    el.validate = false;
    const steps = Array.from(el.querySelectorAll<LoomiProgressStep>("loomi-progress-step"));
    let changes = 0;
    el.addEventListener("loomi-progress-steps-change", () => { changes++; });
    steps[1].shadowRoot!.querySelector<HTMLButtonElement>("button")!.click();
    await nextFrame();
    expect(el.current).to.equal(2);
    expect(changes).to.equal(1);
    steps[1].error = true;
    steps[2].shadowRoot!.querySelector<HTMLButtonElement>("button")!.click();
    await nextFrame();
    expect(el.current).to.equal(2);
    expect(changes).to.equal(1);
  });
});


describe("interactive step panel layout", () => {
  for (const variant of ["circle", "bar"]) {
    it(`keeps ${variant} headers above a full-width active panel`, async () => {
      const el = await fixture<LoomiProgressSteps>(html`
        <loomi-progress-steps interactive variant=${variant} style="width:720px">
          <loomi-progress-step label="Account"><input aria-label="Name"><button>Continue</button></loomi-progress-step>
          <loomi-progress-step label="Billing"><input aria-label="Email"></loomi-progress-step>
        </loomi-progress-steps>
      `);
      await nextFrame();
      const steps = Array.from(el.querySelectorAll<LoomiProgressStep>("loomi-progress-step"));
      const bounds = (index: number, selector: string) => steps[index].shadowRoot!.querySelector(selector)!.getBoundingClientRect();
      const card = el.shadowRoot!.querySelector(".loomi-steps")!.getBoundingClientRect();
      expect(bounds(0, ".loomi-step-head").top).to.equal(bounds(1, ".loomi-step-head").top);
      expect(bounds(0, ".loomi-step-body").width).to.be.closeTo(card.width, 2);
      expect(bounds(0, ".loomi-step-body").top).to.be.at.least(bounds(0, ".loomi-step-head").bottom);
      expect(bounds(1, ".loomi-step-body").height).to.equal(0);
      await el.next();
      await nextFrame();
      expect(bounds(0, ".loomi-step-body").height).to.equal(0);
      expect(bounds(1, ".loomi-step-body").width).to.be.closeTo(card.width, 2);
    });
  }
});
