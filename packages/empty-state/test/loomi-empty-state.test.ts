import { html, fixture, expect } from "@open-wc/testing";
import "../dist/loomi-empty-state.js";
import type { LoomiEmptyState } from "../dist/index.js";

describe("loomi-empty-state", () => {
  it("exposes a status region labelled by the heading", async () => {
    const el = await fixture<LoomiEmptyState>(
      html`<loomi-empty-state heading="No results" message="Try another filter"></loomi-empty-state>`,
    );
    const region = el.shadowRoot!.querySelector('[role="status"]')!;

    expect(region.getAttribute("aria-labelledby")).to.equal("loomi-empty-heading");
    expect(region.querySelector("#loomi-empty-heading")!.textContent).to.equal("No results");
    expect(region.querySelector(".loomi-img")!.getAttribute("aria-hidden")).to.equal("true");
  });
});
