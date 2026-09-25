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

  describe("accessible name", () => {
    it("names the trigger from its label while only the placeholder shows", async () => {
      const el = await fixture<LoomiSelect>(
        html`<loomi-select label="Crop" placeholder="All crops" .data=${DATA}></loomi-select>`,
      );
      const trigger = el.shadowRoot!.querySelector<HTMLButtonElement>(".loomi-trigger")!;
      const label = el.shadowRoot!.querySelector<HTMLLabelElement>(".loomi-label")!;

      // The value span is the hidden sizer echoing the label here, so only the label
      // names the trigger — pointing at both would read "Crop Crop".
      expect(trigger.getAttribute("aria-labelledby")).to.equal(label.id);
      await expect(el).to.be.accessible();
    });

    it("announces both the label and the current value once one is chosen", async () => {
      const el = await fixture<LoomiSelect>(
        html`<loomi-select label="Crop" .data=${DATA} selected-value="ng"></loomi-select>`,
      );
      const trigger = el.shadowRoot!.querySelector<HTMLButtonElement>(".loomi-trigger")!;
      const ids = trigger.getAttribute("aria-labelledby")!.split(" ");

      expect(ids.map((id) => el.shadowRoot!.getElementById(id)!.textContent)).to.deep.equal([
        "Crop",
        "Nigeria",
      ]);
      await expect(el).to.be.accessible();
    });

    it("forwards a host aria-label to the trigger when there is no label", async () => {
      const el = await fixture<LoomiSelect>(
        html`<loomi-select aria-label="Workspace" .data=${DATA}></loomi-select>`,
      );
      const trigger = el.shadowRoot!.querySelector<HTMLButtonElement>(".loomi-trigger")!;

      expect(trigger.getAttribute("aria-label")).to.equal("Workspace");
      expect(trigger.hasAttribute("aria-labelledby")).to.be.false;
      await expect(el).to.be.accessible();
    });

    it("names the open listbox after the label or forwarded aria-label", async () => {
      const labelled = await fixture<LoomiSelect>(
        html`<loomi-select label="Crop" .data=${DATA}></loomi-select>`,
      );
      labelled.shadowRoot!.querySelector<HTMLButtonElement>(".loomi-trigger")!.click();
      await labelled.updateComplete;
      const panel = labelled.shadowRoot!.querySelector<HTMLElement>(".loomi-panel")!;
      expect(panel.getAttribute("role")).to.equal("listbox");
      expect(panel.getAttribute("aria-labelledby")).to.equal("loomi-label");
      // No axe pass while open: the trigger's aria-activedescendant is not an allowed
      // attribute on role=button (axe aria-allowed-attr). That predates the naming work
      // and needs the trigger moved to role=combobox, tracked separately.

      const unlabelled = await fixture<LoomiSelect>(
        html`<loomi-select aria-label="Workspace" .data=${DATA}></loomi-select>`,
      );
      unlabelled.shadowRoot!.querySelector<HTMLButtonElement>(".loomi-trigger")!.click();
      await unlabelled.updateComplete;
      expect(
        unlabelled.shadowRoot!.querySelector(".loomi-panel")!.getAttribute("aria-label"),
      ).to.equal("Workspace");
    });
  });
});
