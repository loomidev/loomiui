import type { DataGridColumn, DataGridRecord, DataGridSort } from "./types.js";

/**
 * The subset of `<loomi-data-grid>`'s public surface that modules are allowed
 * to touch. Kept as a structural interface (rather than importing the
 * concrete `LoomiDataGrid` class) so `grid-module.ts` has no dependency on
 * `loomi-data-grid.ts` — the element satisfies this shape automatically.
 */
export interface DataGridHost<TRecord extends DataGridRecord = DataGridRecord> extends HTMLElement {
  columns: DataGridColumn<TRecord>[];
  data: TRecord[];
  modules: GridModule<TRecord>[];
  rowKey: string;
  selectable: boolean;
  selectedKeys: string[];
  sort: DataGridSort | null;
  columnWidths: Record<string, string>;
  page: number;
  pageSize: number;
  getRowKey(row: TRecord): string;
  requestUpdate(): void;
  dispatchGridEvent<TDetail>(name: string, detail: TDetail): void;
  /** Clones `data`, applies one cell edit, reassigns `data`, and re-renders. */
  updateCellValue(rowKey: string, columnKey: string, value: unknown): void;
}

/** Shared context passed into every module hook for a single render pass. */
export interface GridModuleContext<TRecord extends DataGridRecord = DataGridRecord> {
  grid: DataGridHost<TRecord>;
  columns: DataGridColumn<TRecord>[];
  /**
   * The full processed row set (post filter + sort + shape) from the most
   * recent render. Stale/empty while inside a `transformRows` call for the
   * render currently in progress — read it from hooks that run *after* the
   * pipeline (toolbar, cell, body, below-table), not from `transformRows`
   * itself (which already receives the rows it should operate on).
   */
  rows: TRecord[];
  requestUpdate: () => void;
  dispatch: <TDetail>(name: string, detail: TDetail) => void;
  getRowKey: (row: TRecord) => string;
}

/** Coordinates of a single grid cell, used by keyboard-nav / spreadsheet hooks. */
export interface GridCellCoordinates<TRecord extends DataGridRecord = DataGridRecord> {
  row: TRecord;
  rowIndex: number;
  columnIndex: number;
  column: DataGridColumn<TRecord>;
}

/**
 * A pluggable unit of grid behavior. Every hook is optional — a module only
 * implements the ones relevant to its feature. Register modules on the grid
 * with `grid.modules = [filteringModule(), exportModule(), ...]`.
 *
 * `stage` controls where `transformRows` sits relative to the core's own
 * sort step:
 *  - `"filter"` (default) runs *before* sorting — e.g. search/filter modules
 *    that narrow the row set but keep it flat.
 *  - `"shape"` runs *after* sorting — e.g. row-grouping / tree-data / pivot
 *    modules that restructure the (already-sorted) rows into a hierarchy and
 *    must not be re-shuffled by a subsequent sort pass.
 */
export interface GridModule<TRecord extends DataGridRecord = DataGridRecord> {
  name: string;
  stage?: "filter" | "shape";

  /** Called once when the module is attached to a connected grid. */
  attach?(ctx: GridModuleContext<TRecord>): void;
  /** Called when the module is removed or the grid disconnects. */
  detach?(ctx: GridModuleContext<TRecord>): void;

  /** Narrow, reorder, or restructure rows. Return a new array. */
  transformRows?(rows: TRecord[], ctx: GridModuleContext<TRecord>): TRecord[];
  /** Add, remove, or reshape columns (e.g. pivot's dynamic columns). */
  transformColumns?(
    columns: DataGridColumn<TRecord>[],
    ctx: GridModuleContext<TRecord>,
  ): DataGridColumn<TRecord>[];

  /**
   * Inject controls at the start/end of the toolbar. Return `undefined`
   * (not lit's `nothing`) when there's nothing to render — the core uses
   * `undefined` to decide whether the toolbar row should exist at all.
   */
  renderToolbarStart?(ctx: GridModuleContext<TRecord>): unknown;
  renderToolbarEnd?(ctx: GridModuleContext<TRecord>): unknown;
  /** Inject content under a column header (e.g. a per-column filter input). Return `undefined` for none. */
  renderHeaderExtra?(column: DataGridColumn<TRecord>, ctx: GridModuleContext<TRecord>): unknown;
  /** Render content below the table (e.g. a chart summary, pivot totals). Return `undefined` for none. */
  renderBelowTable?(rows: TRecord[], ctx: GridModuleContext<TRecord>): unknown;

  /**
   * Full control over the `<tbody>` contents (the table's own `<colgroup>`
   * and sticky `<thead>` still render normally around it). If any attached
   * module implements this, the core hands it *all* processed rows
   * (bypassing its own pagination slice) and uses the first module's output
   * instead of its default per-row mapping. Used by virtual scrolling.
   */
  renderBody?(
    rows: TRecord[],
    columns: DataGridColumn<TRecord>[],
    renderRow: (row: TRecord, rowIndex: number) => unknown,
    ctx: GridModuleContext<TRecord>,
  ): unknown;

  /**
   * Override a single cell's rendered content. Return `undefined` to fall
   * through to the next module / the column's own `cellRenderer`/formatter.
   */
  renderCell?(
    value: unknown,
    cell: GridCellCoordinates<TRecord>,
    ctx: GridModuleContext<TRecord>,
  ): unknown | undefined;

  /** Extra CSS class(es) for a rendered `<tr>`. */
  getRowClass?(row: TRecord, rowIndex: number, ctx: GridModuleContext<TRecord>): string | undefined;
  /** Extra CSS class(es) for a rendered `<td>`/`<th>` cell. */
  getCellClass?(
    cell: GridCellCoordinates<TRecord>,
    ctx: GridModuleContext<TRecord>,
  ): string | undefined;

  /** Return `true` to mark the keydown as handled and stop core keyboard nav. */
  onCellKeydown?(
    event: KeyboardEvent,
    cell: GridCellCoordinates<TRecord>,
    ctx: GridModuleContext<TRecord>,
  ): boolean;
  onCellPointerDown?(
    cell: GridCellCoordinates<TRecord>,
    event: PointerEvent,
    ctx: GridModuleContext<TRecord>,
  ): void;
  onCellPointerEnter?(
    cell: GridCellCoordinates<TRecord>,
    event: PointerEvent,
    ctx: GridModuleContext<TRecord>,
  ): void;
  onCellDblClick?(
    cell: GridCellCoordinates<TRecord>,
    event: MouseEvent,
    ctx: GridModuleContext<TRecord>,
  ): void;

  /** Observe every event the grid dispatches (sort/page/selection/etc.). */
  onGridEvent?(name: string, detail: unknown, ctx: GridModuleContext<TRecord>): void;
}

/** Identity helper that gives module factories precise generic inference. */
export function defineGridModule<TRecord extends DataGridRecord = DataGridRecord>(
  module: GridModule<TRecord>,
): GridModule<TRecord> {
  return module;
}
