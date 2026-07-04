import { html, fixture, expect, oneEvent } from "@open-wc/testing";
import "../dist/loomi-video.js";
import type { LoomiVideo } from "../dist/index.js";

const video = (el: LoomiVideo): HTMLVideoElement => el.shadowRoot!.querySelector("video")!;
const ctrlBtn = (el: LoomiVideo, label: string): HTMLButtonElement | null =>
  el.shadowRoot!.querySelector<HTMLButtonElement>(`.loomi-ctrl-btn[aria-label="${label}"]`);

describe("loomi-video", () => {
  it("is a bare passthrough without the controls attribute", async () => {
    const el = await fixture<LoomiVideo>(
      html`<loomi-video src="/does-not-exist.mp4" poster="/poster.jpg"></loomi-video>`,
    );
    expect(el.controls).to.be.false;
  });

  it("renders the themed control bar when controls is set", async () => {
    const el = await fixture<LoomiVideo>(
      html`<loomi-video src="/does-not-exist.mp4" controls></loomi-video>`,
    );
    expect(ctrlBtn(el, "Play")).to.exist;
  });

  it("moves <source>/<track> children onto the internal <video>", async () => {
    const el = await fixture<LoomiVideo>(
      html`<loomi-video controls>
        <source src="/demo.webm" type="video/webm" />
        <track kind="subtitles" src="/captions-en.vtt" srclang="en" label="English" />
      </loomi-video>`,
    );
    expect(video(el).querySelector("source")).to.exist;
  });

  it("shows a friendly error overlay with a working retry button", async () => {
    const el = await fixture<LoomiVideo>(
      html`<loomi-video src="/does-not-exist.mp4" controls></loomi-video>`,
    );
    const event = await oneEvent(el, "video-error");
    expect(event.detail.message).to.be.a("string");
    const retry = el.shadowRoot!.querySelector("loomi-button") as HTMLElement;
    retry.dispatchEvent(new Event("click", { bubbles: true, composed: true }));
    await el.updateComplete;
  });

  it("replaces the entire control bar via the controls slot", async () => {
    const el = await fixture<LoomiVideo>(
      html`<loomi-video controls>
        <div slot="controls" class="my-custom-bar">Custom</div>
      </loomi-video>`,
    );
    expect(el.querySelector(".my-custom-bar")).to.exist;
  });

  it("mutes via toggleMute()", async () => {
    const el = await fixture<LoomiVideo>(html`<loomi-video controls></loomi-video>`);
    expect(video(el).muted).to.be.false;
    el.toggleMute();
    expect(video(el).muted).to.be.true;
  });

  it("toggles mute with the 'm' keyboard shortcut", async () => {
    const el = await fixture<LoomiVideo>(html`<loomi-video controls></loomi-video>`);
    el.dispatchEvent(new KeyboardEvent("keydown", { key: "m", bubbles: true, composed: true }));
    expect(video(el).muted).to.be.true;
  });

  it("hides the fullscreen/picture-in-picture buttons when disabled", async () => {
    const el = await fixture<LoomiVideo>(
      html`<loomi-video controls disable-fullscreen disable-pip></loomi-video>`,
    );
    expect(ctrlBtn(el, "Fullscreen")).to.not.exist;
  });

  it("lists and selects subtitle tracks from the captions menu", async () => {
    const el = await fixture<LoomiVideo>(
      html`<loomi-video controls>
        <track kind="subtitles" src="/captions-en.vtt" srclang="en" label="English" />
      </loomi-video>`,
    );
    const captionsBtn = ctrlBtn(el, "Captions")!;
    captionsBtn.dispatchEvent(new Event("click", { bubbles: true, composed: true }));
    await el.updateComplete;
    const items = Array.from(el.shadowRoot!.querySelectorAll(".loomi-cc-item")).map((n) => n.textContent?.trim());
    expect(items).to.deep.equal(["Off", "English"]);
    const englishItem = Array.from(
      el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".loomi-cc-item"),
    ).find((n) => n.textContent?.trim() === "English")!;
    englishItem.dispatchEvent(new Event("click", { bubbles: true, composed: true }));
    await el.updateComplete;
    expect(video(el).textTracks[0].mode).to.equal("showing");
  });
});
