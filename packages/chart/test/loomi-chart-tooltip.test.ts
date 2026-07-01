import { html, fixture, expect } from "@open-wc/testing";
import "../dist/loomi-chart.js";
import type { LoomiChart, LoomiChartPoint } from "../dist/index.js";

const series: LoomiChartPoint[] = [
  { label: "Jan", value: 30 },
  { label: "Feb", value: 55 },
  { label: "Mar", value: 42 },
  { label: "Apr", value: 60 },
];

describe("loomi-chart tooltips", () => {
  it("shows point tooltips for polar charts when show-tooltip is set", async () => {
    const el = await fixture<LoomiChart>(html`<loomi-chart type="pie" show-tooltip></loomi-chart>`);
    el.data = series;
    await el.updateComplete;

    const tips = el.shadowRoot!.querySelectorAll("loomi-tooltip.loomi-hit");
    expect(tips).to.have.length(4);
    const tipContent = tips[0].querySelector(".loomi-chart-tip");
    expect(tipContent!.textContent).to.include("Jan");
    expect(tipContent!.textContent).to.include("30");
  });

  it("tracks the nearest cartesian point while moving across the chart", async () => {
    const el = await fixture<LoomiChart>(html`<loomi-chart type="line" show-tooltip></loomi-chart>`);
    el.data = series;
    await el.updateComplete;

    const canvas = el.shadowRoot!.querySelector(".loomi-canvas") as HTMLElement;
    expect(canvas.classList.contains("is-interactive")).to.be.true;

    Object.defineProperty(canvas, "getBoundingClientRect", {
      configurable: true,
      value: () => ({ left: 0, top: 0, width: 320, height: 180, right: 320, bottom: 180 }),
    });

    canvas.dispatchEvent(new PointerEvent("pointermove", { clientX: 200, clientY: 80, bubbles: true }));
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector(".loomi-floating-tip")).to.exist;
    expect(el.shadowRoot!.querySelector(".loomi-dot.is-active")).to.exist;

    canvas.dispatchEvent(new PointerEvent("pointerleave", { bubbles: true }));
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".loomi-floating-tip")).to.not.exist;
  });
});
