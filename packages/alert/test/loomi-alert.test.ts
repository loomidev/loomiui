import { html, fixture, expect } from "@open-wc/testing";
import "../dist/loomi-alert.js";
import type { LoomiAlert } from "../dist/index.js";

describe("loomi-alert", () => {
  it('honors show-icon="false" and show-close-icon="false"', async () => {
    const el = await fixture<LoomiAlert>(
      html`<loomi-alert show-icon="false" show-close-icon="false">Hidden controls</loomi-alert>`,
    );

    expect(el.showIcon).to.be.false;
    expect(el.showCloseIcon).to.be.false;
    expect(el.shadowRoot!.querySelector(".loomi-ico")).to.not.exist;
    expect(el.shadowRoot!.querySelector(".loomi-close")).to.not.exist;
  });
});
