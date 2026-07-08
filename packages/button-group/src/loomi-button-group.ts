import { html, nothing, type TemplateResult, type PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LoomiElement, loomiStyles, accentVars, cssColor, type LoomiColor } from "@loomidev/core";
import { getLoomiIcon } from "@loomidev/icons";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiButtonGroupSize = "tiny" | "small" | "regular" | "medium" | "big";
export type LoomiButtonGroupRadius = "none" | "small" | "medium" | "full";

/** Size CSS vars aligned with `<loomi-button>` control tokens. */
const SIZE_VARS: Record<LoomiButtonGroupSize, string> = {
  tiny:    "--loomi-bg-height:2rem;--loomi-bg-pad-x:0.625rem;--loomi-bg-font:0.75rem",
  small:   "--loomi-bg-height:2.25rem;--loomi-bg-pad-x:0.75rem;--loomi-bg-font:0.875rem",
  regular: "--loomi-bg-height:2.5rem;--loomi-bg-pad-x:1rem;--loomi-bg-font:0.875rem",
  medium:  "--loomi-bg-height:2.75rem;--loomi-bg-pad-x:1.25rem;--loomi-bg-font:1rem",
  big:     "--loomi-bg-height:3rem;--loomi-bg-pad-x:1.5rem;--loomi-bg-font:1.125rem",
};

const RADIUS_VARS: Record<LoomiButtonGroupRadius, string> = {
  none: "--loomi-bg-radius:0",
  small: "--loomi-bg-radius:0.25rem",
  medium: "--loomi-bg-radius:0.5rem",
  full: "--loomi-bg-radius:9999px",
};

/**
 * `<loomi-button-group-item>` — a single button within a `<loomi-button-group>`.
 *
 * Set `label` for button text, `icon` for a built-in icon name, `icon-right` to place
 * the icon after the label, `selected` to mark this item as active, and `disabled` to
 * disable just this item. The `value` attribute is surfaced in the `button-group-change`
 * event emitted by the parent.
 *
 * @slot - Button label text (used when the `label` attribute is absent).
 * @fires loomi-bg-click - Bubbles + composed; `detail: { value }`. Handled by the parent.
 */
@customElement("loomi-button-group-item")
export class LoomiButtonGroupItem extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  /** Button label text. Falls back to slot text if empty. */
  @property() label = "";

  /** Built-in icon name to render (same registry as `<loomi-button>`). */
  @property() icon = "";

  /** Place the icon after the label instead of before it. */
  @property({ type: Boolean, attribute: "icon-right" }) iconRight = false;

  /** Mark this item as the selected / active item. */
  @property({ type: Boolean, reflect: true }) selected = false;

  /** Disable this individual item. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Value surfaced in the `button-group-change` event. Falls back to `label`. */
  @property() value = "";

  private handleClick(): void {
    if (this.disabled) return;
    this.dispatchEvent(
      new CustomEvent("loomi-bg-click", {
        bubbles: true,
        composed: true,
        detail: { value: this.value },
      }),
    );
  }

  private renderIcon(): TemplateResult | typeof nothing {
    if (!this.icon) return nothing;
    const path = getLoomiIcon(this.icon);
    if (!path) return nothing;
    return html`<svg
      class="loomi-bg-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      aria-hidden="true"
    >${path}</svg>`;
  }

  override render(): TemplateResult {
    const icon = this.renderIcon();
    const leading = !this.iconRight ? icon : nothing;
    const trailing = this.iconRight ? icon : nothing;
    const cls = ["loomi-bg-btn", this.selected ? "selected" : ""].filter(Boolean).join(" ");

    return html`
      <button
        class=${cls}
        type="button"
        ?disabled=${this.disabled}
        aria-pressed=${this.selected ? "true" : "false"}
        @click=${this.handleClick}
      >
        ${leading}
        <span class="loomi-bg-label"><slot>${this.label}</slot></span>
        ${trailing}
      </button>
    `;
  }
}

/**
 * `<loomi-button-group>` — a horizontal row of secondary-style toggle buttons.
 *
 * Place `<loomi-button-group-item>` elements as children. Unselected items use the same
 * neutral bordered ghost treatment as `<loomi-button type="secondary">`; the selected
 * item uses a calm neutral gray fill (never the group `color`, which only tints the
 * focus ring). Adjacent buttons are separated by a 2px divider; only the first and last
 * visible items carry the group radius.
 *
 * @slot - `<loomi-button-group-item>` children.
 * @fires button-group-change - `detail: { value, label, index }` when selection changes.
 *
 * @example
 * ```html
 * <loomi-button-group color="primary">
 *   <loomi-button-group-item label="Day"   value="day"   icon="calendar" selected></loomi-button-group-item>
 *   <loomi-button-group-item label="Week"  value="week"  icon="calendar-days"></loomi-button-group-item>
 *   <loomi-button-group-item label="Month" value="month"></loomi-button-group-item>
 * </loomi-button-group>
 * ```
 */
@customElement("loomi-button-group")
export class LoomiButtonGroup extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  /** Accent used for the focus ring on the selected item. Accepts any loomi color name. */
  @property() color: LoomiColor = "primary" as LoomiColor;

  /** Size preset — controls padding and font-size of all items. */
  @property({ reflect: true }) size: LoomiButtonGroupSize = "regular";

  /** Corner radius preset, matching `<loomi-button radius="...">`. */
  @property({ reflect: true }) radius: LoomiButtonGroupRadius = "medium";

  /** Disable all items in the group at once. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  private get items(): LoomiButtonGroupItem[] {
    return Array.from(
      this.querySelectorAll<LoomiButtonGroupItem>("loomi-button-group-item"),
    );
  }

  private get groupStyleVars(): string {
    const sizeVars = SIZE_VARS[this.size] ?? SIZE_VARS.regular;
    const radiusVars = RADIUS_VARS[this.radius] ?? RADIUS_VARS.medium;

    // Selected items always use a calm neutral gray — never the group's accent color —
    // so the active item reads as "chosen" without competing for attention like a
    // primary-colored call-to-action would. `color` only tints the focus ring below.
    const selVars = [
      `--loomi-bg-sel-bg:var(--loomi-surface)`,
      `--loomi-bg-sel-color:var(--loomi-text)`,
      `--loomi-bg-sel-border:${cssColor(this.color, 500)}`,
      `--loomi-bg-sel-hover:var(--loomi-surface-hover)`,
      `--loomi-bg-accent-soft:${cssColor(this.color, 100)}`,
    ].join(";");

    return `${accentVars(this.color)};${sizeVars};${radiusVars};${selVars}`;
  }

  private applyGroupStyleVars(): void {
    for (const decl of this.groupStyleVars.split(";")) {
      if (!decl) continue;
      const idx = decl.indexOf(":");
      if (idx === -1) continue;
      this.style.setProperty(decl.slice(0, idx).trim(), decl.slice(idx + 1).trim());
    }
  }

  override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has("color") || changed.has("size") || changed.has("radius")) {
      this.applyGroupStyleVars();
    }
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.applyGroupStyleVars();
  }

  private onItemClick = (e: Event): void => {
    const clicked = e
      .composedPath()
      .find((el): el is LoomiButtonGroupItem => el instanceof LoomiButtonGroupItem);
    if (!clicked || this.disabled || clicked.disabled) return;

    const items = this.items;
    for (const it of items) it.selected = it === clicked;

    const index = items.indexOf(clicked);
    this.dispatchEvent(
      new CustomEvent("button-group-change", {
        bubbles: true,
        composed: true,
        detail: {
          value: clicked.value || clicked.label || clicked.textContent?.trim(),
          label: clicked.label || clicked.textContent?.trim(),
          index,
        },
      }),
    );
  };

  override render(): TemplateResult {
    return html`
      <div
        class="loomi-bg-group${this.disabled ? " disabled" : ""}"
        role="group"
        @loomi-bg-click=${this.onItemClick}
      >
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-button-group": LoomiButtonGroup;
    "loomi-button-group-item": LoomiButtonGroupItem;
  }
}
