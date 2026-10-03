import { html, fixture, expect } from "@open-wc/testing";
import { recordFormEvents, inForm } from "../../../test/form-events.js";
import "../dist/loomi-datepicker.js";
import type { LoomiDateFormat, LoomiDatepicker } from "../dist/index.js";

// Native parity: see "Value and events contract" in packages/core/README.md.
describe("loomi-datepicker native parity", () => {
  it("setting an ISO value selects it, updates the form and fires nothing", async () => {
    const el = await fixture<LoomiDatepicker>(
      html`<loomi-datepicker dp-style="inline" format="dd/mm/yyyy"></loomi-datepicker>`,
    );
    const { formValue } = inForm(el, "day");
    const log = recordFormEvents(el);

    el.value = "2026-03-14";
    expect(el.value).to.equal("2026-03-14");
    expect(el.displayValue).to.equal("14/03/2026");
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".loomi-day.selected")!.textContent!.trim()).to.equal("14");
    expect(formValue()).to.equal("2026-03-14");
    expect(log).to.deep.equal([]);
  });

  // Like <input type="date">: `value` and the submitted form value are ISO whatever the
  // display format; only `displayValue` (and the field's text) follow `format`.
  const displayed: Record<LoomiDateFormat, string> = {
    "yyyy-mm-dd": "2026-12-05",
    "dd-mm-yyyy": "05-12-2026",
    "mm-dd-yyyy": "12-05-2026",
    "yyyy/mm/dd": "2026/12/05",
    "dd/mm/yyyy": "05/12/2026",
    "mm/dd/yyyy": "12/05/2026",
    "D d M, Y": "Sat 5 Dec, 2026",
  };
  for (const [format, display] of Object.entries(displayed) as [LoomiDateFormat, string][]) {
    it(`value is ISO with format="${format}"`, async () => {
      const el = await fixture<LoomiDatepicker>(
        html`<loomi-datepicker format=${format} locale="en-US"></loomi-datepicker>`,
      );
      const { formValue } = inForm(el, "day");

      el.value = "2026-12-05";
      await el.updateComplete;
      expect(el.value).to.equal("2026-12-05");
      expect(el.displayValue).to.equal(display);
      expect(formValue()).to.equal("2026-12-05");
      expect(el.shadowRoot!.querySelector(".loomi-text")!.textContent!.trim()).to.equal(display);

      el.range = true;
      el.value = "2026-12-05 - 2026-12-09";
      await el.updateComplete;
      expect(el.value).to.equal("2026-12-05 - 2026-12-09");
      expect(formValue()).to.equal("2026-12-05 - 2026-12-09");
    });
  }

  it("a value read back in the configured format round-trips", async () => {
    const el = await fixture<LoomiDatepicker>(
      html`<loomi-datepicker format="mm-dd-yyyy"></loomi-datepicker>`,
    );
    el.value = "12-25-2026";
    expect(el.value).to.equal("2026-12-25");
    el.value = el.displayValue;
    expect(el.value).to.equal("2026-12-25");
    const read = el.value;
    el.value = read;
    expect(el.value).to.equal("2026-12-25");
    el.value = "not a date";
    expect(el.value).to.equal("");
    expect(el.displayValue).to.equal("");
  });

  it("range: accepts 'start - end'", async () => {
    const el = await fixture<LoomiDatepicker>(html`<loomi-datepicker range></loomi-datepicker>`);
    el.value = "2026-01-02 - 2026-01-09";
    expect(el.value).to.equal("2026-01-02 - 2026-01-09");
  });

  it("a user pick fires input then change, with the ISO value already updated", async () => {
    const el = await fixture<LoomiDatepicker>(
      html`<loomi-datepicker
        dp-style="inline"
        format="dd/mm/yyyy"
        selected-value="2026-03-01"
      ></loomi-datepicker>`,
    );
    const log = recordFormEvents(el);
    let detail: unknown;
    el.addEventListener("change", (e) => (detail = (e as CustomEvent).detail));
    el.shadowRoot!.querySelector<HTMLButtonElement>('.loomi-day[data-day="20"]')!.click();
    expect(log).to.deep.equal(["input:2026-03-20", "change:2026-03-20"]);
    expect(detail).to.deep.equal({ value: "2026-03-20", dates: ["2026-03-20"] });
  });
});
