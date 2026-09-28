import { html, fixture, expect } from "@open-wc/testing";
import { recordFormEvents, inForm } from "../../../test/form-events.js";
import "../dist/loomi-datepicker.js";
import type { LoomiDatepicker } from "../dist/index.js";

// Native parity: see "Value and events contract" in packages/core/README.md.
describe("loomi-datepicker native parity", () => {
  it("setting an ISO value selects it, updates the form and fires nothing", async () => {
    const el = await fixture<LoomiDatepicker>(
      html`<loomi-datepicker dp-style="inline" format="dd/mm/yyyy"></loomi-datepicker>`,
    );
    const { formValue } = inForm(el, "day");
    const log = recordFormEvents(el);

    el.value = "2026-03-14";
    expect(el.value).to.equal("14/03/2026");
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".loomi-day.selected")!.textContent!.trim()).to.equal("14");
    expect(formValue()).to.equal("14/03/2026");
    expect(log).to.deep.equal([]);
  });

  it("a value read back in the configured format round-trips", async () => {
    const el = await fixture<LoomiDatepicker>(
      html`<loomi-datepicker format="mm-dd-yyyy"></loomi-datepicker>`,
    );
    el.value = "12-25-2026";
    expect(el.value).to.equal("12-25-2026");
    el.value = "not a date";
    expect(el.value).to.equal("");
  });

  it("range: accepts 'start - end'", async () => {
    const el = await fixture<LoomiDatepicker>(html`<loomi-datepicker range></loomi-datepicker>`);
    el.value = "2026-01-02 - 2026-01-09";
    expect(el.value).to.equal("2026-01-02 - 2026-01-09");
  });

  it("a user pick fires input then change, with value already updated", async () => {
    const el = await fixture<LoomiDatepicker>(
      html`<loomi-datepicker dp-style="inline" selected-value="2026-03-01"></loomi-datepicker>`,
    );
    const log = recordFormEvents(el);
    el.shadowRoot!.querySelector<HTMLButtonElement>('.loomi-day[data-day="20"]')!.click();
    expect(log).to.deep.equal(["input:2026-03-20", "change:2026-03-20"]);
  });
});
