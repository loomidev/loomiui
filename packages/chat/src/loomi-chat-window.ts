import { html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { LoomiElement, loomiStyles, type LoomiColor } from "@loomidev/core";
import "@loomidev/avatar/loomi-avatar.js";
import "@loomidev/button/loomi-button.js";
import "@loomidev/dropmenu/loomi-dropmenu.js";
import "@loomidev/icon/loomi-icon.js";
import "@loomidev/spinner/loomi-spinner.js";
import "@loomidev/tooltip/loomi-tooltip.js";
import "./loomi-chat-message.js";
import {
  colorForParticipant,
  initialsFor,
  resolveParticipant,
  resolveSenderId,
  type LoomiChatConversation,
  type LoomiChatMessageData,
  type LoomiChatParticipant,
} from "./chat-utils.js";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiChatWindowMessage = LoomiChatMessageData;

const booleanAttribute = {
  fromAttribute(value: string | null): boolean {
    return value !== null && value.toLowerCase() !== "false";
  },
  toAttribute(value: boolean): string | null {
    return value ? "" : null;
  },
};

let messageUid = 0;

function createMessageId(): string {
  messageUid += 1;
  return `loomi-chat-${messageUid}`;
}

const SCROLL_THRESHOLD = 24;

/**
 * `<loomi-chat-window>` — a chat card with transcript, participant avatars, and composer.
 * Set `show-conversations` and assign `conversations` to add an inbox-style list pane on
 * the left; `conversations-avatars-only` collapses that pane to a slim avatar rail.
 *
 * @fires send - `detail: { message: LoomiChatWindowMessage }` when the current user sends.
 * @fires reset - when the conversation is reset.
 * @fires conversation-select - `detail: { conversation }` when a conversation row is clicked.
 *
 * @slot conversations-header - Custom markup (filters, compose button) above the conversation list.
 * @slot header-actions - Action buttons in the chat header, before the reset button.
 */
@customElement("loomi-chat-window")
export class LoomiChatWindow extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property() title = "New Chat";
  @property() description = "How can I help you today?";
  @property({ attribute: "empty-title" }) emptyTitle = "Morning!";
  @property({ attribute: "empty-description" })
  emptyDescription = "What are we working on today? Press send to start a new conversation.";
  @property({ attribute: "input-placeholder" }) inputPlaceholder = "Message…";
  @property({ attribute: "footer-note" }) footerNote = "";
  @property({ attribute: "window-height" }) windowHeight = "35rem";
  @property({ attribute: "current-user-id" }) currentUserId = "you";
  @property({ type: Array }) participants: LoomiChatParticipant[] = [];
  @property({ type: Array }) messages: LoomiChatWindowMessage[] = [];
  @property({ type: Number, attribute: "input-rows" }) inputRows = 1;
  @property({ type: Number, attribute: "input-max-rows" }) inputMaxRows = 5;
  @property({ type: Boolean, reflect: true }) busy = false;
  @property({ type: Boolean, reflect: true }) typing = false;
  @property({ attribute: "loading-text" }) loadingText = "";
  @property({ attribute: "loading-icon" }) loadingIcon = "";
  @property({ type: Boolean, attribute: "auto-scroll", converter: booleanAttribute })
  autoScroll = true;
  @property({ type: Boolean, attribute: "show-reset", converter: booleanAttribute })
  showReset = true;
  @property({ type: Boolean, attribute: "show-avatars", converter: booleanAttribute })
  showAvatars = false;
  @property({ type: Boolean, attribute: "show-header-avatars", converter: booleanAttribute })
  showHeaderAvatars = true;
  @property({ type: Boolean, attribute: "read-only", converter: booleanAttribute })
  readOnly = false;
  @property({ type: Array }) conversations: LoomiChatConversation[] = [];
  @property({ attribute: "active-conversation-id" }) activeConversationId = "";
  @property({ type: Boolean, attribute: "show-conversations", converter: booleanAttribute })
  showConversations = false;
  /** Collapse the conversation pane to an avatar rail (names move into tooltips). */
  @property({ type: Boolean, attribute: "conversations-avatars-only", converter: booleanAttribute })
  conversationsAvatarsOnly = false;

  @state() private draft = "";
  @state() private showJumpButton = false;
  @query(".loomi-chat-transcript") private transcriptEl?: HTMLElement;
  @query(".loomi-chat-input") private inputEl?: HTMLTextAreaElement;
  @query(".loomi-chat-file-input") private fileInputEl?: HTMLInputElement;
  @query(".loomi-chat-picture-input") private pictureInputEl?: HTMLInputElement;

  private pinnedToBottom = true;
  private resizeObserver?: ResizeObserver;

  override connectedCallback(): void {
    super.connectedCallback();
    this.style.setProperty("--loomi-chat-window-height", this.windowHeight);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.resizeObserver?.disconnect();
  }

  override firstUpdated(): void {
    const transcript = this.transcriptEl;
    if (!transcript) return;
    transcript.addEventListener("scroll", this.onTranscriptScroll, { passive: true });
    this.resizeObserver = new ResizeObserver(() => {
      if (this.pinnedToBottom && this.autoScroll) this.scrollToBottom("instant");
    });
    this.resizeObserver.observe(transcript);
    this.syncComposerHeight();
  }

  protected override updated(changed: PropertyValues<this>): void {
    super.updated(changed);
    if (changed.has("windowHeight")) {
      this.style.setProperty("--loomi-chat-window-height", this.windowHeight);
    }
    if (changed.has("messages") && this.pinnedToBottom && this.autoScroll) {
      this.updateComplete.then(() => this.scrollToBottom("instant"));
    }
    if (changed.has("inputRows") || changed.has("inputMaxRows")) {
      this.updateComplete.then(() => this.syncComposerHeight());
    }
  }

  /** Append a message to the transcript. */
  appendMessage(
    message: Omit<LoomiChatWindowMessage, "id"> & { id?: string },
  ): LoomiChatWindowMessage {
    const senderId = resolveSenderId(message, this.currentUserId);
    const next: LoomiChatWindowMessage = {
      id: message.id ?? createMessageId(),
      text: message.text,
      senderId,
      time: message.time ?? new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      attachment: message.attachment,
      role: message.role,
    };
    this.messages = [...this.messages, next];
    return next;
  }

  updateMessageText(id: string, text: string): void {
    this.messages = this.messages.map((message) =>
      message.id === id ? { ...message, text } : message,
    );
  }

  reset(): void {
    this.messages = [];
    this.draft = "";
    this.pinnedToBottom = true;
    this.showJumpButton = false;
    this.dispatchEvent(new CustomEvent("reset", { bubbles: true, composed: true }));
    this.updateComplete.then(() => this.syncComposerHeight());
  }

  scrollToBottom(behavior: ScrollBehavior = "smooth"): void {
    const transcript = this.transcriptEl;
    if (!transcript) return;
    transcript.scrollTo({ top: transcript.scrollHeight, behavior });
    this.pinnedToBottom = true;
    this.showJumpButton = false;
  }

  private get roster(): LoomiChatParticipant[] {
    if (this.participants.length) return this.participants;
    return [
      { id: this.currentUserId, name: "You", label: "YO", color: "primary" },
      { id: "assistant", name: "Assistant", label: "AI", color: "secondary" },
    ];
  }

  private get showMessageAvatars(): boolean {
    return this.showAvatars || this.roster.length > 2;
  }

  private onTranscriptScroll = (): void => {
    const transcript = this.transcriptEl;
    if (!transcript) return;
    const distance = transcript.scrollHeight - transcript.scrollTop - transcript.clientHeight;
    this.pinnedToBottom = distance <= SCROLL_THRESHOLD;
    this.showJumpButton = !this.pinnedToBottom;
  };

  private onDraftInput = (): void => {
    this.draft = this.inputEl?.value ?? "";
    this.syncComposerHeight();
  };

  private syncComposerHeight(): void {
    const input = this.inputEl;
    if (!input) return;
    input.style.height = "0px";
    const styles = getComputedStyle(input);
    const lineHeight = Number.parseFloat(styles.lineHeight) || 20;
    const padding =
      Number.parseFloat(styles.paddingTop) + Number.parseFloat(styles.paddingBottom);
    const minHeight = lineHeight * this.inputRows + padding;
    const maxHeight = lineHeight * this.inputMaxRows + padding;
    const contentHeight = input.scrollHeight;
    const nextHeight = Math.min(Math.max(contentHeight, minHeight), maxHeight);
    input.style.height = `${nextHeight}px`;
    input.style.overflowY = contentHeight > maxHeight ? "auto" : "hidden";
  }

  private onSubmit = (event?: Event): void => {
    event?.preventDefault();
    const text = this.draft.trim();
    if (!text || this.busy || this.readOnly) return;
    const message = this.appendMessage({ senderId: this.currentUserId, text, role: "user" });
    this.draft = "";
    if (this.inputEl) this.inputEl.value = "";
    this.syncComposerHeight();
    this.dispatchEvent(
      new CustomEvent("send", {
        bubbles: true,
        composed: true,
        detail: { message },
      }),
    );
  };

  private onReset = (): void => {
    if (this.busy) return;
    this.reset();
  };

  private chooseAttachment(type: "file" | "picture" | "user"): void {
    if (this.busy || this.readOnly) return;
    if (type === "file") this.fileInputEl?.click();
    else if (type === "picture") this.pictureInputEl?.click();
    else this.dispatchEvent(new CustomEvent("add-user", { bubbles: true, composed: true }));
  }

  private onAttachmentPicked = (type: "file" | "picture") => (event: Event): void => {
    const input = event.currentTarget as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    if (!files.length) return;
    this.dispatchEvent(
      new CustomEvent(type === "file" ? "attach-file" : "attach-picture", {
        bubbles: true,
        composed: true,
        detail: { files },
      }),
    );
    input.value = "";
  };

  private onRecord = async (): Promise<void> => {
    if (this.busy || this.readOnly) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.dispatchEvent(new CustomEvent("record", { bubbles: true, composed: true, detail: { stream } }));
    } catch (error) {
      this.dispatchEvent(new CustomEvent("record-error", { bubbles: true, composed: true, detail: { error } }));
    }
  };

  private onComposerKeydown = (event: KeyboardEvent): void => {
    if (event.key !== "Enter" || event.shiftKey || event.isComposing) return;
    event.preventDefault();
    this.onSubmit();
  };

  private renderHeaderAvatars(): TemplateResult {
    const roster = this.roster.slice(0, 5);
    const overflow = this.roster.length - roster.length;
    return html`<loomi-avatars stacked size="small" plus=${overflow > 0 ? overflow : nothing}>
      ${roster.map(
        (participant) => html`<loomi-avatar
          image=${participant.image ?? ""}
          label=${participant.label ?? initialsFor(participant.name)}
          alt=${participant.name}
          bg-color=${(participant.color ?? colorForParticipant(participant.id)) as LoomiColor}
        ></loomi-avatar>`,
      )}
    </loomi-avatars>`;
  }

  private onConversationClick(conversation: LoomiChatConversation): void {
    this.activeConversationId = conversation.id;
    this.dispatchEvent(
      new CustomEvent("conversation-select", {
        bubbles: true,
        composed: true,
        detail: { conversation },
      }),
    );
  }

  private renderConversationRow(conversation: LoomiChatConversation): TemplateResult {
    const active = conversation.id === this.activeConversationId;
    const unread = conversation.unread ?? 0;
    const color = conversation.color ?? colorForParticipant(conversation.id);
    const avatarsOnly = this.conversationsAvatarsOnly;

    return html`<button
      type="button"
      role="option"
      aria-selected=${active ? "true" : "false"}
      class="loomi-chat-conversation ${active ? "active" : ""}"
      title=${avatarsOnly ? conversation.name : nothing}
      @click=${() => this.onConversationClick(conversation)}
    >
      <span class="loomi-chat-conversation-avatar">
        <loomi-avatar
          size="small"
          image=${conversation.image ?? ""}
          label=${conversation.label ?? initialsFor(conversation.name)}
          alt=${conversation.name}
          bg-color=${color as LoomiColor}
        ></loomi-avatar>
        ${avatarsOnly && unread > 0 ? html`<span class="loomi-chat-conversation-dot"></span>` : nothing}
      </span>
      ${avatarsOnly
        ? nothing
        : html`<span class="loomi-chat-conversation-copy">
            <span class="loomi-chat-conversation-top">
              <span class="loomi-chat-conversation-name">${conversation.name}</span>
              ${conversation.time
                ? html`<span class="loomi-chat-conversation-time">${conversation.time}</span>`
                : nothing}
            </span>
            <span class="loomi-chat-conversation-bottom">
              ${conversation.preview
                ? html`<span class="loomi-chat-conversation-preview">${conversation.preview}</span>`
                : nothing}
              ${unread > 0 ? html`<span class="loomi-chat-conversation-unread">${unread}</span>` : nothing}
            </span>
          </span>`}
    </button>`;
  }

  private renderConversations(): TemplateResult {
    return html`<aside
      class="loomi-chat-conversations ${this.conversationsAvatarsOnly ? "avatars-only" : ""}"
      aria-label="Conversations"
    >
      <div class="loomi-chat-conversations-header">
        <slot name="conversations-header"></slot>
      </div>
      <div class="loomi-chat-conversation-list" role="listbox" aria-label="Conversations">
        ${this.conversations.map((conversation) => this.renderConversationRow(conversation))}
        ${this.conversations.length === 0
          ? html`<div class="loomi-chat-conversations-empty">No conversations</div>`
          : nothing}
      </div>
    </aside>`;
  }

  private renderMessages(): TemplateResult {
    const showAvatars = this.showMessageAvatars;
    const showSender = this.roster.length > 2;

    return html`${this.messages.map((message) => {
      const senderId = resolveSenderId(message, this.currentUserId);
      const participant = resolveParticipant(this.roster, senderId);
      const outgoing = senderId === this.currentUserId;
      const color = participant.color ?? colorForParticipant(senderId);

      return html`<loomi-chat-message
        text=${message.text}
        sender=${participant.name}
        sender-id=${senderId}
        image=${participant.image ?? ""}
        avatar-label=${participant.label ?? initialsFor(participant.name)}
        bubble-color=${color}
        time=${message.time ?? ""}
        .attachment=${message.attachment}
        ?outgoing=${outgoing}
        ?show-avatar=${showAvatars}
        ?show-sender=${showSender && !outgoing}
      ></loomi-chat-message>`;
    })}
    ${this.renderTypingIndicator()}`;
  }

  private renderTypingIndicator(): TemplateResult | typeof nothing {
    if (!this.typing && !this.busy) return nothing;
    const custom = this.loadingText || this.loadingIcon;
    return html`<div class="loomi-chat-row incoming loomi-chat-loading-row" role="status" aria-live="polite">
      <div class="loomi-chat-row-body">
        <div class="loomi-chat-loading ${custom ? "custom" : ""}">
          ${this.loadingIcon ? html`<loomi-icon name=${this.loadingIcon}></loomi-icon>` : nothing}
          ${this.loadingText ? html`<span>${this.loadingText}</span>` : nothing}
          ${custom
            ? nothing
            : html`<span class="loomi-typing-dots" aria-label="Typing">
                <span></span><span></span><span></span>
              </span>`}
        </div>
      </div>
    </div>`;
  }

  override render(): TemplateResult {
    const hasMessages = this.messages.length > 0 || this.typing || this.busy;

    return html`<div class="loomi-chat-window ${this.showConversations ? "has-conversations" : ""}">
      <div class="loomi-chat-card-wrap">
        <div class="loomi-chat-shell ${this.showConversations ? "with-conversations" : ""}">
          ${this.showConversations ? this.renderConversations() : nothing}
          <div class="loomi-chat-main">
          <header class="loomi-chat-header">
            ${this.showHeaderAvatars && this.roster.length > 1
              ? html`<div class="loomi-chat-header-avatars">${this.renderHeaderAvatars()}</div>`
              : nothing}
            <div class="loomi-chat-header-copy">
              <div class="loomi-chat-title">${this.title}</div>
              <div class="loomi-chat-description">${this.description}</div>
            </div>
            <div class="loomi-chat-header-actions">
              <slot name="header-actions"></slot>
            </div>
            ${this.showReset
              ? html`<loomi-tooltip content="Reset">
                  <loomi-button
                    class="loomi-chat-reset-btn"
                    type="secondary"
                    size="small"
                    radius="medium"
                    icon="arrow-path"
                    aria-label="Reset conversation"
                    ?disabled=${this.busy || !hasMessages}
                    @click=${this.onReset}
                  ></loomi-button>
                </loomi-tooltip>`
              : nothing}
          </header>

          <div class="loomi-chat-body">
            ${hasMessages
              ? html`<div class="loomi-chat-transcript-wrap">
                  <div
                    class="loomi-chat-transcript"
                    role="log"
                    aria-live="polite"
                    aria-relevant="additions"
                    aria-busy=${this.busy ? "true" : "false"}
                  >
                    ${this.renderMessages()}
                  </div>
                  <button
                    type="button"
                    class="loomi-chat-jump-btn"
                    data-active=${this.showJumpButton ? "true" : "false"}
                    ?hidden=${!this.showJumpButton}
                    aria-label="Jump to latest message"
                    @click=${() => this.scrollToBottom("smooth")}
                  >
                    <loomi-icon name="arrow-down"></loomi-icon>
                  </button>
                </div>`
              : html`<div class="loomi-chat-empty">
                  <loomi-icon name="chat-bubble-left-ellipsis" class="loomi-chat-empty-icon"></loomi-icon>
                  <div class="loomi-chat-empty-title">${this.emptyTitle}</div>
                  <div class="loomi-chat-empty-copy">${this.emptyDescription}</div>
                </div>`}
          </div>

          <footer class="loomi-chat-composer">
            <form class="loomi-chat-input-wrap" @submit=${this.onSubmit}>
              <div class="loomi-chat-input-group">
                <textarea
                  class="loomi-chat-input"
                  .value=${this.draft}
                  placeholder=${this.inputPlaceholder}
                  rows=${this.inputRows}
                  ?disabled=${this.busy || this.readOnly}
                  @input=${this.onDraftInput}
                  @keydown=${this.onComposerKeydown}
                ></textarea>
                <div class="loomi-chat-input-actions">
                  ${this.busy
                    ? html`<loomi-spinner type="dot" size="small" color="gray"></loomi-spinner>`
                    : nothing}
                  <input
                    class="loomi-chat-file-input"
                    type="file"
                    tabindex="-1"
                    @change=${this.onAttachmentPicked("file")}
                  />
                  <input
                    class="loomi-chat-picture-input"
                    type="file"
                    accept="image/*"
                    tabindex="-1"
                    @change=${this.onAttachmentPicked("picture")}
                  />
                  <div class="loomi-chat-send-tools">
                    <loomi-dropmenu placement="right">
                      <span slot="trigger" class="loomi-chat-attach-trigger" title="Attach">
                        <loomi-icon name="plus"></loomi-icon>
                      </span>
                      <loomi-dropmenu-item icon="paper-clip" @click=${() => this.chooseAttachment("file")}>Attach file</loomi-dropmenu-item>
                      <loomi-dropmenu-item icon="photo" @click=${() => this.chooseAttachment("picture")}>Attach picture</loomi-dropmenu-item>
                      <loomi-dropmenu-item icon="user-plus" @click=${() => this.chooseAttachment("user")}>Add user to chat</loomi-dropmenu-item>
                    </loomi-dropmenu>
                    <loomi-tooltip content="Record voice message">
                      <loomi-button
                        class="loomi-chat-mic-btn"
                        type="secondary"
                        size="small"
                        radius="full"
                        icon="microphone"
                        aria-label="Record voice message"
                        ?disabled=${this.busy || this.readOnly}
                        @click=${this.onRecord}
                      ></loomi-button>
                    </loomi-tooltip>
                  </div>
                  <loomi-button
                    class="loomi-chat-send-btn"
                    type="primary"
                    size="small"
                    radius="full"
                    icon="arrow-up"
                    aria-label="Send message"
                    ?disabled=${!this.draft.trim() || this.busy || this.readOnly}
                    @click=${this.onSubmit}
                  ></loomi-button>
                </div>
              </div>
            </form>
          </footer>
          </div>
        </div>
      </div>
      ${this.footerNote
        ? html`<div class="loomi-chat-footer-note">${this.footerNote}</div>`
        : nothing}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-chat-window": LoomiChatWindow;
  }
}
