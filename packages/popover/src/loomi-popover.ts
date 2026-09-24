import { html, nothing, type TemplateResult } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import {
  LoomiElement,
  loomiStyles,
  onClickOutside,
  deepActiveElement,
  supportsPopover,
} from "@loomidev/core";
import { getLoomiIcon } from "@loomidev/icons";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiPopoverPlacement = "top" | "bottom" | "left" | "right";

/** Gap between the trigger and the panel — room for the 8px arrow. */
const POP_GAP = 10;
/** How close to the viewport edge the panel may come. */
const POP_MARGIN = 8;
/** Arrow base width (1rem). */
const POP_ARROW = 16;
/** Keeps the arrow off the panel's rounded corners. */
const POP_ARROW_INSET = 8;

/**
 * `<loomi-popover>` — a floating rich-content panel opened on click or hover.
 *
 * @slot - Panel content (rich markup allowed).
 * @slot trigger - Custom trigger markup (overrides the `trigger` icon).
 * @fires loomi-toggle - `detail: { open }` whenever the panel opens or closes.
 */
@customElement("loomi-popover")
export class LoomiPopover extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property() trigger = "information-circle";
  @property({ attribute: "trigger-on" }) triggerOn: "click" | "mouseover" = "click";
  @property() placement: LoomiPopoverPlacement = "bottom";
  @property() title = "";
  @property({ type: Number }) width = 280;
  @property({ type: Boolean, reflect: true }) disabled = false;

  @state() private open = false;
  /** The side the panel actually settled on, after flipping away from a viewport edge. */
  @state() private resolvedPlacement: LoomiPopoverPlacement = "bottom";
  @query(".loomi-panel") private panelEl?: HTMLElement;
  private cleanup?: () => void;
  private stopFollowing?: () => void;
  /** Focus to restore on close, captured only when it was inside this component. */
  private previouslyFocused: HTMLElement | null = null;

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener("keydown", this.onKeyDown);
    this.addEventListener("focusout", this.onFocusOut);
  }
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.cleanup?.();
    this.releasePanel();
    this.removeEventListener("keydown", this.onKeyDown);
    this.removeEventListener("focusout", this.onFocusOut);
  }

  /** Whether the panel is currently open. */
  get isOpen(): boolean {
    return this.open;
  }

  private setOpen(open: boolean): void {
    if (this.open === open) return;
    this.open = open;
    this.dispatchEvent(
      new CustomEvent("loomi-toggle", { bubbles: true, composed: true, detail: { open } }),
    );
  }

  /** True while focus is somewhere inside the trigger or the open panel. */
  private get focusIsInside(): boolean {
    const active = deepActiveElement();
    return !!active && (this.contains(active) || (this.renderRoot as ShadowRoot).contains(active));
  }

  show(): void {
    if (this.open || this.disabled) return;
    this.previouslyFocused = this.focusIsInside ? (deepActiveElement() as HTMLElement) : null;
    this.setOpen(true);
    if (this.triggerOn === "click") this.cleanup = onClickOutside(this, () => this.hide());
  }
  hide(): void {
    const restoreFocus = this.focusIsInside;
    this.setOpen(false);
    this.cleanup?.();
    if (restoreFocus) this.previouslyFocused?.focus();
    this.previouslyFocused = null;
  }
  toggle(): void {
    if (this.open) this.hide();
    else this.show();
  }

  private onKeyDown = (e: KeyboardEvent): void => {
    if (e.key === "Escape" && this.open) {
      e.stopPropagation();
      this.hide();
    }
  };

  /**
   * Non-modal dialog (no `aria-modal`, arbitrary rich content) — Tab isn't trapped like
   * `loomi-modal`'s dialog, it's allowed to move focus out normally, which closes the
   * panel rather than leaving it open with focus already gone.
   */
  private onFocusOut = (e: FocusEvent): void => {
    if (!this.open) return;
    const next = e.relatedTarget as Node | null;
    if (next && (this.contains(next) || (this.renderRoot as ShadowRoot).contains(next))) return;
    this.hide();
  };

  override willUpdate(changed: Map<PropertyKey, unknown>): void {
    super.willUpdate(changed);
    // Closed, the panel advertises the requested side; placePanel() may flip it once open.
    if (!this.open) this.resolvedPlacement = this.placement;
  }

  override updated(changed: Map<PropertyKey, unknown>): void {
    super.updated(changed);
    if (!this.open) {
      this.releasePanel();
      return;
    }
    const panel = this.panelEl;
    if (!panel) return;
    // The panel lives in the top layer, so an ancestor with `overflow` (a modal, a card, a
    // table's scroll wrapper) neither clips it nor grows a scrollbar to make room for it.
    if (supportsPopover(panel) && !panel.matches(":popover-open")) {
      try {
        panel.showPopover();
      } catch {
        // Detached mid-flight — nothing to do.
      }
    }
    if (!this.stopFollowing) this.stopFollowing = this.followAnchor();
    if (changed.has("open") || changed.has("placement") || changed.has("width")) this.placePanel();
  }

  private followAnchor(): () => void {
    let frame = 0;
    const schedule = (): void => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => this.placePanel());
    };
    window.addEventListener("resize", schedule);
    // Capture phase: a scroll anywhere above the trigger moves it.
    window.addEventListener("scroll", schedule, true);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule, true);
    };
  }

  private releasePanel(): void {
    this.stopFollowing?.();
    this.stopFollowing = undefined;
    const panel = this.panelEl;
    if (panel && supportsPopover(panel) && panel.matches(":popover-open")) {
      try {
        panel.hidePopover();
      } catch {
        // Already hidden — nothing to do.
      }
    }
  }

  /**
   * Places the panel on the requested side of the trigger, start-aligned, in viewport
   * coordinates. It flips to the opposite side when the requested one has no room, shifts
   * along the edge to stay on screen, and keeps its arrow pointing at the trigger.
   */
  private placePanel(): void {
    const panel = this.panelEl;
    if (!panel || !this.open) return;
    const anchor = this.getBoundingClientRect();
    // offsetWidth/Height, not a rect: the entrance animation's transform would skew a rect.
    const width = panel.offsetWidth;
    const height = panel.offsetHeight;
    const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
    const viewportHeight = document.documentElement.clientHeight || window.innerHeight;
    const opposite: Record<LoomiPopoverPlacement, LoomiPopoverPlacement> = {
      top: "bottom",
      bottom: "top",
      left: "right",
      right: "left",
    };
    const fits = (side: LoomiPopoverPlacement): boolean => {
      switch (side) {
        case "top":
          return anchor.top - POP_GAP - height >= POP_MARGIN;
        case "bottom":
          return anchor.bottom + POP_GAP + height <= viewportHeight - POP_MARGIN;
        case "left":
          return anchor.left - POP_GAP - width >= POP_MARGIN;
        case "right":
          return anchor.right + POP_GAP + width <= viewportWidth - POP_MARGIN;
      }
    };
    const preferred = this.placement in opposite ? this.placement : "bottom";
    const side = fits(preferred) || !fits(opposite[preferred]) ? preferred : opposite[preferred];
    const clamp = (value: number, size: number, viewport: number): number =>
      Math.min(Math.max(value, POP_MARGIN), Math.max(POP_MARGIN, viewport - POP_MARGIN - size));

    let left: number;
    let top: number;
    let arrow: number;
    if (side === "top" || side === "bottom") {
      left = clamp(anchor.left, width, viewportWidth);
      top = side === "top" ? anchor.top - POP_GAP - height : anchor.bottom + POP_GAP;
      const center = anchor.left + anchor.width / 2 - left;
      arrow = Math.min(
        Math.max(center - POP_ARROW / 2, POP_ARROW_INSET),
        width - POP_ARROW - POP_ARROW_INSET,
      );
    } else {
      top = clamp(anchor.top, height, viewportHeight);
      left = side === "left" ? anchor.left - POP_GAP - width : anchor.right + POP_GAP;
      const middle = anchor.top + anchor.height / 2 - top;
      arrow = Math.min(
        Math.max(middle - POP_ARROW / 2, POP_ARROW_INSET),
        height - POP_ARROW - POP_ARROW_INSET,
      );
    }
    panel.style.left = `${Math.round(left)}px`;
    panel.style.top = `${Math.round(top)}px`;
    panel.style.setProperty("--_loomi-pop-arrow", `${Math.round(arrow)}px`);
    this.resolvedPlacement = side;
  }

  override render(): TemplateResult {
    const path = getLoomiIcon(this.trigger.replace(/-icon$/, ""));
    return html`<button
      class="loomi-trigger"
      aria-haspopup="dialog"
      aria-expanded=${this.open ? "true" : "false"}
      ?disabled=${this.disabled}
      @click=${this.triggerOn === "click" && !this.disabled ? () => this.toggle() : nothing}
      @mouseenter=${this.triggerOn === "mouseover" && !this.disabled ? () => this.show() : nothing}
      @mouseleave=${this.triggerOn === "mouseover" ? () => this.hide() : nothing}
    >
      <slot name="trigger">
        ${path ? html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">${path}</svg>` : "?"}
      </slot>
    </button>
    ${
      this.open
        ? html`<div class="loomi-panel placement-${this.resolvedPlacement}" popover="manual" role="dialog" style="--loomi-pop-width:${this.width}px">
          ${this.title ? html`<div class="loomi-title">${this.title}</div>` : nothing}
          <div class="loomi-content"><slot></slot></div>
        </div>`
        : nothing
    }`;
  }
}

export interface LoomiPopoverToggleDetail {
  open: boolean;
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-popover": LoomiPopover;
  }

  interface HTMLElementEventMap {
    "loomi-toggle": CustomEvent<LoomiPopoverToggleDetail>;
  }
}
