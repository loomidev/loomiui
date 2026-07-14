import { html, fixture, expect } from "@open-wc/testing";
import "../dist/loomi-alert.js";
import type { LoomiAlert } from "../dist/index.js";

describe("loomi-alert", () => {
  it("adds a generated loomi name class to the host", async () => {
    const el = await fixture<LoomiAlert>(html`<loomi-alert>Generated target</loomi-alert>`);

    expect([...el.classList].some((cls) => /^loomi-alert-[a-z0-9]{5}$/.test(cls))).to.be.true;
  });

  it("uses the explicit name as the host target class", async () => {
    const el = await fixture<LoomiAlert>(
      html`<loomi-alert name="promo-alert">Named target</loomi-alert>`,
    );

    expect(el.classList.contains("promo-alert")).to.be.true;
  });

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
