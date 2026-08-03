import { html, nothing, svg, type PropertyValues, type TemplateResult } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import {
  LoomiElement,
  loomiStyles,
  nextMenuFocusIndex,
  onClickOutside,
  onExitAnimationEnd,
  positionFloatingPanel,
  supportsPopover,
  type LoomiPanelPlacement,
  type LoomiResolvedSide,
} from "@loomidev/core";
import "@loomidev/button/loomi-button.js";
import type { LoomiButton } from "@loomidev/button";
import "@loomidev/dropmenu/loomi-dropmenu.js";
import { LoomiDropmenuItem } from "@loomidev/dropmenu";
import { componentStyles } from "./generated/styles.css.js";

const CHEVRON_DOWN = svg`<path d="m6 9 6 6 6-6" />`;

/** The shared floating-panel vocabulary — same values `<loomi-dropmenu>` accepts. */
export type LoomiSplitButtonPlacement = LoomiPanelPlacement;

/** Mirrors `<loomi-button>`'s own unions so the two stay learnable together. */
export type LoomiSplitButtonType = "primary" | "secondary";
export type LoomiSplitButtonSize = "tiny" | "small" | "regular" | "medium" | "big";
export type LoomiSplitButtonRadius = "none" | "small" | "medium" | "full";
export type LoomiSplitButtonColor =
  "primary" | "secondary" | "info" | "success" | "error" | "warning" | "gray";

/**
 * `<loomi-split-button>` — a primary action joined to a caret that opens a menu of
 * related actions ("Create course ▾" → Import courses, Course templates).
 *
 * Both halves are real `<loomi-button>`s, so every visual attribute below behaves exactly
 * as it does on a plain button and the two halves can't drift apart. Menu rows are
 * `<loomi-dropmenu-item>`s, so item styling, icons, shortcuts, checkbox/radio rows and
 * destructive variants all come along unchanged.
 *
 * The panel is promoted to the **top layer** via the popover API and placed with core's
 * `positionFloatingPanel()` — the same mechanism `<loomi-dropmenu>` uses — so it is never
 * clipped by an ancestor's `overflow`. That's what makes this usable in table rows and
 * card headers.
 *
 * @slot - The primary half's label.
 * @slot menu - `<loomi-dropmenu-item>` rows for the caret's menu.
 * @csspart split - The wrapper holding both halves.
 * @csspart primary - The primary half (`<loomi-button>` host).
 * @csspart primary-button - The primary half's inner `<button>`/`<a>`.
 * @csspart divider - The hairline between the two halves.
 * @csspart caret - The caret half (`<loomi-button>` host).
 * @csspart caret-button - The caret's inner `<button>`.
 * @csspart panel - The floating menu panel.
 * @fires loomi-split-toggle - `detail: { open }` when the menu opens or closes.
 */
@customElement("loomi-split-button")
export class LoomiSplitButton extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  /**
   * `delegatesFocus` so the host participates in focus like a native control — clicking
   * the padding focuses the primary half, and `:focus-within`-style styling works. The
   * explicit `focus()` below is still needed: delegation only finds focusable *shadow*
   * descendants, and a `<loomi-button>` host isn't one.
   */
  static override shadowRootOptions: ShadowRootInit = {
    ...LoomiElement.shadowRootOptions,
    delegatesFocus: true,
  };

  // --- Mirrored from <loomi-button>, applied to both halves. ---
  @property({ reflect: true }) type: LoomiSplitButtonType = "primary";
  @property() color: LoomiSplitButtonColor | "" = "";
  @property({ reflect: true }) size: LoomiSplitButtonSize = "regular";
  @property({ reflect: true }) radius: LoomiSplitButtonRadius = "medium";
  @property({ type: Boolean, reflect: true }) outline = false;
  @property({ type: Number, attribute: "border-width" }) borderWidth = 2;
  @property() icon = "";
  @property({ type: Boolean, attribute: "icon-right" }) iconRight = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ reflect: true }) tag: "button" | "a" = "button";
  @property() href = "";
  @property({ type: Boolean, attribute: "can-submit" }) canSubmit = false;
  @property({ type: Boolean, attribute: "has-spinner" }) hasSpinner = false;
  @property({ type: Boolean, attribute: "show-spinner" }) showSpinner = false;
  @property({ type: Boolean }) uppercase = false;

  // --- The menu's own. ---
  @property() placement: LoomiSplitButtonPlacement = "auto";
  @property({ type: Boolean, reflect: true }) divided = false;
  @property({ type: Boolean, attribute: "hide-after-click" }) hideAfterClick = true;

  /** Accessible name for the caret, which has no visible text of its own. */
  @property({ attribute: "menu-label" }) menuLabel = "More actions";

  /** Disable only the caret, leaving the primary action usable. */
  @property({ type: Boolean, attribute: "menu-disabled" }) menuDisabled = false;

  @state() private open = false;
  @state() private closing = false;
  @state() private resolvedPlacement: LoomiResolvedSide = "bottom";
  private focusedIndex = -1;
  private cleanupOutside?: () => void;
  private cleanupReposition?: () => void;
  private cancelExit?: () => void;
  private repositionFrame = 0;

  @query(".loomi-primary") private primaryEl?: LoomiButton;
  @query(".loomi-caret") private caretEl?: LoomiButton;
  @query(".loomi-panel") private panelEl?: HTMLElement;

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.teardownOpenState();
  }

  /** Focus the primary half. See `shadowRootOptions` for why this can't be delegation alone. */
  override focus(options?: FocusOptions): void {
    this.primaryEl?.focus(options);
  }

  override blur(): void {
    this.primaryEl?.blur();
  }

  /** Open the menu. */
  show(): void {
    void this.openMenu();
  }

  /** Close the menu. */
  hide(): void {
    this.closeMenu();
  }

  /** `true` while the menu panel is open. */
  get isOpen(): boolean {
    return this.open;
  }

  // ---------------------------------------------------------------- open/close

  private async openMenu(): Promise<void> {
    if (this.open || this.disabled || this.menuDisabled) return;
    // Reopened mid-close: drop the pending exit so it can't hide the panel we're about to
    // show, and clear the class so the entrance plays from the top.
    this.cancelExit?.();
    this.cancelExit = undefined;
    this.closing = false;
    this.open = true;
    this.focusedIndex = -1;
    this.cleanupOutside = onClickOutside(this, () => this.closeMenu());
    this.cleanupReposition = this.observeReposition();

    await this.updateComplete;
    const panel = this.panelEl;
    if (!panel) return;
    // Promote to the top layer *before* measuring, so the panel has a real size — and in
    // the same task as positioning it, so no frame ever paints it at the UA's default
    // centered position.
    if (supportsPopover(panel) && !panel.matches(":popover-open")) {
      try {
        panel.showPopover();
      } catch {
        // Already open, or the element was detached mid-flight — either way, nothing to do.
      }
    }
    this.positionPanel();
    this.emitToggle();
  }

  private closeMenu(options: { restoreFocus?: boolean } = {}): void {
    if (!this.open) return;
    this.open = false;
    this.focusedIndex = -1;
    // Listeners and focus are released immediately — only the panel's own visibility
    // waits, so a closing menu never keeps reacting to clicks or scrolls.
    this.releaseOpenState();
    if (options.restoreFocus) this.caretEl?.focus();
    this.emitToggle();
    this.startExit();
  }

  /**
   * Keeps the panel in the top layer while it plays its `-out` keyframe, then hides it.
   */
  private startExit(): void {
    const panel = this.panelEl;
    if (!panel) {
      this.hidePanel();
      return;
    }
    this.closing = true;
    // Wait for the `closing` class to land before listening: the entrance animation is
    // replaced (not finished) by the exit, so listening any earlier could catch the
    // entrance's own `animationend` on a menu opened and closed in quick succession.
    void this.updateComplete.then(() => {
      if (!this.closing) return;
      this.cancelExit = onExitAnimationEnd(panel, () => {
        this.cancelExit = undefined;
        this.closing = false;
        this.hidePanel();
      });
    });
  }

  private releaseOpenState(): void {
    this.cleanupOutside?.();
    this.cleanupOutside = undefined;
    this.cleanupReposition?.();
    this.cleanupReposition = undefined;
    cancelAnimationFrame(this.repositionFrame);
  }

  private hidePanel(): void {
    const panel = this.panelEl;
    if (panel && supportsPopover(panel) && panel.matches(":popover-open")) {
      try {
        panel.hidePopover();
      } catch {
        // Already hidden — nothing to do.
      }
    }
  }

  private teardownOpenState(): void {
    this.cancelExit?.();
    this.cancelExit = undefined;
    this.closing = false;
    this.releaseOpenState();
    this.hidePanel();
  }

  private emitToggle(): void {
    this.dispatchEvent(
      new CustomEvent("loomi-split-toggle", {
        bubbles: true,
        composed: true,
        detail: { open: this.open },
      }),
    );
  }

  private toggleMenu(): void {
    if (this.open) this.closeMenu({ restoreFocus: true });
    else void this.openMenu();
  }

  // ---------------------------------------------------------------- positioning

  private observeReposition(): () => void {
    const reposition = (): void => this.scheduleReposition();
    window.addEventListener("resize", reposition);
    // Capture phase so scrolling *any* ancestor (the table this button sits in, say)
    // repositions the panel — it's in the top layer and won't move with them.
    window.addEventListener("scroll", reposition, true);
    return () => {
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
    };
  }

  private scheduleReposition(): void {
    cancelAnimationFrame(this.repositionFrame);
    this.repositionFrame = requestAnimationFrame(() => this.positionPanel());
  }

  /**
   * `auto` aligns to the caret (end) edge, since that's the half the menu belongs to —
   * which is the shared helper's own default, so the placement passes straight through.
   * The helper also publishes `--loomi-anchor-width` on the panel.
   */
  private positionPanel(): void {
    const panel = this.panelEl;
    const pair = this.renderRoot.querySelector<HTMLElement>(".loomi-split");
    if (!panel || !pair || !this.open) return;
    this.resolvedPlacement = positionFloatingPanel(pair, panel, this.placement);
  }

  // ---------------------------------------------------------------- menu items

  private menuItems(): LoomiDropmenuItem[] {
    return Array.from(this.children).filter(
      (child): child is LoomiDropmenuItem => child instanceof LoomiDropmenuItem && child.selectable,
    );
  }

  private focusItemAt(index: number): void {
    const items = this.menuItems();
    if (!items.length) return;
    const next = (index + items.length) % items.length;
    this.focusedIndex = next;
    items[next].focusItem();
  }

  private async openAndFocus(index: number): Promise<void> {
    if (!this.open) await this.openMenu();
    await this.updateComplete;
    this.focusItemAt(index);
  }

  // ---------------------------------------------------------------- events

  private onCaretClick = (event: Event): void => {
    // The caret is a button in its own right; don't let its click read as the primary
    // action to anything listening further up.
    event.stopPropagation();
    this.toggleMenu();
  };

  private onCaretKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    void this.openAndFocus(event.key === "ArrowUp" ? -1 : 0);
  };

  private onPanelKeyDown = (event: KeyboardEvent): void => {
    if (!this.open) return;
    const items = this.menuItems();

    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      this.closeMenu({ restoreFocus: true });
      return;
    }

    if (event.key === "Tab") {
      // Items are tabindex="-1" (roving focus), so a bare Tab would strand focus outside
      // a still-open panel. Close and let the browser's own Tab motion continue — the
      // standard non-trapping menu-button pattern, same as <loomi-dropmenu>.
      this.closeMenu();
      return;
    }

    if (!items.length) return;

    const target = nextMenuFocusIndex(event, this.focusedIndex, items.length);
    if (target !== undefined) {
      event.preventDefault();
      this.focusItemAt(target);
    } else if ((event.key === "Enter" || event.key === " ") && this.focusedIndex >= 0) {
      event.preventDefault();
      items[this.focusedIndex].click();
    }
  };

  private onPanelClick = (event: Event): void => {
    if (!this.hideAfterClick) return;
    const item = event
      .composedPath()
      .find((target): target is LoomiDropmenuItem => target instanceof LoomiDropmenuItem);
    // Submenu parents and checkbox/radio rows deliberately keep the menu open.
    if (item && item.selectable && !item.hasSubmenu && !item.isToggle) {
      this.closeMenu({ restoreFocus: true });
    }
  };

  // ---------------------------------------------------------------- rendering

  override updated(changed: PropertyValues<this>): void {
    super.updated(changed);
    // Reflected as an attribute (rather than kept as @state alone) so styles.css can flip
    // the caret glyph, and so consumers can style the open state from their own CSS.
    this.toggleAttribute("open-menu", this.open);
    void this.syncCaretAria();
  }

  /**
   * The caret's accessible semantics have to land on the real `<button>` inside
   * `<loomi-button>`'s shadow root — ARIA on the host wouldn't reach the node that
   * actually takes focus. `controlElement` is `@loomidev/button`'s supported way in.
   */
  private async syncCaretAria(): Promise<void> {
    const caret = this.caretEl;
    if (!caret) return;
    await caret.updateComplete;
    const control = caret.controlElement;
    if (!control) return;
    control.setAttribute("aria-haspopup", "menu");
    control.setAttribute("aria-expanded", this.open ? "true" : "false");
    control.setAttribute("aria-label", this.menuLabel);
  }

  private renderCaretIcon(): TemplateResult {
    return html`<svg
      class="loomi-caret-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      ${CHEVRON_DOWN}
    </svg>`;
  }

  override render(): TemplateResult {
    const shared = {
      color: this.color || nothing,
      size: this.size,
      radius: this.radius,
    };

    return html`
      <div
        class="loomi-split"
        part="split"
        style="--loomi-split-seam:${Math.max(1, this.borderWidth)}px"
      >
        <loomi-button
          class="loomi-primary"
          part="primary"
          exportparts="button:primary-button"
          type=${this.type}
          color=${shared.color}
          size=${shared.size}
          radius=${shared.radius}
          border-width=${this.borderWidth}
          icon=${this.icon || nothing}
          href=${this.href || nothing}
          tag=${this.tag}
          ?outline=${this.outline}
          ?icon-right=${this.iconRight}
          ?disabled=${this.disabled}
          ?can-submit=${this.canSubmit}
          ?has-spinner=${this.hasSpinner}
          ?show-spinner=${this.showSpinner}
          ?uppercase=${this.uppercase}
        >
          <slot></slot>
        </loomi-button>
        <span class="loomi-divider" part="divider" aria-hidden="true"></span>
        <loomi-button
          class="loomi-caret"
          part="caret"
          exportparts="button:caret-button"
          type=${this.type}
          color=${shared.color}
          size=${shared.size}
          radius=${shared.radius}
          border-width=${this.borderWidth}
          ?outline=${this.outline}
          ?disabled=${this.disabled || this.menuDisabled}
          @click=${this.onCaretClick}
          @keydown=${this.onCaretKeyDown}
        >
          ${this.renderCaretIcon()}
        </loomi-button>
      </div>
      <div
        class="loomi-panel place-${this.resolvedPlacement} ${
          this.open || this.closing ? "open" : ""
        } ${this.closing ? "closing" : ""}"
        part="panel"
        popover="manual"
        role="menu"
        aria-label=${this.menuLabel}
        @click=${this.onPanelClick}
        @keydown=${this.onPanelKeyDown}
      >
        <slot name="menu"></slot>
      </div>
    `;
  }
}

export interface LoomiSplitButtonToggleDetail {
  open: boolean;
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-split-button": LoomiSplitButton;
  }

  interface HTMLElementEventMap {
    "loomi-split-toggle": CustomEvent<LoomiSplitButtonToggleDetail>;
  }
}
