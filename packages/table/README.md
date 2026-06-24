# @loomi/table

`<loomi-table>` — a data-driven table with search, sorting, pagination (via
[`<loomi-pagination>`](../pagination)), checkable rows (via
[`<loomi-checkbox>`](../checkbox)) and action icons. Unlike BladewindUI's table, loomi's
is fully data-driven — there's no manual `<tr>`-building mode; pass rows via `data` and
the table renders itself.

```bash
npm install @loomi/table lit
```

```js
import "@loomi/table/loomi-table.js";
```

## Basic Usage

Pass an array of row objects via the `.data` property (or a JSON-string `data`
attribute). Column headings are generated automatically from the first row's keys.

```html
<loomi-table id="t"></loomi-table>

<script type="module">
  document.getElementById("t").data = [
    { first_name: "Ada", department: "Engineering", email: "ada@loomiui.dev" },
    { first_name: "Sara", department: "Design", email: "sara@loomiui.dev" },
  ];
</script>
```

## Styling Options

```html
<!-- alternating row backgrounds -->
<loomi-table striped></loomi-table>

<!-- remove row divider lines -->
<loomi-table divided="false"></loomi-table>

<!-- thinner dividers -->
<loomi-table divider="thin"></loomi-table>

<!-- highlight rows on hover -->
<loomi-table has-hover></loomi-table>

<!-- tighter row padding -->
<loomi-table compact></loomi-table>

<!-- borders on every cell, like a spreadsheet -->
<loomi-table celled></loomi-table>

<!-- outer border / drop shadow -->
<loomi-table has-border has-shadow></loomi-table>
```

## Choosing & Renaming Columns

By default every key on the first row becomes a column. Narrow that down with
`include-columns` (takes priority) or `exclude-columns`, and rename headings with
`column-aliases`.

```html
<loomi-table id="t2" exclude-columns="id,email"></loomi-table>

<script type="module">
  const t = document.getElementById("t2");
  t.data = [{ id: 1, first_name: "Ada", department: "Engineering", email: "ada@loomiui.dev" }];
  t.columnAliases = { first_name: "Name", department: "Team" };
</script>
```

## Action Icons

Pass an array of `{ icon, name, tip, color }` objects via `action-icons` to add a column
of icon buttons. Listen for the `action` event to handle clicks — `e.detail` is
`{ name, row }`, so you always get the full row data for that line.

```html
<loomi-table id="t3"></loomi-table>

<script type="module">
  const t = document.getElementById("t3");
  t.data = [{ first_name: "Ada", department: "Engineering" }];
  t.actionIcons = [
    { icon: "paper-airplane", name: "message", tip: "Message", color: "green" },
    { icon: "trash", name: "delete", tip: "Delete", color: "red" },
  ];
  t.addEventListener("action", (e) => {
    console.log(e.detail.name, e.detail.row); // "delete", { first_name: "Ada", ... }
  });
</script>
```

## Row Click Handler

Listen for `row-click` to react to a click anywhere on a row (clicks on the action-icon
cell don't trigger it, so icon clicks and row clicks never collide).

```js
t.addEventListener("row-click", (e) => goToProfile(e.detail.row.id));
```

## Searchable

```html
<loomi-table id="t4" searchable search-placeholder="Find staff members by name…"></loomi-table>
```

The search box filters across every visible column's stringified value, client-side.

## Sortable

```html
<loomi-table id="t5" sortable></loomi-table>

<!-- restrict which columns can be sorted -->
<loomi-table id="t6" sortable sortable-columns="first_name,department"></loomi-table>
```

Click a sortable column heading to sort by it; click again to reverse direction.

## Checkable Rows

Adds a checkbox column. Read the current selection from the `selectedIds` property, or
listen for `selection-change`.

```html
<loomi-table id="t7" checkable></loomi-table>

<script type="module">
  document.getElementById("t7").addEventListener("selection-change", (e) => {
    console.log(e.detail.ids); // every checked row's id
  });
</script>
```

Pre-check rows on load with `selected-value` (comma-separated ids), and control which
field counts as the row's id with `id-key` (defaults to `id`).

## Pagination

```html
<loomi-table id="t8" paginated page-size="10"></loomi-table>

<!-- show page numbers instead of prev/next arrows -->
<loomi-table id="t9" paginated page-size="10" pagination-style="numbers"></loomi-table>

<!-- leading row-number column -->
<loomi-table id="t10" paginated page-size="10" show-row-numbers></loomi-table>
```

Pagination styles: `arrows` (default), `numbers`, `dropdown` — same options as
[`<loomi-pagination>`](../pagination), since that's exactly what renders underneath.

## No Data Message

```html
<loomi-table id="t11" no-data-message="The staff directory is empty"></loomi-table>
```

## Putting It Together

Search, sort, checkable rows, pagination, and action icons all compose freely on the
same table:

```html
<loomi-table id="full-table" searchable sortable paginated page-size="5" checkable has-hover></loomi-table>

<script type="module">
  const t = document.getElementById("full-table");
  t.data = [
    { id: 1, first_name: "Ada", department: "Engineering" },
    { id: 2, first_name: "Sara", department: "Design" },
    // …
  ];
  t.excludeColumns = "id";
  t.actionIcons = [{ icon: "trash", name: "delete", color: "red", tip: "Delete" }];
  t.addEventListener("action", (e) => console.log(e.detail));
  t.addEventListener("selection-change", (e) => console.log(e.detail.ids));
</script>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `data` | `[]` | Row objects — property (`.data`) or JSON-string attribute. |
| `columns` | _(auto)_ | Column keys (defaults to the first row's keys). |
| `include-columns` / `exclude-columns` | _(blank)_ | Comma-separated key allow/deny lists (`include` wins if both are set). |
| `column-aliases` | `{}` | Map of `key -> display name` (property or JSON). |
| `searchable` | `false` | Show a search box. _(boolean)_ |
| `search-placeholder` | `Search…` | Search input placeholder. |
| `sortable` | `false` | Enable column sorting. _(boolean)_ |
| `sortable-columns` | _(all)_ | Comma-separated sortable keys. |
| `paginated` | `false` | Enable pagination. _(boolean)_ |
| `page-size` | `10` | Rows per page. |
| `pagination-style` | `arrows` | `arrows` \| `numbers` \| `dropdown` |
| `checkable` | `false` | Add a checkbox column. _(boolean)_ |
| `id-key` | `id` | Row key used as the selection id. |
| `selected-value` | _(blank)_ | Comma-separated ids to pre-check. |
| `action-icons` | `[]` | Array of `{ icon, name?, tip?, color? }` (property or JSON). |
| `actions-title` | `actions` | Heading for the action-icons column. |
| `show-row-numbers` | `false` | Show a leading `#` column. _(boolean)_ |
| `striped` / `divided` / `celled` / `compact` / `has-hover` / `has-shadow` / `has-border` | — | Styling toggles. _(boolean)_ |
| `divider` | `regular` | `regular` \| `thin` |
| `no-data-message` | `No records to display` | Shown when there are no rows. |

**Events:** `row-click` (`{ row }`), `action` (`{ name, row }`),
`selection-change` (`{ ids }`), `page-change` (`{ page }`).
**Property:** `selectedIds` (read-only, current checked ids).

> Not (yet) ported from BladewindUI: row grouping (`groupby`), manually-authored `<tr>`
> rows alongside dynamic data, and rendering the empty state as a full
> [`<loomi-empty-state>`](../empty-state).

## Full Example

```html
<loomi-table
  id="staff-table"
  striped
  divided
  divider="thin"
  has-shadow
  has-border
  compact
  searchable
  search-placeholder="Search staff…"
  sortable
  checkable
  paginated
  page-size="25"
  pagination-style="numbers"
  show-row-numbers
  no-data-message="The staff directory is empty"
></loomi-table>

<script type="module">
  const t = document.getElementById("staff-table");
  t.data = staffData;
  t.excludeColumns = "id";
  t.columnAliases = { first_name: "First Name", last_name: "Last Name" };
  t.actionIcons = [
    { icon: "pencil-square", name: "edit", tip: "Edit" },
    { icon: "trash", name: "delete", color: "red", tip: "Delete" },
  ];
</script>
```
