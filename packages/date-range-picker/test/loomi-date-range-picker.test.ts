import { html, fixture, expect } from "@open-wc/testing";
import "../dist/index.js";

describe("loomi-date-range-picker", () => {
  it("renders shadow content", async () => {
    const el = await fixture(html`<loomi-date-range-picker ></loomi-date-range-picker>`);
    expect(el.shadowRoot).to.exist;
    expect(el.shadowRoot!.childElementCount).to.be.greaterThan(0);
  });
});
