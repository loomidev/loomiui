import { html, fixture, expect, nextFrame, oneEvent } from "@open-wc/testing";
import "../dist/loomi-progress.js";
import type { LoomiProgressStep, LoomiProgressSteps } from "../dist/index.js";

describe("loomi-progress-steps", () => {
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
