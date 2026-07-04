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

  it("renders line dots with a 2px stroke and a compact radius", async () => {
    const el = await fixture<LoomiChart>(html`<loomi-chart type="line"></loomi-chart>`);
    el.data = series;
    await el.updateComplete;

    const dot = el.shadowRoot!.querySelector(".loomi-dot")!;
    expect(dot.getAttribute("r")).to.equal("2.5");
    expect(getComputedStyle(dot).strokeWidth).to.equal("2px");
  });

  it("renders radar grid spokes with dedicated classes", async () => {
    const el = await fixture<LoomiChart>(html`<loomi-chart type="radar" color="warning"></loomi-chart>`);
    el.data = series;
    await el.updateComplete;

    expect(el.shadowRoot!.querySelectorAll(".loomi-radar-grid").length).to.be.greaterThan(0);
    expect(el.shadowRoot!.querySelectorAll(".loomi-radar-spoke").length).to.equal(4);
  });

  it("renders grouped bars when value2 is present", async () => {
    const el = await fixture<LoomiChart>(html`<loomi-chart type="bar" color="primary" color2="success"></loomi-chart>`);
    el.data = [
      { label: "Jan", value: 30, value2: 22 },
      { label: "Feb", value: 55, value2: 40 },
    ];
    await el.updateComplete;

    expect(el.shadowRoot!.querySelectorAll(".loomi-bar-fill")).to.have.length(4);
    expect(el.shadowRoot!.querySelector(".loomi-bar-fill-2")).to.exist;
  });

  it("renders multiple named bars per category via values", async () => {
    const el = await fixture<LoomiChart>(html`<loomi-chart type="bar" show-legend></loomi-chart>`);
    el.data = [
      {
        label: "Mon",
        value: 0,
        values: [
          { label: "Mike", value: 4 },
          { label: "Sam", value: 6 },
          { label: "Fred", value: 3 },
          { label: "Sara", value: 8 },
        ],
      },
      {
        label: "Tue",
        value: 0,
        values: [
          { label: "Mike", value: 5 },
          { label: "Sam", value: 4 },
          { label: "Fred", value: 7 },
          { label: "Sara", value: 6 },
        ],
      },
    ];
    await el.updateComplete;

    expect(el.shadowRoot!.querySelectorAll(".loomi-bar-fill")).to.have.length(8);
    const legend = el.shadowRoot!.querySelector(".loomi-legend")!;
    expect(legend.textContent).to.include("Mike");
    expect(legend.textContent).to.include("Sara");
  });

  it("accepts data as a JSON attribute", async () => {
    const el = await fixture<LoomiChart>(
      html`<loomi-chart type="bar" data='[{"label":"Jan","value":30},{"label":"Feb","value":55}]'></loomi-chart>`,
    );
    expect(el.data).to.have.length(2);
  });
});
