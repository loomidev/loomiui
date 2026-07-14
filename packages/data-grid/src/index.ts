export { LoomiDataGrid } from "./loomi-data-grid.js";

export type {
  DataGridActiveCell,
  DataGridAggregate,
  DataGridAlign,
  DataGridCellContext,
  DataGridCellEditDetail,
  DataGridColumn,
  DataGridColumnResizeDetail,
  DataGridDensity,
  DataGridPageChangeDetail,
  DataGridRecord,
  DataGridRowActionDetail,
  DataGridRowMeta,
  DataGridRowWithMeta,
  DataGridSavedView,
  DataGridSavedViewChangeDetail,
  DataGridSelectionChangeDetail,
  DataGridSort,
  DataGridSortChangeDetail,
  DataGridSortDirection,
  DataGridToggleRowDetail,
  DataGridEventMap,
} from "./types.js";

export { defineGridModule } from "./grid-module.js";
export type {
  DataGridHost,
  GridCellCoordinates,
  GridModule,
  GridModuleContext,
} from "./grid-module.js";

export {
  aggregateValues,
  compareValues,
  computeColumnPinLayout,
  downloadTextFile,
  formatCellValue,
  getRowMeta,
  isStructuralRow,
  orderPinnedColumns,
  resolveColumnWidthPx,
  resolveRowKey,
  rowsToCsv,
  rowsToTsv,
  withRowMeta,
} from "./grid-utils.js";

export type { ColumnPinLayout } from "./grid-utils.js";

/**
 * Optional modules are intentionally **not** re-exported from the package
 * root — import each one from its own entry point so bundlers only pull in
 * the code (and dependencies, like `@loomidev/chart` for `chartsModule`)
 * that you actually use:
 *
 * ```ts
 * import { filteringModule } from "@loomidev/data-grid/modules/filtering.js";
 * import { exportModule } from "@loomidev/data-grid/modules/export.js";
 * ```
 *
 * Available: `modules/filtering.js`, `modules/row-grouping.js`,
 * `modules/tree-data.js`, `modules/export.js`, `modules/inline-editing.js`,
 * `modules/virtual-scrolling.js`, `modules/pivot.js`, `modules/charts.js`,
 * `modules/spreadsheet.js`, `modules/state-persistence.js`,
 * `modules/saved-views.js`.
 */
