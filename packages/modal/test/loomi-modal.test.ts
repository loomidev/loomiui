import { html, fixture, expect, nextFrame, oneEvent } from "@open-wc/testing";
import "../dist/loomi-modal.js";
import { showLoomiModal, hideLoomiModal, type LoomiModal } from "../dist/index.js";

function actionControl(action: Element): HTMLButtonElement {
  return action.shadowRoot!.querySelector('[part="button"]') as HTMLButtonElement;
}

describe("loomi-modal", () => {
  afterEach(() => {
    for (const modal of Array.from(document.querySelectorAll<LoomiModal>("loomi-modal"))) {
      modal.hide();
    }
  });

  it("is closed by default and opens via show()", async () => {
    const el = await fixture<LoomiModal>(html`<loomi-modal title="Hello">Body</loomi-modal>`);
    expect(el.open).to.be.false;
    expect(el.shadowRoot!.querySelector(".loomi-backdrop")).to.not.exist;

    el.show();
    await el.updateComplete;
    expect(el.open).to.be.true;
    expect(el.shadowRoot!.querySelector(".loomi-backdrop")).to.exist;
  });

  it("moves to document.body while open and restores its original position on close", async () => {
    const wrapper = await fixture<HTMLDivElement>(html`
      <div>
        <section>
          <loomi-modal title="Layered">Body</loomi-modal>
          <span id="after"></span>
        </section>
      </div>
    `);
    const section = wrapper.querySelector("section")!;
    const after = wrapper.querySelector("#after")!;
    const el = section.querySelector("loomi-modal") as LoomiModal;

    el.show();
    await el.updateComplete;
    expect(el.parentNode).to.equal(document.body);

    el.hide();
    await el.updateComplete;
    expect(el.parentNode).to.equal(section);
    expect(el.nextElementSibling).to.equal(after);
  });

  it('prevents document scrolling by default and honors prevent-scroll="false"', async () => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousDocumentOverflow = document.documentElement.style.overflow;

    const el = await fixture<LoomiModal>(html`<loomi-modal></loomi-modal>`);
    el.show();
    await el.updateComplete;
    expect(document.body.style.overflow).to.equal("hidden");
    expect(document.documentElement.style.overflow).to.equal("hidden");

    el.hide();
    await el.updateComplete;
    expect(document.body.style.overflow).to.equal(previousBodyOverflow);
    expect(document.documentElement.style.overflow).to.equal(previousDocumentOverflow);

    const unlocked = await fixture<LoomiModal>(html`<loomi-modal prevent-scroll="false"></loomi-modal>`);
    unlocked.show();
    await unlocked.updateComplete;
    expect(document.body.style.overflow).to.equal(previousBodyOverflow);
    expect(document.documentElement.style.overflow).to.equal(previousDocumentOverflow);
  });

  it('fires "ok" and closes when the primary button is clicked', async () => {
    const el = await fixture<LoomiModal>(html`<loomi-modal ok-button-label="Yes"></loomi-modal>`);
    el.show();
    await el.updateComplete;
    const btn = el.shadowRoot!.querySelector(".loomi-footer loomi-button:not([type='secondary'])") as HTMLElement;
    const okEvent = oneEvent(el, "ok");
    btn.click();
    await okEvent;
    await el.updateComplete;
    expect(el.open).to.be.false;
  });

  it("opens and closes via the global showLoomiModal()/hideLoomiModal() helpers", async () => {
    const el = await fixture<LoomiModal>(html`<loomi-modal name="test-modal"></loomi-modal>`);
    showLoomiModal("test-modal");
    await el.updateComplete;
    expect(el.open).to.be.true;

    hideLoomiModal("test-modal");
    await el.updateComplete;
    expect(el.open).to.be.false;
  });

  it("moves focus into the dialog on show() and restores it on hide()", async () => {
    const wrapper = await fixture<HTMLDivElement>(html`
      <div>
        <button id="trigger">Open</button>
        <loomi-modal ok-button-label="Yes" cancel-button-label="No"></loomi-modal>
      </div>
    `);
    const trigger = wrapper.querySelector("#trigger") as HTMLButtonElement;
    const el = wrapper.querySelector("loomi-modal") as LoomiModal;

    trigger.focus();
    expect(document.activeElement).to.equal(trigger);

    el.show();
    await el.updateComplete;
    await nextFrame();
    // first focusable in the dialog (no close icon here) is the "No" (cancel) button
    expect(document.activeElement).to.equal(el);
    const cancelAction = el.shadowRoot!.querySelector(".loomi-footer loomi-button[type='secondary']") as HTMLElement;
    expect(el.shadowRoot!.activeElement).to.equal(cancelAction);
    expect(cancelAction.shadowRoot!.activeElement).to.equal(actionControl(cancelAction));

    el.hide();
    await el.updateComplete;
    expect(document.activeElement).to.equal(trigger);
  });

  it("traps Tab focus inside the dialog while open", async () => {
    const el = await fixture<LoomiModal>(
      html`<loomi-modal ok-button-label="Yes" cancel-button-label="No"></loomi-modal>`,
    );
    el.show();
    await el.updateComplete;
    await nextFrame();

    const cancelAction = el.shadowRoot!.querySelector(".loomi-footer loomi-button[type='secondary']") as HTMLElement;
    const okAction = el.shadowRoot!.querySelector(".loomi-footer loomi-button:not([type='secondary'])") as HTMLElement;
    const cancelBtn = actionControl(cancelAction);
    const okBtn = actionControl(okAction);

    // Tab forward from the LAST focusable element wraps to the FIRST.
    okBtn.focus();
    expect(okAction.shadowRoot!.activeElement).to.equal(okBtn);
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true }));
    expect(el.shadowRoot!.activeElement).to.equal(cancelAction);
    expect(cancelAction.shadowRoot!.activeElement).to.equal(cancelBtn);

    // Shift+Tab from the FIRST focusable element wraps to the LAST.
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Tab", shiftKey: true, bubbles: true, cancelable: true }),
    );
    expect(el.shadowRoot!.activeElement).to.equal(okAction);
    expect(okAction.shadowRoot!.activeElement).to.equal(okBtn);
  });

  it('honors backdrop-can-close="false" for backdrop clicks and Escape', async () => {
    const el = await fixture<LoomiModal>(html`<loomi-modal backdrop-can-close="false"></loomi-modal>`);
    el.show();
    await el.updateComplete;

    (el.shadowRoot!.querySelector(".loomi-backdrop") as HTMLElement).click();
    await el.updateComplete;
    expect(el.open).to.be.true;

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await el.updateComplete;
    expect(el.open).to.be.true;
  });

  it("renders icons through loomi-icon and action buttons through loomi-button", async () => {
    const el = await fixture<LoomiModal>(
      html`<loomi-modal type="warning" title="Careful" show-close-icon></loomi-modal>`,
    );
    el.show();
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector('.loomi-icon-wrap loomi-icon[name="exclamation-triangle"]')).to.exist;
    expect(el.shadowRoot!.querySelector('.loomi-close loomi-icon[name="x-mark"]')).to.exist;
    expect(el.shadowRoot!.querySelectorAll('.loomi-footer loomi-button[size="small"]')).to.have.length(2);
  });

  it('defaults the icon to "heroicons" and honors a custom icon-source', async () => {
    const defaultEl = await fixture<LoomiModal>(html`<loomi-modal icon="cloud-arrow-down"></loomi-modal>`);
    defaultEl.show();
    await defaultEl.updateComplete;
    const defaultIcon = defaultEl.shadowRoot!.querySelector(".loomi-icon-wrap loomi-icon")!;
    expect(defaultIcon.getAttribute("source")).to.equal("heroicons");

    const el = await fixture<LoomiModal>(
      html`<loomi-modal icon="home" icon-source="iconsax"></loomi-modal>`,
    );
    el.show();
    await el.updateComplete;
    const icon = el.shadowRoot!.querySelector('.loomi-icon-wrap loomi-icon[name="home"]')!;
    expect(icon.getAttribute("source")).to.equal("iconsax");
  });
});
