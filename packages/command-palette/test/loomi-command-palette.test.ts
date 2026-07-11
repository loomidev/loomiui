import { html, fixture, expect } from "@open-wc/testing";
import "../dist/index.js";

describe("loomi-command-palette", () => {
  it("renders shadow content", async () => {
    const el = await fixture(html`<loomi-command-palette ></loomi-command-palette>`);
    expect(el.shadowRoot).to.exist;
    expect(el.shadowRoot!.childElementCount).to.be.greaterThan(0);
  });
});
