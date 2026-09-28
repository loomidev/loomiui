import { html, fixture, expect } from "@open-wc/testing";
import { recordFormEvents, inForm } from "../../../test/form-events.js";
import "../dist/loomi-checkbox.js";
import type { LoomiCheckbox } from "../dist/index.js";

// Native parity: see "Value and events contract" in packages/core/README.md.
describe("loomi-checkbox native parity", () => {
  it("reports type 'checkbox' and ignores writes to it", async () => {
    const el = await fixture<LoomiCheckbox>(html`<loomi-checkbox></loomi-checkbox>`);
    expect(el.type).to.equal("checkbox");
    (el as unknown as { type: string }).type = "radio";
    expect(el.type).to.equal("checkbox");
  });

  it("setting checked updates the UI and form value without firing events", async () => {
    const el = await fixture<LoomiCheckbox>(html`<loomi-checkbox value="yes"></loomi-checkbox>`);
    const { formValue } = inForm(el, "agree");
    const log = recordFormEvents(el, () => el.checked);

    el.checked = true;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector("input")!.checked).to.be.true;
    expect(formValue()).to.equal("yes");

    el.checked = false;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector("input")!.checked).to.be.false;
    expect(formValue()).to.be.null;
    expect(log).to.deep.equal([]);
  });

  it("a user toggle fires input then change once each, with checked already updated", async () => {
    const el = await fixture<LoomiCheckbox>(html`<loomi-checkbox></loomi-checkbox>`);
    const log = recordFormEvents(el, () => el.checked);
    el.shadowRoot!.querySelector("input")!.click();
    expect(log).to.deep.equal(["input:true", "change:true"]);
  });

  it("re-syncs the native box when a listener reverts checked in the same task", async () => {
    const el = await fixture<LoomiCheckbox>(html`<loomi-checkbox></loomi-checkbox>`);
    el.addEventListener("input", () => (el.checked = false));
    el.shadowRoot!.querySelector("input")!.click();
    await el.updateComplete;
    expect(el.checked).to.be.false;
    expect(el.shadowRoot!.querySelector("input")!.checked).to.be.false;
  });
});
