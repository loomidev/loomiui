import { html, fixture, expect } from "@open-wc/testing";
import "../dist/index.js";

describe("loomi-text-editor", () => {
  it("renders shadow content", async () => {
    const el = await fixture(html`<loomi-text-editor ></loomi-text-editor>`);
    expect(el.shadowRoot).to.exist;
    expect(el.shadowRoot!.childElementCount).to.be.greaterThan(0);
  });
});
