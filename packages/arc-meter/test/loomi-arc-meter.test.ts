import { html, fixture, expect } from "@open-wc/testing";
import "../dist/loomi-arc-meter.js";
import type { LoomiArcMeter } from "../dist/index.js";

describe("loomi-arc-meter", () => {
  it("places the active marker at an evenly distributed interior stop", async () => {
    const el = await fixture<LoomiArcMeter>(html`
      <loomi-arc-meter
        markers="4"
        active-marker="2"
        marker-color="#06b6d4"
        title="Medium"
        description="Protection level"
      ></loomi-arc-meter>
    `);

    const root = el.shadowRoot!.querySelector<HTMLElement>(".loomi-arc-meter")!;
    const marker = el.shadowRoot!.querySelector<SVGGElement>(".loomi-marker")!;
    const segments = el.shadowRoot!.querySelectorAll(".loomi-track-segment");

    expect(root.getAttribute("aria-label")).to.contain("Medium");
    expect(root.getAttribute("aria-label")).to.contain("Protection level");
    expect(segments.length).to.equal(5);
    expect(marker.getAttribute("data-active-marker")).to.equal("2");
    expect(marker.getAttribute("data-marker-count")).to.equal("4");
    expect(marker.getAttribute("data-ratio")).to.equal("0.4");
    expect(root.style.getPropertyValue("--loomi-marker-color")).to.equal("#06b6d4");
  });

  it("falls back to a sensible marker color", async () => {
    const el = await fixture<LoomiArcMeter>(html`<loomi-arc-meter markers="3"></loomi-arc-meter>`);
    const root = el.shadowRoot!.querySelector<HTMLElement>(".loomi-arc-meter")!;

    expect(root.getAttribute("data-active-marker")).to.equal("1");
    expect(root.getAttribute("aria-label")).to.contain("Marker 1 of 3");
    expect(root.style.getPropertyValue("--loomi-marker-color")).to.contain("--loomi-error-600");
  });
});
