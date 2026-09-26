import { html, fixture, expect, nextFrame, waitUntil } from "@open-wc/testing";
import { setViewport } from "@web/test-runner-commands";
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

  describe("compact trigger", () => {
    const LOGO = html`<div style="flex:none;width:126px;height:32px;background:#ccc"></div>`;
    const TAG = html`<span style="flex:none;padding:2px 8px;font-size:12px">Beta</span>`;

    // The consuming-app layout: a 390px phone header with a logo, a small tag, and the
    // profile menu pushed to the far end.
    const header = (compact: string) => html`
      <header style="display:flex;align-items:center;gap:8px;width:390px;box-sizing:border-box;padding:0 12px">
        ${LOGO} ${TAG}
        <loomi-profile-menu
          style="margin-inline-start:auto"
          name="Alice Wonderland"
          description="alice.wonderland@a-long-company-domain.com"
          compact=${compact}
        >
          <loomi-dropmenu-item>Profile</loomi-dropmenu-item>
        </loomi-profile-menu>
      </header>
    `;

    const parts = (el: LoomiProfileMenu) => ({
      trigger: el.shadowRoot!.querySelector<HTMLElement>(".loomi-pm-trigger")!,
      copy: el.shadowRoot!.querySelector<HTMLElement>(".loomi-pm-copy")!,
      chevron: el.shadowRoot!.querySelector<SVGElement>(".loomi-pm-chevron")!,
      button: el
        .shadowRoot!.querySelector("loomi-dropmenu")!
        .shadowRoot!.querySelector<HTMLButtonElement>(".loomi-trigger")!,
    });

    // The page's default 8px body margin would otherwise sit outside the 390px header.
    beforeEach(() => {
      document.body.style.margin = "0";
    });
    afterEach(async () => {
      document.body.style.margin = "";
      await setViewport({ width: 800, height: 600 });
    });

    it('fits a 390px phone header with compact="auto", chevron unclipped', async () => {
      await setViewport({ width: 390, height: 800 });
      const bar = await fixture<HTMLElement>(header("auto"));
      const el = bar.querySelector<LoomiProfileMenu>("loomi-profile-menu")!;
      await el.updateComplete;
      await nextFrame();
      const { copy, chevron } = parts(el);

      expect(document.documentElement.scrollWidth).to.equal(390);
      expect(getComputedStyle(copy).position).to.equal("absolute");
      expect(chevron.getBoundingClientRect().right).to.be.at.most(
        bar.getBoundingClientRect().right,
      );
      await expect(el).to.be.accessible();
    });

    it('keeps the full trigger above the breakpoint with compact="auto"', async () => {
      const el = await fixture<LoomiProfileMenu>(
        html`<loomi-profile-menu name="Alice Wonderland" compact="auto"></loomi-profile-menu>`,
      );
      const { trigger, copy } = parts(el);

      expect(getComputedStyle(copy).position).to.equal("static");
      expect(trigger.getBoundingClientRect().width).to.be.at.least(224 - 1);
    });

    it("always compacts with a bare compact attribute, keeping the name for screen readers", async () => {
      const el = await fixture<LoomiProfileMenu>(
        html`<loomi-profile-menu name="Alice Wonderland" compact></loomi-profile-menu>`,
      );
      const { trigger, copy } = parts(el);

      expect(el.compact).to.equal("always");
      expect(getComputedStyle(copy).position).to.equal("absolute");
      expect(trigger.getBoundingClientRect().width).to.be.lessThan(120);
      // Visually hidden, not display:none — still part of the button's name.
      expect(getComputedStyle(copy).display).to.not.equal("none");
      expect(copy.textContent).to.include("Alice Wonderland");
      await expect(el).to.be.accessible();
    });

    it('accepts compact="true" as always', async () => {
      const el = await fixture<LoomiProfileMenu>(
        html`<loomi-profile-menu name="Alice Wonderland" compact="true"></loomi-profile-menu>`,
      );
      expect(el.compact).to.equal("always");
      expect(getComputedStyle(parts(el).copy).position).to.equal("absolute");
    });

    it("opens the menu right-aligned to a compact trigger", async () => {
      await setViewport({ width: 390, height: 800 });
      const bar = await fixture<HTMLElement>(header("auto"));
      const el = bar.querySelector<LoomiProfileMenu>("loomi-profile-menu")!;
      await el.updateComplete;
      const dropmenu = el.shadowRoot!.querySelector("loomi-dropmenu")!;
      const { button } = parts(el);

      button.click();
      await dropmenu.updateComplete;
      const menu = dropmenu.shadowRoot!.querySelector<HTMLElement>(".loomi-menu")!;
      await waitUntil(() => menu.matches(":popover-open") && menu.offsetWidth > 0);
      await nextFrame();

      const b = button.getBoundingClientRect();
      const m = menu.getBoundingClientRect();
      expect(m.right).to.be.closeTo(b.right, 2);
      expect(m.left).to.be.at.least(0);
      expect(document.documentElement.scrollWidth).to.equal(390);
    });
  });

  describe("constrained trigger", () => {
    it("truncates the name with an ellipsis when the min-width is released", async () => {
      const box = await fixture<HTMLDivElement>(html`
        <div style="display:flex;width:160px">
          <loomi-profile-menu
            style="--loomi-profile-menu-min-width:0"
            name="Alice Wonderland-Featherstonehaugh"
          ></loomi-profile-menu>
        </div>
      `);
      const el = box.querySelector<LoomiProfileMenu>("loomi-profile-menu")!;
      await el.updateComplete;
      const name = el.shadowRoot!.querySelector<HTMLElement>(".loomi-pm-name")!;
      const chevron = el.shadowRoot!.querySelector<SVGElement>(".loomi-pm-chevron")!;

      expect(getComputedStyle(name).textOverflow).to.equal("ellipsis");
      expect(name.scrollWidth).to.be.greaterThan(name.clientWidth);
      expect(el.getBoundingClientRect().width).to.be.at.most(160);
      expect(chevron.getBoundingClientRect().right).to.be.at.most(
        box.getBoundingClientRect().right,
      );
    });

    it("exposes trigger, copy, name and description parts", async () => {
      const el = await fixture<LoomiProfileMenu>(
        html`<loomi-profile-menu name="Alice" description="alice@loomiui.com"></loomi-profile-menu>`,
      );
      for (const part of ["trigger", "avatar", "copy", "name", "description", "chevron"]) {
        expect(el.shadowRoot!.querySelector(`[part~="${part}"]`), part).to.exist;
      }
    });
  });
});
