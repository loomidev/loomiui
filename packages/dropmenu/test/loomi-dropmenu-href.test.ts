import { html, fixture, expect } from "@open-wc/testing";
import "../dist/index.js";
import type { LoomiDropmenuItem } from "../dist/index.js";

describe("loomi-dropmenu-item href", () => {
  it("renders the whole row as an anchor", async () => {
    const el = await fixture<LoomiDropmenuItem>(
      html`<loomi-dropmenu-item icon="user-circle" href="/account" target="_blank">Account</loomi-dropmenu-item>`,
    );
    const a = el.shadowRoot!.querySelector<HTMLAnchorElement>("a.loomi-item")!;
    expect(a).to.exist;
    expect(a.getAttribute("href")).to.equal("/account");
    expect(a.getAttribute("role")).to.equal("menuitem");
    expect(a.getAttribute("rel")).to.equal("noopener noreferrer");
    expect(a.querySelector("svg")).to.exist; // the icon is inside the link
  });

  it("forwards host click() to the anchor", async () => {
    const el = await fixture<LoomiDropmenuItem>(
      html`<loomi-dropmenu-item href="#menu-target">Go</loomi-dropmenu-item>`,
    );
    let clicked = false;
    const a = el.shadowRoot!.querySelector<HTMLAnchorElement>("a")!;
    a.addEventListener("click", (e) => {
      clicked = true;
      e.preventDefault();
    });
    el.click();
    expect(clicked).to.equal(true);
  });

  it("is not a link while disabled", async () => {
    const el = await fixture<LoomiDropmenuItem>(
      html`<loomi-dropmenu-item href="/x" disabled>Nope</loomi-dropmenu-item>`,
    );
    expect(el.shadowRoot!.querySelector("a")).to.equal(null);
  });
});
