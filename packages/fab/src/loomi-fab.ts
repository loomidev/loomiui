import { html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { LoomiElement, loomiStyles, loomiT, accentVars, onClickOutside, type LoomiColor } from "@loomidev/core";
import type { LoomiIconSource } from "@loomidev/icons";
import "@loomidev/icon/loomi-icon.js";
import type { LoomiTooltipPlacement } from "@loomidev/tooltip";
import "@loomidev/tooltip/loomi-tooltip.js";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiFabPlacement = "bottom-right" | "bottom-left" | "top-right" | "top-left";
export type LoomiFabResolvedDirection = "up" | "down" | "left" | "right";
export type LoomiFabDirection = LoomiFabResolvedDirection | "";
export type LoomiFabTrigger = "click" | "hover";
export type LoomiFabVariant = "floating" | "docked";
export type LoomiFabSize = "small" | "medium" | "regular";

const booleanAttribute = {
  fromAttribute(value: string | null): boolean {
    return value !== null && value.toLowerCase() !== "false";
  },
  toAttribute(value: boolean): string | null {
    return value ? "" : null;
  },
};

/** Which arrow key moves focus further from the trigger vs. back toward it, per stack axis. */
const AXIS_KEYS: Record<LoomiFabResolvedDirection, { next: string; prev: string }> = {
  up: { next: "ArrowUp", prev: "ArrowDown" },
  down: { next: "ArrowDown", prev: "ArrowUp" },
  left: { next: "ArrowLeft", prev: "ArrowRight" },
  right: { next: "ArrowRight", prev: "ArrowLeft" },
};

/** Walks into nested shadow roots to find the actually-focused element. */
function deepActiveElement(): Element | null {
  let el: Element | null = document.activeElement;
  while (el?.shadowRoot?.activeElement) el = el.shadowRoot.activeElement;
  return el;
}

/**
 * `<loomi-fab-item>` — one action inside a `<loomi-fab>`'s speed-dial menu.
 *
 * @fires loomi-select - Clicked (not disabled). `detail: { value, label }`, bubbles/composed.
 */
@customElement("loomi-fab-item")
export class LoomiFabItem extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  /** Name of a built-in icon (same registry as `<loomi-icon>`). */
  @property() icon = "";

  /** Icon set override for just this item. Empty = inherit from the parent's `icon-source`. */
  @property({ attribute: "icon-source" }) iconSource: LoomiIconSource | "" = "";

  /** Visible text next to the icon. */
  @property() label = "";

  /** Value reported on `event.detail.value` when this item is selected. */
  @property() value = "";

  /** Disable this item — excluded from click, keyboard nav, and styled as inactive. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Fallback icon source inherited from the parent `<loomi-fab>`. Set internally — not a public API. */
  @property({ attribute: false }) hostIconSource: LoomiIconSource = "heroicons";

  /** Pushed down from the parent `<loomi-fab>`'s `icons-only`. Set internally — not a public API. */
  @property({ attribute: false }) hostIconsOnly = false;

  /** Pushed down from the parent `<loomi-fab>`. Where the `icons-only` tooltip appears. Set internally — not a public API. */
  @property({ attribute: false }) hostTooltipPlacement: LoomiTooltipPlacement = "top";

  private get effectiveIconSource(): LoomiIconSource {
    return (this.iconSource || this.hostIconSource || "heroicons") as LoomiIconSource;
  }

  /** Move focus to this item's button. Used by `<loomi-fab>`'s roving keyboard nav. */
  focusItem(): void {
    this.renderRoot.querySelector<HTMLElement>(".loomi-pill")?.focus();
  }

  private onClick = (event: Event): void => {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.dispatchEvent(
      new CustomEvent("loomi-select", {
        detail: { value: this.value, label: this.label },
        bubbles: true,
        composed: true,
      }),
    );
  };

  private renderPill(): TemplateResult {
    const iconOnly = this.hostIconsOnly;
    return html`
      <button
        class="loomi-pill ${iconOnly ? "icon-only" : ""}"
        type="button"
        role="menuitem"
        ?disabled=${this.disabled}
        aria-label=${iconOnly ? this.label : nothing}
        @click=${this.onClick}
      >
        <span class="loomi-pill-icon" aria-hidden="true">
          ${this.icon
            ? html`<loomi-icon class="loomi-pill-icon-glyph" name=${this.icon} source=${this.effectiveIconSource}></loomi-icon>`
            : nothing}
        </span>
        ${!iconOnly && this.label ? html`<span class="loomi-pill-label">${this.label}</span>` : nothing}
      </button>
    `;
  }

  override render(): TemplateResult {
    if (this.hostIconsOnly && this.label) {
      return html`<loomi-tooltip
        class="loomi-item-tooltip"
        content=${this.label}
        placement=${this.hostTooltipPlacement}
        >${this.renderPill()}</loomi-tooltip
      >`;
    }
    return this.renderPill();
  }
}

/**
 * `<loomi-fab>` — a floating action button. With no children it's a single action
 * button; add `<loomi-fab-item>` children and it becomes a speed-dial menu.
 *
 * @slot - `<loomi-fab-item>` children.
 * @fires open - The speed-dial menu opened. @fires close - It closed.
 */
@customElement("loomi-fab")
export class LoomiFab extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  /** Which viewport corner to anchor to (`floating`), or which edge to align the menu to (`docked`). */
  @property({ reflect: true }) placement: LoomiFabPlacement = "bottom-right";

  /** Which way the speed-dial menu expands. Empty = infer from `placement` (bottom-* → up, top-* → down). */
  @property({ reflect: true }) direction: LoomiFabDirection = "";

  /** How the speed-dial menu is triggered. `hover` still opens on click/focus too, for touch and keyboard. */
  @property() trigger: LoomiFabTrigger = "click";

  /** `floating` (default) anchors the button to a viewport corner. `docked` renders in normal flow. */
  @property({ reflect: true }) variant: LoomiFabVariant = "floating";

  /** Size preset for the trigger button and speed-dial item circles. */
  @property({ reflect: true }) size: LoomiFabSize = "regular";

  /** Palette accent for the trigger and (softly) the item icons. */
  @property() color: LoomiColor = "primary";

  /** Name of a built-in icon (same registry as `<loomi-icon>`) shown on the trigger. */
  @property() icon = "plus";

  /** Default icon set for the trigger and every item — overridable per-item via `icon-source`. */
  @property({ attribute: "icon-source" }) iconSource: LoomiIconSource = "heroicons";

  /** Show only the icon on every item, with its `label` as a `<loomi-tooltip>` instead of visible text. */
  @property({ type: Boolean, attribute: "icons-only", reflect: true }) iconsOnly = false;

  /** Accessible label for the trigger button and the menu. Defaults to a localized "Actions". */
  @property() label = "";

  /** Menu open state (reflected). Only meaningful when there are `<loomi-fab-item>` children. */
  @property({ type: Boolean, reflect: true }) open = false;

  /** Disable the trigger entirely. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Close the menu after an item is selected. */
  @property({ type: Boolean, attribute: "close-on-select", converter: booleanAttribute })
  closeOnSelect = true;

  /** Dim the rest of the page while the menu is open; clicking it closes the menu. */
  @property({ type: Boolean, converter: booleanAttribute })
  backdrop = false;

  /** Locale override for built-in aria labels. */
  @property() locale = "";

  @state() private hasItems = false;

  private cleanupOutsideClick: (() => void) | null = null;
  private hoverCloseTimer = 0;

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener("mouseenter", this.onHostMouseEnter);
    this.addEventListener("mouseleave", this.onHostMouseLeave);
    this.addEventListener("focusout", this.onHostFocusOut);
    this.addEventListener("keydown", this.onKeyDown);
    this.addEventListener("loomi-select", this.onItemSelect);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("mouseenter", this.onHostMouseEnter);
    this.removeEventListener("mouseleave", this.onHostMouseLeave);
    this.removeEventListener("focusout", this.onHostFocusOut);
    this.removeEventListener("keydown", this.onKeyDown);
    this.removeEventListener("loomi-select", this.onItemSelect);
    this.cleanupOutsideClick?.();
    this.cleanupOutsideClick = null;
    clearTimeout(this.hoverCloseTimer);
  }

  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties);
    if (
      changedProperties.has("iconSource") ||
      changedProperties.has("iconsOnly") ||
      changedProperties.has("placement") ||
      changedProperties.has("direction")
    ) {
      this.syncItemDefaults();
    }
  }

  /** Open the speed-dial menu. No-op when disabled, empty, or already open. */
  show(): void {
    if (this.disabled || !this.hasItems || this.open) return;
    this.open = true;
    this.dispatchEvent(new Event("open", { bubbles: true, composed: true }));
    this.cleanupOutsideClick = onClickOutside(this, () => this.hide());
  }

  /** Close the speed-dial menu. */
  hide(): void {
    if (!this.open) return;
    this.open = false;
    this.dispatchEvent(new Event("close", { bubbles: true, composed: true }));
    this.cleanupOutsideClick?.();
    this.cleanupOutsideClick = null;
  }

  /** Toggle the speed-dial menu. */
  toggle(): void {
    if (this.open) this.hide();
    else this.show();
  }

  private get resolvedDirection(): LoomiFabResolvedDirection {
    if (this.direction) return this.direction;
    return this.placement.startsWith("top") ? "down" : "up";
  }

  /** Flex-direction for each item's own icon/label row — always icon-then-label,
   * horizontally. For a vertically-stacked menu (`direction` up/down) it's reversed per
   * corner so the label extends away from the nearest screen edge instead of off-screen;
   * a horizontally-stacked menu (left/right) keeps a plain icon-left/label-right row
   * regardless of corner, since the stack's own axis already reads left-to-right. */
  private pillFlow(dir: LoomiFabResolvedDirection): string {
    if (dir === "left" || dir === "right") return "row";
    return this.placement.endsWith("left") ? "row" : "row-reverse";
  }

  /** Where the `icons-only` tooltip opens — perpendicular to the stack's own axis so it
   * doesn't collide with the neighboring item, and away from the nearest screen edge. */
  private tooltipPlacementFor(dir: LoomiFabResolvedDirection): LoomiTooltipPlacement {
    if (dir === "left" || dir === "right") {
      return this.placement.startsWith("top") ? "bottom" : "top";
    }
    return this.placement.endsWith("left") ? "right" : "left";
  }

  private getItems(): LoomiFabItem[] {
    return Array.from(this.children).filter((child): child is LoomiFabItem => child instanceof LoomiFabItem);
  }

  private getEnabledItems(): LoomiFabItem[] {
    return this.getItems().filter((item) => !item.disabled);
  }

  private syncItemDefaults(): void {
    const tooltipPlacement = this.tooltipPlacementFor(this.resolvedDirection);
    for (const item of this.getItems()) {
      item.hostIconSource = this.iconSource;
      item.hostIconsOnly = this.iconsOnly;
      item.hostTooltipPlacement = tooltipPlacement;
    }
  }

  private focusItemAt(index: number): void {
    const items = this.getEnabledItems();
    if (!items.length) return;
    items[Math.max(0, Math.min(index, items.length - 1))].focusItem();
  }

  private focusTrigger(): void {
    this.renderRoot.querySelector<HTMLButtonElement>(".loomi-trigger")?.focus();
  }

  private onSlotChange = (event: Event): void => {
    const slot = event.target as HTMLSlotElement;
    this.hasItems = slot.assignedElements({ flatten: true }).some((el) => el instanceof LoomiFabItem);
    this.syncItemDefaults();
  };

  private onTriggerClick = (): void => {
    if (this.disabled || !this.hasItems) return;
    this.toggle();
  };

  private onItemSelect = (): void => {
    if (this.closeOnSelect) {
      this.hide();
      this.focusTrigger();
    }
  };

  private onHostMouseEnter = (): void => {
    if (this.trigger !== "hover" || this.disabled || !this.hasItems) return;
    clearTimeout(this.hoverCloseTimer);
    this.show();
  };

  private onHostMouseLeave = (): void => {
    if (this.trigger !== "hover") return;
    clearTimeout(this.hoverCloseTimer);
    this.hoverCloseTimer = window.setTimeout(() => this.hide(), 200);
  };

  private onHostFocusOut = (event: FocusEvent): void => {
    if (this.trigger !== "hover") return;
    const next = event.relatedTarget as Node | null;
    if (next && this.contains(next)) return;
    this.hide();
  };

  private onKeyDown = (event: KeyboardEvent): void => {
    if (this.disabled || !this.hasItems) return;
    const axis = AXIS_KEYS[this.resolvedDirection];

    if (event.key === "Escape" && this.open) {
      event.preventDefault();
      event.stopPropagation();
      this.hide();
      this.focusTrigger();
      return;
    }

    if (!this.open) {
      if (event.key === axis.next) {
        event.preventDefault();
        this.show();
        void this.updateComplete.then(() => this.focusItemAt(0));
      }
      return;
    }

    const items = this.getEnabledItems();
    if (!items.length) return;
    const current = deepActiveElement();
    const index = items.findIndex((item) => item === current || item.contains(current as Node));

    if (event.key === axis.next) {
      event.preventDefault();
      this.focusItemAt(index < 0 ? 0 : index + 1);
    } else if (event.key === axis.prev) {
      event.preventDefault();
      if (index <= 0) {
        this.hide();
        this.focusTrigger();
      } else {
        this.focusItemAt(index - 1);
      }
    } else if (event.key === "Home") {
      event.preventDefault();
      this.focusItemAt(0);
    } else if (event.key === "End") {
      event.preventDefault();
      this.focusItemAt(items.length - 1);
    }
  };

  private get dialClasses(): string {
    const dir = this.resolvedDirection;
    const cross =
      dir === "up" || dir === "down"
        ? this.placement.endsWith("left")
          ? "side-left"
          : "side-right"
        : this.placement.startsWith("top")
          ? "edge-top"
          : "edge-bottom";
    return ["loomi-dial", `dir-${dir}`, cross].join(" ");
  }

  override render(): TemplateResult {
    const accent = accentVars(this.color);
    const triggerLabel = this.label || loomiT("fab.trigger", {}, this.locale);

    return html`
      <div class="loomi-root" style=${accent}>
        ${this.backdrop ? html`<div class="loomi-backdrop" @click=${() => this.hide()}></div>` : nothing}
        <div
          class=${this.dialClasses}
          role="menu"
          aria-hidden=${this.open ? "false" : "true"}
          aria-label=${this.label || loomiT("fab.dialog", {}, this.locale)}
          style=${`--loomi-pill-flow:${this.pillFlow(this.resolvedDirection)}`}
        >
          <slot @slotchange=${this.onSlotChange}></slot>
        </div>
        <button
          class="loomi-trigger"
          type="button"
          ?disabled=${this.disabled}
          aria-haspopup=${this.hasItems ? "menu" : nothing}
          aria-expanded=${this.hasItems ? (this.open ? "true" : "false") : nothing}
          aria-label=${triggerLabel}
          @click=${this.onTriggerClick}
        >
          <loomi-icon class="loomi-trigger-icon" name=${this.icon} source=${this.iconSource}></loomi-icon>
        </button>
      </div>
    `;
  }
}

export interface LoomiFabSelectDetail {
  value: string;
  label: string;
}

/** Event map for `<loomi-fab-item>`. `loomi-select` is dispatched by several
 * loomi components with different detail shapes, so it is typed per package
 * instead of globally on `HTMLElementEventMap`. */
export interface LoomiFabEventMap {
  "loomi-select": CustomEvent<LoomiFabSelectDetail>;
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-fab": LoomiFab;
    "loomi-fab-item": LoomiFabItem;
  }
}
