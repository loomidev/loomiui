import { html, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  LoomiElement,
  loomiStyles,
  resolveLoomiSize,
  type LoomiSize,
  type LoomiSizeSupport,
} from "@loomidev/core";
import { componentStyles } from "./generated/styles.css.js";
import { DEFAULT_IMAGE } from "./generated/default-image.js";

/** The part of the canonical size scale the illustration supports. */
const EMPTY_IMAGE_SIZES = [
  "small",
  "regular",
  "big",
  "huge",
  "omg",
] as const satisfies readonly LoomiSize[];

/**
 * `<loomi-empty-state>` — a friendly placeholder for empty content with an optional
 * heading, message and action button.
 *
 * @slot - With `show-image="false"`, replaces the whole layout. Otherwise it is rendered
 *   in the actions row, after the built-in button: extra actions or links go here.
 * @fires action - Fired when the action button is clicked (not when `button-href` makes it a link).
 */
@customElement("loomi-empty-state")
export class LoomiEmptyState extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  /** Size names this component supports, from the canonical `LoomiSize` scale. */
  static readonly supportedSizes = { imageSize: EMPTY_IMAGE_SIZES } satisfies LoomiSizeSupport;

  @property() heading = "";
  @property() message = "";
  @property({ attribute: "button-label" }) buttonLabel = "";
  /** Render the action as a link to this URL instead of a button that fires `action`. */
  @property({ attribute: "button-href" }) buttonHref = "";
  /** Link target for `button-href`. */
  @property({ attribute: "button-target" }) buttonTarget = "";
  @property({ type: Boolean, attribute: "show-image" }) showImage = true;
  @property() image = "";
  /** Illustration width: `small` | `regular` | `big` | `huge` | `omg`. */
  @property({ attribute: "image-size" }) imageSize: LoomiSize = "regular";

  @state() private hasSlotted = false;

  private onSlotChange = (e: Event): void => {
    const slot = e.target as HTMLSlotElement;
    this.hasSlotted = slot
      .assignedNodes({ flatten: true })
      .some((n) => n.nodeType === Node.ELEMENT_NODE || !!n.textContent?.trim());
  };

  private renderButton(): TemplateResult | typeof nothing {
    if (!this.buttonLabel) return nothing;
    if (this.buttonHref) {
      return html`<a
        class="loomi-btn"
        part="button"
        href=${this.buttonHref}
        target=${this.buttonTarget || nothing}
        rel=${this.buttonTarget === "_blank" ? "noopener noreferrer" : nothing}
      >${this.buttonLabel}</a>`;
    }
    return html`<button class="loomi-btn" part="button" type="button" @click=${() => this.dispatchEvent(new Event("action", { bubbles: true, composed: true }))}>${this.buttonLabel}</button>`;
  }

  override render(): TemplateResult {
    const headingId = this.heading ? "loomi-empty-heading" : undefined;

    if (!this.showImage) {
      return html`<div class="loomi-empty" role="status" aria-live="polite">
        <slot></slot>
      </div>`;
    }

    return html`<div class="loomi-empty" role="status" aria-live="polite" aria-labelledby=${headingId ?? nothing}>
      <div class="loomi-img size-${resolveLoomiSize(this.imageSize, EMPTY_IMAGE_SIZES)}" aria-hidden="true">
        <img src=${this.image || DEFAULT_IMAGE} alt="" />
      </div>
      ${this.heading ? html`<div class="loomi-heading" id="loomi-empty-heading">${this.heading}</div>` : nothing}
      ${this.message ? html`<div class="loomi-message">${this.message}</div>` : nothing}
      <div class="loomi-actions" part="actions" ?hidden=${!this.buttonLabel && !this.hasSlotted}>
        ${this.renderButton()}
        <slot @slotchange=${this.onSlotChange}></slot>
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-empty-state": LoomiEmptyState;
  }
}
