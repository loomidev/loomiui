import { html, fixture, expect } from "@open-wc/testing";
import "../dist/index.js";
import type { LoomiHorizontalLineGraph } from "../dist/index.js";

const DATA = [
  { label: "Ghana", value: 40 },
  { label: "Kenya", value: 60 },
];

describe("loomi-horizontal-line-graph", () => {
  it("renders shadow content", async () => {
    const el = await fixture<LoomiHorizontalLineGraph>(
      html`<loomi-horizontal-line-graph></loomi-horizontal-line-graph>`,
    );
    expect(el.shadowRoot).to.exist;
    expect(el.shadowRoot!.childElementCount).to.be.greaterThan(0);
  });

  it("renders a band per data point", async () => {
    const el = await fixture<LoomiHorizontalLineGraph>(
      html`<loomi-horizontal-line-graph .data=${DATA}></loomi-horizontal-line-graph>`,
    );
    await el.updateComplete;
    const text = el.shadowRoot!.textContent ?? "";
    expect(text).to.contain("Ghana");
    expect(text).to.contain("Kenya");
  });

  it("shows a percentage per band by default, and drops it on request", async () => {
    const el = await fixture<LoomiHorizontalLineGraph>(
      html`<loomi-horizontal-line-graph .data=${DATA}></loomi-horizontal-line-graph>`,
    );
    await el.updateComplete;
    expect(el.shadowRoot!.querySelectorAll(".loomi-val"), "on by default").to.have.lengthOf(
      DATA.length,
    );

    el.showValues = false;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelectorAll(".loomi-val")).to.have.lengthOf(0);
  });

  it("survives an empty data set", async () => {
    const el = await fixture<LoomiHorizontalLineGraph>(
      html`<loomi-horizontal-line-graph .data=${[]}></loomi-horizontal-line-graph>`,
    );
    await el.updateComplete;
    expect(el.shadowRoot).to.exist;
  });
});
