import { html, fixture, expect } from "@open-wc/testing";
import "../dist/loomi-chart.js";
import { nearestIndex, tooltipAnchor } from "../dist/chart-utils.js";
import type { LoomiChart, LoomiChartPoint } from "../dist/index.js";

const series: LoomiChartPoint[] = [
  { label: "Jan", value: 30 },
  { label: "Feb", value: 55 },
  { label: "Mar", value: 42 },
  { label: "Apr", value: 60 },
];

describe("loomi-chart tooltips", () => {
  it("shows point tooltips for polar charts by default", async () => {
    const el = await fixture<LoomiChart>(html`<loomi-chart type="pie"></loomi-chart>`);
    el.data = series;
    await el.updateComplete;

    const tips = el.shadowRoot!.querySelectorAll("loomi-tooltip.loomi-hit");
    expect(tips).to.have.length(4);
    const tipContent = tips[0].querySelector(".loomi-chart-tip");
    expect(tipContent!.textContent).to.include("Jan");
    expect(tipContent!.textContent).to.include("30");
  });

  it("hides tooltips when show-tooltip is false", async () => {
    const el = await fixture<LoomiChart>(
      html`<loomi-chart type="pie" show-tooltip="false"></loomi-chart>`,
    );
    el.data = series;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".loomi-hits")).to.not.exist;
  });

  it("tracks the nearest cartesian point while moving across the chart", async () => {
    const el = await fixture<LoomiChart>(html`<loomi-chart type="line"></loomi-chart>`);
    el.data = series;
    await el.updateComplete;

    const canvas = el.shadowRoot!.querySelector(".loomi-canvas") as HTMLElement;
    expect(canvas.classList.contains("is-interactive")).to.be.true;

    Object.defineProperty(canvas, "getBoundingClientRect", {
      configurable: true,
      value: () => ({ left: 0, top: 0, width: 320, height: 180, right: 320, bottom: 180 }),
    });

    canvas.dispatchEvent(
      new PointerEvent("pointermove", { clientX: 200, clientY: 80, bubbles: true }),
    );
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector(".loomi-floating-tip")).to.exist;
    expect(el.shadowRoot!.querySelector(".loomi-dot.is-active")).to.exist;

    canvas.dispatchEvent(new PointerEvent("pointerleave", { bubbles: true }));
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".loomi-floating-tip")).to.not.exist;
  });

  it("aligns bar tooltips to the hovered band center", async () => {
    const data: LoomiChartPoint[] = [
      { label: "Jan", value: 30, value2: 22 },
      { label: "Feb", value: 55, value2: 40 },
      { label: "Mar", value: 42, value2: 38 },
    ];
    const opts = { showYAxis: true, vertical: false };
    const layoutRatio = (index: number) => {
      const [x] = tooltipAnchor("bar", data, index, opts);
      return x / 320;
    };

    expect(nearestIndex("bar", data, opts, layoutRatio(1))).to.equal(1);

    const el = await fixture<LoomiChart>(
      html`<loomi-chart type="bar" color="primary" color2="success"></loomi-chart>`,
    );
    el.data = data;
    await el.updateComplete;

    const canvas = el.shadowRoot!.querySelector(".loomi-canvas") as HTMLElement;
    Object.defineProperty(canvas, "getBoundingClientRect", {
      configurable: true,
      value: () => ({ left: 0, top: 0, width: 320, height: 180, right: 320, bottom: 180 }),
    });

    canvas.dispatchEvent(
      new PointerEvent("pointermove", {
        clientX: 320 * layoutRatio(1),
        clientY: 40,
        bubbles: true,
      }),
    );
    await el.updateComplete;

    const tip = el.shadowRoot!.querySelector(".loomi-floating-tip") as HTMLElement;
    expect(tip).to.exist;
    expect(tip.textContent).to.include("Feb");
    const [anchorX] = tooltipAnchor("bar", data, 1, opts);
    expect(Number.parseFloat(tip.style.left)).to.be.closeTo((anchorX / 320) * 100, 0.5);
  });
});
