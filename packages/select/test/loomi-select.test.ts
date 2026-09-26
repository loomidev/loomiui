import { html, fixture, expect } from "@open-wc/testing";
import "../dist/loomi-select.js";
import type { LoomiSelect } from "../dist/index.js";

const DATA = [
  { label: "Ghana", value: "gh" },
  { label: "Nigeria", value: "ng" },
  { label: "Kenya", value: "ke" },
];

describe("loomi-select", () => {
  it("opens on Enter and sets aria-activedescendant to the first option", async () => {
    const el = await fixture<LoomiSelect>(html`<loomi-select .data=${DATA}></loomi-select>`);
    const trigger = el.shadowRoot!.querySelector(".loomi-trigger") as HTMLButtonElement;
    trigger.focus();
    trigger.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }),
    );
    await el.updateComplete;

    expect(trigger.getAttribute("aria-expanded")).to.equal("true");
    expect(trigger.getAttribute("aria-activedescendant")).to.equal("loomi-opt-0");
  });

  it("ArrowDown moves aria-activedescendant without choosing a value yet", async () => {
    const el = await fixture<LoomiSelect>(html`<loomi-select .data=${DATA}></loomi-select>`);
    const wrapper = el.shadowRoot!.querySelector(".loomi-select") as HTMLElement;
    const trigger = el.shadowRoot!.querySelector(".loomi-trigger") as HTMLButtonElement;
    trigger.click();
    await el.updateComplete;

    wrapper.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }),
    );
    await el.updateComplete;

    expect(trigger.getAttribute("aria-activedescendant")).to.equal("loomi-opt-1");
    expect(el.shadowRoot!.querySelectorAll(".loomi-option.active")).to.have.lengthOf(1);
  });

  it("Enter chooses the highlighted option and closes the listbox", async () => {
    const el = await fixture<LoomiSelect>(html`<loomi-select .data=${DATA}></loomi-select>`);
    const wrapper = el.shadowRoot!.querySelector(".loomi-select") as HTMLElement;
    const trigger = el.shadowRoot!.querySelector(".loomi-trigger") as HTMLButtonElement;
    trigger.click();
    await el.updateComplete;

    wrapper.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }),
    );
    await el.updateComplete;
    wrapper.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }),
    );
    await el.updateComplete;

    expect(trigger.getAttribute("aria-expanded")).to.equal("false");
    expect(trigger.textContent).to.include("Nigeria");
  });

  it("Escape closes the listbox without changing the selection", async () => {
    const el = await fixture<LoomiSelect>(
      html`<loomi-select .data=${DATA} selected-value="gh"></loomi-select>`,
    );
    const wrapper = el.shadowRoot!.querySelector(".loomi-select") as HTMLElement;
    const trigger = el.shadowRoot!.querySelector(".loomi-trigger") as HTMLButtonElement;
    trigger.click();
    await el.updateComplete;

    wrapper.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }),
    );
    await el.updateComplete;

    expect(trigger.getAttribute("aria-expanded")).to.equal("false");
    expect(trigger.textContent).to.include("Ghana");
  });

  it("reserves width for the closed floating label before the select is opened", async () => {
    const wrapper = await fixture<HTMLDivElement>(html`
      <div style="display:inline-flex">
        <loomi-select label="Where are you from?" required .data=${DATA}></loomi-select>
      </div>
    `);
    const el = wrapper.querySelector<LoomiSelect>("loomi-select")!;
    const trigger = el.shadowRoot!.querySelector(".loomi-trigger") as HTMLButtonElement;
    const label = el.shadowRoot!.querySelector(".loomi-label") as HTMLLabelElement;
    const sizer = el.shadowRoot!.querySelector(".loomi-value.sizer") as HTMLElement;

    expect(sizer.textContent).to.equal("Where are you from? *");
    expect(getComputedStyle(sizer).visibility).to.equal("hidden");
    expect(trigger.getBoundingClientRect().width).to.be.greaterThan(
      label.getBoundingClientRect().width,
    );
  });

  it("treats an empty value as a selection when the options offer one", async () => {
    // "All categories" filters carry value="" as their unfiltered choice. Read
    // as "nothing selected", the trigger fell back to the placeholder and the
    // caller's chosen option went unshown.
    const withAll = [{ label: "All categories", value: "" }, ...DATA];
    const el = await fixture<LoomiSelect>(
      html`<loomi-select .data=${withAll} selected-value=""></loomi-select>`,
    );
    await el.updateComplete;

    const trigger = el.shadowRoot!.querySelector(".loomi-trigger") as HTMLButtonElement;
    expect(trigger.textContent).to.contain("All categories");
  });

  it("still shows the placeholder when no option has an empty value", async () => {
    const el = await fixture<LoomiSelect>(
      html`<loomi-select .data=${DATA} placeholder="Pick one" selected-value=""></loomi-select>`,
    );
    await el.updateComplete;

    const trigger = el.shadowRoot!.querySelector(".loomi-trigger") as HTMLButtonElement;
    expect(trigger.textContent).to.contain("Pick one");
  });

  it("re-resolves the selection when options arrive after the value", async () => {
    // Frameworks commonly set `selected-value` before `.data` has loaded.
    const el = await fixture<LoomiSelect>(html`<loomi-select selected-value=""></loomi-select>`);
    await el.updateComplete;

    el.data = [{ label: "Everything", value: "" }, ...DATA];
    await el.updateComplete;

    const trigger = el.shadowRoot!.querySelector(".loomi-trigger") as HTMLButtonElement;
    expect(trigger.textContent).to.contain("Everything");
  });
  it("opens its panel without growing a scrolling ancestor", async () => {
    const box = await fixture<HTMLDivElement>(html`
      <div style="overflow-y:auto;height:120px;padding:8px">
        <loomi-select label="Fruit">
          <option value="a">Apple</option>
          <option value="b">Banana</option>
          <option value="c">Cherry</option>
          <option value="d">Date</option>
        </loomi-select>
      </div>
    `);
    const el = box.querySelector<LoomiSelect>("loomi-select")!;
    await el.updateComplete;
    const before = box.scrollHeight;
    const trigger = el.shadowRoot!.querySelector<HTMLButtonElement>(".loomi-trigger")!;
    trigger.click();
    await el.updateComplete;

    const panel = el.shadowRoot!.querySelector<HTMLElement>(".loomi-panel")!;
    expect(panel.matches(":popover-open")).to.be.true;
    expect(box.scrollHeight).to.equal(before);
    const t = trigger.getBoundingClientRect();
    expect(panel.offsetWidth).to.be.closeTo(t.width, 1);
    expect(parseFloat(panel.style.left)).to.be.closeTo(t.left, 1);
  });

  describe("combobox semantics and accessible name", () => {
    const trig = (el: LoomiSelect) =>
      el.shadowRoot!.querySelector<HTMLButtonElement>(".loomi-trigger")!;
    const open = async (el: LoomiSelect) => {
      trig(el).click();
      await el.updateComplete;
      return el.shadowRoot!.querySelector<HTMLElement>('[role="listbox"]')!;
    };

    it("is a select-only combobox controlling the listbox while open", async () => {
      const el = await fixture<LoomiSelect>(
        html`<loomi-select label="Crop" .data=${DATA}></loomi-select>`,
      );
      const trigger = trig(el);
      expect(trigger.getAttribute("role")).to.equal("combobox");
      expect(trigger.getAttribute("aria-haspopup")).to.equal("listbox");
      expect(trigger.hasAttribute("aria-controls")).to.be.false;

      const panel = await open(el);
      expect(panel.getAttribute("role")).to.equal("listbox");
      expect(trigger.getAttribute("aria-controls")).to.equal(panel.id);
      expect(trigger.getAttribute("aria-expanded")).to.equal("true");
      expect(trigger.getAttribute("aria-activedescendant")).to.equal("loomi-opt-0");
      await expect(el).to.be.accessible();
    });

    it("names the trigger and listbox from the label only, leaving the value as content", async () => {
      const el = await fixture<LoomiSelect>(
        html`<loomi-select label="Crop" .data=${DATA} selected-value="ng"></loomi-select>`,
      );
      // The value is the combobox's content (read as its value); referencing it in the
      // name as well would announce it twice.
      expect(trig(el).getAttribute("aria-labelledby")).to.equal("loomi-label");
      expect(trig(el).textContent).to.include("Nigeria");
      await expect(el).to.be.accessible();

      const panel = await open(el);
      expect(panel.getAttribute("aria-labelledby")).to.equal("loomi-label");
      await expect(el).to.be.accessible();
    });

    it("passes axe with a label and only the placeholder showing", async () => {
      const el = await fixture<LoomiSelect>(
        html`<loomi-select label="Crop" placeholder="All crops" .data=${DATA}></loomi-select>`,
      );
      expect(trig(el).getAttribute("aria-labelledby")).to.equal("loomi-label");
      await expect(el).to.be.accessible();
    });

    it("uses a forwarded host aria-label when there is no label", async () => {
      const el = await fixture<LoomiSelect>(
        html`<loomi-select aria-label="Workspace" .data=${DATA}></loomi-select>`,
      );
      expect(trig(el).getAttribute("aria-label")).to.equal("Workspace");
      expect(trig(el).hasAttribute("aria-labelledby")).to.be.false;
      await expect(el).to.be.accessible();

      const panel = await open(el);
      expect(panel.getAttribute("aria-label")).to.equal("Workspace");
      await expect(el).to.be.accessible();
    });

    it("falls back to the placeholder text when there is neither label nor aria-label", async () => {
      const el = await fixture<LoomiSelect>(
        html`<loomi-select placeholder="Pick a country" .data=${DATA}></loomi-select>`,
      );
      const valueId = trig(el).getAttribute("aria-labelledby")!;
      expect(el.shadowRoot!.getElementById(valueId)!.textContent).to.equal("Pick a country");
      await expect(el).to.be.accessible();

      await open(el);
      await expect(el).to.be.accessible();
    });

    it("passes axe open with search and multiple selection", async () => {
      const el = await fixture<LoomiSelect>(
        html`<loomi-select label="Crops" searchable multiple .data=${DATA}></loomi-select>`,
      );
      await open(el);
      await el.updateComplete;
      const search = el.shadowRoot!.querySelector<HTMLInputElement>(".loomi-search")!;
      expect(el.shadowRoot!.activeElement).to.equal(search);
      expect(search.getAttribute("aria-controls")).to.equal("loomi-listbox");
      expect(search.getAttribute("aria-activedescendant")).to.equal("loomi-opt-0");
      await expect(el).to.be.accessible();
    });
  });

  it("controls the empty-state panel, not an empty listbox, when there are no options", async () => {
    const el = await fixture<LoomiSelect>(
      html`<loomi-select label="Crop" empty-action-label="Add a crop"></loomi-select>`,
    );
    const trigger = el.shadowRoot!.querySelector<HTMLButtonElement>(".loomi-trigger")!;
    trigger.click();
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector(".loomi-empty")).to.exist;
    expect(el.shadowRoot!.querySelector('[role="listbox"]')).to.not.exist;
    expect(trigger.getAttribute("aria-controls")).to.equal(
      el.shadowRoot!.querySelector(".loomi-panel")!.id,
    );
    await expect(el).to.be.accessible();
  });
});
