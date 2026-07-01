# Advanced Data Table

`<loomi-data-table>` — an advanced data table for admin, SaaS, CRM, and analytics workflows that need more than a basic table.

Typed column definitions, local search and filters, sorting, pagination, row selection, column visibility, saved views, export requests, and server-side mode hooks.

## Installation

```sh
npm install @loomidev/data-table lit
```

## Import

```js
import "@loomidev/data-table";
```

## Basic Usage

Set `columns` and `data` as JavaScript properties, then render the table with the attributes you need.

```js
const table = document.querySelector("loomi-data-table");

table.columns = [
  { key: "name", label: "Name", sortable: true },
  { key: "email", label: "Email" },
  { key: "role", label: "Role", filterable: true },
  { key: "status", label: "Status", filterable: true },
];

table.data = [
  { id: "usr_001", name: "Ama Mensah", email: "ama@example.com", role: "Owner", status: "Active" },
  { id: "usr_002", name: "Kojo Boateng", email: "kojo@example.com", role: "Admin", status: "Invited" },
];
```

```html
<loomi-data-table selectable show-export show-column-manager show-view-manager></loomi-data-table>
```

## Density

Use `density` to switch between comfortable and compact row spacing.

```html
<loomi-data-table density="compact" selectable show-export></loomi-data-table>
```

## Server-Side Mode

Use `server-side` when the app owns fetching, filtering, sorting, and pagination.

```html
<loomi-data-table server-side total-rows="482" sticky-header></loomi-data-table>
```

Listen for these events and fetch new rows from your API:

- `loomi-page-change`
- `loomi-sort-change`
- `loomi-view-change`
- `loomi-column-visibility-change`

## React Usage

React apps should use `@loomidev/react (planned)` once the wrapper for this component is implemented. The wrapper should pass arrays and objects as DOM properties and map custom events to callbacks. It should not reimplement table rendering or behavior.

## Events

| Event | Detail |
| --- | --- |
| `loomi-page-change` | `{ page, pageSize }` |
| `loomi-sort-change` | `{ sort }` |
| `loomi-selection-change` | `{ selectedKeys, selectedRows }` |
| `loomi-row-action` | `{ row, rowKey }` |
| `loomi-export-request` | `{ rows, columns, selectedKeys, viewId }` |
| `loomi-view-change` | `{ viewId, view }` |
| `loomi-column-visibility-change` | `{ visibleColumns, hiddenColumns }` |

## Design Notes

- `row-key` defaults to `id`.
- `visibleColumns` and `savedViews` are JavaScript properties, not string attributes.
- `formatter` functions belong in column definitions for app-specific display logic.
- The component emits export requests instead of creating files directly so apps can choose CSV, Excel, PDF, or backend export jobs.
