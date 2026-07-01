import { html, fixture, expect } from "@open-wc/testing";
import "../dist/loomi-context-menu.js";
import type { LoomiContextMenu } from "../dist/index.js";

const nextFrame = (): Promise<void> => new Promise((resolve) => requestAnimationFrame(() => resolve()));

async function openAt(el: LoomiContextMenu, clientX: number, clientY: number): Promise<HTMLElement> {
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

    target.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, composed: true, cancelable: true, clientX: 40, clientY: 48 }));
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
      <loomi-context-menu position="right">
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

    expect(item.shadowRoot!.querySelector(".loomi-item")!.classList.contains("right")).to.equal(true);
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
    expect(item.shadowRoot!.querySelector(".loomi-submenu")!.classList.contains("open")).to.equal(true);
  });
});
