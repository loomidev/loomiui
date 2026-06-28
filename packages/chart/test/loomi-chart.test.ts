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
    expect(dark.shadowRoot!.querySelector(".loomi-bar-border")).to.not.exist;

    const light = await fixture<LoomiChart>(html`<loomi-chart type="bar" color="orange" shade="light"></loomi-chart>`);
    light.data = series;
    await light.updateComplete;
    expect(light.shadowRoot!.querySelector(".loomi-bar-fill")!.getAttribute("fill")).to.include("--loomi-orange-50");
    const border = light.shadowRoot!.querySelector(".loomi-bar-border")!;
    expect(border.getAttribute("stroke-width")).to.equal("1.5");
    expect(border.getAttribute("stroke")).to.include("--loomi-orange-200");

    const noBorder = await fixture<LoomiChart>(
      html`<loomi-chart type="bar" color="orange" shade="light" show-border="false"></loomi-chart>`,
    );
    noBorder.data = series;
    await noBorder.updateComplete;
    expect(noBorder.shadowRoot!.querySelector(".loomi-bar-border")).to.not.exist;
  });

  it("leaves the bottom edge of a bar's border open, unlike its (closed) fill", async () => {
    const el = await fixture<LoomiChart>(html`<loomi-chart type="bar" color="orange" shade="light"></loomi-chart>`);
    el.data = series;
    await el.updateComplete;

    const fillD = el.shadowRoot!.querySelector(".loomi-bar-fill")!.getAttribute("d") || "";
    expect(fillD).to.include("Z");

    const borderD = el.shadowRoot!.querySelector(".loomi-bar-border")!.getAttribute("d") || "";
    expect(borderD).to.not.include("Z");
    expect(borderD).to.match(/^M[\d.]+,[\d.]+ V[\d.]+ A/);
    expect(borderD).to.match(/V[\d.]+$/);
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

  it("accepts data as a JSON-encoded attribute, with no property assignment needed", async () => {
    const el = await fixture<LoomiChart>(
      html`<loomi-chart type="bar" color="green" data='[{"label":"Jan","value":30},{"label":"Feb","value":55}]'></loomi-chart>`,
    );

    expect(el.data).to.deep.equal([
      { label: "Jan", value: 30 },
      { label: "Feb", value: 55 },
    ]);
    expect(el.shadowRoot!.querySelectorAll(".loomi-chart svg path")).to.have.length(2);
  });

  it("falls back to an empty series instead of crashing on malformed JSON in the data attribute", async () => {
    const el = await fixture<LoomiChart>(html`<loomi-chart type="bar" data="not valid json"></loomi-chart>`);

    expect(el.data).to.deep.equal([]);
    expect(el.shadowRoot!.querySelector("svg")).to.exist;
  });

  it("shows a loomi-tooltip with the label and value on hover, for every data point, with no opt-in attribute", async () => {
    const el = await fixture<LoomiChart>(html`<loomi-chart type="bar"></loomi-chart>`);
    el.data = series;
    await el.updateComplete;

    const tips = el.shadowRoot!.querySelectorAll("loomi-tooltip.loomi-hit");
    expect(tips).to.have.length(4);
    expect(tips[0].getAttribute("content")).to.equal("Jan: 30");
    expect(tips[3].getAttribute("content")).to.equal("Apr: 60");
  });

  it("sizes a bar's hover target to the bar's own rect rather than a fixed point", async () => {
    const el = await fixture<LoomiChart>(html`<loomi-chart type="bar"></loomi-chart>`);
    el.data = series;
    await el.updateComplete;

    const tip = el.shadowRoot!.querySelector("loomi-tooltip.loomi-hit") as HTMLElement;
    expect(tip.classList.contains("loomi-hit-point")).to.be.false;
    expect(tip.style.left).to.not.equal("");
    expect(tip.style.width).to.not.equal("");
  });

  it("centers point-style hover targets (line/scatter/radar/pie) on the data point", async () => {
    for (const type of ["line", "scatter", "radar", "pie", "donut"] as const) {
      const el = await fixture<LoomiChart>(html`<loomi-chart .type=${type}></loomi-chart>`);
      el.data = series;
      await el.updateComplete;

      const tip = el.shadowRoot!.querySelector("loomi-tooltip.loomi-hit") as HTMLElement;
      expect(tip.classList.contains("loomi-hit-point"), `type=${type}`).to.be.true;
    }
  });

  it("renders no hover layer when there is no data", async () => {
    const el = await fixture<LoomiChart>(html`<loomi-chart type="bar"></loomi-chart>`);
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector(".loomi-hits")).to.not.exist;
  });

  it("places the legend after the canvas by default (bottom)", async () => {
    const el = await fixture<LoomiChart>(html`<loomi-chart type="bar" show-legend></loomi-chart>`);
    el.data = series;
    await el.updateComplete;

    const children = [...el.shadowRoot!.querySelector(".loomi-chart")!.children];
    const canvasIndex = children.findIndex((c) => c.classList.contains("loomi-canvas"));
    const legendIndex = children.findIndex((c) => c.classList.contains("loomi-legend"));
    expect(canvasIndex).to.be.lessThan(legendIndex);
    expect(el.shadowRoot!.querySelector(".loomi-chart")!.classList.contains("pos-bottom")).to.be.true;
  });

  it("moves the legend before the canvas for legend-position=\"top\" or \"left\"", async () => {
    for (const position of ["top", "left"] as const) {
      const el = await fixture<LoomiChart>(
        html`<loomi-chart type="bar" show-legend legend-position=${position}></loomi-chart>`,
      );
      el.data = series;
      await el.updateComplete;

      const children = [...el.shadowRoot!.querySelector(".loomi-chart")!.children];
      const canvasIndex = children.findIndex((c) => c.classList.contains("loomi-canvas"));
      const legendIndex = children.findIndex((c) => c.classList.contains("loomi-legend"));
      expect(legendIndex, `position=${position}`).to.be.lessThan(canvasIndex);
    }
  });

  it("reflects legend-position as a pos-<position> class for CSS layout", async () => {
    const el = await fixture<LoomiChart>(html`<loomi-chart type="bar" show-legend legend-position="right"></loomi-chart>`);
    el.data = series;
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector(".loomi-chart")!.classList.contains("pos-right")).to.be.true;
  });
});
