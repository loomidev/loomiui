import { html, svg, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import {
  LoomiElement,
  loomiStyles,
  loomiT,
  accentVars,
  type LoomiColor,
  resolveLoomiSize,
  type LoomiSize,
  type LoomiSizeSupport,
} from "@loomidev/core";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiSpinnerType = "simple" | "spinner" | "dot" | "typing";

const TYPE_ALIASES: Record<string, LoomiSpinnerType> = {
  simple: "simple",
  spinner: "spinner",
  dot: "dot",
  typing: "typing",
  "line-simple": "simple",
  "line-spinner": "spinner",
  "dot-circle": "dot",
};

/** The part of the canonical size scale a spinner supports. */
const SPINNER_SIZES = [
  "regular",
  "medium",
  "big",
  "huge",
  "omg",
] as const satisfies readonly LoomiSize[];

/**
 * `<loomi-spinner>` — a themeable loading spinner.
 */
@customElement("loomi-spinner")
export class LoomiSpinner extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  /** Size names this component supports, from the canonical `LoomiSize` scale. */
  static readonly supportedSizes = { size: SPINNER_SIZES } satisfies LoomiSizeSupport;

  /** Indicator size: `regular` | `medium` | `big` | `huge` | `omg`. */
  @property() size: LoomiSize = "regular";
  @property() type: LoomiSpinnerType = "simple";
  @property() color: LoomiColor = "gray" as LoomiColor;
  @property() label = "";
  @property() locale = "";

  private get normalizedType(): LoomiSpinnerType {
    return TYPE_ALIASES[this.type] ?? "simple";
  }

  override render(): TemplateResult {
    const label = this.label || loomiT("common.loading", {}, this.locale);
    return html`<span
      class="loomi-spinner-wrap size-${resolveLoomiSize(this.size, SPINNER_SIZES)}"
      style=${accentVars(this.color)}
      role="status"
      aria-label=${label}
    >
      ${this.renderIndicator()}
      ${this.label ? html`<span class="loomi-spinner-label">${this.label}</span>` : null}
    </span>`;
  }

  private renderIndicator(): TemplateResult {
    switch (this.normalizedType) {
      case "spinner":
        return html`<svg class="loomi-spinner loomi-spinner-lines" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          ${Array.from({ length: 8 }, (_, index) => {
            const rotation = index * 45;
            const opacity = 0.22 + index * 0.09;
            // Nested fragments inserted into an existing <svg> must use the `svg` tag
            // function — `html` parses them outside any SVG context, so the browser
            // creates them in the HTML namespace and silently drops them.
            return svg`<line
              x1="12"
              y1="3"
              x2="12"
              y2="6"
              stroke="currentColor"
              stroke-width="2.4"
              stroke-linecap="round"
              opacity=${opacity}
              transform="rotate(${rotation} 12 12)"
            ></line>`;
          })}
        </svg>`;
      case "dot":
        return html`<svg class="loomi-spinner loomi-spinner-dots" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          ${Array.from({ length: 8 }, (_, index) => {
            const rotation = index * 45;
            const opacity = 0.2 + index * 0.1;
            return svg`<circle
              cx="12"
              cy="4"
              r="1.7"
              fill="currentColor"
              opacity=${opacity}
              transform="rotate(${rotation} 12 12)"
            ></circle>`;
          })}
        </svg>`;
      case "typing":
        return html`<span class="loomi-spinner-typing" aria-hidden="true"><span></span><span></span><span></span></span>`;
      case "simple":
      default:
        return html`<svg class="loomi-spinner loomi-spinner-simple" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="3"></circle>
          <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="3" stroke-linecap="round"></path>
        </svg>`;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-spinner": LoomiSpinner;
  }
}
