import { html, fixture, expect } from "@open-wc/testing";
import "../dist/index.js";
import type { LoomiCenteredContent } from "../dist/index.js";

describe("loomi-centered-content", () => {
  it("renders shadow content", async () => {
    const el = await fixture<LoomiCenteredContent>(
      html`<loomi-centered-content></loomi-centered-content>`,
    );
    expect(el.shadowRoot).to.exist;
    expect(el.shadowRoot!.childElementCount).to.be.greaterThan(0);
  });

  it("projects whatever it wraps", async () => {
    const el = await fixture<LoomiCenteredContent>(
      html`<loomi-centered-content><p>Inside</p></loomi-centered-content>`,
    );
    const slot = el.shadowRoot!.querySelector("slot") as HTMLSlotElement;
    const assigned = slot.assignedElements({ flatten: true });
    expect(assigned.map((n) => n.textContent)).to.include("Inside");
  });

  it("applies the configured min-height and max-width as host custom properties", async () => {
    const el = await fixture<LoomiCenteredContent>(
      html`<loomi-centered-content min-height="40vh" max-width="30rem"></loomi-centered-content>`,
    );
    await el.updateComplete;
    // They are written onto the host as custom properties, not into the shadow markup.
    expect(el.style.getPropertyValue("--loomi-center-min")).to.equal("40vh");
    expect(el.style.getPropertyValue("--loomi-center-max")).to.equal("30rem");
  });

  it("leaves the custom properties unset when nothing is configured", async () => {
    const el = await fixture<LoomiCenteredContent>(
      html`<loomi-centered-content></loomi-centered-content>`,
    );
    await el.updateComplete;
    expect(el.style.getPropertyValue("--loomi-center-min")).to.equal("");
  });
});
