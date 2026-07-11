import { html, fixture, expect } from "@open-wc/testing";
import { oneEvent } from "@open-wc/testing";
import "../dist/index.js";
import type { LoomiPagination } from "../dist/index.js";

describe("loomi-pagination", () => {
  it("fires loomi-page-change when navigating", async () => {
    const el = await fixture<LoomiPagination>(html`<loomi-pagination total="50" page-size="10"></loomi-pagination>`);
    const buttons = el.shadowRoot!.querySelectorAll("button");
    expect(buttons.length).to.be.greaterThan(0);

    const next = buttons[buttons.length - 1] as HTMLButtonElement;
    setTimeout(() => next.click());
    const ev = (await oneEvent(el, "loomi-page-change")) as CustomEvent;
    expect(ev.detail.page).to.equal(2);
  });
});
