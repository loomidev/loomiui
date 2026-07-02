import { defineGridModule, type GridModule } from "../grid-module.js";
import { aggregateValues, formatCellValue } from "../grid-utils.js";
import type { DataGridAggregate, DataGridColumn, DataGridRecord } from "../types.js";

export interface PivotModuleOptions<TRecord extends DataGridRecord = DataGridRecord> {
  /** Source column whose distinct values become pivot rows. */
  rowField: keyof TRecord & string;
  /** Source column whose distinct values become pivot columns. */
  columnField: keyof TRecord & string;
  /** Source column whose values are aggregated into each pivot cell. */
  valueField: keyof TRecord & string;
  /** Aggregate applied per (row, column) bucket. Defaults to `"sum"`. */
  aggregate?: DataGridAggregate;
  /** Label for the leading row-field column. Defaults to `rowField`. */
  rowLabel?: string;
}

/**
 * Reshapes flat rows into a row/column/value pivot matrix — e.g. rows of
 * `{ region, quarter, revenue }` become one row per `region` with a column
 * per `quarter` holding summed `revenue`. Replaces both the row set and the
 * column set, so it composes best on its own (place it last in `modules`).
 *
 * ```ts
 * grid.modules = [pivotModule({ rowField: "region", columnField: "quarter", valueField: "revenue" })];
 * ```
 */
export function pivotModule<TRecord extends DataGridRecord = DataGridRecord>(
  options: PivotModuleOptions<TRecord>
): GridModule<TRecord> {
  let computedColumns: DataGridColumn<DataGridRecord>[] = [];

  return defineGridModule<TRecord>({
    name: "pivot",
    stage: "shape",

    transformRows(rows) {
      const buckets = new Map<string, TRecord[]>();
      const columnValues = new Set<string>();

      for (const row of rows) {
        const rowValue = formatCellValue(row[options.rowField]);
        const columnValue = formatCellValue(row[options.columnField]);
        columnValues.add(columnValue);
        const bucket = buckets.get(rowValue);
        if (bucket) {
          bucket.push(row);
        } else {
          buckets.set(rowValue, [row]);
        }
      }

      const sortedColumnValues = [...columnValues].sort();
      computedColumns = [
        { key: options.rowField, label: options.rowLabel ?? String(options.rowField), sortable: true },
        ...sortedColumnValues.map(
          (columnValue): DataGridColumn<DataGridRecord> => ({
            key: columnValue,
            label: columnValue || "(blank)",
            align: "end",
            sortable: true
          })
        )
      ];

      const pivotRows: DataGridRecord[] = [];
      for (const [rowValue, bucketRows] of buckets) {
        const pivotRow: DataGridRecord = { [options.rowField]: rowValue };
        for (const columnValue of sortedColumnValues) {
          const matching = bucketRows.filter((row) => formatCellValue(row[options.columnField]) === columnValue);
          pivotRow[columnValue] = aggregateValues(
            matching.map((row) => row[options.valueField]),
            options.aggregate ?? "sum"
          );
        }
        pivotRows.push(pivotRow);
      }

      return pivotRows as unknown as TRecord[];
    },

    transformColumns() {
      return computedColumns as unknown as DataGridColumn<TRecord>[];
    }
  });
}
