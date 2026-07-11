import { html, fixture, expect } from "@open-wc/testing";
import "../dist/index.js";

describe("loomi-calendar", () => {
  it("renders the shell with a toolbar", async () => {
    const el = await fixture(html`<loomi-calendar></loomi-calendar>`);
    expect(el.shadowRoot!.querySelector(".shell")).to.exist;
  });
});
