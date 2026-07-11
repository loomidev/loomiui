import { html, fixture, expect } from "@open-wc/testing";
import { oneEvent } from "@open-wc/testing";
import "../dist/index.js";

describe("loomi-tag", () => {
  it("renders its label and fires loomi-tag-click on click", async () => {
    const el = await fixture(html`<loomi-tag label="beta" value="beta"></loomi-tag>`);
    expect(el.shadowRoot!.textContent).to.include("beta");

    const inner = el.shadowRoot!.querySelector(".loomi-tag") as HTMLElement;
    setTimeout(() => inner.click());
    await oneEvent(el, "loomi-tag-click");
  });
});
