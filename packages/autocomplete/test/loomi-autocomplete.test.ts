import { html, fixture, expect } from "@open-wc/testing";
import { oneEvent } from "@open-wc/testing";
import "../dist/index.js";
import type { LoomiAutocomplete } from "../dist/index.js";

const DATA = [
  { label: "Ghana", value: "gh" },
  { label: "Guinea", value: "gn" },
  { label: "Kenya", value: "ke" },
];

const input = (el: LoomiAutocomplete): HTMLInputElement => el.shadowRoot!.querySelector("input")!;

const options = (el: LoomiAutocomplete): HTMLElement[] =>
  Array.from(el.shadowRoot!.querySelectorAll(".loomi-option"));

/** Types into the real input the way a user would, and lets the component settle. */
async function type(el: LoomiAutocomplete, text: string): Promise<void> {
  const field = input(el);
  field.focus();
  field.value = text;
  field.dispatchEvent(new Event("input", { bubbles: true }));
  await el.updateComplete;
}

async function press(el: LoomiAutocomplete, key: string): Promise<void> {
  input(el).dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
  await el.updateComplete;
}

describe("loomi-autocomplete", () => {
  it("opens a filtered panel while typing", async () => {
    const el = await fixture<LoomiAutocomplete>(
      html`<loomi-autocomplete .data=${DATA}></loomi-autocomplete>`,
    );
    const input = el.shadowRoot!.querySelector("input")!;
    input.focus();
    input.value = "g";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await el.updateComplete;

    const options = el.shadowRoot!.querySelectorAll(".loomi-option");
    expect(options.length).to.equal(2);
  });

  it("fires loomi-select when an option is chosen", async () => {
    const el = await fixture<LoomiAutocomplete>(
      html`<loomi-autocomplete .data=${DATA}></loomi-autocomplete>`,
    );
    const input = el.shadowRoot!.querySelector("input")!;
    input.focus();
    input.value = "ken";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await el.updateComplete;

    const option = el.shadowRoot!.querySelector(".loomi-option") as HTMLElement;
    setTimeout(() => option.click());
    const ev = (await oneEvent(el, "loomi-select")) as CustomEvent;
    expect(ev.detail.value).to.equal("ke");
  });

  describe("filtering", () => {
    it("matches case-insensitively", async () => {
      const el = await fixture<LoomiAutocomplete>(
        html`<loomi-autocomplete .data=${DATA}></loomi-autocomplete>`,
      );
      await type(el, "GHA");
      expect(options(el).map((o) => o.textContent!.trim())).to.eql(["Ghana"]);
    });

    it("shows an empty state rather than options when nothing matches", async () => {
      const el = await fixture<LoomiAutocomplete>(
        html`<loomi-autocomplete .data=${DATA}></loomi-autocomplete>`,
      );
      await type(el, "zzz");
      expect(options(el)).to.be.empty;
      expect(el.shadowRoot!.querySelector(".loomi-empty")).to.exist;
    });
  });

  describe("keyboard", () => {
    it("highlights the first match as soon as there is one", async () => {
      const el = await fixture<LoomiAutocomplete>(
        html`<loomi-autocomplete .data=${DATA}></loomi-autocomplete>`,
      );
      await type(el, "g");
      expect(options(el)[0].classList.contains("active")).to.be.true;
    });

    it("moves the active option with ArrowDown and wraps at the end", async () => {
      const el = await fixture<LoomiAutocomplete>(
        html`<loomi-autocomplete .data=${DATA}></loomi-autocomplete>`,
      );
      await type(el, "g"); // two matches, the first already active

      await press(el, "ArrowDown");
      expect(options(el)[1].classList.contains("active")).to.be.true;

      await press(el, "ArrowDown");
      expect(options(el)[0].classList.contains("active"), "wraps to the first").to.be.true;
    });

    it("wraps backwards from the first option with ArrowUp", async () => {
      const el = await fixture<LoomiAutocomplete>(
        html`<loomi-autocomplete .data=${DATA}></loomi-autocomplete>`,
      );
      await type(el, "g"); // first option active
      await press(el, "ArrowUp");
      expect(options(el).at(-1)!.classList.contains("active")).to.be.true;
    });

    it("chooses the active option on Enter", async () => {
      const el = await fixture<LoomiAutocomplete>(
        html`<loomi-autocomplete .data=${DATA}></loomi-autocomplete>`,
      );
      await type(el, "g");
      await press(el, "ArrowDown"); // move off the auto-highlighted first match

      setTimeout(() => {
        input(el).dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
      });
      const ev = (await oneEvent(el, "loomi-select")) as CustomEvent;
      expect(ev.detail.value).to.equal("gn");
    });

    it("closes the panel on Escape", async () => {
      const el = await fixture<LoomiAutocomplete>(
        html`<loomi-autocomplete .data=${DATA}></loomi-autocomplete>`,
      );
      await type(el, "g");
      expect(options(el)).not.to.be.empty;

      await press(el, "Escape");
      expect(el.shadowRoot!.querySelector(".loomi-panel")).to.not.exist;
    });
  });

  describe("accessibility", () => {
    it("marks the input as a combobox and tracks its expanded state", async () => {
      const el = await fixture<LoomiAutocomplete>(
        html`<loomi-autocomplete .data=${DATA}></loomi-autocomplete>`,
      );
      // aria-expanded is only permitted on a combobox — a plain textbox may not carry it.
      expect(input(el).getAttribute("role")).to.equal("combobox");
      expect(input(el).getAttribute("aria-expanded")).to.equal("false");

      await type(el, "g");
      expect(input(el).getAttribute("aria-expanded")).to.equal("true");
    });
  });
});
