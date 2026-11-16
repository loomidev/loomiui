import { html, fixture, expect } from "@open-wc/testing";
import "../dist/index.js";
import type { LoomiEmptyState } from "../dist/index.js";

describe("loomi-empty-state actions", () => {
  it("button-href renders a link", async () => {
    const el = await fixture<LoomiEmptyState>(
      html`<loomi-empty-state message="Nothing" button-label="Start shopping" button-href="/shop"></loomi-empty-state>`,
    );
    const a = el.shadowRoot!.querySelector<HTMLAnchorElement>("a.loomi-btn")!;
    expect(a.getAttribute("href")).to.equal("/shop");
    expect(a.textContent!.trim()).to.equal("Start shopping");
  });

  it("renders slotted content in the actions row", async () => {
    const el = await fixture<LoomiEmptyState>(
      html`<loomi-empty-state message="Nothing" button-label="One"><a href="/two">Two</a></loomi-empty-state>`,
    );
    const slot = el.shadowRoot!.querySelector<HTMLSlotElement>(".loomi-actions slot")!;
    expect(slot.assignedElements()[0].textContent).to.equal("Two");
    const link = el.querySelector("a")!;
    expect(link.getBoundingClientRect().height).to.be.greaterThan(0);
  });

  it("hides the actions row when empty", async () => {
    const el = await fixture<LoomiEmptyState>(
      html`<loomi-empty-state message="Nothing"></loomi-empty-state>`,
    );
    expect(el.shadowRoot!.querySelector<HTMLElement>(".loomi-actions")!.hidden).to.equal(true);
  });
});
