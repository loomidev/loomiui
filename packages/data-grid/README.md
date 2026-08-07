# Data Grid

`<loomi-data-grid>` — a modular data grid. The core is deliberately lean
(rendering, sorting, pagination, selection, column resizing, sticky headers,
keyboard navigation, and custom cell rendering); everything else — filtering,
row grouping, tree data, export, inline editing, virtual scrolling, pivot
tables, charts integration, spreadsheet features, and state persistence — is
an opt-in **module** you attach only when you need it.

## Accessibility

- Roving cell focus: Arrow keys, Home/End, Page Up/Down; Space toggles row selection; Enter fires `loomi-row-action`.
- Module toolbars expose labelled controls (`aria-label` on filters and actions).

For the library-wide baseline, see [Foundations — Accessibility](https://loomiui.com/foundations/#accessibility).

## Responsive behavior

- Toolbar and footer groups stack below `768px`.

For the shared container and viewport rules, see [Foundations — Responsive behavior](https://loomiui.com/foundations/#responsive-behavior).

## Dark mode

For theme activation, token overrides, and contrast guidance, see [Foundations — Dark mode](https://loomiui.com/foundations/#dark-mode).

## Installation

```sh
npm install @loomidev/data-grid lit
```

## Import

```js
import "@loomidev/data-grid";
```

## Core usage

Set `columns` and `data` as JavaScript properties.

```js
const grid = document.querySelector("loomi-data-grid");

grid.columns = [
  { key: "name", label: "Name", sortable: true, resizable: true },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
  {
    key: "status",
    label: "Status",
    cellRenderer: ({ value }) => html`<loomi-tag color=${value === "Active" ? "green" : "gray"}>${value}</loomi-tag>`
  }
];

grid.data = [
  { id: "usr_001", name: "Emma Miller", email: "emma@example.com", role: "Owner", status: "Active" },
  { id: "usr_002", name: "Diego Barros", email: "diego@example.com", role: "Admin", status: "Invited" }
];
```

```html
<loomi-data-grid selectable sticky-header max-height="480px"></loomi-data-grid>
```

### Core features

- **Rendering** — pass `columns` + `data`; each column supports `formatter`
  (string) or `cellRenderer` (full lit template) for custom cell content.
- **Sorting** — set `column.sortable`; click a header to cycle
  asc → desc → none. Listen for `loomi-sort-change`.
- **Pagination** — `pagination`, `page`, `page-size`, `total-rows` (for
  `server-side` mode). Listen for `loomi-page-change`.
- **Selection** — `selectable` renders checkboxes; `selectedKeys` is a
  JavaScript property. Space bar toggles the focused row. Listen for
  `loomi-selection-change`.
- **Column resizing** — drag the handle at a header's right edge (disable
  per-column with `resizable: false`). Listen for `loomi-column-resize`.
  Widths land in `grid.columnWidths`.
- **Column pinning** — set `column.pinned` to `"start"` or `"end"` to keep
  columns visible while scrolling horizontally. When `selectable` is on, the
  checkbox column is pinned to the start automatically.
- **Sticky headers** — `sticky-header` (default on) plus `max-height` on the
  grid for a real scroll container.
- **Keyboard navigation** — arrow keys move a roving cell focus, `Home`/`End`
  jump to the row's first/last column, `PageUp`/`PageDown` change page,
  `Enter` fires `loomi-row-action`, `Space` toggles selection.
- **Custom cell rendering** — `column.cellRenderer(ctx)` returns anything
  `lit-html` can render (templates, elements, strings).

### Server-side mode

```html
<loomi-data-grid server-side total-rows="482" sticky-header></loomi-data-grid>
```

In `server-side` mode the grid renders `data` as-is — no local filter, sort,
or pagination — you own fetching. Listen for `loomi-page-change` and
`loomi-sort-change` to refetch.

## Modules

Modules are plain factory functions you assign to `grid.modules`. Each module
only implements the hooks it needs (see `GridModule` in `grid-module.ts`),
so composing several is just concatenating arrays. Import each one from its
own entry point — the package root does **not** re-export modules — so
bundlers only pull in what you use:

```js
import "@loomidev/data-grid";
import { filteringModule } from "@loomidev/data-grid/modules/filtering.js";
import { exportModule } from "@loomidev/data-grid/modules/export.js";

grid.modules = [filteringModule({ searchPlaceholder: "Search users" }), exportModule({ filename: "users" })];
```

### Filtering (`modules/filtering.js`)

Global quick-search box plus a per-column filter input for columns with
`filterable: true`.

```js
import { filteringModule } from "@loomidev/data-grid/modules/filtering.js";
grid.modules = [filteringModule()];
```

### Row grouping (`modules/row-grouping.js`)

Groups rows by a column into collapsible sections with per-column
aggregates.

```js
import { rowGroupingModule } from "@loomidev/data-grid/modules/row-grouping.js";
grid.modules = [rowGroupingModule({ groupBy: "department", aggregates: { salary: "avg" } })];
```

### Tree data (`modules/tree-data.js`)

Flattens hierarchical rows (nodes with a `children` array) into an indented,
expand/collapsible list.

```js
import { treeDataModule } from "@loomidev/data-grid/modules/tree-data.js";
grid.data = [{ id: "1", name: "Engineering", children: [{ id: "1a", name: "Platform" }] }];
grid.modules = [treeDataModule()];
```

### Export (`modules/export.js`)

Adds CSV/JSON export buttons to the toolbar and dispatches
`loomi-export-request` (rows + columns) so you can hook in server-side
exports (Excel, PDF) too.

```js
import { exportModule } from "@loomidev/data-grid/modules/export.js";
grid.modules = [exportModule({ filename: "members", formats: ["csv", "json"] })];
```

### Inline editing (`modules/inline-editing.js`)

Double-click (or press Enter on) a cell whose column is `editable: true` to
edit it; commit with Enter/blur, cancel with Escape. Edits flow through
`grid.updateCellValue(...)` and emit `loomi-cell-edit`.

```js
import { inlineEditingModule } from "@loomidev/data-grid/modules/inline-editing.js";
grid.columns = [{ key: "name", label: "Name", editable: true }];
grid.modules = [inlineEditingModule()];
```

### Virtual scrolling (`modules/virtual-scrolling.js`)

Renders only the rows visible in the scroll viewport for large datasets. Set
`max-height` so the grid actually scrolls, and turn off pagination.

```js
import { virtualScrollingModule } from "@loomidev/data-grid/modules/virtual-scrolling.js";
grid.maxHeight = "480px";
grid.pagination = false;
grid.modules = [virtualScrollingModule({ rowHeight: 40 })];
```

### Pivot tables (`modules/pivot.js`)

Reshapes flat rows into a row/column/value pivot matrix.

```js
import { pivotModule } from "@loomidev/data-grid/modules/pivot.js";
grid.modules = [pivotModule({ rowField: "region", columnField: "quarter", valueField: "revenue", aggregate: "sum" })];
```

### Charts integration (`modules/charts.js`)

Renders a `<loomi-chart>` below the grid summarizing the current rows. Pulls
in `@loomidev/chart`.

```js
import { chartsModule } from "@loomidev/data-grid/modules/charts.js";
grid.modules = [chartsModule({ labelField: "month", valueField: "revenue", type: "line" })];
```

### Spreadsheet features (`modules/spreadsheet.js`)

Click-drag or shift+arrow to select a rectangular cell range, `Ctrl/Cmd+C` to
copy as TSV, `Ctrl/Cmd+V` to paste back in starting at the anchor cell.

```js
import { spreadsheetModule } from "@loomidev/data-grid/modules/spreadsheet.js";
grid.modules = [spreadsheetModule()];
```

### State persistence (`modules/state-persistence.js`)

Saves sort, column widths, page, and page size to `localStorage` (or
`sessionStorage`), restoring them next time a grid with the same `key`
attaches.

```js
import { statePersistenceModule } from "@loomidev/data-grid/modules/state-persistence.js";
grid.modules = [statePersistenceModule({ key: "members-grid" })];
```

### Saved views (`modules/saved-views.js`)

Renders a view picker in the toolbar and applies named presets for sort,
page size, column visibility, column widths, and filters. Register
`filteringModule()` **before** `savedViewsModule()` so filter presets flow
through the filtering module's `setFilterState()` API.

```js
import { filteringModule } from "@loomidev/data-grid/modules/filtering.js";
import { savedViewsModule } from "@loomidev/data-grid/modules/saved-views.js";

grid.modules = [
  filteringModule(),
  savedViewsModule({
    views: [
      {
        id: "active",
        label: "Active users",
        filters: [{ key: "status", value: "Active" }],
        pageSize: 25,
        sort: { key: "name", direction: "asc" },
      },
    ],
    activeViewId: "active",
  }),
];
```

Listen for `loomi-saved-view-change` when the user switches views. To update
views at runtime, dispatch `loomi-saved-view-config` with
`{ views, activeViewId }`.

### Combining modules

Modules compose by array order. `transformRows` hooks run in two stages —
`"filter"` (before core sorting: filtering) then `"shape"` (after sorting:
row grouping, tree data, pivot) — so, for example, filtering + sorting +
grouping + export all work together:

```js
grid.modules = [
  filteringModule(),
  rowGroupingModule({ groupBy: "department" }),
  exportModule({ filename: "team" }),
  statePersistenceModule({ key: "team-grid" })
];
```

## Writing your own module

A module is any object matching the `GridModule` interface — implement only
the hooks you need:

```ts
import { defineGridModule } from "@loomidev/data-grid";

export function highlightNegativesModule(columnKey: string) {
  return defineGridModule({
    name: "highlight-negatives",
    getCellClass(cell) {
      return cell.column.key === columnKey && Number(cell.row[columnKey]) < 0 ? "negative" : undefined;
    }
  });
}
```

See `grid-module.ts` for the full hook list: `transformRows`,
`transformColumns`, `renderToolbarStart`/`renderToolbarEnd`,
`renderHeaderExtra`, `renderBelowTable`, `renderBody`, `renderCell`,
`getRowClass`/`getCellClass`, `onCellKeydown`, `onCellPointerDown`/
`onCellPointerEnter`, `onCellDblClick`, and `onGridEvent`.

## React usage

React apps should use `@loomidev/react (planned)` once the wrapper for this
component is implemented. The wrapper should pass arrays/objects as DOM
properties and map custom events to callbacks — it should not reimplement
grid rendering or behavior.

## Events

| Event                     | Detail                                                    |
| ------------------------- | --------------------------------------------------------- |
| `loomi-page-change`       | `{ page, pageSize }`                                      |
| `loomi-sort-change`       | `{ sort }`                                                |
| `loomi-selection-change`  | `{ selectedKeys, selectedRows }`                          |
| `loomi-row-action`        | `{ row, rowKey }`                                         |
| `loomi-column-resize`     | `{ key, width }`                                          |
| `loomi-cell-edit`         | `{ row, rowKey, columnKey, previousValue, value }`        |
| `loomi-grid-toggle-row`   | `{ rowKey, row, expanded }` (row grouping / tree data)    |
| `loomi-export-request`    | `{ format, rows, columns, selectedOnly }` (export module) |
| `loomi-saved-view-change` | `{ viewId, view }` (saved views module)                   |

## Design notes

- `row-key` defaults to `id`.
- `data` and `columns` are JavaScript properties, not string attributes.
- Rows produced by a module (group headers, pivot summaries) carry a
  reserved `__gridMeta` field — don't use that key in your own records.
- `formatter`/`cellRenderer` belong on column definitions for app-specific
  display logic; use modules for cross-cutting behavior.
- Inline editing and spreadsheet paste both write through
  `grid.updateCellValue(rowKey, columnKey, value)`, which operates on
  top-level `data` rows — combining them with row grouping or tree data
  needs care since those modules render synthetic/cloned rows.

## Migrating from `@loomidev/data-table`

`@loomidev/data-table` (`<loomi-data-table>`) has been replaced by this
package. Changes to account for:

- Tag: `<loomi-data-table>` → `<loomi-data-grid>`.
- Package: `@loomidev/data-table` → `@loomidev/data-grid`.
- Global search, per-column filters, and export are no longer built in — use
  `filteringModule()` and `exportModule()`.
- Saved views are provided by `savedViewsModule()` (register after
  `filteringModule()` when a preset includes filters).
- A column-visibility manager is not yet reimplemented as a module.
- Types are renamed `DataTable*` → `DataGrid*`, and filter-related types
  (`DataGridFilter`, `DataGridFilterOperator`) now live in
  `modules/filtering.js`.

## Dependencies

- `@loomidev/chart`
- `@loomidev/core`
