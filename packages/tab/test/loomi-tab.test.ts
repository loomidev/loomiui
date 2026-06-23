import { html, fixture, expect } from "@open-wc/testing";
import "../dist/loomi-tab.js";
import type { LoomiTabs } from "../dist/index.js";

describe("loomi-tabs", () => {
  it("activates the first tab by default", async () => {
    const el = await fixture<LoomiTabs>(html`
      <loomi-tabs>
        <loomi-tab label="One">First</loomi-tab>
        <loomi-tab label="Two">Second</loomi-tab>
      </loomi-tabs>
    `);
    const tabs = el.querySelectorAll("loomi-tab");
    expect(tabs[0].active).to.be.true;
    expect(tabs[1].active).to.be.false;
  });

  it("ArrowRight moves the roving tabindex and activates the next tab", async () => {
    const el = await fixture<LoomiTabs>(html`
      <loomi-tabs>
        <loomi-tab label="One">First</loomi-tab>
        <loomi-tab label="Two">Second</loomi-tab>
        <loomi-tab label="Three">Third</loomi-tab>
      </loomi-tabs>
    `);
    const buttons = () => el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".loomi-head");
    const tabs = el.querySelectorAll("loomi-tab");

    buttons()[0].focus();
    expect(buttons()[0].tabIndex).to.equal(0);
    expect(buttons()[1].tabIndex).to.equal(-1);

    el.shadowRoot!
      .querySelector(".loomi-headings")!
      .dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true }));
    await el.updateComplete;

    expect(tabs[0].active).to.be.false;
    expect(tabs[1].active).to.be.true;
    expect(buttons()[1].tabIndex).to.equal(0);
    expect(el.shadowRoot!.activeElement).to.equal(buttons()[1]);
  });

  it("End jumps to the last enabled tab, skipping a disabled one", async () => {
    const el = await fixture<LoomiTabs>(html`
      <loomi-tabs>
        <loomi-tab label="One" active>First</loomi-tab>
        <loomi-tab label="Two" disabled>Second</loomi-tab>
        <loomi-tab label="Three">Third</loomi-tab>
      </loomi-tabs>
    `);
    el.shadowRoot!
      .querySelector(".loomi-headings")!
      .dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true, cancelable: true }));
    await el.updateComplete;

    const tabs = el.querySelectorAll("loomi-tab");
    expect(tabs[2].active).to.be.true;
  });
});
