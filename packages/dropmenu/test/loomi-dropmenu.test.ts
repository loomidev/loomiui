import { html, fixture, expect } from "@open-wc/testing";
import "../dist/loomi-dropmenu.js";
import type { LoomiDropmenu } from "../dist/index.js";

const nextFrame = (): Promise<void> => new Promise((resolve) => requestAnimationFrame(() => resolve()));

async function open(el: LoomiDropmenu): Promise<HTMLElement> {
  el.shadowRoot!.querySelector<HTMLButtonElement>(".loomi-trigger")!.click();
  await el.updateComplete;
  await nextFrame();
  await el.updateComplete;
  return el.shadowRoot!.querySelector<HTMLElement>(".loomi-menu")!;
}

describe("loomi-dropmenu", () => {
  it("opens to the right when there is not enough room on the left", async () => {
    const el = await fixture<LoomiDropmenu>(html`
      <loomi-dropmenu style="position:fixed;left:12px;top:12px">
        <loomi-dropmenu-item>Profile</loomi-dropmenu-item>
        <loomi-dropmenu-item>Settings</loomi-dropmenu-item>
      </loomi-dropmenu>
    `);

    const menu = await open(el);

    expect(menu.classList.contains("left")).to.equal(true);
    expect(menu.classList.contains("right")).to.equal(false);
  });

  it("opens to the left when there is not enough room on the right", async () => {
    const el = await fixture<LoomiDropmenu>(html`
      <loomi-dropmenu style="position:fixed;right:12px;top:12px">
        <loomi-dropmenu-item>Profile</loomi-dropmenu-item>
        <loomi-dropmenu-item>Settings</loomi-dropmenu-item>
      </loomi-dropmenu>
    `);

    const menu = await open(el);

    expect(menu.classList.contains("right")).to.equal(true);
    expect(menu.classList.contains("left")).to.equal(false);
  });

  it("respects explicit positioning", async () => {
    const el = await fixture<LoomiDropmenu>(html`
      <loomi-dropmenu position="right" style="position:fixed;left:12px;top:12px">
        <loomi-dropmenu-item>Profile</loomi-dropmenu-item>
        <loomi-dropmenu-item>Settings</loomi-dropmenu-item>
      </loomi-dropmenu>
    `);

    const menu = await open(el);

    expect(menu.classList.contains("right")).to.equal(true);
  });

  it("renders item keyboard shortcuts", async () => {
    const el = await fixture<LoomiDropmenu>(html`
      <loomi-dropmenu>
        <loomi-dropmenu-item shortcut="⌘S">Settings</loomi-dropmenu-item>
      </loomi-dropmenu>
    `);

    await open(el);
    const item = el.querySelector("loomi-dropmenu-item")!;
    await item.updateComplete;

    expect(item.shadowRoot!.querySelector(".loomi-shortcut")!.textContent).to.equal("⌘S");
  });

  it("applies menu-level icon-right to child items", async () => {
    const el = await fixture<LoomiDropmenu>(html`
      <loomi-dropmenu icon-right>
        <loomi-dropmenu-item icon="user">Profile</loomi-dropmenu-item>
      </loomi-dropmenu>
    `);

    await open(el);
    const item = el.querySelector("loomi-dropmenu-item")!;
    await nextFrame();
    await item.updateComplete;

    expect(item.shadowRoot!.querySelector(".loomi-item")!.classList.contains("right")).to.equal(true);
  });

  it("supports nested submenu items", async () => {
    const el = await fixture<LoomiDropmenu>(html`
      <loomi-dropmenu>
        <loomi-dropmenu-item id="support" icon="question-mark-circle">
          Support
          <loomi-dropmenu-item slot="submenu">Documentation</loomi-dropmenu-item>
          <loomi-dropmenu-item slot="submenu">Contact us</loomi-dropmenu-item>
        </loomi-dropmenu-item>
      </loomi-dropmenu>
    `);

    await open(el);
    const item = el.querySelector("loomi-dropmenu-item")!;
    await nextFrame();
    await item.updateComplete;
    item.shadowRoot!.querySelector<HTMLElement>(".loomi-item")!.click();
    await item.updateComplete;

    expect(item.shadowRoot!.querySelector(".loomi-submenu-icon")).not.to.equal(null);
    expect(item.shadowRoot!.querySelector(".loomi-submenu")!.classList.contains("open")).to.equal(true);
  });
});
