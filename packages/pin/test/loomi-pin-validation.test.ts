import { html, fixture, expect, waitUntil } from "@open-wc/testing";
import "../dist/loomi-pin.js";
import type { LoomiPin } from "../dist/index.js";
import type { LoomiNotification } from "@loomidev/notification";

const inputs = (el: LoomiPin): HTMLInputElement[] =>
  Array.from(el.shadowRoot!.querySelectorAll<HTMLInputElement>("input"));

describe("loomi-pin validation", () => {
  // The toast system is lazy-imported, so a toast triggered in one test can land on
  // document.body asynchronously during the next. Flush pending toasts and clear the
  // shared host so every test starts from a clean slate.
  beforeEach(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
    document.body.querySelectorAll("loomi-notification").forEach((n) => n.remove());
  });

  afterEach(() => {
    document.querySelectorAll("loomi-notification").forEach((el) => el.remove());
  });

  it("shows a spinner while validating and disables the boxes", async () => {
    const el = await fixture<LoomiPin>(html`<loomi-pin></loomi-pin>`);

    el.startValidating();
    await el.updateComplete;

    expect(el.validating).to.be.true;
    expect(el.hasAttribute("validating")).to.be.true;
    expect(el.shadowRoot!.querySelector(".loomi-status.is-validating")).to.exist;
    expect(inputs(el).every((box) => box.disabled)).to.be.true;
  });

  it("switches from the spinner to a green checkmark on success", async () => {
    const el = await fixture<LoomiPin>(html`<loomi-pin></loomi-pin>`);

    el.startValidating();
    await el.updateComplete;
    el.showSuccess();
    await el.updateComplete;

    expect(el.validating).to.be.false;
    expect(el.valid).to.be.true;
    expect(el.hasAttribute("valid")).to.be.true;
    expect(el.shadowRoot!.querySelector(".loomi-status.is-validating")).to.not.exist;
    expect(el.shadowRoot!.querySelector(".loomi-status.is-valid")).to.exist;
    expect(inputs(el).every((box) => !box.disabled)).to.be.true;
  });

  it("turns every box red on failure, even when error-message is not set", async () => {
    const el = await fixture<LoomiPin>(html`<loomi-pin></loomi-pin>`);
    const field = inputs(el)[0];
    const validBorder = getComputedStyle(field).borderColor;

    el.startValidating();
    await el.updateComplete;
    el.showError();
    await el.updateComplete;

    expect(el.invalid).to.be.true;
    expect(el.validating).to.be.false;
    expect(el.hasAttribute("invalid")).to.be.true;
    expect(getComputedStyle(field).borderColor).to.not.equal(validBorder);
  });

  it("renders error-message inline when show-error-inline is set", async () => {
    const el = await fixture<LoomiPin>(
      html`<loomi-pin error-message="Yikes, check your code" show-error-inline></loomi-pin>`,
    );

    el.showError();
    await el.updateComplete;

    const error = el.shadowRoot!.querySelector(".loomi-error");
    expect(error).to.exist;
    expect(error!.textContent).to.equal("Yikes, check your code");
    expect(document.body.querySelector("loomi-notification")).to.not.exist;
  });

  it("shows error-message as a loomi-notification toast when show-error-inline is false", async () => {
    const el = await fixture<LoomiPin>(
      html`<loomi-pin label="Verification code" error-message="Yikes, check your code"></loomi-pin>`,
    );

    el.showError();
    await el.updateComplete;

    // The toast module is lazy-imported on the first failure, so the host (and its keyed
    // re-render — earlier tests in this file leave a stale toast host behind) appears asynchronously.
    await waitUntil(() =>
      document.body.querySelector("loomi-notification")?.shadowRoot?.textContent?.includes("Yikes, check your code") ?? false,
    );
    const host = document.body.querySelector("loomi-notification") as LoomiNotification;
    expect(host).to.exist;
    await host.updateComplete;

    expect(host.shadowRoot!.querySelector(".loomi-message")!.textContent).to.equal("Yikes, check your code");
    expect(host.shadowRoot!.querySelector(".loomi-title")!.textContent).to.equal("Verification code");
    expect(el.shadowRoot!.querySelector(".loomi-error")).to.not.exist;
  });

  it("does not stack a new toast on every re-validation while still invalid", async () => {
    const el = await fixture<LoomiPin>(html`<loomi-pin error-message="Yikes, check your code"></loomi-pin>`);

    el.showError();
    await el.updateComplete;
    el.showError();
    el.showError();
    await el.updateComplete;

    // The toast module is lazy-imported on the first failure, so the host appears asynchronously.
    await waitUntil(() => !!document.body.querySelector("loomi-notification"));
    const hosts = document.body.querySelectorAll("loomi-notification");
    expect(hosts).to.have.length(1);
    const host = hosts[0] as LoomiNotification;
    await host.updateComplete;
    expect(host.shadowRoot!.querySelectorAll(".loomi-toast")).to.have.length(1);
  });

  it("accepts a one-off message override without mutating error-message permanently", async () => {
    const el = await fixture<LoomiPin>(html`<loomi-pin show-error-inline></loomi-pin>`);

    el.showError("Too many attempts, try again later");
    await el.updateComplete;

    expect(el.errorMessage).to.equal("Too many attempts, try again later");
    expect(el.shadowRoot!.querySelector(".loomi-error")!.textContent).to.equal("Too many attempts, try again later");
  });

  it("resets validating/valid/invalid state as soon as the user edits a box again", async () => {
    const el = await fixture<LoomiPin>(html`<loomi-pin show-error-inline></loomi-pin>`);

    el.showError();
    await el.updateComplete;
    expect(el.invalid).to.be.true;

    const box = inputs(el)[0];
    box.value = "5";
    box.dispatchEvent(new InputEvent("input", { bubbles: true, composed: true }));
    await el.updateComplete;

    expect(el.invalid).to.be.false;
    expect(el.shadowRoot!.querySelector(".loomi-error")).to.not.exist;
  });

  it("clear() resets validating/valid/invalid along with the digits", async () => {
    const el = await fixture<LoomiPin>(html`<loomi-pin></loomi-pin>`);

    el.showSuccess();
    await el.updateComplete;
    el.clear();
    await el.updateComplete;

    expect(el.valid).to.be.false;
    expect(el.invalid).to.be.false;
    expect(el.validating).to.be.false;
    expect(el.pin).to.equal("");
  });
});
