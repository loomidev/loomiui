import { html, fixture, expect } from "@open-wc/testing";
import "../dist/index.js";

describe("loomi-timeline", () => {
  it("renders shadow content", async () => {
    const el = await fixture(html`<loomi-timeline ></loomi-timeline>`);
    expect(el.shadowRoot).to.exist;
    expect(el.shadowRoot!.childElementCount).to.be.greaterThan(0);
  });
});
