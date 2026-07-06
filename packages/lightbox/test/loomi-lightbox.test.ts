import { html, fixture, expect, fixtureCleanup } from "@open-wc/testing";
import "../dist/loomi-lightbox.js";
import type { LoomiLightboxImage } from "../dist/index.js";

describe("loomi-lightbox-image", () => {
  afterEach(() => {
    fixtureCleanup();
    // The component reparents itself to document.body while open — clean up anything a
    // failed assertion left behind so later tests don't see a stray open instance.
    for (const el of document.querySelectorAll("loomi-lightbox-image")) el.remove();
  });

  it("opens on trigger click and closes on Escape", async () => {
    const el = await fixture<LoomiLightboxImage>(
      html`<loomi-lightbox-image src="/full.jpg" alt="A photo"></loomi-lightbox-image>`,
    );
    expect(el.open).to.equal(false);

    el.shadowRoot!.querySelector<HTMLButtonElement>(".loomi-lightbox-trigger")!.click();
    await el.updateComplete;
    expect(el.open).to.equal(true);
    expect(el.shadowRoot!.querySelector(".loomi-lightbox-backdrop")).to.exist;
    expect(el.parentNode).to.equal(document.body);

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await el.updateComplete;
    expect(el.open).to.equal(false);
    expect(el.shadowRoot!.querySelector(".loomi-lightbox-backdrop")).to.not.exist;
  });

  it("restores its original DOM position on close", async () => {
    const wrap = await fixture<HTMLDivElement>(
      html`<div><loomi-lightbox-image src="/full.jpg"></loomi-lightbox-image></div>`,
    );
    const el = wrap.querySelector<LoomiLightboxImage>("loomi-lightbox-image")!;

    el.show();
    await el.updateComplete;
    expect(el.parentNode).to.equal(document.body);

    el.hide();
    await el.updateComplete;
    expect(el.parentNode).to.equal(wrap);
  });

  it("fires loomi-open and loomi-close", async () => {
    const el = await fixture<LoomiLightboxImage>(html`<loomi-lightbox-image src="/full.jpg"></loomi-lightbox-image>`);
    const events: string[] = [];
    el.addEventListener("loomi-open", () => events.push("open"));
    el.addEventListener("loomi-close", () => events.push("close"));

    el.show();
    await el.updateComplete;
    el.hide();
    await el.updateComplete;

    expect(events).to.deep.equal(["open", "close"]);
  });

  it("navigates Next/Prev between instances sharing a group, wrapping at the ends", async () => {
    const wrap = await fixture<HTMLDivElement>(html`
      <div>
        <loomi-lightbox-image src="/a.jpg" group="post"></loomi-lightbox-image>
        <loomi-lightbox-image src="/b.jpg" group="post"></loomi-lightbox-image>
        <loomi-lightbox-image src="/c.jpg" group="post"></loomi-lightbox-image>
      </div>
    `);
    const [first, second, third] = Array.from(
      wrap.querySelectorAll<LoomiLightboxImage>("loomi-lightbox-image"),
    );
    const states = () => [first.open, second.open, third.open];
    const settle = () => Promise.all([first.updateComplete, second.updateComplete, third.updateComplete]);

    first.show();
    await settle();
    expect(states()).to.deep.equal([true, false, false]);

    // Three members, not two — a regression where the currently-open instance's own
    // reparented-to-<body> DOM position (rather than its natural spot) got fed into the
    // Next/Prev index math only showed up with a third element to scramble the order.
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
    await settle();
    expect(states()).to.deep.equal([false, true, false]);

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
    await settle();
    expect(states()).to.deep.equal([false, false, true]);

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
    await settle();
    expect(states(), "wraps back to the first after the last").to.deep.equal([true, false, false]);

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));
    await settle();
    expect(states(), "wraps back to the last from the first").to.deep.equal([false, false, true]);

    third.hide();
  });

  it("has no Next/Prev controls when ungrouped, even with other lightboxes on the page", async () => {
    const wrap = await fixture<HTMLDivElement>(html`
      <div>
        <loomi-lightbox-image src="/a.jpg"></loomi-lightbox-image>
        <loomi-lightbox-image src="/b.jpg"></loomi-lightbox-image>
      </div>
    `);
    const first = wrap.querySelector<LoomiLightboxImage>("loomi-lightbox-image")!;

    first.show();
    await first.updateComplete;
    expect(first.shadowRoot!.querySelector(".loomi-lightbox-nav")).to.not.exist;

    first.hide();
  });

  it("reuses the slotted <img>'s alt when its own alt attribute is unset", async () => {
    const el = await fixture<LoomiLightboxImage>(html`
      <loomi-lightbox-image src="/full.jpg"><img src="/thumb.jpg" alt="Sunset over the lake" /></loomi-lightbox-image>
    `);
    // Let the slotchange event (fired async by the browser) update slottedAlt.
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;

    el.show();
    await el.updateComplete;
    const img = el.shadowRoot!.querySelector<HTMLImageElement>(".loomi-lightbox-image")!;
    expect(img.alt).to.equal("Sunset over the lake");

    el.hide();
  });
});
