import { html, fixture, expect } from "@open-wc/testing";
import "../dist/index.js";

describe("loomi-centered-content", () => {
  it("renders shadow content", async () => {
    const el = await fixture(html`<loomi-centered-content ></loomi-centered-content>`);
    expect(el.shadowRoot).to.exist;
    expect(el.shadowRoot!.childElementCount).to.be.greaterThan(0);
  });
});
