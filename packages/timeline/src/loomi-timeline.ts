import { html, nothing, svg, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LoomiElement, loomiStyles, accentVars, type LoomiColor } from "@loomidev/core";
import { getLoomiIcon } from "@loomidev/icons";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiTimelinePosition = "left" | "right" | "alternate";

const CHECK = svg`<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />`;

/**
 * `<loomi-timeline-item>` — a single timeline entry. Group inside `<loomi-timeline>`.
 *
 * There's nothing to set per-item: the connecting line hides itself on the last item,
 * and `alternate` placement resolves from the item's position among its siblings -
 * both purely in CSS, from the real DOM order.
 *
 * @slot - Custom content (overrides the `content` attribute).
 * @slot content - Alias for the default slot.
 */
@customElement("loomi-timeline-item")
export class LoomiTimelineItem extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property() date = "";
  @property() content = "";
  @property({ type: Boolean }) completed = false;
  @property({ type: Boolean }) stacked = false;
  @property() anchor: "small" | "big" = "small";
  @property() icon = "";
  @property() avatar = "";
  @property({ reflect: true }) position: LoomiTimelinePosition = "left";
  @property() color: LoomiColor = "primary" as LoomiColor;

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
    const dateCol = !this.stacked ? html`<div class="loomi-date-col">${this.date}</div>` : nothing;
    const body = html`<div class="loomi-body">
      <div class="loomi-content"><slot name="content"><slot>${this.content}</slot></slot></div>
      ${this.stacked && this.date ? html`<div class="loomi-date-top">${this.date}</div>` : nothing}
    </div>`;

    return html`<div class="loomi-item" style=${accentVars(this.color)}>
      <div class="loomi-side">${dateCol}${body}</div>
      <div class="loomi-anchor">
        ${this.renderDot()}
        <div class="loomi-line"></div>
      </div>
    </div>`;
  }
}

/**
 * `<loomi-timeline>` — wraps `<loomi-timeline-item>` items and shares attributes with them.
 * @slot - `<loomi-timeline-item>` children.
 */
@customElement("loomi-timeline")
export class LoomiTimeline extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property({ type: Boolean }) stacked = false;
  @property({ type: Boolean }) completed = false;
  @property() anchor: "small" | "big" = "small";
  @property() icon = "";
  @property() position: LoomiTimelinePosition = "left";
  @property() color: LoomiColor = "primary" as LoomiColor;

  private sync = (): void => {
    const items = Array.from(this.querySelectorAll("loomi-timeline-item"));
    items.forEach((item) => {
      if (this.stacked) item.stacked = true;
      if (this.completed) item.completed = true;
      if (this.anchor === "big") item.anchor = "big";
      if (this.icon && !item.icon) item.icon = this.icon;
      if (this.position !== "left") item.position = this.position;
      if (this.color && item.color === ("primary" as LoomiColor)) item.color = this.color;
    });
  };

  override firstUpdated(): void {
    this.sync();
  }

  override render(): TemplateResult {
    return html`<div class="loomi-timeline position-${this.position}"><slot @slotchange=${this.sync}></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-timeline": LoomiTimeline;
    "loomi-timeline-item": LoomiTimelineItem;
  }
}
