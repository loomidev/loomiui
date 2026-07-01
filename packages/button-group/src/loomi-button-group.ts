import { html, nothing, type TemplateResult, type PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LoomiElement, loomiStyles, accentVars, cssColor, type LoomiColor } from "@loomidev/core";
import { getLoomiIcon } from "@loomidev/icons";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiButtonGroupSize = "tiny" | "small" | "regular" | "medium" | "big";

/** Padding/font-size CSS vars injected by the parent for each size. Items inherit them. */
const SIZE_VARS: Record<LoomiButtonGroupSize, string> = {
  tiny:    "--loomi-bg-pad-x:0.625rem;--loomi-bg-pad-y:0.25rem;--loomi-bg-font:0.75rem",
  small:   "--loomi-bg-pad-x:0.75rem;--loomi-bg-pad-y:0.375rem;--loomi-bg-font:0.875rem",
  regular: "--loomi-bg-pad-x:1rem;--loomi-bg-pad-y:0.5rem;--loomi-bg-font:0.875rem",
  medium:  "--loomi-bg-pad-x:1.25rem;--loomi-bg-pad-y:0.625rem;--loomi-bg-font:1rem",
  big:     "--loomi-bg-pad-x:1.5rem;--loomi-bg-pad-y:0.75rem;--loomi-bg-font:1.125rem",
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
 * `<loomi-button-group>` — a horizontal row of outline-style toggle buttons.
 *
 * Place `<loomi-button-group-item>` elements as children. Only the first and last items
 * carry rounded corners; adjacent borders collapse. Clicking an item selects it and
 * deselects the rest. Set `disabled` to disable all items at once.
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

  /** Color palette for the group. Accepts any loomi color name. */
  @property() color: LoomiColor = "primary" as LoomiColor;

  /** Size preset — controls padding and font-size of all items. */
  @property({ reflect: true }) size: LoomiButtonGroupSize = "regular";

  /** Disable all items in the group at once. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  private get items(): LoomiButtonGroupItem[] {
    return Array.from(
      this.querySelectorAll<LoomiButtonGroupItem>("loomi-button-group-item"),
    );
  }

  private get groupStyleVars(): string {
    const sizeVars = SIZE_VARS[this.size] ?? SIZE_VARS.regular;
    const borderVar = `--loomi-bg-border:${cssColor(this.color, 300)}`;

    // Secondary uses a lighter fill (matching the solid secondary button) with dark text.
    // Every other color uses the full accent-600 fill with white text.
    const isSec = this.color === "secondary";
    const selVars = [
      `--loomi-bg-sel-bg:${isSec ? cssColor("secondary", 200) : "var(--_loomi-accent)"}`,
      `--loomi-bg-sel-color:${isSec ? cssColor("secondary", 600) : "var(--loomi-white,#fff)"}`,
      `--loomi-bg-sel-border:${isSec ? cssColor("secondary", 300) : "var(--_loomi-accent)"}`,
      `--loomi-bg-sel-hover:${isSec ? cssColor("secondary", 300) : "var(--_loomi-accent-strong)"}`,
    ].join(";");

    return `${accentVars(this.color)};${sizeVars};${borderVar};${selVars}`;
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
    if (changed.has("color") || changed.has("size")) {
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
