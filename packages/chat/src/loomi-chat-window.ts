import { html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { LoomiElement, loomiStyles } from "@loomidev/core";
import "@loomidev/button/loomi-button.js";
import "@loomidev/card/loomi-card.js";
import "@loomidev/empty-state/loomi-empty-state.js";
import "@loomidev/icon/loomi-icon.js";
import "@loomidev/spinner/loomi-spinner.js";
import "@loomidev/textarea/loomi-textarea.js";
import "@loomidev/tooltip/loomi-tooltip.js";
import type { LoomiTextarea } from "@loomidev/textarea";
import "./loomi-chat.js";
import { componentStyles } from "./generated/styles.css.js";

export interface LoomiChatWindowMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  sender?: string;
}

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

/**
 * `<loomi-chat-window>` — a shadcn/ui-style chat card with message scroller, empty
 * state, reset control, and composer footer.
 *
 * @fires send - `detail: { message: LoomiChatWindowMessage }` when the user sends.
 * @fires reset - when the conversation is reset.
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
  @property({ type: Boolean, reflect: true }) busy = false;
  @property({ type: Boolean, attribute: "auto-scroll", converter: booleanAttribute })
  autoScroll = true;
  @property({ type: Boolean, attribute: "show-reset", converter: booleanAttribute })
  showReset = true;
  @property({ type: Boolean, attribute: "read-only", converter: booleanAttribute })
  readOnly = false;

  @property({ type: Array }) messages: LoomiChatWindowMessage[] = [];

  @state() private draft = "";
  @query("loomi-textarea") private textareaEl?: LoomiTextarea;

  override connectedCallback(): void {
    super.connectedCallback();
    this.style.setProperty("--loomi-chat-window-height", this.windowHeight);
  }

  protected override updated(changed: PropertyValues<this>): void {
    super.updated(changed);
    if (changed.has("windowHeight")) {
      this.style.setProperty("--loomi-chat-window-height", this.windowHeight);
    }
  }

  /** Append a message to the transcript. */
  appendMessage(message: Omit<LoomiChatWindowMessage, "id"> & { id?: string }): LoomiChatWindowMessage {
    const next: LoomiChatWindowMessage = {
      id: message.id ?? createMessageId(),
      role: message.role,
      text: message.text,
      sender: message.sender,
    };
    this.messages = [...this.messages, next];
    return next;
  }

  /** Replace the text of an existing message (for streaming). */
  updateMessageText(id: string, text: string): void {
    this.messages = this.messages.map((message) =>
      message.id === id ? { ...message, text } : message,
    );
  }

  /** Clear the transcript and composer. */
  reset(): void {
    this.messages = [];
    this.draft = "";
    this.dispatchEvent(new CustomEvent("reset", { bubbles: true, composed: true }));
  }

  private onDraftInput = (event: Event): void => {
    const target = event.target as LoomiTextarea;
    this.draft = target.value;
  };

  private onSubmit = (event?: Event): void => {
    event?.preventDefault();
    const text = this.draft.trim();
    if (!text || this.busy || this.readOnly) return;
    const message = this.appendMessage({ role: "user", text });
    this.draft = "";
    if (this.textareaEl) this.textareaEl.value = "";
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

  private onComposerKeydown = (event: KeyboardEvent): void => {
    if (event.key !== "Enter" || event.shiftKey || event.isComposing) return;
    event.preventDefault();
    this.onSubmit();
  };

  private renderMessages(): TemplateResult {
    return html`${this.messages.map(
      (message) => html`<loomi-chat-item
        message-id=${message.id}
        ?scroll-anchor=${message.role === "user"}
      >
        <loomi-chat-message
          message-role=${message.role}
          .variant=${message.role === "user" ? "muted" : "ghost"}
          sender=${message.sender ?? ""}
          text=${message.text}
        ></loomi-chat-message>
      </loomi-chat-item>`,
    )}`;
  }

  override render(): TemplateResult {
    const hasMessages = this.messages.length > 0;

    return html`<div class="loomi-chat-window">
      <div class="loomi-chat-card-wrap">
        <loomi-card size="sm" class="card-host">
          <loomi-card-header>
            <loomi-card-title>${this.title}</loomi-card-title>
            <loomi-card-description>${this.description}</loomi-card-description>
            ${this.showReset
              ? html`<loomi-card-action>
                  <loomi-tooltip content="Reset">
                    <loomi-button
                      class="loomi-chat-reset-btn"
                      type="secondary"
                      size="small"
                      radius="medium"
                      aria-label="Reset conversation"
                      ?disabled=${this.busy || !hasMessages}
                      @click=${this.onReset}
                    >
                      <loomi-icon name="arrow-path" slot="prefix"></loomi-icon>
                    </loomi-button>
                  </loomi-tooltip>
                </loomi-card-action>`
              : nothing}
          </loomi-card-header>

          <loomi-card-content>
            ${hasMessages
              ? html`<loomi-chat-scroller
                  ?auto-scroll=${this.autoScroll}
                  default-scroll-position="end"
                  scroll-previous-item-peek="64"
                >
                  <loomi-chat-viewport>
                    <loomi-chat-content ?transcript-busy=${this.busy}>
                      ${this.renderMessages()}
                    </loomi-chat-content>
                  </loomi-chat-viewport>
                  <loomi-chat-scroll-button direction="end"></loomi-chat-scroll-button>
                </loomi-chat-scroller>`
              : html`<div class="loomi-chat-empty">
                  <loomi-empty-state show-image="false">
                    <loomi-icon
                      name="chat-bubble-left-ellipsis"
                      style="width:2rem;height:2rem;color:var(--loomi-text-muted)"
                    ></loomi-icon>
                    <div class="loomi-heading">${this.emptyTitle}</div>
                    <div class="loomi-message">${this.emptyDescription}</div>
                  </loomi-empty-state>
                </div>`}
          </loomi-card-content>

          <loomi-card-footer>
            <form class="loomi-chat-input-wrap" @submit=${this.onSubmit}>
              <div class="loomi-chat-input-group">
                <div class="loomi-chat-input-body">
                  <loomi-textarea
                    .value=${this.draft}
                    placeholder=${this.inputPlaceholder}
                    rows="2"
                    ?disabled=${this.busy || this.readOnly}
                    @input=${this.onDraftInput}
                    @keydown=${this.onComposerKeydown}
                  ></loomi-textarea>
                </div>
                <div class="loomi-chat-input-actions">
                  ${this.busy
                    ? html`<loomi-spinner type="dot" size="small" color="gray"></loomi-spinner>`
                    : nothing}
                  <loomi-button
                    type="primary"
                    size="small"
                    radius="full"
                    aria-label="Send message"
                    ?disabled=${!this.draft.trim() || this.busy || this.readOnly}
                    @click=${this.onSubmit}
                  >
                    <loomi-icon name="arrow-up" slot="prefix"></loomi-icon>
                  </loomi-button>
                </div>
              </div>
            </form>
          </loomi-card-footer>
        </loomi-card>
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
