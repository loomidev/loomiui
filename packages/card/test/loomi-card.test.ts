import { html, fixture, expect } from "@open-wc/testing";
import "../dist/loomi-card.js";
import type { LoomiCard } from "../dist/index.js";

describe("loomi-card", () => {
  it("renders a keyboard-accessible link surface when url is set", async () => {
    const el = await fixture<LoomiCard>(
      html`<loomi-card url="/settings"><span>Settings</span></loomi-card>`,
    );
    const surface = el.shadowRoot!.querySelector(".card")!;

    expect(surface.getAttribute("role")).to.equal("link");
    expect(surface.getAttribute("tabindex")).to.equal("0");
  });

  it("handles Enter key activation", async () => {
    const el = await fixture<LoomiCard>(
      html`<loomi-card url="#clicked"><span>Go</span></loomi-card>`,
    );
    const surface = el.shadowRoot!.querySelector(".card")! as HTMLElement;

    surface.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true, composed: true }),
    );
    expect(surface.getAttribute("role")).to.equal("link");
  });
});
