import { html, fixture, expect } from "@open-wc/testing";
import "../dist/index.js";

describe("loomi-contact-card", () => {
  it("renders shadow content", async () => {
    const el = await fixture(html`<loomi-contact-card ></loomi-contact-card>`);
    expect(el.shadowRoot).to.exist;
    expect(el.shadowRoot!.childElementCount).to.be.greaterThan(0);
  });
});
