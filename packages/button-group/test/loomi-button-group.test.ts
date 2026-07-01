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

  it("selects a clicked item and emits button-group-change", async () => {
    const el = await fixture<LoomiButtonGroup>(html`
      <loomi-button-group>
        <loomi-button-group-item label="Day" value="day" selected></loomi-button-group-item>
        <loomi-button-group-item label="Week" value="week"></loomi-button-group-item>
      </loomi-button-group>
    `);
    const items = el.querySelectorAll<LoomiButtonGroupItem>("loomi-button-group-item");
    const weekBtn = items[1].shadowRoot!.querySelector("button")!;

    setTimeout(() => weekBtn.click());
    const { detail } = await oneEvent(el, "button-group-change");

    expect(detail.value).to.equal("week");
    expect(detail.index).to.equal(1);
    expect(items[0].selected).to.be.false;
    expect(items[1].selected).to.be.true;
  });
});
