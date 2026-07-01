import { html, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LoomiElement, loomiStyles, loomiT, accentVars, type LoomiColor } from "@loomidev/core";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiSpinnerType = "line-simple" | "line-spinner" | "dot-circle";
export type LoomiSpinnerSize = "sm" | "md" | "lg" | "small" | "medium" | "big" | "xl" | "omg";

type NormalizedSpinnerSize = "small" | "medium" | "big" | "xl" | "omg";

const SIZE_ALIASES: Record<LoomiSpinnerSize, NormalizedSpinnerSize> = {
  sm: "small",
  md: "medium",
  lg: "big",
  small: "small",
  medium: "medium",
  big: "big",
  xl: "xl",
  omg: "omg",
};

/**
 * `<loomi-spinner>` — a themeable loading spinner.
 */
@customElement("loomi-spinner")
export class LoomiSpinner extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property() size: LoomiSpinnerSize = "small";
  @property() type: LoomiSpinnerType = "line-simple";
  @property() color: LoomiColor = "gray" as LoomiColor;
  @property() label = "";
  @property() locale = "";

  private get normalizedSize(): NormalizedSpinnerSize {
    return SIZE_ALIASES[this.size] ?? "small";
  }

  override render(): TemplateResult {
    const label = this.label || loomiT("common.loading", {}, this.locale);
    return html`<span
      class="loomi-spinner-wrap size-${this.normalizedSize}"
      style=${accentVars(this.color)}
      role="status"
      aria-label=${label}
    >
      ${this.renderIndicator()}
      ${this.label ? html`<span class="loomi-spinner-label">${this.label}</span>` : null}
    </span>`;
  }

  private renderIndicator(): TemplateResult {
    switch (this.type) {
      case "line-spinner":
        return html`<svg class="loomi-spinner loomi-spinner-lines" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          ${Array.from({ length: 8 }, (_, index) => {
            const rotation = index * 45;
            const opacity = 0.22 + index * 0.09;
            return html`<line
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
      case "dot-circle":
        return html`<svg class="loomi-spinner loomi-spinner-dots" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          ${Array.from({ length: 8 }, (_, index) => {
            const rotation = index * 45;
            const opacity = 0.2 + index * 0.1;
            return html`<circle
              cx="12"
              cy="4"
              r="1.7"
              fill="currentColor"
              opacity=${opacity}
              transform="rotate(${rotation} 12 12)"
            ></circle>`;
          })}
        </svg>`;
      case "line-simple":
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
