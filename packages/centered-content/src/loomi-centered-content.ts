import { html, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LoomiElement, loomiStyles } from "@loomidev/core";
import { componentStyles } from "./generated/styles.css.js";

/**
 * `<loomi-centered-content>` — vertically and horizontally centers its content. Handy for
 * sign-in screens, empty pages and hero sections.
 *
 * @slot - The content to center.
 */
@customElement("loomi-centered-content")
export class LoomiCenteredContent extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  /** Minimum height of the centering area (any CSS length). */
  @property({ attribute: "min-height" }) minHeight = "";
  /** Maximum width of the inner content (any CSS length). */
  @property({ attribute: "max-width" }) maxWidth = "";

  override render(): TemplateResult {
    if (this.minHeight) this.style.setProperty("--loomi-center-min", this.minHeight);
    if (this.maxWidth) this.style.setProperty("--loomi-center-max", this.maxWidth);
    return html`<div class="loomi-center"><div class="loomi-inner"><slot></slot></div></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-centered-content": LoomiCenteredContent;
  }
}
