# @loomidev/sortable

`<loomi-sortable>` — a SortableJS-inspired drag-and-drop list. Provide rows via the
`items` array (`{ id, label, meta?, locked?, filtered?, className? }`) and read the
new order back from the `reorder` event. Give two or more lists the same `group` to
let users drag items between them — a Kanban board's columns, for example.

```bash
npm install @loomidev/sortable lit
```

```js
import "@loomidev/sortable";
```


## Accessibility
- Implements ARIA roles/states for custom interaction surfaces.
- Supports keyboard focus with visible `:focus-visible` styling on interactive controls.

## Responsive behavior
- Fluid width (`width: 100%`, `min-width: 0`) within flex and grid layouts.

## Dark mode
- Uses semantic `--loomi-surface`, `--loomi-surface-border`, and `--loomi-text` tokens where applicable.
- Respects `.dark` on `<html>` via `@loomidev/theme-switcher` or your app theme.
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

```html
<loomi-sortable id="task-owners"></loomi-sortable>

<script type="module">
  const taskOwners = document.getElementById("task-owners");
  taskOwners.items = [
    { id: "hero", label: "Wireframe the hero section", meta: "Due Friday · Ada" },
    { id: "palette", label: "Pick a color palette", meta: "Due Monday · Sam" },
    { id: "copy", label: "Draft product copy", meta: "Due Tuesday · Lee" },
  ];
</script>
```

## Reacting to a Reorder

The `reorder` event fires after dragging a row within the same list, with the full new
order of ids.

```html
<loomi-sortable id="priority-list" has-handle></loomi-sortable>
<output id="priority-order"></output>

<script type="module">
  const priorityList = document.getElementById("priority-list");
  const priorityOrder = document.getElementById("priority-order");

  priorityList.items = [
    { id: "launch", label: "Launch checklist" },
    { id: "qa", label: "QA pass" },
    { id: "docs", label: "Publish docs" },
  ];

  priorityList.addEventListener("reorder", (e) => {
    priorityOrder.value = e.detail.order.join(" -> ");
  });
</script>
```

## Shared Lists

Give two or more `<loomi-sortable>` elements the same non-empty `group` and users can
drag a row from one straight into another — exactly what a "To Do / In Progress / Done"
board needs. Lists with no `group` (or a different one) stay independent.

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

When an item moves across lists, `transfer` fires on **both** lists involved — once on
the list that lost it, once on the one that gained it — each with that list's own
resulting `order`. Listen on whichever lists you care about to persist the new column.

```js
for (const id of ["todo", "in-progress", "done"]) {
  document.getElementById(id).addEventListener("transfer", (e) => {
    console.log(id, e.detail.order, e.detail.items);
  });
}
```

An empty list still accepts a drop — it shows a "Drop here" hint so the target is
visible even with zero rows.

## Cloning

Use `clone` or `group.pull = "clone"` to copy items into another list while leaving
the source list unchanged.

```html
<div>
  <h3>Palette</h3>
  <loomi-sortable id="palette"></loomi-sortable>
</div>
<div>
  <h3>Canvas</h3>
  <loomi-sortable id="canvas" group="blocks"></loomi-sortable>
</div>

<script type="module">
  const palette = document.getElementById("palette");
  const canvas = document.getElementById("canvas");

  palette.group = { name: "blocks", pull: "clone", put: false };
  palette.items = [
    { id: "heading", label: "Heading block" },
    { id: "image", label: "Image block" },
    { id: "quote", label: "Quote block" },
  ];

  canvas.items = [{ id: "intro", label: "Intro section" }];
</script>
```

## Disabling Sorting

Set `sort = false` to prevent reordering within a list while still allowing items to
be dragged into another compatible list. Set `sortable = false` only when the list
should not start drags at all.

```html
<div>
  <h3>Templates</h3>
  <loomi-sortable id="templates"></loomi-sortable>
</div>
<div>
  <h3>Plan</h3>
  <loomi-sortable id="plan" group="planning"></loomi-sortable>
</div>

<script type="module">
  const templates = document.getElementById("templates");
  const plan = document.getElementById("plan");

  templates.group = { name: "planning", pull: "clone", put: false };
  templates.sort = false;
  templates.items = [
    { id: "kickoff", label: "Kickoff meeting" },
    { id: "review", label: "Review session" },
    { id: "handoff", label: "Handoff" },
  ];

  plan.items = [{ id: "brief", label: "Write project brief" }];
</script>
```

## Handles

Set `has-handle` or the SortableJS-style `handle` property to make rows draggable
only from the built-in grip.

```html
<loomi-sortable id="handled-list" has-handle></loomi-sortable>

<script type="module">
  const handledList = document.getElementById("handled-list");
  handledList.items = [
    { id: "brief", label: "Write project brief" },
    { id: "review", label: "Design review" },
    { id: "launch", label: "Launch" },
  ];

  // Equivalent to the has-handle attribute:
  // handledList.handle = ".loomi-handle";
</script>
```

## Filter

Set `filter` to a selector and mark rows with `className` or `filtered`. Filtered and
locked rows do not start drags and emit a `filter` event when clicked or drag-started.

```html
<loomi-sortable id="approval-steps" filter=".filtered"></loomi-sortable>
<output id="approval-message"></output>

<script type="module">
  const approvalSteps = document.getElementById("approval-steps");
  const approvalMessage = document.getElementById("approval-message");

  approvalSteps.items = [
    { id: "draft", label: "Draft proposal" },
    { id: "legal", label: "Legal approval", className: "filtered" },
    { id: "send", label: "Send to client" },
  ];

  approvalSteps.addEventListener("filter", (e) => {
    approvalMessage.value = `${e.detail.item.label} cannot be moved`;
  });
</script>
```

## MultiDrag

Set `multi-drag` or the `multiDrag` property to let users click-select rows and drag
the selected set together.

```html
<loomi-sortable id="batch-list" multi-drag></loomi-sortable>

<script type="module">
  const batchList = document.getElementById("batch-list");
  batchList.items = [
    { id: "alpha", label: "Alpha release" },
    { id: "beta", label: "Beta release" },
    { id: "ga", label: "General availability" },
    { id: "retro", label: "Retrospective" },
  ];

  batchList.addEventListener("reorder", (e) => {
    console.log("New batch order:", e.detail.order);
  });
</script>
```

## Swap

Set `swap` to swap the dragged row with the hovered row instead of shifting rows in
between.

```html
<loomi-sortable id="swap-list" swap></loomi-sortable>

<script type="module">
  const swapList = document.getElementById("swap-list");
  swapList.items = [
    { id: "morning", label: "Morning support rotation" },
    { id: "midday", label: "Midday support rotation" },
    { id: "evening", label: "Evening support rotation" },
  ];
</script>
```

## Reacting to a Click (Not a Drag)

`item-click` fires when a row is clicked without being dragged — native drag-and-drop
suppresses the browser's own `click` event after an actual drag, so this only fires for
genuine clicks. Useful for opening a detail view.

```html
<loomi-sortable id="detail-list"></loomi-sortable>
<output id="detail-output"></output>

<script type="module">
  const detailList = document.getElementById("detail-list");
  const detailOutput = document.getElementById("detail-output");

  detailList.items = [
    { id: "invoice", label: "Invoice review", meta: "Finance" },
    { id: "contract", label: "Contract edits", meta: "Legal" },
  ];

  detailList.addEventListener("item-click", (e) => {
    detailOutput.value = `Open details for ${e.detail.item.label}`;
  });
</script>
```

## Saving the Order

Persist the new order from `reorder` (or `transfer`) — e.g. via a fetch call to your
backend.

```html
<loomi-sortable id="saved-list" name="task_order"></loomi-sortable>

<script type="module">
  const savedList = document.getElementById("saved-list");
  savedList.items = [
    { id: "research", label: "Research" },
    { id: "draft", label: "Draft" },
    { id: "publish", label: "Publish" },
  ];

  savedList.addEventListener("reorder", async (e) => {
    await fetch("/tasks/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: e.detail.order }),
    });
  });
</script>
```

Read the current order at any time via the `order` property, without waiting for an
event.

```js
console.log(savedList.order); // current ids, top to bottom
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `items` | `[]` | Rows to display/reorder — `{ id, label, meta? }[]` (property or JSON). |
| `group` | _(blank)_ | String group name, or JS property object `{ name, pull, put }`. |
| `clone` | `false` | Clone dragged items into another shared list instead of moving them. |
| `sort` | `true` | Enable same-list sorting. When `false`, compatible outbound drags still work. |
| `sortable` | `true` | Enable drag-starting from the list. |
| `has-handle` | `false` | Drag rows only from the built-in handle. |
| `handle` | _(blank)_ | SortableJS-style handle selector; enables the built-in handle. |
| `filter` | _(blank)_ | Selector for rows/elements that should not drag. |
| `multi-drag` | `false` | Click-select multiple rows and drag them together. |
| `swap` | `false` | Swap the dragged row with the hovered row. |

**Property:** `order` (array of ids). **Events:** `reorder` (`detail: { order }`, same-list
drag), `transfer` (`detail: { order, items }`, fired on both lists after a cross-list move),
`filter` (`detail: { item }`), `item-click` (`detail: { item }`, a click outside multi-drag
mode).

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

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-sortable>` is a standard custom element, so the browser can use it in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/sortable` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomidev/sortable lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/sortable build
pnpm --filter @loomidev/sortable typecheck
```

### Choose your framework

<loomi-tabs>
<loomi-tab label="Plain HTML" active>

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/sortable"></script>

<loomi-sortable id="task-list"></loomi-sortable>
```

</loomi-tab>
<loomi-tab label="Bundlers and SPAs">

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/sortable";
```


This component accepts `items` as a JavaScript property. Use an HTML attribute only for simple strings; use a property when you pass arrays, objects, or functions.

```js
const el = document.querySelector("loomi-sortable");
el.items = [{ id: "todo", label: "To do" }, { id: "doing", label: "Doing" }];
```

</loomi-tab>
<loomi-tab label="Laravel Blade">

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomidev/sortable lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/sortable";
```

```blade
<loomi-sortable id="task-list"></loomi-sortable>
```

</loomi-tab>
<loomi-tab label="React">

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import { useEffect, useRef } from "react";
import "@loomidev/sortable";

export function LoomiExample() {
  const el = useRef(null);

  useEffect(() => {
    el.current.items = [{ id: "todo", label: "To do" }, { id: "doing", label: "Doing" }];
  }, []);

  return <loomi-sortable ref={el}></loomi-sortable>;
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

</loomi-tab>
<loomi-tab label="Vue">

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import { onMounted, ref } from "vue";
import "@loomidev/sortable";

const el = ref(null);

onMounted(() => {
  el.value.items = [{ id: "todo", label: "To do" }, { id: "doing", label: "Doing" }];
});
</script>

<template>
  <loomi-sortable ref="el"></loomi-sortable>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

</loomi-tab>
<loomi-tab label="Angular">

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, ViewChild } from "@angular/core";
import "@loomidev/sortable";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-sortable #el></loomi-sortable>
  `,
})
export class AppComponent implements AfterViewInit {
  @ViewChild("el") el!: ElementRef<any>;

  ngAfterViewInit() {
    this.el.nativeElement.items = [{ id: "todo", label: "To do" }, { id: "doing", label: "Doing" }];
  }
}
```

</loomi-tab>
<loomi-tab label="Svelte and Astro">

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import { onMount } from "svelte";
  import "@loomidev/sortable";

  let el;

  onMount(() => {
    el.items = [{ id: "todo", label: "To do" }, { id: "doing", label: "Doing" }];
  });
</script>

<loomi-sortable bind:this={el}></loomi-sortable>
```

```astro
---
import "@loomidev/sortable";
---

<loomi-sortable id="task-list"></loomi-sortable>
```

</loomi-tab>
</loomi-tabs>

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->
