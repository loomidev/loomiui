import { html, nothing, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { LoomiElement, loomiStyles } from "@loomidev/core";
import { getLoomiIcon } from "./icons.js";
import { buttonStyles } from "./generated/styles.css.js";

export type LoomiButtonType = "primary" | "secondary";
export type LoomiButtonSize = "tiny" | "small" | "regular" | "medium" | "big";
export type LoomiButtonRadius = "none" | "small" | "medium" | "full";
export type LoomiButtonTag = "button" | "a";

/** Closed palette for buttons: brand primary/secondary, plus semantic state colors. */
const BUTTON_COLORS = ["primary", "secondary", "success", "error", "warning"] as const;
export type LoomiButtonColor = (typeof BUTTON_COLORS)[number];

function isLoomiButtonColor(value: unknown): value is LoomiButtonColor {
  return (
    typeof value === "string" &&
    (BUTTON_COLORS as readonly string[]).includes(value)
  );
}

/** Padding + font-size per size. Literal strings so Tailwind's scanner picks them up. */
const SIZE: Record<LoomiButtonSize, string> = {
  tiny: "px-2.5 py-1 text-xs",
  small: "px-3 py-1.5 text-sm",
  regular: "px-4 py-2 text-sm",
  medium: "px-5 py-2.5 text-base",
  big: "px-6 py-3 text-lg",
};

const RADIUS: Record<LoomiButtonRadius, string> = {
  none: "rounded-none",
  small: "rounded",
  medium: "rounded-lg",
  full: "rounded-full",
};

const BORDER_WIDTH: Record<number, string> = {
  2: "border-2",
};

/**
 * `<loomi-button>` — a themeable button web component.
 *
 * Structural variant (`type`) and palette (`color`) are independent, and styling is
 * composed from orthogonal attributes (`size`, `radius`, `outline`, `border-width`).
 * Colors resolve through `--loomi-*` custom properties, so the whole theme can be
 * re-skinned from the host page with no rebuild.
 *
 * @slot - Default slot: the button label.
 * @slot prefix - Content rendered before the icon/label.
 * @slot suffix - Content rendered after the label.
 * @csspart button - The underlying `<button>`/`<a>` element.
 * @fires click - Native click event (composed; crosses the shadow boundary).
 */
@customElement("loomi-button")
export class LoomiButton extends LoomiElement {
  static override styles = loomiStyles(buttonStyles);

  /** Structural variant: `primary` is a solid fill; `secondary` is a bordered ghost. `color` overrides the hue. */
  @property({ reflect: true }) type: LoomiButtonType = "primary";

  /** Palette override. Empty = derive from `type`. `primary` | `secondary` | `success` | `error` | `warning`. */
  @property() color: LoomiButtonColor | "" = "";

  /** Size preset. */
  @property({ reflect: true }) size: LoomiButtonSize = "regular";

  /** Corner radius preset. */
  @property({ reflect: true }) radius: LoomiButtonRadius = "medium";

  /** Render as an outline (no fill, colored border + text). */
  @property({ type: Boolean }) outline = false;

  /** Outline border width: 2, 4 or 8. Only applies when `outline` is set. */
  @property({ type: Number, attribute: "border-width" }) borderWidth = 2;

  /** Name of a built-in icon (see the icon registry), or one you registered. */
  @property() icon = "";

  /** Position the icon after the label instead of before it. */
  @property({ type: Boolean, attribute: "icon-right" }) iconRight = false;

  /** Include a spinner (hidden until `show-spinner`). */
  @property({ type: Boolean, attribute: "has-spinner" }) hasSpinner = false;

  /** Show the spinner. Only has effect when `has-spinner` is set. */
  @property({ type: Boolean, attribute: "show-spinner" }) showSpinner = false;

  /** Disable the button. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Render as `button` or as an `a` (link). */
  @property({ reflect: true }) tag: LoomiButtonTag = "button";

  /** href used for link rendering. If present, the component renders an anchor automatically. */
  @property() href = "";

  /** Render the `<button>` as `type="submit"` so it submits a form. */
  @property({ type: Boolean, attribute: "can-submit" }) canSubmit = false;

  /** Show the focus ring on keyboard focus. */
  @property({ type: Boolean, attribute: "show-focus-ring" }) showFocusRing = true;

  /** Uppercase the label. */
  @property({ type: Boolean }) uppercase = false;

  /** Optional name for targeting this button (reflected as an attribute). */
  @property({ reflect: true }) name = "";

  /** Make the spinner visible. No-op unless `has-spinner` is set. */
  startSpinner(): void {
    if (this.hasSpinner) this.showSpinner = true;
  }

  /** Hide the spinner. */
  stopSpinner(): void {
    this.showSpinner = false;
  }

  private get effectiveColor(): LoomiButtonColor {
    if (this.color && isLoomiButtonColor(this.color)) return this.color;
    return this.type === "secondary" ? "secondary" : "primary";
  }

  private get spinning(): boolean {
    return this.hasSpinner && this.showSpinner;
  }

  /** `type` only switches solid-fill vs. outline; `color` is the only thing that picks the hue. */
  private treatmentClasses(c: LoomiButtonColor): string[] {
    const w = BORDER_WIDTH[this.borderWidth] ?? BORDER_WIDTH[2];
    // Secondary is already a transparent, neutral-bordered ghost treatment (its palette
    // is literally the gray ramp — see palette.json), so outline is a no-op for it: both
    // reuse the same dark-mode-aware --loomi-surface-* tokens instead of secondary's own
    // (theme-static) palette shades.
    if (c === "secondary") {
      return [w, "border-solid", "loomi-btn--secondary"];
    }
    if (this.outline) {
      return ["bg-transparent", `text-${c}-600`, w, "border-solid", `loomi-btn--outline-${c}`];
    }
    return [`bg-${c}-600`, "text-white", `hover:bg-${c}-700`, "border", "border-transparent"];
  }

  private computeClasses(): string {
    const c = this.effectiveColor;
    const classes = [
      "loomi-btn",
      "inline-flex",
      "items-center",
      "justify-center",
      "gap-2",
      "font-medium",
      "leading-none",
      "whitespace-nowrap",
      "select-none",
      "transition-colors",
      "duration-150",
      "cursor-pointer",
      SIZE[this.size] ?? SIZE.regular,
      RADIUS[this.radius] ?? RADIUS.medium,
      ...this.treatmentClasses(c),
    ];

    if (this.uppercase) classes.push("uppercase", "tracking-wide");

    if (this.showFocusRing) {
      classes.push(
        "focus:outline-none",
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-offset-2",
        `focus-visible:ring-${c}-400`,
      );
    } else {
      classes.push("focus:outline-none", "focus-visible:outline-none");
    }

    return classes.join(" ");
  }

  private renderIcon(): TemplateResult | typeof nothing {
    if (!this.icon) return nothing;
    const path = getLoomiIcon(this.icon);
    if (!path) return nothing;
    return html`<svg
      class="loomi-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      aria-hidden="true"
    >
      ${path}
    </svg>`;
  }

  private renderSpinner(): TemplateResult {
    return html`<svg
      class="loomi-spinner"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="3"></circle>
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
      ></path>
    </svg>`;
  }

  private renderContent(): TemplateResult {
    // Spinner takes the leading slot; per BladewindUI, icon-right is ignored while spinning.
    const leading = this.spinning
      ? this.renderSpinner()
      : !this.iconRight
        ? this.renderIcon()
        : nothing;
    const trailing =
      !this.spinning && this.iconRight ? this.renderIcon() : nothing;

    return html`
      <slot name="prefix"></slot>
      ${leading}
      <span class="loomi-label"><slot></slot></span>
      ${trailing}
      <slot name="suffix"></slot>
    `;
  }

  private onClick = (event: Event): void => {
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  };

  override render(): TemplateResult {
    const cls = this.computeClasses();
    const content = this.renderContent();

    if (this.tag === "a" || this.href) {
      return html`<a
        class=${cls}
        part="button"
        href=${ifDefined(this.disabled ? undefined : this.href || undefined)}
        role="button"
        aria-disabled=${this.disabled ? "true" : "false"}
        tabindex=${this.disabled ? "-1" : "0"}
        @click=${this.onClick}
        >${content}</a
      >`;
    }

    return html`<button
      class=${cls}
      part="button"
      type=${this.canSubmit ? "submit" : "button"}
      ?disabled=${this.disabled}
      @click=${this.onClick}
    >
      ${content}
    </button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-button": LoomiButton;
  }
}
