import { html, fixture, expect } from "@open-wc/testing";
import "../dist/index.js";

describe("loomi-side-nav", () => {
  it("renders shadow content", async () => {
    const el = await fixture(html`<loomi-side-nav ></loomi-side-nav>`);
    expect(el.shadowRoot).to.exist;
    expect(el.shadowRoot!.childElementCount).to.be.greaterThan(0);
  });
});
