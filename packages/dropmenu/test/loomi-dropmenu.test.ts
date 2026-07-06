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
      <loomi-dropmenu placement="right" style="position:fixed;left:12px;top:12px">
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

  it("toggles a checkbox item and keeps the menu open", async () => {
    const el = await fixture<LoomiDropmenu>(html`
      <loomi-dropmenu>
        <loomi-dropmenu-item checkbox>Show Sidebar</loomi-dropmenu-item>
      </loomi-dropmenu>
    `);

    const menu = await open(el);
    const item = el.querySelector("loomi-dropmenu-item")!;
    await item.updateComplete;

    let changed = 0;
    item.addEventListener("change", () => changed++);
    item.shadowRoot!.querySelector<HTMLElement>(".loomi-item")!.click();
    await item.updateComplete;

    expect(item.checked).to.equal(true);
    expect(changed).to.equal(1);
    expect(item.shadowRoot!.querySelector(".loomi-radio-dot")).to.equal(null);
    expect(item.shadowRoot!.querySelector(".loomi-indicator svg")).not.to.equal(null);
    expect(menu.isConnected).to.equal(true);
    expect(el.shadowRoot!.querySelector(".loomi-menu")).not.to.equal(null);
  });

  it("keeps radio items in the same group mutually exclusive", async () => {
    const el = await fixture<LoomiDropmenu>(html`
      <loomi-dropmenu>
        <loomi-dropmenu-item radio group="position" value="top">Top</loomi-dropmenu-item>
        <loomi-dropmenu-item radio group="position" value="bottom">Bottom</loomi-dropmenu-item>
      </loomi-dropmenu>
    `);

    await open(el);
    const [top, bottom] = Array.from(el.querySelectorAll("loomi-dropmenu-item"));
    await top.updateComplete;
    await bottom.updateComplete;

    top.shadowRoot!.querySelector<HTMLElement>(".loomi-item")!.click();
    await top.updateComplete;
    expect(top.checked).to.equal(true);
    expect(bottom.checked).to.equal(false);

    bottom.shadowRoot!.querySelector<HTMLElement>(".loomi-item")!.click();
    await top.updateComplete;
    await bottom.updateComplete;
    expect(top.checked).to.equal(false);
    expect(bottom.checked).to.equal(true);
    expect(bottom.shadowRoot!.querySelector(".loomi-radio-dot")).not.to.equal(null);
  });

  it("blocks clicks on a disabled item", async () => {
    const el = await fixture<LoomiDropmenu>(html`
      <loomi-dropmenu>
        <loomi-dropmenu-item disabled>API</loomi-dropmenu-item>
      </loomi-dropmenu>
    `);

    await open(el);
    const item = el.querySelector("loomi-dropmenu-item")!;
    await item.updateComplete;

    let clicked = false;
    item.addEventListener("click", () => (clicked = true));
    item.shadowRoot!.querySelector<HTMLElement>(".loomi-item")!.click();

    expect(clicked).to.equal(false);
    expect(item.shadowRoot!.querySelector(".loomi-item")!.getAttribute("aria-disabled")).to.equal("true");
  });

  it("excludes disabled items from arrow-key navigation", async () => {
    const el = await fixture<LoomiDropmenu>(html`
      <loomi-dropmenu>
        <loomi-dropmenu-item disabled>Profile</loomi-dropmenu-item>
        <loomi-dropmenu-item>Settings</loomi-dropmenu-item>
      </loomi-dropmenu>
    `);

    const menu = await open(el);
    const [profile, settings] = Array.from(el.querySelectorAll("loomi-dropmenu-item"));
    await profile.updateComplete;
    await settings.updateComplete;

    menu.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, composed: true }));
    await settings.updateComplete;

    expect(settings.shadowRoot!.activeElement).not.to.equal(null);
  });

  it("renders the destructive variant", async () => {
    const el = await fixture<LoomiDropmenu>(html`
      <loomi-dropmenu>
        <loomi-dropmenu-item variant="destructive">Delete</loomi-dropmenu-item>
      </loomi-dropmenu>
    `);

    await open(el);
    const item = el.querySelector("loomi-dropmenu-item")!;
    await item.updateComplete;

    expect(item.shadowRoot!.querySelector(".loomi-item")!.classList.contains("destructive")).to.equal(true);
  });

  it("closes the menu on Tab without trapping focus", async () => {
    const el = await fixture<LoomiDropmenu>(html`
      <loomi-dropmenu>
        <loomi-dropmenu-item>Profile</loomi-dropmenu-item>
        <loomi-dropmenu-item>Settings</loomi-dropmenu-item>
      </loomi-dropmenu>
    `);

    const menu = await open(el);
    menu.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true, composed: true, cancelable: true }));
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector(".loomi-menu")).to.equal(null);
  });

  it("restores focus to the trigger after Escape", async () => {
    const el = await fixture<LoomiDropmenu>(html`
      <loomi-dropmenu>
        <loomi-dropmenu-item>Profile</loomi-dropmenu-item>
      </loomi-dropmenu>
    `);

    const menu = await open(el);
    menu.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, composed: true, cancelable: true }));
    await el.updateComplete;

    expect(el.shadowRoot!.activeElement).to.equal(el.shadowRoot!.querySelector(".loomi-trigger"));
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
