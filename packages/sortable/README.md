# @loomi/sortable

`<loomi-sortable>` — a drag-and-drop reorderable list. Provide rows via the `items` array (`{ id, label }`).

```bash
npm install @loomi/sortable lit
```

```js
import "@loomi/sortable/loomi-sortable.js";
```

## Usage

```html
<loomi-sortable id="s"></loomi-sortable>
<script type="module">
  const s = document.getElementById("s");
  s.items = [{ id: "a", label: "First" }, { id: "b", label: "Second" }];
  s.addEventListener("reorder", (e) => console.log(e.detail.order)); // ["b","a"]
</script>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `items` | [] | Rows to display/reorder — `{ id, label }[]` (property or JSON). |

**Property:** `order` (array of ids). **Event:** `reorder` (`detail: { order }`).
