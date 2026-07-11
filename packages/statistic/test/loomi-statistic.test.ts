import { html, fixture, expect } from "@open-wc/testing";
import "../dist/index.js";

describe("loomi-statistic", () => {
  it("renders shadow content", async () => {
    const el = await fixture(html`<loomi-statistic ></loomi-statistic>`);
    expect(el.shadowRoot).to.exist;
    expect(el.shadowRoot!.childElementCount).to.be.greaterThan(0);
  });
});
