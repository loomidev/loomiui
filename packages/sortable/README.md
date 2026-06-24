# @loomi/sortable

`<loomi-sortable>` — a drag-and-drop reorderable list. Provide rows via the `items`
array (`{ id, label, meta? }`) and read the new order back from the `reorder` event.
Give two or more lists the same `group` to let users drag items between them — a Kanban
board's columns, for example.

```bash
npm install @loomi/sortable lit
```

```js
import "@loomi/sortable/loomi-sortable.js";
```

## Basic Usage

```html
<loomi-sortable id="s"></loomi-sortable>

<script type="module">
  const s = document.getElementById("s");
  s.items = [
    { id: "tomatoes", label: "Tomatoes" },
    { id: "onions", label: "Onions" },
    { id: "garlic", label: "Garlic" },
  ];
</script>
```

## A Secondary Line per Row

`meta` renders as a smaller line beneath `label` — useful for a due date, a subtitle,
or an assignee.

```js
s.items = [{ id: "1", label: "Wireframe the hero section", meta: "Due Friday · Ada" }];
```

## Reacting to a Reorder

The `reorder` event fires after dragging a row within the same list, with the full new
order of ids.

```js
document.getElementById("s").addEventListener("reorder", (e) => {
  console.log(e.detail.order); // ["onions", "garlic", "tomatoes"]
});
```

## Moving Items Between Lists

Give two or more `<loomi-sortable>` elements the same `group` and users can drag a row
from one straight into another — exactly what a "To Do / In Progress / Done" board
needs. Lists with no `group` (or a different one) stay independent.

```html
<div>
  <h3>To Do</h3>
  <loomi-sortable id="todo" group="board"></loomi-sortable>
</div>
<div>
  <h3>In Progress</h3>
  <loomi-sortable id="in-progress" group="board"></loomi-sortable>
</div>
<div>
  <h3>Done</h3>
  <loomi-sortable id="done" group="board"></loomi-sortable>
</div>

<script type="module">
  document.getElementById("todo").items = [{ id: "1", label: "Wireframe the hero" }];
  document.getElementById("in-progress").items = [];
  document.getElementById("done").items = [];
</script>
```

When an item moves across groups, `transfer` fires on **both** lists involved — once on
the list that lost it, once on the one that gained it — each with that list's own
resulting `order`. Listen on whichever lists you care about to persist the new column.

```js
for (const id of ["todo", "in-progress", "done"]) {
  document.getElementById(id).addEventListener("transfer", (e) => {
    console.log(id, e.detail.order, e.detail.item);
  });
}
```

An empty list still accepts a drop — it shows a "Drop here" hint so the target is
visible even with zero rows.

## Reacting to a Click (Not a Drag)

`item-click` fires when a row is clicked without being dragged — native drag-and-drop
suppresses the browser's own `click` event after an actual drag, so this only fires for
genuine clicks. Useful for opening a detail view.

```js
s.addEventListener("item-click", (e) => openTaskDetail(e.detail.item.id));
```

## Saving the Order

Persist the new order from `reorder` (or `transfer`) — e.g. via a fetch call to your
backend.

```js
const s = document.getElementById("s");
s.addEventListener("reorder", async (e) => {
  await fetch("/tasks/reorder", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ order: e.detail.order }),
  });
});
```

Read the current order at any time via the `order` property, without waiting for an
event.

```js
console.log(s.order); // current ids, top to bottom
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `items` | `[]` | Rows to display/reorder — `{ id, label, meta? }[]` (property or JSON). |
| `group` | _(blank)_ | Lists sharing the same non-blank group can exchange items via drag-and-drop. |

**Property:** `order` (array of ids). **Events:** `reorder` (`detail: { order }`, same-list
drag), `transfer` (`detail: { order, item }`, fired on both lists after a cross-list move),
`item-click` (`detail: { item }`, a click that wasn't a drag).

> Not (yet) ported from BladewindUI's SortableJS-backed version: a dedicated drag
> handle (the whole row is draggable, not just the grip icon), multi-select drag, swap
> mode, and locking individual items from being dragged.

## Full Example

```html
<loomi-sortable id="todo" group="board"></loomi-sortable>
<loomi-sortable id="in-progress" group="board"></loomi-sortable>
<loomi-sortable id="done" group="board"></loomi-sortable>

<script type="module">
  const todo = document.getElementById("todo");
  todo.items = [
    { id: "1", label: "Wireframe the hero section", meta: "Ada" },
    { id: "2", label: "Pick a color palette", meta: "Sam" },
  ];
  document.getElementById("in-progress").items = [];
  document.getElementById("done").items = [];

  for (const id of ["todo", "in-progress", "done"]) {
    document.getElementById(id).addEventListener("transfer", (e) => saveBoard());
  }
</script>
```
