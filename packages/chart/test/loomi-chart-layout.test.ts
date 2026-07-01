import { html, fixture, expect } from "@open-wc/testing";
import "../dist/loomi-chart.js";
import type { LoomiChart, LoomiChartPoint } from "../dist/index.js";

const series: LoomiChartPoint[] = [
  { label: "Jan", value: 30 },
  { label: "Feb", value: 55 },
  { label: "Mar", value: 42 },
  { label: "Apr", value: 60 },
];

describe("loomi-chart layout", () => {
  it("shows a y-axis with min and max labels", async () => {
    const el = await fixture<LoomiChart>(html`<loomi-chart type="bar" show-y-axis></loomi-chart>`);
    el.data = series;
    await el.updateComplete;
    const labels = [...el.shadowRoot!.querySelectorAll(".loomi-ylabel")].map((l) => l.textContent);
    expect(labels).to.deep.equal(["60", "0"]);
  });

  it("places the legend after the canvas by default", async () => {
    const el = await fixture<LoomiChart>(html`<loomi-chart type="bar" show-legend></loomi-chart>`);
    el.data = series;
    await el.updateComplete;
    const children = [...el.shadowRoot!.querySelector(".loomi-chart")!.children];
    expect(children.findIndex((c) => c.classList.contains("loomi-canvas"))).to.be.lessThan(
      children.findIndex((c) => c.classList.contains("loomi-legend")),
    );
  });

  it("draws light-mode bar borders when enabled", async () => {
    const el = await fixture<LoomiChart>(html`<loomi-chart type="bar" color="orange" shade="light"></loomi-chart>`);
    el.data = series;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".loomi-bar-border")).to.exist;
  });
});
