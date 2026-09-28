import { expect, fixture, html } from "@open-wc/testing";
import { render, svg } from "lit";
import {
  getLoomiIcon,
  hasLoomiIcon,
  loadLoomiIcon,
  loomiIcon,
  loomiIconNames,
  provideLoomiIcons,
  registerLoomiIcon,
} from "../dist/index.js";

describe("heroicons registry", () => {
  it("knows every shipped name without loading any icon", () => {
    expect(hasLoomiIcon("x-mark")).to.be.true;
    expect(hasLoomiIcon("definitely-not-an-icon")).to.be.false;
    expect(loomiIconNames()).to.include("academic-cap");
  });

  it("loads an icon on demand and caches it", async () => {
    expect(getLoomiIcon("academic-cap"), "not loaded up front").to.be.undefined;
    const icon = await loadLoomiIcon("academic-cap");
    expect(icon).to.exist;
    expect(getLoomiIcon("academic-cap")).to.equal(icon);
    expect(await loadLoomiIcon("academic-cap")).to.equal(icon);
  });

  it("falls back to outline when a solid icon doesn't exist", async () => {
    registerLoomiIcon("only-outline", svg`<path d="M0 0" />`);
    expect(hasLoomiIcon("only-outline", "solid")).to.be.true;
    expect(await loadLoomiIcon("only-outline", "solid")).to.equal(getLoomiIcon("only-outline"));
  });

  it("never lets provided icons replace a registered override", () => {
    const mine = svg`<path d="M1 1" />`;
    registerLoomiIcon("adjustments-vertical", mine);
    provideLoomiIcons({ "adjustments-vertical": svg`<path d="M2 2" />` });
    expect(getLoomiIcon("adjustments-vertical")).to.equal(mine);
  });

  it("resolves an unknown name to undefined", async () => {
    expect(await loadLoomiIcon("definitely-not-an-icon")).to.be.undefined;
  });

  describe("loomiIcon() directive", () => {
    it("renders nothing, then the icon once its module arrives", async () => {
      const host = await fixture<HTMLDivElement>(html`<div></div>`);
      render(svg`<svg viewBox="0 0 24 24">${loomiIcon("adjustments-horizontal")}</svg>`, host);
      expect(host.querySelector("path"), "nothing until loaded").to.be.null;
      await loadLoomiIcon("adjustments-horizontal");
      await new Promise((r) => setTimeout(r));
      expect(host.querySelector("path")).to.exist;
    });

    it("renders a provided icon synchronously", async () => {
      provideLoomiIcons({ "test-sync": svg`<circle r="1" />` });
      const host = await fixture<HTMLDivElement>(html`<div></div>`);
      render(svg`<svg>${loomiIcon("test-sync")}</svg>`, host);
      expect(host.querySelector("circle")).to.exist;
    });

    it("ignores a stale load after the name changes", async () => {
      provideLoomiIcons({ "test-now": svg`<rect width="1" />` });
      const host = await fixture<HTMLDivElement>(html`<div></div>`);
      render(svg`<svg>${loomiIcon("archive-box-arrow-down")}</svg>`, host);
      render(svg`<svg>${loomiIcon("test-now")}</svg>`, host);
      await loadLoomiIcon("archive-box-arrow-down");
      await new Promise((r) => setTimeout(r));
      expect(host.querySelector("rect")).to.exist;
      expect(host.querySelector("path")).to.be.null;
    });
  });
});
