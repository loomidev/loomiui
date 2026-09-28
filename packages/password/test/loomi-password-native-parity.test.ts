import { html, fixture, expect } from "@open-wc/testing";
import { sendKeys } from "@web/test-runner-commands";
import { recordFormEvents, inForm } from "../../../test/form-events.js";
import "../dist/loomi-password.js";
import type { LoomiPassword } from "../dist/index.js";

// Native parity: see "Value and events contract" in packages/core/README.md.
describe("loomi-password native parity", () => {
  const field = (el: LoomiPassword) => el.shadowRoot!.querySelector("input") as HTMLInputElement;

  it("setting value updates the field and form value without firing events", async () => {
    const el = await fixture<LoomiPassword>(html`<loomi-password></loomi-password>`);
    const { formValue } = inForm(el);
    const log = recordFormEvents(el);

    el.value = "hello";
    await el.updateComplete;
    expect(field(el).value).to.equal("hello");
    expect(formValue()).to.equal("hello");
    expect(log).to.deep.equal([]);
  });

  it("typing fires exactly one input per keystroke, then change once on leaving", async () => {
    const el = await fixture<LoomiPassword>(html`<loomi-password></loomi-password>`);
    const { formValue, elsewhere } = inForm(el);
    const log = recordFormEvents(el);

    field(el).focus();
    await sendKeys({ type: "ab" });
    elsewhere.focus();
    await el.updateComplete;
    expect(log).to.deep.equal(["input:a", "input:ab", "change:ab"]);
    expect(formValue()).to.equal("ab");
  });

  it("re-syncs the field when an input listener rejects the edit", async () => {
    const el = await fixture<LoomiPassword>(html`<loomi-password></loomi-password>`);
    // Back to the value last rendered: Lit's binding alone would skip this as unchanged.
    el.addEventListener("input", () => (el.value = ""));
    field(el).focus();
    await sendKeys({ type: "x" });
    await el.updateComplete;
    expect(field(el).value).to.equal("");
  });
});
