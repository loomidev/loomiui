# @loomidev/table

`<loomi-table>` — a Loomi data table with manual rows, dynamic data,
search, sorting, pagination (via [`<loomi-pagination>`](../pagination)), selectable
and checkable rows (via [`<loomi-checkbox>`](../checkbox)), row grouping, empty-state
options, custom row templates and action icons.

```bash
npm install @loomidev/table lit
```

```js
import "@loomidev/table";
```

## Basic Usage

Pass an array of row objects via the `.data` property (or a JSON-string `data`
attribute). Column headings are generated automatically from the first row's keys.

```html
<loomi-table id="t"></loomi-table>

<script type="module">
  document.getElementById("t").data = [
    { first_name: "Ada", last_name: "Quint", department: "Engineering", email: "ada@loomiui.dev" },
    { first_name: "Sara", last_name: "Field", department: "Design", email: "sara@loomiui.dev" },
    { first_name: "Zane", last_name: "Hart", department: "Engineering", email: "zane@loomiui.dev" },
    { first_name: "Rita", last_name: "Boon", department: "Marketing", email: "rita@loomiui.dev" },
    { first_name: "Joe", last_name: "Diaz", department: "Design", email: "joe@loomiui.dev" },
    { first_name: "Wren", last_name: "Ortiz", department: "Finance", email: "wren@loomiui.dev" },
  ];
</script>
```

## Styling Options

These toggles only show up once a table has enough rows to fill out — the same six-row
staff list is reused across every variant below.

```html
<loomi-table id="s1" striped></loomi-table>
<loomi-table id="s2" divided="false"></loomi-table>
<loomi-table id="s3" divider="thin"></loomi-table>
<loomi-table id="s4" has-hover></loomi-table>
<loomi-table id="s5" compact></loomi-table>
<loomi-table id="s6" celled></loomi-table>
<loomi-table id="s7" has-border has-shadow></loomi-table>

<script type="module">
  const staff = [
    { first_name: "Ada", last_name: "Quint", department: "Engineering", email: "ada@loomiui.dev" },
    { first_name: "Sara", last_name: "Field", department: "Design", email: "sara@loomiui.dev" },
    { first_name: "Zane", last_name: "Hart", department: "Engineering", email: "zane@loomiui.dev" },
    { first_name: "Rita", last_name: "Boon", department: "Marketing", email: "rita@loomiui.dev" },
    { first_name: "Joe", last_name: "Diaz", department: "Design", email: "joe@loomiui.dev" },
    { first_name: "Wren", last_name: "Ortiz", department: "Finance", email: "wren@loomiui.dev" },
  ];
  for (const id of ["s1", "s2", "s3", "s4", "s5", "s6", "s7"]) {
    document.getElementById(id).data = staff;
  }
</script>
```

| Toggle                  | Effect                                     |
| ----------------------- | ------------------------------------------ |
| `striped`               | Alternating row backgrounds.               |
| `divided="false"`       | Removes row divider lines.                 |
| `divider="thin"`        | Thinner dividers.                          |
| `has-hover`             | Highlights rows on hover.                  |
| `compact`               | Tighter row padding.                       |
| `celled`                | Borders on every cell, like a spreadsheet. |
| `has-border has-shadow` | Outer border and drop shadow.              |

## Choosing & Renaming Columns

By default every key on the first row becomes a column. Narrow that down with
`include-columns` (takes priority) or `exclude-columns`, and rename headings with
`column-aliases`.

```html
<loomi-table id="t2" exclude-columns="id,email"></loomi-table>

<script type="module">
  const t = document.getElementById("t2");
  t.data = [
    { id: 1, first_name: "Ada", department: "Engineering", email: "ada@loomiui.dev" },
    { id: 2, first_name: "Sara", department: "Design", email: "sara@loomiui.dev" },
    { id: 3, first_name: "Zane", department: "Engineering", email: "zane@loomiui.dev" },
    { id: 4, first_name: "Rita", department: "Marketing", email: "rita@loomiui.dev" },
  ];
  t.columnAliases = { first_name: "Name", department: "Team" };
</script>
```

## Action Icons

Pass an array of `{ icon, name, tip, color }` objects via `action-icons` to add a column
of icon buttons. Listen for the `loomi-action` event to handle clicks — `e.detail` is
`{ name, row }`, so you always get the full row data for that line.

Each icon renders as a circular outline button in `secondary` by default; pass `color`
to use a different loomi color instead. Set `buttonOutline: false` to render a solid
filled circle instead of the outline.

```html
<loomi-table id="t3"></loomi-table>

<script type="module">
  const t = document.getElementById("t3");
  t.data = [
    { first_name: "Ada", department: "Engineering" },
    { first_name: "Sara", department: "Design" },
    { first_name: "Zane", department: "Engineering" },
    { first_name: "Rita", department: "Marketing" },
  ];
  t.actionIcons = [
    { icon: "paper-airplane", name: "message", tip: "Message", color: "success" },
    { icon: "trash", name: "delete", tip: "Delete", color: "error" },
  ];
  t.addEventListener("action", (e) => {
    console.log(e.detail.name, e.detail.row); // "delete", { first_name: "Ada", ... }
  });
</script>
```

## Row Click Handler

Listen for `loomi-row-click` to react to a click anywhere on a row (clicks on the action-icon
cell don't trigger it, so icon clicks and row clicks never collide).

```js
t.addEventListener("loomi-row-click", (e) => goToProfile(e.detail.row.id));
```

## Selectable Rows

Set `selectable` to let row clicks toggle selected state. This uses the same
selection store as checkboxes, so `selectedIds`, `selectedValue`, and
`loomi-selection-change` all stay in sync.

```html
<loomi-table id="selectable-staff" selectable></loomi-table>

<script type="module">
  document.getElementById("selectable-staff").data = [
    { id: 1, first_name: "Ada", department: "Engineering", email: "ada@loomiui.dev" },
    { id: 2, first_name: "Sara", department: "Design", email: "sara@loomiui.dev" },
    { id: 3, first_name: "Zane", department: "Engineering", email: "zane@loomiui.dev" },
    { id: 4, first_name: "Rita", department: "Marketing", email: "rita@loomiui.dev" },
    { id: 5, first_name: "Joe", department: "Design", email: "joe@loomiui.dev" },
  ];
</script>
```

## Searchable

```html
<loomi-table id="t4" searchable search-placeholder="Find staff members by name…"></loomi-table>

<script type="module">
  document.getElementById("t4").data = [
    { first_name: "Ada", last_name: "Quint", department: "Engineering", email: "ada@loomiui.dev" },
    { first_name: "Sara", last_name: "Field", department: "Design", email: "sara@loomiui.dev" },
    { first_name: "Zane", last_name: "Hart", department: "Engineering", email: "zane@loomiui.dev" },
    { first_name: "Rita", last_name: "Boon", department: "Marketing", email: "rita@loomiui.dev" },
    { first_name: "Joe", last_name: "Diaz", department: "Design", email: "joe@loomiui.dev" },
    { first_name: "Nia", last_name: "Cole", department: "Marketing", email: "nia@loomiui.dev" },
  ];
</script>
```

The search box filters across every visible column's stringified value, client-side —
typing "design" above narrows the six rows down to Sara and Joe.

## Search Placement

`searchable` renders a full-width search field above the table by default. Set
`search-container` to a DOM selector when the search field should live somewhere else
on the page.

```html
<div id="staff-search"></div>
<loomi-table id="staff-table" searchable search-container="#staff-search"></loomi-table>
```

## Sortable

```html
<loomi-table id="t5" sortable></loomi-table>

<!-- restrict which columns can be sorted -->
<loomi-table id="t6" sortable sortable-columns="first_name,department"></loomi-table>

<script type="module">
  const staff = [
    { first_name: "Zane", last_name: "Hart", department: "Engineering", email: "zane@loomiui.dev" },
    { first_name: "Ada", last_name: "Quint", department: "Engineering", email: "ada@loomiui.dev" },
    { first_name: "Rita", last_name: "Boon", department: "Marketing", email: "rita@loomiui.dev" },
    { first_name: "Joe", last_name: "Diaz", department: "Design", email: "joe@loomiui.dev" },
    { first_name: "Nia", last_name: "Cole", department: "Marketing", email: "nia@loomiui.dev" },
    { first_name: "Sara", last_name: "Field", department: "Design", email: "sara@loomiui.dev" },
  ];
  document.getElementById("t5").data = staff;
  document.getElementById("t6").data = staff;
</script>
```

Click a sortable column heading to sort by it; click again to reverse direction.

## Checkable Rows

Adds a checkbox column. Read the current selection from the `selectedIds` property, or
listen for `loomi-selection-change`.

```html
<loomi-table id="t7" checkable></loomi-table>

<script type="module">
  const t7 = document.getElementById("t7");
  t7.data = [
    { id: 1, first_name: "Ada", department: "Engineering", email: "ada@loomiui.dev" },
    { id: 2, first_name: "Sara", department: "Design", email: "sara@loomiui.dev" },
    { id: 3, first_name: "Zane", department: "Engineering", email: "zane@loomiui.dev" },
    { id: 4, first_name: "Rita", department: "Marketing", email: "rita@loomiui.dev" },
    { id: 5, first_name: "Joe", department: "Design", email: "joe@loomiui.dev" },
  ];
  t7.addEventListener("loomi-selection-change", (e) => {
    console.log(e.detail.ids); // every checked row's id
  });
</script>
```

Pre-check rows on load with `selected-value` (comma-separated ids), and control which
field counts as the row's id with `id-key` (defaults to `id`).

## Grouping Rows

Group dynamic rows by any key in your data with `groupby`. Rows that share a value are
collected under a heading row for that value, in the order the groups first appear.

```html
<loomi-table id="staff-by-team" groupby="department"></loomi-table>

<script type="module">
  document.getElementById("staff-by-team").data = [
    { first_name: "Ada", last_name: "Quint", department: "Engineering", email: "ada@loomiui.dev" },
    { first_name: "Zane", last_name: "Hart", department: "Engineering", email: "zane@loomiui.dev" },
    { first_name: "Leo", last_name: "Mensah", department: "Engineering", email: "leo@loomiui.dev" },
    { first_name: "Priya", last_name: "Nair", department: "Engineering", email: "priya@loomiui.dev" },
    { first_name: "Sara", last_name: "Field", department: "Design", email: "sara@loomiui.dev" },
    { first_name: "Joe", last_name: "Diaz", department: "Design", email: "joe@loomiui.dev" },
    { first_name: "Rita", last_name: "Boon", department: "Marketing", email: "rita@loomiui.dev" },
    { first_name: "Nia", last_name: "Cole", department: "Marketing", email: "nia@loomiui.dev" },
    { first_name: "Wren", last_name: "Ortiz", department: "Finance", email: "wren@loomiui.dev" },
    { first_name: "Tom", last_name: "Brandt", department: "Finance", email: "tom@loomiui.dev" },
  ];
</script>
```

This renders four group headings — Engineering, Design, Marketing, Finance — each
followed by its rows.

## Pagination

```html
<loomi-table id="t8" paginated page-size="5"></loomi-table>

<!-- show page numbers instead of prev/next arrows -->
<loomi-table id="t9" paginated page-size="5" pagination-style="numbers"></loomi-table>

<!-- use a page dropdown -->
<loomi-table id="t9-dropdown" paginated page-size="5" pagination-style="dropdown"></loomi-table>

<!-- leading row-number column -->
<loomi-table id="t10" paginated page-size="5" show-row-numbers></loomi-table>

<script type="module">
  const staff = [
    { id: 1, first_name: "Ada", department: "Engineering", email: "ada@loomiui.dev" },
    { id: 2, first_name: "Sara", department: "Design", email: "sara@loomiui.dev" },
    { id: 3, first_name: "Zane", department: "Engineering", email: "zane@loomiui.dev" },
    { id: 4, first_name: "Rita", department: "Marketing", email: "rita@loomiui.dev" },
    { id: 5, first_name: "Joe", department: "Design", email: "joe@loomiui.dev" },
    { id: 6, first_name: "Nia", department: "Marketing", email: "nia@loomiui.dev" },
    { id: 7, first_name: "Leo", department: "Engineering", email: "leo@loomiui.dev" },
    { id: 8, first_name: "Wren", department: "Finance", email: "wren@loomiui.dev" },
    { id: 9, first_name: "Priya", department: "Engineering", email: "priya@loomiui.dev" },
    { id: 10, first_name: "Tom", department: "Finance", email: "tom@loomiui.dev" },
    { id: 11, first_name: "Maya", department: "Support", email: "maya@loomiui.dev" },
    { id: 12, first_name: "Owen", department: "Support", email: "owen@loomiui.dev" },
  ];
  for (const id of ["t8", "t9", "t9-dropdown", "t10"]) document.getElementById(id).data = staff;
</script>
```

With `page-size="5"` and twelve rows, each table above paginates across three pages —
enough to see the arrow, numbers, and row-number variants actually flip between pages.
Pagination styles: `arrows` (default), `numbers`, `dropdown` — same options as
[`<loomi-pagination>`](../pagination), since that's exactly what renders underneath.

Customize the total text with `:a`, `:b`, and `:c` placeholders:

```html
<loomi-table paginated page-size="5" total-label=":a - :b of :c"></loomi-table>
<loomi-table paginated page-size="5" total-label="Showing :a - :b"></loomi-table>
```

Those render as `1 - 5 of 50` and `Showing 1 - 5`.

## No Data Message

```html
<loomi-table id="t11" no-data-message="The staff directory is empty"></loomi-table>
```

Render the message as an empty-state panel with optional image, heading, and button:

```html
<loomi-table
  message-as-empty-state
  show-image="false"
  heading="No staff"
  no-data-message="The staff directory is empty"
  button-label="Add staff"
></loomi-table>
```

Listen for `loomi-empty-action` to handle the empty-state button. The `onclick`
attribute is accepted and included in the event detail.

## Manual and Custom Layouts

For a manually authored table, provide header cells in the `header` slot and rows in
the default slot:

```html
<loomi-table selectable>
  <th slot="header">Item</th>
  <th slot="header">Quantity</th>
  <tr><td>Office furniture</td><td>2</td></tr>
  <tr><td>Standing desks</td><td>6</td></tr>
  <tr><td>Monitor arms</td><td>10</td></tr>
</loomi-table>
```

For dynamic data with a custom row layout, set `layout="custom"` and provide header
and row templates. Row templates replace `{key}` placeholders from each row, while
pagination still works from the `data` array.

```html
<loomi-table id="custom-users" layout="custom" paginated page-size="5">
  <template slot="header"><th>ID</th><th>User Details</th></template>
  <template slot="row">
    <tr><td>{id}</td><td><strong>{name}</strong><br>{email}</td></tr>
  </template>
</loomi-table>

<script type="module">
  document.getElementById("custom-users").data = [
    { id: 1, name: "Ada Quint", email: "ada@loomiui.dev" },
    { id: 2, name: "Sara Field", email: "sara@loomiui.dev" },
    { id: 3, name: "Zane Hart", email: "zane@loomiui.dev" },
    { id: 4, name: "Rita Boon", email: "rita@loomiui.dev" },
    { id: 5, name: "Joe Diaz", email: "joe@loomiui.dev" },
    { id: 6, name: "Nia Cole", email: "nia@loomiui.dev" },
    { id: 7, name: "Leo Mensah", email: "leo@loomiui.dev" },
  ];
</script>
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
    { id: 3, first_name: "Zane", department: "Engineering" },
    { id: 4, first_name: "Rita", department: "Marketing" },
    { id: 5, first_name: "Joe", department: "Design" },
    { id: 6, first_name: "Nia", department: "Marketing" },
    { id: 7, first_name: "Leo", department: "Engineering" },
  ];
  t.excludeColumns = "id";
  t.actionIcons = [{ icon: "trash", name: "delete", color: "error", tip: "Delete" }];
  t.addEventListener("action", (e) => console.log(e.detail));
  t.addEventListener("loomi-selection-change", (e) => console.log(e.detail.ids));
</script>
```

## Accessibility

For the library-wide baseline, see [Foundations — Accessibility](https://loomiui.com/foundations/#accessibility).

## Responsive behavior

For the shared container and viewport rules, see [Foundations — Responsive behavior](https://loomiui.com/foundations/#responsive-behavior).

## Dark mode

loomi-table uses Loomi semantic tokens such as `--loomi-surface`, `--loomi-surface-muted`, `--loomi-surface-border-subtle`, `--loomi-text`, and palette accent tokens instead of hard-coded light colors. The table header, row dividers, panels, hover states, and muted text shift with the active theme preset.

For theme activation, token overrides, and contrast guidance, see [Foundations — Dark mode](https://loomiui.com/foundations/#dark-mode).

## Attributes

| Attribute                | Default                          | Description                                                                           |
| ------------------------ | -------------------------------- | ------------------------------------------------------------------------------------- |
| `name`                   | auto                             | Stable class/name hook, matching Loomi targeting patterns.                            |
| `data`                   | `[]`                             | Row objects — property (`.data`) or JSON-string attribute.                            |
| `columns`                | _(auto)_                         | Column keys (defaults to the first row's keys).                                       |
| `layout`                 | `auto`                           | `auto` \| `custom`; custom uses row/header templates or slotted rows.                 |
| `row-template`           | _(blank)_                        | Template string for `layout="custom"`; `{key}` placeholders are filled from row data. |
| `include-columns`        | _(blank)_                        | Comma-separated key allow list.                                                       |
| `exclude-columns`        | _(blank)_                        | Comma-separated key deny list (`include` wins if both are set).                       |
| `column-aliases`         | `{}`                             | Map of `key -> display name` (property or JSON).                                      |
| `searchable`             | `false`                          | Show a search box. _(boolean)_                                                        |
| `search-container`       | _(blank)_                        | DOM selector where the search input should be rendered.                               |
| `search-placeholder`     | `Search table below...`          | Search input placeholder.                                                             |
| `sortable`               | `false`                          | Enable column sorting. _(boolean)_                                                    |
| `sortable-columns`       | _(all)_                          | Comma-separated sortable keys.                                                        |
| `paginated`              | `false`                          | Enable pagination. _(boolean)_                                                        |
| `page-size`              | `25`                             | Rows per page.                                                                        |
| `pagination-style`       | `arrows`                         | `arrows` \| `numbers` \| `dropdown`                                                   |
| `show-total`             | `true`                           | Show the pagination total label. _(boolean)_                                          |
| `show-page-number`       | `true`                           | Show current page between arrow controls. _(boolean)_                                 |
| `show-total-pages`       | `false`                          | Show `current / total` for arrow pagination. _(boolean)_                              |
| `default-page`           | `1`                              | Initial selected page.                                                                |
| `limit`                  | `0`                              | Max total rows to display (`0` = no limit).                                           |
| `total-label`            | `Showing :a to :b of :c records` | Pagination total label placeholders.                                                  |
| `selectable`             | `false`                          | Row clicks toggle selection. _(boolean)_                                              |
| `checkable`              | `false`                          | Add a checkbox column. _(boolean)_                                                    |
| `id-key`                 | `id`                             | Row key used as the selection id.                                                     |
| `selected-value`         | _(blank)_                        | Comma-separated ids to pre-check.                                                     |
| `action-icons`           | `[]`                             | Array of `{ icon, name?, tip?, color?, click?, iconType?, buttonOutline? }`.          |
| `actions-title`          | `actions`                        | Heading for the action-icons column.                                                  |
| `show-row-numbers`       | `false`                          | Show a leading `#` column. _(boolean)_                                                |
| `groupby`                | _(blank)_                        | Key used to render group heading rows.                                                |
| `striped`                | `false`                          | Alternating row backgrounds. _(boolean)_                                              |
| `divided`                | `true`                           | Row divider lines. _(boolean)_                                                        |
| `celled`                 | `false`                          | Borders on every cell, like a spreadsheet. _(boolean)_                                |
| `compact`                | `false`                          | Tighter row padding. _(boolean)_                                                      |
| `transparent`            | `false`                          | Removes the table's own background. _(boolean)_                                       |
| `has-hover`              | `false`                          | Highlights rows on hover. _(boolean)_                                                 |
| `has-shadow`             | `true`                           | Outer drop shadow. _(boolean)_                                                        |
| `has-border`             | `false`                          | Outer border. _(boolean)_                                                             |
| `divider`                | `regular`                        | `regular` \| `thin`                                                                   |
| `no-data-message`        | `No records to display`          | Shown when there are no rows.                                                         |
| `message-as-empty-state` | `false`                          | Render no-data content as an empty state. _(boolean)_                                 |
| `image`                  | `empty-state.svg`                | Empty-state image URL.                                                                |
| `heading`                | _(blank)_                        | Empty-state heading.                                                                  |
| `button-label`           | _(blank)_                        | Empty-state CTA label.                                                                |
| `show-image`             | `true`                           | Show empty-state image. _(boolean)_                                                   |
| `onclick`                | _(blank)_                        | empty-state action string, also emitted in `loomi-empty-action`.                      |
| `nonce`                  | _(blank)_                        | Accepted as a no-op compatibility attribute.                                          |

**Events:** `loomi-row-click` (`{ row }`), `action` (`{ name, row }`),
`loomi-action-call`, `loomi-selection-change` (`{ ids, rows, selectedValue }`), `loomi-empty-action`,
`loomi-page-change` (`{ page }`).
**Properties:** `selectedIds`, `selectedRows` (read-only current selection).

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
  t.data = [
    { id: 1, first_name: "Ada", last_name: "Quint", department: "Engineering", email: "ada@loomiui.dev" },
    { id: 2, first_name: "Sara", last_name: "Field", department: "Design", email: "sara@loomiui.dev" },
    { id: 3, first_name: "Zane", last_name: "Hart", department: "Engineering", email: "zane@loomiui.dev" },
    { id: 4, first_name: "Rita", last_name: "Boon", department: "Marketing", email: "rita@loomiui.dev" },
    { id: 5, first_name: "Joe", last_name: "Diaz", department: "Design", email: "joe@loomiui.dev" },
    { id: 6, first_name: "Nia", last_name: "Cole", department: "Marketing", email: "nia@loomiui.dev" },
    { id: 7, first_name: "Leo", last_name: "Mensah", department: "Engineering", email: "leo@loomiui.dev" },
    { id: 8, first_name: "Wren", last_name: "Ortiz", department: "Finance", email: "wren@loomiui.dev" },
    { id: 9, first_name: "Priya", last_name: "Nair", department: "Engineering", email: "priya@loomiui.dev" },
    { id: 10, first_name: "Tom", last_name: "Brandt", department: "Finance", email: "tom@loomiui.dev" },
  ];
  t.excludeColumns = "id";
  t.columnAliases = { first_name: "First Name", last_name: "Last Name" };
  t.actionIcons = [
    { icon: "pencil-square", name: "edit", tip: "Edit" },
    { icon: "trash", name: "delete", color: "error", tip: "Delete" },
  ];
</script>
```

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-table>` is a standard custom element, so the browser can use it in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/table` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomidev/table lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/table build
pnpm --filter @loomidev/table typecheck
```

### Choose your framework

<loomi-tabs>
<loomi-tab label="HTML" active>

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/table"></script>

<loomi-table id="customers-table" searchable sortable paginated page-size="10"></loomi-table>
```

</loomi-tab>
<loomi-tab label="Bundlers and SPAs">

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/table";
```

This component accepts `data` as a JavaScript property. Use an HTML attribute only for simple strings; use a property when you pass arrays, objects, or functions.

```js
const el = document.querySelector("loomi-table");
el.data = [{ id: 1, name: "Ama", email: "ama@example.com" }, { id: 2, name: "Kofi", email: "kofi@example.com" }];
```

</loomi-tab>
<loomi-tab label="Blade">

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomidev/table lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/table";
```

```blade
<loomi-table id="customers-table" searchable sortable paginated page-size="10"></loomi-table>
```

</loomi-tab>
<loomi-tab label="React">

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import { useEffect, useRef } from "react";
import "@loomidev/table";

export function LoomiExample() {
  const el = useRef(null);

  useEffect(() => {
    el.current.data = [{ id: 1, name: "Ama", email: "ama@example.com" }, { id: 2, name: "Kofi", email: "kofi@example.com" }];
  }, []);

  return <loomi-table ref={el}></loomi-table>;
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

</loomi-tab>
<loomi-tab label="Vue">

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import { onMounted, ref } from "vue";
import "@loomidev/table";

const el = ref(null);

onMounted(() => {
  el.value.data = [{ id: 1, name: "Ama", email: "ama@example.com" }, { id: 2, name: "Kofi", email: "kofi@example.com" }];
});
</script>

<template>
  <loomi-table ref="el"></loomi-table>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

</loomi-tab>
<loomi-tab label="Angular">

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, ViewChild } from "@angular/core";
import "@loomidev/table";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-table #el></loomi-table>
  `,
})
export class AppComponent implements AfterViewInit {
  @ViewChild("el") el!: ElementRef<any>;

  ngAfterViewInit() {
    this.el.nativeElement.data = [{ id: 1, name: "Ama", email: "ama@example.com" }, { id: 2, name: "Kofi", email: "kofi@example.com" }];
  }
}
```

</loomi-tab>
<loomi-tab label="Svelte / Astro">

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import { onMount } from "svelte";
  import "@loomidev/table";

  let el;

  onMount(() => {
    el.data = [{ id: 1, name: "Ama", email: "ama@example.com" }, { id: 2, name: "Kofi", email: "kofi@example.com" }];
  });
</script>

<loomi-table bind:this={el}></loomi-table>
```

```astro
---
import "@loomidev/table";
---

<loomi-table id="customers-table" searchable sortable paginated page-size="10"></loomi-table>
```

</loomi-tab>
</loomi-tabs>

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->

## Dependencies

- `@loomidev/checkbox`
- `@loomidev/core`
- `@loomidev/icons`
- `@loomidev/input`
- `@loomidev/pagination`
