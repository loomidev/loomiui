import { html, nothing, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LoomiElement, loomiStyles } from "@loomidev/core";
import { getLoomiIcon } from "@loomidev/icons";
import "@loomidev/card/loomi-card.js";
import { componentStyles } from "./generated/styles.css.js";

function icon(name: string): TemplateResult {
  return html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">${getLoomiIcon(name)}</svg>`;
}

/**
 * `<loomi-contact-card>` — a ready-made card for displaying a contact.
 * @slot - Extra content rendered below the contact details.
 */
@customElement("loomi-contact-card")
export class LoomiContactCard extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property() name = "";
  @property() position = "";
  @property() department = "";
  @property() image = "";
  @property() email = "";
  @property() mobile = "";
  @property() birthday = "";
  @property({ type: Boolean, attribute: "has-shadow" }) hasShadow = true;
  @property({ type: Boolean, attribute: "has-hover" }) hasHover = false;
  @property({ type: Boolean }) centered = false;
  @property({ type: Boolean, attribute: "no-padding" }) noPadding = false;
  @property() url = "";

  private initials(): string {
    return this.name
      .split(/\s+/)
      .map((w) => w[0])
      .slice(0, 2)
      .join("");
  }

  private onClick = (): void => {
    if (!this.url) return;
    if (/^https?:\/\//.test(this.url)) window.open(this.url, "_blank");
    else if (/\)$/.test(this.url)) new Function(this.url)();
    else location.href = this.url;
  };

  override render(): TemplateResult {
    const cls = [
      "loomi-cc",
      this.hasShadow ? "shadow" : "",
      this.hasHover ? "hover" : "",
      this.centered ? "centered" : "",
      this.noPadding ? "flush" : "",
      this.url ? "clickable" : "",
    ].join(" ");
    return html`<loomi-card size="sm" .url=${this.url} ?has-hover=${this.hasHover}>
      <loomi-card-content>
        <div class=${cls} @click=${this.url ? this.onClick : nothing}>
          ${
            this.image
              ? html`<img class="loomi-avatar" src=${this.image} alt=${this.name} />`
              : html`<span class="loomi-avatar">${this.initials()}</span>`
          }
          <div class="loomi-body">
            <div class="loomi-name">${this.name}</div>
            ${
              this.position || this.department
                ? html`<div class="loomi-position">${[this.position, this.department].filter(Boolean).join(" · ")}</div>`
                : nothing
            }
            ${this.email ? html`<div class="loomi-row">${icon("envelope")}<a href="mailto:${this.email}">${this.email}</a></div>` : nothing}
            ${this.mobile ? html`<div class="loomi-row">${icon("phone")}<a href="tel:${this.mobile}">${this.mobile}</a></div>` : nothing}
            ${this.birthday ? html`<div class="loomi-row">${icon("cake")}<span>${this.birthday}</span></div>` : nothing}
            <slot></slot>
          </div>
        </div>
      </loomi-card-content>
    </loomi-card>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-contact-card": LoomiContactCard;
  }
}
