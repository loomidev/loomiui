import { html, fixture, expect, oneEvent } from "@open-wc/testing";
import "../dist/index.js";
import type { LoomiPagination } from "../dist/index.js";

const pageButtons = (el: LoomiPagination): HTMLButtonElement[] =>
  Array.from(el.shadowRoot!.querySelectorAll("button"));

/**
 * The page sequence as rendered, in DOM order: numbered buttons plus the ellipsis spans
 * between them. Only `pagination-style="numbers"` renders this; the arrows carry no text.
 */
const numberLabels = (el: LoomiPagination): string[] =>
  Array.from(el.shadowRoot!.querySelectorAll("button, .loomi-ellipsis"))
    .map((node) => node.textContent!.trim())
    .filter((text) => text.length > 0);

describe("loomi-pagination", () => {
  it("fires loomi-page-change when navigating", async () => {
    const el = await fixture<LoomiPagination>(
      html`<loomi-pagination total="50" page-size="10"></loomi-pagination>`,
    );
    const buttons = pageButtons(el);
    expect(buttons.length).to.be.greaterThan(0);

    const next = buttons[buttons.length - 1];
    setTimeout(() => next.click());
    const ev = (await oneEvent(el, "loomi-page-change")) as CustomEvent;
    expect(ev.detail.page).to.equal(2);
  });

  describe("page count", () => {
    it("rounds a partial last page up", async () => {
      const el = await fixture<LoomiPagination>(
        html`<loomi-pagination total="51" page-size="10"></loomi-pagination>`,
      );
      expect(el.pageCount).to.equal(6);
    });

    it("reports a single page when there are no records at all", async () => {
      const el = await fixture<LoomiPagination>(
        html`<loomi-pagination total="0" page-size="10"></loomi-pagination>`,
      );
      expect(el.pageCount).to.equal(1);
    });
  });

  describe("boundaries", () => {
    it("does not move or emit past the last page", async () => {
      const el = await fixture<LoomiPagination>(
        html`<loomi-pagination total="20" page-size="10" page="2"></loomi-pagination>`,
      );
      let emitted = false;
      el.addEventListener("loomi-page-change", () => (emitted = true));

      const next = pageButtons(el).at(-1)!;
      next.click();
      await el.updateComplete;

      expect(el.page).to.equal(2);
      expect(emitted, "clamped navigation must not emit").to.be.false;
    });

    it("does not move or emit before the first page", async () => {
      const el = await fixture<LoomiPagination>(
        html`<loomi-pagination total="20" page-size="10" page="1"></loomi-pagination>`,
      );
      let emitted = false;
      el.addEventListener("loomi-page-change", () => (emitted = true));

      pageButtons(el)[0].click();
      await el.updateComplete;

      expect(el.page).to.equal(1);
      expect(emitted).to.be.false;
    });

    it("disables the arrows at each end of the range", async () => {
      const el = await fixture<LoomiPagination>(
        html`<loomi-pagination total="30" page-size="10" page="1"></loomi-pagination>`,
      );
      expect(pageButtons(el)[0].disabled, "prev on first page").to.be.true;

      el.page = 3;
      await el.updateComplete;
      expect(pageButtons(el).at(-1)!.disabled, "next on last page").to.be.true;
    });
  });

  describe("number list", () => {
    it("lists every page without ellipses up to seven pages", async () => {
      const el = await fixture<LoomiPagination>(
        html`<loomi-pagination
          total="70"
          page-size="10"
          pagination-style="numbers"
        ></loomi-pagination>`,
      );
      expect(numberLabels(el)).to.eql(["1", "2", "3", "4", "5", "6", "7"]);
    });

    it("collapses the middle with ellipses beyond seven pages", async () => {
      const el = await fixture<LoomiPagination>(
        html`<loomi-pagination
          total="200"
          page-size="10"
          page="10"
          pagination-style="numbers"
        ></loomi-pagination>`,
      );
      // First and last always shown, current page flanked by one neighbour either side.
      expect(numberLabels(el)).to.eql(["1", "…", "9", "10", "11", "…", "20"]);
    });

    it("does not open a gap adjacent to the first page", async () => {
      const el = await fixture<LoomiPagination>(
        html`<loomi-pagination
          total="200"
          page-size="10"
          page="2"
          pagination-style="numbers"
        ></loomi-pagination>`,
      );
      expect(numberLabels(el)).to.eql(["1", "2", "3", "…", "20"]);
    });
  });

  describe("accessibility", () => {
    it("names the icon-only arrows", async () => {
      const el = await fixture<LoomiPagination>(
        html`<loomi-pagination total="50" page-size="10" page="2"></loomi-pagination>`,
      );
      const buttons = pageButtons(el);
      expect(buttons[0].getAttribute("aria-label")).to.be.a("string").and.not.be.empty;
      expect(buttons.at(-1)!.getAttribute("aria-label")).to.be.a("string").and.not.be.empty;
    });
  });
});
