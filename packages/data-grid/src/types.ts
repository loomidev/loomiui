/**
 * Core types for `<loomi-data-grid>`.
 *
 * The grid ships a lean, always-on core (rendering, sorting, pagination,
 * selection, column resizing, sticky headers, keyboard navigation, custom
 * cell rendering) and a set of opt-in modules (see `grid-module.ts` and
 * `modules/*`) for everything else. This file only declares the shapes the
 * core needs; module-specific option types live next to their module.
 */

import type { DataGridExportRequestDetail } from "./modules/export.js";

export type DataGridRecord = Record<string, unknown>;

export type DataGridDensity = "compact" | "comfortable" | "spacious";

export type DataGridSortDirection = "asc" | "desc";

export type DataGridAlign = "start" | "center" | "end";

export type DataGridAggregate = "sum" | "avg" | "count" | "min" | "max";

/**
 * Reserved metadata a module can stamp onto a synthetic row (group headers,
 * tree branches, pivot summaries, …) so the core renderer knows how to draw
 * it. Modules produce plain `TRecord`-shaped objects with this key attached;
 * regular data rows simply don't have it.
 */
export interface DataGridRowMeta {
  type: "data" | "group" | "tree" | "pivot-header";
  depth?: number;
  expanded?: boolean;
  groupKey?: string;
  groupLabel?: string;
  count?: number;
  aggregates?: Record<string, unknown>;
  hasChildren?: boolean;
  parentKey?: string;
  /** Marks the row as non-selectable / non-editable / non-focusable for cell nav. */
  structural?: boolean;
}

export type DataGridRowWithMeta<TRecord extends DataGridRecord = DataGridRecord> = TRecord & {
  __gridMeta?: DataGridRowMeta;
};

export interface DataGridCellContext<TRecord extends DataGridRecord = DataGridRecord> {
  value: unknown;
  row: TRecord;
  rowIndex: number;
  column: DataGridColumn<TRecord>;
}

export interface DataGridColumn<TRecord extends DataGridRecord = DataGridRecord> {
  key: keyof TRecord & string;
  label: string;
  description?: string;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  align?: DataGridAlign;
  sortable?: boolean;
  /** Defaults to `true`; set `false` to lock a column's width. */
  resizable?: boolean;
  filterable?: boolean;
  editable?: boolean;
  hidden?: boolean;
  pinned?: "start" | "end";
  /** Used by the row-grouping / pivot modules when summarizing this column. */
  aggregate?: DataGridAggregate;
  formatter?: (value: TRecord[keyof TRecord], row: TRecord) => string;
  /** Full control over a cell's rendered content (return a lit template, string, or nothing). */
  cellRenderer?: (ctx: DataGridCellContext<TRecord>) => unknown;
}

export interface DataGridSort {
  key: string;
  direction: DataGridSortDirection;
}

export interface DataGridPageChangeDetail {
  page: number;
  pageSize: number;
}

export interface DataGridSortChangeDetail {
  sort: DataGridSort | null;
}

export interface DataGridSelectionChangeDetail<TRecord extends DataGridRecord = DataGridRecord> {
  selectedKeys: string[];
  selectedRows: TRecord[];
}

export interface DataGridRowActionDetail<TRecord extends DataGridRecord = DataGridRecord> {
  row: TRecord;
  rowKey: string;
}

export interface DataGridColumnResizeDetail {
  key: string;
  width: number;
}

export interface DataGridSavedViewChangeDetail {
  viewId: string | null;
  view: DataGridSavedView | null;
}

/** A named preset of grid state (sort, filters, page size, column visibility, …). */
export interface DataGridSavedView {
  id: string;
  label: string;
  sort?: DataGridSort | null;
  pageSize?: number;
  globalSearch?: string;
  filters?: Array<{ key: string; value: string; operator?: string }>;
  hiddenColumns?: string[];
  columnWidths?: Record<string, string>;
}

export interface DataGridCellEditDetail<TRecord extends DataGridRecord = DataGridRecord> {
  row: TRecord;
  rowKey: string;
  columnKey: string;
  previousValue: unknown;
  value: unknown;
}

export interface DataGridActiveCell {
  rowIndex: number;
  columnIndex: number;
}

export interface DataGridToggleRowDetail<TRecord extends DataGridRecord = DataGridRecord> {
  rowKey: string;
  row: TRecord;
  expanded: boolean;
}

/** Event map for `<loomi-data-grid>`, parameterized on the row record type.
 * `loomi-page-change` and `loomi-selection-change` are dispatched by other
 * loomi components with different detail shapes, so they are typed here per
 * package instead of globally on `HTMLElementEventMap`. */
export interface DataGridEventMap<TRecord extends DataGridRecord = DataGridRecord> {
  "loomi-page-change": CustomEvent<DataGridPageChangeDetail>;
  "loomi-sort-change": CustomEvent<DataGridSortChangeDetail>;
  "loomi-selection-change": CustomEvent<DataGridSelectionChangeDetail<TRecord>>;
  "loomi-row-action": CustomEvent<DataGridRowActionDetail<TRecord>>;
  "loomi-cell-edit": CustomEvent<DataGridCellEditDetail<TRecord>>;
  "loomi-column-resize": CustomEvent<DataGridColumnResizeDetail>;
  "loomi-saved-view-change": CustomEvent<DataGridSavedViewChangeDetail>;
  "loomi-grid-toggle-row": CustomEvent<DataGridToggleRowDetail<TRecord>>;
  "loomi-export-request": CustomEvent<DataGridExportRequestDetail<TRecord>>;
}
