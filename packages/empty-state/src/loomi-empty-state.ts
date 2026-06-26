import { html, nothing, svg, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LoomiElement, loomiStyles } from "@loomi/core";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiEmptyImageSize = "small" | "medium" | "large" | "xl" | "omg";

const DEFAULT_ART = svg`<svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <rect x="18" y="28" width="84" height="56" rx="6" stroke="currentColor" stroke-width="3" />
  <path d="M18 44h84" stroke="currentColor" stroke-width="3" />
  <circle cx="27" cy="36" r="2.2" fill="currentColor" />
  <circle cx="35" cy="36" r="2.2" fill="currentColor" />
  <path d="M40 60h40M40 70h26" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
</svg>`;

/**
 * `<loomi-empty-state>` — a friendly placeholder for empty content with an optional
 * heading, message and action button.
 *
 * @slot - Custom content (used when `show-image="false"`).
 * @fires action - Fired when the action button is clicked.
 */
@customElement("loomi-empty-state")
export class LoomiEmptyState extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property() heading = "";
  @property() message = "";
  @property({ attribute: "button-label" }) buttonLabel = "";
  @property({ type: Boolean, attribute: "show-image" }) showImage = true;
  @property() image = "";
  @property({ attribute: "image-size" }) imageSize: LoomiEmptyImageSize = "medium";

  override render(): TemplateResult {
    if (!this.showImage) {
      return html`<div class="loomi-empty"><slot></slot></div>`;
    }
    return html`<div class="loomi-empty">
      <div class="loomi-img size-${this.imageSize}">
        ${this.image ? html`<img src=${this.image} alt="" />` : DEFAULT_ART}
      </div>
      ${this.heading ? html`<div class="loomi-heading">${this.heading}</div>` : nothing}
      ${this.message ? html`<div class="loomi-message">${this.message}</div>` : nothing}
      ${this.buttonLabel
        ? html`<button class="loomi-btn" @click=${() => this.dispatchEvent(new Event("action", { bubbles: true, composed: true }))}>${this.buttonLabel}</button>`
        : nothing}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-empty-state": LoomiEmptyState;
  }
}
