import { defineGridModule, type GridModule } from "../grid-module.js";
import { aggregateValues, formatCellValue, getRowMeta, withRowMeta } from "../grid-utils.js";
import type { DataGridAggregate, DataGridRecord } from "../types.js";

export interface RowGroupingModuleOptions<TRecord extends DataGridRecord = DataGridRecord> {
  /** Column key to group rows by. */
  groupBy: keyof TRecord & string;
  /** Per-column aggregates shown in the group header, e.g. `{ amount: "sum" }`. */
  aggregates?: Partial<Record<keyof TRecord & string, DataGridAggregate>>;
  /** Whether groups start expanded. Defaults to `true`. */
  expandedByDefault?: boolean;
}

/**
 * Groups (already-sorted) rows by a column value into collapsible sections
 * with per-group aggregates. Runs in the `"shape"` stage, after core
 * sorting, so a group's row order matches the active sort.
 *
 * ```ts
 * grid.modules = [rowGroupingModule({ groupBy: "department", aggregates: { salary: "avg" } })];
 * ```
 */
export function rowGroupingModule<TRecord extends DataGridRecord = DataGridRecord>(
  options: RowGroupingModuleOptions<TRecord>,
): GridModule<TRecord> {
  const expandedGroups = new Set<string>();
  let initialized = false;

  return defineGridModule<TRecord>({
    name: "row-grouping",
    stage: "shape",

    transformRows(rows) {
      const groups = new Map<string, TRecord[]>();

      for (const row of rows) {
        const groupValue = formatCellValue(row[options.groupBy]);
        const bucket = groups.get(groupValue);
        if (bucket) {
          bucket.push(row);
        } else {
          groups.set(groupValue, [row]);
        }
      }

      if (!initialized) {
        initialized = true;
        if (options.expandedByDefault !== false) {
          for (const groupValue of groups.keys()) {
            expandedGroups.add(groupValue);
          }
        }
      }

      const shaped: TRecord[] = [];

      for (const [groupValue, groupRows] of groups) {
        const expanded = expandedGroups.has(groupValue);
        const aggregates: Record<string, unknown> = {};

        for (const [columnKey, aggregate] of Object.entries(options.aggregates ?? {})) {
          aggregates[columnKey] = aggregateValues(
            groupRows.map((row) => row[columnKey]),
            aggregate as DataGridAggregate,
          );
        }

        const groupHeader = withRowMeta({ [options.groupBy]: groupValue } as unknown as TRecord, {
          type: "group",
          groupKey: groupValue,
          groupLabel: groupValue || "(blank)",
          count: groupRows.length,
          aggregates,
          expanded,
          hasChildren: true,
          depth: 0,
        });

        shaped.push(groupHeader);

        if (expanded) {
          for (const row of groupRows) {
            shaped.push(withRowMeta(row, { type: "data", depth: 1, parentKey: groupValue }));
          }
        }
      }

      return shaped;
    },

    onGridEvent(name, detail, ctx) {
      if (name !== "loomi-grid-toggle-row") {
        return;
      }
      const { row, expanded } = detail as { row: TRecord; expanded: boolean };
      const meta = getRowMeta(row);
      if (meta?.type !== "group" || !meta.groupKey) {
        return;
      }
      if (expanded) {
        expandedGroups.add(meta.groupKey);
      } else {
        expandedGroups.delete(meta.groupKey);
      }
      ctx.requestUpdate();
    },
  });
}
