import { html, fixture, expect } from "@open-wc/testing";
import "../dist/index.js";
import type { LoomiArcMeter } from "../dist/index.js";

describe("loomi-arc-meter", () => {
  it("renders shadow content", async () => {
    const el = await fixture<LoomiArcMeter>(html`<loomi-arc-meter></loomi-arc-meter>`);
    expect(el.shadowRoot).to.exist;
    expect(el.shadowRoot!.childElementCount).to.be.greaterThan(0);
  });

  it("renders its title and description", async () => {
    const el = await fixture<LoomiArcMeter>(
      html`<loomi-arc-meter title="Risk" description="Current exposure"></loomi-arc-meter>`,
    );
    const text = el.shadowRoot!.textContent ?? "";
    expect(text).to.contain("Risk");
    expect(text).to.contain("Current exposure");
  });

  it("records the segment count it was asked for", async () => {
    // `markers` is a count, not a list of labels.
    const el = await fixture<LoomiArcMeter>(html`<loomi-arc-meter markers="6"></loomi-arc-meter>`);
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector("[data-markers]")!.getAttribute("data-markers")).to.equal(
      "6",
    );
  });

  it("clamps a nonsensical marker count to at least one", async () => {
    const el = await fixture<LoomiArcMeter>(html`<loomi-arc-meter markers="0"></loomi-arc-meter>`);
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector("[data-markers]")!.getAttribute("data-markers")).to.equal(
      "1",
    );
  });

  it("tracks which marker is active", async () => {
    const el = await fixture<LoomiArcMeter>(
      html`<loomi-arc-meter markers="5" active-marker="4"></loomi-arc-meter>`,
    );
    await el.updateComplete;
    expect(
      el.shadowRoot!.querySelector("[data-active-marker]")!.getAttribute("data-active-marker"),
    ).to.equal("4");
  });
});
