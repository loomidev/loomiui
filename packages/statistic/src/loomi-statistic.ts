import { html, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { LoomiElement, loomiStyles, loomiT, watchDarkMode } from "@loomidev/core";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiStatRadius = "none" | "small" | "medium" | "large" | "xl";

/**
 * Lit's default `type: Boolean` converter treats ANY attribute presence — including the
 * literal string `"false"` — as `true` (`fromAttribute: (v) => v !== null`), so
 * `has-shadow="false"` written as plain HTML markup would silently do nothing. This
 * converter honors a literal `"false"` while keeping the usual presence-based
 * `toAttribute` semantics for default-true boolean properties.
 */
const booleanAttribute = {
  fromAttribute(value: string | null): boolean {
    return value !== null && value !== "false";
  },
  toAttribute(value: boolean): string | null {
    return value ? "" : null;
  },
};

/**
 * `<loomi-statistic>` — a dashboard stat showing a `number` and `label`, with optional
 * currency, icon (slot) and loading spinner.
 *
 * @slot icon - Leading (or trailing) icon/illustration.
 * @slot description - Secondary line under the number (e.g. a trend arrow). Wins over the
 *   `description` attribute when both are set. Hidden while `show-spinner` is on.
 * @csspart description - The secondary line under the number.
 */
@customElement("loomi-statistic")
export class LoomiStatistic extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property() label = "";
  @property() locale = "";
  @property() number = "";
  @property({ attribute: "label-position" }) labelPosition: "top" | "bottom" = "top";
  @property() currency = "";
  @property({ attribute: "currency-position" }) currencyPosition: "left" | "right" = "left";
  @property({ attribute: "icon-position" }) iconPosition: "left" | "right" = "left";
  @property({ type: Boolean, attribute: "has-shadow", converter: booleanAttribute }) hasShadow =
    true;
  @property({ type: Boolean, attribute: "has-border", converter: booleanAttribute }) hasBorder =
    true;
  @property({ type: Boolean, attribute: "show-spinner" }) showSpinner = false;
  @property() radius: LoomiStatRadius = "medium";
  @property() url = "";
  @property({ attribute: "icon-color" }) iconColor = "";
  @property({ attribute: "icon-size" }) iconSize = "";
  /** CSS colour for a circle behind the icon (e.g. a light tint of `icon-color`). */
  @property({ attribute: "icon-background" }) iconBackground = "";
  /** Plain-text secondary line under the number. The `description` slot wins over it. */
  @property() description = "";

  /** Whether an ancestor has the `dark` class — see `isDarkContext` in `loomi-button.ts`. */
  @state() private isDarkContext = false;
  /** Whether markup is assigned to the `description` slot (tracked via slotchange). */
  @state() private hasSlottedDescription = false;
  /**
   * Whether the `icon` slot has content; `undefined` until measured (SSR / first render),
   * where the stylesheet's `:has()` rule is the fallback. Chromium doesn't match
   * `:host(:has(...))`, so this class is what actually collapses the wrapper there.
   */
  @state() private hasIcon?: boolean;
  private cleanupDarkWatch?: () => void;

  override connectedCallback(): void {
    super.connectedCallback();
    this.cleanupDarkWatch = watchDarkMode((isDark) => {
      this.isDarkContext = isDark;
    });
  }
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.cleanupDarkWatch?.();
  }

  override firstUpdated(): void {
    this.hasIcon = !!this.querySelector(':scope > [slot="icon"]');
  }

  private onIconSlotChange(e: Event): void {
    this.hasIcon = (e.target as HTMLSlotElement).assignedNodes().length > 0;
  }

  private onDescriptionSlotChange(e: Event): void {
    this.hasSlottedDescription =
      (e.target as HTMLSlotElement).assignedNodes({ flatten: false }).length > 0;
  }

  override render(): TemplateResult {
    const cls = [
      "loomi-stat",
      `r-${this.radius}`,
      this.hasShadow ? "shadow" : "",
      this.hasBorder ? "bordered" : "",
      this.iconPosition === "right" ? "icon-right" : "",
      this.url ? "clickable" : "",
      this.isDarkContext ? "is-dark" : "",
    ].join(" ");
    const iconStyle = [
      this.iconColor ? `--loomi-stat-icon-color:${this.iconColor}` : "",
      this.iconSize ? `--loomi-stat-icon-size:${this.iconSize}` : "",
      this.iconBackground ? `--loomi-stat-icon-bg:${this.iconBackground}` : "",
    ]
      .filter(Boolean)
      .join(";");
    return html`
      <div
        class=${cls}
        role=${this.url ? "link" : nothing}
        tabindex=${this.url ? "0" : nothing}
        @click=${this.url ? () => (location.href = this.url) : nothing}
      >
        <div class="loomi-ico ${this.iconBackground ? "tinted" : ""} ${this.hasIcon === false ? "empty" : ""}" part="icon" style=${iconStyle}><slot name="icon" @slotchange=${this.onIconSlotChange}></slot></div>
        <div class="loomi-body ${this.labelPosition}">
          <div class="loomi-label">${this.label}</div>
          ${
            this.showSpinner
              ? html`<svg class="loomi-spinner" viewBox="0 0 24 24" fill="none" aria-label=${loomiT("common.loading", {}, this.locale)}><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="3" opacity="0.25"></circle><path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="3" stroke-linecap="round"></path></svg>`
              : html`<div class="loomi-number ${this.currency && this.currencyPosition === "right" ? "currency-right" : ""}">
                ${this.currency ? html`<span class="loomi-currency">${this.currency}</span>` : null}
                <span>${this.number}</span>
              </div>`
          }
          ${
            /* Hidden while loading: the context line describes a value that isn't there yet.
               The slot's fallback is the attribute text, so slotted markup wins naturally. */
            this.showSpinner
              ? nothing
              : html`<div class="loomi-desc ${this.description || this.hasSlottedDescription ? "" : "empty"}" part="description"><slot name="description" @slotchange=${this.onDescriptionSlotChange}>${this.description}</slot></div>`
          }
        </div>
      </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-statistic": LoomiStatistic;
  }
}
