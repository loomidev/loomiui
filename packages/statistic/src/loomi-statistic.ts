import { html, nothing, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LoomiElement, loomiStyles, loomiT } from "@loomidev/core";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiStatRadius = "none" | "small" | "medium" | "large" | "xl";

/**
 * `<loomi-statistic>` — a dashboard stat showing a `number` and `label`, with optional
 * currency, icon (slot) and loading spinner.
 *
 * @slot icon - Leading (or trailing) icon/illustration.
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
  @property({ type: Boolean, attribute: "has-shadow" }) hasShadow = true;
  @property({ type: Boolean, attribute: "has-border" }) hasBorder = true;
  @property({ type: Boolean, attribute: "show-spinner" }) showSpinner = false;
  @property() radius: LoomiStatRadius = "small";
  @property() url = "";
  @property({ attribute: "icon-color" }) iconColor = "";
  @property({ attribute: "icon-size" }) iconSize = "";

  private get hasIcon(): boolean {
    return !!this.querySelector('[slot="icon"]');
  }

  override render(): TemplateResult {
    const cls = [
      "loomi-stat",
      `r-${this.radius}`,
      this.hasShadow ? "shadow" : "",
      this.hasBorder ? "bordered" : "",
      this.iconPosition === "right" ? "icon-right" : "",
      this.url ? "clickable" : "",
    ].join(" ");
    const iconStyle = [
      this.iconColor ? `--loomi-stat-icon-color:${this.iconColor}` : "",
      this.iconSize ? `--loomi-stat-icon-size:${this.iconSize}` : "",
    ].filter(Boolean).join(";");
    return html`
      <div
        class=${cls}
        role=${this.url ? "link" : nothing}
        tabindex=${this.url ? "0" : nothing}
        @click=${this.url ? () => (location.href = this.url) : nothing}
      >
        ${this.hasIcon ? html`<div class="loomi-ico" part="icon" style=${iconStyle}><slot name="icon"></slot></div>` : null}
        <div class="loomi-body ${this.labelPosition}">
          <div class="loomi-label">${this.label}</div>
          ${this.showSpinner
            ? html`<svg class="loomi-spinner" viewBox="0 0 24 24" fill="none" aria-label=${loomiT("common.loading", {}, this.locale)}><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="3" opacity="0.25"></circle><path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="3" stroke-linecap="round"></path></svg>`
            : html`<div class="loomi-number ${this.currency && this.currencyPosition === "right" ? "currency-right" : ""}">
                ${this.currency ? html`<span class="loomi-currency">${this.currency}</span>` : null}
                <span>${this.number}</span>
              </div>`}
        </div>
      </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-statistic": LoomiStatistic;
  }
}
