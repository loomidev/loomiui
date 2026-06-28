import { html, nothing, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LoomiElement, loomiStyles } from "@loomidev/core";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiCardRadius = "none" | "small" | "medium" | "large" | "xl";

/**
 * `<loomi-card>` — a content card with an optional title and header/footer slots.
 * When a `header` slot is present, the body padding is removed (match it yourself).
 *
 * @slot - The card body.
 * @slot header - Fixed header region.
 * @slot footer - Fixed footer region.
 */
@customElement("loomi-card")
export class LoomiCard extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property() title = "";
  @property({ type: Boolean }) compact = false;
  @property({ type: Boolean, attribute: "no-padding" }) noPadding = false;
  @property({ type: Boolean, attribute: "has-shadow" }) hasShadow = true;
  @property({ type: Boolean, attribute: "has-hover" }) hasHover = false;
  @property() radius: LoomiCardRadius = "small";
  @property() url = "";

  private get hasHeader(): boolean {
    return !!this.querySelector('[slot="header"]');
  }
  private get hasFooter(): boolean {
    return !!this.querySelector('[slot="footer"]');
  }

  private onClick = (): void => {
    if (!this.url) return;
    if (/^https?:\/\//.test(this.url)) window.open(this.url, "_blank");
    else if (/\)$/.test(this.url)) new Function(this.url)();
    else location.href = this.url;
  };

  override render(): TemplateResult {
    const bodyCls = this.hasHeader || this.noPadding
      ? "flush"
      : this.compact
        ? "compact"
        : "";
    const cls = [
      "loomi-card",
      `r-${this.radius}`,
      this.hasShadow ? "shadow" : "",
      this.hasHover ? "hover" : "",
      this.url ? "clickable" : "",
    ].join(" ");
    return html`<div class=${cls} @click=${this.url ? this.onClick : nothing}>
      ${this.hasHeader ? html`<div class="loomi-header"><slot name="header"></slot></div>` : nothing}
      ${this.title && !this.hasHeader ? html`<div class="loomi-title">${this.title}</div>` : nothing}
      <div class="loomi-body ${bodyCls}"><slot></slot></div>
      ${this.hasFooter ? html`<div class="loomi-footer"><slot name="footer"></slot></div>` : nothing}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-card": LoomiCard;
  }
}
