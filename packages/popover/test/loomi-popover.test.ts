import { html, fixture, expect } from "@open-wc/testing";
import "../dist/loomi-popover.js";
import type { LoomiPopover } from "../dist/index.js";

describe("loomi-popover", () => {
  it("opens and closes via the trigger click", async () => {
    const el = await fixture<LoomiPopover>(html`<loomi-popover><p>Content</p></loomi-popover>`);
    expect(el.isOpen).to.equal(false);

    el.shadowRoot!.querySelector<HTMLButtonElement>(".loomi-trigger")!.click();
    await el.updateComplete;
    expect(el.isOpen).to.equal(true);
    expect(el.shadowRoot!.querySelector(".loomi-panel")).to.exist;

    el.shadowRoot!.querySelector<HTMLButtonElement>(".loomi-trigger")!.click();
    await el.updateComplete;
    expect(el.isOpen).to.equal(false);
    expect(el.shadowRoot!.querySelector(".loomi-panel")).to.not.exist;
  });

  it("fires loomi-toggle with the open state", async () => {
    const el = await fixture<LoomiPopover>(html`<loomi-popover><p>Content</p></loomi-popover>`);
    const states: boolean[] = [];
    el.addEventListener("loomi-toggle", (event) => states.push((event as CustomEvent).detail.open));

    el.show();
    await el.updateComplete;
    el.hide();
    await el.updateComplete;

    expect(states).to.deep.equal([true, false]);
  });

  it("does not open when disabled", async () => {
    const el = await fixture<LoomiPopover>(html`<loomi-popover disabled><p>Content</p></loomi-popover>`);

    el.shadowRoot!.querySelector<HTMLButtonElement>(".loomi-trigger")!.click();
    await el.updateComplete;
    expect(el.isOpen).to.equal(false);

    el.show();
    await el.updateComplete;
    expect(el.isOpen).to.equal(false);
  });
});
