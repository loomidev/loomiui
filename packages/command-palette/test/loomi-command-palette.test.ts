import { html, fixture, expect, nextFrame } from "@open-wc/testing";
import "../dist/index.js";
import type { LoomiCommandPalette } from "../dist/index.js";

const ITEMS = [
  { id: "new", label: "New file", group: "File" },
  { id: "open", label: "Open file", group: "File" },
  { id: "off", label: "Unavailable", group: "File", disabled: true },
  { id: "quit", label: "Quit", group: "App" },
];

const search = (el: LoomiCommandPalette): HTMLInputElement =>
  el.shadowRoot!.querySelector(".search") as HTMLInputElement;

const options = (el: LoomiCommandPalette): HTMLElement[] =>
  Array.from(el.shadowRoot!.querySelectorAll('[role="option"]'));

const activeId = (el: LoomiCommandPalette): string | null =>
  search(el).getAttribute("aria-activedescendant");

async function press(el: LoomiCommandPalette, key: string): Promise<void> {
  el.shadowRoot!.querySelector(".dialog")!.dispatchEvent(
    new KeyboardEvent("keydown", { key, bubbles: true }),
  );
  await el.updateComplete;
}

async function openPalette(): Promise<LoomiCommandPalette> {
  const el = await fixture<LoomiCommandPalette>(
    html`<loomi-command-palette .items=${ITEMS}></loomi-command-palette>`,
  );
  el.openPalette();
  await el.updateComplete;
  await nextFrame();
  return el;
}

describe("loomi-command-palette", () => {
  it("renders shadow content", async () => {
    const el = await fixture(html`<loomi-command-palette></loomi-command-palette>`);
    expect(el.shadowRoot).to.exist;
    expect(el.shadowRoot!.childElementCount).to.be.greaterThan(0);
  });

  it("renders a modal dialog with a labelled listbox when opened", async () => {
    const el = await openPalette();
    const dialog = el.shadowRoot!.querySelector('[role="dialog"]')!;
    expect(dialog.getAttribute("aria-modal")).to.equal("true");
    expect(el.shadowRoot!.querySelector('[role="listbox"]')).to.exist;
    expect(options(el)).to.have.lengthOf(ITEMS.length);
  });

  describe("APG combobox wiring", () => {
    it("marks the search field as a combobox controlling the listbox", async () => {
      const el = await openPalette();
      const field = search(el);
      expect(field.getAttribute("role")).to.equal("combobox");
      expect(field.getAttribute("aria-expanded")).to.equal("true");
      expect(field.getAttribute("aria-controls")).to.equal(
        el.shadowRoot!.querySelector('[role="listbox"]')!.id,
      );
    });

    it("points aria-activedescendant at the highlighted option", async () => {
      const el = await openPalette();
      // Focus stays in the input, so the active option is only announced through
      // aria-activedescendant — aria-selected alone is not enough.
      expect(activeId(el)).to.equal(options(el)[0].id);

      await press(el, "ArrowDown");
      expect(activeId(el)).to.equal(options(el)[1].id);
    });

    it("keeps the options out of the tab order", async () => {
      const el = await openPalette();
      for (const option of options(el)) {
        expect(option.getAttribute("tabindex")).to.equal("-1");
      }
    });
  });

  describe("keyboard", () => {
    it("moves the highlight with the arrow keys and wraps", async () => {
      const el = await openPalette();
      expect(options(el)[0].getAttribute("aria-selected")).to.equal("true");

      await press(el, "ArrowUp");
      expect(options(el).at(-1)!.getAttribute("aria-selected"), "wraps to the last").to.equal(
        "true",
      );
    });

    it("skips disabled items when moving", async () => {
      const el = await openPalette();
      await press(el, "ArrowDown"); // -> Open file
      await press(el, "ArrowDown"); // skips the disabled entry -> Quit
      expect(options(el)[2].getAttribute("aria-selected"), "disabled stays unselected").to.equal(
        "false",
      );
      expect(options(el)[3].getAttribute("aria-selected")).to.equal("true");
    });

    it("jumps to the first and last enabled items with Home and End", async () => {
      const el = await openPalette();
      await press(el, "End");
      expect(options(el)[3].getAttribute("aria-selected")).to.equal("true");

      await press(el, "Home");
      expect(options(el)[0].getAttribute("aria-selected")).to.equal("true");
    });

    it("does not let Tab escape the modal dialog", async () => {
      const el = await openPalette();
      const event = new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true });
      el.shadowRoot!.querySelector(".dialog")!.dispatchEvent(event);
      expect(event.defaultPrevented).to.be.true;
    });

    it("closes on Escape", async () => {
      const el = await openPalette();
      await press(el, "Escape");
      expect(el.shadowRoot!.querySelector('[role="dialog"]')).to.not.exist;
    });
  });

  describe("filtering", () => {
    it("narrows the listbox to matching commands", async () => {
      const el = await openPalette();
      const field = search(el);
      field.value = "quit";
      field.dispatchEvent(new Event("input", { bubbles: true }));
      await el.updateComplete;

      expect(options(el).map((o) => o.textContent!.trim())).to.have.lengthOf(1);
    });
  });

  describe("focus", () => {
    it("returns focus where it came from when closed", async () => {
      const host = await fixture(html`
        <div>
          <button id="opener">Open</button>
          <loomi-command-palette .items=${ITEMS}></loomi-command-palette>
        </div>
      `);
      const opener = host.querySelector("#opener") as HTMLButtonElement;
      const el = host.querySelector("loomi-command-palette") as LoomiCommandPalette;

      opener.focus();
      el.openPalette();
      await el.updateComplete;
      await nextFrame();

      el.closePalette();
      await el.updateComplete;
      expect(document.activeElement).to.equal(opener);
    });
  });
});
