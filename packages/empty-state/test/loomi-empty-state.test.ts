import { html, fixture, expect, oneEvent } from "@open-wc/testing";
import "../dist/index.js";
import type { LoomiEmptyState } from "../dist/index.js";

describe("loomi-empty-state", () => {
  it("renders shadow content", async () => {
    const el = await fixture<LoomiEmptyState>(html`<loomi-empty-state></loomi-empty-state>`);
    expect(el.shadowRoot).to.exist;
    expect(el.shadowRoot!.childElementCount).to.be.greaterThan(0);
  });

  it("renders its heading and message", async () => {
    const el = await fixture<LoomiEmptyState>(
      html`<loomi-empty-state heading="Nothing here" message="Add your first item"></loomi-empty-state>`,
    );
    expect(el.shadowRoot!.querySelector(".loomi-heading")!.textContent).to.contain("Nothing here");
    expect(el.shadowRoot!.querySelector(".loomi-message")!.textContent).to.contain(
      "Add your first item",
    );
  });

  it("shows an action button only when it has a label", async () => {
    const plain = await fixture<LoomiEmptyState>(html`<loomi-empty-state></loomi-empty-state>`);
    expect(plain.shadowRoot!.querySelector(".loomi-btn")).to.not.exist;

    const withAction = await fixture<LoomiEmptyState>(
      html`<loomi-empty-state button-label="Create"></loomi-empty-state>`,
    );
    expect(withAction.shadowRoot!.querySelector(".loomi-btn")).to.exist;
  });

  it("emits an action event when the button is used", async () => {
    const el = await fixture<LoomiEmptyState>(
      html`<loomi-empty-state button-label="Create"></loomi-empty-state>`,
    );
    const button = el.shadowRoot!.querySelector(".loomi-btn") as HTMLElement;
    setTimeout(() => button.click());
    const event = await oneEvent(el, "action");
    expect(event).to.exist;
  });
});
