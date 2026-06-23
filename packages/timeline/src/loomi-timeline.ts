import { LitElement, html, nothing, svg, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { loomiStyles, accentVars, type LoomiColor } from "@loomi/core";
import { getLoomiIcon } from "@loomi/icons";
import { componentStyles } from "./generated/styles.css.js";

const CHECK = svg`<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />`;

/**
 * `<loomi-timeline>` — a single timeline entry. Group inside `<loomi-timelines>`.
 *
 * @slot - Custom content (overrides the `content` attribute).
 * @slot content - Alias for the default slot.
 */
@customElement("loomi-timeline")
export class LoomiTimeline extends LitElement {
  static override styles = loomiStyles(componentStyles);

  @property() date = "";
  @property() content = "";
  @property({ type: Boolean }) completed = false;
  @property({ type: Boolean }) stacked = false;
  @property() anchor: "small" | "big" = "small";
  @property() icon = "";
  @property() avatar = "";
  @property({ type: Boolean, reflect: true }) last = false;
  @property() color: LoomiColor = "blue" as LoomiColor;

  private renderDot(): TemplateResult {
    const big = this.anchor === "big";
    let inner: unknown = nothing;
    if (big) {
      if (this.avatar) inner = html`<img src=${this.avatar} alt="" />`;
      else if (this.icon && getLoomiIcon(this.icon))
        inner = html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">${getLoomiIcon(this.icon)}</svg>`;
      else if (this.completed)
        inner = html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">${CHECK}</svg>`;
    }
    const iconColored = big && (this.icon || this.completed) && !this.avatar;
    return html`<span class="loomi-dot ${this.anchor} ${this.completed || iconColored ? "completed" : ""}">${inner}</span>`;
  }

  override render(): TemplateResult {
    const body = html`<div class="loomi-body">
      ${this.stacked && this.date ? html`<div class="loomi-date-top">${this.date}</div>` : nothing}
      <div class="loomi-content"><slot name="content"><slot>${this.content}</slot></slot></div>
    </div>`;
    return html`<div class="loomi-item" style=${accentVars(this.color)}>
      ${!this.stacked ? html`<div class="loomi-date-col">${this.date}</div>` : nothing}
      <div class="loomi-anchor">
        ${this.renderDot()}
        <div class="loomi-line"></div>
      </div>
      ${body}
    </div>`;
  }
}

/**
 * `<loomi-timelines>` — wraps `<loomi-timeline>` items and shares attributes with them.
 * @slot - `<loomi-timeline>` children.
 */
@customElement("loomi-timelines")
export class LoomiTimelines extends LitElement {
  static override styles = loomiStyles(componentStyles);

  @property({ type: Boolean }) stacked = false;
  @property({ type: Boolean }) completed = false;
  @property() anchor: "small" | "big" = "small";
  @property() icon = "";
  @property() position: "left" | "center" = "center";
  @property() color: LoomiColor = "blue" as LoomiColor;

  private sync = (): void => {
    const items = Array.from(this.querySelectorAll("loomi-timeline"));
    items.forEach((item, i) => {
      if (this.stacked) item.stacked = true;
      if (this.completed) item.completed = true;
      if (this.anchor === "big") item.anchor = "big";
      if (this.icon && !item.icon) item.icon = this.icon;
      if (this.color && item.color === ("blue" as LoomiColor)) item.color = this.color;
      if (i === items.length - 1) item.last = true;
    });
  };

  override firstUpdated(): void {
    this.sync();
  }

  override render(): TemplateResult {
    return html`<div class="loomi-timelines ${this.position}"><slot @slotchange=${this.sync}></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-timeline": LoomiTimeline;
    "loomi-timelines": LoomiTimelines;
  }
}
