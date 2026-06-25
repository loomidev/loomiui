import { html, fixture, expect } from "@open-wc/testing";
import "../dist/loomi-avatar.js";
import type { LoomiAvatar, LoomiAvatars } from "../dist/index.js";

describe("loomi-avatar", () => {
  it("reflects size so inline layout can align to the host", async () => {
    const el = await fixture<LoomiAvatar>(html`<loomi-avatar label="MK"></loomi-avatar>`);

    el.size = "big";
    await el.updateComplete;

    expect(el.getAttribute("size")).to.equal("big");
    expect(getComputedStyle(el).verticalAlign).to.equal("middle");
  });

  it("uses the group size when computing stacked overlap", async () => {
    const el = await fixture<LoomiAvatars>(html`
      <loomi-avatars stacked size="big">
        <loomi-avatar label="AA"></loomi-avatar>
        <loomi-avatar label="BB"></loomi-avatar>
      </loomi-avatars>
    `);
    await el.updateComplete;

    const second = el.querySelectorAll("loomi-avatar")[1] as LoomiAvatar;
    const marginLeft = Number.parseFloat(getComputedStyle(second).marginLeft);

    expect(second.getAttribute("size")).to.equal("big");
    expect(marginLeft).to.be.closeTo(-23.04, 0.1);
  });

  it("propagates group status dots while preserving child dot colors", async () => {
    const el = await fixture<LoomiAvatars>(html`
      <loomi-avatars dotted>
        <loomi-avatar image="/avatars/ada.svg" dot-color="primary"></loomi-avatar>
        <loomi-avatar image="/avatars/sara.svg" dot-color="gray"></loomi-avatar>
        <loomi-avatar image="/avatars/robert.svg" dot-color="red"></loomi-avatar>
      </loomi-avatars>
    `);
    await el.updateComplete;

    const avatars = [...el.querySelectorAll("loomi-avatar")] as LoomiAvatar[];

    expect(avatars.map((avatar) => avatar.hasAttribute("dotted"))).to.deep.equal([true, true, true]);
    expect(avatars.map((avatar) => avatar.getAttribute("dot-color"))).to.deep.equal(["primary", "gray", "red"]);
  });
});
