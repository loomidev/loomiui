import { html, fixture, expect } from "@open-wc/testing";
import "../dist/loomi-colorpicker.js";
import type { LoomiColorpicker } from "../dist/index.js";

const COLORS = "#ff0000,#00ff00,#0000ff,#ffff00,#ff00ff";

describe("loomi-colorpicker", () => {
  it("opens on Enter and sets aria-activedescendant to the selected chip", async () => {
    const el = await fixture<LoomiColorpicker>(
      html`<loomi-colorpicker colors=${COLORS} selected-value="#00ff00"></loomi-colorpicker>`,
    );
    const trigger = el.shadowRoot!.querySelector(".loomi-swatch") as HTMLButtonElement;
    trigger.focus();
    trigger.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }),
    );
    await el.updateComplete;

    expect(trigger.getAttribute("aria-expanded")).to.equal("true");
    expect(trigger.getAttribute("aria-activedescendant")).to.equal("loomi-color-1");
  });

  it("ArrowRight/ArrowDown move aria-activedescendant across the 4-column grid", async () => {
    const el = await fixture<LoomiColorpicker>(
      html`<loomi-colorpicker colors=${COLORS}></loomi-colorpicker>`,
    );
    const trigger = el.shadowRoot!.querySelector(".loomi-swatch") as HTMLButtonElement;
    trigger.click();
    await el.updateComplete;

    trigger.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true }),
    );
    await el.updateComplete;
    expect(trigger.getAttribute("aria-activedescendant")).to.equal("loomi-color-1");
    expect(el.shadowRoot!.querySelectorAll(".loomi-chip.active")).to.have.lengthOf(1);

    // 5 colors in a 4-column grid: index 1 + 4 would overflow, so it clamps to the last chip (4).
    trigger.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }),
    );
    await el.updateComplete;
    expect(trigger.getAttribute("aria-activedescendant")).to.equal("loomi-color-4");
  });

  it("Enter chooses the highlighted chip and closes the panel", async () => {
    const el = await fixture<LoomiColorpicker>(
      html`<loomi-colorpicker colors=${COLORS}></loomi-colorpicker>`,
    );
    const trigger = el.shadowRoot!.querySelector(".loomi-swatch") as HTMLButtonElement;
    trigger.click();
    await el.updateComplete;

    trigger.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true }),
    );
    await el.updateComplete;
    trigger.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }),
    );
    await el.updateComplete;

    expect(trigger.getAttribute("aria-expanded")).to.equal("false");
    expect(el.selectedValue.toLowerCase()).to.equal("#00ff00");
  });

  it("Escape closes the panel without changing the selection", async () => {
    const el = await fixture<LoomiColorpicker>(
      html`<loomi-colorpicker colors=${COLORS} selected-value="#ff0000"></loomi-colorpicker>`,
    );
    const trigger = el.shadowRoot!.querySelector(".loomi-swatch") as HTMLButtonElement;
    trigger.click();
    await el.updateComplete;

    trigger.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }),
    );
    await el.updateComplete;

    expect(trigger.getAttribute("aria-expanded")).to.equal("false");
    expect(el.selectedValue.toLowerCase()).to.equal("#ff0000");
  });
});
