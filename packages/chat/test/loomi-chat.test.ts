import { html, fixture, expect, oneEvent } from "@open-wc/testing";
import "../dist/loomi-chat-message.js";
import "../dist/loomi-chat-window.js";
import type { LoomiChatWindow } from "../dist/index.js";

describe("loomi-chat-message", () => {
  it("renders a tailed bubble with participant color", async () => {
    const el = await fixture(html`
      <loomi-chat-message
        text="Hey team"
        sender="Sara"
        sender-id="sara"
        bubble-color="warning"
        show-sender
      ></loomi-chat-message>
    `);

    expect(el.shadowRoot!.querySelector(".loomi-chat-bubble.tail-start")).to.exist;
    expect(el.shadowRoot!.querySelector(".loomi-chat-sender")!.textContent).to.equal("Sara");
  });
});

describe("loomi-chat-window", () => {
  it("shows the empty state before any messages", async () => {
    const el = await fixture<LoomiChatWindow>(html`
      <loomi-chat-window empty-title="Morning!" empty-description="Start chatting"></loomi-chat-window>
    `);

    expect(el.shadowRoot!.querySelector(".loomi-chat-shell")).to.exist;
    expect(el.shadowRoot!.textContent).to.contain("Morning!");
  });

  it("renders header avatars for group chats", async () => {
    const el = await fixture<LoomiChatWindow>(html`
      <loomi-chat-window
        .participants=${[
          { id: "you", name: "You", label: "YO", color: "primary" },
          { id: "sara", name: "Sara", label: "SA", color: "warning" },
          { id: "alex", name: "Alex", label: "AL", color: "success" },
        ]}
      ></loomi-chat-window>
    `);

    expect(el.shadowRoot!.querySelector("loomi-avatars")).to.exist;
  });

  it("appends messages and fires send", async () => {
    const el = await fixture<LoomiChatWindow>(html`
      <loomi-chat-window current-user-id="you"></loomi-chat-window>
    `);

    const textarea = el.shadowRoot!.querySelector("textarea") as HTMLTextAreaElement;
    textarea.value = "Need help with scroll behavior";
    textarea.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    await el.updateComplete;

    setTimeout(() => el.shadowRoot!.querySelector("form")!.requestSubmit());
    const event = await oneEvent(el, "send");

    expect(event.detail.message.text).to.equal("Need help with scroll behavior");
    expect(event.detail.message.senderId).to.equal("you");
    expect(el.messages).to.have.length(1);
    expect(el.shadowRoot!.querySelector("loomi-chat-message")).to.exist;
  });

  it("starts the composer at one row and grows up to input-max-rows", async () => {
    const el = await fixture<LoomiChatWindow>(html`
      <loomi-chat-window input-max-rows="4"></loomi-chat-window>
    `);
    const textarea = el.shadowRoot!.querySelector("textarea") as HTMLTextAreaElement;
    const lineHeight = Number.parseFloat(getComputedStyle(textarea).lineHeight) || 20;
    const padding =
      Number.parseFloat(getComputedStyle(textarea).paddingTop) +
      Number.parseFloat(getComputedStyle(textarea).paddingBottom);
    const oneRowHeight = lineHeight + padding;

    expect(Number.parseFloat(textarea.style.height)).to.be.closeTo(oneRowHeight, 2);

    textarea.value = "Line one\nLine two\nLine three\nLine four\nLine five";
    textarea.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    await el.updateComplete;

    expect(textarea.style.overflowY).to.equal("auto");
  });

  it("resets the transcript", async () => {
    const el = await fixture<LoomiChatWindow>(html`<loomi-chat-window></loomi-chat-window>`);
    el.appendMessage({ senderId: "you", text: "First message" });
    await el.updateComplete;

    el.reset();
    await el.updateComplete;

    expect(el.messages).to.have.length(0);
    expect(el.shadowRoot!.querySelector(".loomi-chat-empty")).to.exist;
  });
});
