import { html, fixture, expect } from "@open-wc/testing";
import "../dist/loomi-horizontal-line-graph.js";
import type { LoomiHorizontalLineGraph } from "../dist/index.js";

describe("loomi-horizontal-line-graph", () => {
  it("summarizes segments for assistive technologies", async () => {
    const el = await fixture<LoomiHorizontalLineGraph>(
      html`<loomi-horizontal-line-graph .data=${[
        { label: "Active", value: 60 },
        { label: "Draft", value: 40 },
      ]}></loomi-horizontal-line-graph>`,
    );
    const root = el.shadowRoot!.querySelector(".loomi-hlg")!;

    expect(root.getAttribute("role")).to.equal("img");
    expect(root.getAttribute("aria-label")).to.contain("Active 60%");
    expect(root.getAttribute("aria-label")).to.contain("Draft 40%");
  });
});
