import { html, fixture, expect } from "@open-wc/testing";
import "../dist/loomi-lightbox.js";
import type { LoomiLightboxImage } from "../dist/index.js";

describe("loomi-lightbox-image trigger", () => {
  it("exposes part=trigger and fills a sized host", async () => {
    const el = await fixture<LoomiLightboxImage>(
      html`<loomi-lightbox-image src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" alt="x"
        style="display:block;width:120px;height:120px"></loomi-lightbox-image>`,
    );
    const trigger = el.shadowRoot!.querySelector<HTMLElement>('[part="trigger"]')!;
    expect(trigger).to.exist;
    expect(trigger.offsetWidth).to.equal(120);
    expect(trigger.offsetHeight).to.equal(120);
    expect(el.shadowRoot!.querySelector('[part="image"]')).to.exist;
  });
});
