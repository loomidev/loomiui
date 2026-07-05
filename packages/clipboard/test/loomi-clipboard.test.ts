import { html, fixture, expect, oneEvent } from "@open-wc/testing";
import "../dist/loomi-clipboard.js";
import type { LoomiClipboard } from "../dist/index.js";

describe("loomi-clipboard", () => {
  let originalClipboard: Clipboard | undefined;
  let copiedText = "";

  beforeEach(() => {
    originalClipboard = navigator.clipboard;
    copiedText = "";
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (value: string) => {
          copiedText = value;
        },
      },
    });
  });

  afterEach(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: originalClipboard,
    });
  });

  it("renders a copy button after the slotted content", async () => {
    const el = await fixture<LoomiClipboard>(html`
      <loomi-clipboard>Invoice number</loomi-clipboard>
    `);
    const button = el.shadowRoot!.querySelector<HTMLButtonElement>(".loomi-copy-button")!;

    expect(button).to.exist;
    expect(button.getAttribute("aria-label")).to.equal("Copy to clipboard");
    expect(el.shadowRoot!.querySelector("slot")).to.exist;
  });

  it("copies the text content from a wrapped div", async () => {
    const el = await fixture<LoomiClipboard>(html`
      <loomi-clipboard><div>https://example.com/share</div></loomi-clipboard>
    `);
    const copied = oneEvent(el, "copied");

    el.shadowRoot!.querySelector<HTMLButtonElement>(".loomi-copy-button")!.click();
    const event = await copied as CustomEvent<{ value: string }>;

    expect(copiedText).to.equal("https://example.com/share");
    expect(event.detail.value).to.equal("https://example.com/share");
  });

  it("prefers the value attribute over rendered text", async () => {
    const el = await fixture<LoomiClipboard>(html`
      <loomi-clipboard value="actual clipboard value">Visible text</loomi-clipboard>
    `);

    el.shadowRoot!.querySelector<HTMLButtonElement>(".loomi-copy-button")!.click();
    await oneEvent(el, "copied");

    expect(copiedText).to.equal("actual clipboard value");
  });

  it("shows copied feedback after copying", async () => {
    const el = await fixture<LoomiClipboard>(html`
      <loomi-clipboard copied-label="Done">Token</loomi-clipboard>
    `);

    el.shadowRoot!.querySelector<HTMLButtonElement>(".loomi-copy-button")!.click();
    await oneEvent(el, "copied");
    await el.updateComplete;

    const feedback = el.shadowRoot!.querySelector<HTMLElement>(".loomi-copy-feedback")!;
    expect(feedback.classList.contains("copied")).to.be.true;
    expect(feedback.textContent?.trim()).to.equal("Done");
  });

  it("adds a generated loomi name class to the host", async () => {
    const el = await fixture<LoomiClipboard>(html`
      <loomi-clipboard>Token</loomi-clipboard>
    `);

    expect([...el.classList].some((cls) => /^loomi-clipboard-[a-z0-9]{5}$/.test(cls))).to.be.true;
  });
});
