import { html } from "lit";
import "@loomidev/chart/loomi-chart.js";
import type { LoomiChartPoint, LoomiChartType } from "@loomidev/chart";
import { defineGridModule, type GridModule } from "../grid-module.js";
import { getRowMeta } from "../grid-utils.js";
import type { DataGridRecord } from "../types.js";

export interface ChartsModuleOptions<TRecord extends DataGridRecord = DataGridRecord> {
  /** Column used as each point's label. */
  labelField: keyof TRecord & string;
  /** Numeric column used as each point's value. */
  valueField: keyof TRecord & string;
  /** Chart type from `@loomidev/chart`. Defaults to `"bar"`. */
  type?: LoomiChartType;
  color?: string;
  /** Cap on the number of points rendered (charts get unreadable past a few dozen). Defaults to `20`. */
  limit?: number;
}

/**
 * Renders a `<loomi-chart>` below the grid, summarizing the currently
 * processed (filtered/sorted) rows as label/value points.
 *
 * ```ts
 * grid.modules = [chartsModule({ labelField: "month", valueField: "revenue", type: "line" })];
 * ```
 */
export function chartsModule<TRecord extends DataGridRecord = DataGridRecord>(
  options: ChartsModuleOptions<TRecord>,
): GridModule<TRecord> {
  return defineGridModule<TRecord>({
    name: "charts",

    renderBelowTable(rows) {
      const dataRows = rows.filter((row) => {
        const meta = getRowMeta(row);
        return meta == null || meta.type === "data";
      });

      const points: LoomiChartPoint[] = dataRows.slice(0, options.limit ?? 20).map((row) => ({
        label: String(row[options.labelField] ?? ""),
        value: Number(row[options.valueField]) || 0,
      }));

      if (points.length === 0) {
        return undefined;
      }

      return html`<loomi-chart type=${options.type ?? "bar"} color=${options.color ?? "primary"} .data=${points}></loomi-chart>`;
    },
  });
}
