import { html, fixture, expect } from "@open-wc/testing";
import { sendKeys } from "@web/test-runner-commands";
import { recordFormEvents, inForm } from "../../../test/form-events.js";
import "../dist/loomi-number.js";
import type { LoomiNumber } from "../dist/index.js";

// Native parity: see "Value and events contract" in packages/core/README.md.
describe("loomi-number native parity", () => {
  const field = (el: LoomiNumber) => el.shadowRoot!.querySelector("input") as HTMLInputElement;
  const step = (el: LoomiNumber, dir: "inc" | "dec") =>
    el.shadowRoot!.querySelector<HTMLButtonElement>(`.loomi-step.${dir}`)!;

  it("setting value updates the field and form value without firing events", async () => {
    const el = await fixture<LoomiNumber>(html`<loomi-number></loomi-number>`);
    const { formValue } = inForm(el);
    const log = recordFormEvents(el);

    el.value = "42";
    await el.updateComplete;
    expect(field(el).value).to.equal("42");
    expect(formValue()).to.equal("42");
    expect(log).to.deep.equal([]);
  });

  it("typing fires one input per keystroke, then change alone on leaving", async () => {
    const el = await fixture<LoomiNumber>(html`<loomi-number></loomi-number>`);
    const { formValue, elsewhere } = inForm(el);
    const log = recordFormEvents(el);

    field(el).focus();
    await sendKeys({ type: "42" });
    elsewhere.focus();
    await el.updateComplete;
    expect(log).to.deep.equal(["input:4", "input:42", "change:42"]);
    expect(formValue()).to.equal("42");
  });

  it("a commit that clamps fires input for the clamped value before change", async () => {
    const el = await fixture<LoomiNumber>(html`<loomi-number max="10"></loomi-number>`);
    const { elsewhere } = inForm(el);
    const log = recordFormEvents(el);

    field(el).focus();
    await sendKeys({ type: "50" });
    elsewhere.focus();
    expect(log).to.deep.equal(["input:5", "input:50", "input:10", "change:10"]);
  });

  it("the step buttons fire input then change", async () => {
    const el = await fixture<LoomiNumber>(html`<loomi-number value="3"></loomi-number>`);
    const log = recordFormEvents(el);
    step(el, "inc").click();
    expect(log).to.deep.equal(["input:4", "change:4"]);
  });
});
