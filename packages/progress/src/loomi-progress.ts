import { html, nothing, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LoomiElement, loomiStyles, accentVars, type LoomiColor } from "@loomi/core";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiProgressLabelPosition =
  | "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";

/**
 * `<loomi-progress-bar>` — a horizontal progress bar.
 */
@customElement("loomi-progress-bar")
export class LoomiProgressBar extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property({ type: Number }) percentage = 0;
  @property() color: LoomiColor = "primary" as LoomiColor;
  @property() shade: "faint" | "dark" = "faint";
  @property({ type: Boolean, attribute: "show-percentage-label" }) showLabel = false;
  @property({ type: Boolean, attribute: "show-percentage-label-inline" }) inline = true;
  @property({ attribute: "percentage-label-position" }) labelPosition: LoomiProgressLabelPosition = "top-left";
  @property({ attribute: "percentage-prefix" }) prefix = "";
  @property({ attribute: "percentage-suffix" }) suffix = "";
  @property({ type: Boolean }) striped = false;
  @property({ type: Boolean }) animated = false;

  private get pct(): number {
    return Math.min(100, Math.max(0, this.percentage));
  }
  private get text(): string {
    return `${this.prefix}${this.pct}%${this.suffix ? " " + this.suffix : ""}`;
  }

  override render(): TemplateResult {
    const [vpos, hpos] = this.labelPosition.split("-");
    const outsideLabel = this.showLabel && !this.inline;
    const labelEl = outsideLabel
      ? html`<div class="loomi-bar-label-out ${hpos}">${this.text}</div>`
      : nothing;
    return html`<div class="loomi-bar-wrap" style=${accentVars(this.color)}>
      ${vpos === "top" ? labelEl : nothing}
      <div class="loomi-track" role="progressbar" aria-valuenow=${this.pct} aria-valuemin="0" aria-valuemax="100">
        <div class="loomi-fill ${this.shade === "dark" ? "dark" : ""} ${this.striped ? "striped" : ""} ${this.animated ? "animated" : ""}" style="width:${this.pct}%">
          ${this.showLabel && this.inline ? html`<span>${this.pct}%</span>` : nothing}
        </div>
      </div>
      ${vpos === "bottom" ? labelEl : nothing}
    </div>`;
  }
}

const SIZES: Record<string, number> = { tiny: 50, small: 80, medium: 120, big: 200, large: 300 };

/**
 * `<loomi-progress-circle>` — a circular progress indicator.
 */
@customElement("loomi-progress-circle")
export class LoomiProgressCircle extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property({ type: Number }) percentage = 0;
  @property() color: LoomiColor = "primary" as LoomiColor;
  @property() shade: "faint" | "dark" = "faint";
  @property() size: string = "medium";
  @property({ type: Boolean, attribute: "show-label" }) showLabel = false;
  @property({ type: Boolean, attribute: "show-percent" }) showPercent = false;
  @property({ type: Number, attribute: "circle-width" }) circleWidth = 10;

  private get pct(): number {
    return Math.min(100, Math.max(0, this.percentage));
  }
  private get px(): number {
    return SIZES[this.size] ?? Number(this.size) ?? 120;
  }

  override render(): TemplateResult {
    const r = 50 - this.circleWidth / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ * (1 - this.pct / 100);
    const px = this.px;
    return html`<div class="loomi-circle" style=${accentVars(this.color) + `width:${px}px;height:${px}px`}>
      <svg width=${px} height=${px} viewBox="0 0 100 100" role="progressbar" aria-valuenow=${this.pct} aria-valuemin="0" aria-valuemax="100">
        <circle class="track" cx="50" cy="50" r=${r} fill="none" stroke-width=${this.circleWidth}></circle>
        <circle class="bar ${this.shade === "dark" ? "dark" : ""}" cx="50" cy="50" r=${r} fill="none" stroke-width=${this.circleWidth}
          stroke-dasharray=${circ} stroke-dashoffset=${offset}></circle>
      </svg>
      ${this.showLabel
        ? html`<div class="label" style="font-size:${px * 0.22}px">${this.pct}${this.showPercent ? "%" : ""}</div>`
        : nothing}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-progress-bar": LoomiProgressBar;
    "loomi-progress-circle": LoomiProgressCircle;
  }
}
