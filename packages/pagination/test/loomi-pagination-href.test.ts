import { html, fixture, expect } from "@open-wc/testing";
import "../dist/index.js";
import type { LoomiPagination } from "../dist/index.js";

describe("loomi-pagination href-template", () => {
  it("renders controls as links", async () => {
    const el = await fixture<LoomiPagination>(
      html`<loomi-pagination total="240" page-size="25" page="3" pagination-style="numbers" href-template="/orders?page={page}"></loomi-pagination>`,
    );
    const links = Array.from(el.shadowRoot!.querySelectorAll<HTMLAnchorElement>("a.loomi-page"));
    const hrefs = links.map((a) => a.getAttribute("href"));
    expect(hrefs[0]).to.equal("/orders?page=2"); // previous
    expect(hrefs).to.include("/orders?page=10");
    expect(hrefs[hrefs.length - 1]).to.equal("/orders?page=4"); // next
    const current = el.shadowRoot!.querySelector('[aria-current="page"]')!;
    expect(current.textContent!.trim()).to.equal("3");
    expect(el.shadowRoot!.querySelector("button")).to.equal(null);
  });

  it("disabled prev on page 1 is inert, and a cancelled event stops navigation", async () => {
    const el = await fixture<LoomiPagination>(
      html`<loomi-pagination total="50" page-size="10" href-template="#p{page}"></loomi-pagination>`,
    );
    const prev = el.shadowRoot!.querySelector(".loomi-page.disabled")!;
    expect(prev.tagName).to.equal("SPAN");
    el.addEventListener("loomi-page-change", (e) => e.preventDefault());
    const next = el.shadowRoot!.querySelector<HTMLAnchorElement>("a.loomi-page")!;
    const ev = new MouseEvent("click", { bubbles: true, cancelable: true, composed: true });
    next.dispatchEvent(ev);
    expect(ev.defaultPrevented).to.equal(true);
    expect(el.page).to.equal(1);
  });
});
