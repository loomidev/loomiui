import { html, fixture, expect } from "@open-wc/testing";
import "../dist/index.js";

describe("loomi-filter-builder", () => {
  it("renders shadow content", async () => {
    const el = await fixture(html`<loomi-filter-builder ></loomi-filter-builder>`);
    expect(el.shadowRoot).to.exist;
    expect(el.shadowRoot!.childElementCount).to.be.greaterThan(0);
  });
});
