import { html, fixture, expect } from "@open-wc/testing";
import "../dist/loomi-chart.js";
import type { LoomiChart, LoomiChartPoint } from "../dist/index.js";

const series: LoomiChartPoint[] = [
  { label: "Jan", value: 30 },
  { label: "Feb", value: 55 },
  { label: "Mar", value: 42 },
  { label: "Apr", value: 60 },
];

describe("loomi-chart", () => {
  it("renders the line stroke in the chosen color once data is set", async () => {
    const el = await fixture<LoomiChart>(html`<loomi-chart type="line" color="violet"></loomi-chart>`);
    el.data = series;
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector(".loomi-line")).to.exist;
    const style = el.shadowRoot!.querySelector(".loomi-chart")!.getAttribute("style") || "";
    expect(style).to.include("--_loomi-accent:var(--loomi-violet-600");
  });

  it("fills bars with the chart's color by default, not the rainbow palette", async () => {
    const el = await fixture<LoomiChart>(html`<loomi-chart type="bar" color="green"></loomi-chart>`);
    el.data = series;
    await el.updateComplete;

    const fills = [...el.shadowRoot!.querySelectorAll(".loomi-chart svg path")].map((p) => p.getAttribute("fill"));
    expect(fills).to.have.length(4);
    expect(fills.every((f) => f === fills[0])).to.be.true;
    expect(fills[0]).to.include("--loomi-green-500");
  });

  it("still cycles the built-in palette for pie/donut without per-point colors", async () => {
    const el = await fixture<LoomiChart>(html`<loomi-chart type="pie"></loomi-chart>`);
    el.data = series;
    await el.updateComplete;

    const fills = [...el.shadowRoot!.querySelectorAll(".loomi-chart svg path")].map((p) => p.getAttribute("fill"));
    expect(new Set(fills).size).to.equal(4);
  });

  it("renders the legend with one key per data point", async () => {
    const el = await fixture<LoomiChart>(html`<loomi-chart type="bar" show-legend></loomi-chart>`);
    el.data = series;
    await el.updateComplete;

    const keys = el.shadowRoot!.querySelectorAll(".loomi-key");
    expect(keys).to.have.length(4);
    expect(keys[0].textContent).to.include("Jan");
  });

  it("rounds only the top corners of bars", async () => {
    const el = await fixture<LoomiChart>(html`<loomi-chart type="bar"></loomi-chart>`);
    el.data = series;
    await el.updateComplete;

    const d = el.shadowRoot!.querySelector(".loomi-chart svg path")!.getAttribute("d") || "";
    expect(d).to.match(/^M[\d.]+,[\d.]+ H[\d.]+ A/);
    expect(d).to.match(/V[\d.]+ H[\d.]+ V/);
  });

  it("draws a higher-shade border only in shade=\"light\", and only when show-border is on", async () => {
    const dark = await fixture<LoomiChart>(html`<loomi-chart type="bar" color="orange"></loomi-chart>`);
    dark.data = series;
    await dark.updateComplete;
    expect(dark.shadowRoot!.querySelector(".loomi-chart svg path")!.getAttribute("stroke-width")).to.equal("0");

    const light = await fixture<LoomiChart>(html`<loomi-chart type="bar" color="orange" shade="light"></loomi-chart>`);
    light.data = series;
    await light.updateComplete;
    const lightPath = light.shadowRoot!.querySelector(".loomi-chart svg path")!;
    expect(lightPath.getAttribute("stroke-width")).to.equal("1.5");
    expect(lightPath.getAttribute("stroke")).to.include("--loomi-orange-600");

    const noBorder = await fixture<LoomiChart>(
      html`<loomi-chart type="bar" color="orange" shade="light" show-border="false"></loomi-chart>`,
    );
    noBorder.data = series;
    await noBorder.updateComplete;
    expect(noBorder.shadowRoot!.querySelector(".loomi-chart svg path")!.getAttribute("stroke-width")).to.equal("0");
  });

  it("shows a y-axis with min/max labels when show-y-axis is set", async () => {
    const el = await fixture<LoomiChart>(html`<loomi-chart type="bar" show-y-axis></loomi-chart>`);
    el.data = series;
    await el.updateComplete;

    const labels = [...el.shadowRoot!.querySelectorAll(".loomi-ylabel")].map((l) => l.textContent);
    expect(labels).to.deep.equal(["60", "0"]);
  });

  it("flips the axes for a vertical line chart", async () => {
    const el = await fixture<LoomiChart>(html`<loomi-chart type="line" vertical></loomi-chart>`);
    el.data = series;
    await el.updateComplete;

    const axis = el.shadowRoot!.querySelector(".loomi-axis")!;
    expect(axis.getAttribute("x1")).to.equal(axis.getAttribute("x2"));
    expect(axis.getAttribute("y1")).to.not.equal(axis.getAttribute("y2"));
  });

  it("renders a radar polygon with one vertex per data point", async () => {
    const el = await fixture<LoomiChart>(html`<loomi-chart type="radar" color="purple"></loomi-chart>`);
    el.data = series;
    await el.updateComplete;

    const area = el.shadowRoot!.querySelector(".loomi-radar-area");
    expect(area).to.exist;
    expect(area!.getAttribute("points")!.trim().split(" ")).to.have.length(4);
  });

  it("renders a scatter marker per data point with no connecting line", async () => {
    const el = await fixture<LoomiChart>(html`<loomi-chart type="scatter" color="cyan"></loomi-chart>`);
    el.data = series;
    await el.updateComplete;

    expect(el.shadowRoot!.querySelectorAll(".loomi-chart svg circle")).to.have.length(4);
    expect(el.shadowRoot!.querySelector("polyline")).to.not.exist;
  });
});
