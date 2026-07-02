import { accentVars, cssColor, type LoomiColor } from "@loomidev/core";
import type {
  CartesianLayout,
  ChartColorContext,
  ChartHoverTarget,
  LoomiChartPoint,
  LoomiChartType,
} from "./types.js";

export const PALETTE = [
  "primary",
  "success",
  "warning",
  "error",
  "purple",
  "cyan",
  "pink",
  "blue",
] as const;

export const BAR_WIDTH_RATIO = 0.45;
export const HOVER_HIT_PCT = 9;

export const CARTESIAN = { width: 320, height: 132, pad: 18 } as const;

/** Skip crowded x-axis labels so month names stay legible without overlapping. */
export function showXLabel(index: number, bandWidth: number): boolean {
  if (bandWidth >= 20) return true;
  if (bandWidth >= 14) return index % 2 === 0;
  return index % 3 === 0;
}
export const POLAR = { size: 180, cx: 90, cy: 90, radius: 80, radarRadius: 64 } as const;

export const booleanAttribute = {
  fromAttribute(value: string | null): boolean {
    return value !== null && value.toLowerCase() !== "false";
  },
  toAttribute(value: boolean): string | null {
    return value ? "" : null;
  },
};

export const dataAttribute = {
  fromAttribute(value: string | null): LoomiChartPoint[] {
    if (!value) return [];
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },
  toAttribute(value: LoomiChartPoint[]): string {
    return JSON.stringify(value);
  },
};

export function isPolarType(type: LoomiChartType): boolean {
  return type === "pie" || type === "donut" || type === "radar" || type === "radial";
}

export function usesPalette(type: LoomiChartType): boolean {
  return type === "pie" || type === "donut" || type === "radial";
}

export function hasSecondarySeries(data: LoomiChartPoint[]): boolean {
  return data.some((d) => d.value2 != null);
}

export function maxValue(data: LoomiChartPoint[]): number {
  return Math.max(
    1,
    ...data.flatMap((d) => [d.value, d.value2].filter((v): v is number => v != null)),
  );
}

export function segmentFillShade(shade: "light" | "dark"): number {
  return shade === "light" ? 50 : 500;
}

export function resolveFill(
  ctx: ChartColorContext,
  p: LoomiChartPoint,
  i: number,
  usePalette: boolean,
  secondary = false,
): string {
  const c = secondary
    ? p.color2 || ctx.color2 || ctx.color
    : p.color || (usePalette ? PALETTE[i % PALETTE.length] : ctx.color);
  return /^[a-z]+$/.test(c) ? cssColor(c, segmentFillShade(ctx.shade)) : c;
}

export function resolveBorder(
  ctx: ChartColorContext,
  p: LoomiChartPoint,
  i: number,
  usePalette: boolean,
  secondary = false,
): string | null {
  if (ctx.shade !== "light" || !ctx.showBorder) return null;
  const c = secondary
    ? p.color2 || ctx.color2 || ctx.color
    : p.color || (usePalette ? PALETTE[i % PALETTE.length] : ctx.color);
  return /^[a-z]+$/.test(c) ? cssColor(c, 200) : null;
}

export function accentStyle(
  color: LoomiColor,
  shade: "light" | "dark",
  showBorder: boolean,
  withBorder = false,
  color2?: LoomiColor,
): string {
  const light = shade === "light";
  const strokeShade = light ? (withBorder && showBorder ? 600 : 400) : 600;
  const fillShade = light ? 100 : 50;
  let style = `${accentVars(color)}--_loomi-accent:${cssColor(color, strokeShade)};--_loomi-accent-softer:${cssColor(color, fillShade)};`;
  if (color2) {
    style += `--_loomi-accent-2:${cssColor(color2, strokeShade)};--_loomi-accent-2-softer:${cssColor(color2, fillShade)};`;
  }
  return style;
}

/** Pixel anchor for a cartesian tooltip — band center x, top of the hovered category. */
export function tooltipAnchor(
  type: LoomiChartType,
  data: LoomiChartPoint[],
  index: number,
  opts: { showYAxis: boolean; vertical: boolean },
): [number, number] {
  const layout = cartesianLayout(data, opts);
  const { height: H, padLeft, padTop, padBottom, bandWidth, max, points } = layout;
  const d = data[index];
  if (!d) return [0, 0];

  if (type === "bar") {
    const x = padLeft + index * bandWidth + bandWidth / 2;
    const topVal = Math.max(d.value, d.value2 ?? 0);
    const y = H - padBottom - (topVal / max) * (H - padTop - padBottom);
    return [x, y];
  }

  const [x, y1] = points[index] ?? [0, 0];
  if (d.value2 == null) return [x, y1];
  const y2 = H - padBottom - (d.value2 / max) * (H - padTop - padBottom);
  return [x, Math.min(y1, y2)];
}

export function polar(cx: number, cy: number, deg: number, radius: number): [number, number] {
  const a = ((deg - 90) * Math.PI) / 180;
  return [cx + radius * Math.cos(a), cy + radius * Math.sin(a)];
}

/** Draws a rect-like path with rounded top corners and square bottom corners. */
export function roundedTopRectPath(x: number, y: number, w: number, h: number, r: number): string {
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

/** Open path for a bar border — no bottom edge (sits on the axis). */
export function roundedTopRectBorderPath(x: number, y: number, w: number, h: number, r: number): string {
  const rr = Math.max(0, Math.min(r, w / 2, h));
  if (rr <= 0) return `M${x},${y + h} V${y} H${x + w} V${y + h}`;
  return [
    `M${x},${y + h}`,
    `V${y + rr}`,
    `A${rr},${rr} 0 0 1 ${x + rr},${y}`,
    `H${x + w - rr}`,
    `A${rr},${rr} 0 0 1 ${x + w},${y + rr}`,
    `V${y + h}`,
  ].join(" ");
}

export function cartesianLayout(
  data: LoomiChartPoint[],
  opts: { showYAxis: boolean; vertical: boolean },
): CartesianLayout {
  const { width: W, height: H, pad } = CARTESIAN;
  const padLeft = opts.showYAxis ? 34 : pad;
  const padRight = pad;
  const padTop = pad;
  const padBottom = pad;
  const max = maxValue(data);
  const n = data.length;
  const step = n > 1 ? (W - padLeft - padRight) / (n - 1) : 0;
  const bandWidth = n > 0 ? (W - padLeft - padRight) / Math.max(n, 1) : W - padLeft - padRight;

  const points: [number, number][] = data.map((d, i) => {
    const x = n > 1 ? padLeft + i * step : (padLeft + W - padRight) / 2;
    const y = H - padBottom - (d.value / max) * (H - padTop - padBottom);
    return [x, y];
  });

  return { width: W, height: H, pad, padLeft, padRight, padTop, padBottom, max, step, bandWidth, points };
}

export function verticalLineLayout(
  data: LoomiChartPoint[],
  showYAxis: boolean,
): CartesianLayout {
  const W = CARTESIAN.width;
  const H = CARTESIAN.height;
  const padLeft = 40;
  const padTop = 16;
  const padRight = 16;
  const padBottom = showYAxis ? 32 : 16;
  const max = maxValue(data);
  const n = data.length;
  const step = n > 1 ? (H - padTop - padBottom) / (n - 1) : 0;
  const bandWidth = n > 0 ? (H - padTop - padBottom) / Math.max(n, 1) : H - padTop - padBottom;

  const points: [number, number][] = data.map((d, i) => [
    padLeft + (d.value / max) * (W - padLeft - padRight),
    padTop + i * step,
  ]);

  return {
    width: W,
    height: H,
    pad: CARTESIAN.pad,
    padLeft,
    padRight,
    padTop,
    padBottom,
    max,
    step,
    bandWidth,
    points,
  };
}

export function gridLineYs(layout: CartesianLayout, count = 4): number[] {
  const { height: H, padTop, padBottom } = layout;
  const inner = H - padTop - padBottom;
  return Array.from({ length: count }, (_, i) => padTop + (inner * i) / (count - 1));
}

export function gridLineXs(layout: CartesianLayout, count = 4): number[] {
  const { padLeft, padRight, width: W } = layout;
  const inner = W - padLeft - padRight;
  return Array.from({ length: count }, (_, i) => padLeft + (inner * i) / (count - 1));
}

function pointTarget(
  x: number,
  y: number,
  w: number,
  h: number,
  index: number,
  d: LoomiChartPoint,
): ChartHoverTarget {
  const hit = HOVER_HIT_PCT;
  return {
    left: (x / w) * 100,
    top: (y / h) * 100,
    width: hit,
    height: hit,
    index,
    label: d.label,
    value: d.value,
    centered: true,
  };
}

function bandTarget(
  left: number,
  top: number,
  width: number,
  height: number,
  w: number,
  h: number,
  index: number,
  d: LoomiChartPoint,
): ChartHoverTarget {
  return {
    left: (left / w) * 100,
    top: (top / h) * 100,
    width: (width / w) * 100,
    height: (height / h) * 100,
    index,
    label: d.label,
    value: d.value,
  };
}

/** Hover regions aligned to chart geometry — cartesian types use full bands for crosshair-style tooltips. */
export function hoverTargets(
  type: LoomiChartType,
  data: LoomiChartPoint[],
  opts: { showYAxis: boolean; vertical: boolean; donutRadius: number },
): ChartHoverTarget[] {
  if (type === "bar") {
    const layout = cartesianLayout(data, opts);
    const { width: W, height: H, padLeft, bandWidth } = layout;
    return data.map((d, i) =>
      bandTarget(padLeft + i * bandWidth, 0, bandWidth, H, W, H, i, d),
    );
  }

  if (type === "line" && opts.vertical) {
    const layout = verticalLineLayout(data, opts.showYAxis);
    const { width: W, height: H, padTop, bandWidth } = layout;
    return data.map((d, i) =>
      bandTarget(0, padTop + i * bandWidth - bandWidth / 2, W, bandWidth, W, H, i, d),
    );
  }

  if (type === "line" || type === "area" || type === "scatter") {
    const layout = cartesianLayout(data, opts);
    const { width: W, height: H, padLeft, bandWidth } = layout;
    return data.map((d, i) =>
      bandTarget(padLeft + i * bandWidth - bandWidth / 2, 0, bandWidth, H, W, H, i, d),
    );
  }

  if (type === "radar") {
    const { cx, cy, radarRadius: R } = POLAR;
    const S = POLAR.size;
    const n = data.length || 1;
    const max = maxValue(data);
    const step = 360 / n;
    return data.map((d, i) => {
      const [x, y] = polar(cx, cy, i * step, (d.value / max) * R);
      return pointTarget(x, y, S, S, i, d);
    });
  }

  if (type === "radial") {
    const { cx, cy, radius: r } = POLAR;
    const S = POLAR.size;
    const total = data.reduce((s, d) => s + d.value, 0) || 1;
    let angle = 0;
    return data.map((d, i) => {
      const start = angle;
      angle += (d.value / total) * 360;
      const mid = (start + angle) / 2;
      const [x, y] = polar(cx, cy, mid, r * 0.72);
      return pointTarget(x, y, S, S, i, d);
    });
  }

  // pie / donut
  const { cx, cy, radius: r } = POLAR;
  const S = POLAR.size;
  const innerR =
    type === "donut" ? Math.max(0, Math.min(r - 4, opts.donutRadius)) : 0;
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  let angle = 0;
  return data.map((d, i) => {
    const start = angle;
    angle += (d.value / total) * 360;
    const mid = (start + angle) / 2;
    const midR = innerR > 0 ? (innerR + r) / 2 : r * 0.6;
    const [x, y] = polar(cx, cy, mid, midR);
    return pointTarget(x, y, S, S, i, d);
  });
}

/** Nearest data index from a pointer position (0–1) along the primary axis. */
export function nearestIndex(
  type: LoomiChartType,
  data: LoomiChartPoint[],
  opts: { showYAxis: boolean; vertical: boolean },
  ratio: number,
): number {
  if (!data.length) return -1;
  const clamped = Math.max(0, Math.min(1, ratio));
  const n = data.length;
  if (n === 1) return 0;

  if (type === "line" && opts.vertical) {
    const layout = verticalLineLayout(data, opts.showYAxis);
    const y = clamped * layout.height;
    let best = 0;
    let bestDist = Infinity;
    for (let i = 0; i < n; i++) {
      const cy = layout.padTop + i * layout.bandWidth + layout.bandWidth / 2;
      const dist = Math.abs(cy - y);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    }
    return best;
  }

  if (type === "bar" || type === "line" || type === "area" || type === "scatter") {
    const layout = cartesianLayout(data, opts);
    const x = clamped * layout.width;

    if (type === "bar") {
      let best = 0;
      let bestDist = Infinity;
      for (let i = 0; i < n; i++) {
        const cx = layout.padLeft + i * layout.bandWidth + layout.bandWidth / 2;
        const dist = Math.abs(cx - x);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      }
      return best;
    }

    let best = 0;
    let bestDist = Infinity;
    for (let i = 0; i < n; i++) {
      const cx = layout.points[i]?.[0] ?? 0;
      const dist = Math.abs(cx - x);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    }
    return best;
  }

  return -1;
}

export function formatValue(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toLocaleString(undefined, { maximumFractionDigits: 1 });
}

export function pieTotal(data: LoomiChartPoint[]): number {
  return data.reduce((s, d) => s + d.value, 0);
}
