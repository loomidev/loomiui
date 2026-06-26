import { html, fixture, expect } from "@open-wc/testing";
import "../dist/loomi-slider.js";
import type { LoomiSlider } from "../dist/index.js";

const inputs = (el: LoomiSlider): HTMLInputElement[] =>
  Array.from(el.shadowRoot!.querySelectorAll<HTMLInputElement>("input[type='range']"));

describe("loomi-slider", () => {
  it("submits a single selected value by default", async () => {
    const form = await fixture<HTMLFormElement>(
      html`<form><loomi-slider name="volume" selected="35"></loomi-slider></form>`,
    );

    expect(new FormData(form).get("volume")).to.equal("35");
  });

  it("supports dual-handle range selection", async () => {
    const form = await fixture<HTMLFormElement>(
      html`<form><loomi-slider name="budget" range selected="20" selected-end="80"></loomi-slider></form>`,
    );
    const el = form.querySelector<LoomiSlider>("loomi-slider")!;
    const [start, end] = inputs(el);

    expect(inputs(el)).to.have.lengthOf(2);
    expect(el.value).to.equal("20 - 80");
    expect(new FormData(form).get("budget")).to.equal("20 - 80");

    start.value = "30";
    start.dispatchEvent(new InputEvent("input", { bubbles: true, composed: true }));
    end.value = "70";
    end.dispatchEvent(new InputEvent("input", { bubbles: true, composed: true }));
    await el.updateComplete;

    expect(el.value).to.equal("30 - 70");
    expect(new FormData(form).get("budget")).to.equal("30 - 70");
  });

  it("orders reversed range defaults", async () => {
    const el = await fixture<LoomiSlider>(
      html`<loomi-slider range selected="90" selected-end="20"></loomi-slider>`,
    );

    expect(el.value).to.equal("20 - 90");
  });
});
