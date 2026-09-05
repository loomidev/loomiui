import { html, fixture, expect, nextFrame, oneEvent } from "@open-wc/testing";
import "../dist/loomi-progress.js";
import type { LoomiProgressStep, LoomiProgressSteps } from "../dist/index.js";

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
          <loomi-progress-steps current="2" size=${size} style="width: 720px">
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
        expect(line.top + line.height / 2).to.be.closeTo(markers[0].top + markers[0].height / 2, 1);
      }
    });
  }

  for (const size of ["regular", "small"]) {
    for (const control of ["static", "button", "link"]) {
      it(`centers ${size} vertical connectors beneath ${control} markers`, async () => {
        const el = await fixture<LoomiProgressSteps>(html`
          <loomi-progress-steps orientation="vertical" current="2" size=${size}
            ?clickable=${control === "button"} style="width: 280px">
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
