import { html, fixture, expect, oneEvent } from "@open-wc/testing";
import "../dist/loomi-tag-input.js";
import type { LoomiTagInput } from "../dist/index.js";

const pressEnter = (input: HTMLInputElement) => {
  input.dispatchEvent(
    new KeyboardEvent("keydown", { key: "Enter", bubbles: true, composed: true }),
  );
};

describe("loomi-tag-input", () => {
  it("turns the draft text into an inside tag on Enter", async () => {
    const el = await fixture<LoomiTagInput>(
      html`<loomi-tag-input placeholder="Add tag"></loomi-tag-input>`,
    );
    const input = el.shadowRoot!.querySelector("input")!;

    input.value = "Design";
    input.dispatchEvent(new InputEvent("input", { bubbles: true, composed: true }));
    const changed = oneEvent(el, "change");
    pressEnter(input);
    await changed;
    await el.updateComplete;

    expect(el.value).to.equal("Design");
    expect(el.tags).to.deep.equal(["Design"]);
    expect(input.value).to.equal("");
    expect(el.shadowRoot!.querySelector(".loomi-field .loomi-tag")!.textContent!.trim()).to.equal(
      "Design",
    );
  });

  it("keeps tags beneath the field in below mode", async () => {
    const el = await fixture<LoomiTagInput>(
      html`<loomi-tag-input mode="below" value="Marketing,mike"></loomi-tag-input>`,
    );
    await el.updateComplete;

    const fieldTags = el.shadowRoot!.querySelectorAll(".loomi-field .loomi-tag");
    const belowTags = el.shadowRoot!.querySelectorAll(".mode-below + .loomi-tags .loomi-tag");

    expect(fieldTags.length).to.equal(0);
    expect(belowTags.length).to.equal(2);
    expect(el.tags).to.deep.equal(["Marketing", "mike"]);
  });

  it("removes a tag with its x button", async () => {
    const el = await fixture<LoomiTagInput>(
      html`<loomi-tag-input value="Design,Engineering"></loomi-tag-input>`,
    );
    await el.updateComplete;

    const changed = oneEvent(el, "change");
    (el.shadowRoot!.querySelector(".loomi-tag-remove") as HTMLButtonElement).click();
    await changed;
    await el.updateComplete;

    expect(el.value).to.equal("Engineering");
    expect(el.tags).to.deep.equal(["Engineering"]);
  });

  it("submits the comma-separated tag value with a form", async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form>
        <loomi-tag-input name="teams" value="Design,Engineering"></loomi-tag-input>
      </form>
    `);
    const data = new FormData(form);

    expect(data.get("teams")).to.equal("Design,Engineering");
  });

  it("validates required when no tags exist", async () => {
    const el = await fixture<LoomiTagInput>(html`<loomi-tag-input required></loomi-tag-input>`);

    const ok = el.validate();
    await el.updateComplete;

    expect(ok).to.be.false;
    expect(el.invalid).to.be.true;
    expect(el.hasAttribute("invalid")).to.be.true;
  });

  describe("autocomplete combobox wiring", () => {
    const DATA = [
      { label: "Ghana", value: "gh" },
      { label: "Guinea", value: "gn" },
    ];

    const field = (el: LoomiTagInput): HTMLInputElement =>
      el.shadowRoot!.querySelector(".loomi-input") as HTMLInputElement;

    const options = (el: LoomiTagInput): HTMLElement[] =>
      Array.from(el.shadowRoot!.querySelectorAll('[role="option"]'));

    async function type(el: LoomiTagInput, text: string): Promise<void> {
      const input = field(el);
      input.focus();
      input.value = text;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      await el.updateComplete;
    }

    const press = async (el: LoomiTagInput, key: string): Promise<void> => {
      field(el).dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
      await el.updateComplete;
    };

    it("marks the field a combobox and tracks its expanded state", async () => {
      const el = await fixture<LoomiTagInput>(
        html`<loomi-tag-input .autocompleteData=${DATA}></loomi-tag-input>`,
      );
      expect(field(el).getAttribute("role")).to.equal("combobox");
      expect(field(el).getAttribute("aria-expanded")).to.equal("false");

      await type(el, "g");
      expect(field(el).getAttribute("aria-expanded")).to.equal("true");
      expect(options(el).length).to.be.greaterThan(0);
    });

    it("points aria-activedescendant at the highlighted suggestion", async () => {
      const el = await fixture<LoomiTagInput>(
        html`<loomi-tag-input .autocompleteData=${DATA}></loomi-tag-input>`,
      );
      await type(el, "g");
      await press(el, "ArrowDown");

      const active = options(el).find((o) => o.getAttribute("aria-selected") === "true")!;
      // Focus stays in the text field, so the highlight is only announced through
      // aria-activedescendant — aria-selected alone reaches nobody.
      expect(active.id).to.not.be.empty;
      expect(field(el).getAttribute("aria-activedescendant")).to.equal(active.id);
    });

    it("points the field at the listbox it controls", async () => {
      const el = await fixture<LoomiTagInput>(
        html`<loomi-tag-input .autocompleteData=${DATA}></loomi-tag-input>`,
      );
      await type(el, "g");
      const listbox = el.shadowRoot!.querySelector('[role="listbox"]')!;
      expect(field(el).getAttribute("aria-controls")).to.equal(listbox.id);
    });
  });
});
