import { html, fixture, expect } from "@open-wc/testing";
import "../dist/loomi-alert.js";
import type { LoomiAlert } from "../dist/index.js";

describe("loomi-alert", () => {
  it("uses the primary faint treatment without a leading icon by default", async () => {
    const el = await fixture<LoomiAlert>(
      html`<loomi-alert>Your subscription is expiring in 19 days.</loomi-alert>`,
    );
    const alert = el.shadowRoot!.querySelector(".loomi-alert") as HTMLElement;

    expect(el.type).to.equal("");
    expect(alert.classList.contains("faint")).to.be.true;
    expect(alert.getAttribute("style")).to.contain("--loomi-primary-600");
    expect(el.shadowRoot!.querySelector(".loomi-ico")).to.not.exist;
    expect(el.showCloseIcon).to.be.false;
    expect(el.shadowRoot!.querySelector(".loomi-close")).to.not.exist;
  });

  it('uses the info palette and information icon for type="info"', async () => {
    const el = await fixture<LoomiAlert>(
      html`<loomi-alert type="info">A new version is available.</loomi-alert>`,
    );
    const alert = el.shadowRoot!.querySelector(".loomi-alert") as HTMLElement;

    expect(alert.getAttribute("style")).to.contain("--loomi-info-600");
    expect(el.shadowRoot!.querySelector(".loomi-ico")).to.exist;
  });

  it('uses the hand-raised icon for type="error"', async () => {
    const el = await fixture<LoomiAlert>(
      html`<loomi-alert type="error">Your payment could not be processed.</loomi-alert>`,
    );
    const path = el.shadowRoot!.querySelector(".loomi-ico path") as SVGPathElement;

    expect(path.getAttribute("d")).to.contain("M10.05 4.575");
  });

  it("centers the leading and close icons beside multi-line content", async () => {
    const el = await fixture<LoomiAlert>(html`
      <loomi-alert type="info" show-close-icon style="width: 16rem">
        Your subscription is expiring soon. Renew it now to keep uninterrupted access to
        every workspace feature.
      </loomi-alert>
    `);
    const alert = el.shadowRoot!.querySelector(".loomi-alert") as HTMLElement;
    const icon = el.shadowRoot!.querySelector(".loomi-ico") as SVGElement;
    const close = el.shadowRoot!.querySelector(".loomi-close") as HTMLButtonElement;
    const alertCenter =
      alert.getBoundingClientRect().top + alert.getBoundingClientRect().height / 2;
    const iconCenter = icon.getBoundingClientRect().top + icon.getBoundingClientRect().height / 2;
    const closeCenter =
      close.getBoundingClientRect().top + close.getBoundingClientRect().height / 2;

    expect(getComputedStyle(alert).alignItems).to.equal("center");
    expect(Math.abs(iconCenter - alertCenter)).to.be.lessThan(1);
    expect(Math.abs(closeCenter - alertCenter)).to.be.lessThan(1);
  });

  it('top-aligns the leading and close icons with icon-placement="top"', async () => {
    const el = await fixture<LoomiAlert>(html`
      <loomi-alert type="info" icon-placement="top" show-close-icon style="width: 16rem">
        Your subscription is expiring soon. Renew it now to keep uninterrupted access to
        every workspace feature.
      </loomi-alert>
    `);
    const alert = el.shadowRoot!.querySelector(".loomi-alert") as HTMLElement;
    const icon = el.shadowRoot!.querySelector(".loomi-ico") as SVGElement;
    const close = el.shadowRoot!.querySelector(".loomi-close") as HTMLButtonElement;

    expect(el.iconPlacement).to.equal("top");
    expect(el.getAttribute("icon-placement")).to.equal("top");
    expect(getComputedStyle(alert).alignItems).to.equal("flex-start");
    expect(
      Math.abs(icon.getBoundingClientRect().top - close.getBoundingClientRect().top),
    ).to.be.lessThan(1);
  });

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

  it("shows the dismiss button when show-close-icon is enabled", async () => {
    const el = await fixture<LoomiAlert>(
      html`<loomi-alert show-close-icon>Dismissible alert</loomi-alert>`,
    );

    expect(el.showCloseIcon).to.be.true;
    expect(el.shadowRoot!.querySelector(".loomi-close")).to.exist;
  });
});
