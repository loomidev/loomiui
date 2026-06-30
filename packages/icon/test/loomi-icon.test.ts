import { html, fixture, expect, waitUntil } from "@open-wc/testing";
import "../dist/loomi-icon.js";
import type { LoomiIcon } from "../dist/index.js";

async function diskIconReady(el: LoomiIcon) {
  await waitUntil(() => (el.shadowRoot!.querySelector("svg")?.childElementCount ?? 0) > 0);
}

describe("loomi-icon", () => {
  it("renders Heroicons outline by default", async () => {
    const el = await fixture<LoomiIcon>(html`<loomi-icon name="bell-alert"></loomi-icon>`);
    const svg = el.shadowRoot!.querySelector("svg")!;

    expect(svg.getAttribute("fill")).to.equal("none");
    expect(svg.getAttribute("stroke")).to.equal("currentColor");
    expect(svg.querySelector("path")).to.exist;
  });

  it("renders Heroicons solid when variant is solid", async () => {
    const el = await fixture<LoomiIcon>(html`<loomi-icon name="bell-alert" variant="solid"></loomi-icon>`);
    const svg = el.shadowRoot!.querySelector("svg")!;

    expect(svg.getAttribute("fill")).to.equal("currentColor");
    expect(svg.getAttribute("stroke")).to.equal("none");
    expect(svg.hasAttribute("stroke-width")).to.equal(false);
    expect(svg.querySelector("path")).to.exist;
  });

  it("renders file icons from a custom directory", async () => {
    const el = await fixture<LoomiIcon>(html`
      <loomi-icon name="airpods" directory="/packages/icon/test/assets" label="AirPods"></loomi-icon>
    `);
    const img = el.shadowRoot!.querySelector("img")!;

    expect(img.getAttribute("src")).to.equal("/packages/icon/test/assets/airpods.svg");
    expect(img.getAttribute("alt")).to.equal("AirPods");
  });

  it("keeps explicit file extensions for directory icons", async () => {
    const el = await fixture<LoomiIcon>(html`
      <loomi-icon name="airpods.png" directory="/assets/images/"></loomi-icon>
    `);
    const img = el.shadowRoot!.querySelector("img")!;

    expect(img.getAttribute("src")).to.equal("/assets/images/airpods.png");
    expect(img.getAttribute("alt")).to.equal("");
    expect(img.getAttribute("aria-hidden")).to.equal("true");
  });

  it("renders an Iconsax outline icon fetched from disk", async () => {
    const el = await fixture<LoomiIcon>(html`<loomi-icon source="iconsax" name="add"></loomi-icon>`);
    await diskIconReady(el);
    const svg = el.shadowRoot!.querySelector("svg")!;
    const path = svg.querySelector("path")!;

    expect(path).to.exist;
    expect(path.getAttribute("fill")).to.equal("currentColor");
  });

  it("renders an Iconsax twotone icon, preserving its opacity layering", async () => {
    const el = await fixture<LoomiIcon>(
      html`<loomi-icon source="iconsax" variant="twotone" name="add"></loomi-icon>`,
    );
    await diskIconReady(el);
    const svg = el.shadowRoot!.querySelector("svg")!;

    expect(svg.querySelector('[stroke="currentColor"]')).to.exist;
    expect(svg.querySelector("[opacity]")).to.exist;
  });

  it("renders an Untitled UI outline icon fetched from disk", async () => {
    const el = await fixture<LoomiIcon>(html`<loomi-icon source="untitledui" name="triangle"></loomi-icon>`);
    await diskIconReady(el);
    const svg = el.shadowRoot!.querySelector("svg")!;
    const path = svg.querySelector("path")!;

    expect(path).to.exist;
    expect(path.getAttribute("stroke")).to.equal("currentColor");
    expect(path.getAttribute("stroke-width")).to.equal("2");
  });

  it("falls back to the slot for an unregistered name on a disk source", async () => {
    const el = await fixture<LoomiIcon>(html`
      <loomi-icon source="iconsax" name="not-a-real-icon">
        <span class="fallback">fallback</span>
      </loomi-icon>
    `);

    expect(el.shadowRoot!.querySelector("svg")).to.not.exist;
    expect(el.shadowRoot!.querySelector("slot")).to.exist;
  });

  it("falls back to outline for Untitled UI when an unavailable variant is requested", async () => {
    const el = await fixture<LoomiIcon>(
      html`<loomi-icon source="untitledui" variant="twotone" name="triangle"></loomi-icon>`,
    );
    await diskIconReady(el);
    const svg = el.shadowRoot!.querySelector("svg")!;

    expect(svg.querySelector("path")).to.exist;
  });

  it("renders unbranded by default (no badge wrapper)", async () => {
    const el = await fixture<LoomiIcon>(html`<loomi-icon name="bell-alert"></loomi-icon>`);

    expect(el.shadowRoot!.querySelector(".loomi-icon-badge")).to.not.exist;
    expect(el.shadowRoot!.querySelector("svg")).to.exist;
  });

  it("wraps the icon in a light badge by default when branded", async () => {
    const el = await fixture<LoomiIcon>(html`<loomi-icon name="bell-alert" branded></loomi-icon>`);
    const badge = el.shadowRoot!.querySelector(".loomi-icon-badge")!;

    expect(badge).to.exist;
    expect(badge.classList.contains("light")).to.equal(true);
    expect(badge.classList.contains("rounded-lg")).to.equal(true); // default radius="medium"
    expect(badge.getAttribute("style")).to.include("--_loomi-accent-soft");
    expect(badge.querySelector("svg")).to.exist;
  });

  it("switches the badge to a dark fill when shade is dark", async () => {
    const el = await fixture<LoomiIcon>(
      html`<loomi-icon name="bell-alert" branded shade="dark"></loomi-icon>`,
    );
    const badge = el.shadowRoot!.querySelector(".loomi-icon-badge")!;

    expect(badge.classList.contains("dark")).to.equal(true);
    expect(badge.classList.contains("light")).to.equal(false);
  });

  it("maps radius to the matching Tailwind rounding class", async () => {
    const cases: Array<[string, string]> = [
      ["none", "rounded-none"],
      ["small", "rounded"],
      ["medium", "rounded-lg"],
      ["full", "rounded-full"],
    ];
    for (const [radius, expectedClass] of cases) {
      const el = await fixture<LoomiIcon>(
        html`<loomi-icon name="bell-alert" branded radius=${radius}></loomi-icon>`,
      );
      const badge = el.shadowRoot!.querySelector(".loomi-icon-badge")!;
      expect(badge.classList.contains(expectedClass), `radius="${radius}" -> ${expectedClass}`).to.equal(true);
    }
  });

  it("applies branded badging to disk-based icon sources too", async () => {
    const el = await fixture<LoomiIcon>(
      html`<loomi-icon source="iconsax" name="add" branded shade="dark"></loomi-icon>`,
    );
    await diskIconReady(el);
    const badge = el.shadowRoot!.querySelector(".loomi-icon-badge")!;

    expect(badge).to.exist;
    expect(badge.classList.contains("dark")).to.equal(true);
    expect(badge.querySelector("svg path")).to.exist;
  });
});
