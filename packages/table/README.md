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
import "@loomi/table";
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

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-table>` is a standard custom element, so the browser can use it in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/table` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomi/table lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomi/table build
pnpm --filter @loomi/table typecheck
```

### Plain HTML

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomi/table"></script>

<loomi-table id="customers-table" searchable sortable paginated page-size="10"></loomi-table>
```

### Bundlers and single-page apps

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomi/table";
```


This component accepts `data` as a JavaScript property. Use an HTML attribute only for simple strings; use a property when you pass arrays, objects, or functions.

```js
const el = document.querySelector("loomi-table");
el.data = [{ id: 1, name: "Ama", email: "ama@example.com" }, { id: 2, name: "Kofi", email: "kofi@example.com" }];
```

### Laravel Blade

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomi/table lit
npm run dev
```

```js
// resources/js/app.js
import "@loomi/table";
```

```blade
<loomi-table id="customers-table" searchable sortable paginated page-size="10"></loomi-table>
```

### React

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import { useEffect, useRef } from "react";
import "@loomi/table";

export function LoomiExample() {
  const el = useRef(null);

  useEffect(() => {
    el.current.data = [{ id: 1, name: "Ama", email: "ama@example.com" }, { id: 2, name: "Kofi", email: "kofi@example.com" }];
  }, []);

  return <loomi-table ref={el}></loomi-table>;
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

### Vue

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import { onMounted, ref } from "vue";
import "@loomi/table";

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

### Angular

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, ViewChild } from "@angular/core";
import "@loomi/table";

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

### Svelte and Astro

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import { onMount } from "svelte";
  import "@loomi/table";

  let el;

  onMount(() => {
    el.data = [{ id: 1, name: "Ama", email: "ama@example.com" }, { id: 2, name: "Kofi", email: "kofi@example.com" }];
  });
</script>

<loomi-table bind:this={el}></loomi-table>
```

```astro
---
import "@loomi/table";
---

<loomi-table id="customers-table" searchable sortable paginated page-size="10"></loomi-table>
```

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->
