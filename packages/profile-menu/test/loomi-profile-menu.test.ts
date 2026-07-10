import { html, fixture, expect } from "@open-wc/testing";
import "../dist/loomi-profile-menu.js";
import "@loomidev/dropmenu/loomi-dropmenu.js";
import type { LoomiProfileMenu } from "../dist/index.js";

describe("loomi-profile-menu", () => {
  it("renders profile identity and passes avatar options through", async () => {
    const el = await fixture<LoomiProfileMenu>(html`
      <loomi-profile-menu
        name="Olivia Rhye"
        description="olivia@loomi.dev"
        avatar="data:image/gif;base64,R0lGODlhAQABAAAAACw="
        dotted
        pulse-dot
        verified
      ></loomi-profile-menu>
    `);

    const avatar = el.shadowRoot!.querySelector("loomi-avatar") as HTMLElement & {
      image: string;
      dotted: boolean;
      pulseDot: boolean;
      verified: boolean;
    };
    expect(el.shadowRoot!.textContent).to.include("Olivia Rhye");
    expect(el.shadowRoot!.textContent).to.include("olivia@loomi.dev");
    expect(avatar.image).to.equal("data:image/gif;base64,R0lGODlhAQABAAAAACw=");
    expect(avatar.dotted).to.be.true;
    expect(avatar.pulseDot).to.be.true;
    expect(avatar.verified).to.be.true;
  });

  it("moves menu items into the internal dropmenu", async () => {
    const el = await fixture<LoomiProfileMenu>(html`
      <loomi-profile-menu name="Olivia Rhye" description="olivia@loomi.dev">
        <loomi-dropmenu-item icon="user-circle">Profile</loomi-dropmenu-item>
        <loomi-dropmenu-item icon="cog-6-tooth">Settings</loomi-dropmenu-item>
      </loomi-profile-menu>
    `);
    await el.updateComplete;

    const dropmenu = el.shadowRoot!.querySelector("loomi-dropmenu")!;
    expect(dropmenu.querySelectorAll("loomi-dropmenu-item")).to.have.length(2);
  });

  it("opens the dropmenu from the profile trigger", async () => {
    const el = await fixture<LoomiProfileMenu>(html`
      <loomi-profile-menu name="Olivia Rhye">
        <loomi-dropmenu-item>Profile</loomi-dropmenu-item>
      </loomi-profile-menu>
    `);
    const dropmenu = el.shadowRoot!.querySelector("loomi-dropmenu")!;
    const trigger = dropmenu.shadowRoot!.querySelector<HTMLButtonElement>(".loomi-trigger")!;

    trigger.click();
    await dropmenu.updateComplete;

    expect(dropmenu.shadowRoot!.querySelector(".loomi-menu")).to.exist;
  });
});
