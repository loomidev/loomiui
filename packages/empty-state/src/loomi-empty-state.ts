import { html, nothing, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LoomiElement, loomiStyles } from "@loomidev/core";
import { componentStyles } from "./generated/styles.css.js";
import { DEFAULT_IMAGE } from "./generated/default-image.js";

export type LoomiEmptyImageSize = "small" | "medium" | "large" | "xl" | "omg";

/**
 * `<loomi-empty-state>` — a friendly placeholder for empty content with an optional
 * heading, message and action button.
 *
 * @slot - Custom content (used when `show-image="false"`).
 * @fires loomi-action - Fired when the action button is clicked.
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
    const headingId = this.heading ? "loomi-empty-heading" : undefined;

    if (!this.showImage) {
      return html`<div class="loomi-empty" role="status" aria-live="polite">
        <slot></slot>
      </div>`;
    }

    return html`<div class="loomi-empty" role="status" aria-live="polite" aria-labelledby=${headingId ?? nothing}>
      <div class="loomi-img size-${this.imageSize}" aria-hidden="true">
        <img src=${this.image || DEFAULT_IMAGE} alt="" />
      </div>
      ${this.heading ? html`<div class="loomi-heading" id="loomi-empty-heading">${this.heading}</div>` : nothing}
      ${this.message ? html`<div class="loomi-message">${this.message}</div>` : nothing}
      ${this.buttonLabel
        ? html`<button class="loomi-btn" type="button" @click=${() => this.dispatchEvent(new Event("action", { bubbles: true, composed: true }))}>${this.buttonLabel}</button>`
        : nothing}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-empty-state": LoomiEmptyState;
  }
}
