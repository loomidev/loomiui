import { html, fixture, expect } from "@open-wc/testing";
import { waitFor } from "../../../test/wait.js";
import "../dist/loomi-tab.js";
import type { LoomiTabs } from "../dist/index.js";

describe("loomi-tabs", () => {
  const nextFrame = (): Promise<void> =>
    new Promise((resolve) => requestAnimationFrame(() => resolve()));

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

    el.shadowRoot!.querySelector(".loomi-headings")!.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true }),
    );
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
    el.shadowRoot!.querySelector(".loomi-headings")!.dispatchEvent(
      new KeyboardEvent("keydown", { key: "End", bubbles: true, cancelable: true }),
    );
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

  describe("heading icons", () => {
    const iconOf = (el: LoomiTabs, i: number) =>
      el
        .shadowRoot!.querySelectorAll<HTMLElement>(".loomi-head")
        [i].querySelector<
          HTMLElement & { source: string; variant: string; updateComplete: Promise<unknown> }
        >("loomi-icon");

    it("renders an iconsax outline icon from disk with no registration", async () => {
      const el = await fixture<LoomiTabs>(html`
        <loomi-tabs>
          <loomi-tab label="Home" icon="home"></loomi-tab>
          <loomi-tab label="Farms" icon="location" icon-source="iconsax"></loomi-tab>
        </loomi-tabs>
      `);
      const icon = iconOf(el, 1)!;
      expect(icon.source).to.equal("iconsax");
      await waitFor(() => (icon.shadowRoot!.querySelector("svg")?.childElementCount ?? 0) > 0);

      const svg = icon.shadowRoot!.querySelector("svg")!;
      // Filled set: its own fill="currentColor" paths, no heroicon stroke on the wrapper.
      expect(svg.hasAttribute("stroke")).to.be.false;
      expect(svg.querySelector("path")!.getAttribute("fill")).to.equal("currentColor");
      await expect(el).to.be.accessible();
    });

    it("sizes and colours disk icons exactly like heroicon ones, across states", async () => {
      const el = await fixture<LoomiTabs>(html`
        <loomi-tabs>
          <loomi-tab label="Home" icon="home" active></loomi-tab>
          <loomi-tab label="Farms" icon="location" icon-source="iconsax"></loomi-tab>
        </loomi-tabs>
      `);
      const hero = iconOf(el, 0)!;
      const disk = iconOf(el, 1)!;
      await waitFor(() => (disk.shadowRoot!.querySelector("svg")?.childElementCount ?? 0) > 0);
      const heroSvg = hero.shadowRoot!.querySelector("svg")!.getBoundingClientRect();
      const diskSvg = disk.shadowRoot!.querySelector("svg")!.getBoundingClientRect();
      expect(diskSvg.width).to.equal(heroSvg.width);
      expect(diskSvg.height).to.equal(heroSvg.height);
      expect(heroSvg.width).to.be.closeTo(17.6, 0.5); // 1.1rem

      const heads = el.shadowRoot!.querySelectorAll<HTMLElement>(".loomi-head");
      for (const h of heads) h.style.transition = "none";
      const activeColor = getComputedStyle(heads[0]).color;
      const idleColor = getComputedStyle(heads[1]).color;
      expect(activeColor).to.not.equal(idleColor);
      // Icons follow their heading's text colour (currentColor) in every state.
      expect(getComputedStyle(hero).color).to.equal(activeColor);
      expect(getComputedStyle(disk).color).to.equal(idleColor);

      heads[1].click();
      await el.updateComplete;
      expect(getComputedStyle(disk).color).to.equal(activeColor);
      expect(getComputedStyle(hero).color).to.equal(idleColor);
    });

    it("passes icon-variant through and keeps heroicons stroked", async () => {
      const el = await fixture<LoomiTabs>(html`
        <loomi-tabs>
          <loomi-tab label="Home" icon="home"></loomi-tab>
          <loomi-tab label="Alerts" icon="bell-alert" icon-variant="solid"></loomi-tab>
          <loomi-tab label="Box" icon="box" icon-source="iconsax" icon-variant="twotone"></loomi-tab>
        </loomi-tabs>
      `);
      const outline = iconOf(el, 0)!;
      const solid = iconOf(el, 1)!;
      const twotone = iconOf(el, 2)!;
      await outline.updateComplete;
      expect(outline.shadowRoot!.querySelector("svg")!.getAttribute("stroke")).to.equal(
        "currentColor",
      );
      expect(outline.shadowRoot!.querySelector("svg")!.getAttribute("stroke-width")).to.equal(
        "1.6",
      );
      expect(solid.variant).to.equal("solid");
      expect(solid.shadowRoot!.querySelector("svg")!.getAttribute("fill")).to.equal("currentColor");
      expect(twotone.variant).to.equal("twotone");
    });

    it("draws no icon for a name its source doesn't have", async () => {
      const el = await fixture<LoomiTabs>(html`
        <loomi-tabs>
          <loomi-tab label="One" icon="not-a-real-icon" icon-source="iconsax"></loomi-tab>
        </loomi-tabs>
      `);
      expect(iconOf(el, 0)).to.be.null;
    });
  });
});
