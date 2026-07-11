import { html, fixture, expect, oneEvent } from "@open-wc/testing";
import "../dist/loomi-button-group.js";
import type { LoomiButtonGroup, LoomiButtonGroupItem } from "../dist/index.js";

describe("loomi-button-group", () => {
  it("applies theme vars on the host so slotted items inherit them", async () => {
    const el = await fixture<LoomiButtonGroup>(html`
      <loomi-button-group color="primary" size="small">
        <loomi-button-group-item label="A" selected></loomi-button-group-item>
      </loomi-button-group>
    `);

    expect(el.style.getPropertyValue("--_loomi-accent")).to.not.equal("");
    expect(el.style.getPropertyValue("--loomi-bg-pad-x")).to.equal("0.75rem");
  });

  it("renders a shrink-wrapped system-style track", async () => {
    const wrapper = await fixture<HTMLDivElement>(html`
      <div style="width: 600px;">
        <loomi-button-group radius="small">
          <loomi-button-group-item label="Day" selected></loomi-button-group-item>
          <loomi-button-group-item label="Week"></loomi-button-group-item>
        </loomi-button-group>
      </div>
    `);
    const el = wrapper.querySelector<LoomiButtonGroup>("loomi-button-group")!;
    const track = el.shadowRoot!.querySelector<HTMLElement>(".loomi-bg-group")!;

    expect(getComputedStyle(track).display).to.equal("inline-flex");
    expect(track.getBoundingClientRect().width).to.be.lessThan(wrapper.getBoundingClientRect().width);
  });

  it("applies button-compatible radius vars on the host and inner buttons", async () => {
    const el = await fixture<LoomiButtonGroup>(html`
      <loomi-button-group radius="full">
        <loomi-button-group-item label="A" selected></loomi-button-group-item>
        <loomi-button-group-item label="B"></loomi-button-group-item>
      </loomi-button-group>
    `);

    expect(el.style.getPropertyValue("--loomi-bg-radius")).to.equal("9999px");
    expect(el.style.getPropertyValue("--loomi-bg-item-radius")).to.equal("9999px");
  });

  it("supports outline and group-level icon-only buttons with accessible labels", async () => {
    const el = await fixture<LoomiButtonGroup>(html`
      <loomi-button-group outline icon-only aria-label="Formatting">
        <loomi-button-group-item label="Bold" value="bold" icon="bold" selected></loomi-button-group-item>
        <loomi-button-group-item label="Italic" value="italic" icon="italic"></loomi-button-group-item>
      </loomi-button-group>
    `);
    const group = el.shadowRoot!.querySelector<HTMLElement>(".loomi-bg-group")!;
    const first = el.querySelector<LoomiButtonGroupItem>("loomi-button-group-item")!;
    const button = first.shadowRoot!.querySelector<HTMLButtonElement>("button")!;
    const label = first.shadowRoot!.querySelector<HTMLElement>(".loomi-bg-label")!;

    expect(el.outline).to.be.true;
    expect(el.iconOnly).to.be.true;
    expect(group.getAttribute("aria-label")).to.equal("Formatting");
    expect(button.getAttribute("aria-label")).to.equal("Bold");
    expect(label.hidden).to.be.true;
  });

  it("disables item buttons when the whole group is disabled", async () => {
    const el = await fixture<LoomiButtonGroup>(html`
      <loomi-button-group disabled>
        <loomi-button-group-item label="Day" selected></loomi-button-group-item>
      </loomi-button-group>
    `);
    const item = el.querySelector<LoomiButtonGroupItem>("loomi-button-group-item")!;
    const button = item.shadowRoot!.querySelector<HTMLButtonElement>("button")!;

    expect(button.disabled).to.be.true;
  });

  it("selects a clicked item and emits loomi-button-group-change", async () => {
    const el = await fixture<LoomiButtonGroup>(html`
      <loomi-button-group>
        <loomi-button-group-item label="Day" value="day" selected></loomi-button-group-item>
        <loomi-button-group-item label="Week" value="week"></loomi-button-group-item>
      </loomi-button-group>
    `);
    const items = el.querySelectorAll<LoomiButtonGroupItem>("loomi-button-group-item");
    const weekBtn = items[1].shadowRoot!.querySelector("button")!;

    setTimeout(() => weekBtn.click());
    const { detail } = await oneEvent(el, "loomi-button-group-change");

    expect(detail.value).to.equal("week");
    expect(detail.index).to.equal(1);
    expect(items[0].selected).to.be.false;
    expect(items[1].selected).to.be.true;
  });
});
