import { html, fixture, expect, waitUntil } from "@open-wc/testing";
import "../dist/index.js";

type EmbedInternals = {
  embedTool: string;
  embedFiles: File[];
  uploadHandler?: (file: File, kind: "image" | "video") => Promise<string | undefined>;
  noFileUpload: boolean;
  value: string;
  updateComplete: Promise<unknown>;
  shadowRoot: ShadowRoot;
  confirmEmbedDialog: () => Promise<void>;
};

function imageFile(): File {
  return new File([new Uint8Array([1, 2, 3])], "shot.png", { type: "image/png" });
}

function videoFile(): File {
  return new File([new Uint8Array([1, 2, 3])], "clip.mp4", { type: "video/mp4" });
}

/** Renders the embed dialog body without opening the modal, which reparents to <body>. */
async function openEmbed(el: EmbedInternals, tool: "image" | "video"): Promise<void> {
  el.embedTool = tool;
  await el.updateComplete;
}

async function pickFile(el: EmbedInternals, file: File): Promise<void> {
  const picker = el.shadowRoot.querySelector("loomi-filepicker");
  expect(picker, "filepicker should be rendered").to.exist;
  picker!.dispatchEvent(
    new CustomEvent("change", { bubbles: true, composed: true, detail: { files: [file] } }),
  );
  await el.updateComplete;
}

function clearNotifications(): void {
  for (const host of Array.from(document.querySelectorAll("loomi-notification"))) host.remove();
}

async function lastNotificationText(): Promise<string> {
  await waitUntil(
    () => !!document.querySelector("loomi-notification")?.shadowRoot?.textContent?.trim(),
    "a notification toast should be shown",
    { timeout: 2000 },
  );
  return document.querySelector("loomi-notification")!.shadowRoot!.textContent ?? "";
}

describe("loomi-text-editor", () => {
  it("renders shadow content", async () => {
    const el = await fixture(html`<loomi-text-editor></loomi-text-editor>`);
    expect(el.shadowRoot).to.exist;
    expect(el.shadowRoot!.childElementCount).to.be.greaterThan(0);
  });

  describe("embed file uploads", () => {
    beforeEach(() => clearNotifications());
    afterEach(() => clearNotifications());

    it("falls back to a data URL when no upload handler is set", async () => {
      const el = (await fixture(
        html`<loomi-text-editor tools="all"></loomi-text-editor>`,
      )) as unknown as EmbedInternals;

      await openEmbed(el, "image");
      await pickFile(el, imageFile());
      await el.confirmEmbedDialog();

      expect(el.value).to.contain("<img");
      expect(el.value).to.contain('src="data:image/png;base64,');
    });

    it("inserts the URL returned by the upload handler instead of a data URL", async () => {
      const el = (await fixture(
        html`<loomi-text-editor tools="all"></loomi-text-editor>`,
      )) as unknown as EmbedInternals;

      const calls: Array<{ name: string; kind: string }> = [];
      el.uploadHandler = async (file, kind) => {
        calls.push({ name: file.name, kind });
        return "https://cdn.example.com/media/shot.png";
      };

      await openEmbed(el, "image");
      await pickFile(el, imageFile());
      await el.confirmEmbedDialog();

      expect(calls).to.deep.equal([{ name: "shot.png", kind: "image" }]);
      expect(el.value).to.contain("https://cdn.example.com/media/shot.png");
      expect(el.value).to.not.contain("data:");
    });

    it('passes kind="video" for a picked video file', async () => {
      const el = (await fixture(
        html`<loomi-text-editor tools="all"></loomi-text-editor>`,
      )) as unknown as EmbedInternals;

      let seenKind = "";
      el.uploadHandler = async (_file, kind) => {
        seenKind = kind;
        return "https://cdn.example.com/media/clip.mp4";
      };

      await openEmbed(el, "video");
      await pickFile(el, videoFile());
      await el.confirmEmbedDialog();

      expect(seenKind).to.equal("video");
      expect(el.value).to.contain("<video");
      expect(el.value).to.contain("https://cdn.example.com/media/clip.mp4");
    });

    it("inserts nothing and notifies when the handler resolves undefined", async () => {
      const el = (await fixture(
        html`<loomi-text-editor tools="all"></loomi-text-editor>`,
      )) as unknown as EmbedInternals;

      el.uploadHandler = async () => undefined;

      await openEmbed(el, "image");
      await pickFile(el, imageFile());
      await el.confirmEmbedDialog();

      expect(el.value).to.equal("");
      expect(await lastNotificationText()).to.contain("Image upload failed");
    });

    it("inserts nothing and surfaces the reason when the handler rejects", async () => {
      const el = (await fixture(
        html`<loomi-text-editor tools="all"></loomi-text-editor>`,
      )) as unknown as EmbedInternals;

      el.uploadHandler = async () => {
        throw new Error("Storage quota exceeded");
      };

      await openEmbed(el, "image");
      await pickFile(el, imageFile());
      await el.confirmEmbedDialog();

      expect(el.value).to.equal("");
      expect(await lastNotificationText()).to.contain("Storage quota exceeded");
    });

    it("keeps the dialog open after a failed upload", async () => {
      const el = (await fixture(
        html`<loomi-text-editor tools="all"></loomi-text-editor>`,
      )) as unknown as EmbedInternals;

      el.uploadHandler = async () => undefined;

      await openEmbed(el, "image");
      await pickFile(el, imageFile());
      await el.confirmEmbedDialog();

      expect(el.embedTool).to.equal("image");
    });
  });

  describe("no-file-upload", () => {
    it("hides the image picker but keeps URL entry", async () => {
      const el = (await fixture(
        html`<loomi-text-editor tools="all" no-file-upload></loomi-text-editor>`,
      )) as unknown as EmbedInternals;

      await openEmbed(el, "image");

      expect(el.noFileUpload).to.be.true;
      expect(el.shadowRoot.querySelector("loomi-filepicker")).to.not.exist;
      expect(el.shadowRoot.querySelector(".loomi-embed-separator")).to.not.exist;
      expect(el.shadowRoot.querySelectorAll("loomi-input").length).to.equal(2);
    });

    it("hides the video picker but keeps URL entry", async () => {
      const el = (await fixture(
        html`<loomi-text-editor tools="all" no-file-upload></loomi-text-editor>`,
      )) as unknown as EmbedInternals;

      await openEmbed(el, "video");

      expect(el.shadowRoot.querySelector("loomi-filepicker")).to.not.exist;
      expect(el.shadowRoot.querySelectorAll("loomi-input").length).to.equal(1);
    });

    it("still renders the picker when the attribute is absent", async () => {
      const el = (await fixture(
        html`<loomi-text-editor tools="all"></loomi-text-editor>`,
      )) as unknown as EmbedInternals;

      await openEmbed(el, "image");

      expect(el.shadowRoot.querySelector("loomi-filepicker")).to.exist;
    });
  });
});
