import { html, fixture, expect, waitUntil } from "@open-wc/testing";
import "../dist/loomi-filepicker.js";
import type { LoomiFilepicker } from "../dist/index.js";

const PNG_1X1_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

function pngFile(name = "pixel.png"): File {
  const bytes = Uint8Array.from(atob(PNG_1X1_BASE64), (c) => c.charCodeAt(0));
  return new File([bytes], name, { type: "image/png" });
}

function textFile(name = "notes.txt"): File {
  return new File(["hello"], name, { type: "text/plain" });
}

function nativeInput(el: LoomiFilepicker): HTMLInputElement {
  return el.shadowRoot!.querySelector("input")!;
}

function selectFiles(el: LoomiFilepicker, files: File[]): void {
  const input = nativeInput(el);
  const dt = new DataTransfer();
  for (const f of files) dt.items.add(f);
  input.files = dt.files;
  input.dispatchEvent(new Event("change", { bubbles: true }));
}

describe("loomi-filepicker", () => {
  it('honors show-image-preview="false", can-browse="false", and can-drop="false"', async () => {
    const el = await fixture<LoomiFilepicker>(
      html`<loomi-filepicker show-image-preview="false" can-browse="false" can-drop="false"></loomi-filepicker>`,
    );

    expect(el.showImagePreview).to.be.false;
    expect(el.canBrowse).to.be.false;
    expect(el.canDrop).to.be.false;
  });

  it("adds a selected file and dispatches change", async () => {
    const el = await fixture<LoomiFilepicker>(html`<loomi-filepicker></loomi-filepicker>`);
    let detail: { files: File[] } | undefined;
    el.addEventListener("change", (e) => (detail = (e as CustomEvent).detail));

    selectFiles(el, [textFile()]);
    await waitUntil(() => el.selectedFiles.length > 0);

    expect(el.selectedFiles[0].name).to.equal("notes.txt");
    expect(detail?.files).to.have.lengthOf(1);
  });

  it("skips the crop dialog for non-image files even when crop is enabled", async () => {
    const el = await fixture<LoomiFilepicker>(html`<loomi-filepicker crop></loomi-filepicker>`);

    selectFiles(el, [textFile()]);
    await waitUntil(() => el.selectedFiles.length > 0);

    expect(el.shadowRoot!.querySelector(".loomi-crop-backdrop")).to.not.exist;
  });

  it("launches a crop dialog for images and discards the file on cancel", async () => {
    const el = await fixture<LoomiFilepicker>(html`<loomi-filepicker crop></loomi-filepicker>`);

    selectFiles(el, [pngFile()]);
    await waitUntil(() => el.shadowRoot!.querySelector(".loomi-crop-backdrop"));

    el.shadowRoot!.querySelector<HTMLButtonElement>(".loomi-crop-btn.cancel")!.click();
    await waitUntil(() => !el.shadowRoot!.querySelector(".loomi-crop-backdrop"));

    expect(el.selectedFiles).to.have.lengthOf(0);
  });

  it("crops the image and adds the cropped file on apply", async () => {
    const el = await fixture<LoomiFilepicker>(
      html`<loomi-filepicker crop crop-aspect-ratio="1:1"></loomi-filepicker>`,
    );

    selectFiles(el, [pngFile()]);
    await waitUntil(() => el.shadowRoot!.querySelector(".loomi-crop-rect"));

    el.shadowRoot!.querySelector<HTMLButtonElement>(".loomi-crop-btn.apply")!.click();
    await waitUntil(() => el.selectedFiles.length > 0);

    expect(el.shadowRoot!.querySelector(".loomi-crop-backdrop")).to.not.exist;
    expect(el.selectedFiles[0].type).to.equal("image/png");
  });

  it("resizes images to fit resize-width/resize-height with no dialog", async () => {
    const el = await fixture<LoomiFilepicker>(
      html`<loomi-filepicker resize resize-width="1" resize-height="1"></loomi-filepicker>`,
    );

    selectFiles(el, [pngFile()]);
    await waitUntil(() => el.selectedFiles.length > 0);

    expect(el.shadowRoot!.querySelector(".loomi-crop-backdrop")).to.not.exist;
    expect(el.selectedFiles[0].type).to.equal("image/png");
  });
});
