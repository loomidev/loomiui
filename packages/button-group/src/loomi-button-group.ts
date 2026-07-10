import { html, nothing, type TemplateResult, type PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { LoomiElement, loomiStyles, accentVars, type LoomiColor } from "@loomidev/core";
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
  none: "--loomi-bg-radius:0;--loomi-bg-item-radius:0",
  small: "--loomi-bg-radius:0.25rem;--loomi-bg-item-radius:0.125rem",
  medium: "--loomi-bg-radius:0.5rem;--loomi-bg-item-radius:0.375rem",
  full: "--loomi-bg-radius:9999px;--loomi-bg-item-radius:9999px",
};

/**
 * `<loomi-button-group-item>` — a single button within a `<loomi-button-group>`.
 *
 * Set `label` for button text, `icon` for a built-in icon name, `icon-right` to place
 * the icon after the label, `icon-only` to visually hide the label, `selected` to mark
 * this item as active, and `disabled` to disable just this item. The `value` attribute
 * is surfaced in the `button-group-change` event emitted by the parent.
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

  /** Visually hide the label and render this item as a square icon button. */
  @property({ type: Boolean, attribute: "icon-only", reflect: true }) iconOnly = false;

  /** Accessible label for icon-only buttons. Falls back to label, slot text, or value. */
  @property({ attribute: "aria-label" }) accessibilityLabel = "";

  /** Mark this item as the selected / active item. */
  @property({ type: Boolean, reflect: true }) selected = false;

  /** Disable this individual item. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Value surfaced in the `button-group-change` event. Falls back to `label`. */
  @property() value = "";

  private get parentGroupState(): { disabled: boolean; iconOnly: boolean } {
    const parent = this.parentElement as (HTMLElement & { disabled?: boolean; iconOnly?: boolean }) | null;
    if (parent?.localName !== "loomi-button-group") {
      return { disabled: false, iconOnly: false };
    }
    return {
      disabled: Boolean(parent.disabled),
      iconOnly: Boolean(parent.iconOnly),
    };
  }

  private get labelText(): string {
    return this.label || this.textContent?.trim() || "";
  }

  private get accessibleText(): string | undefined {
    return this.accessibilityLabel || this.labelText || this.value || undefined;
  }

  private handleClick(): void {
    if (this.disabled || this.parentGroupState.disabled) return;
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
    const inheritedState = this.parentGroupState;
    const disabled = this.disabled || inheritedState.disabled;
    const iconOnly = this.iconOnly || inheritedState.iconOnly || (!this.labelText && Boolean(this.icon));
    const cls = ["loomi-bg-btn", this.selected ? "selected" : ""].filter(Boolean).join(" ");

    return html`
      <button
        class=${cls}
        type="button"
        ?disabled=${disabled}
        aria-pressed=${this.selected ? "true" : "false"}
        aria-label=${ifDefined(iconOnly ? this.accessibleText : undefined)}
        @click=${this.handleClick}
      >
        ${leading}
        <span class="loomi-bg-label" ?hidden=${iconOnly}><slot>${this.label}</slot></span>
        ${trailing}
      </button>
    `;
  }
}

/**
 * `<loomi-button-group>` — a shrink-wrapped segmented row of toggle buttons.
 *
 * Place `<loomi-button-group-item>` elements as children. The group uses the same
 * tinted track, inner gap, selected surface, accent text, and selected shadow as
 * `<loomi-tabs tab-style="system">`, but the bar is `inline-flex` so it ends with the
 * last button instead of stretching across the parent.
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

  /** Render as an outline-only segmented control with no filled track or active fill. */
  @property({ type: Boolean, reflect: true }) outline = false;

  /** Visually hide labels for every item and render the buttons as square icon buttons. */
  @property({ type: Boolean, attribute: "icon-only", reflect: true }) iconOnly = false;

  /** Accessible label for the internal `role="group"` wrapper. */
  @property({ attribute: "aria-label" }) accessibilityLabel = "";

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

    return `${accentVars(this.color)};${sizeVars};${radiusVars}`;
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

  override updated(changed: PropertyValues<this>): void {
    if (changed.has("disabled") || changed.has("iconOnly")) {
      for (const item of this.items) item.requestUpdate();
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
        aria-label=${ifDefined(this.accessibilityLabel || undefined)}
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
