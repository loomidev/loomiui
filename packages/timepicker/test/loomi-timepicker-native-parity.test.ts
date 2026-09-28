import { html, fixture, expect } from "@open-wc/testing";
import { recordFormEvents, inForm } from "../../../test/form-events.js";
import "../dist/loomi-timepicker.js";
import type { LoomiTimepicker } from "../dist/index.js";

// Native parity: see "Value and events contract" in packages/core/README.md.
describe("loomi-timepicker native parity", () => {
  const selects = (el: LoomiTimepicker) =>
    Array.from(el.shadowRoot!.querySelectorAll("select")) as HTMLSelectElement[];

  it("setting value updates the picker and form value without firing events", async () => {
    const el = await fixture<LoomiTimepicker>(
      html`<loomi-timepicker tp-style="inline"></loomi-timepicker>`,
    );
    const { formValue } = inForm(el, "at");
    const log = recordFormEvents(el);

    el.value = "3:05PM";
    expect(el.value).to.equal("3:05PM");
    await el.updateComplete;
    expect(selects(el).map((s) => s.value)).to.deep.equal(["3", "5", "PM"]);
    expect(formValue()).to.equal("3:05PM");
    expect(log).to.deep.equal([]);
  });

  it("converts between 12- and 24-hour input", async () => {
    const twelve = await fixture<LoomiTimepicker>(html`<loomi-timepicker></loomi-timepicker>`);
    twelve.value = "15:30";
    expect(twelve.value).to.equal("3:30PM");
    const day = await fixture<LoomiTimepicker>(
      html`<loomi-timepicker format="24"></loomi-timepicker>`,
    );
    day.value = "12:15AM";
    expect(day.value).to.equal("00:15");
    day.value = "nonsense";
    expect(day.value).to.equal("");
  });

  it("re-reads selected-value when it changes after the first render", async () => {
    const el = await fixture<LoomiTimepicker>(
      html`<loomi-timepicker selected-value="9:00AM"></loomi-timepicker>`,
    );
    el.setAttribute("selected-value", "10:45AM");
    await el.updateComplete;
    expect(el.value).to.equal("10:45AM");
  });

  it("a user pick fires input then change once, and a partial pick fires nothing", async () => {
    const el = await fixture<LoomiTimepicker>(
      html`<loomi-timepicker tp-style="inline" format="24"></loomi-timepicker>`,
    );
    const log = recordFormEvents(el);
    const [hour, minute] = selects(el);

    hour.value = "14";
    hour.dispatchEvent(new Event("change"));
    expect(log).to.deep.equal([]);

    minute.value = "30";
    minute.dispatchEvent(new Event("change"));
    expect(log).to.deep.equal(["input:14:30", "change:14:30"]);
  });
});
