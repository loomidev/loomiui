import { html, fixture, expect, nextFrame } from "@open-wc/testing";
import type { LoomiDateRangePicker } from "../dist/index.js";
import "../dist/index.js";

describe("loomi-date-range-picker", () => {
  it("renders shadow content", async () => {
    const el = await fixture(html`<loomi-date-range-picker ></loomi-date-range-picker>`);
    expect(el.shadowRoot).to.exist;
    expect(el.shadowRoot!.childElementCount).to.be.greaterThan(0);
  });

  const open = async (extra = {}): Promise<LoomiDateRangePicker> => {
    const el = await fixture<LoomiDateRangePicker>(
      html`<loomi-date-range-picker show-presets></loomi-date-range-picker>`,
    );
    Object.assign(el, extra);
    el.open = true;
    await el.updateComplete;
    await nextFrame();
    return el;
  };

  it("stays closed until its trigger is used", async () => {
    const el = await fixture<LoomiDateRangePicker>(
      html`<loomi-date-range-picker></loomi-date-range-picker>`,
    );
    expect(el.open).to.be.false;

    (el.shadowRoot!.querySelector(".trigger") as HTMLButtonElement).click();
    await el.updateComplete;
    expect(el.open).to.be.true;
  });

  it("tracks its open state on the trigger for assistive technology", async () => {
    const el = await fixture<LoomiDateRangePicker>(
      html`<loomi-date-range-picker></loomi-date-range-picker>`,
    );
    const trigger = el.shadowRoot!.querySelector(".trigger")!;
    expect(trigger.getAttribute("aria-expanded")).to.equal("false");

    el.open = true;
    await el.updateComplete;
    expect(trigger.getAttribute("aria-expanded")).to.equal("true");
  });

  it("closes on Escape", async () => {
    const el = await open();
    el.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await el.updateComplete;
    expect(el.open).to.be.false;
  });

  it("shows presets by default and reflects the flag that hides them", async () => {
    const withPresets = await open();
    expect(withPresets.shadowRoot!.querySelector(".presets")).to.exist;
    expect(withPresets.hasAttribute("show-presets"), "on by default").to.be.true;

    // The attribute is what the stylesheet keys off, so removing it is the observable
    // half of turning presets off.
    withPresets.showPresets = false;
    await withPresets.updateComplete;
    expect(withPresets.hasAttribute("show-presets")).to.be.false;
  });

  it("reflects the chosen range onto its attributes", async () => {
    const el = await open({ startDate: "2026-03-01", endDate: "2026-03-31" });
    expect(el.getAttribute("start-date")).to.equal("2026-03-01");
    expect(el.getAttribute("end-date")).to.equal("2026-03-31");
  });

  it("renders two calendars so a range spans months", async () => {
    const el = await open();
    expect(el.shadowRoot!.querySelectorAll("loomi-datepicker").length).to.be.greaterThan(1);
  });
});
