import { html, nothing, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LoomiElement, loomiStyles, type LoomiColor } from "@loomidev/core";
import "@loomidev/avatar/loomi-avatar.js";
import "@loomidev/icon/loomi-icon.js";
import {
  bubbleVars,
  colorForParticipant,
  initialsFor,
  type LoomiChatAttachment,
  type LoomiChatParticipantColor,
} from "./chat-utils.js";
import { componentStyles } from "./generated/styles.css.js";

const booleanAttribute = {
  fromAttribute(value: string | null): boolean {
    return value !== null && value.toLowerCase() !== "false";
  },
  toAttribute(value: boolean): string | null {
    return value ? "" : null;
  },
};

/**
 * `<loomi-chat-message>` — a chat bubble with optional avatar, sender label, and tail.
 */
@customElement("loomi-chat-message")
export class LoomiChatMessage extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property() text = "";
  @property() sender = "";
  @property() time = "";
  @property({ attribute: "sender-id" }) senderId = "";
  @property() image = "";
  @property({ attribute: "avatar-label" }) avatarLabel = "";
  @property({ attribute: "bubble-color" }) bubbleColor: LoomiChatParticipantColor | string = "";
  @property({ type: Boolean, reflect: true }) outgoing = false;
  @property({ type: Boolean, attribute: "show-avatar", converter: booleanAttribute })
  showAvatar = false;
  @property({ type: Boolean, attribute: "show-sender", converter: booleanAttribute })
  showSender = false;
  /** Optional file card rendered under the bubble (or on its own when `text` is empty). */
  @property({ type: Object }) attachment?: LoomiChatAttachment;

  private renderAttachment(): TemplateResult | typeof nothing {
    if (!this.attachment?.name) return nothing;
    return html`<div class="loomi-chat-attachment">
      <span class="loomi-chat-attachment-icon">
        <loomi-icon name=${this.attachment.icon || "document"}></loomi-icon>
      </span>
      <span class="loomi-chat-attachment-copy">
        <span class="loomi-chat-attachment-name">${this.attachment.name}</span>
        ${
          this.attachment.meta
            ? html`<span class="loomi-chat-attachment-meta">${this.attachment.meta}</span>`
            : nothing
        }
      </span>
      <loomi-icon class="loomi-chat-attachment-download" name="arrow-down-tray"></loomi-icon>
    </div>`;
  }

  override render(): TemplateResult {
    const color = this.bubbleColor || colorForParticipant(this.senderId || this.sender || "guest");
    const tail = this.outgoing ? "tail-end" : "tail-start";
    const label = this.avatarLabel || initialsFor(this.sender || this.senderId || "?");
    // Attachment-only messages skip the (empty) bubble but keep the card aligned in the row.
    const showBubble = !!this.text || !this.attachment;

    return html`<div class="loomi-chat-row ${this.outgoing ? "outgoing" : "incoming"}">
      ${
        this.showAvatar && !this.outgoing
          ? html`<loomi-avatar
            class="loomi-chat-row-avatar"
            size="small"
            image=${this.image}
            label=${label}
            alt=${this.sender || label}
            bg-color=${color as LoomiColor}
          ></loomi-avatar>`
          : nothing
      }
      <div class="loomi-chat-row-body">
        ${
          this.showSender && this.sender
            ? html`<div class="loomi-chat-sender">${this.sender}</div>`
            : nothing
        }
        ${
          showBubble
            ? html`<div class="loomi-chat-bubble ${tail}" style=${bubbleVars(color)}>
              <slot>${this.text}</slot>
            </div>`
            : nothing
        }
        ${this.renderAttachment()}
        ${this.time ? html`<div class="loomi-chat-time">${this.time}</div>` : nothing}
      </div>
      ${
        this.showAvatar && this.outgoing
          ? html`<loomi-avatar
            class="loomi-chat-row-avatar"
            size="small"
            image=${this.image}
            label=${label}
            alt=${this.sender || label}
            bg-color=${color as LoomiColor}
          ></loomi-avatar>`
          : nothing
      }
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-chat-message": LoomiChatMessage;
  }
}
