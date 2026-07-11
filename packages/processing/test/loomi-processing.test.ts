import { html, fixture, expect } from "@open-wc/testing";
import "../dist/index.js";

describe("loomi-processing", () => {
  it("renders shadow content", async () => {
    const el = await fixture(html`<loomi-processing ></loomi-processing>`);
    expect(el.shadowRoot).to.exist;
    expect(el.shadowRoot!.childElementCount).to.be.greaterThan(0);
  });
});
