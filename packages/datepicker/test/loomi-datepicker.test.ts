import { html, fixture, expect, nextFrame } from "@open-wc/testing";
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

  describe("calendar keyboard (WAI-ARIA date grid)", () => {
    const openCalendar = async (): Promise<LoomiDatepicker> => {
      const el = await fixture<LoomiDatepicker>(
        html`<loomi-datepicker dp-style="inline" selected-value="2026-03-10"></loomi-datepicker>`,
      );
      await el.updateComplete;
      await nextFrame();
      return el;
    };

    const grid = (el: LoomiDatepicker): HTMLElement =>
      el.shadowRoot!.querySelector(".loomi-grid") as HTMLElement;

    const tabStop = (el: LoomiDatepicker): HTMLButtonElement | null =>
      el.shadowRoot!.querySelector('.loomi-day[tabindex="0"]');

    const press = async (el: LoomiDatepicker, key: string): Promise<KeyboardEvent> => {
      const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true });
      grid(el).dispatchEvent(event);
      await el.updateComplete;
      await nextFrame();
      return event;
    };

    it("uses grid semantics for the month", async () => {
      const el = await openCalendar();
      expect(grid(el).getAttribute("role")).to.equal("grid");
      expect(el.shadowRoot!.querySelectorAll('[role="columnheader"]')).to.have.lengthOf(7);
      expect(
        el.shadowRoot!.querySelectorAll('.loomi-day[role="gridcell"]').length,
      ).to.be.greaterThan(27);
    });

    it("exposes exactly one tab stop, on the selected day", async () => {
      const el = await openCalendar();
      expect(el.shadowRoot!.querySelectorAll('.loomi-day[tabindex="0"]')).to.have.lengthOf(1);
      expect(tabStop(el)!.textContent!.trim()).to.equal("10");
    });

    it("moves a day at a time with the left and right arrows", async () => {
      const el = await openCalendar();
      await press(el, "ArrowRight");
      expect(tabStop(el)!.textContent!.trim()).to.equal("11");

      await press(el, "ArrowLeft");
      await press(el, "ArrowLeft");
      expect(tabStop(el)!.textContent!.trim()).to.equal("9");
    });

    it("moves a week at a time with the up and down arrows", async () => {
      const el = await openCalendar();
      await press(el, "ArrowDown");
      expect(tabStop(el)!.textContent!.trim()).to.equal("17");

      await press(el, "ArrowUp");
      await press(el, "ArrowUp");
      expect(tabStop(el)!.textContent!.trim()).to.equal("3");
    });

    it("jumps to the ends of the week with Home and End", async () => {
      const el = await openCalendar();
      await press(el, "Home");
      const start = Number(tabStop(el)!.textContent!.trim());
      await press(el, "End");
      const end = Number(tabStop(el)!.textContent!.trim());
      expect(end - start, "Home and End bracket the same week").to.equal(6);
    });

    it("changes month with PageUp and PageDown", async () => {
      const el = await openCalendar();
      await press(el, "PageDown");
      expect(el.shadowRoot!.textContent).to.contain("April");

      await press(el, "PageUp");
      await press(el, "PageUp");
      expect(el.shadowRoot!.textContent).to.contain("February");
    });

    it("scrolls into the next month when arrowing off the end", async () => {
      const el = await fixture<LoomiDatepicker>(
        html`<loomi-datepicker dp-style="inline" selected-value="2026-03-31"></loomi-datepicker>`,
      );
      await el.updateComplete;
      await nextFrame();
      await press(el, "ArrowRight");
      expect(el.shadowRoot!.textContent).to.contain("April");
      expect(tabStop(el)!.textContent!.trim()).to.equal("1");
    });

    it("gives every day a full date as its accessible name", async () => {
      const el = await openCalendar();
      const label = tabStop(el)!.getAttribute("aria-label")!;
      // "10" alone is meaningless read out of context.
      expect(label).to.contain("10");
      expect(label.length).to.be.greaterThan(6);
    });

    it("marks the selected day with aria-selected", async () => {
      const el = await openCalendar();
      const selected = el.shadowRoot!.querySelectorAll('.loomi-day[aria-selected="true"]');
      expect(selected).to.have.lengthOf(1);
      expect(selected[0].textContent!.trim()).to.equal("10");
    });

    it("consumes the keys it handles", async () => {
      const el = await openCalendar();
      expect((await press(el, "ArrowRight")).defaultPrevented).to.be.true;
      expect((await press(el, "PageDown")).defaultPrevented).to.be.true;
    });
  });
});
