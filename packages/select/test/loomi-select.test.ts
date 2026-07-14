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
});
