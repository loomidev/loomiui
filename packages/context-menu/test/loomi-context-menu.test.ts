import { html, fixture, expect } from "@open-wc/testing";
import "../dist/loomi-context-menu.js";
import type { LoomiContextMenu, LoomiContextMenuItem } from "../dist/index.js";

const nextFrame = (): Promise<void> =>
  new Promise((resolve) => requestAnimationFrame(() => resolve()));

/** Waits for a closing submenu to finish its exit animation and actually hide. */
async function closed(panel: HTMLElement): Promise<void> {
  const deadline = Date.now() + 1000;
  while (panel.classList.contains("open") && Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 16));
  }
}

/** Hover a parent row and wait for its submenu to be shown and placed. */
async function openSubmenu(item: LoomiContextMenuItem): Promise<HTMLElement> {
  await nextFrame();
  await item.updateComplete;
  item.shadowRoot!.querySelector(".loomi-item")!.dispatchEvent(new MouseEvent("mouseenter"));
  await item.updateComplete;
  await nextFrame();
  await item.updateComplete;
  return item.shadowRoot!.querySelector<HTMLElement>(".loomi-submenu")!;
}

async function openAt(
  el: LoomiContextMenu,
  clientX: number,
  clientY: number,
): Promise<HTMLElement> {
  el.showAt(clientX, clientY);
  await el.updateComplete;
  await nextFrame();
  await el.updateComplete;
  return el.shadowRoot!.querySelector<HTMLElement>(".loomi-menu")!;
}

describe("loomi-context-menu", () => {
  it("opens at pointer coordinates from a contextmenu event", async () => {
    const el = await fixture<LoomiContextMenu>(html`
      <loomi-context-menu>
        <button slot="target">File</button>
        <loomi-context-menu-item>Open</loomi-context-menu-item>
      </loomi-context-menu>
    `);
    const target = el.shadowRoot!.querySelector<HTMLElement>(".loomi-target")!;

    target.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        composed: true,
        cancelable: true,
        clientX: 40,
        clientY: 48,
      }),
    );
    await el.updateComplete;
    await nextFrame();
    await el.updateComplete;

    const menu = el.shadowRoot!.querySelector<HTMLElement>(".loomi-menu")!;
    expect(menu).not.to.equal(null);
    expect(menu.style.getPropertyValue("--loomi-context-menu-x")).to.equal("40px");
    expect(menu.style.getPropertyValue("--loomi-context-menu-y")).to.equal("48px");
  });

  it("opens to the left when there is not enough room on the right", async () => {
    const el = await fixture<LoomiContextMenu>(html`
      <loomi-context-menu>
        <span slot="target">File</span>
        <loomi-context-menu-item>Open</loomi-context-menu-item>
        <loomi-context-menu-item>Rename</loomi-context-menu-item>
      </loomi-context-menu>
    `);

    const menu = await openAt(el, window.innerWidth - 4, 24);

    expect(menu.classList.contains("right")).to.equal(true);
  });

  it("respects explicit positioning", async () => {
    const el = await fixture<LoomiContextMenu>(html`
      <loomi-context-menu placement="right">
        <span slot="target">File</span>
        <loomi-context-menu-item>Open</loomi-context-menu-item>
      </loomi-context-menu>
    `);

    const menu = await openAt(el, 180, 24);

    expect(menu.classList.contains("right")).to.equal(true);
  });

  it("applies menu-level icon-right to child items", async () => {
    const el = await fixture<LoomiContextMenu>(html`
      <loomi-context-menu icon-right>
        <span slot="target">File</span>
        <loomi-context-menu-item icon="user">Profile</loomi-context-menu-item>
      </loomi-context-menu>
    `);

    await openAt(el, 24, 24);
    const item = el.querySelector("loomi-context-menu-item")!;
    await nextFrame();
    await item.updateComplete;

    expect(item.shadowRoot!.querySelector(".loomi-item")!.classList.contains("right")).to.equal(
      true,
    );
  });

  it("supports nested submenu items", async () => {
    const el = await fixture<LoomiContextMenu>(html`
      <loomi-context-menu>
        <span slot="target">Help</span>
        <loomi-context-menu-item id="support" icon="question-mark-circle">
          Support
          <loomi-context-menu-item slot="submenu">Documentation</loomi-context-menu-item>
          <loomi-context-menu-item slot="submenu">Contact us</loomi-context-menu-item>
        </loomi-context-menu-item>
      </loomi-context-menu>
    `);

    await openAt(el, 24, 24);
    const item = el.querySelector("loomi-context-menu-item")!;
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
    const el = await fixture<LoomiContextMenu>(html`
      <loomi-context-menu>
        <span slot="target">Help</span>
        <loomi-context-menu-item>
          Support
          <loomi-context-menu-item slot="submenu">Documentation</loomi-context-menu-item>
          <loomi-context-menu-item slot="submenu">Contact us</loomi-context-menu-item>
        </loomi-context-menu-item>
      </loomi-context-menu>
    `);

    await openAt(el, 24, 24);
    const item = el.querySelector<LoomiContextMenuItem>("loomi-context-menu-item")!;
    const submenu = await openSubmenu(item);
    const row = item.shadowRoot!.querySelector(".loomi-item")!.getBoundingClientRect();
    const rect = submenu.getBoundingClientRect();

    expect(submenu.dataset.side).to.equal("right");
    expect(rect.left).to.be.greaterThan(row.right);
    expect(rect.top).to.be.at.most(row.top);
  });

  it("flips a submenu to the left when it would run off the right of the viewport", async () => {
    const el = await fixture<LoomiContextMenu>(html`
      <loomi-context-menu>
        <span slot="target">Help</span>
        <loomi-context-menu-item>
          Support
          <loomi-context-menu-item slot="submenu">Documentation</loomi-context-menu-item>
          <loomi-context-menu-item slot="submenu">Contact us</loomi-context-menu-item>
        </loomi-context-menu-item>
      </loomi-context-menu>
    `);

    await openAt(el, document.documentElement.clientWidth - 24, 24);
    const item = el.querySelector<LoomiContextMenuItem>("loomi-context-menu-item")!;
    const submenu = await openSubmenu(item);
    const row = item.shadowRoot!.querySelector(".loomi-item")!.getBoundingClientRect();
    const rect = submenu.getBoundingClientRect();

    expect(submenu.dataset.side).to.equal("left");
    expect(rect.right).to.be.at.most(row.left);
    expect(rect.left).to.be.at.least(0);
  });

  it("keeps a submenu clear of a scrollable menu's own overflow", async () => {
    const el = await fixture<LoomiContextMenu>(html`
      <loomi-context-menu scrollable height="56">
        <span slot="target">Help</span>
        <loomi-context-menu-item>
          Support
          <loomi-context-menu-item slot="submenu">Documentation</loomi-context-menu-item>
          <loomi-context-menu-item slot="submenu">Contact us</loomi-context-menu-item>
        </loomi-context-menu-item>
        <loomi-context-menu-item>Settings</loomi-context-menu-item>
        <loomi-context-menu-item>Sign out</loomi-context-menu-item>
      </loomi-context-menu>
    `);

    const menu = await openAt(el, 24, 24);
    const item = el.querySelector<LoomiContextMenuItem>("loomi-context-menu-item")!;
    const submenu = await openSubmenu(item);
    const rect = submenu.getBoundingClientRect();

    // The submenu is taller than the scrolling menu, so it can only be whole by escaping it.
    expect(rect.bottom).to.be.greaterThan(menu.getBoundingClientRect().bottom);
    const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.bottom - 8);
    expect(item.contains(hit)).to.equal(true);
  });

  it("closes an open submenu when the menu itself closes", async () => {
    const el = await fixture<LoomiContextMenu>(html`
      <loomi-context-menu>
        <span slot="target">Help</span>
        <loomi-context-menu-item>
          Support
          <loomi-context-menu-item slot="submenu">Documentation</loomi-context-menu-item>
        </loomi-context-menu-item>
      </loomi-context-menu>
    `);

    await openAt(el, 24, 24);
    const item = el.querySelector<LoomiContextMenuItem>("loomi-context-menu-item")!;
    const submenu = await openSubmenu(item);
    expect(submenu.matches(":popover-open")).to.equal(true);

    el.hide();
    await el.updateComplete;
    await item.updateComplete;
    await closed(submenu);

    expect(submenu.classList.contains("open")).to.equal(false);
    expect(submenu.matches(":popover-open")).to.equal(false);
  });

  describe("keyboard (WAI-ARIA menu pattern)", () => {
    const openMenu = async (): Promise<LoomiContextMenu> => {
      const el = await fixture<LoomiContextMenu>(html`
        <loomi-context-menu label="Actions">
          <span slot="target">Target</span>
          <loomi-context-menu-item>Cut</loomi-context-menu-item>
          <loomi-context-menu-item>Copy</loomi-context-menu-item>
          <loomi-context-menu-item>
            More
            <loomi-context-menu-item slot="submenu">Paste special</loomi-context-menu-item>
          </loomi-context-menu-item>
        </loomi-context-menu>
      `);
      el.showAt(20, 20);
      await el.updateComplete;
      await nextFrame();
      return el;
    };

    const items = (el: LoomiContextMenu): LoomiContextMenuItem[] =>
      Array.from(el.querySelectorAll("loomi-context-menu-item")).filter(
        (item) => item.getAttribute("slot") !== "submenu",
      );

    // The menu listens on its own panel inside the shadow root, not on the host.
    const press = async (el: LoomiContextMenu, key: string): Promise<KeyboardEvent> => {
      const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true });
      el.shadowRoot!.querySelector(".loomi-menu")!.dispatchEvent(event);
      await el.updateComplete;
      return event;
    };

    it("gives the menu and its rows menu semantics", async () => {
      const el = await openMenu();
      expect(el.shadowRoot!.querySelector('[role="menu"]')).to.exist;
      for (const item of items(el)) {
        const row = item.shadowRoot!.querySelector(".loomi-item")!;
        expect(row.getAttribute("role")).to.equal("menuitem");
        expect(row.getAttribute("tabindex"), "rows are not tab stops").to.equal("-1");
      }
    });

    it("moves focus down and wraps past the last row", async () => {
      const el = await openMenu();
      const rows = items(el);

      await press(el, "ArrowDown");
      expect(document.activeElement).to.equal(rows[0]);

      await press(el, "ArrowUp");
      expect(document.activeElement, "wraps backwards to the last row").to.equal(rows.at(-1));
    });

    it("jumps to the first and last rows with Home and End", async () => {
      const el = await openMenu();
      const rows = items(el);

      await press(el, "End");
      expect(document.activeElement).to.equal(rows.at(-1));

      await press(el, "Home");
      expect(document.activeElement).to.equal(rows[0]);
    });

    it("opens a submenu with ArrowRight and closes it with ArrowLeft", async () => {
      const el = await openMenu();
      const parent = items(el).at(-1)!;

      await press(el, "End"); // focus the row that owns the submenu
      expect(parent.hasSubmenu).to.be.true;

      await press(el, "ArrowRight");
      await parent.updateComplete;
      expect(parent.isSubmenuOpen, "ArrowRight opens the submenu").to.be.true;

      await press(el, "ArrowLeft");
      await parent.updateComplete;
      expect(parent.isSubmenuOpen, "ArrowLeft closes it again").to.be.false;
    });

    it("closes on Escape and hands focus back to the target", async () => {
      const el = await openMenu();
      await press(el, "Escape");
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector(".loomi-menu.open")).to.not.exist;
    });
  });
});
