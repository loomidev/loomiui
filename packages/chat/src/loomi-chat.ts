import { html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { LoomiElement, loomiStyles } from "@loomidev/core";
import "@loomidev/icon/loomi-icon.js";
import {
  ChatScrollerController,
  findChatScrollerHost,
  getChatScrollerController,
  type LoomiChatScrollPosition,
} from "./chat-scroller-controller.js";
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
 * `<loomi-chat-scroller>` — chat transcript scroller root. Owns scroll state for its
 * viewport, content, items, and scroll button children.
 */
@customElement("loomi-chat-scroller")
export class LoomiChatScroller extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  readonly controller = getChatScrollerController(this);

  @property({ type: Boolean, attribute: "auto-scroll", converter: booleanAttribute })
  autoScroll = false;

  @property({ attribute: "default-scroll-position" })
  defaultScrollPosition: LoomiChatScrollPosition = "end";

  @property({ type: Number, attribute: "scroll-previous-item-peek" })
  scrollPreviousItemPeek = 64;

  @property({ type: Number, attribute: "scroll-margin" })
  scrollMargin = 0;

  override connectedCallback(): void {
    super.connectedCallback();
    this.syncController();
  }

  protected override updated(changed: PropertyValues<this>): void {
    super.updated(changed);
    if (
      changed.has("autoScroll") ||
      changed.has("defaultScrollPosition") ||
      changed.has("scrollPreviousItemPeek") ||
      changed.has("scrollMargin")
    ) {
      this.syncController();
    }
  }

  private syncController(): void {
    this.controller.configure({
      autoScroll: this.autoScroll,
      defaultScrollPosition: this.defaultScrollPosition,
      scrollPreviousItemPeek: this.scrollPreviousItemPeek,
      scrollMargin: this.scrollMargin,
    });
  }

  scrollToEnd(behavior: ScrollBehavior = "smooth"): void {
    this.controller.scrollToEnd(behavior);
  }

  scrollToStart(behavior: ScrollBehavior = "smooth"): void {
    this.controller.scrollToStart(behavior);
  }

  scrollToMessage(
    messageId: string,
    options?: { align?: "start" | "center" | "end"; behavior?: ScrollBehavior },
  ): boolean {
    return this.controller.scrollToMessage(messageId, options);
  }

  override render(): TemplateResult {
    return html`<div class="loomi-chat-scroller"><slot></slot></div>`;
  }
}

/**
 * `<loomi-chat-viewport>` — scrollable transcript viewport. Place inside
 * `<loomi-chat-scroller>`.
 */
@customElement("loomi-chat-viewport")
export class LoomiChatViewport extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  private unsubscribe?: () => void;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("role", "region");
    this.setAttribute("aria-label", "Messages");
    this.tabIndex = 0;
  }

  private scrollerHost: HTMLElement | null = null;

  override firstUpdated(): void {
    this.scrollerHost = findChatScrollerHost(this);
    if (!this.scrollerHost) return;
    const controller = getChatScrollerController(this.scrollerHost);
    controller.attachViewport(this);
    this.unsubscribe = controller.subscribe(() => this.requestUpdate());
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.unsubscribe?.();
    if (this.scrollerHost) {
      getChatScrollerController(this.scrollerHost).detachViewport();
      this.scrollerHost = null;
    }
  }

  override render(): TemplateResult {
    return html`<div class="loomi-chat-viewport"><slot></slot></div>`;
  }
}

/**
 * `<loomi-chat-content>` — transcript container with live-region defaults.
 */
@customElement("loomi-chat-content")
export class LoomiChatContent extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property({ type: Boolean, attribute: "aria-busy", converter: booleanAttribute })
  transcriptBusy = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("role", "log");
    this.setAttribute("aria-relevant", "additions");
    this.setAttribute("aria-live", "polite");
  }

  override firstUpdated(): void {
    const scroller = findChatScrollerHost(this);
    if (!scroller) return;
    getChatScrollerController(scroller).attachContent(this);
  }

  override render(): TemplateResult {
    return html`<div class="loomi-chat-content" aria-busy=${this.transcriptBusy ? "true" : "false"}>
      <slot></slot>
    </div>`;
  }
}

/**
 * `<loomi-chat-item>` — transcript row boundary for anchoring and scroll tracking.
 */
@customElement("loomi-chat-item")
export class LoomiChatItem extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property({ attribute: "message-id" }) messageId = "";

  @property({ type: Boolean, attribute: "scroll-anchor", converter: booleanAttribute })
  scrollAnchor = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.toggleAttribute("data-scroll-anchor", this.scrollAnchor);
    this.register(true);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    const scroller = findChatScrollerHost(this);
    if (scroller) {
      getChatScrollerController(scroller).unregisterItem(this, this.messageId || undefined);
    }
  }

  protected override updated(changed: PropertyValues<this>): void {
    super.updated(changed);
    if (changed.has("scrollAnchor") || changed.has("messageId")) {
      this.toggleAttribute("data-scroll-anchor", this.scrollAnchor);
      this.register(false);
    }
  }

  private register(isNew: boolean): void {
    const scroller = findChatScrollerHost(this);
    if (!scroller) return;
    const registration = {
      messageId: this.messageId || undefined,
      scrollAnchor: this.scrollAnchor,
    };
    const controller = getChatScrollerController(scroller);
    if (isNew) controller.registerItem(this, registration);
    else controller.updateItem(this, registration);
  }

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}

/**
 * `<loomi-chat-scroll-button>` — jump-to-latest control shown when the reader
 * scrolls away from the live edge.
 */
@customElement("loomi-chat-scroll-button")
export class LoomiChatScrollButton extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property({ reflect: true }) direction: "start" | "end" = "end";

  @state() private active = false;
  private unsubscribe?: () => void;

  override firstUpdated(): void {
    const scroller = findChatScrollerHost(this);
    if (!scroller) return;
    const controller = getChatScrollerController(scroller);
    this.syncActive(controller);
    this.unsubscribe = controller.subscribe(() => this.syncActive(controller));
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.unsubscribe?.();
  }

  private syncActive(controller: ChatScrollerController): void {
    const next =
      this.direction === "end"
        ? controller.isScrollButtonActive()
        : controller.getScrollable().start;
    if (next !== this.active) {
      this.active = next;
    }
  }

  private onClick = (): void => {
    const scroller = findChatScrollerHost(this);
    if (!scroller) return;
    const controller = getChatScrollerController(scroller);
    if (this.direction === "end") controller.scrollToEnd("smooth");
    else controller.scrollToStart("smooth");
  };

  override render(): TemplateResult {
    return html`<button
      type="button"
      class="loomi-chat-scroll-btn"
      data-active=${this.active ? "true" : "false"}
      data-direction=${this.direction}
      ?inert=${!this.active}
      tabindex=${this.active ? 0 : -1}
      aria-hidden=${this.active ? "false" : "true"}
      @click=${this.onClick}
    >
      <loomi-icon name=${this.direction === "end" ? "arrow-down" : "arrow-up"}></loomi-icon>
      <span class="sr-only">${this.direction === "end" ? "Scroll to end" : "Scroll to start"}</span>
    </button>`;
  }
}

export type LoomiChatMessageRole = "user" | "assistant";
export type LoomiChatMessageVariant = "muted" | "ghost" | "tinted";

/**
 * `<loomi-chat-message>` — a single chat bubble aligned for user or assistant turns.
 */
@customElement("loomi-chat-message")
export class LoomiChatMessage extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property({ reflect: true, attribute: "message-role" }) messageRole: LoomiChatMessageRole =
    "assistant";
  @property({ reflect: true }) variant: LoomiChatMessageVariant = "ghost";
  @property() sender = "";
  @property() text = "";

  override render(): TemplateResult {
    const align = this.messageRole === "user" ? "end" : "start";
    const resolvedVariant =
      this.variant ||
      (this.messageRole === "user"
        ? ("muted" as LoomiChatMessageVariant)
        : ("ghost" as LoomiChatMessageVariant));

    return html`<div class="loomi-chat-message align-${align}">
      ${this.sender && this.messageRole !== "user"
        ? html`<div class="loomi-chat-message-header">${this.sender}</div>`
        : nothing}
      <div class="loomi-chat-bubble variant-${resolvedVariant}">
        <slot>${this.text}</slot>
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-chat-scroller": LoomiChatScroller;
    "loomi-chat-viewport": LoomiChatViewport;
    "loomi-chat-content": LoomiChatContent;
    "loomi-chat-item": LoomiChatItem;
    "loomi-chat-scroll-button": LoomiChatScrollButton;
    "loomi-chat-message": LoomiChatMessage;
  }
}
