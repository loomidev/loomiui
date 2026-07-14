import { html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  LoomiElement,
  loomiStyles,
  loomiT,
  onClickOutside,
  lockBodyScroll,
  unlockBodyScroll,
} from "@loomidev/core";
import "@loomidev/icon/loomi-icon.js";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiDrawerPlacement = "left" | "right" | "top" | "bottom";
export type LoomiDrawerSize = "small" | "medium" | "large";

const booleanAttribute = {
  fromAttribute(value: string | null): boolean {
    return value !== null && value.toLowerCase() !== "false";
  },
  toAttribute(value: boolean): string | null {
    return value ? "" : null;
  },
};

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Walks into nested shadow roots to find the actually-focused element. */
function deepActiveElement(): Element | null {
  let el: Element | null = document.activeElement;
  while (el?.shadowRoot?.activeElement) el = el.shadowRoot.activeElement;
  return el;
}

/**
 * Resolves once `el`'s open/close CSS animation finishes. Falls back to a timer so a
 * disabled or zero-duration animation (e.g. via a custom `--loomi-drawer-duration`,
 * or a misconfigured override) can't leave `hide()` hanging forever.
 */
function waitForAnimation(el: Element | null | undefined, fallbackMs = 500): Promise<void> {
  if (!el) return Promise.resolve();
  return new Promise((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      el.removeEventListener("animationend", onEnd);
      el.removeEventListener("animationcancel", onEnd);
      clearTimeout(timer);
      resolve();
    };
    const onEnd = (e: Event) => {
      if (e.target === el) finish();
    };
    el.addEventListener("animationend", onEnd);
    el.addEventListener("animationcancel", onEnd);
    const timer = setTimeout(finish, fallbackMs);
  });
}

const registry = new Map<string, LoomiDrawer>();

/** Open a drawer by its `name`. */
export function showLoomiDrawer(name: string): void {
  registry.get(name)?.show();
}
/** Close a drawer by its `name`. */
export function hideLoomiDrawer(name: string): void {
  registry.get(name)?.hide();
}

// Exposed on `window` so plain `onclick="showLoomiDrawer('name')"` markup works with no
// build step or module-scoped import, matching every other attribute-driven usage in
// this library.
declare global {
  interface Window {
    showLoomiDrawer: typeof showLoomiDrawer;
    hideLoomiDrawer: typeof hideLoomiDrawer;
  }
}
if (typeof window !== "undefined") {
  window.showLoomiDrawer = showLoomiDrawer;
  window.hideLoomiDrawer = hideLoomiDrawer;
}

/**
 * `<loomi-drawer>` — a panel that slides in from an edge of the screen. Open/close via
 * `name` with `showLoomiDrawer()` / `hideLoomiDrawer()`, or the instance `show()` / `hide()`
 * methods.
 *
 * @slot - The drawer body.
 * @fires open - Shown. @fires close - Dismissed (fires as the close animation starts).
 */
@customElement("loomi-drawer")
export class LoomiDrawer extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property() name = "";
  @property() title = "";
  @property() placement: LoomiDrawerPlacement = "right";
  @property() size: LoomiDrawerSize = "medium";
  @property() locale = "";
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: Boolean, attribute: "show-close-icon", converter: booleanAttribute })
  showCloseIcon = true;
  @property({ type: Boolean, attribute: "backdrop", converter: booleanAttribute })
  backdrop = true;
  @property({ type: Boolean, attribute: "close-on-outside-click", converter: booleanAttribute })
  closeOnOutsideClick = true;
  @property({ type: Boolean, attribute: "prevent-scroll", converter: booleanAttribute })
  preventScroll = true;

  /** True while the close animation is playing; `open` stays true for that whole span. */
  @state() private closing = false;

  /** The element focused before `show()` was called, restored when the drawer closes. */
  private previouslyFocused: HTMLElement | null = null;
  private hasScrollLock = false;
  private isMovingInDom = false;
  private originalParent: Node | null = null;
  private originalNextSibling: ChildNode | null = null;
  /** Bumped on every show()/hide() so a stale finalizeClose() from a superseded hide() is a no-op. */
  private closeToken = 0;
  private stopOutsideClick: (() => void) | null = null;

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.name) registry.set(this.name, this);
    document.addEventListener("keydown", this.onKey);
  }
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this.name) registry.delete(this.name);
    document.removeEventListener("keydown", this.onKey);
    if (!this.isMovingInDom) {
      this.releaseScrollLock();
      this.stopOutsideClick?.();
      this.stopOutsideClick = null;
    }
  }

  protected override updated(changedProperties: PropertyValues<this>): void {
    super.updated(changedProperties);
    if (changedProperties.has("open") || changedProperties.has("preventScroll")) {
      this.syncScrollLock();
    }
    if (changedProperties.has("open") || changedProperties.has("closeOnOutsideClick")) {
      this.syncOutsideClick();
    }
  }

  show(): void {
    this.closeToken += 1; // invalidate any in-flight close
    if (this.open && !this.closing) return;
    this.closing = false;
    this.previouslyFocused = deepActiveElement() as HTMLElement | null;
    this.moveToDocumentBody();
    this.open = true;
    this.dispatchEvent(new Event("open", { bubbles: true, composed: true }));
    this.updateComplete.then(() => {
      const focusable = this.getFocusable();
      (focusable[0] ?? this.shadowRoot?.querySelector<HTMLElement>(".loomi-panel"))?.focus();
    });
  }

  /** Starts the close animation immediately; resolves once the drawer has actually unmounted. */
  hide(): Promise<void> {
    if (!this.open || this.closing) return Promise.resolve();
    const token = (this.closeToken += 1);
    this.closing = true;
    this.dispatchEvent(new Event("close", { bubbles: true, composed: true }));
    this.previouslyFocused?.focus();
    this.previouslyFocused = null;
    return this.finalizeClose(token);
  }

  /** Waits for the exit animation, then actually unmounts — unless a newer show()/hide() superseded this one. */
  private async finalizeClose(token: number): Promise<void> {
    await this.updateComplete;
    const panel = this.shadowRoot?.querySelector(".loomi-panel");
    await waitForAnimation(panel);
    if (token !== this.closeToken) return;
    this.open = false;
    this.closing = false;
    this.restoreOriginalPosition();
  }

  private moveToDocumentBody(): void {
    if (this.parentNode === document.body) return;

    this.originalParent = this.parentNode;
    this.originalNextSibling = this.nextSibling;

    this.isMovingInDom = true;
    document.body.appendChild(this);
    this.isMovingInDom = false;
  }

  private restoreOriginalPosition(): void {
    if (!this.originalParent) return;

    const nextSibling =
      this.originalNextSibling?.parentNode === this.originalParent
        ? this.originalNextSibling
        : null;

    this.isMovingInDom = true;
    if (this.originalParent.isConnected) {
      this.originalParent.insertBefore(this, nextSibling);
    }
    this.isMovingInDom = false;

    this.originalParent = null;
    this.originalNextSibling = null;
  }

  private syncScrollLock(): void {
    if (this.open && this.preventScroll) {
      if (!this.hasScrollLock) {
        lockBodyScroll();
        this.hasScrollLock = true;
      }
    } else {
      this.releaseScrollLock();
    }
  }

  private releaseScrollLock(): void {
    if (!this.hasScrollLock) return;
    unlockBodyScroll();
    this.hasScrollLock = false;
  }

  /**
   * Detects clicks outside `.loomi-panel` (including clicks on the backdrop, or
   * anywhere on the page when there's no backdrop) and closes the drawer — independent
   * of whether a dimming backdrop is actually rendered.
   */
  private syncOutsideClick(): void {
    const shouldListen = this.open && this.closeOnOutsideClick;
    if (shouldListen && !this.stopOutsideClick) {
      const panel = this.shadowRoot?.querySelector(".loomi-panel");
      if (panel) this.stopOutsideClick = onClickOutside(panel, () => this.hide());
    } else if (!shouldListen && this.stopOutsideClick) {
      this.stopOutsideClick();
      this.stopOutsideClick = null;
    }
  }

  /** Focusable elements in template order: close button, then slotted body content. */
  private getFocusable(): HTMLElement[] {
    const before = Array.from(this.shadowRoot?.querySelectorAll<HTMLElement>(".loomi-close") ?? []);
    const light = Array.from(this.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
    return [...before, ...light];
  }

  private onKey = (e: KeyboardEvent): void => {
    if (!this.open || this.closing) return;
    if (e.key === "Escape") {
      this.hide();
      return;
    }
    if (e.key !== "Tab" || !this.backdrop) return;
    // Trap focus inside the panel while open — only when acting as a modal (backdrop on);
    // a non-modal (no-backdrop) drawer leaves the rest of the page reachable by Tab.
    const focusable = this.getFocusable();
    if (focusable.length === 0) {
      e.preventDefault();
      return;
    }
    const current = deepActiveElement();
    const index = focusable.indexOf(current as HTMLElement);
    if (e.shiftKey) {
      if (index <= 0) {
        e.preventDefault();
        focusable[focusable.length - 1].focus();
      }
    } else if (index === -1 || index === focusable.length - 1) {
      e.preventDefault();
      focusable[0].focus();
    }
  };

  override render(): TemplateResult | typeof nothing {
    if (!this.open && !this.closing) return nothing;
    const animClass = this.closing ? "is-closing" : "is-open";

    return html`
      ${this.backdrop ? html`<div class="loomi-backdrop ${animClass}"></div>` : nothing}
      <div
        class="loomi-panel placement-${this.placement} size-${this.size} ${animClass}"
        role="dialog"
        aria-modal=${this.backdrop ? "true" : "false"}
        aria-label=${this.title || loomiT("drawer.dialog", {}, this.locale)}
        tabindex="-1"
      >
        ${
          this.title || this.showCloseIcon
            ? html`<div class="loomi-header">
              ${this.title ? html`<div class="loomi-title">${this.title}</div>` : nothing}
              ${
                this.showCloseIcon
                  ? html`<button
                    class="loomi-close"
                    aria-label=${loomiT("common.close", {}, this.locale)}
                    @click=${() => this.hide()}
                  >
                    <loomi-icon name="x-mark" size="1.15rem" stroke-width="2"></loomi-icon>
                  </button>`
                  : nothing
              }
            </div>`
            : nothing
        }
        <div class="loomi-body"><slot></slot></div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-drawer": LoomiDrawer;
  }
}
