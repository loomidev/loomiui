import { html, fixture, expect } from "@open-wc/testing";
import "../dist/loomi-timepicker.js";
import type { LoomiTimepicker } from "../dist/index.js";

const openField = async (el: LoomiTimepicker): Promise<void> => {
  el.shadowRoot!.querySelector<HTMLElement>(".loomi-field")!.click();
  await el.updateComplete;
};

describe("loomi-timepicker", () => {
  afterEach(() => {
    document.body.querySelectorAll(".loomi-clock-modal").forEach((el) => el.remove());
  });

  it("renders the clock icon after the value text, matching the datepicker", async () => {
    const el = await fixture<LoomiTimepicker>(html`<loomi-timepicker></loomi-timepicker>`);
    const children = Array.from(el.shadowRoot!.querySelector(".loomi-field")!.children);

    const textIndex = children.findIndex((child) => child.classList.contains("loomi-text"));
    const svgIndex = children.findIndex((child) => child.tagName.toLowerCase() === "svg");

    expect(textIndex).to.be.greaterThan(-1);
    expect(svgIndex).to.be.greaterThan(textIndex);
  });

  it("opens a modal instead of a dropdown panel when tp-style is clock", async () => {
    const el = await fixture<LoomiTimepicker>(
      html`<loomi-timepicker tp-style="clock"></loomi-timepicker>`,
    );
    await openField(el);

    expect(el.shadowRoot!.querySelector(".loomi-panel")).to.not.exist;
    const modal = document.body.querySelector(".loomi-clock-modal") as
      (HTMLElement & { open: boolean }) | null;
    expect(modal).to.exist;
    expect(modal!.open).to.be.true;
  });

  it("still opens the dropdown panel for the popup style", async () => {
    const el = await fixture<LoomiTimepicker>(html`<loomi-timepicker></loomi-timepicker>`);
    await openField(el);

    expect(el.shadowRoot!.querySelector(".loomi-panel")).to.exist;
    const modal = document.body.querySelector(".loomi-clock-modal") as
      (HTMLElement & { open: boolean }) | null;
    expect(modal).to.not.exist;
  });

  it("commits a value after picking an hour then a minute from the clock", async () => {
    const el = await fixture<LoomiTimepicker>(
      html`<loomi-timepicker tp-style="clock" format="24"></loomi-timepicker>`,
    );
    await openField(el);

    const modal = document.body.querySelector(".loomi-clock-modal")!;
    const hourButton = Array.from(
      modal.querySelectorAll<HTMLButtonElement>(".loomi-clock-hour"),
    ).find((button) => button.textContent?.trim() === "09")!;
    hourButton.click();
    await el.updateComplete;

    const minuteButton = Array.from(
      modal.querySelectorAll<HTMLButtonElement>(".loomi-clock-minute"),
    ).find((button) => button.textContent?.trim() === "30")!;
    minuteButton.click();
    await el.updateComplete;

    expect(el.value).to.equal("09:30");
  });

  it("selects the nearest minute from a click on the minute ring background", async () => {
    const el = await fixture<LoomiTimepicker>(
      html`<loomi-timepicker tp-style="clock" format="24"></loomi-timepicker>`,
    );
    await openField(el);

    const modal = document.body.querySelector(".loomi-clock-modal")!;
    const ring = modal.querySelector<HTMLElement>(".loomi-clock-ring.minutes")!;
    const rect = ring.getBoundingClientRect();

    // Directly right of center is 90° clockwise from the top mark, i.e. minute 15.
    ring.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        clientX: rect.right - 2,
        clientY: rect.top + rect.height / 2,
      }),
    );
    await el.updateComplete;

    expect(el.value).to.include(":15");
  });

  it("toggles 12h/24h format from the clock's center button and keeps the same time", async () => {
    const el = await fixture<LoomiTimepicker>(
      html`<loomi-timepicker tp-style="clock" selected-value="3:25PM"></loomi-timepicker>`,
    );
    await openField(el);

    const modal = document.body.querySelector(".loomi-clock-modal")!;
    const center = modal.querySelector<HTMLButtonElement>(".loomi-clock-center")!;
    expect(center.textContent?.trim()).to.equal("12H");

    center.click();
    await el.updateComplete;

    expect(el.value).to.equal("15:25");
    expect(center.textContent?.trim()).to.equal("24H");
  });
});
