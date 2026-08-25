import { html, fixture, expect } from "@open-wc/testing";
import "../dist/index.js";
import type { LoomiBell } from "../dist/index.js";

describe("loomi-bell", () => {
  it("renders shadow content", async () => {
    const el = await fixture<LoomiBell>(html`<loomi-bell></loomi-bell>`);
    expect(el.shadowRoot).to.exist;
    expect(el.shadowRoot!.childElementCount).to.be.greaterThan(0);
  });

  it("shows the dot by default and hides it on request", async () => {
    const plain = await fixture<LoomiBell>(html`<loomi-bell></loomi-bell>`);
    expect(plain.shadowRoot!.querySelector(".loomi-dot"), "on by default").to.exist;

    // A boolean attribute cannot express false by its presence, so this is a property.
    plain.showDot = false;
    await plain.updateComplete;
    expect(plain.shadowRoot!.querySelector(".loomi-dot")).to.not.exist;
  });

  it("adds the ping animation only when asked", async () => {
    const still = await fixture<LoomiBell>(html`<loomi-bell></loomi-bell>`);
    expect(still.shadowRoot!.querySelector(".loomi-ping")).to.not.exist;

    const pinging = await fixture<LoomiBell>(html`<loomi-bell animate-dot></loomi-bell>`);
    expect(pinging.shadowRoot!.querySelector(".loomi-ping")).to.exist;
  });

  it("drops the ping along with the dot it belongs to", async () => {
    const el = await fixture<LoomiBell>(html`<loomi-bell animate-dot></loomi-bell>`);
    expect(el.shadowRoot!.querySelector(".loomi-ping")).to.exist;

    el.showDot = false;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".loomi-ping")).to.not.exist;
  });
});
