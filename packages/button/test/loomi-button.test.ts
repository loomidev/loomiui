import { html, fixture, expect } from "@open-wc/testing";
import "../dist/loomi-button.js";
import type { LoomiButton } from "../dist/index.js";

describe("loomi-button", () => {
  it("renders with default attributes", async () => {
    const el = await fixture<LoomiButton>(html`<loomi-button>Click me</loomi-button>`);
    expect(el.type).to.equal("primary");
    expect(el.size).to.equal("regular");
    expect(el.shadowRoot!.querySelector("button")).to.exist;
    // "Click me" is light-DOM content projected through the default <slot> — it lives
    // on the host's own textContent, not the shadow-DOM slot's (slots don't include
    // distributed nodes in their own .textContent).
    expect(el.textContent!.trim()).to.equal("Click me");
  });

  it("renders as an anchor when tag is a", async () => {
    const el = await fixture<LoomiButton>(
      html`<loomi-button tag="a" href="https://example.com">Link</loomi-button>`,
    );
    const a = el.shadowRoot!.querySelector("a");
    expect(a).to.exist;
    expect(a!.getAttribute("href")).to.equal("https://example.com");
  });

  it("strips href and suppresses click on a disabled link-button", async () => {
    const el = await fixture<LoomiButton>(
      html`<loomi-button tag="a" href="https://example.com" disabled>Open</loomi-button>`,
    );
    const a = el.shadowRoot!.querySelector("a")!;
    expect(a.hasAttribute("href")).to.be.false;
    let clicked = false;
    el.addEventListener("click", () => (clicked = true));
    a.click();
    expect(clicked).to.be.false;
  });

  it("toggles the spinner via startSpinner()/stopSpinner()", async () => {
    const el = await fixture<LoomiButton>(html`<loomi-button has-spinner>Save</loomi-button>`);
    expect(el.showSpinner).to.be.false;
    el.startSpinner();
    expect(el.showSpinner).to.be.true;
    el.stopSpinner();
    expect(el.showSpinner).to.be.false;
  });

  it("reflects the ancestor `dark` class as `.is-dark` without relying on :host-context()", async () => {
    const el = await fixture<LoomiButton>(html`<loomi-button outline>Save</loomi-button>`);
    const btn = () => el.shadowRoot!.querySelector("button")!;
    expect(btn().classList.contains("is-dark")).to.be.false;

    // MutationObserver callbacks land in a microtask after the mutating script finishes,
    // so give it a frame before checking updateComplete (which may already be settled
    // from an earlier render at the moment the mutation is made).
    const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

    document.documentElement.classList.add("dark");
    await nextFrame();
    await el.updateComplete;
    expect(btn().classList.contains("is-dark")).to.be.true;

    document.documentElement.classList.remove("dark");
    await nextFrame();
    await el.updateComplete;
    expect(btn().classList.contains("is-dark")).to.be.false;
  });

  it("focuses the inner control when the host is focused", async () => {
    // Components that hand focus back to a trigger — a menu closing, a dialog
    // returning — call focus() on the host. Without delegatesFocus that is a
    // silent no-op, and the failure only shows up in keyboard testing.
    const el = await fixture<LoomiButton>(html`<loomi-button>Save</loomi-button>`);
    el.focus();
    await el.updateComplete;

    expect(el.shadowRoot!.activeElement).to.equal(el.shadowRoot!.querySelector("button"));
  });

  it("submits the form it sits in, across the shadow boundary", async () => {
    // `type="submit"` alone does nothing here: the rendered <button> is inside
    // this component's shadow root, and form association never crosses one — so
    // the consumer's <form> never hears about it.
    const form = await fixture<HTMLFormElement>(
      html`<form><loomi-button can-submit>Save</loomi-button></form>`,
    );
    let submitted = false;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      submitted = true;
    });

    const el = form.querySelector<LoomiButton>("loomi-button")!;
    await el.updateComplete;
    el.shadowRoot!.querySelector("button")!.click();
    expect(submitted).to.be.true;
  });

  it("does not submit when it is not a submit button", async () => {
    const form = await fixture<HTMLFormElement>(
      html`<form><loomi-button>Cancel</loomi-button></form>`,
    );
    let submitted = false;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      submitted = true;
    });

    const el = form.querySelector<LoomiButton>("loomi-button")!;
    await el.updateComplete;
    el.shadowRoot!.querySelector("button")!.click();
    expect(submitted).to.be.false;
  });

  it("does not submit while disabled", async () => {
    const form = await fixture<HTMLFormElement>(
      html`<form><loomi-button can-submit disabled>Save</loomi-button></form>`,
    );
    let submitted = false;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      submitted = true;
    });

    const el = form.querySelector<LoomiButton>("loomi-button")!;
    await el.updateComplete;
    el.shadowRoot!.querySelector("button")!.click();
    expect(submitted).to.be.false;
  });
});
