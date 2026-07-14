import { html, fixture, expect, nextFrame, oneEvent } from "@open-wc/testing";
import "../dist/loomi-floating-panel.js";
import {
  showLoomiFloatingPanel,
  hideLoomiFloatingPanel,
  type LoomiFloatingPanel,
} from "../dist/index.js";

describe("loomi-floating-panel", () => {
  // The mount-in pop animation runs at real wall-clock speed in this suite's headless
  // Chromium; a nonzero duration leaves getBoundingClientRect() reads racing a still-mid
  // transform: scale(0.98) for a frame or two after open. Zero it out so tests that read
  // position/size right after opening see the settled rect deterministically.
  before(() => {
    document.documentElement.style.setProperty("--loomi-floating-panel-duration", "0s");
  });
  after(() => {
    document.documentElement.style.removeProperty("--loomi-floating-panel-duration");
  });

  // show()/hide() reparent the panel to document.body, which escapes the fixture
  // container @open-wc/testing's fixtureCleanup() removes after each test — hide any
  // panel left open so it doesn't leak into the next test's DOM.
  afterEach(() => {
    document
      .querySelectorAll<LoomiFloatingPanel>("loomi-floating-panel")
      .forEach((panel) => panel.hide());
  });

  it("is closed by default and opens via show()", async () => {
    const el = await fixture<LoomiFloatingPanel>(
      html`<loomi-floating-panel title="Hello">Body</loomi-floating-panel>`,
    );
    expect(el.open).to.be.false;
    expect(el.shadowRoot!.querySelector(".loomi-header")).to.not.exist;

    el.show();
    await el.updateComplete;
    expect(el.open).to.be.true;
    expect(el.shadowRoot!.querySelector(".loomi-header")).to.exist;
  });

  it("moves to document.body while open and restores its original position once closed", async () => {
    const wrapper = await fixture<HTMLDivElement>(html`
      <div>
        <section>
          <loomi-floating-panel title="Layered">Body</loomi-floating-panel>
          <span id="after"></span>
        </section>
      </div>
    `);
    const section = wrapper.querySelector("section")!;
    const after = wrapper.querySelector("#after")!;
    const el = section.querySelector("loomi-floating-panel") as LoomiFloatingPanel;

    el.show();
    await el.updateComplete;
    expect(el.parentNode).to.equal(document.body);

    el.hide();
    expect(el.parentNode).to.equal(section);
    expect(el.nextElementSibling).to.equal(after);
  });

  it("opens and closes via the global showLoomiFloatingPanel()/hideLoomiFloatingPanel() helpers", async () => {
    const el = await fixture<LoomiFloatingPanel>(
      html`<loomi-floating-panel name="test-panel"></loomi-floating-panel>`,
    );
    showLoomiFloatingPanel("test-panel");
    await el.updateComplete;
    expect(el.open).to.be.true;

    hideLoomiFloatingPanel("test-panel");
    expect(el.open).to.be.false;
  });

  it("moves via arrow keys on the header and fires loomi-drag", async () => {
    const el = await fixture<LoomiFloatingPanel>(html`
      <loomi-floating-panel top="100px" left="100px" width="200px" height="150px" open></loomi-floating-panel>
    `);
    await el.updateComplete;
    await nextFrame();
    const header = el.shadowRoot!.querySelector(".loomi-header") as HTMLElement;

    const dragged = oneEvent(el, "loomi-drag");
    header.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown", shiftKey: true, bubbles: true }),
    );
    const { detail } = await dragged;

    expect(el.style.top).to.equal("110px");
    expect(el.style.left).to.equal("100px");
    expect(detail.top).to.equal(110);
    expect(detail.left).to.equal(100);
  });

  it("ignores header arrow keys when no-drag is set", async () => {
    const el = await fixture<LoomiFloatingPanel>(html`
      <loomi-floating-panel top="50px" left="50px" no-drag open></loomi-floating-panel>
    `);
    await el.updateComplete;
    const header = el.shadowRoot!.querySelector(".loomi-header") as HTMLElement;
    header.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    await el.updateComplete;

    expect(el.style.left).to.equal("50px");
  });

  it("resizes via arrow keys on a resize handle, clamped to min-width, and fires loomi-resize", async () => {
    const el = await fixture<LoomiFloatingPanel>(html`
      <loomi-floating-panel
        top="100px"
        left="100px"
        width="200px"
        height="150px"
        min-width="195"
        open
      ></loomi-floating-panel>
    `);
    await el.updateComplete;
    await nextFrame();
    const handle = el.shadowRoot!.querySelector(".loomi-resize.dir-e") as HTMLElement;

    const resized = oneEvent(el, "loomi-resize");
    handle.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowLeft", shiftKey: true, bubbles: true }),
    );
    const { detail } = await resized;

    // Shrinking by the 10px shift-step would go to 190px, but min-width clamps it to 195.
    expect(el.style.width).to.equal("195px");
    expect(el.style.left).to.equal("100px");
    expect(detail.width).to.equal(195);
  });

  it("hides resize handles when resizable is false", async () => {
    const el = await fixture<LoomiFloatingPanel>(
      html`<loomi-floating-panel resizable="false" open></loomi-floating-panel>`,
    );
    await el.updateComplete;
    expect(el.shadowRoot!.querySelectorAll(".loomi-resize").length).to.equal(0);
  });

  it("only shows the minimize/maximize buttons when their attributes are set", async () => {
    const bare = await fixture<LoomiFloatingPanel>(
      html`<loomi-floating-panel open></loomi-floating-panel>`,
    );
    await bare.updateComplete;
    expect(bare.shadowRoot!.querySelector(".loomi-minimize")).to.not.exist;
    expect(bare.shadowRoot!.querySelector(".loomi-maximize")).to.not.exist;

    const full = await fixture<LoomiFloatingPanel>(
      html`<loomi-floating-panel minimize maximize open></loomi-floating-panel>`,
    );
    await full.updateComplete;
    expect(full.shadowRoot!.querySelector(".loomi-minimize")).to.exist;
    expect(full.shadowRoot!.querySelector(".loomi-maximize")).to.exist;
  });

  it("toggles minimized on click and fires loomi-minimize", async () => {
    const el = await fixture<LoomiFloatingPanel>(
      html`<loomi-floating-panel minimize open></loomi-floating-panel>`,
    );
    await el.updateComplete;
    const btn = el.shadowRoot!.querySelector<HTMLButtonElement>(".loomi-minimize")!;

    const minimized = oneEvent(el, "loomi-minimize");
    btn.click();
    const { detail } = await minimized;

    expect(detail.minimized).to.equal(true);
    expect(el.minimized).to.equal(true);
    expect(getComputedStyle(el.shadowRoot!.querySelector(".loomi-body")!).display).to.equal("none");
  });

  it("toggles maximized on click, fires loomi-maximize, and clears minimized", async () => {
    const el = await fixture<LoomiFloatingPanel>(
      html`<loomi-floating-panel minimize maximize minimized open></loomi-floating-panel>`,
    );
    await el.updateComplete;
    expect(el.minimized).to.equal(true);

    const btn = el.shadowRoot!.querySelector<HTMLButtonElement>(".loomi-maximize")!;
    const maximized = oneEvent(el, "loomi-maximize");
    btn.click();
    const { detail } = await maximized;

    expect(detail.maximized).to.equal(true);
    expect(el.maximized).to.equal(true);
    expect(el.minimized).to.equal(false);
  });

  it("toggles maximize on header double-click only when maximize is enabled", async () => {
    const el = await fixture<LoomiFloatingPanel>(
      html`<loomi-floating-panel open></loomi-floating-panel>`,
    );
    await el.updateComplete;
    el.shadowRoot!.querySelector(".loomi-header")!.dispatchEvent(
      new MouseEvent("dblclick", { bubbles: true }),
    );
    expect(el.maximized).to.equal(false);

    el.maximize = true;
    await el.updateComplete;
    el.shadowRoot!.querySelector(".loomi-header")!.dispatchEvent(
      new MouseEvent("dblclick", { bubbles: true }),
    );
    expect(el.maximized).to.equal(true);
  });

  it("restricts dragging to the grip when drag-handle is set", async () => {
    const el = await fixture<LoomiFloatingPanel>(html`
      <loomi-floating-panel top="100px" left="100px" width="200px" height="150px" drag-handle open></loomi-floating-panel>
    `);
    await el.updateComplete;
    await nextFrame();

    const header = el.shadowRoot!.querySelector(".loomi-header") as HTMLElement;
    header.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    await el.updateComplete;
    expect(el.style.left).to.equal("100px");

    const grip = el.shadowRoot!.querySelector(".loomi-grip") as HTMLElement;
    expect(grip).to.exist;
    grip.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    await el.updateComplete;
    expect(el.style.left).to.equal("101px");
  });

  it("closes on Escape only while focus is inside the panel", async () => {
    const el = await fixture<LoomiFloatingPanel>(
      html`<loomi-floating-panel title="Scoped" open></loomi-floating-panel>`,
    );
    await el.updateComplete;

    (document.activeElement as HTMLElement | null)?.blur();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await el.updateComplete;
    expect(el.open).to.be.true;

    const header = el.shadowRoot!.querySelector(".loomi-header") as HTMLElement;
    header.focus();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await el.updateComplete;
    expect(el.open).to.be.false;
  });

  it("persists position via auto-save-id and restores it on a fresh instance", async () => {
    const key = "loomi-floating-panel:test-persist";
    localStorage.removeItem(key);

    const el = await fixture<LoomiFloatingPanel>(html`
      <loomi-floating-panel top="50px" left="50px" width="220px" height="160px" auto-save-id="test-persist" open>
      </loomi-floating-panel>
    `);
    await el.updateComplete;
    await nextFrame();
    const header = el.shadowRoot!.querySelector(".loomi-header") as HTMLElement;
    header.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown", shiftKey: true, bubbles: true }),
    );
    await el.updateComplete;

    const saved = JSON.parse(localStorage.getItem(key)!);
    expect(saved.top).to.equal(60);

    const fresh = await fixture<LoomiFloatingPanel>(html`
      <loomi-floating-panel auto-save-id="test-persist" open></loomi-floating-panel>
    `);
    await fresh.updateComplete;
    expect(fresh.style.top).to.equal("60px");

    localStorage.removeItem(key);
  });
});
