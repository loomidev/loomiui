import { html, fixture, expect } from "@open-wc/testing";
import { waitFor } from "../../../test/wait.js";
import "../dist/loomi-filepicker.js";
import type { LoomiFilepicker } from "../dist/index.js";
import type { LoomiModal } from "@loomidev/modal";
import type { LoomiNotification } from "@loomidev/notification";

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

/**
 * The crop dialog belonging to the test that is currently running.
 *
 * `loomi-modal` relocates itself to `document.body` on `show()` and stays there after it
 * closes, so every earlier crop test leaves a spent modal behind. A plain
 * `document.querySelector(".loomi-crop-modal")` returns the oldest of those rather than
 * this test's, and clicking its footer fires `ok` at a filepicker whose crop session is
 * long finished. Selecting on `open` picks the live one.
 */
function openCropModal(): LoomiModal | undefined {
  return [...document.querySelectorAll<LoomiModal>(".loomi-crop-modal")].find((m) => m.open);
}

function selectFiles(el: LoomiFilepicker, files: File[]): void {
  const input = nativeInput(el);
  const dt = new DataTransfer();
  for (const f of files) dt.items.add(f);
  input.files = dt.files;
  input.dispatchEvent(new Event("change", { bubbles: true }));
}

describe("loomi-filepicker", () => {
  // The toast system is lazy-imported, so a toast triggered in one test can land on
  // document.body asynchronously during the next. Flush pending toasts and clear the
  // shared host so every test starts from a clean slate.
  beforeEach(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
    document.body.querySelectorAll("loomi-notification").forEach((n) => n.remove());
  });

  afterEach(() => {
    // The crop dialog is a real <loomi-modal> that relocates itself to document.body
    // while open, and toasts mount their own <loomi-notification> host there too.
    document.querySelectorAll<LoomiModal>(".loomi-crop-modal").forEach((el) => el.hide());
    document.querySelectorAll("loomi-notification").forEach((el) => el.remove());
  });

  it('honors show-image-preview="false", can-browse="false", and can-drop="false"', async () => {
    const el = await fixture<LoomiFilepicker>(
      html`<loomi-filepicker show-image-preview="false" can-browse="false" can-drop="false"></loomi-filepicker>`,
    );

    expect(el.showImagePreview).to.be.false;
    expect(el.canBrowse).to.be.false;
    expect(el.canDrop).to.be.false;
  });

  it("supports a transparent, borderless drop-zone", async () => {
    const el = await fixture<LoomiFilepicker>(
      html`<loomi-filepicker transparent has-border="false"></loomi-filepicker>`,
    );
    const dropZone = el.shadowRoot!.querySelector(".loomi-drop")!;
    const styles = getComputedStyle(dropZone);

    expect(el.transparent).to.be.true;
    expect(el.hasBorder).to.be.false;
    expect(styles.backgroundColor).to.equal("rgba(0, 0, 0, 0)");
    expect(styles.borderColor).to.equal("rgba(0, 0, 0, 0)");
  });

  it("adds a selected file and dispatches change", async () => {
    const el = await fixture<LoomiFilepicker>(html`<loomi-filepicker></loomi-filepicker>`);
    let detail: { files: File[] } | undefined;
    el.addEventListener("change", (e) => (detail = (e as CustomEvent).detail));

    selectFiles(el, [textFile()]);
    await waitFor(() => el.selectedFiles.length > 0);

    expect(el.selectedFiles[0].name).to.equal("notes.txt");
    expect(detail?.files).to.have.lengthOf(1);
  });

  it("shows a loomi-notification toast and skips files over max-file-size", async () => {
    const el = await fixture<LoomiFilepicker>(
      html`<loomi-filepicker max-file-size="1kb"></loomi-filepicker>`,
    );
    const bigFile = new File([new Uint8Array(2048)], "big.bin", {
      type: "application/octet-stream",
    });

    selectFiles(el, [bigFile]);
    await el.updateComplete;

    expect(el.selectedFiles).to.have.lengthOf(0);
    // The toast module is lazy-imported on the first failure, so the host appears asynchronously.
    await waitFor(() => !!document.body.querySelector("loomi-notification"));
    const host = document.body.querySelector("loomi-notification") as LoomiNotification;
    expect(host).to.exist;
    await host.updateComplete;
    expect(host.shadowRoot!.querySelector(".loomi-title")!.textContent).to.equal("File too large");
    expect(host.shadowRoot!.querySelector(".loomi-message")!.textContent).to.include("big.bin");
  });

  it("skips the crop dialog for non-image files even when crop is enabled", async () => {
    const el = await fixture<LoomiFilepicker>(html`<loomi-filepicker crop></loomi-filepicker>`);

    selectFiles(el, [textFile()]);
    await waitFor(() => el.selectedFiles.length > 0);

    const modal = el.shadowRoot!.querySelector(".loomi-crop-modal") as LoomiModal;
    expect(modal.open).to.be.false;
  });

  it("launches a crop dialog for images and discards the file on cancel", async () => {
    const el = await fixture<LoomiFilepicker>(html`<loomi-filepicker crop></loomi-filepicker>`);

    selectFiles(el, [pngFile()]);
    await waitFor(() => !!openCropModal());
    const modal = openCropModal()!;

    const cancelBtn = modal.shadowRoot!.querySelector(
      ".loomi-footer loomi-button[type='secondary']",
    ) as HTMLElement;
    cancelBtn.click();
    await waitFor(() => !modal.open);

    expect(el.selectedFiles).to.have.lengthOf(0);
  });

  it("crops the image and adds the cropped file on apply", async () => {
    const el = await fixture<LoomiFilepicker>(
      html`<loomi-filepicker crop crop-aspect-ratio="1:1"></loomi-filepicker>`,
    );

    selectFiles(el, [pngFile()]);
    await waitFor(() => !!openCropModal());
    const modal = openCropModal()!;
    await waitFor(() => !!modal.querySelector(".loomi-crop-rect"));

    const okBtn = modal.shadowRoot!.querySelector(
      ".loomi-footer loomi-button:not([type='secondary'])",
    ) as HTMLElement;
    okBtn.click();
    await waitFor(() => el.selectedFiles.length > 0);

    expect(modal.open).to.be.false;
    expect(el.selectedFiles[0].type).to.equal("image/png");
  });

  it("stealth hides the drop-zone but open() still triggers the native input", async () => {
    const el = await fixture<LoomiFilepicker>(html`<loomi-filepicker stealth></loomi-filepicker>`);
    const input = nativeInput(el);
    let clicked = false;
    input.addEventListener("click", () => (clicked = true));

    expect(getComputedStyle(el.shadowRoot!.querySelector(".loomi-drop")!).position).to.equal(
      "absolute",
    );

    el.open();
    expect(clicked).to.be.true;
  });

  it("clear() resets the selection so a re-pick replaces it at max-files", async () => {
    const el = await fixture<LoomiFilepicker>(html`<loomi-filepicker stealth></loomi-filepicker>`);

    selectFiles(el, [textFile("first.txt")]);
    await waitFor(() => el.selectedFiles.length > 0);
    expect(el.selectedFiles[0].name).to.equal("first.txt");

    el.clear();
    expect(el.selectedFiles).to.have.lengthOf(0);

    selectFiles(el, [textFile("second.txt")]);
    await waitFor(() => el.selectedFiles.length > 0);
    expect(el.selectedFiles[0].name).to.equal("second.txt");
  });

  it("resizes images to fit resize-width/resize-height with no dialog", async () => {
    const el = await fixture<LoomiFilepicker>(
      html`<loomi-filepicker resize resize-width="1" resize-height="1"></loomi-filepicker>`,
    );

    selectFiles(el, [pngFile()]);
    await waitFor(() => el.selectedFiles.length > 0);

    expect(document.querySelector(".loomi-crop-modal[open]")).to.not.exist;
    expect(el.selectedFiles[0].type).to.equal("image/png");
  });
});
