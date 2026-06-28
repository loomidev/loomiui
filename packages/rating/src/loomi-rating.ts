import { html, svg, type TemplateResult, type SVGTemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { LoomiElement, loomiStyles, loomiT, accentVars, type LoomiColor } from "@loomidev/core";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiRatingType = "star" | "heart" | "thumbsup";
export type LoomiRatingSize = "small" | "medium" | "big";

const SHAPES: Record<LoomiRatingType, SVGTemplateResult> = {
  star: svg`<path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />`,
  heart: svg`<path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />`,
  thumbsup: svg`<path d="M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 1 2.86-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V3a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23h-.777ZM2.331 10.977a11.969 11.969 0 0 0-.831 4.398 12 12 0 0 0 .52 3.507C2.28 19.482 3.105 20 3.994 20H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 0 1-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.477Z" />`,
};

/**
 * `<loomi-rating>` — a 0–5 rating control as stars, hearts or thumbs-up.
 * Form-associated: submits the rating under `name`.
 *
 * @fires change - `detail: { rating }` when a new rating is chosen.
 */
@customElement("loomi-rating")
export class LoomiRating extends LoomiElement {
  static override styles = loomiStyles(componentStyles);
  static formAssociated = true;
  private internals = this.attachInternals();

  @property({ reflect: true }) name = "";
  @property() type: LoomiRatingType = "star";
  @property() color: LoomiColor = "orange" as LoomiColor;
  @property() size: LoomiRatingSize = "small";
  @property({ type: Number }) rating = 0;
  @property({ type: Boolean }) clickable = true;
  @property() locale = "";

  @state() private hover = 0;

  override willUpdate(): void {
    this.internals.setFormValue(String(this.rating));
  }

  private pick(n: number): void {
    if (!this.clickable) return;
    this.rating = n;
    this.dispatchEvent(new CustomEvent("change", { bubbles: true, composed: true, detail: { rating: n } }));
  }

  override render(): TemplateResult {
    const shape = SHAPES[this.type];
    const active = this.hover || this.rating;
    return html`<div
      class="loomi-rating size-${this.size} ${this.clickable ? "" : "readonly"}"
      style=${accentVars(this.color)}
      role="radiogroup"
      aria-label=${loomiT("rating.label", {}, this.locale)}
      @mouseleave=${() => (this.hover = 0)}
    >
      ${[1, 2, 3, 4, 5].map(
        (n) => html`<button
          class="loomi-star ${n <= active ? "on" : ""}"
          role="radio"
          aria-checked=${n === this.rating ? "true" : "false"}
          aria-label=${loomiT("rating.valueLabel", { value: n, max: 5 }, this.locale)}
          @mouseenter=${() => this.clickable && (this.hover = n)}
          @click=${() => this.pick(n)}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${shape}</svg>
        </button>`,
      )}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-rating": LoomiRating;
  }
}
