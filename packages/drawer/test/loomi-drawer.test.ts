import { html, fixture, expect, nextFrame, oneEvent } from "@open-wc/testing";
import "../dist/loomi-drawer.js";
import { showLoomiDrawer, hideLoomiDrawer, type LoomiDrawer } from "../dist/index.js";

describe("loomi-drawer", () => {
  // Real CSS animations run at real wall-clock speed in this suite's headless Chromium —
  // shrink the close animation so hide()'s animationend wait doesn't slow the suite down.
  before(() => {
    document.documentElement.style.setProperty("--loomi-drawer-duration", "0.01s");
  });
  after(() => {
    document.documentElement.style.removeProperty("--loomi-drawer-duration");
  });

  afterEach(async () => {
    await Promise.all(
      Array.from(document.querySelectorAll<LoomiDrawer>("loomi-drawer")).map((drawer) => drawer.hide()),
    );
  });

  it("is closed by default and opens via show()", async () => {
    const el = await fixture<LoomiDrawer>(html`<loomi-drawer title="Hello">Body</loomi-drawer>`);
    expect(el.open).to.be.false;
    expect(el.shadowRoot!.querySelector(".loomi-panel")).to.not.exist;

    el.show();
    await el.updateComplete;
    expect(el.open).to.be.true;
    expect(el.shadowRoot!.querySelector(".loomi-panel")).to.exist;
  });

  it("moves to document.body while open and restores its original position once fully closed", async () => {
    const wrapper = await fixture<HTMLDivElement>(html`
      <div>
        <section>
          <loomi-drawer title="Layered">Body</loomi-drawer>
          <span id="after"></span>
        </section>
      </div>
    `);
    const section = wrapper.querySelector("section")!;
    const after = wrapper.querySelector("#after")!;
    const el = section.querySelector("loomi-drawer") as LoomiDrawer;

    el.show();
    await el.updateComplete;
    expect(el.parentNode).to.equal(document.body);

    await el.hide();
    expect(el.open).to.be.false;
    expect(el.parentNode).to.equal(section);
    expect(el.nextElementSibling).to.equal(after);
  });

  it('prevents document scrolling by default and honors prevent-scroll="false"', async () => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousDocumentOverflow = document.documentElement.style.overflow;

    const el = await fixture<LoomiDrawer>(html`<loomi-drawer></loomi-drawer>`);
    el.show();
    await el.updateComplete;
    expect(document.body.style.overflow).to.equal("hidden");
    expect(document.documentElement.style.overflow).to.equal("hidden");

    await el.hide();
    expect(document.body.style.overflow).to.equal(previousBodyOverflow);
    expect(document.documentElement.style.overflow).to.equal(previousDocumentOverflow);

    const unlocked = await fixture<LoomiDrawer>(html`<loomi-drawer prevent-scroll="false"></loomi-drawer>`);
    unlocked.show();
    await unlocked.updateComplete;
    expect(document.body.style.overflow).to.equal(previousBodyOverflow);
    expect(document.documentElement.style.overflow).to.equal(previousDocumentOverflow);
  });

  it("opens and closes via the global showLoomiDrawer()/hideLoomiDrawer() helpers", async () => {
    const el = await fixture<LoomiDrawer>(html`<loomi-drawer name="test-drawer"></loomi-drawer>`);
    showLoomiDrawer("test-drawer");
    await el.updateComplete;
    expect(el.open).to.be.true;

    const closeEvent = oneEvent(el, "close");
    hideLoomiDrawer("test-drawer");
    await closeEvent;
    await new Promise((r) => setTimeout(r, 100));
    expect(el.open).to.be.false;
  });

  it("moves focus into the panel on show() and restores it on hide()", async () => {
    const wrapper = await fixture<HTMLDivElement>(html`
      <div>
        <button id="trigger">Open</button>
        <loomi-drawer><input id="field" /></loomi-drawer>
      </div>
    `);
    const trigger = wrapper.querySelector("#trigger") as HTMLButtonElement;
    const el = wrapper.querySelector("loomi-drawer") as LoomiDrawer;

    trigger.focus();
    expect(document.activeElement).to.equal(trigger);

    el.show();
    await el.updateComplete;
    await nextFrame();
    // first focusable in the panel (close button shows by default) takes focus
    expect(document.activeElement).to.equal(el);
    const closeBtn = el.shadowRoot!.querySelector(".loomi-close") as HTMLElement;
    expect(el.shadowRoot!.activeElement).to.equal(closeBtn);

    await el.hide();
    expect(document.activeElement).to.equal(trigger);
  });

  it("traps Tab focus inside the panel while open (backdrop on)", async () => {
    const el = await fixture<LoomiDrawer>(
      html`<loomi-drawer><input id="a" /><input id="b" /></loomi-drawer>`,
    );
    el.show();
    await el.updateComplete;
    await nextFrame();

    const closeBtn = el.shadowRoot!.querySelector(".loomi-close") as HTMLElement;
    const fieldB = el.querySelector("#b") as HTMLInputElement;

    // Tab forward from the LAST focusable element (fieldB, slotted) wraps to the FIRST
    // (the close button, inside the shadow root — so document.activeElement retargets to `el`).
    fieldB.focus();
    expect(document.activeElement).to.equal(fieldB);
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true }));
    expect(document.activeElement).to.equal(el);
    expect(el.shadowRoot!.activeElement).to.equal(closeBtn);

    // Shift+Tab from the FIRST focusable element wraps to the LAST (fieldB, slotted —
    // not shadow-internal, so document.activeElement resolves directly to it).
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Tab", shiftKey: true, bubbles: true, cancelable: true }),
    );
    expect(document.activeElement).to.equal(fieldB);
  });

  it("does not trap Tab focus and reports aria-modal=false when backdrop is disabled", async () => {
    const el = await fixture<LoomiDrawer>(html`<loomi-drawer backdrop="false"><input id="a" /></loomi-drawer>`);
    el.show();
    await el.updateComplete;
    await nextFrame();

    expect(el.shadowRoot!.querySelector(".loomi-panel")!.getAttribute("aria-modal")).to.equal("false");

    (el.querySelector("#a") as HTMLInputElement).focus();
    const evt = new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true });
    document.dispatchEvent(evt);
    expect(evt.defaultPrevented).to.be.false;
  });

  it("closes on Escape regardless of backdrop/close-on-outside-click settings", async () => {
    const el = await fixture<LoomiDrawer>(
      html`<loomi-drawer backdrop="false" close-on-outside-click="false"></loomi-drawer>`,
    );
    el.show();
    await el.updateComplete;

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await new Promise((r) => setTimeout(r, 100));
    expect(el.open).to.be.false;
  });

  it('closes on a backdrop click by default, and honors close-on-outside-click="false"', async () => {
    const el = await fixture<LoomiDrawer>(html`<loomi-drawer></loomi-drawer>`);
    el.show();
    await el.updateComplete;
    (el.shadowRoot!.querySelector(".loomi-backdrop") as HTMLElement).click();
    await new Promise((r) => setTimeout(r, 100));
    expect(el.open).to.be.false;

    const locked = await fixture<LoomiDrawer>(html`<loomi-drawer close-on-outside-click="false"></loomi-drawer>`);
    locked.show();
    await locked.updateComplete;
    (locked.shadowRoot!.querySelector(".loomi-backdrop") as HTMLElement).click();
    await locked.updateComplete;
    expect(locked.open).to.be.true;
  });

  it("closes on an outside click even when no backdrop is rendered", async () => {
    const el = await fixture<LoomiDrawer>(html`<loomi-drawer backdrop="false"></loomi-drawer>`);
    el.show();
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".loomi-backdrop")).to.not.exist;

    document.body.click();
    await new Promise((r) => setTimeout(r, 100));
    expect(el.open).to.be.false;
  });

  it("does not close when clicking inside the panel", async () => {
    const el = await fixture<LoomiDrawer>(html`<loomi-drawer><button id="inside">Inside</button></loomi-drawer>`);
    el.show();
    await el.updateComplete;
    (el.querySelector("#inside") as HTMLElement).click();
    await el.updateComplete;
    expect(el.open).to.be.true;
  });

  it("defaults to placement=right and size=medium", async () => {
    const el = await fixture<LoomiDrawer>(html`<loomi-drawer></loomi-drawer>`);
    el.show();
    await el.updateComplete;
    const panel = el.shadowRoot!.querySelector(".loomi-panel")!;
    expect(panel.classList.contains("placement-right")).to.be.true;
    expect(panel.classList.contains("size-medium")).to.be.true;
  });

  it("applies placement and size classes to the panel", async () => {
    const el = await fixture<LoomiDrawer>(html`<loomi-drawer placement="left" size="large"></loomi-drawer>`);
    el.show();
    await el.updateComplete;
    const panel = el.shadowRoot!.querySelector(".loomi-panel")!;
    expect(panel.classList.contains("placement-left")).to.be.true;
    expect(panel.classList.contains("size-large")).to.be.true;
  });

  it('shows a close button by default and hides it via show-close-icon="false"', async () => {
    const el = await fixture<LoomiDrawer>(html`<loomi-drawer></loomi-drawer>`);
    el.show();
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".loomi-close loomi-icon[name='x-mark']")).to.exist;

    const noClose = await fixture<LoomiDrawer>(html`<loomi-drawer show-close-icon="false"></loomi-drawer>`);
    noClose.show();
    await noClose.updateComplete;
    expect(noClose.shadowRoot!.querySelector(".loomi-close")).to.not.exist;
  });

  it('fires "close" and closes when the close button is clicked', async () => {
    const el = await fixture<LoomiDrawer>(html`<loomi-drawer></loomi-drawer>`);
    el.show();
    await el.updateComplete;
    const closeEvent = oneEvent(el, "close");
    (el.shadowRoot!.querySelector(".loomi-close") as HTMLElement).click();
    await closeEvent;
    await new Promise((r) => setTimeout(r, 100));
    expect(el.open).to.be.false;
  });
});
