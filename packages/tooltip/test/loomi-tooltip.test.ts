import { html, fixture, expect } from "@open-wc/testing";
import "../dist/index.js";
import type { LoomiTooltip } from "../dist/index.js";

describe("loomi-tooltip", () => {
  it("renders shadow content", async () => {
    const el = await fixture(html`<loomi-tooltip ></loomi-tooltip>`);
    expect(el.shadowRoot).to.exist;
    expect(el.shadowRoot!.childElementCount).to.be.greaterThan(0);
  });

  it("exposes the tip with a tooltip role", async () => {
    const el = await fixture<LoomiTooltip>(
      html`<loomi-tooltip content="Saves your work">Save</loomi-tooltip>`,
    );
    const tip = el.shadowRoot!.querySelector('[role="tooltip"]');
    expect(tip).to.exist;
    expect(tip!.textContent).to.contain("Saves your work");
  });

  it("places the tip through a placement class", async () => {
    const el = await fixture<LoomiTooltip>(
      html`<loomi-tooltip content="Hi" placement="right">Save</loomi-tooltip>`,
    );
    expect(el.shadowRoot!.querySelector(".loomi-tip")!.classList.contains("placement-right")).to.be
      .true;
  });

  it("defaults to placing the tip above the trigger", async () => {
    const el = await fixture<LoomiTooltip>(html`<loomi-tooltip content="Hi">Save</loomi-tooltip>`);
    expect(el.shadowRoot!.querySelector(".loomi-tip")!.classList.contains("placement-top")).to.be
      .true;
  });

  it("prefers slotted content over the content attribute", async () => {
    const el = await fixture<LoomiTooltip>(html`
      <loomi-tooltip content="ignored">Save<span slot="content">Rich tip</span></loomi-tooltip>
    `);
    const slot = el.shadowRoot!.querySelector('slot[name="content"]') as HTMLSlotElement;
    const assigned = slot.assignedNodes({ flatten: true });
    expect(assigned.map((n) => n.textContent!.trim())).to.include("Rich tip");
  });

  it("keeps the tip hidden until the trigger is hovered or focused", async () => {
    const el = await fixture<LoomiTooltip>(html`<loomi-tooltip content="Hi">Save</loomi-tooltip>`);
    const tip = el.shadowRoot!.querySelector(".loomi-tip") as HTMLElement;
    expect(getComputedStyle(tip).opacity).to.equal("0");
  });
});
