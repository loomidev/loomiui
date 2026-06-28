import { html, nothing, svg, type TemplateResult, type SVGTemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LoomiElement, loomiStyles, accentVars, cssColor, type LoomiColor } from "@loomidev/core";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiChartType = "bar" | "line" | "pie" | "donut" | "radar" | "scatter";
export type LoomiChartShade = "light" | "dark";
export interface LoomiChartPoint {
  label: string;
  value: number;
  color?: string;
}

const PALETTE = ["primary", "green", "orange", "red", "purple", "cyan", "pink", "indigo"];

// `show-border` defaults to `true`, so it needs the "false" string to actually disable it —
// Lit's built-in Boolean converter treats any present attribute (including `="false"`) as true.
const booleanAttribute = {
  fromAttribute(value: string | null): boolean {
    return value !== null && value.toLowerCase() !== "false";
  },
  toAttribute(value: boolean): string | null {
    return value ? "" : null;
  },
};

/** Draws a rect-like path with rounded top corners and square bottom corners. */
function roundedTopRectPath(x: number, y: number, w: number, h: number, r: number): string {
  const rr = Math.max(0, Math.min(r, w / 2, h));
  if (rr <= 0) return `M${x},${y} H${x + w} V${y + h} H${x} Z`;
  return [
    `M${x + rr},${y}`,
    `H${x + w - rr}`,
    `A${rr},${rr} 0 0 1 ${x + w},${y + rr}`,
    `V${y + h}`,
    `H${x}`,
    `V${y + rr}`,
    `A${rr},${rr} 0 0 1 ${x + rr},${y}`,
    "Z",
  ].join(" ");
}

/**
 * `<loomi-chart>` — a lightweight SVG chart: `bar`, `line`, `pie`, `donut`, `radar` or
 * `scatter`. Provide a single series via `data` (`{ label, value, color? }`).
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
  /** `light` uses paler fills (300/400), `dark` (default) keeps the original, more saturated look. */
  @property() shade: LoomiChartShade = "dark";
  /** Outline shapes in a higher (darker) shade of their own color. Only visible when `shade="light"`. */
  @property({ type: Boolean, attribute: "show-border", converter: booleanAttribute }) showBorder = true;
  /** Show a value axis line with min/max labels (`bar`, `line`, `scatter`). */
  @property({ type: Boolean, attribute: "show-y-axis" }) showYAxis = false;
  /** `type="line"` only — transposes the chart so categories run top-to-bottom. */
  @property({ type: Boolean }) vertical = false;

  /** Fill shade for bar/pie/donut/scatter segments: lighter in `light` mode, unchanged default in `dark`. */
  private get segmentFillShade(): number {
    return this.shade === "light" ? 300 : 500;
  }

  /** Resolves a data point's fill. `usePalette` cycles the built-in palette (pie/donut); otherwise falls back to the chart's own `color`. */
  private resolveFill(p: LoomiChartPoint, i: number, usePalette: boolean): string {
    const c = p.color || (usePalette ? PALETTE[i % PALETTE.length] : this.color);
    return /^[a-z]+$/.test(c) ? cssColor(c, this.segmentFillShade) : c;
  }

  /** Resolves a data point's border color, or `null` when borders are off/not applicable (named colors only — an explicit hex `color` has no "higher shade" to compute). */
  private resolveBorder(p: LoomiChartPoint, i: number, usePalette: boolean): string | null {
    if (this.shade !== "light" || !this.showBorder) return null;
    const c = p.color || (usePalette ? PALETTE[i % PALETTE.length] : this.color);
    return /^[a-z]+$/.test(c) ? cssColor(c, 600) : null;
  }

  /**
   * Single-accent CSS vars for line/radar (`--_loomi-accent` + `--_loomi-accent-softer`),
   * shade-aware. `withBorder` applies the bar/pie-style "fill + higher-shade border"
   * treatment, for shapes that have a real fill region (radar's polygon). A plain line
   * has no fill region to outline, so it just lightens its stroke directly in `light` mode.
   */
  private accentStyle(withBorder = false): string {
    const light = this.shade === "light";
    const strokeShade = light ? (withBorder && this.showBorder ? 600 : 400) : 600;
    const fillShade = light ? 100 : 50;
    return `${accentVars(this.color)}--_loomi-accent:${cssColor(this.color, strokeShade)};--_loomi-accent-softer:${cssColor(this.color, fillShade)};`;
  }

  private polar(cx: number, cy: number, deg: number, radius: number): [number, number] {
    const a = ((deg - 90) * Math.PI) / 180;
    return [cx + radius * Math.cos(a), cy + radius * Math.sin(a)];
  }

  private renderBars(): SVGTemplateResult {
    const W = 320, H = 180, pad = 24;
    const padLeft = this.showYAxis ? 34 : pad;
    const max = Math.max(1, ...this.data.map((d) => d.value));
    const n = this.data.length || 1;
    const bw = (W - padLeft - pad) / n;
    return svg`
      <line class="loomi-axis" x1=${padLeft} y1=${H - pad} x2=${W - pad} y2=${H - pad}></line>
      ${this.showYAxis
        ? svg`<line class="loomi-axis" x1=${padLeft} y1=${pad} x2=${padLeft} y2=${H - pad}></line>
          <text class="loomi-ylabel" x=${padLeft - 6} y=${pad + 3} text-anchor="end">${max}</text>
          <text class="loomi-ylabel" x=${padLeft - 6} y=${H - pad} text-anchor="end">0</text>`
        : nothing}
      ${this.data.map((d, i) => {
        const h = (d.value / max) * (H - pad * 2);
        const x = padLeft + i * bw + bw * 0.15;
        const y = H - pad - h;
        const border = this.resolveBorder(d, i, false);
        return svg`<path d=${roundedTopRectPath(x, y, bw * 0.7, h, 3)} fill=${this.resolveFill(d, i, false)} stroke=${border ?? "none"} stroke-width=${border ? 1.5 : 0}></path>
          <text class="loomi-xlabel" x=${padLeft + i * bw + bw / 2} y=${H - pad + 12} text-anchor="middle">${d.label}</text>`;
      })}`;
  }

  private renderLineHorizontal(): SVGTemplateResult {
    const W = 320, H = 180, pad = 24;
    const padLeft = this.showYAxis ? 34 : pad;
    const max = Math.max(1, ...this.data.map((d) => d.value));
    const n = this.data.length;
    const step = n > 1 ? (W - padLeft - pad) / (n - 1) : 0;
    const pts = this.data.map((d, i) => [padLeft + i * step, H - pad - (d.value / max) * (H - pad * 2)]);
    const line = pts.map((p) => `${p[0]},${p[1]}`).join(" ");
    const area = `${padLeft},${H - pad} ${line} ${padLeft + (n - 1) * step},${H - pad}`;
    return svg`
      <line class="loomi-axis" x1=${padLeft} y1=${H - pad} x2=${W - pad} y2=${H - pad}></line>
      ${this.showYAxis
        ? svg`<line class="loomi-axis" x1=${padLeft} y1=${pad} x2=${padLeft} y2=${H - pad}></line>
          <text class="loomi-ylabel" x=${padLeft - 6} y=${pad + 3} text-anchor="end">${max}</text>
          <text class="loomi-ylabel" x=${padLeft - 6} y=${H - pad} text-anchor="end">0</text>`
        : nothing}
      <polygon class="loomi-area" points=${area}></polygon>
      <polyline class="loomi-line" points=${line}></polyline>
      ${pts.map((p, i) => svg`<circle class="loomi-dot" cx=${p[0]} cy=${p[1]} r="3.5"></circle>
        <text class="loomi-xlabel" x=${p[0]} y=${H - pad + 12} text-anchor="middle">${this.data[i].label}</text>`)}`;
  }

  private renderLineVertical(): SVGTemplateResult {
    const W = 320, H = 180, padLeft = 40, padTop = 16, padRight = 16;
    const padBottom = this.showYAxis ? 32 : 16;
    const max = Math.max(1, ...this.data.map((d) => d.value));
    const n = this.data.length;
    const step = n > 1 ? (H - padTop - padBottom) / (n - 1) : 0;
    const pts = this.data.map((d, i) => [padLeft + (d.value / max) * (W - padLeft - padRight), padTop + i * step]);
    const line = pts.map((p) => `${p[0]},${p[1]}`).join(" ");
    const area = `${padLeft},${padTop} ${line} ${padLeft},${padTop + (n - 1) * step}`;
    return svg`
      <line class="loomi-axis" x1=${padLeft} y1=${padTop} x2=${padLeft} y2=${H - padBottom}></line>
      ${this.showYAxis
        ? svg`<line class="loomi-axis" x1=${padLeft} y1=${H - padBottom} x2=${W - padRight} y2=${H - padBottom}></line>
          <text class="loomi-ylabel" x=${padLeft} y=${H - padBottom + 12} text-anchor="middle">0</text>
          <text class="loomi-ylabel" x=${W - padRight} y=${H - padBottom + 12} text-anchor="middle">${max}</text>`
        : nothing}
      <polygon class="loomi-area" points=${area}></polygon>
      <polyline class="loomi-line" points=${line}></polyline>
      ${pts.map((p, i) => svg`<circle class="loomi-dot" cx=${p[0]} cy=${p[1]} r="3.5"></circle>
        <text class="loomi-xlabel" x=${padLeft - 6} y=${p[1] + 3} text-anchor="end">${this.data[i].label}</text>`)}`;
  }

  private renderScatter(): SVGTemplateResult {
    const W = 320, H = 180, pad = 24;
    const padLeft = this.showYAxis ? 34 : pad;
    const max = Math.max(1, ...this.data.map((d) => d.value));
    const n = this.data.length;
    const step = n > 1 ? (W - padLeft - pad) / (n - 1) : 0;
    return svg`
      <line class="loomi-axis" x1=${padLeft} y1=${H - pad} x2=${W - pad} y2=${H - pad}></line>
      ${this.showYAxis
        ? svg`<line class="loomi-axis" x1=${padLeft} y1=${pad} x2=${padLeft} y2=${H - pad}></line>
          <text class="loomi-ylabel" x=${padLeft - 6} y=${pad + 3} text-anchor="end">${max}</text>
          <text class="loomi-ylabel" x=${padLeft - 6} y=${H - pad} text-anchor="end">0</text>`
        : nothing}
      ${this.data.map((d, i) => {
        const x = n > 1 ? padLeft + i * step : (padLeft + (W - pad)) / 2;
        const y = H - pad - (d.value / max) * (H - pad * 2);
        const border = this.resolveBorder(d, i, false);
        return svg`<circle cx=${x} cy=${y} r="5" fill=${this.resolveFill(d, i, false)} stroke=${border ?? "none"} stroke-width=${border ? 1.5 : 0}></circle>
          <text class="loomi-xlabel" x=${x} y=${H - pad + 12} text-anchor="middle">${d.label}</text>`;
      })}`;
  }

  private renderRadar(): SVGTemplateResult {
    const cx = 90, cy = 90, R = 64;
    const n = this.data.length || 1;
    const max = Math.max(1, ...this.data.map((d) => d.value));
    const step = 360 / n;
    const ring = (frac: number) =>
      this.data.map((_, i) => this.polar(cx, cy, i * step, R * frac).join(",")).join(" ") ||
      `${cx},${cy - R * frac} ${cx + R * frac},${cy} ${cx},${cy + R * frac} ${cx - R * frac},${cy}`;
    const dataPts = this.data.map((d, i) => this.polar(cx, cy, i * step, (d.value / max) * R));
    return svg`
      <polygon class="loomi-grid" points=${ring(1)} fill="none"></polygon>
      <polygon class="loomi-grid" points=${ring(0.5)} fill="none"></polygon>
      ${this.data.map((_, i) => {
        const [x, y] = this.polar(cx, cy, i * step, R);
        return svg`<line class="loomi-axis" x1=${cx} y1=${cy} x2=${x} y2=${y}></line>`;
      })}
      <polygon class="loomi-radar-area" points=${dataPts.map((p) => p.join(",")).join(" ")}></polygon>
      ${dataPts.map((p) => svg`<circle class="loomi-dot" cx=${p[0]} cy=${p[1]} r="3"></circle>`)}
      ${this.data.map((d, i) => {
        const [x, y] = this.polar(cx, cy, i * step, R + 14);
        return svg`<text class="loomi-xlabel" x=${x} y=${y} text-anchor="middle">${d.label}</text>`;
      })}`;
  }

  private renderPie(donut: boolean): SVGTemplateResult {
    const S = 180, cx = S / 2, cy = S / 2, r = 80;
    const innerR = donut ? Math.max(0, Math.min(r - 4, this.donutRadius)) : 0;
    const total = this.data.reduce((s, d) => s + d.value, 0) || 1;
    let angle = 0;
    const slices = this.data.map((d, i) => {
      const start = angle;
      angle += (d.value / total) * 360;
      const end = angle;
      const large = end - start > 180 ? 1 : 0;
      const [sx, sy] = this.polar(cx, cy, start, r);
      const [ex, ey] = this.polar(cx, cy, end, r);
      const fill = this.resolveFill(d, i, true);
      const border = this.resolveBorder(d, i, true);
      const sw = border ? 1.5 : 0;
      if (innerR <= 0) {
        return svg`<path d="M ${cx} ${cy} L ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey} Z" fill=${fill} stroke=${border ?? "none"} stroke-width=${sw}></path>`;
      }
      // Ring segment (outer arc out, inner arc back) leaves a true hole — nothing painted in
      // the center — instead of overlaying an opaque circle, which only looked right on white.
      const [isx, isy] = this.polar(cx, cy, start, innerR);
      const [iex, iey] = this.polar(cx, cy, end, innerR);
      return svg`<path d="M ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey} L ${iex} ${iey} A ${innerR} ${innerR} 0 ${large} 0 ${isx} ${isy} Z" fill=${fill} stroke=${border ?? "none"} stroke-width=${sw}></path>`;
    });
    return svg`${slices}`;
  }

  override render(): TemplateResult {
    const isPolar = this.type === "pie" || this.type === "donut" || this.type === "radar";
    const viewBox = isPolar ? "0 0 180 180" : "0 0 320 180";
    let body: SVGTemplateResult;
    if (this.type === "bar") body = this.renderBars();
    else if (this.type === "line") body = this.vertical ? this.renderLineVertical() : this.renderLineHorizontal();
    else if (this.type === "scatter") body = this.renderScatter();
    else if (this.type === "radar") body = this.renderRadar();
    else body = this.renderPie(this.type === "donut");

    const usePalette = this.type === "pie" || this.type === "donut";
    return html`<div class="loomi-chart" style=${this.accentStyle(this.type === "radar")}>
      <svg viewBox=${viewBox} role="img" aria-label="${this.type} chart">${body}</svg>
      ${this.showLegend
        ? html`<div class="loomi-legend">
            ${this.data.map((d, i) => html`<span class="loomi-key"><span class="loomi-keydot" style="background:${this.resolveFill(d, i, usePalette)}"></span>${d.label}</span>`)}
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
