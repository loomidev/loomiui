import { html, fixture, expect } from "@open-wc/testing";
import "../dist/loomi-input.js";
import type { LoomiInput } from "../dist/index.js";
import type { LoomiNotification } from "@loomidev/notification";

describe("loomi-input validation", () => {
  afterEach(() => {
    document.querySelectorAll("loomi-notification").forEach((el) => el.remove());
  });

  it("shows the red invalid border even when error-message is not set", async () => {
    const el = await fixture<LoomiInput>(html`<loomi-input required label="Name"></loomi-input>`);
    const field = el.shadowRoot!.querySelector(".loomi-field") as HTMLElement;
    const validBorder = getComputedStyle(field).borderColor;

    const ok = el.validate();
    await el.updateComplete;

    expect(ok).to.be.false;
    expect(el.invalid).to.be.true;
    expect(el.hasAttribute("invalid")).to.be.true;
    expect(getComputedStyle(field).borderColor).to.not.equal(validBorder);
    expect(el.shadowRoot!.querySelector(".loomi-error")).to.not.exist;
    expect(document.body.querySelector("loomi-notification")).to.not.exist;
  });

  it("renders error-message inline when show-error-inline is set", async () => {
    const el = await fixture<LoomiInput>(
      html`<loomi-input required label="Full name" error-message="Your name is required" show-error-inline></loomi-input>`,
    );

    el.validate();
    await el.updateComplete;

    const error = el.shadowRoot!.querySelector(".loomi-error");
    expect(error).to.exist;
    expect(error!.textContent).to.equal("Your name is required");
    expect(document.body.querySelector("loomi-notification")).to.not.exist;
  });

  it("shows error-message as a loomi-notification toast when show-error-inline is false", async () => {
    const el = await fixture<LoomiInput>(
      html`<loomi-input required label="Full name" error-message="Your name is required"></loomi-input>`,
    );

    el.validate();
    await el.updateComplete;

    const host = document.body.querySelector("loomi-notification") as LoomiNotification;
    expect(host).to.exist;
    await host.updateComplete;

    expect(host.shadowRoot!.querySelector(".loomi-message")!.textContent).to.equal("Your name is required");
    expect(host.shadowRoot!.querySelector(".loomi-title")!.textContent).to.equal("Full name");
    expect(el.shadowRoot!.querySelector(".loomi-error")).to.not.exist;
  });

  it("does not stack a new toast on every re-validation while still invalid", async () => {
    const el = await fixture<LoomiInput>(
      html`<loomi-input required label="Full name" error-message="Your name is required"></loomi-input>`,
    );

    el.validate();
    await el.updateComplete;
    el.validate();
    el.validate();
    await el.updateComplete;

    const hosts = document.body.querySelectorAll("loomi-notification");
    expect(hosts).to.have.length(1);
    const host = hosts[0] as LoomiNotification;
    await host.updateComplete;
    expect(host.shadowRoot!.querySelectorAll(".loomi-toast")).to.have.length(1);
  });

  it("reuses the same toast slot across repeated invalid transitions instead of stacking", async () => {
    const el = await fixture<LoomiInput>(
      html`<loomi-input required label="Full name" error-message="Your name is required"></loomi-input>`,
    );

    el.validate(); // 1st transition: valid -> invalid
    await el.updateComplete;

    el.value = "Jane";
    el.validate(); // now valid again
    await el.updateComplete;
    expect(el.invalid).to.be.false;

    el.value = "";
    el.validate(); // 2nd transition: valid -> invalid
    await el.updateComplete;

    const hosts = document.body.querySelectorAll("loomi-notification");
    expect(hosts).to.have.length(1);
    const host = hosts[0] as LoomiNotification;
    await host.updateComplete;
    expect(host.shadowRoot!.querySelectorAll(".loomi-toast")).to.have.length(1);
  });

  it("does not notify for a field that passes validation", async () => {
    const el = await fixture<LoomiInput>(html`<loomi-input label="Full name" error-message="Your name is required"></loomi-input>`);

    const ok = el.validate();
    await el.updateComplete;

    expect(ok).to.be.true;
    expect(el.invalid).to.be.false;
    expect(document.body.querySelector("loomi-notification")).to.not.exist;
  });
});
