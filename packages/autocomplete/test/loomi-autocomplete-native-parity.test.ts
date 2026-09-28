import { html, fixture, expect } from "@open-wc/testing";
import { sendKeys } from "@web/test-runner-commands";
import { recordFormEvents, inForm } from "../../../test/form-events.js";
import "../dist/loomi-autocomplete.js";
import type { LoomiAutocomplete } from "../dist/index.js";

// Native parity: see "Value and events contract" in packages/core/README.md.
const DATA = [
  { label: "Accra", value: "acc" },
  { label: "Kumasi", value: "kum" },
];

describe("loomi-autocomplete native parity", () => {
  const field = (el: LoomiAutocomplete) =>
    el.shadowRoot!.querySelector("input") as HTMLInputElement;

  it("setting value shows the matching label, updates the form and fires nothing", async () => {
    const el = await fixture<LoomiAutocomplete>(
      html`<loomi-autocomplete .data=${DATA}></loomi-autocomplete>`,
    );
    const { formValue } = inForm(el, "city");
    const log = recordFormEvents(el);

    el.value = "kum";
    await el.updateComplete;
    expect(field(el).value).to.equal("Kumasi");
    expect(formValue()).to.equal("kum");
    expect(log).to.deep.equal([]);
  });

  it("typing fires one input per keystroke, then change once on leaving", async () => {
    const el = await fixture<LoomiAutocomplete>(
      html`<loomi-autocomplete .data=${DATA}></loomi-autocomplete>`,
    );
    const { elsewhere } = inForm(el, "city");
    const log = recordFormEvents(el);

    field(el).focus();
    await sendKeys({ type: "Ta" });
    elsewhere.focus();
    expect(log).to.deep.equal(["input:T", "input:Ta", "change:Ta"]);
  });

  it("picking a suggestion fires input then change once, even after typing", async () => {
    const el = await fixture<LoomiAutocomplete>(
      html`<loomi-autocomplete .data=${DATA}></loomi-autocomplete>`,
    );
    const { formValue, elsewhere } = inForm(el, "city");
    const log = recordFormEvents(el);

    field(el).focus();
    await sendKeys({ type: "Ku" });
    await el.updateComplete;
    el.shadowRoot!.querySelector<HTMLElement>(".loomi-option")!.click();
    elsewhere.focus();
    await el.updateComplete;
    expect(log).to.deep.equal(["input:K", "input:Ku", "input:kum", "change:kum"]);
    expect(formValue()).to.equal("kum");
  });
});
