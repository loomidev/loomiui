import { html, nothing, svg, type TemplateResult, type SVGTemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { LoomiElement, loomiStyles, type LoomiColor } from "@loomidev/core";
import "@loomidev/tooltip/loomi-tooltip.js";
import { componentStyles } from "./generated/styles.css.js";
import {
  BAR_WIDTH_RATIO,
  CARTESIAN,
  POLAR,
  accentStyle,
  barSeriesCount,
  barValueAt,
  booleanAttribute,
  cartesianLayout,
  dataAttribute,
  formatValue,
  gridLineYs,
  groupedSeriesLabels,
  hasGroupedValues,
  hasSecondarySeries,
  hasTertiarySeries,
  hoverTargets,
  isPolarType,
  maxValue,
  nearestIndex,
  pieTotal,
  polar,
  resolveBorder,
  resolveFill,
  resolveGroupedSeriesBorder,
  resolveGroupedSeriesFill,
  roundedTopRectBorderPath,
  roundedTopRectPath,
  showXLabel,
  tooltipAnchor,
  usesPalette,
  verticalLineLayout,
} from "./chart-utils.js";
import type {
  ChartColorContext,
  LoomiChartLegendPosition,
  LoomiChartPoint,
  LoomiChartShade,
  LoomiChartType,
} from "./types.js";

/**
 * `<loomi-chart>` — SVG charts inspired by shadcn/ui and Untitled UI: `bar`, `line`,
 * `area`, `pie`, `donut`, `radar`, `radial`, or `scatter`. Pass a single series via
 * `data` (`{ label, value, color? }`).
 */
@customElement("loomi-chart")
export class LoomiChart extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property() type: LoomiChartType = "bar";
  @property({ type: Array, converter: dataAttribute }) data: LoomiChartPoint[] = [];
  @property() color: LoomiColor = "primary" as LoomiColor;
  /** Second series color when points include `value2`. */
  @property() color2: LoomiColor = "success" as LoomiColor;
  /** Third series color when points include `value3`. */
  @property() color3: LoomiColor = "warning" as LoomiColor;
  @property({ attribute: "series-label" }) seriesLabel = "Series 1";
  @property({ attribute: "series2-label" }) series2Label = "Series 2";
  @property({ attribute: "series3-label" }) series3Label = "Series 3";
  @property({ type: Boolean, attribute: "show-legend" }) showLegend = false;
  @property({ attribute: "legend-position" }) legendPosition: LoomiChartLegendPosition = "bottom";
  @property({ type: Number, attribute: "donut-radius" }) donutRadius = 44;
  @property() shade: LoomiChartShade = "dark";
  @property({ type: Boolean, attribute: "show-border", converter: booleanAttribute }) showBorder = true;
  @property({ type: Boolean, attribute: "show-y-axis", converter: booleanAttribute }) showYAxis = true;
  @property({ type: Boolean, attribute: "show-grid" }) showGrid = true;
  /** Show a tooltip while hovering chart points. Cartesian charts track the nearest point as you move across the plot. */
  @property({ type: Boolean, attribute: "show-tooltip", converter: booleanAttribute }) showTooltip = true;
  @property({ type: Boolean }) vertical = false;

  @state() private hoverIndex = -1;

  private get colorCtx(): ChartColorContext {
    return {
      color: this.color,
      color2: this.color2,
      color3: this.color3,
      shade: this.shade,
      showBorder: this.showBorder,
    };
  }

  private dualSeries(): boolean {
    return hasSecondarySeries(this.data);
  }

  private seriesPoints(layout: ReturnType<typeof cartesianLayout>, field: "value" | "value2"): [number, number][] {
    const { height: H, padTop, padBottom, max, bandWidth, padLeft, step } = layout;
    const n = this.data.length;
    return this.data.map((d, i) => {
      const val = d[field];
      if (val == null) return [0, 0];
      const x = n > 1 ? padLeft + i * step : padLeft + bandWidth / 2;
      const y = H - padBottom - (val / max) * (H - padTop - padBottom);
      return [x, y];
    });
  }

  private layoutOpts() {
    return { showYAxis: this.showYAxis, vertical: this.vertical, donutRadius: this.donutRadius };
  }

  private isBandTooltipType(): boolean {
    return (
      this.type === "bar" ||
      this.type === "line" ||
      this.type === "area" ||
      this.type === "scatter"
    );
  }

  private isVerticalLine(): boolean {
    return this.type === "line" && this.vertical;
  }

  private handlePointerMove(event: PointerEvent): void {
    if (!this.showTooltip || !this.data.length || !this.isBandTooltipType()) return;
    const canvas = event.currentTarget as HTMLElement;
    const rect = canvas.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const ratio = this.isVerticalLine()
      ? (event.clientY - rect.top) / rect.height
      : (event.clientX - rect.left) / rect.width;
    const next = nearestIndex(this.type, this.data, this.layoutOpts(), ratio);
    if (next !== this.hoverIndex) this.hoverIndex = next;
  }

  private handlePointerLeave(): void {
    this.hoverIndex = -1;
  }

  private renderGrid(layout: ReturnType<typeof cartesianLayout>): SVGTemplateResult | typeof nothing {
    if (!this.showGrid) return nothing;
    const { width: W, padLeft, padRight, padBottom, height: H } = layout;
    const ys = gridLineYs(layout);
    return svg`
      ${ys.map(
        (y) =>
          svg`<line class="loomi-grid-line" x1=${padLeft} y1=${y} x2=${W - padRight} y2=${y} vector-effect="non-scaling-stroke"></line>`,
      )}
      <line class="loomi-axis" x1=${padLeft} y1=${H - padBottom} x2=${W - padRight} y2=${H - padBottom} vector-effect="non-scaling-stroke"></line>
    `;
  }

  private renderYAxis(layout: ReturnType<typeof cartesianLayout>): SVGTemplateResult | typeof nothing {
    if (!this.showYAxis) return nothing;
    const { padLeft, padTop, padBottom, height: H, max } = layout;
    return svg`
      <line class="loomi-axis" x1=${padLeft} y1=${padTop} x2=${padLeft} y2=${H - padBottom} vector-effect="non-scaling-stroke"></line>
      <text class="loomi-ylabel" x=${padLeft - 8} y=${padTop + 4} text-anchor="end">${max}</text>
      <text class="loomi-ylabel" x=${padLeft - 8} y=${H - padBottom + 4} text-anchor="end">0</text>
    `;
  }

  private renderCrosshair(layout: ReturnType<typeof cartesianLayout>): SVGTemplateResult | typeof nothing {
    if (!this.showTooltip || this.hoverIndex < 0) return nothing;
    const [x] = tooltipAnchor(this.type, this.data, this.hoverIndex, this.layoutOpts());
    if (x == null) return nothing;
    const { padTop, height: H, padBottom } = layout;
    return svg`<line class="loomi-crosshair" x1=${x} y1=${padTop} x2=${x} y2=${H - padBottom} vector-effect="non-scaling-stroke"></line>`;
  }

  private renderGradientDef(id: string): SVGTemplateResult {
    return svg`
      <defs>
        <linearGradient id=${id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--_loomi-accent)" stop-opacity="0.35"></stop>
          <stop offset="100%" stop-color="var(--_loomi-accent)" stop-opacity="0.02"></stop>
        </linearGradient>
      </defs>
    `;
  }

  private renderBars(): SVGTemplateResult {
    const layout = cartesianLayout(this.data, this.layoutOpts());
    const { height: H, padLeft, padTop, padBottom, bandWidth, max } = layout;
    const palette = usesPalette(this.type);
    const multi = hasGroupedValues(this.data);
    const seriesLabels = multi ? groupedSeriesLabels(this.data) : [];
    const seriesCount = barSeriesCount(this.data);
    const groupRatio = seriesCount > 1 ? Math.min(0.88, 0.68 + seriesCount * 0.04) : BAR_WIDTH_RATIO;
    const groupW = bandWidth * groupRatio;
    const barGap = seriesCount > 1 ? 2 : 0;
    const barW = seriesCount > 1 ? (groupW - barGap * (seriesCount - 1)) / seriesCount : groupW;

    const barAt = (i: number, seriesIndex: number) => {
      const d = this.data[i];
      const val = barValueAt(d, seriesIndex, seriesLabels);
      if (val == null) return null;
      const h = (val / max) * (H - padTop - padBottom);
      const groupX = padLeft + i * bandWidth + (bandWidth - groupW) / 2;
      const x = groupX + seriesIndex * (barW + barGap);
      const y = H - padBottom - h;
      const r = Math.min(4, barW / 2);
      return { d, h, x, y, w: barW, r };
    };

    const renderBar = (i: number, seriesIndex: number, active: boolean) => {
      const bar = barAt(i, seriesIndex);
      if (!bar) return nothing;
      const seriesLabel = seriesLabels[seriesIndex];
      const fill = multi
        ? resolveGroupedSeriesFill(this.colorCtx, this.data, seriesLabel, seriesIndex)
        : resolveFill(this.colorCtx, bar.d, i, palette, seriesIndex);
      const border = multi
        ? resolveGroupedSeriesBorder(this.colorCtx, this.data, seriesLabel, seriesIndex)
        : resolveBorder(this.colorCtx, bar.d, i, palette, seriesIndex);
      return svg`
        <path
          class="loomi-bar-fill${!multi && seriesIndex > 0 ? ` loomi-bar-fill-${seriesIndex + 1}` : ""}${active ? " is-active" : ""}"
          d=${roundedTopRectPath(bar.x, bar.y, bar.w, bar.h, bar.r)}
          fill=${fill}
        ></path>
        ${border
          ? svg`<path class="loomi-bar-border" d=${roundedTopRectBorderPath(bar.x, bar.y, bar.w, bar.h, bar.r)} fill="none" stroke=${border} stroke-width="1.5" stroke-linejoin="round" vector-effect="non-scaling-stroke"></path>`
          : nothing}
      `;
    };

    return svg`
      ${this.renderGradientDef("loomi-bar-bg")}
      ${this.renderGrid(layout)}
      ${this.renderYAxis(layout)}
      ${this.renderCrosshair(layout)}
      ${this.data.map((d, i) => {
        const active = this.hoverIndex === i;
        const bars = Array.from({ length: seriesCount }, (_, s) => renderBar(i, s, active));
        return svg`
          ${bars}
          ${showXLabel(i, bandWidth)
            ? svg`<text class="loomi-xlabel" x=${padLeft + i * bandWidth + bandWidth / 2} y=${H - padBottom + 12} text-anchor="middle">${d.label}</text>`
            : nothing}
        `;
      })}
    `;
  }

  private renderSeries(showDots: boolean, showArea: boolean): SVGTemplateResult {
    const vertical = this.type === "line" && this.vertical;
    const layout = vertical
      ? verticalLineLayout(this.data, this.showYAxis)
      : cartesianLayout(this.data, this.layoutOpts());
    const { width: W, height: H, padLeft, padTop, padRight, padBottom, max, points } = layout;
    const line = points.map((p) => `${p[0]},${p[1]}`).join(" ");
    const points2 = this.dualSeries() ? this.seriesPoints(layout, "value2") : [];
    const line2 = points2.map((p) => `${p[0]},${p[1]}`).join(" ");
    const area = vertical
      ? `${padLeft},${padTop} ${line} ${padLeft},${padTop + (points.length - 1) * layout.step}`
      : `${padLeft},${H - padBottom} ${line} ${points.at(-1)?.[0] ?? padLeft},${H - padBottom}`;

    return svg`
      ${this.renderGradientDef("loomi-area-grad")}
      ${vertical
        ? svg`
            <line class="loomi-axis" x1=${padLeft} y1=${padTop} x2=${padLeft} y2=${H - padBottom} vector-effect="non-scaling-stroke"></line>
            ${this.showYAxis
              ? svg`
                  <line class="loomi-axis" x1=${padLeft} y1=${H - padBottom} x2=${W - padRight} y2=${H - padBottom} vector-effect="non-scaling-stroke"></line>
                  <text class="loomi-ylabel" x=${padLeft} y=${H - padBottom + 14} text-anchor="middle">0</text>
                  <text class="loomi-ylabel" x=${W - padRight} y=${H - padBottom + 14} text-anchor="middle">${max}</text>
                `
              : nothing}
          `
        : svg`
            ${this.renderGrid(layout)}
            ${this.renderYAxis(layout)}
            ${this.renderCrosshair(layout)}
          `}
      ${showArea
        ? svg`<polygon class="loomi-area" points=${area} fill="url(#loomi-area-grad)"></polygon>`
        : nothing}
      ${this.dualSeries()
        ? svg`<polyline class="loomi-line loomi-line-2" points=${line2} fill="none" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"></polyline>`
        : nothing}
      <polyline class="loomi-line" points=${line} fill="none" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"></polyline>
      ${showDots
        ? points.map(([x, y], i) => {
            const active = this.hoverIndex === i;
            const p2 = points2[i];
            return svg`
              ${p2
                ? svg`<circle class="loomi-dot loomi-dot-2${active ? " is-active" : ""}" cx=${p2[0]} cy=${p2[1]} r=${active ? 3.5 : 2.5} vector-effect="non-scaling-stroke"></circle>`
                : nothing}
              <circle class="loomi-dot${active ? " is-active" : ""}" cx=${x} cy=${y} r=${active ? 3.5 : 2.5} vector-effect="non-scaling-stroke"></circle>
              ${!vertical && showXLabel(i, layout.bandWidth)
                ? svg`<text class="loomi-xlabel" x=${x} y=${H - padBottom + 12} text-anchor="middle">${this.data[i].label}</text>`
                : vertical
                  ? svg`<text class="loomi-xlabel" x=${padLeft - 8} y=${y + 4} text-anchor="end">${this.data[i].label}</text>`
                  : nothing}
            `;
          })
        : points.map(([x], i) =>
            showXLabel(i, layout.bandWidth)
              ? svg`<text class="loomi-xlabel" x=${x} y=${H - padBottom + 12} text-anchor="middle">${this.data[i].label}</text>`
              : svg``,
          )}
    `;
  }

  private renderScatter(): SVGTemplateResult {
    const layout = cartesianLayout(this.data, this.layoutOpts());
    const { height: H, padLeft, padBottom, bandWidth, points } = layout;
    return svg`
      ${this.renderGrid(layout)}
      ${this.renderYAxis(layout)}
      ${this.renderCrosshair(layout)}
      ${this.data.map((d, i) => {
        const [x, y] = points[i];
        const border = resolveBorder(this.colorCtx, d, i, false);
        const active = this.hoverIndex === i;
        return svg`
          <circle
            cx=${x}
            cy=${y}
            r=${active ? 6.5 : 5}
            class="loomi-scatter${active ? " is-active" : ""}"
            fill=${resolveFill(this.colorCtx, d, i, false)}
            stroke=${border ?? "none"}
            stroke-width=${border ? 1.5 : 0}
            vector-effect="non-scaling-stroke"
          ></circle>
          ${showXLabel(i, bandWidth)
            ? svg`<text class="loomi-xlabel" x=${padLeft + i * bandWidth + bandWidth / 2} y=${H - padBottom + 12} text-anchor="middle">${d.label}</text>`
            : nothing}
        `;
      })}
    `;
  }

  private renderRadar(): SVGTemplateResult {
    const { cx, cy, radarRadius: R } = POLAR;
    const n = this.data.length || 1;
    const max = maxValue(this.data);
    const step = 360 / n;
    const rings = [0.25, 0.5, 0.75, 1];
    const ring = (frac: number) =>
      this.data.map((_, i) => polar(cx, cy, i * step, R * frac).join(",")).join(" ") ||
      `${cx},${cy - R * frac} ${cx + R * frac},${cy} ${cx},${cy + R * frac} ${cx - R * frac},${cy}`;
    const dataPts = this.data.map((d, i) => polar(cx, cy, i * step, (d.value / max) * R));
    return svg`
      ${rings.map((frac) => svg`<polygon class="loomi-radar-grid" points=${ring(frac)} fill="none" vector-effect="non-scaling-stroke"></polygon>`)}
      ${this.data.map((_, i) => {
        const [x, y] = polar(cx, cy, i * step, R);
        return svg`<line class="loomi-radar-spoke" x1=${cx} y1=${cy} x2=${x} y2=${y} vector-effect="non-scaling-stroke"></line>`;
      })}
      <polygon class="loomi-radar-area" points=${dataPts.map((p) => p.join(",")).join(" ")} vector-effect="non-scaling-stroke"></polygon>
      ${dataPts.map(([x, y], i) => {
        const active = this.hoverIndex === i;
        return svg`<circle class="loomi-dot${active ? " is-active" : ""}" cx=${x} cy=${y} r=${active ? 4.5 : 3} vector-effect="non-scaling-stroke"></circle>`;
      })}
      ${this.data.map((d, i) => {
        const [x, y] = polar(cx, cy, i * step, R + 14);
        return svg`<text class="loomi-xlabel" x=${x} y=${y + 3} text-anchor="middle">${d.label}</text>`;
      })}
    `;
  }

  private renderRadial(): SVGTemplateResult {
    const { cx, cy, radius: outerR } = POLAR;
    const innerR = Math.max(20, this.donutRadius * 0.55);
    const total = pieTotal(this.data) || 1;
    let angle = 0;
    const trackR = (outerR + innerR) / 2;
    const stroke = outerR - innerR;

    return svg`
      <circle class="loomi-radial-track" cx=${cx} cy=${cy} r=${trackR} fill="none" stroke-width=${stroke} vector-effect="non-scaling-stroke"></circle>
      ${this.data.map((d, i) => {
        const start = angle;
        angle += (d.value / total) * 360;
        const end = angle;
        const large = end - start > 180 ? 1 : 0;
        const [sx, sy] = polar(cx, cy, start, trackR);
        const [ex, ey] = polar(cx, cy, end, trackR);
        const fill = resolveFill(this.colorCtx, d, i, true);
        const active = this.hoverIndex === i;
        return svg`<path
          class="loomi-radial-seg${active ? " is-active" : ""}"
          d="M ${sx} ${sy} A ${trackR} ${trackR} 0 ${large} 1 ${ex} ${ey}"
          fill="none"
          stroke=${fill}
          stroke-width=${active ? stroke + 2 : stroke}
          stroke-linecap="round"
          vector-effect="non-scaling-stroke"
        ></path>`;
      })}
      <text class="loomi-radial-total" x=${cx} y=${cy - 2} text-anchor="middle">${formatValue(total)}</text>
      <text class="loomi-radial-label" x=${cx} y=${cy + 12} text-anchor="middle">Total</text>
    `;
  }

  private renderPie(donut: boolean): SVGTemplateResult {
    const { cx, cy, radius: r } = POLAR;
    const innerR = donut ? Math.max(0, Math.min(r - 4, this.donutRadius)) : 0;
    const total = pieTotal(this.data) || 1;
    let angle = 0;

    const slices = this.data.map((d, i) => {
      const start = angle;
      angle += (d.value / total) * 360;
      const end = angle;
      const large = end - start > 180 ? 1 : 0;
      const [sx, sy] = polar(cx, cy, start, r);
      const [ex, ey] = polar(cx, cy, end, r);
      const fill = resolveFill(this.colorCtx, d, i, true);
      const border = resolveBorder(this.colorCtx, d, i, true);
      const sw = border ? 1.5 : 0;
      const active = this.hoverIndex === i;

      if (innerR <= 0) {
        return svg`<path
          class="loomi-slice${active ? " is-active" : ""}"
          d="M ${cx} ${cy} L ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey} Z"
          fill=${fill}
          stroke=${border ?? "none"}
          stroke-width=${sw}
          vector-effect="non-scaling-stroke"
        ></path>`;
      }

      const [isx, isy] = polar(cx, cy, start, innerR);
      const [iex, iey] = polar(cx, cy, end, innerR);
      return svg`<path
        class="loomi-slice${active ? " is-active" : ""}"
        d="M ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey} L ${iex} ${iey} A ${innerR} ${innerR} 0 ${large} 0 ${isx} ${isy} Z"
        fill=${fill}
        stroke=${border ?? "none"}
        stroke-width=${sw}
        vector-effect="non-scaling-stroke"
      ></path>`;
    });

    const center =
      donut && this.data.length
        ? svg`
            <text class="loomi-radial-total" x=${cx} y=${cy - 2} text-anchor="middle">${formatValue(total)}</text>
            <text class="loomi-radial-label" x=${cx} y=${cy + 12} text-anchor="middle">Total</text>
          `
        : nothing;

    return svg`${slices}${center}`;
  }

  private renderPointTooltips(): TemplateResult | typeof nothing {
    if (!this.showTooltip || !this.data.length) return nothing;

    if (this.isBandTooltipType()) {
      return nothing;
    }

    return html`<div class="loomi-hits">
      ${hoverTargets(this.type, this.data, this.layoutOpts()).map(
        (t) => html`
          <loomi-tooltip class="loomi-hit loomi-hit-point" shade="light">
            <span class="loomi-hit-area" style="left:${t.left}%;top:${t.top}%;width:${t.width}%;height:${t.height}%"></span>
            <div slot="content" class="loomi-chart-tip">
              <span class="loomi-chart-tip-label">${t.label}</span>
              <span class="loomi-chart-tip-value">${formatValue(t.value)}</span>
            </div>
          </loomi-tooltip>
        `,
      )}
    </div>`;
  }

  private renderTooltipRows(point: LoomiChartPoint): TemplateResult {
    if (point.values?.length) {
      const labels = groupedSeriesLabels(this.data);
      return html`${labels.map((label, seriesIndex) => {
        const sub = point.values!.find((v) => v.label === label);
        if (sub == null) return nothing;
        const dotColor = resolveGroupedSeriesFill(this.colorCtx, this.data, label, seriesIndex);
        return html`<div class="loomi-chart-tip-row">
          <span class="loomi-chart-tip-dot" style="background:${dotColor}"></span>
          <span class="loomi-chart-tip-series">${label}</span>
          <span class="loomi-chart-tip-value">${formatValue(sub.value)}</span>
        </div>`;
      })}`;
    }

    const rows = [
      html`<div class="loomi-chart-tip-row">
        <span class="loomi-chart-tip-dot"></span>
        <span class="loomi-chart-tip-series">${this.seriesLabel}</span>
        <span class="loomi-chart-tip-value">${formatValue(point.value)}</span>
      </div>`,
    ];
    if (point.value2 != null) {
      rows.push(html`<div class="loomi-chart-tip-row is-secondary">
        <span class="loomi-chart-tip-dot"></span>
        <span class="loomi-chart-tip-series">${this.series2Label}</span>
        <span class="loomi-chart-tip-value">${formatValue(point.value2)}</span>
      </div>`);
    }
    if (point.value3 != null) {
      rows.push(html`<div class="loomi-chart-tip-row is-tertiary">
        <span class="loomi-chart-tip-dot"></span>
        <span class="loomi-chart-tip-series">${this.series3Label}</span>
        <span class="loomi-chart-tip-value">${formatValue(point.value3)}</span>
      </div>`);
    }
    return html`${rows}`;
  }

  private renderLegend(): TemplateResult | typeof nothing {
    if (!this.showLegend || !this.data.length) return nothing;

    if (this.type === "bar" && hasGroupedValues(this.data)) {
      const labels = groupedSeriesLabels(this.data);
      return html`<div class="loomi-legend">
        ${labels.map(
          (label, i) => html`
            <span class="loomi-key">
              <span
                class="loomi-keydot"
                style="background:${resolveGroupedSeriesFill(this.colorCtx, this.data, label, i)}"
              ></span>
              ${label}
            </span>
          `,
        )}
      </div>`;
    }

    const palette = usesPalette(this.type);
    return html`<div class="loomi-legend">
      ${this.data.map(
        (d, i) => html`
          <span class="loomi-key">
            <span class="loomi-keydot" style="background:${resolveFill(this.colorCtx, d, i, palette)}"></span>
            ${d.label}
          </span>
        `,
      )}
    </div>`;
  }

  private renderFloatingTooltip(): TemplateResult | typeof nothing {
    if (!this.showTooltip || this.hoverIndex < 0 || !this.isBandTooltipType()) return nothing;
    const point = this.data[this.hoverIndex];
    if (!point) return nothing;
    const [x, y] = tooltipAnchor(this.type, this.data, this.hoverIndex, this.layoutOpts());
    const layout = this.isVerticalLine()
      ? verticalLineLayout(this.data, this.showYAxis)
      : cartesianLayout(this.data, this.layoutOpts());
    const left = (x / layout.width) * 100;
    const top = (y / layout.height) * 100;

    return html`
      <div class="loomi-floating-tip is-visible" style="left:${left}%;top:${top}%">
        <div class="loomi-chart-tip">
          <span class="loomi-chart-tip-label">${point.label}</span>
          ${this.renderTooltipRows(point)}
        </div>
      </div>
    `;
  }

  override render(): TemplateResult {
    const polar = isPolarType(this.type);
    const viewBox = polar ? `0 0 ${POLAR.size} ${POLAR.size}` : `0 0 ${CARTESIAN.width} ${CARTESIAN.height}`;
    let body: SVGTemplateResult;

    if (this.type === "bar") body = this.renderBars();
    else if (this.type === "line") body = this.renderSeries(true, true);
    else if (this.type === "area") body = this.renderSeries(false, true);
    else if (this.type === "scatter") body = this.renderScatter();
    else if (this.type === "radar") body = this.renderRadar();
    else if (this.type === "radial") body = this.renderRadial();
    else body = this.renderPie(this.type === "donut");

    const interactive = this.showTooltip && this.isBandTooltipType();
    const legend = this.renderLegend();

    const canvas = html`
      <div
        class="loomi-canvas${interactive ? " is-interactive" : ""}"
        @pointermove=${this.handlePointerMove}
        @pointerleave=${this.handlePointerLeave}
      >
        <svg viewBox=${viewBox} role="img" aria-label="${this.type} chart">${body}</svg>
        ${this.renderPointTooltips()}
        ${this.renderFloatingTooltip()}
      </div>
    `;

    const legendFirst = this.legendPosition === "top" || this.legendPosition === "left";

    return html`
      <div
        class="loomi-chart pos-${this.legendPosition}"
        style=${accentStyle(
          this.color,
          this.shade,
          this.showBorder,
          this.type === "radar" || this.type === "area",
          hasSecondarySeries(this.data) ? this.color2 : undefined,
          hasTertiarySeries(this.data) ? this.color3 : undefined,
        )}
      >
        ${legendFirst ? legend : nothing}
        ${canvas}
        ${legendFirst ? nothing : legend}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-chart": LoomiChart;
  }
}

export type {
  LoomiChartType,
  LoomiChartShade,
  LoomiChartPoint,
  LoomiChartSubValue,
  LoomiChartLegendPosition,
} from "./types.js";
