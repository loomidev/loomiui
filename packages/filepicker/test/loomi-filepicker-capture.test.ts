import { html, fixture, expect } from "@open-wc/testing";
import "../dist/loomi-filepicker.js";
import type { LoomiFilepicker } from "../dist/index.js";

describe("loomi-filepicker capture", () => {
  it("forwards capture to the file input", async () => {
    const el = await fixture<LoomiFilepicker>(
      html`<loomi-filepicker accepted-file-types="image/*" capture="environment"></loomi-filepicker>`,
    );
    const input = el.shadowRoot!.querySelector<HTMLInputElement>('input[type="file"]')!;
    expect(input.getAttribute("capture")).to.equal("environment");
  });

  it("leaves capture off by default", async () => {
    const el = await fixture<LoomiFilepicker>(html`<loomi-filepicker></loomi-filepicker>`);
    const input = el.shadowRoot!.querySelector<HTMLInputElement>('input[type="file"]')!;
    expect(input.hasAttribute("capture")).to.be.false;
  });
});
