import { html, fixture, expect, oneEvent } from "@open-wc/testing";
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
});
