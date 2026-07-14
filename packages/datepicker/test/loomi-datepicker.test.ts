import { html, fixture, expect } from "@open-wc/testing";
import "../dist/loomi-datepicker.js";
import type { LoomiDatepicker } from "../dist/index.js";

const buttonNamed = (el: LoomiDatepicker, text: string): HTMLButtonElement => {
  const buttons = Array.from(el.shadowRoot!.querySelectorAll<HTMLButtonElement>("button"));
  const button = buttons.find((item) => item.textContent?.trim() === text);
  expect(button, `Expected button named ${text}`).to.exist;
  return button!;
};

const buttonLabelled = (el: LoomiDatepicker, label: string): HTMLButtonElement => {
  const button = el.shadowRoot!.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`);
  expect(button, `Expected button labelled ${label}`).to.exist;
  return button!;
};

describe("loomi-datepicker", () => {
  it("keeps a formatted date range on one line", async () => {
    const el = await fixture<LoomiDatepicker>(html`
      <loomi-datepicker
        range
        format="D d M, Y"
        selected-value="2024-05-12 - 2024-06-12"
        style="width: 17rem"
      ></loomi-datepicker>
    `);

    const text = el.shadowRoot!.querySelector<HTMLElement>(".loomi-text")!;
    const styles = getComputedStyle(text);

    expect(styles.whiteSpace).to.equal("nowrap");
    expect(styles.textOverflow).to.equal("ellipsis");
    expect(el.shadowRoot!.querySelector<HTMLElement>(".loomi-field")!.scrollHeight).to.equal(
      el.shadowRoot!.querySelector<HTMLElement>(".loomi-field")!.clientHeight,
    );
  });

  it("switches between month and year grids from the header", async () => {
    const el = await fixture<LoomiDatepicker>(
      html`<loomi-datepicker selected-value="2026-06-22"></loomi-datepicker>`,
    );

    el.shadowRoot!.querySelector<HTMLElement>(".loomi-field")!.click();
    await el.updateComplete;

    buttonNamed(el, "June").click();
    await el.updateComplete;

    const monthGrid = el.shadowRoot!.querySelector<HTMLElement>(".loomi-picker-grid.months")!;
    expect(monthGrid).to.exist;
    expect(monthGrid.querySelectorAll(".loomi-picker-cell")).to.have.lengthOf(12);
    expect(getComputedStyle(monthGrid).gridTemplateColumns.split(" ")).to.have.lengthOf(3);
    expect(el.shadowRoot!.querySelector(".loomi-head")!.textContent!.trim()).to.equal("2026");

    buttonLabelled(el, "September 2026").click();
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector(".loomi-grid")).to.exist;
    expect(el.shadowRoot!.querySelector(".loomi-head")!.textContent).to.include("September");
    expect(el.shadowRoot!.querySelector(".loomi-head")!.textContent).to.include("2026");

    buttonNamed(el, "2026").click();
    await el.updateComplete;

    const yearGrid = el.shadowRoot!.querySelector<HTMLElement>(".loomi-picker-grid.years")!;
    expect(yearGrid).to.exist;
    expect(yearGrid.querySelectorAll(".loomi-picker-cell")).to.have.lengthOf(12);
    expect(getComputedStyle(yearGrid).gridTemplateColumns.split(" ")).to.have.lengthOf(4);
    expect(el.shadowRoot!.querySelector(".loomi-head")!.textContent).to.include("2016 - 2027");

    buttonLabelled(el, "Next 12 years").click();
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector(".loomi-head")!.textContent).to.include("2028 - 2039");

    buttonLabelled(el, "Previous 12 years").click();
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector(".loomi-head")!.textContent).to.include("2016 - 2027");

    buttonNamed(el, "2024").click();
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector(".loomi-grid")).to.exist;
    expect(el.shadowRoot!.querySelector(".loomi-head")!.textContent).to.include("September");
    expect(el.shadowRoot!.querySelector(".loomi-head")!.textContent).to.include("2024");
  });

  it("renders the calendar inline without a triggering field when dp-style is inline", async () => {
    const el = await fixture<LoomiDatepicker>(
      html`<loomi-datepicker dp-style="inline" selected-value="2026-06-22"></loomi-datepicker>`,
    );

    expect(el.shadowRoot!.querySelector(".loomi-field")).to.not.exist;
    expect(el.shadowRoot!.querySelector(".loomi-cal.inline")).to.exist;
    expect(el.shadowRoot!.querySelector(".loomi-grid")).to.exist;

    const selectedDay = el.shadowRoot!.querySelector<HTMLButtonElement>(".loomi-day.selected")!;
    expect(selectedDay.textContent?.trim()).to.equal("22");

    const day23 = Array.from(el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".loomi-day")).find(
      (button) => button.textContent?.trim() === "23",
    )!;
    day23.click();
    await el.updateComplete;

    expect(el.value).to.equal("2026-06-23");
    expect(el.shadowRoot!.querySelector(".loomi-cal.inline")).to.exist;
  });
});
