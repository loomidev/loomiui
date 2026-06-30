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
});
