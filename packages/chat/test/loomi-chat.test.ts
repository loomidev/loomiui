import { html, fixture, expect, oneEvent } from "@open-wc/testing";
import "../dist/loomi-chat.js";
import "../dist/loomi-chat-window.js";
import type { LoomiChatWindow } from "../dist/index.js";

describe("loomi-chat", () => {
  it("renders message scroller parts", async () => {
    const el = await fixture(html`
      <loomi-chat-scroller auto-scroll style="height: 12rem">
        <loomi-chat-viewport>
          <loomi-chat-content>
            <loomi-chat-item message-id="1" scroll-anchor>
              <loomi-chat-message message-role="user" text="Hello there"></loomi-chat-message>
            </loomi-chat-item>
            <loomi-chat-item message-id="2">
              <loomi-chat-message message-role="assistant" text="Hi!"></loomi-chat-message>
            </loomi-chat-item>
          </loomi-chat-content>
        </loomi-chat-viewport>
        <loomi-chat-scroll-button direction="end"></loomi-chat-scroll-button>
      </loomi-chat-scroller>
    `);

    expect(el.querySelector("loomi-chat-viewport")).to.exist;
    expect(el.querySelector("loomi-chat-content")!.getAttribute("role")).to.equal("log");
    expect(el.querySelector("loomi-chat-message")!.text).to.equal("Hello there");
  });
});

describe("loomi-chat-window", () => {
  it("shows the empty state before any messages", async () => {
    const el = await fixture<LoomiChatWindow>(html`
      <loomi-chat-window empty-title="Morning!" empty-description="Start chatting"></loomi-chat-window>
    `);

    expect(el.shadowRoot!.querySelector("loomi-empty-state")).to.exist;
    expect(el.shadowRoot!.textContent).to.contain("Morning!");
  });

  it("appends messages and fires send", async () => {
    const el = await fixture<LoomiChatWindow>(html`
      <loomi-chat-window></loomi-chat-window>
    `);

    const textarea = el.shadowRoot!.querySelector("loomi-textarea") as HTMLElement & { value: string };
    textarea.value = "Need help with scroll behavior";
    textarea.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    await el.updateComplete;

    setTimeout(() => el.shadowRoot!.querySelector("form")!.requestSubmit());
    const event = await oneEvent(el, "send");

    expect(event.detail.message.text).to.equal("Need help with scroll behavior");
    expect(el.messages).to.have.length(1);
    expect(el.shadowRoot!.querySelector("loomi-chat-scroller")).to.exist;
  });

  it("resets the transcript", async () => {
    const el = await fixture<LoomiChatWindow>(html`<loomi-chat-window></loomi-chat-window>`);
    el.appendMessage({ role: "user", text: "First message" });
    await el.updateComplete;

    el.reset();
    await el.updateComplete;

    expect(el.messages).to.have.length(0);
    expect(el.shadowRoot!.querySelector("loomi-empty-state")).to.exist;
  });
});
