import type { LoomiColor } from "@loomidev/core";

export type LoomiChartType =
  | "bar"
  | "line"
  | "area"
  | "pie"
  | "donut"
  | "radar"
  | "radial"
  | "scatter";

export type LoomiChartShade = "light" | "dark";

export type LoomiChartLegendPosition = "top" | "bottom" | "left" | "right";
export type LoomiChartSeriesType = "bar" | "line";

/** One bar in a grouped category — e.g. a single dev's task count for Monday. */
export interface LoomiChartSubValue {
  label: string;
  value: number;
  color?: string;
}

export interface LoomiChartPoint {
  label: string;
  value: number;
  /** Optional second series value — renders grouped bars or a second line. */
  value2?: number;
  /** Optional third series value — renders a third grouped bar. */
  value3?: number;
  /** Named grouped bars for `type="bar"` — compare several metrics per x-axis category. */
  values?: LoomiChartSubValue[];
  color?: string;
  color2?: string;
  color3?: string;
}

/** Resolved layout for cartesian charts (bar, line, area, scatter). */
export interface CartesianLayout {
  width: number;
  height: number;
  pad: number;
  padLeft: number;
  padRight: number;
  padTop: number;
  padBottom: number;
  max: number;
  step: number;
  bandWidth: number;
  /** Pixel coordinates per data point `[x, y]`. */
  points: [number, number][];
}

/** A hover hit region, in percent of the chart canvas. */
export interface ChartHoverTarget {
  left: number;
  top: number;
  width: number;
  height: number;
  index: number;
  label: string;
  value: number;
  /** When true, `left`/`top` mark the box center (point targets). */
  centered?: boolean;
}

export interface ChartColorContext {
  color: LoomiColor;
  color2?: LoomiColor;
  color3?: LoomiColor;
  shade: LoomiChartShade;
  showBorder: boolean;
}
