import { html, fixture, expect } from "@open-wc/testing";
import "../dist/loomi-select.js";
import type { LoomiSelect } from "../dist/index.js";
import { provideLoomiIcons } from "@loomidev/icons";
import envelopeIcon from "@loomidev/icons/heroicons/outline/envelope.js";

provideLoomiIcons({ envelope: envelopeIcon });

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

  describe("prefix", () => {
    const parts = (el: LoomiSelect) => {
      const root = el.shadowRoot!;
      const label = root.querySelector(".loomi-label") as HTMLElement | null;
      // Transitions would leave the label mid-flight when measured.
      if (label) label.style.transition = "none";
      return {
        trigger: root.querySelector(".loomi-trigger") as HTMLButtonElement,
        prefix: root.querySelector(".loomi-prefix") as HTMLElement,
        value: root.querySelector(".loomi-value") as HTMLElement,
        label,
        wrapper: root.querySelector(".loomi-select") as HTMLElement,
      };
    };
    // ResizeObserver delivers on the next frame.
    const settle = async (el: LoomiSelect) => {
      await el.updateComplete;
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    };
    const expectLabelClearOfPrefix = (el: LoomiSelect, rtl = false) => {
      const { prefix, label, value } = parts(el);
      const p = prefix.getBoundingClientRect();
      const l = label!.getBoundingClientRect();
      const v = value.getBoundingClientRect();
      if (rtl) {
        expect(l.right).to.be.at.most(p.left);
        expect(Math.abs(l.right - v.right)).to.be.below(1);
      } else {
        expect(l.left).to.be.at.least(p.right);
        expect(Math.abs(l.left - v.left)).to.be.below(1);
      }
    };

    it("renders a prefix-icon inside the trigger before the value", async () => {
      const el = await fixture<LoomiSelect>(
        html`<loomi-select .data=${DATA} prefix-icon="envelope"></loomi-select>`,
      );
      const { trigger, prefix, value } = parts(el);
      expect(prefix.parentElement).to.equal(trigger);
      expect(prefix.hidden).to.equal(false);
      expect(prefix.querySelector("svg.loomi-icon path")).to.exist;
      expect(prefix.getBoundingClientRect().right).to.be.at.most(
        value.getBoundingClientRect().left,
      );
    });

    it("renders text prefixes and the prefix slot, and hides the affix when empty", async () => {
      const bare = await fixture<LoomiSelect>(html`<loomi-select .data=${DATA}></loomi-select>`);
      expect(parts(bare).prefix.hidden).to.equal(true);

      const text = await fixture<LoomiSelect>(
        html`<loomi-select .data=${DATA} prefix="+233"></loomi-select>`,
      );
      expect(parts(text).prefix.textContent!.trim()).to.equal("+233");

      const slotted = await fixture<LoomiSelect>(
        html`<loomi-select .data=${DATA}><b slot="prefix">@</b></loomi-select>`,
      );
      await slotted.updateComplete;
      expect(parts(slotted).prefix.hidden).to.equal(false);
    });

    it("keeps the label clear of the icon when empty, focused/open and filled", async () => {
      const el = await fixture<LoomiSelect>(
        html`<loomi-select .data=${DATA} label="Country" prefix-icon="envelope"></loomi-select>`,
      );
      await settle(el);
      // Empty: the label rests where the value starts.
      expectLabelClearOfPrefix(el);

      // Focused + open: floated, still after the icon.
      const { trigger, wrapper } = parts(el);
      trigger.focus();
      trigger.click();
      await settle(el);
      expect(wrapper.classList.contains("float")).to.equal(true);
      expectLabelClearOfPrefix(el);

      // Filled.
      (el.shadowRoot!.querySelector("#loomi-opt-1") as HTMLElement).click();
      await settle(el);
      expect(wrapper.classList.contains("float")).to.equal(true);
      expectLabelClearOfPrefix(el);
    });

    it("keeps the placeholder after the prefix", async () => {
      const el = await fixture<LoomiSelect>(
        html`<loomi-select .data=${DATA} placeholder="Pick one" prefix-icon="envelope"></loomi-select>`,
      );
      const { prefix, value } = parts(el);
      expect(value.classList.contains("placeholder")).to.equal(true);
      expect(value.getBoundingClientRect().left).to.be.at.least(
        prefix.getBoundingClientRect().right,
      );
    });

    it("keeps the label clear of the icon in searchable mode", async () => {
      const el = await fixture<LoomiSelect>(
        html`<loomi-select .data=${DATA} label="Country" searchable prefix-icon="envelope"></loomi-select>`,
      );
      await settle(el);
      expectLabelClearOfPrefix(el);
      parts(el).trigger.click();
      await settle(el);
      expect(el.shadowRoot!.querySelector(".loomi-search")).to.exist;
      expectLabelClearOfPrefix(el);
    });

    it("keeps the label clear of the icon in multiple mode", async () => {
      const el = await fixture<LoomiSelect>(
        html`<loomi-select .data=${DATA} label="Countries" multiple prefix-icon="envelope"></loomi-select>`,
      );
      await settle(el);
      expectLabelClearOfPrefix(el);
      parts(el).trigger.click();
      await settle(el);
      (el.shadowRoot!.querySelector("#loomi-opt-0") as HTMLElement).click();
      (el.shadowRoot!.querySelector("#loomi-opt-2") as HTMLElement).click();
      await settle(el);
      expect(el.value).to.equal("gh,ke");
      expectLabelClearOfPrefix(el);
    });

    it("mirrors the prefix and label in RTL", async () => {
      const wrap = await fixture<HTMLDivElement>(
        html`<div dir="rtl" style="width: 320px">
          <loomi-select .data=${DATA} label="Country" prefix-icon="envelope"></loomi-select>
        </div>`,
      );
      const el = wrap.querySelector("loomi-select") as LoomiSelect;
      await settle(el);
      const { trigger, prefix, value } = parts(el);
      const t = trigger.getBoundingClientRect();
      // The prefix leads on the right.
      expect(prefix.getBoundingClientRect().left).to.be.at.least(
        value.getBoundingClientRect().right,
      );
      expect(t.right - prefix.getBoundingClientRect().right).to.be.below(t.width / 4);
      expectLabelClearOfPrefix(el, true);
      trigger.click();
      await settle(el);
      expectLabelClearOfPrefix(el, true);
    });

    it('supports transparent-prefix="false" for a solid affix', async () => {
      const el = await fixture<LoomiSelect>(
        html`<loomi-select .data=${DATA} prefix="+233" transparent-prefix="false"></loomi-select>`,
      );
      const { prefix, trigger } = parts(el);
      expect(el.transparentPrefix).to.equal(false);
      expect(prefix.classList.contains("loomi-affix-solid")).to.equal(true);
      // Solid affixes run flush to the trigger's start edge.
      expect(
        prefix.getBoundingClientRect().left - trigger.getBoundingClientRect().left,
      ).to.be.below(4);

      const transparent = await fixture<LoomiSelect>(
        html`<loomi-select .data=${DATA} prefix="+233"></loomi-select>`,
      );
      expect(parts(transparent).prefix.classList.contains("loomi-affix-solid")).to.equal(false);
    });
  });
});
