import { html, fixture, expect, oneEvent } from "@open-wc/testing";
import "../dist/loomi-split-button.js";
import type { LoomiSplitButton } from "../dist/index.js";

const nextFrame = (): Promise<void> =>
  new Promise((resolve) => requestAnimationFrame(() => resolve()));

function caretControl(el: LoomiSplitButton): HTMLButtonElement {
  const caret = el.shadowRoot!.querySelector<HTMLElement & { controlElement: HTMLButtonElement }>(
    ".loomi-caret",
  )!;
  return caret.controlElement;
}

function primaryControl(el: LoomiSplitButton): HTMLButtonElement {
  const primary = el.shadowRoot!.querySelector<HTMLElement & { controlElement: HTMLButtonElement }>(
    ".loomi-primary",
  )!;
  return primary.controlElement;
}

function panel(el: LoomiSplitButton): HTMLElement {
  return el.shadowRoot!.querySelector<HTMLElement>(".loomi-panel")!;
}

async function settle(el: LoomiSplitButton): Promise<void> {
  await el.updateComplete;
  await nextFrame();
  await el.updateComplete;
}

/**
 * Waits for a closing panel to finish its exit animation and actually hide. `isOpen`,
 * listeners and focus are all released synchronously by the close; only the panel's own
 * visibility waits for the animation.
 */
async function closed(menu: HTMLElement): Promise<void> {
  const deadline = Date.now() + 1000;
  while (menu.classList.contains("open") && Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 16));
  }
}

async function openMenu(el: LoomiSplitButton): Promise<HTMLElement> {
  caretControl(el).click();
  await settle(el);
  return panel(el);
}

function basic(): ReturnType<typeof html> {
  return html`
    <loomi-split-button>
      Create course
      <loomi-dropmenu-item slot="menu">Import courses</loomi-dropmenu-item>
      <loomi-dropmenu-item slot="menu">Course templates</loomi-dropmenu-item>
    </loomi-split-button>
  `;
}

describe("loomi-split-button", () => {
  it("renders both halves as loomi-buttons", async () => {
    const el = await fixture<LoomiSplitButton>(basic());
    await settle(el);

    expect(el.shadowRoot!.querySelector(".loomi-primary")!.tagName.toLowerCase()).to.equal(
      "loomi-button",
    );
    expect(el.shadowRoot!.querySelector(".loomi-caret")!.tagName.toLowerCase()).to.equal(
      "loomi-button",
    );
  });

  describe("menu behavior", () => {
    it("opens and closes from the caret", async () => {
      const el = await fixture<LoomiSplitButton>(basic());
      await settle(el);

      expect(el.isOpen).to.equal(false);
      const menu = await openMenu(el);
      expect(el.isOpen).to.equal(true);
      expect(menu.classList.contains("open")).to.equal(true);

      caretControl(el).click();
      await settle(el);
      expect(el.isOpen).to.equal(false);
      await closed(menu);
      expect(panel(el).classList.contains("open")).to.equal(false);
    });

    it("never opens the menu from the primary half", async () => {
      const el = await fixture<LoomiSplitButton>(basic());
      await settle(el);

      primaryControl(el).click();
      await settle(el);

      expect(el.isOpen).to.equal(false);
    });

    it("fires loomi-split-toggle with the new state", async () => {
      const el = await fixture<LoomiSplitButton>(basic());
      await settle(el);

      setTimeout(() => caretControl(el).click());
      const opened = await oneEvent(el, "loomi-split-toggle");
      expect(opened.detail.open).to.equal(true);
    });

    it("closes after an item click by default", async () => {
      const el = await fixture<LoomiSplitButton>(basic());
      await settle(el);
      await openMenu(el);

      el.querySelector("loomi-dropmenu-item")!.click();
      await settle(el);

      expect(el.isOpen).to.equal(false);
    });

    it("stays open after an item click when hide-after-click is off", async () => {
      const el = await fixture<LoomiSplitButton>(html`
        <loomi-split-button .hideAfterClick=${false}>
          Create course
          <loomi-dropmenu-item slot="menu">Import courses</loomi-dropmenu-item>
        </loomi-split-button>
      `);
      await settle(el);
      await openMenu(el);

      el.querySelector("loomi-dropmenu-item")!.click();
      await settle(el);

      expect(el.isOpen).to.equal(true);
    });

    it("does not open when disabled", async () => {
      const el = await fixture<LoomiSplitButton>(html`
        <loomi-split-button disabled>
          Create course
          <loomi-dropmenu-item slot="menu">Import courses</loomi-dropmenu-item>
        </loomi-split-button>
      `);
      await settle(el);

      el.show();
      await settle(el);

      expect(el.isOpen).to.equal(false);
    });
  });

  describe("escaping ancestor overflow", () => {
    it("puts the panel in the top layer via the popover API", async () => {
      const el = await fixture<LoomiSplitButton>(basic());
      await settle(el);
      const menu = panel(el);

      expect(menu.getAttribute("popover")).to.equal("manual");

      await openMenu(el);
      expect(menu.matches(":popover-open")).to.equal(true);

      caretControl(el).click();
      await settle(el);
      await closed(menu);
      expect(menu.matches(":popover-open")).to.equal(false);
    });

    it("is not clipped by an ancestor with overflow: hidden", async () => {
      const wrapper = await fixture<HTMLElement>(html`
        <div style="overflow:hidden;width:220px;height:60px">
          <loomi-split-button>
            Create course
            <loomi-dropmenu-item slot="menu">Import courses</loomi-dropmenu-item>
            <loomi-dropmenu-item slot="menu">Course templates</loomi-dropmenu-item>
          </loomi-split-button>
        </div>
      `);
      const el = wrapper.querySelector<LoomiSplitButton>("loomi-split-button")!;
      await settle(el);

      const menu = await openMenu(el);
      const menuRect = menu.getBoundingClientRect();
      const clipRect = wrapper.getBoundingClientRect();

      // The panel has real size and extends past the clipping ancestor's box — which is
      // exactly what a `position: absolute` panel inside the host could not do.
      expect(menuRect.height).to.be.greaterThan(0);
      expect(menuRect.bottom).to.be.greaterThan(clipRect.bottom);

      // And it is genuinely painted: the top layer means it hit-tests above the clip.
      const hit = document.elementFromPoint(
        Math.round(menuRect.left + menuRect.width / 2),
        Math.round(menuRect.top + menuRect.height / 2),
      );
      expect(hit).to.not.equal(null);
      expect(wrapper.contains(hit) || el.shadowRoot!.contains(hit) || hit === el).to.equal(true);
    });

    it("flips above the trigger when there is no room below", async () => {
      const el = await fixture<LoomiSplitButton>(html`
        <loomi-split-button style="position:fixed;left:20px;bottom:4px">
          Create course
          <loomi-dropmenu-item slot="menu">Import courses</loomi-dropmenu-item>
          <loomi-dropmenu-item slot="menu">Course templates</loomi-dropmenu-item>
        </loomi-split-button>
      `);
      await settle(el);

      const menu = await openMenu(el);
      expect(menu.classList.contains("place-top")).to.equal(true);
    });
  });

  describe("accessibility", () => {
    it("puts aria-haspopup/aria-expanded on the caret's real button", async () => {
      const el = await fixture<LoomiSplitButton>(basic());
      await settle(el);

      const caret = caretControl(el);
      expect(caret.getAttribute("aria-haspopup")).to.equal("menu");
      expect(caret.getAttribute("aria-expanded")).to.equal("false");

      await openMenu(el);
      expect(caret.getAttribute("aria-expanded")).to.equal("true");
    });

    it("gives the caret an accessible name", async () => {
      const el = await fixture<LoomiSplitButton>(html`
        <loomi-split-button menu-label="More course actions">
          Create course
          <loomi-dropmenu-item slot="menu">Import courses</loomi-dropmenu-item>
        </loomi-split-button>
      `);
      await settle(el);

      expect(caretControl(el).getAttribute("aria-label")).to.equal("More course actions");
    });

    it("opens and focuses the first item on ArrowDown", async () => {
      const el = await fixture<LoomiSplitButton>(basic());
      await settle(el);

      caretControl(el).dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, composed: true }),
      );
      await settle(el);

      expect(el.isOpen).to.equal(true);
      const first = el.querySelectorAll("loomi-dropmenu-item")[0];
      expect(first.shadowRoot!.activeElement).to.equal(
        first.shadowRoot!.querySelector(".loomi-item"),
      );
    });

    it("moves between items with ArrowDown", async () => {
      const el = await fixture<LoomiSplitButton>(basic());
      await settle(el);
      const menu = await openMenu(el);

      const items = el.querySelectorAll("loomi-dropmenu-item");
      menu.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, composed: true }),
      );
      await settle(el);
      menu.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, composed: true }),
      );
      await settle(el);

      expect(items[1].shadowRoot!.activeElement).to.equal(
        items[1].shadowRoot!.querySelector(".loomi-item"),
      );
    });

    it("closes on Escape and returns focus to the caret", async () => {
      const el = await fixture<LoomiSplitButton>(basic());
      await settle(el);
      const menu = await openMenu(el);

      menu.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true, composed: true }),
      );
      await settle(el);

      expect(el.isOpen).to.equal(false);
      expect(el.shadowRoot!.activeElement).to.equal(el.shadowRoot!.querySelector(".loomi-caret"));
    });

    it("is focusable as a host, landing on the primary half", async () => {
      const el = await fixture<LoomiSplitButton>(basic());
      await settle(el);

      el.focus();

      expect(el.shadowRoot!.activeElement).to.equal(el.shadowRoot!.querySelector(".loomi-primary"));
    });
  });

  describe("styling hooks", () => {
    it("exposes parts for both halves, the divider and the panel", async () => {
      const el = await fixture<LoomiSplitButton>(basic());
      await settle(el);

      for (const name of ["split", "primary", "divider", "caret", "panel"]) {
        expect(el.shadowRoot!.querySelector(`[part~="${name}"]`), `part ${name}`).to.exist;
      }
    });

    it("forwards each half's inner button as an exported part", async () => {
      const el = await fixture<LoomiSplitButton>(basic());
      await settle(el);

      expect(el.shadowRoot!.querySelector(".loomi-primary")!.getAttribute("exportparts")).to.equal(
        "button:primary-button",
      );
      expect(el.shadowRoot!.querySelector(".loomi-caret")!.getAttribute("exportparts")).to.equal(
        "button:caret-button",
      );
    });

    it("passes button attributes through to both halves", async () => {
      const el = await fixture<LoomiSplitButton>(html`
        <loomi-split-button color="error" size="small" radius="full" outline>
          Delete
          <loomi-dropmenu-item slot="menu">Delete all</loomi-dropmenu-item>
        </loomi-split-button>
      `);
      await settle(el);

      for (const half of [".loomi-primary", ".loomi-caret"]) {
        const button = el.shadowRoot!.querySelector(half)!;
        expect(button.getAttribute("color"), half).to.equal("error");
        expect(button.getAttribute("size"), half).to.equal("small");
        expect(button.getAttribute("radius"), half).to.equal("full");
        expect(button.hasAttribute("outline"), half).to.equal(true);
      }
    });
  });
});
