import { html, fixture, expect, nextFrame } from "@open-wc/testing";
import "../dist/index.js";
import type { LoomiCard } from "../dist/index.js";

describe("loomi-card", () => {
  it("renders shadow content", async () => {
    const el = await fixture<LoomiCard>(html`<loomi-card></loomi-card>`);
    expect(el.shadowRoot).to.exist;
    expect(el.shadowRoot!.childElementCount).to.be.greaterThan(0);
  });

  it("carries its url as a property rather than rendering an anchor", async () => {
    // Navigation is a click handler on the card, not an <a href>. Pinning that here
    // because it is surprising, and because it means a card with a url is not reachable
    // by keyboard the way a real link would be.
    const el = await fixture<LoomiCard>(html`<loomi-card url="/pricing"></loomi-card>`);
    expect(el.url).to.equal("/pricing");
    expect(el.shadowRoot!.querySelector("a"), "no anchor is rendered").to.not.exist;
  });

  it("reflects its chrome flags so they can be styled from the light DOM", async () => {
    const el = await fixture<LoomiCard>(
      html`<loomi-card has-hover has-shadow has-border></loomi-card>`,
    );
    expect(el.hasHover).to.be.true;
    expect(el.hasShadow).to.be.true;
    expect(el.hasBorder).to.be.true;
  });

  it("composes its header, content and footer parts", async () => {
    const el = await fixture(html`
      <loomi-card>
        <loomi-card-header><loomi-card-title>Plan</loomi-card-title></loomi-card-header>
        <loomi-card-content>Details</loomi-card-content>
        <loomi-card-footer>Footer</loomi-card-footer>
      </loomi-card>
    `);
    await nextFrame();
    for (const tag of [
      "loomi-card-header",
      "loomi-card-title",
      "loomi-card-content",
      "loomi-card-footer",
    ]) {
      const part = el.querySelector(tag)!;
      expect(part.shadowRoot, tag).to.exist;
    }
    expect(el.querySelector("loomi-card-content")!.textContent).to.contain("Details");
  });
});
