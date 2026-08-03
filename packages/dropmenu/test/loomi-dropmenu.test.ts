import { html, fixture, expect } from "@open-wc/testing";
import "../dist/loomi-dropmenu.js";
import type { LoomiDropmenu, LoomiDropmenuItem } from "../dist/index.js";

const nextFrame = (): Promise<void> =>
  new Promise((resolve) => requestAnimationFrame(() => resolve()));

/**
 * Waits for a closing panel to finish its exit animation and actually hide. `isOpen`,
 * listeners and focus are all released synchronously by the close; only the panel's own
 * visibility waits for the animation.
 */
async function closed(panel: HTMLElement): Promise<void> {
  const deadline = Date.now() + 1000;
  while (panel.classList.contains("open") && Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 16));
  }
}

/** Hover a parent row and wait for its submenu to be shown and placed. */
async function openSubmenu(item: LoomiDropmenuItem): Promise<HTMLElement> {
  await nextFrame();
  await item.updateComplete;
  item.shadowRoot!.querySelector(".loomi-item")!.dispatchEvent(new MouseEvent("mouseenter"));
  await item.updateComplete;
  await nextFrame();
  await item.updateComplete;
  return item.shadowRoot!.querySelector<HTMLElement>(".loomi-submenu")!;
}

async function open(el: LoomiDropmenu): Promise<HTMLElement> {
  el.shadowRoot!.querySelector<HTMLButtonElement>(".loomi-trigger")!.click();
  await el.updateComplete;
  await nextFrame();
  await el.updateComplete;
  return el.shadowRoot!.querySelector<HTMLElement>(".loomi-menu")!;
}

const triggerRect = (el: LoomiDropmenu): DOMRect =>
  el.shadowRoot!.querySelector<HTMLElement>(".loomi-trigger")!.getBoundingClientRect();

describe("loomi-dropmenu", () => {
  it("lines the panel's left edge up with the trigger when there is room", async () => {
    const el = await fixture<LoomiDropmenu>(html`
      <loomi-dropmenu style="position:fixed;left:12px;top:12px">
        <loomi-dropmenu-item>Profile</loomi-dropmenu-item>
        <loomi-dropmenu-item>Settings</loomi-dropmenu-item>
      </loomi-dropmenu>
    `);

    const menu = await open(el);

    expect(menu.getBoundingClientRect().left).to.be.closeTo(triggerRect(el).left, 1);
    expect(menu.classList.contains("place-bottom")).to.equal(true);
  });

  it("swaps to right alignment when a left-aligned panel would run off screen", async () => {
    const el = await fixture<LoomiDropmenu>(html`
      <loomi-dropmenu style="position:fixed;right:12px;top:12px">
        <loomi-dropmenu-item>Profile</loomi-dropmenu-item>
        <loomi-dropmenu-item>Settings</loomi-dropmenu-item>
      </loomi-dropmenu>
    `);

    const menu = await open(el);

    expect(menu.getBoundingClientRect().right).to.be.closeTo(triggerRect(el).right, 1);
  });

  it("respects explicit right alignment", async () => {
    const el = await fixture<LoomiDropmenu>(html`
      <loomi-dropmenu placement="right" style="position:fixed;left:40%;top:12px">
        <loomi-dropmenu-item>Profile</loomi-dropmenu-item>
        <loomi-dropmenu-item>Settings</loomi-dropmenu-item>
      </loomi-dropmenu>
    `);

    const menu = await open(el);

    expect(menu.getBoundingClientRect().right).to.be.closeTo(triggerRect(el).right, 1);
  });

  it("stays inside the viewport, and visible, from within an overflow: hidden ancestor", async () => {
    // The motivating case: a row menu near the bottom of a scrolling table. The panel is
    // taller than the clipping ancestor and opens from its last row, so an in-flow panel
    // would be cut off with no way to scroll it back.
    const wrapper = await fixture<HTMLElement>(html`
      <div style="position:fixed;left:24px;bottom:24px;width:220px;height:64px;overflow:hidden">
        <div style="height:40px"></div>
        <loomi-dropmenu>
          <loomi-dropmenu-item>Edit</loomi-dropmenu-item>
          <loomi-dropmenu-item>Duplicate</loomi-dropmenu-item>
          <loomi-dropmenu-item>Archive</loomi-dropmenu-item>
          <loomi-dropmenu-item variant="destructive">Delete</loomi-dropmenu-item>
        </loomi-dropmenu>
      </div>
    `);
    const el = wrapper.querySelector<LoomiDropmenu>("loomi-dropmenu")!;

    const menu = await open(el);
    const rect = menu.getBoundingClientRect();
    const clip = wrapper.getBoundingClientRect();

    expect(rect.height).to.be.greaterThan(0);
    expect(rect.top).to.be.at.least(0);
    expect(rect.left).to.be.at.least(0);
    expect(rect.bottom).to.be.at.most(document.documentElement.clientHeight);
    expect(rect.right).to.be.at.most(document.documentElement.clientWidth);

    // It only escaped if it actually paints outside the clipping box…
    expect(rect.top).to.be.lessThan(clip.top);

    // …and hit-tests as the topmost element where it is drawn.
    const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
    expect(hit === el || el.contains(hit)).to.equal(true);
  });

  it("flips above the trigger when there is no room below", async () => {
    const el = await fixture<LoomiDropmenu>(html`
      <loomi-dropmenu style="position:fixed;left:24px;bottom:4px">
        <loomi-dropmenu-item>Profile</loomi-dropmenu-item>
        <loomi-dropmenu-item>Settings</loomi-dropmenu-item>
        <loomi-dropmenu-item>Sign out</loomi-dropmenu-item>
      </loomi-dropmenu>
    `);

    const menu = await open(el);

    expect(menu.classList.contains("place-top")).to.equal(true);
    // +1 for the sub-pixel panel height the rounded `top` can't express exactly.
    expect(menu.getBoundingClientRect().bottom).to.be.at.most(triggerRect(el).top + 1);
  });

  it("points its arrow at the trigger's center", async () => {
    const el = await fixture<LoomiDropmenu>(html`
      <loomi-dropmenu style="position:fixed;left:50%;top:12px">
        <loomi-dropmenu-item>Profile</loomi-dropmenu-item>
        <loomi-dropmenu-item>Settings</loomi-dropmenu-item>
      </loomi-dropmenu>
    `);

    const menu = await open(el);
    const trigger = triggerRect(el);
    const arrowX = Number.parseFloat(menu.style.getPropertyValue("--loomi-dropmenu-arrow-x"));

    expect(menu.getBoundingClientRect().left + arrowX).to.be.closeTo(
      trigger.left + trigger.width / 2,
      1,
    );
  });

  it("closes the panel when the trigger is clicked again", async () => {
    const el = await fixture<LoomiDropmenu>(html`
      <loomi-dropmenu>
        <loomi-dropmenu-item>Profile</loomi-dropmenu-item>
      </loomi-dropmenu>
    `);

    const menu = await open(el);
    expect(menu.classList.contains("open")).to.equal(true);

    el.shadowRoot!.querySelector<HTMLButtonElement>(".loomi-trigger")!.click();
    await el.updateComplete;

    // Closed immediately as far as state goes; the panel lingers only to animate out.
    expect(el.isOpen).to.equal(false);
    expect(menu.classList.contains("closing")).to.equal(true);
    expect(getComputedStyle(menu).animationName).to.equal("loomi-drop-out");

    await closed(menu);
    expect(menu.classList.contains("open")).to.equal(false);
    expect(menu.matches(":popover-open")).to.equal(false);
  });

  it("opens, closes and focuses its trigger programmatically", async () => {
    const el = await fixture<LoomiDropmenu>(html`
      <loomi-dropmenu>
        <loomi-dropmenu-item>Profile</loomi-dropmenu-item>
      </loomi-dropmenu>
    `);

    el.show();
    await el.updateComplete;
    await nextFrame();
    expect(el.isOpen).to.equal(true);
    expect(el.shadowRoot!.querySelector(".loomi-menu")!.classList.contains("open")).to.equal(true);

    el.hide();
    await el.updateComplete;
    expect(el.isOpen).to.equal(false);

    el.focus();
    expect(el.shadowRoot!.activeElement).to.equal(el.shadowRoot!.querySelector(".loomi-trigger"));
  });

  it("closes on a right-click outside, not only a left-click", async () => {
    const el = await fixture<LoomiDropmenu>(html`
      <loomi-dropmenu>
        <loomi-dropmenu-item>Profile</loomi-dropmenu-item>
      </loomi-dropmenu>
    `);

    const menu = await open(el);
    document.body.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, composed: true }));
    await el.updateComplete;
    await closed(menu);

    expect(menu.classList.contains("open")).to.equal(false);
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

    expect(item.shadowRoot!.querySelector(".loomi-item")!.classList.contains("right")).to.equal(
      true,
    );
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
    expect(menu.classList.contains("open")).to.equal(true);
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
    expect(item.shadowRoot!.querySelector(".loomi-item")!.getAttribute("aria-disabled")).to.equal(
      "true",
    );
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

    menu.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, composed: true }),
    );
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

    expect(
      item.shadowRoot!.querySelector(".loomi-item")!.classList.contains("destructive"),
    ).to.equal(true);
  });

  it("closes the menu on Tab without trapping focus", async () => {
    const el = await fixture<LoomiDropmenu>(html`
      <loomi-dropmenu>
        <loomi-dropmenu-item>Profile</loomi-dropmenu-item>
        <loomi-dropmenu-item>Settings</loomi-dropmenu-item>
      </loomi-dropmenu>
    `);

    const menu = await open(el);
    menu.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Tab", bubbles: true, composed: true, cancelable: true }),
    );
    await el.updateComplete;
    await closed(menu);

    expect(menu.classList.contains("open")).to.equal(false);
  });

  it("restores focus to the trigger after Escape", async () => {
    const el = await fixture<LoomiDropmenu>(html`
      <loomi-dropmenu>
        <loomi-dropmenu-item>Profile</loomi-dropmenu-item>
      </loomi-dropmenu>
    `);

    const menu = await open(el);
    menu.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
        composed: true,
        cancelable: true,
      }),
    );
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
    expect(item.shadowRoot!.querySelector(".loomi-submenu")!.classList.contains("open")).to.equal(
      true,
    );
  });

  it("opens a submenu on hover, beside the row that owns it", async () => {
    const el = await fixture<LoomiDropmenu>(html`
      <loomi-dropmenu style="position:fixed;left:24px;top:24px">
        <loomi-dropmenu-item>
          Support
          <loomi-dropmenu-item slot="submenu">Documentation</loomi-dropmenu-item>
          <loomi-dropmenu-item slot="submenu">Contact us</loomi-dropmenu-item>
        </loomi-dropmenu-item>
      </loomi-dropmenu>
    `);

    await open(el);
    const item = el.querySelector<LoomiDropmenuItem>("loomi-dropmenu-item")!;
    const submenu = await openSubmenu(item);
    const row = item.shadowRoot!.querySelector(".loomi-item")!.getBoundingClientRect();
    const rect = submenu.getBoundingClientRect();

    expect(submenu.classList.contains("open")).to.equal(true);
    expect(submenu.dataset.side).to.equal("right");
    expect(rect.left).to.be.greaterThan(row.right);
    // Its first row lines up with the row that opened it.
    expect(rect.top).to.be.at.most(row.top);
  });

  it("flips a submenu to the left when it would run off the right of the viewport", async () => {
    const el = await fixture<LoomiDropmenu>(html`
      <loomi-dropmenu style="position:fixed;right:12px;top:24px">
        <loomi-dropmenu-item>
          Support
          <loomi-dropmenu-item slot="submenu">Documentation</loomi-dropmenu-item>
          <loomi-dropmenu-item slot="submenu">Contact us</loomi-dropmenu-item>
        </loomi-dropmenu-item>
      </loomi-dropmenu>
    `);

    await open(el);
    const item = el.querySelector<LoomiDropmenuItem>("loomi-dropmenu-item")!;
    const submenu = await openSubmenu(item);
    const row = item.shadowRoot!.querySelector(".loomi-item")!.getBoundingClientRect();
    const rect = submenu.getBoundingClientRect();

    expect(submenu.dataset.side).to.equal("left");
    expect(rect.right).to.be.at.most(row.left);
    expect(rect.left).to.be.at.least(0);
  });

  it("shifts a submenu up rather than off the bottom of the viewport", async () => {
    const el = await fixture<LoomiDropmenu>(html`
      <loomi-dropmenu style="position:fixed;left:24px;bottom:4px">
        <loomi-dropmenu-item>
          Support
          <loomi-dropmenu-item slot="submenu">Documentation</loomi-dropmenu-item>
          <loomi-dropmenu-item slot="submenu">Contact us</loomi-dropmenu-item>
          <loomi-dropmenu-item slot="submenu">System status</loomi-dropmenu-item>
        </loomi-dropmenu-item>
      </loomi-dropmenu>
    `);

    await open(el);
    const item = el.querySelector<LoomiDropmenuItem>("loomi-dropmenu-item")!;
    const submenu = await openSubmenu(item);
    const rect = submenu.getBoundingClientRect();

    expect(rect.height).to.be.greaterThan(0);
    expect(rect.top).to.be.at.least(0);
    expect(rect.bottom).to.be.at.most(document.documentElement.clientHeight);
  });

  it("keeps a submenu clear of a scrollable menu's own overflow", async () => {
    const el = await fixture<LoomiDropmenu>(html`
      <loomi-dropmenu scrollable height="56" style="position:fixed;left:24px;top:24px">
        <loomi-dropmenu-item>
          Support
          <loomi-dropmenu-item slot="submenu">Documentation</loomi-dropmenu-item>
          <loomi-dropmenu-item slot="submenu">Contact us</loomi-dropmenu-item>
        </loomi-dropmenu-item>
        <loomi-dropmenu-item>Settings</loomi-dropmenu-item>
        <loomi-dropmenu-item>Sign out</loomi-dropmenu-item>
      </loomi-dropmenu>
    `);

    const menu = await open(el);
    const item = el.querySelector<LoomiDropmenuItem>("loomi-dropmenu-item")!;
    const submenu = await openSubmenu(item);
    const clip = menu.querySelector(".loomi-viewport")!.getBoundingClientRect();
    const rect = submenu.getBoundingClientRect();

    // The submenu is taller than the scrolling body, so it can only be whole by escaping it.
    expect(rect.bottom).to.be.greaterThan(clip.bottom);
    const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.bottom - 8);
    expect(item.contains(hit)).to.equal(true);
  });

  it("closes an open submenu when the menu itself closes", async () => {
    const el = await fixture<LoomiDropmenu>(html`
      <loomi-dropmenu>
        <loomi-dropmenu-item>
          Support
          <loomi-dropmenu-item slot="submenu">Documentation</loomi-dropmenu-item>
        </loomi-dropmenu-item>
      </loomi-dropmenu>
    `);

    await open(el);
    const item = el.querySelector<LoomiDropmenuItem>("loomi-dropmenu-item")!;
    const submenu = await openSubmenu(item);
    expect(submenu.matches(":popover-open")).to.equal(true);

    el.hide();
    await el.updateComplete;
    await item.updateComplete;
    await closed(submenu);

    expect(submenu.classList.contains("open")).to.equal(false);
    expect(submenu.matches(":popover-open")).to.equal(false);
  });
});
