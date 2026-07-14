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
  LoomiChartSeriesType,
  LoomiChartShade,
  LoomiChartType,
} from "./types.js";

/**
 * `<loomi-chart>` — SVG charts inspired by shadcn/ui and Untitled UI: `bar`, `line`,
 * `area`, `pie`, `donut`, `radar`, `radial`, `scatter`, or `heatmap`. Pass a single series via
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
  @property({ attribute: "series2-type" }) series2Type: LoomiChartSeriesType = "bar";
  @property({ type: Boolean, attribute: "show-legend" }) showLegend = false;
  @property({ attribute: "legend-position" }) legendPosition: LoomiChartLegendPosition = "bottom";
  @property({ type: Number, attribute: "donut-radius" }) donutRadius = 44;
  @property() shade: LoomiChartShade = "dark";
  @property({ type: Boolean, attribute: "show-border", converter: booleanAttribute }) showBorder =
    true;
  @property({ type: Boolean, attribute: "show-y-axis", converter: booleanAttribute }) showYAxis =
    true;
  @property({ type: Boolean, attribute: "show-grid" }) showGrid = true;
  /** Show a tooltip while hovering chart points. Cartesian charts track the nearest point as you move across the plot. */
  @property({ type: Boolean, attribute: "show-tooltip", converter: booleanAttribute }) showTooltip =
    true;
  @property({ type: Boolean, attribute: "with-gap", converter: booleanAttribute }) withGap = false;
  @property({ type: Boolean }) vertical = false;
  @property({ type: Boolean }) exportable = false;

  @state() private hoverIndex = -1;
  @state() private heatmapRowIndex = -1;
  @state() private pointerLeft = 0;
  @state() private pointerTop = 0;
  @state() private exportMenuOpen = false;

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

  private get mixedBarLine(): boolean {
    return this.type === "bar" && this.series2Type === "line" && this.dualSeries();
  }

  private seriesPoints(
    layout: ReturnType<typeof cartesianLayout>,
    field: "value" | "value2",
  ): [number, number][] {
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
      this.type === "scatter" ||
      this.type === "heatmap"
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
    this.pointerLeft = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
    this.pointerTop = Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100));
    let next = nearestIndex(this.type, this.data, this.layoutOpts(), ratio);
    if (next !== this.hoverIndex) this.hoverIndex = next;
    if (this.type === "heatmap") {
      const rows = groupedSeriesLabels(this.data);
      const padLeft = this.heatmapPadLeft(rows);
      const x = ((event.clientX - rect.left) / rect.width) * CARTESIAN.width;
      const plotWidth = CARTESIAN.width - padLeft - CARTESIAN.pad;
      next = Math.max(
        0,
        Math.min(this.data.length - 1, Math.floor(((x - padLeft) / plotWidth) * this.data.length)),
      );
      if (next !== this.hoverIndex) this.hoverIndex = next;
      const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
      const plotTop = CARTESIAN.pad / CARTESIAN.height;
      const plotBottom = (CARTESIAN.height - CARTESIAN.pad) / CARTESIAN.height;
      const plotRatio = (y - plotTop) / (plotBottom - plotTop);
      this.heatmapRowIndex = Math.max(
        0,
        Math.min(rows.length - 1, Math.floor(plotRatio * rows.length)),
      );
    }
  }

  private handlePointerLeave(): void {
    this.hoverIndex = -1;
    this.heatmapRowIndex = -1;
  }

  private renderGrid(
    layout: ReturnType<typeof cartesianLayout>,
  ): SVGTemplateResult | typeof nothing {
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

  private renderYAxis(
    layout: ReturnType<typeof cartesianLayout>,
  ): SVGTemplateResult | typeof nothing {
    if (!this.showYAxis) return nothing;
    const { padLeft, padTop, padBottom, height: H, max } = layout;
    return svg`
      <line class="loomi-axis" x1=${padLeft} y1=${padTop} x2=${padLeft} y2=${H - padBottom} vector-effect="non-scaling-stroke"></line>
      <text class="loomi-ylabel" x=${padLeft - 8} y=${padTop + 4} text-anchor="end">${max}</text>
      <text class="loomi-ylabel" x=${padLeft - 8} y=${H - padBottom + 4} text-anchor="end">0</text>
    `;
  }

  private renderCrosshair(
    layout: ReturnType<typeof cartesianLayout>,
  ): SVGTemplateResult | typeof nothing {
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
    const seriesCount = this.mixedBarLine ? 1 : barSeriesCount(this.data);
    const groupRatio =
      seriesCount > 1 ? Math.min(0.88, 0.68 + seriesCount * 0.04) : BAR_WIDTH_RATIO;
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
        ${
          border
            ? svg`<path class="loomi-bar-border" d=${roundedTopRectBorderPath(bar.x, bar.y, bar.w, bar.h, bar.r)} fill="none" stroke=${border} stroke-width="1.5" stroke-linejoin="round" vector-effect="non-scaling-stroke"></path>`
            : nothing
        }
      `;
    };

    const linePoints = this.mixedBarLine ? this.seriesPoints(layout, "value2") : [];
    const line = linePoints.map((p) => `${p[0]},${p[1]}`).join(" ");

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
          ${
            showXLabel(i, bandWidth)
              ? svg`<text class="loomi-xlabel" x=${padLeft + i * bandWidth + bandWidth / 2} y=${H - padBottom + 12} text-anchor="middle">${d.label}</text>`
              : nothing
          }
        `;
      })}
      ${
        this.mixedBarLine
          ? svg`
            <polyline class="loomi-line loomi-line-2" points=${line} fill="none" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"></polyline>
            ${linePoints.map(([x, y], i) => svg`<circle class="loomi-dot loomi-dot-2${this.hoverIndex === i ? " is-active" : ""}" cx=${x} cy=${y} r=${this.hoverIndex === i ? 3.5 : 2.5} vector-effect="non-scaling-stroke"></circle>`)}
          `
          : nothing
      }
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
      ${
        vertical
          ? svg`
            <line class="loomi-axis" x1=${padLeft} y1=${padTop} x2=${padLeft} y2=${H - padBottom} vector-effect="non-scaling-stroke"></line>
            ${
              this.showYAxis
                ? svg`
                  <line class="loomi-axis" x1=${padLeft} y1=${H - padBottom} x2=${W - padRight} y2=${H - padBottom} vector-effect="non-scaling-stroke"></line>
                  <text class="loomi-ylabel" x=${padLeft} y=${H - padBottom + 14} text-anchor="middle">0</text>
                  <text class="loomi-ylabel" x=${W - padRight} y=${H - padBottom + 14} text-anchor="middle">${max}</text>
                `
                : nothing
            }
          `
          : svg`
            ${this.renderGrid(layout)}
            ${this.renderYAxis(layout)}
            ${this.renderCrosshair(layout)}
          `
      }
      ${
        showArea
          ? svg`<polygon class="loomi-area" points=${area} fill="url(#loomi-area-grad)"></polygon>`
          : nothing
      }
      ${
        this.dualSeries()
          ? svg`<polyline class="loomi-line loomi-line-2" points=${line2} fill="none" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"></polyline>`
          : nothing
      }
      <polyline class="loomi-line" points=${line} fill="none" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"></polyline>
      ${
        showDots
          ? points.map(([x, y], i) => {
              const active = this.hoverIndex === i;
              const p2 = points2[i];
              return svg`
              ${
                p2
                  ? svg`<circle class="loomi-dot loomi-dot-2${active ? " is-active" : ""}" cx=${p2[0]} cy=${p2[1]} r=${active ? 3.5 : 2.5} vector-effect="non-scaling-stroke"></circle>`
                  : nothing
              }
              <circle class="loomi-dot${active ? " is-active" : ""}" cx=${x} cy=${y} r=${active ? 3.5 : 2.5} vector-effect="non-scaling-stroke"></circle>
              ${
                !vertical && showXLabel(i, layout.bandWidth)
                  ? svg`<text class="loomi-xlabel" x=${x} y=${H - padBottom + 12} text-anchor="middle">${this.data[i].label}</text>`
                  : vertical
                    ? svg`<text class="loomi-xlabel" x=${padLeft - 8} y=${y + 4} text-anchor="end">${this.data[i].label}</text>`
                    : nothing
              }
            `;
            })
          : points.map(([x], i) =>
              showXLabel(i, layout.bandWidth)
                ? svg`<text class="loomi-xlabel" x=${x} y=${H - padBottom + 12} text-anchor="middle">${this.data[i].label}</text>`
                : svg``,
            )
      }
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
          ${
            showXLabel(i, bandWidth)
              ? svg`<text class="loomi-xlabel" x=${padLeft + i * bandWidth + bandWidth / 2} y=${H - padBottom + 12} text-anchor="middle">${d.label}</text>`
              : nothing
          }
        `;
      })}
    `;
  }

  private renderHeatmap(): SVGTemplateResult {
    const rows = groupedSeriesLabels(this.data);
    const { width: W, height: H, pad } = CARTESIAN;
    const padLeft = this.heatmapPadLeft(rows);
    const padRight = pad;
    const padTop = pad;
    const padBottom = pad;
    const cellW = (W - padLeft - padRight) / Math.max(1, this.data.length);
    const cellH = (H - padTop - padBottom) / Math.max(1, rows.length);
    const values = this.data.flatMap((point) => point.values?.map((item) => item.value) ?? []);
    const max = Math.max(1, ...values);

    return svg`
      ${this.data.flatMap((point, columnIndex) =>
        rows.map((row, rowIndex) => {
          const item = point.values?.find((entry) => entry.label === row);
          const value = item?.value ?? 0;
          const active = this.hoverIndex === columnIndex && this.heatmapRowIndex === rowIndex;
          const fill = item?.color
            ? resolveGroupedSeriesFill(this.colorCtx, this.data, row, rowIndex)
            : "var(--_loomi-accent)";
          return svg`<rect
            class="loomi-heatmap-cell${active ? " is-active" : ""}"
            x=${padLeft + columnIndex * cellW + 1}
            y=${padTop + rowIndex * cellH + 1}
            width=${Math.max(0, cellW - 2)}
            height=${Math.max(0, cellH - 2)}
            rx="2"
            fill=${fill}
            fill-opacity=${0.12 + (value / max) * 0.88}
          ><title>${point.label} · ${row}: ${formatValue(value)}</title></rect>`;
        }),
      )}
      ${this.data.map((point, i) => svg`<text class="loomi-xlabel" x=${padLeft + (i + 0.5) * cellW} y=${H - 4} text-anchor="middle">${point.label}</text>`)}
      ${rows.map((row, i) => svg`<text class="loomi-ylabel" x=${padLeft - 6} y=${padTop + (i + 0.5) * cellH + 3} text-anchor="end">${row}</text>`)}
    `;
  }

  private heatmapPadLeft(rows: string[]): number {
    return rows.length
      ? Math.max(42, Math.min(76, Math.max(...rows.map((label) => label.length)) * 5 + 10))
      : 42;
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
      const border = this.withGap
        ? "var(--loomi-surface)"
        : resolveBorder(this.colorCtx, d, i, true);
      const sw = this.withGap ? 2.5 : border ? 1.5 : 0;
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
      if (this.type === "heatmap" && this.heatmapRowIndex >= 0) {
        const label = labels[this.heatmapRowIndex];
        const sub = point.values.find((value) => value.label === label);
        if (!sub) return html``;
        return html`<div class="loomi-chart-tip-row">
          <span class="loomi-chart-tip-dot"></span>
          <span class="loomi-chart-tip-series">${label}</span>
          <span class="loomi-chart-tip-value">${formatValue(sub.value)}</span>
        </div>`;
      }
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

  private renderExportMenu(): TemplateResult | typeof nothing {
    if (!this.exportable) return nothing;
    return html`<div class="loomi-chart-export">
      <button
        class="loomi-chart-export-trigger"
        type="button"
        aria-haspopup="menu"
        aria-expanded=${this.exportMenuOpen ? "true" : "false"}
        @click=${() => (this.exportMenuOpen = !this.exportMenuOpen)}
      >Export</button>
      ${
        this.exportMenuOpen
          ? html`<div class="loomi-chart-export-menu" role="menu">
            <button type="button" role="menuitem" @click=${() => this.exportAs("png")}>PNG</button>
            <button type="button" role="menuitem" @click=${() => this.exportAs("pdf")}>PDF</button>
            <button type="button" role="menuitem" @click=${() => this.exportAs("svg")}>SVG</button>
            <button type="button" role="menuitem" @click=${() => this.exportAs("csv")}>CSV</button>
            <button type="button" role="menuitem" @click=${() => this.exportAs("json")}>JSON</button>
          </div>`
          : nothing
      }
    </div>`;
  }

  private fileBaseName(): string {
    return `${this.localName || "loomi-chart"}-${this.type}`;
  }

  private serializeSvg(): string {
    const svgEl = this.renderRoot.querySelector("svg");
    if (!svgEl) return "";
    const clone = svgEl.cloneNode(true) as SVGSVGElement;
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    const rect = svgEl.getBoundingClientRect();
    const viewBox = svgEl.getAttribute("viewBox")?.split(/\s+/).map(Number) ?? [0, 0, 320, 132];
    clone.setAttribute("width", String(Math.max(1, Math.round(rect.width || viewBox[2] || 320))));
    clone.setAttribute("height", String(Math.max(1, Math.round(rect.height || viewBox[3] || 132))));
    return new XMLSerializer().serializeToString(clone);
  }

  private downloadBytes(filename: string, bytes: BlobPart[], type: string): void {
    const url = URL.createObjectURL(new Blob(bytes, { type }));
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  private async chartCanvas(
    type: "image/png" | "image/jpeg" = "image/png",
  ): Promise<HTMLCanvasElement> {
    const markup = this.serializeSvg();
    const svgBlob = new Blob([markup], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    const loaded = new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Unable to render chart export image"));
    });
    img.src = url;
    await loaded;
    URL.revokeObjectURL(url);
    const scale = 2;
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, img.naturalWidth * scale);
    canvas.height = Math.max(1, img.naturalHeight * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Unable to create chart export canvas");
    if (type === "image/jpeg") {
      // loomi-audit-allow-token: opaque matte for JPEG export (can't be transparent) when --loomi-surface is unset
      ctx.fillStyle = getComputedStyle(this).getPropertyValue("--loomi-surface") || "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas;
  }

  private async canvasBlob(
    canvas: HTMLCanvasElement,
    type: string,
    quality?: number,
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Unable to export chart image"))),
        type,
        quality,
      );
    });
  }

  private dataCsv(): string {
    const header = ["label", "value", "value2", "value3", "color", "color2", "color3"];
    const esc = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;
    return [
      header.join(","),
      ...this.data.map((point) =>
        header.map((key) => esc(point[key as keyof LoomiChartPoint])).join(","),
      ),
    ].join("\n");
  }

  private ascii(value: string): Uint8Array {
    return new TextEncoder().encode(value);
  }

  private jpegBytes(dataUrl: string): Uint8Array {
    const binary = atob(dataUrl.split(",")[1] ?? "");
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }

  private pdfBytes(jpeg: Uint8Array, width: number, height: number): Uint8Array {
    const chunks: Uint8Array[] = [];
    const offsets: number[] = [];
    let offset = 0;
    const push = (chunk: Uint8Array): void => {
      chunks.push(chunk);
      offset += chunk.byteLength;
    };
    const obj = (value: string): void => {
      offsets.push(offset);
      push(this.ascii(value));
    };
    push(this.ascii("%PDF-1.4\n"));
    obj("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");
    obj("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n");
    obj(
      `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${width} ${height}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`,
    );
    offsets.push(offset);
    push(
      this.ascii(
        `4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.byteLength} >>\nstream\n`,
      ),
    );
    push(jpeg);
    push(this.ascii("\nendstream\nendobj\n"));
    const contents = `q\n${width} 0 0 ${height} 0 0 cm\n/Im0 Do\nQ\n`;
    obj(`5 0 obj\n<< /Length ${contents.length} >>\nstream\n${contents}endstream\nendobj\n`);
    const xrefOffset = offset;
    push(
      this.ascii(
        `xref\n0 6\n0000000000 65535 f \n${offsets.map((item) => `${String(item).padStart(10, "0")} 00000 n `).join("\n")}\ntrailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`,
      ),
    );
    const out = new Uint8Array(offset);
    let cursor = 0;
    for (const chunk of chunks) {
      out.set(chunk, cursor);
      cursor += chunk.byteLength;
    }
    return out;
  }

  private async exportAs(format: "png" | "pdf" | "svg" | "csv" | "json"): Promise<void> {
    this.exportMenuOpen = false;
    const base = this.fileBaseName();
    if (format === "svg") {
      this.downloadBytes(`${base}.svg`, [this.serializeSvg()], "image/svg+xml;charset=utf-8");
      return;
    }
    if (format === "csv") {
      this.downloadBytes(`${base}.csv`, [this.dataCsv()], "text/csv;charset=utf-8");
      return;
    }
    if (format === "json") {
      this.downloadBytes(
        `${base}.json`,
        [JSON.stringify(this.data, null, 2)],
        "application/json;charset=utf-8",
      );
      return;
    }
    if (format === "png") {
      const canvas = await this.chartCanvas();
      this.downloadBytes(`${base}.png`, [await this.canvasBlob(canvas, "image/png")], "image/png");
      return;
    }
    const canvas = await this.chartCanvas("image/jpeg");
    const jpegUrl = canvas.toDataURL("image/jpeg", 0.92);
    const pdf = this.pdfBytes(this.jpegBytes(jpegUrl), canvas.width, canvas.height);
    this.downloadBytes(`${base}.pdf`, [pdf as unknown as BlobPart], "application/pdf");
  }

  private renderFloatingTooltip(): TemplateResult | typeof nothing {
    if (!this.showTooltip || this.hoverIndex < 0 || !this.isBandTooltipType()) return nothing;
    const point = this.data[this.hoverIndex];
    if (!point) return nothing;
    return html`
      <div class="loomi-floating-tip is-visible" style="left:${this.pointerLeft}%;top:${this.pointerTop}%">
        <div class="loomi-chart-tip">
          <span class="loomi-chart-tip-label">${point.label}</span>
          ${this.renderTooltipRows(point)}
        </div>
      </div>
    `;
  }

  override render(): TemplateResult {
    const polar = isPolarType(this.type);
    const viewBox = polar
      ? `0 0 ${POLAR.size} ${POLAR.size}`
      : `0 0 ${CARTESIAN.width} ${CARTESIAN.height}`;
    let body: SVGTemplateResult;

    if (this.type === "bar") body = this.renderBars();
    else if (this.type === "line") body = this.renderSeries(true, true);
    else if (this.type === "area") body = this.renderSeries(false, true);
    else if (this.type === "scatter") body = this.renderScatter();
    else if (this.type === "heatmap") body = this.renderHeatmap();
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
        ${this.renderExportMenu()}
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
