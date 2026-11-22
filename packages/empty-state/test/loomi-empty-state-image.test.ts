import { html, fixture, expect, waitUntil } from "@open-wc/testing";
import "../dist/loomi-empty-state.js";
import type { LoomiEmptyState } from "../dist/index.js";

describe("loomi-empty-state illustration", () => {
  it("loads the built-in illustration on demand, with its box reserved", async () => {
    const el = await fixture<LoomiEmptyState>(
      html`<loomi-empty-state heading="Nothing"></loomi-empty-state>`,
    );
    const img = () => el.shadowRoot!.querySelector("img")!;
    expect(img().getAttribute("width")).to.equal("502");
    await waitUntil(() => img().getAttribute("src")?.startsWith("data:image/webp"), "image loaded");
  });

  it("uses a custom image without the built-in size", async () => {
    const el = await fixture<LoomiEmptyState>(
      html`<loomi-empty-state image="/x.svg"></loomi-empty-state>`,
    );
    const img = el.shadowRoot!.querySelector("img")!;
    expect(img.getAttribute("src")).to.equal("/x.svg");
    expect(img.hasAttribute("width")).to.be.false;
  });
});
