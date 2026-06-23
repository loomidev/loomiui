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
});
