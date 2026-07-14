import { html, fixture, expect, waitUntil } from "@open-wc/testing";
import "../dist/loomi-avatar.js";
import type { LoomiAvatar, LoomiAvatars } from "../dist/index.js";
import type { LoomiFilepicker } from "@loomidev/filepicker";
import type { LoomiModal } from "@loomidev/modal";

const PNG_1X1_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

function pngFile(name = "pixel.png"): File {
  const bytes = Uint8Array.from(atob(PNG_1X1_BASE64), (c) => c.charCodeAt(0));
  return new File([bytes], name, { type: "image/png" });
}

describe("loomi-avatar", () => {
  afterEach(() => {
    // The avatar's internal filepicker portals its crop dialog to document.body — same
    // cleanup @loomidev/filepicker's own tests do for the modal it owns.
    document.querySelectorAll<LoomiModal>(".loomi-crop-modal").forEach((el) => el.hide());
  });

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

    expect(avatars.map((avatar) => avatar.hasAttribute("dotted"))).to.deep.equal([
      true,
      true,
      true,
    ]);
    expect(avatars.map((avatar) => avatar.getAttribute("dot-color"))).to.deep.equal([
      "primary",
      "gray",
      "red",
    ]);
  });

  it("verified shows a primary-colored check-badge icon", async () => {
    const el = await fixture<LoomiAvatar>(html`<loomi-avatar label="MK" verified></loomi-avatar>`);

    const badge = el.shadowRoot!.querySelector(".loomi-verified loomi-icon");
    expect(badge).to.exist;
    expect(badge!.getAttribute("name")).to.equal("check-badge");
  });

  it("editable is keyboard-accessible and configures a stealth crop filepicker", async () => {
    const el = await fixture<LoomiAvatar>(html`<loomi-avatar label="MK" editable></loomi-avatar>`);

    const av = el.shadowRoot!.querySelector(".loomi-av")!;
    expect(av.getAttribute("role")).to.equal("button");
    expect(av.getAttribute("tabindex")).to.equal("0");

    await waitUntil(() => el.shadowRoot!.querySelector(".loomi-edit-fp"));
    const fp = el.shadowRoot!.querySelector(".loomi-edit-fp") as LoomiFilepicker;
    expect(fp.stealth).to.be.true;
    expect(fp.crop).to.be.true;
    expect(fp.cropAspectRatio).to.equal("1:1");
  });

  it("swaps in the cropped image and fires change after a pick", async () => {
    const el = await fixture<LoomiAvatar>(html`<loomi-avatar label="MK" editable></loomi-avatar>`);
    await waitUntil(() => el.shadowRoot!.querySelector(".loomi-edit-fp"));
    const fp = el.shadowRoot!.querySelector(".loomi-edit-fp") as LoomiFilepicker;

    let detail: { file: File; image: string } | undefined;
    el.addEventListener("change", (e) => (detail = (e as CustomEvent).detail));

    const input = fp.shadowRoot!.querySelector("input")!;
    const dt = new DataTransfer();
    dt.items.add(pngFile());
    input.files = dt.files;
    input.dispatchEvent(new Event("change", { bubbles: true }));

    await waitUntil(() => (document.querySelector(".loomi-crop-modal") as LoomiModal | null)?.open);
    const modal = document.querySelector(".loomi-crop-modal") as LoomiModal;
    const okBtn = modal.shadowRoot!.querySelector(
      ".loomi-footer loomi-button:not([type='secondary'])",
    ) as HTMLElement;
    okBtn.click();

    await waitUntil(() => !!detail);
    expect(detail!.file.type).to.equal("image/png");
    expect(el.image).to.equal(detail!.image);
    expect(el.image.startsWith("blob:")).to.be.true;
  });
});
