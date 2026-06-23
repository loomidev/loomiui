# @loomi/table

`<loomi-table>` — a data-driven table with search, sorting, pagination (via `<loomi-pagination>`), checkable rows (via `<loomi-checkbox>`) and action icons.

```bash
npm install @loomi/table lit
```

```js
import "@loomi/table/loomi-table.js";
```

## Usage

```html
<loomi-table id="t" searchable sortable paginated page-size="10" checkable has-hover></loomi-table>

<script type="module">
  const t = document.getElementById("t");
  t.data = [{ id: 1, first_name: "Ada", department: "Eng" }, /* … */];
  t.excludeColumns = "id";
  t.actionIcons = [{ icon: "trash", name: "delete", color: "red", tip: "Delete" }];
  t.addEventListener("action", (e) => console.log(e.detail)); // { name, row }
  t.addEventListener("selection-change", (e) => console.log(e.detail.ids));
</script>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `data` | [] | Row objects — property (`.data`) or JSON-string attribute. |
| `columns` | _(auto)_ | Column keys (defaults to the first row's keys). |
| `include-columns / exclude-columns` | _(blank)_ | Comma-separated key allow/deny lists. |
| `column-aliases` | {} | Map of `key -> display name` (property or JSON). |
| `searchable` | false | Show a search box. _(boolean)_ |
| `sortable` | false | Enable column sorting. _(boolean)_ |
| `sortable-columns` | _(all)_ | Comma-separated sortable keys. |
| `paginated` | false | Enable pagination. _(boolean)_ |
| `page-size` | 10 | Rows per page. |
| `pagination-style` | arrows | `arrows` \| `numbers` \| `dropdown` |
| `checkable` | false | Add a checkbox column. _(boolean)_ |
| `id-key` | id | Row key used as the selection id. |
| `selected-value` | _(blank)_ | Comma-separated ids to pre-check. |
| `action-icons` | [] | Array of `{ icon, name?, tip?, color? }` (property or JSON). |
| `show-row-numbers` | false | Show a leading `#` column. _(boolean)_ |
| `striped / divided / celled / compact / has-hover / has-shadow / has-border` | — | Styling toggles. _(boolean)_ |
| `no-data-message` | No records to display | Shown when there are no rows. |

**Events:** `row-click` (`{ row }`), `action` (`{ name, row }`), `selection-change` (`{ ids }`), `page-change` (`{ page }`). **Property:** `selectedIds`.

> Not (yet) ported: row grouping, custom/manual `<tr>` layouts, empty-state integration.
