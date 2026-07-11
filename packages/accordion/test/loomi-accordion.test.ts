import { html, fixture, expect } from "@open-wc/testing";
import { oneEvent } from "@open-wc/testing";
import "../dist/index.js";

describe("loomi-accordion", () => {
  it("renders items and toggles open on header click", async () => {
    const el = await fixture(html`
      <loomi-accordion>
        <loomi-accordion-item title="One">First body</loomi-accordion-item>
        <loomi-accordion-item title="Two">Second body</loomi-accordion-item>
      </loomi-accordion>
    `);
    const item = el.querySelector("loomi-accordion-item")!;
    const head = item.shadowRoot!.querySelector(".loomi-head") as HTMLButtonElement;
    expect(head.getAttribute("aria-expanded")).to.equal("false");

    setTimeout(() => head.click());
    await oneEvent(item, "loomi-accordion-toggle");
    await (item as unknown as { updateComplete: Promise<unknown> }).updateComplete;
    expect(head.getAttribute("aria-expanded")).to.equal("true");
  });
});
