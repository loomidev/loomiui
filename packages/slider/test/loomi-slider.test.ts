import { html, fixture, expect } from "@open-wc/testing";
import "../dist/loomi-slider.js";
import type { LoomiSlider } from "../dist/index.js";

const inputs = (el: LoomiSlider): HTMLInputElement[] =>
  Array.from(el.shadowRoot!.querySelectorAll<HTMLInputElement>("input[type='range']"));

const valueTooltips = (el: LoomiSlider): HTMLElement[] =>
  Array.from(el.shadowRoot!.querySelectorAll<HTMLElement>(".loomi-value-tooltip"));

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

  it("shows the selected value in a tooltip aligned with the handle", async () => {
    const el = await fixture<LoomiSlider>(
      html`<loomi-slider min="0" max="100" selected="25"></loomi-slider>`,
    );
    const [input] = inputs(el);
    let [tooltip] = valueTooltips(el);

    expect(tooltip.textContent?.trim()).to.equal("25");
    expect(tooltip.style.getPropertyValue("--loomi-value-position").trim()).to.equal("25%");

    input.value = "60";
    input.dispatchEvent(new InputEvent("input", { bubbles: true, composed: true }));
    await el.updateComplete;
    [tooltip] = valueTooltips(el);

    expect(tooltip.textContent?.trim()).to.equal("60");
    expect(tooltip.style.getPropertyValue("--loomi-value-position").trim()).to.equal("60%");
  });

  it("shows each range handle value in its own tooltip", async () => {
    const el = await fixture<LoomiSlider>(
      html`<loomi-slider range selected="20" selected-end="80"></loomi-slider>`,
    );
    const tooltips = valueTooltips(el);

    expect(tooltips).to.have.lengthOf(2);
    expect(tooltips.map((tooltip) => tooltip.textContent?.trim())).to.deep.equal(["20", "80"]);
    expect(
      tooltips.map((tooltip) =>
        tooltip.style.getPropertyValue("--loomi-value-position").trim(),
      ),
    ).to.deep.equal(["20%", "80%"]);
  });

  it("hides handle tooltips when show-values is false", async () => {
    const el = await fixture<LoomiSlider>(
      html`<loomi-slider selected="40" show-values="false"></loomi-slider>`,
    );

    expect(valueTooltips(el)).to.have.lengthOf(0);
  });

  it("animates the fill on a plain click but not while dragging", async () => {
    const el = await fixture<LoomiSlider>(html`<loomi-slider selected="20"></loomi-slider>`);
    await new Promise((resolve) => setTimeout(resolve, 650)); // let the entrance animation settle
    const [input] = inputs(el);
    const track = el.shadowRoot!.querySelector(".loomi-track") as HTMLElement;

    // A plain click fires `input` with no preceding `pointermove`.
    input.value = "50";
    input.dispatchEvent(new InputEvent("input", { bubbles: true, composed: true }));
    await el.updateComplete;
    expect(track.classList.contains("animated-fill")).to.be.true;

    await new Promise((resolve) => setTimeout(resolve, 650));
    expect(track.classList.contains("animated-fill")).to.be.false;

    // A drag fires `pointermove` before the resulting `input` event.
    input.dispatchEvent(new PointerEvent("pointerdown"));
    input.dispatchEvent(new PointerEvent("pointermove"));
    input.value = "70";
    input.dispatchEvent(new InputEvent("input", { bubbles: true, composed: true }));
    await el.updateComplete;
    expect(track.classList.contains("animated-fill")).to.be.false;
  });
});
