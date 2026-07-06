import { html, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  LoomiElement,
  loomiStyles,
  loomiT,
  lockBodyScroll,
  unlockBodyScroll,
  deepActiveElement,
  trapTabFocus,
  FOCUSABLE_SELECTOR,
  OverlayReparent,
} from "@loomidev/core";
import "@loomidev/icon/loomi-icon.js";
import { componentStyles } from "./generated/styles.css.js";

/**
 * `<loomi-lightbox-image>` — wraps a single image so clicking it opens a fullscreen
 * view. Fully standalone: drop it anywhere in a document (a blog paragraph, a card, …)
 * with no shared container or parent gallery required. Give two or more instances the
 * same `group` to let Next/Prev cycle between them, in document order.
 *
 * @slot - The trigger image. Falls back to an `<img src alt>` built from the attributes
 *   below when left empty — but wrapping your own existing `<img>` is the common case,
 *   so its `alt` is reused for the fullscreen image and the trigger's label when this
 *   component's own `alt` attribute is left unset.
 * @fires loomi-open - Fired when the fullscreen view opens.
 * @fires loomi-close - Fired when it closes.
 */
@customElement("loomi-lightbox-image")
export class LoomiLightboxImage extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property() src = "";
  @property() alt = "";
  @property() caption = "";
  @property() group = "";
  @property() locale = "";
  @property({ type: Boolean, reflect: true }) open = false;

  @state() private slottedAlt = "";

  private previouslyFocused: HTMLElement | null = null;
  private hasScrollLock = false;
  private reparent = new OverlayReparent(this);
  /**
   * Group order, captured once per browsing session (see `show()`/`go()`) rather than
   * queried fresh on every render or navigation. Live document order isn't reliable
   * while `this` is reparented to `document.body` — it would sort last (or wherever
   * `document.body`'s children end), not at its natural spot among the other members.
   */
  private groupSnapshot: LoomiLightboxImage[] | null = null;

  override connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener("keydown", this.onKey);
  }
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener("keydown", this.onKey);
    if (!this.reparent.isMovingInDom) this.releaseScrollLock();
  }

  private get effectiveAlt(): string {
    return this.alt || this.slottedAlt;
  }

  private onSlotChange = (event: Event): void => {
    const slot = event.target as HTMLSlotElement;
    const img = slot.assignedElements({ flatten: true }).find((el): el is HTMLImageElement => el instanceof HTMLImageElement);
    this.slottedAlt = img?.alt ?? "";
  };

  /** Other instances sharing this `group`, in true document order — just `[this]` when ungrouped. */
  private computeGroupMembers(): LoomiLightboxImage[] {
    if (!this.group) return [this];
    return Array.from(document.querySelectorAll<LoomiLightboxImage>("loomi-lightbox-image")).filter(
      (el) => el.group === this.group,
    );
  }

  /** The current browsing session's member list — computed fresh only when one isn't
   * already carried over from `go()` (see there for why this must not re-query live DOM). */
  private groupMembers(): LoomiLightboxImage[] {
    return this.groupSnapshot ?? this.computeGroupMembers();
  }

  show(): void {
    this.groupSnapshot ??= this.computeGroupMembers();
    this.previouslyFocused = deepActiveElement() as HTMLElement | null;
    this.reparent.moveToBody();
    this.open = true;
    lockBodyScroll();
    this.hasScrollLock = true;
    this.dispatchEvent(new Event("loomi-open", { bubbles: true, composed: true }));
    void this.updateComplete.then(() => {
      this.shadowRoot?.querySelector<HTMLElement>(".loomi-lightbox-dialog")?.focus();
    });
  }

  hide(): void {
    this.open = false;
    this.groupSnapshot = null;
    this.releaseScrollLock();
    this.dispatchEvent(new Event("loomi-close", { bubbles: true, composed: true }));
    this.reparent.restore();
    this.previouslyFocused?.focus();
    this.previouslyFocused = null;
  }

  private releaseScrollLock(): void {
    if (!this.hasScrollLock) return;
    unlockBodyScroll();
    this.hasScrollLock = false;
  }

  private go(delta: 1 | -1): void {
    const members = this.groupMembers();
    if (members.length <= 1) return;
    const index = members.indexOf(this);
    const next = members[(index + delta + members.length) % members.length];
    // Carry the same, already-correctly-ordered snapshot forward instead of letting
    // `next.show()` recompute one — by the time it runs, `this` (still mid-navigation)
    // may not yet be back in its natural DOM position.
    next.groupSnapshot = members;
    this.hide();
    next.show();
  }

  private next = (): void => this.go(1);
  private prev = (): void => this.go(-1);

  private getFocusable(): HTMLElement[] {
    return Array.from(this.shadowRoot?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ?? []);
  }

  private onKey = (event: KeyboardEvent): void => {
    if (!this.open) return;
    // Every instance registers its own document-level listener, and go() synchronously
    // opens a sibling within this same handler — without this, that sibling's listener
    // (also on document) would see itself as open and re-handle this same keydown,
    // cascading through the whole group in one keypress instead of moving one step.
    event.stopImmediatePropagation();
    if (event.key === "Escape") {
      event.preventDefault();
      this.hide();
      return;
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      this.next();
      return;
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      this.prev();
      return;
    }
    if (event.key !== "Tab") return;
    trapTabFocus(event, this.getFocusable());
  };

  private onBackdrop = (event: MouseEvent): void => {
    if (event.target === event.currentTarget) this.hide();
  };

  private get triggerLabel(): string {
    const base = loomiT("lightbox.view", {}, this.locale);
    return this.effectiveAlt ? `${base}: ${this.effectiveAlt}` : base;
  }

  override render(): TemplateResult {
    return html`
      <button type="button" class="loomi-lightbox-trigger" aria-haspopup="dialog" aria-label=${this.triggerLabel} @click=${this.show}>
        <slot @slotchange=${this.onSlotChange}>${this.src ? html`<img src=${this.src} alt=${this.alt} />` : nothing}</slot>
      </button>
      ${this.open ? this.renderOverlay() : nothing}
    `;
  }

  private renderOverlay(): TemplateResult {
    const members = this.groupMembers();
    const showNav = members.length > 1;
    const index = members.indexOf(this);

    return html`
      <div class="loomi-lightbox-backdrop" @click=${this.onBackdrop}>
        <div
          class="loomi-lightbox-dialog"
          role="dialog"
          aria-modal="true"
          aria-label=${loomiT("lightbox.dialog", {}, this.locale)}
          tabindex="-1"
        >
          <button
            class="loomi-lightbox-close"
            aria-label=${loomiT("common.close", {}, this.locale)}
            @click=${() => this.hide()}
          >
            <loomi-icon name="x-mark" size="1.4rem" stroke-width="2"></loomi-icon>
          </button>
          ${showNav
            ? html`<button
                class="loomi-lightbox-nav prev"
                aria-label=${loomiT("lightbox.previous", {}, this.locale)}
                @click=${this.prev}
              >
                <loomi-icon name="chevron-left" size="1.5rem" stroke-width="2"></loomi-icon>
              </button>`
            : nothing}
          <img class="loomi-lightbox-image" src=${this.src} alt=${this.effectiveAlt} />
          ${showNav
            ? html`<button
                class="loomi-lightbox-nav next"
                aria-label=${loomiT("lightbox.next", {}, this.locale)}
                @click=${this.next}
              >
                <loomi-icon name="chevron-right" size="1.5rem" stroke-width="2"></loomi-icon>
              </button>`
            : nothing}
          ${this.caption ? html`<div class="loomi-lightbox-caption">${this.caption}</div>` : nothing}
          ${showNav
            ? html`<div class="loomi-lightbox-counter">
                ${loomiT("lightbox.counter", { current: index + 1, total: members.length }, this.locale)}
              </div>`
            : nothing}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-lightbox-image": LoomiLightboxImage;
  }
}
