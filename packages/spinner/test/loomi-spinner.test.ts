import { html, fixture, expect } from "@open-wc/testing";
import "../dist/loomi-spinner.js";
import type { LoomiSpinner } from "../dist/index.js";

describe("loomi-spinner", () => {
  it("renders the simple line indicator by default", async () => {
    const el = await fixture<LoomiSpinner>(html`<loomi-spinner></loomi-spinner>`);
    const indicator = el.shadowRoot!.querySelector(".loomi-spinner-simple");

    expect(el.type).to.equal("line-simple");
    expect(indicator).to.exist;
    expect(indicator!.getAttribute("aria-hidden")).to.equal("true");
    expect(el.shadowRoot!.querySelector('[role="status"]')!.getAttribute("aria-label")).to.equal("Loading");
  });

  it("renders the line spinner option", async () => {
    const el = await fixture<LoomiSpinner>(html`<loomi-spinner type="line-spinner"></loomi-spinner>`);

    expect(el.shadowRoot!.querySelectorAll(".loomi-spinner-lines line")).to.have.length(8);
  });

  it("renders the dot circle option with a visible label", async () => {
    const el = await fixture<LoomiSpinner>(
      html`<loomi-spinner type="dot-circle" label="Saving"></loomi-spinner>`,
    );

    expect(el.shadowRoot!.querySelectorAll(".loomi-spinner-dots circle")).to.have.length(8);
    expect(el.shadowRoot!.querySelector(".loomi-spinner-label")!.textContent).to.equal("Saving");
    expect(el.shadowRoot!.querySelector('[role="status"]')!.getAttribute("aria-label")).to.equal("Saving");
  });

  it("accepts Untitled UI size aliases", async () => {
    const el = await fixture<LoomiSpinner>(html`<loomi-spinner size="md"></loomi-spinner>`);

    expect(el.shadowRoot!.querySelector(".loomi-spinner-wrap")!.classList.contains("size-medium")).to.be.true;
  });
});
