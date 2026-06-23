import { LitElement, html, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { loomiStyles, accentVars, type LoomiColor } from "@loomi/core";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiSpinnerSize = "small" | "medium" | "big" | "xl" | "omg";

/**
 * `<loomi-spinner>` — a themeable loading spinner.
 */
@customElement("loomi-spinner")
export class LoomiSpinner extends LitElement {
  static override styles = loomiStyles(componentStyles);

  @property() size: LoomiSpinnerSize = "small";
  @property() color: LoomiColor = "gray" as LoomiColor;

  override render(): TemplateResult {
    return html`<svg
      class="loomi-spinner size-${this.size}"
      style=${accentVars(this.color)}
      viewBox="0 0 24 24"
      fill="none"
      role="status"
      aria-label="Loading"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="3"></circle>
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="3" stroke-linecap="round"></path>
    </svg>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-spinner": LoomiSpinner;
  }
}
