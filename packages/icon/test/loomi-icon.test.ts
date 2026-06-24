import { html, fixture, expect } from "@open-wc/testing";
import "../dist/loomi-icon.js";
import type { LoomiIcon } from "../dist/index.js";

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
});
