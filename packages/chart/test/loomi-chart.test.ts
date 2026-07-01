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
  });

  it("fills bars with the chart color by default", async () => {
    const el = await fixture<LoomiChart>(html`<loomi-chart type="bar" color="green"></loomi-chart>`);
    el.data = series;
    await el.updateComplete;
    const fills = [...el.shadowRoot!.querySelectorAll(".loomi-bar-fill")].map((p) => p.getAttribute("fill"));
    expect(fills.every((f) => f === fills[0])).to.be.true;
  });

  it("cycles the palette for pie charts", async () => {
    const el = await fixture<LoomiChart>(html`<loomi-chart type="pie"></loomi-chart>`);
    el.data = series;
    await el.updateComplete;
    const fills = [...el.shadowRoot!.querySelectorAll(".loomi-slice")].map((p) => p.getAttribute("fill"));
    expect(new Set(fills).size).to.equal(4);
  });

  it("renders area charts with gradient fill and no dots", async () => {
    const el = await fixture<LoomiChart>(html`<loomi-chart type="area" color="primary"></loomi-chart>`);
    el.data = series;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".loomi-area")).to.exist;
    expect(el.shadowRoot!.querySelector(".loomi-dot")).to.not.exist;
  });

  it("renders radial segments and a center total", async () => {
    const el = await fixture<LoomiChart>(html`<loomi-chart type="radial"></loomi-chart>`);
    el.data = series;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelectorAll(".loomi-radial-seg")).to.have.length(4);
    expect(el.shadowRoot!.querySelector(".loomi-radial-total")!.textContent).to.equal("187");
  });

  it("renders horizontal grid lines by default", async () => {
    const el = await fixture<LoomiChart>(html`<loomi-chart type="bar"></loomi-chart>`);
    el.data = series;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelectorAll(".loomi-grid-line").length).to.be.greaterThan(0);
  });

  it("accepts data as a JSON attribute", async () => {
    const el = await fixture<LoomiChart>(
      html`<loomi-chart type="bar" data='[{"label":"Jan","value":30},{"label":"Feb","value":55}]'></loomi-chart>`,
    );
    expect(el.data).to.have.length(2);
  });
});
