import { html, fixture, expect, oneEvent } from "@open-wc/testing";
import "../dist/loomi-modal.js";
import { showLoomiModal, hideLoomiModal, type LoomiModal } from "../dist/index.js";

describe("loomi-modal", () => {
  it("is closed by default and opens via show()", async () => {
    const el = await fixture<LoomiModal>(html`<loomi-modal title="Hello">Body</loomi-modal>`);
    expect(el.open).to.be.false;
    expect(el.shadowRoot!.querySelector(".loomi-backdrop")).to.not.exist;

    el.show();
    await el.updateComplete;
    expect(el.open).to.be.true;
    expect(el.shadowRoot!.querySelector(".loomi-backdrop")).to.exist;
  });

  it('fires "ok" and closes when the primary button is clicked', async () => {
    const el = await fixture<LoomiModal>(html`<loomi-modal ok-button-label="Yes"></loomi-modal>`);
    el.show();
    await el.updateComplete;
    const btn = el.shadowRoot!.querySelector(".loomi-btn.primary") as HTMLButtonElement;
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
    // first focusable in the dialog (no close icon here) is the "No" (cancel) button
    expect(document.activeElement).to.equal(el);
    expect(el.shadowRoot!.activeElement).to.equal(el.shadowRoot!.querySelector(".loomi-btn.ghost"));

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

    const cancelBtn = el.shadowRoot!.querySelector(".loomi-btn.ghost") as HTMLButtonElement;
    const okBtn = el.shadowRoot!.querySelector(".loomi-btn.primary") as HTMLButtonElement;

    // Tab forward from the LAST focusable element wraps to the FIRST.
    okBtn.focus();
    expect(el.shadowRoot!.activeElement).to.equal(okBtn);
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true }));
    expect(el.shadowRoot!.activeElement).to.equal(cancelBtn);

    // Shift+Tab from the FIRST focusable element wraps to the LAST.
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Tab", shiftKey: true, bubbles: true, cancelable: true }),
    );
    expect(el.shadowRoot!.activeElement).to.equal(okBtn);
  });
});
