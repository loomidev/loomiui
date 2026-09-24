import { html, type TemplateResult } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { LoomiElement, loomiStyles, supportsPopover } from "@loomidev/core";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiTooltipPlacement = "top" | "bottom" | "left" | "right";
export type LoomiTooltipShade = "dark" | "light";

/** Gap between the trigger and the tip — room for the 6px arrow. */
const GAP = 8;

/** How close to the viewport edge the tip may come. */
const VIEWPORT_MARGIN = 8;

/** Keeps the arrow off the tip's rounded corners when the tip is shifted along the edge. */
const ARROW_INSET = 12;

const OPPOSITE: Record<LoomiTooltipPlacement, LoomiTooltipPlacement> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

/**
 * `<loomi-tooltip>` — shows a tooltip on hover/focus of its trigger content.
 *
 * The tip is promoted to the **top layer** via the popover API and placed in viewport
 * coordinates, so an ancestor with `overflow` (a table's scroll wrapper, a card) neither
 * clips it nor grows a scrollbar to make room for it. Near a viewport edge it flips to the
 * opposite side and shifts along the edge, keeping its arrow on the trigger.
 *
 * @slot - The trigger element(s).
 * @slot content - Rich tooltip content (overrides the `content` attribute).
 */
@customElement("loomi-tooltip")
export class LoomiTooltip extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property() content = "";
  @property() placement: LoomiTooltipPlacement = "top";
  @property({ reflect: true }) shade: LoomiTooltipShade = "dark";

  @state() private open = false;
  /** The side the tip actually settled on, after flipping. */
  @state() private resolvedPlacement: LoomiTooltipPlacement = "top";

  @query(".loomi-tip") private tipEl?: HTMLElement;

  private hovered = false;
  private focused = false;
  private cleanupOpen?: () => void;
  private repositionFrame = 0;

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener("mouseenter", this.onMouseEnter);
    this.addEventListener("mouseleave", this.onMouseLeave);
    this.addEventListener("focusin", this.onFocusIn);
    this.addEventListener("focusout", this.onFocusOut);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("mouseenter", this.onMouseEnter);
    this.removeEventListener("mouseleave", this.onMouseLeave);
    this.removeEventListener("focusin", this.onFocusIn);
    this.removeEventListener("focusout", this.onFocusOut);
    this.hovered = false;
    this.focused = false;
    this.hideTip();
  }

  override willUpdate(changed: Map<PropertyKey, unknown>): void {
    super.willUpdate(changed);
    // Closed, the tip advertises the requested side; positionTip() may flip it once open.
    if (!this.open) this.resolvedPlacement = this.placement;
  }

  override updated(changed: Map<PropertyKey, unknown>): void {
    super.updated(changed);
    if (this.open && (changed.has("placement") || changed.has("content"))) this.positionTip();
  }

  /** Show the tooltip. Resolves once it is placed. */
  async show(): Promise<void> {
    await this.showTip();
    await this.updateComplete;
  }

  /** Hide the tooltip. */
  hide(): void {
    this.hovered = false;
    this.focused = false;
    this.hideTip();
  }

  private onMouseEnter = (): void => {
    this.hovered = true;
    void this.showTip();
  };

  private onMouseLeave = (): void => {
    this.hovered = false;
    this.syncVisibility();
  };

  private onFocusIn = (): void => {
    this.focused = true;
    void this.showTip();
  };

  private onFocusOut = (event: FocusEvent): void => {
    if (event.relatedTarget instanceof Node && this.contains(event.relatedTarget)) return;
    this.focused = false;
    this.syncVisibility();
  };

  private syncVisibility(): void {
    if (!this.hovered && !this.focused) this.hideTip();
  }

  private async showTip(): Promise<void> {
    if (this.open) return;
    this.open = true;
    this.cleanupOpen = this.observeOpen();
    await this.updateComplete;
    const tip = this.tipEl;
    if (!tip || !this.open) return;
    // Promote before measuring, so the tip has a real size — and in the same task as
    // positioning it, so no frame paints it at the UA's default centered position.
    if (supportsPopover(tip) && !tip.matches(":popover-open")) {
      try {
        tip.showPopover();
      } catch {
        // Already open, or detached mid-flight — nothing to do.
      }
    }
    this.positionTip();
  }

  private hideTip(): void {
    if (!this.open) return;
    this.open = false;
    this.cleanupOpen?.();
    this.cleanupOpen = undefined;
    cancelAnimationFrame(this.repositionFrame);
    const tip = this.tipEl;
    if (tip && supportsPopover(tip) && tip.matches(":popover-open")) {
      try {
        tip.hidePopover();
      } catch {
        // Already hidden — nothing to do.
      }
    }
  }

  private observeOpen(): () => void {
    const reposition = (): void => {
      cancelAnimationFrame(this.repositionFrame);
      this.repositionFrame = requestAnimationFrame(() => this.positionTip());
    };
    // Escape dismisses without moving focus or the pointer (WCAG 1.4.13).
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") this.hide();
    };
    window.addEventListener("resize", reposition);
    // Capture phase so scrolling *any* ancestor moves the tip with its trigger — it's in
    // the top layer and won't follow on its own.
    window.addEventListener("scroll", reposition, true);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
      document.removeEventListener("keydown", onKeyDown);
    };
  }

  private positionTip(): void {
    const tip = this.tipEl;
    if (!tip || !this.open) return;
    const anchor = this.getBoundingClientRect();
    // `offsetWidth`/`offsetHeight` rather than a rect: the entrance animation's `scale()`
    // would shrink a rect measured in the same task the tip is revealed in.
    const width = tip.offsetWidth;
    const height = tip.offsetHeight;
    const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
    const viewportHeight = document.documentElement.clientHeight || window.innerHeight;

    const fits = (side: LoomiTooltipPlacement): boolean => {
      switch (side) {
        case "top":
          return anchor.top - GAP - height >= VIEWPORT_MARGIN;
        case "bottom":
          return anchor.bottom + GAP + height <= viewportHeight - VIEWPORT_MARGIN;
        case "left":
          return anchor.left - GAP - width >= VIEWPORT_MARGIN;
        case "right":
          return anchor.right + GAP + width <= viewportWidth - VIEWPORT_MARGIN;
      }
    };
    const preferred = this.placement in OPPOSITE ? this.placement : "top";
    const side = fits(preferred) || !fits(OPPOSITE[preferred]) ? preferred : OPPOSITE[preferred];

    const clamp = (value: number, size: number, viewport: number): number =>
      Math.min(
        Math.max(value, VIEWPORT_MARGIN),
        Math.max(VIEWPORT_MARGIN, viewport - VIEWPORT_MARGIN - size),
      );

    let left: number;
    let top: number;
    let arrow: number;
    if (side === "top" || side === "bottom") {
      const center = anchor.left + anchor.width / 2;
      left = clamp(center - width / 2, width, viewportWidth);
      top = side === "top" ? anchor.top - GAP - height : anchor.bottom + GAP;
      arrow = Math.min(Math.max(center - left, ARROW_INSET), width - ARROW_INSET);
    } else {
      const middle = anchor.top + anchor.height / 2;
      top = clamp(middle - height / 2, height, viewportHeight);
      left = side === "left" ? anchor.left - GAP - width : anchor.right + GAP;
      arrow = Math.min(Math.max(middle - top, ARROW_INSET), height - ARROW_INSET);
    }

    tip.style.left = `${Math.round(left)}px`;
    tip.style.top = `${Math.round(top)}px`;
    tip.style.setProperty("--_loomi-tooltip-arrow", `${Math.round(arrow)}px`);
    this.resolvedPlacement = side;
  }

  override render(): TemplateResult {
    return html`
      <slot></slot>
      <span
        class="loomi-tip placement-${this.resolvedPlacement} ${this.open ? "open" : ""}"
        popover="manual"
        role="tooltip"
      >
        <slot name="content">${this.content}</slot>
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-tooltip": LoomiTooltip;
  }
}
