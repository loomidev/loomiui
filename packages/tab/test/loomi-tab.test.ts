import { html, fixture, expect } from "@open-wc/testing";
import "../dist/loomi-tab.js";
import type { LoomiTabs } from "../dist/index.js";

describe("loomi-tabs", () => {
  const nextFrame = (): Promise<void> => new Promise((resolve) => requestAnimationFrame(() => resolve()));

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

  it("uses the dark tab baseline when the page is in dark mode", async () => {
    document.documentElement.classList.add("dark");
    try {
      const el = await fixture<LoomiTabs>(html`
        <loomi-tabs>
          <loomi-tab label="One">First</loomi-tab>
          <loomi-tab label="Two">Second</loomi-tab>
        </loomi-tabs>
      `);

      expect(el.classList.contains("is-dark")).to.be.true;
      const headings = el.shadowRoot!.querySelector<HTMLElement>(".loomi-headings")!;
      expect(getComputedStyle(headings).borderBottomColor).to.not.equal("rgb(255, 255, 255)");
    } finally {
      document.documentElement.classList.remove("dark");
    }
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

  it("slides the heading indicator to the active tab", async () => {
    const el = await fixture<LoomiTabs>(html`
      <loomi-tabs tab-style="system">
        <loomi-tab label="Short" active>First</loomi-tab>
        <loomi-tab label="Much longer tab">Second</loomi-tab>
      </loomi-tabs>
    `);
    await el.updateComplete;
    await nextFrame();
    await nextFrame();

    const headings = el.shadowRoot!.querySelector<HTMLElement>(".loomi-headings")!;
    const buttons = el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".loomi-head");
    const indicator = el.shadowRoot!.querySelector<HTMLElement>(".loomi-tab-indicator")!;
    const firstX = headings.style.getPropertyValue("--loomi-tab-indicator-x");
    const firstY = headings.style.getPropertyValue("--loomi-tab-indicator-y");
    const firstWidth = headings.style.getPropertyValue("--loomi-tab-indicator-width");

    buttons[1].click();
    await el.updateComplete;
    await nextFrame();
    await nextFrame();

    expect(indicator).to.exist;
    expect(headings.style.getPropertyValue("--loomi-tab-indicator-opacity")).to.equal("1");
    expect(el.querySelectorAll("loomi-tab")[1].active).to.be.true;
    expect(
      headings.style.getPropertyValue("--loomi-tab-indicator-x") !== firstX ||
        headings.style.getPropertyValue("--loomi-tab-indicator-y") !== firstY ||
        headings.style.getPropertyValue("--loomi-tab-indicator-width") !== firstWidth,
    ).to.equal(true);
  });
});
