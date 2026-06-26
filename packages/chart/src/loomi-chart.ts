import { html, nothing, svg, type TemplateResult, type SVGTemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LoomiElement, loomiStyles, accentVars, cssColor, type LoomiColor } from "@loomi/core";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiChartType = "bar" | "line" | "pie" | "donut";
export interface LoomiChartPoint {
  label: string;
  value: number;
  color?: string;
}

const PALETTE = ["primary", "green", "orange", "red", "purple", "cyan", "pink", "indigo"];
const segColor = (p: LoomiChartPoint, i: number): string => {
  const c = p.color || PALETTE[i % PALETTE.length];
  return /^[a-z]+$/.test(c) ? cssColor(c, 500) : c;
};

/**
 * `<loomi-chart>` — a lightweight SVG chart: `bar`, `line`, `pie` or `donut`. Provide a
 * single series via `data` (`{ label, value, color? }`).
 */
@customElement("loomi-chart")
export class LoomiChart extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property() type: LoomiChartType = "bar";
  @property({ type: Array }) data: LoomiChartPoint[] = [];
  @property() color: LoomiColor = "primary" as LoomiColor;
  @property({ type: Boolean, attribute: "show-legend" }) showLegend = false;
  /** Inner-hole radius (SVG units, viewBox is 180x180 with outer radius 80) for `type="donut"`. */
  @property({ type: Number, attribute: "donut-radius" }) donutRadius = 44;

  private renderBars(): SVGTemplateResult {
    const W = 320, H = 180, pad = 24;
    const max = Math.max(1, ...this.data.map((d) => d.value));
    const n = this.data.length || 1;
    const bw = (W - pad * 2) / n;
    return svg`
      <line class="loomi-axis" x1=${pad} y1=${H - pad} x2=${W - pad} y2=${H - pad}></line>
      ${this.data.map((d, i) => {
        const h = ((d.value / max) * (H - pad * 2));
        const x = pad + i * bw + bw * 0.15;
        const y = H - pad - h;
        return svg`<rect x=${x} y=${y} width=${bw * 0.7} height=${h} rx="3" fill=${segColor(d, i)}></rect>
          <text class="loomi-xlabel" x=${pad + i * bw + bw / 2} y=${H - pad + 12} text-anchor="middle">${d.label}</text>`;
      })}`;
  }

  private renderLine(): SVGTemplateResult {
    const W = 320, H = 180, pad = 24;
    const max = Math.max(1, ...this.data.map((d) => d.value));
    const n = this.data.length;
    const step = n > 1 ? (W - pad * 2) / (n - 1) : 0;
    const pts = this.data.map((d, i) => [pad + i * step, H - pad - (d.value / max) * (H - pad * 2)]);
    const line = pts.map((p) => `${p[0]},${p[1]}`).join(" ");
    const area = `${pad},${H - pad} ${line} ${pad + (n - 1) * step},${H - pad}`;
    return svg`
      <line class="loomi-axis" x1=${pad} y1=${H - pad} x2=${W - pad} y2=${H - pad}></line>
      <polygon class="loomi-area" points=${area}></polygon>
      <polyline class="loomi-line" points=${line}></polyline>
      ${pts.map((p, i) => svg`<circle class="loomi-dot" cx=${p[0]} cy=${p[1]} r="3.5"></circle>
        <text class="loomi-xlabel" x=${p[0]} y=${H - pad + 12} text-anchor="middle">${this.data[i].label}</text>`)}`;
  }

  private renderPie(donut: boolean): SVGTemplateResult {
    const S = 180, cx = S / 2, cy = S / 2, r = 80;
    const innerR = donut ? Math.max(0, Math.min(r - 4, this.donutRadius)) : 0;
    const total = this.data.reduce((s, d) => s + d.value, 0) || 1;
    let angle = 0;
    const polar = (deg: number, radius: number) => {
      const a = ((deg - 90) * Math.PI) / 180;
      return [cx + radius * Math.cos(a), cy + radius * Math.sin(a)];
    };
    const slices = this.data.map((d, i) => {
      const start = angle;
      angle += (d.value / total) * 360;
      const end = angle;
      const large = end - start > 180 ? 1 : 0;
      const [sx, sy] = polar(start, r);
      const [ex, ey] = polar(end, r);
      if (innerR <= 0) {
        return svg`<path d="M ${cx} ${cy} L ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey} Z" fill=${segColor(d, i)}></path>`;
      }
      // Ring segment (outer arc out, inner arc back) leaves a true hole — nothing painted in
      // the center — instead of overlaying an opaque circle, which only looked right on white.
      const [isx, isy] = polar(start, innerR);
      const [iex, iey] = polar(end, innerR);
      return svg`<path d="M ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey} L ${iex} ${iey} A ${innerR} ${innerR} 0 ${large} 0 ${isx} ${isy} Z" fill=${segColor(d, i)}></path>`;
    });
    return svg`${slices}`;
  }

  override render(): TemplateResult {
    const isPie = this.type === "pie" || this.type === "donut";
    const viewBox = isPie ? "0 0 180 180" : "0 0 320 180";
    let body: SVGTemplateResult;
    if (this.type === "bar") body = this.renderBars();
    else if (this.type === "line") body = this.renderLine();
    else body = this.renderPie(this.type === "donut");

    return html`<div class="loomi-chart" style=${accentVars(this.color)}>
      <svg viewBox=${viewBox} role="img" aria-label="${this.type} chart">${body}</svg>
      ${this.showLegend
        ? html`<div class="loomi-legend">
            ${this.data.map((d, i) => html`<span class="loomi-key"><span class="loomi-keydot" style="background:${segColor(d, i)}"></span>${d.label}</span>`)}
          </div>`
        : nothing}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-chart": LoomiChart;
  }
}
