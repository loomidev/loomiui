import { html, fixture, expect } from "@open-wc/testing";
import "../dist/loomi-profile-menu.js";
import "@loomidev/dropmenu/loomi-dropmenu.js";
import type { LoomiProfileMenu } from "../dist/index.js";

describe("loomi-profile-menu", () => {
  it("renders profile identity and passes avatar options through", async () => {
    const el = await fixture<LoomiProfileMenu>(html`
      <loomi-profile-menu
        name="Alice Wonderland"
        description="alice@loomiui.com"
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
    expect(el.shadowRoot!.textContent).to.include("Alice Wonderland");
    expect(el.shadowRoot!.textContent).to.include("alice@loomiui.com");
    expect(avatar.image).to.equal("data:image/gif;base64,R0lGODlhAQABAAAAACw=");
    expect(avatar.dotted).to.be.true;
    expect(avatar.pulseDot).to.be.true;
    expect(avatar.verified).to.be.true;
    const trigger = el.shadowRoot!.querySelector(".loomi-pm-trigger")!;
    expect(getComputedStyle(trigger).columnGap).to.equal("6px");
  });

  it("moves menu items into the internal dropmenu", async () => {
    const el = await fixture<LoomiProfileMenu>(html`
      <loomi-profile-menu name="Alice Wonderland" description="alice@loomiui.com">
        <loomi-dropmenu-item icon="user-circle">Profile</loomi-dropmenu-item>
        <loomi-dropmenu-item icon="cog-6-tooth">Settings</loomi-dropmenu-item>
      </loomi-profile-menu>
    `);
    await el.updateComplete;

    const dropmenu = el.shadowRoot!.querySelector("loomi-dropmenu")!;
    expect(dropmenu.querySelectorAll("loomi-dropmenu-item")).to.have.length(2);
  });

  it("places the avatar after the identity text when avatar-position is right", async () => {
    const el = await fixture<LoomiProfileMenu>(html`
      <loomi-profile-menu name="Alice Wonderland" avatar-position="right"></loomi-profile-menu>
    `);
    await el.updateComplete;

    expect(el.avatarPosition).to.equal("right");
    const avatar = el.shadowRoot!.querySelector("loomi-avatar")!;
    const copy = el.shadowRoot!.querySelector(".loomi-pm-copy")!;
    expect(getComputedStyle(avatar).order).to.equal("2");
    expect(getComputedStyle(copy).order).to.equal("1");
    expect(avatar.getBoundingClientRect().left).to.be.greaterThan(
      copy.getBoundingClientRect().left,
    );
  });

  it("opens the dropmenu from the profile trigger", async () => {
    const el = await fixture<LoomiProfileMenu>(html`
      <loomi-profile-menu name="Alice Wonderland">
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
