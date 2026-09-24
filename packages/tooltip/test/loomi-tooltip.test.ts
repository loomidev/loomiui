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
    expect(getComputedStyle(tip).display).to.equal("none");

    el.dispatchEvent(new MouseEvent("mouseenter"));
    await el.updateComplete;
    expect(tip.matches(":popover-open")).to.be.true;
    expect(getComputedStyle(tip).display).to.equal("block");

    el.dispatchEvent(new MouseEvent("mouseleave"));
    await el.updateComplete;
    expect(getComputedStyle(tip).display).to.equal("none");
  });

  it("shows on focus and hides on Escape", async () => {
    const el = await fixture<LoomiTooltip>(
      html`<loomi-tooltip content="Hi"><button>Save</button></loomi-tooltip>`,
    );
    const tip = el.shadowRoot!.querySelector(".loomi-tip") as HTMLElement;
    el.querySelector("button")!.focus();
    await el.updateComplete;
    expect(tip.matches(":popover-open")).to.be.true;

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await el.updateComplete;
    expect(tip.matches(":popover-open")).to.be.false;
  });

  it("never widens a scrolling ancestor, hidden or shown", async () => {
    const wrap = await fixture<HTMLElement>(html`
      <div style="overflow-x:auto;width:300px">
        <div style="display:flex;justify-content:flex-end">
          <loomi-tooltip content="A long tooltip that would overflow the right edge">
            <button>Remove</button>
          </loomi-tooltip>
        </div>
      </div>
    `);
    const el = wrap.querySelector("loomi-tooltip")!;
    await el.updateComplete;
    expect(wrap.scrollWidth).to.equal(wrap.clientWidth);

    await el.show();
    expect(wrap.scrollWidth).to.equal(wrap.clientWidth);
  });

  it("stays inside the viewport and keeps its arrow on the trigger", async () => {
    const el = await fixture<LoomiTooltip>(html`
      <loomi-tooltip
        content="A long tooltip near the right edge of the viewport"
        placement="bottom"
        style="position:fixed;right:0;top:40px"
      >
        <button>Remove</button>
      </loomi-tooltip>
    `);
    await el.show();
    const tip = el.shadowRoot!.querySelector(".loomi-tip") as HTMLElement;
    const left = parseFloat(tip.style.left);
    expect(left + tip.offsetWidth).to.be.at.most(document.documentElement.clientWidth - 8);

    const trigger = el.getBoundingClientRect();
    const arrow = parseFloat(tip.style.getPropertyValue("--_loomi-tooltip-arrow"));
    expect(left + arrow).to.be.closeTo(trigger.left + trigger.width / 2, 1);
  });

  it("flips to the opposite side when the preferred one has no room", async () => {
    const el = await fixture<LoomiTooltip>(html`
      <loomi-tooltip content="Hi" style="position:fixed;left:40px;top:0">
        <button>Save</button>
      </loomi-tooltip>
    `);
    await el.show();
    const tip = el.shadowRoot!.querySelector(".loomi-tip") as HTMLElement;
    expect(tip.classList.contains("placement-bottom")).to.be.true;
    expect(parseFloat(tip.style.top)).to.be.at.least(el.getBoundingClientRect().bottom);
  });
});
