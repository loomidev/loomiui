import { html, nothing, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LoomiElement, loomiStyles, cssColor } from "@loomidev/core";
import { componentStyles } from "./generated/styles.css.js";

export interface LoomiGraphSegment {
  label: string;
  value: number;
  /** A loomi color name (themed) or any CSS color. */
  color?: string;
}

const FALLBACK = ["#16a34a", "#eab308", "#f97316", "#ef4444", "#64748b", "#84cc16", "#a16207"];

/**
 * `<loomi-horizontal-line-graph>` — a single proportion bar split into colored segments,
 * with an optional legend. Provide `data` (`{ label, value, color? }`).
 */
@customElement("loomi-horizontal-line-graph")
export class LoomiHorizontalLineGraph extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property({ type: Array }) data: LoomiGraphSegment[] = [];
  @property({ type: Boolean, attribute: "show-legend" }) showLegend = true;
  @property({ type: Boolean, attribute: "show-values" }) showValues = true;

  private color(seg: LoomiGraphSegment, i: number): string {
    const c = seg.color === "yellow" ? "warning" : seg.color || FALLBACK[i % FALLBACK.length];
    // a loomi color name -> themed token; otherwise use as-is (hex/rgb).
    return /^[a-z]+$/.test(c) ? cssColor(c, 500) : c;
  }

  override render(): TemplateResult {
    const total = this.data.reduce((s, d) => s + (d.value || 0), 0) || 1;
    const summary = this.data
      .map((seg) => `${seg.label} ${Math.round(((seg.value || 0) / total) * 100)}%`)
      .join(", ");
    const ariaLabel = summary ? `Segment breakdown: ${summary}` : "Segment breakdown";

    return html`<div class="loomi-hlg" role="img" aria-label=${ariaLabel}>
      <div class="loomi-bar" aria-hidden="true">
        ${this.data.map(
          (seg, i) => html`<div
          class="loomi-seg"
          style="width:${((seg.value || 0) / total) * 100}%;background:${this.color(seg, i)}"
          title="${seg.label}: ${seg.value}"
        ></div>`,
        )}
      </div>
      ${
        this.showLegend
          ? html`<div class="loomi-legend">
            ${this.data.map(
              (seg, i) => html`<span class="loomi-key">
              <span class="loomi-dot" style="background:${this.color(seg, i)}"></span>
              ${seg.label}
              ${this.showValues ? html`<span class="loomi-val">${Math.round(((seg.value || 0) / total) * 100)}%</span>` : nothing}
            </span>`,
            )}
          </div>`
          : nothing
      }
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-horizontal-line-graph": LoomiHorizontalLineGraph;
  }
}
