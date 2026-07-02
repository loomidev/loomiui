export type LoomiChatScrollPosition = "start" | "end" | "last-anchor";

export interface LoomiChatScrollerOptions {
  autoScroll?: boolean;
  defaultScrollPosition?: LoomiChatScrollPosition;
  scrollPreviousItemPeek?: number;
  scrollMargin?: number;
}

export interface LoomiChatScrollerItemRegistration {
  messageId?: string;
  scrollAnchor?: boolean;
}

export interface LoomiChatScrollToOptions {
  align?: "start" | "center" | "end";
  behavior?: ScrollBehavior;
}

type Listener = () => void;

const BOTTOM_THRESHOLD = 24;

export class ChatScrollerController {
  autoScroll = false;
  defaultScrollPosition: LoomiChatScrollPosition = "end";
  scrollPreviousItemPeek = 64;
  scrollMargin = 0;

  private viewport: HTMLElement | null = null;
  private pinnedToBottom = true;
  private scrollableStart = false;
  private scrollableEnd = false;
  private scrollButtonActive = false;
  private initialPositionApplied = false;
  private lastAnchorEl: HTMLElement | null = null;
  private items = new Map<string, HTMLElement>();
  private itemElements = new Set<HTMLElement>();
  private resizeObserver: ResizeObserver | null = null;
  private mutationObserver: MutationObserver | null = null;
  private listeners = new Set<Listener>();
  private onViewportScroll = (): void => {
    this.syncScrollState();
  };

  configure(options: LoomiChatScrollerOptions): void {
    if (options.autoScroll !== undefined) this.autoScroll = options.autoScroll;
    if (options.defaultScrollPosition !== undefined) {
      this.defaultScrollPosition = options.defaultScrollPosition;
    }
    if (options.scrollPreviousItemPeek !== undefined) {
      this.scrollPreviousItemPeek = options.scrollPreviousItemPeek;
    }
    if (options.scrollMargin !== undefined) this.scrollMargin = options.scrollMargin;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getScrollable(): { start: boolean; end: boolean } {
    return { start: this.scrollableStart, end: this.scrollableEnd };
  }

  isScrollButtonActive(): boolean {
    return this.scrollButtonActive;
  }

  attachViewport(viewport: HTMLElement): void {
    if (this.viewport === viewport) return;
    this.detachViewport();
    this.viewport = viewport;
    viewport.addEventListener("scroll", this.onViewportScroll, { passive: true });
    this.syncScrollState();
    this.applyDefaultScrollPosition();
  }

  attachContent(content: HTMLElement): void {
    this.resizeObserver?.disconnect();
    this.mutationObserver?.disconnect();

    this.resizeObserver = new ResizeObserver(() => this.onContentResize());
    this.resizeObserver.observe(content);

    this.mutationObserver = new MutationObserver(() => this.onContentResize());
    this.mutationObserver.observe(content, { childList: true, subtree: true, characterData: true });
  }

  detachViewport(): void {
    this.viewport?.removeEventListener("scroll", this.onViewportScroll);
    this.viewport = null;
    this.resizeObserver?.disconnect();
    this.mutationObserver?.disconnect();
    this.resizeObserver = null;
    this.mutationObserver = null;
  }

  registerItem(el: HTMLElement, registration: LoomiChatScrollerItemRegistration): void {
    this.itemElements.add(el);
    if (registration.messageId) this.items.set(registration.messageId, el);
    if (registration.scrollAnchor) {
      requestAnimationFrame(() => this.anchorItem(el));
    } else if (this.pinnedToBottom && this.autoScroll) {
      requestAnimationFrame(() => this.scrollToEnd("instant"));
    }
    this.syncScrollState();
  }

  updateItem(el: HTMLElement, registration: LoomiChatScrollerItemRegistration): void {
    if (registration.messageId) this.items.set(registration.messageId, el);
    if (registration.scrollAnchor) {
      requestAnimationFrame(() => this.anchorItem(el));
    } else if (this.pinnedToBottom && this.autoScroll) {
      requestAnimationFrame(() => this.scrollToEnd("instant"));
    }
    this.syncScrollState();
  }

  unregisterItem(el: HTMLElement, messageId?: string): void {
    this.itemElements.delete(el);
    if (messageId) this.items.delete(messageId);
    if (this.lastAnchorEl === el) this.lastAnchorEl = null;
    this.syncScrollState();
  }

  scrollToEnd(behavior: ScrollBehavior = "smooth"): void {
    const viewport = this.viewport;
    if (!viewport) return;
    viewport.scrollTo({ top: viewport.scrollHeight, behavior });
    this.pinnedToBottom = true;
    requestAnimationFrame(() => this.syncScrollState());
  }

  scrollToStart(behavior: ScrollBehavior = "smooth"): void {
    const viewport = this.viewport;
    if (!viewport) return;
    viewport.scrollTo({ top: 0, behavior });
    requestAnimationFrame(() => this.syncScrollState());
  }

  scrollToMessage(messageId: string, options: LoomiChatScrollToOptions = {}): boolean {
    const el = this.items.get(messageId);
    if (!el || !this.viewport) return false;
    this.scrollElementIntoView(el, options.align ?? "start", options.behavior ?? "smooth");
    return true;
  }

  private applyDefaultScrollPosition(): void {
    if (this.initialPositionApplied || !this.viewport) return;
    this.initialPositionApplied = true;
    switch (this.defaultScrollPosition) {
      case "start":
        this.scrollToStart("instant");
        break;
      case "last-anchor": {
        const anchors = [...this.itemElements].filter(
          (el) => el.hasAttribute("data-scroll-anchor"),
        );
        const last = anchors.at(-1);
        if (last) this.anchorItem(last, "instant");
        else this.scrollToEnd("instant");
        break;
      }
      default:
        this.scrollToEnd("instant");
    }
  }

  private onContentResize(): void {
    if (this.pinnedToBottom && this.autoScroll) {
      this.scrollToEnd("instant");
    }
    this.syncScrollState();
  }

  private anchorItem(el: HTMLElement, behavior: ScrollBehavior = "instant"): void {
    const viewport = this.viewport;
    if (!viewport) return;
    this.lastAnchorEl = el;
    const previous = this.getPreviousItem(el);
    const peek = previous ? this.scrollPreviousItemPeek : this.scrollMargin;
    const targetTop = Math.max(0, el.offsetTop - peek - this.scrollMargin);
    viewport.scrollTo({ top: targetTop, behavior });
    this.pinnedToBottom = this.isNearBottom();
    this.syncScrollState();
  }

  private getPreviousItem(el: HTMLElement): HTMLElement | null {
    const ordered = [...this.itemElements].sort((a, b) => {
      if (a === b) return 0;
      const position = a.compareDocumentPosition(b);
      if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
      if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1;
      return 0;
    });
    const index = ordered.indexOf(el);
    return index > 0 ? ordered[index - 1]! : null;
  }

  private scrollElementIntoView(
    el: HTMLElement,
    align: "start" | "center" | "end",
    behavior: ScrollBehavior,
  ): void {
    const viewport = this.viewport;
    if (!viewport) return;
    const viewportRect = viewport.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const currentTop = viewport.scrollTop;
    const offset = elRect.top - viewportRect.top + currentTop;
    let targetTop = offset - this.scrollMargin;
    if (align === "center") {
      targetTop = offset - viewport.clientHeight / 2 + el.clientHeight / 2;
    } else if (align === "end") {
      targetTop = offset - viewport.clientHeight + el.clientHeight + this.scrollMargin;
    }
    viewport.scrollTo({
      top: Math.max(0, Math.min(targetTop, viewport.scrollHeight - viewport.clientHeight)),
      behavior,
    });
    requestAnimationFrame(() => this.syncScrollState());
  }

  private syncScrollState(): void {
    const viewport = this.viewport;
    if (!viewport) return;

    const maxScroll = Math.max(0, viewport.scrollHeight - viewport.clientHeight);
    const top = viewport.scrollTop;
    this.pinnedToBottom = maxScroll <= BOTTOM_THRESHOLD || top >= maxScroll - BOTTOM_THRESHOLD;
    this.scrollableStart = top > BOTTOM_THRESHOLD;
    this.scrollableEnd = top < maxScroll - BOTTOM_THRESHOLD;
    this.scrollButtonActive = this.autoScroll
      ? !this.pinnedToBottom
      : this.scrollableEnd;

    viewport.dataset.autoscrolling = this.pinnedToBottom && this.autoScroll ? "true" : "false";
    viewport.dataset.scrollableStart = this.scrollableStart ? "true" : "false";
    viewport.dataset.scrollableEnd = this.scrollableEnd ? "true" : "false";

    for (const listener of this.listeners) listener();
  }

  private isNearBottom(): boolean {
    const viewport = this.viewport;
    if (!viewport) return true;
    const maxScroll = viewport.scrollHeight - viewport.clientHeight;
    return maxScroll <= BOTTOM_THRESHOLD || viewport.scrollTop >= maxScroll - BOTTOM_THRESHOLD;
  }
}

const SCROLLER_REGISTRY = new WeakMap<HTMLElement, ChatScrollerController>();

export function getChatScrollerController(host: HTMLElement): ChatScrollerController {
  let controller = SCROLLER_REGISTRY.get(host);
  if (!controller) {
    controller = new ChatScrollerController();
    SCROLLER_REGISTRY.set(host, controller);
  }
  return controller;
}

export function findChatScrollerHost(el: Element): HTMLElement | null {
  return el.closest("loomi-chat-scroller");
}
