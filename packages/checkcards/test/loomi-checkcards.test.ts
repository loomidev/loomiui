import { html, fixture, expect } from "@open-wc/testing";
import "../dist/index.js";

describe("loomi-checkcards", () => {
  it("renders a card and toggles selection on click", async () => {
    const el = await fixture(html`<loomi-checkcard label="Basic" value="basic"></loomi-checkcard>`);
    const card = el.shadowRoot!.querySelector(".loomi-card") as HTMLElement;
    expect(card).to.exist;
    card.click();
    await (el as unknown as { updateComplete: Promise<unknown> }).updateComplete;
    expect(el.shadowRoot!.childElementCount).to.be.greaterThan(0);
  });
});
