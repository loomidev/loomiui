# @loomidev/table

`<loomi-table>` — a BladewindUI-inspired table with manual rows, dynamic data,
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

## Selectable Rows

Set `selectable` to let row clicks toggle selected state. This uses the same
selection store as checkboxes, so `selectedIds`, `selectedValue`, and
`selection-change` all stay in sync.

```html
<loomi-table id="selectable-staff" selectable></loomi-table>
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

Bladewind-style aliases also work: `selected_value`, `id_key`, `include_columns`,
`exclude_columns`, `column_aliases`, `action_icons`, and the other underscore
attributes listed below.

## Grouping Rows

Group dynamic rows by any key in your data with `groupby`.

```html
<loomi-table id="staff-by-team" groupby="department"></loomi-table>
```

## Pagination

```html
<loomi-table id="t8" paginated page-size="25"></loomi-table>

<!-- show page numbers instead of prev/next arrows -->
<loomi-table id="t9" paginated page-size="10" pagination-style="numbers"></loomi-table>

<!-- leading row-number column -->
<loomi-table id="t10" paginated page-size="10" show-row-numbers></loomi-table>
```

Pagination styles: `arrows` (default), `numbers`, `dropdown` — same options as
[`<loomi-pagination>`](../pagination), since that's exactly what renders underneath.
You can also use Bladewind-compatible `default_page`, `limit`, `show_total`,
`show_page_number`, `show_total_pages`, and `total_label`.

## No Data Message

```html
<loomi-table id="t11" no-data-message="The staff directory is empty"></loomi-table>
```

Render the message as an empty-state panel with optional image, heading, and button:

```html
<loomi-table
  message_as_empty_state="true"
  show_image="false"
  heading="No staff"
  no_data_message="The staff directory is empty"
  button_label="Add staff"
></loomi-table>
```

Listen for `empty-action` to handle the empty-state button. The Bladewind `onclick`
attribute is accepted and included in the event detail.

## Manual and Custom Layouts

For a manually authored table, provide header cells in the `header` slot and rows in
the default slot:

```html
<loomi-table selectable>
  <th slot="header">Item</th>
  <th slot="header">Quantity</th>
  <tr><td>Office furniture</td><td>2</td></tr>
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
| `name` | auto | Stable class/name hook, matching Bladewind's targeting pattern. |
| `data` | `[]` | Row objects — property (`.data`) or JSON-string attribute. |
| `columns` | _(auto)_ | Column keys (defaults to the first row's keys). |
| `layout` | `auto` | `auto` \| `custom`; custom uses row/header templates or slotted rows. |
| `row-template` | _(blank)_ | Template string for `layout="custom"`; `{key}` placeholders are filled from row data. |
| `include-columns` / `include_columns` | _(blank)_ | Comma-separated key allow list. |
| `exclude-columns` / `exclude_columns` | _(blank)_ | Comma-separated key deny list (`include` wins if both are set). |
| `column-aliases` / `column_aliases` | `{}` | Map of `key -> display name` (property or JSON). |
| `searchable` | `false` | Show a search box. _(boolean)_ |
| `search-placeholder` / `search_placeholder` | `Search table below...` | Search input placeholder. |
| `sortable` | `false` | Enable column sorting. _(boolean)_ |
| `sortable-columns` / `sortable_columns` | _(all)_ | Comma-separated sortable keys. |
| `paginated` | `false` | Enable pagination. _(boolean)_ |
| `page-size` / `page_size` | `25` | Rows per page. |
| `pagination-style` / `pagination_style` | `arrows` | `arrows` \| `numbers` \| `dropdown` |
| `show-total` / `show_total` | `true` | Show the pagination total label. _(boolean)_ |
| `show-page-number` / `show_page_number` | `true` | Show current page between arrow controls. _(boolean)_ |
| `show-total-pages` / `show_total_pages` | `false` | Show `current / total` for arrow pagination. _(boolean)_ |
| `default-page` / `default_page` | `1` | Initial selected page. |
| `limit` | `0` | Max total rows to display (`0` = no limit). |
| `total-label` / `total_label` | `Showing :a to :b of :c records` | Pagination total label placeholders. |
| `selectable` | `false` | Row clicks toggle selection. _(boolean)_ |
| `checkable` | `false` | Add a checkbox column. _(boolean)_ |
| `id-key` / `id_key` | `id` | Row key used as the selection id. |
| `selected-value` / `selected_value` | _(blank)_ | Comma-separated ids to pre-check. |
| `action-icons` / `action_icons` | `[]` | Array of `{ icon, name?, tip?, color?, click?, icon_type?, button_outline? }`. |
| `actions-title` / `actions_title` | `actions` | Heading for the action-icons column. |
| `show-row-numbers` / `show_row_numbers` | `false` | Show a leading `#` column. _(boolean)_ |
| `groupby` / `group-by` | _(blank)_ | Key used to render group heading rows. |
| `striped` / `divided` / `celled` / `compact` / `transparent` | — | Styling toggles. _(boolean)_ |
| `has-hover` / `has_hover`, `has-shadow` / `has_shadow`, `has-border` / `has_border` | — | Bladewind-compatible styling toggles. _(boolean)_ |
| `divider` | `regular` | `regular` \| `thin` |
| `no-data-message` / `no_data_message` | `No records to display` | Shown when there are no rows. |
| `message-as-empty-state` / `message_as_empty_state` | `false` | Render no-data content as an empty state. _(boolean)_ |
| `image` | `empty-state.svg` | Empty-state image URL. |
| `heading` | _(blank)_ | Empty-state heading. |
| `button-label` / `button_label` | _(blank)_ | Empty-state CTA label. |
| `show-image` / `show_image` | `true` | Show empty-state image. _(boolean)_ |
| `onclick` | _(blank)_ | Bladewind-style empty-state action string, also emitted in `empty-action`. |
| `nonce` | _(blank)_ | Accepted for Bladewind API compatibility. |

**Events:** `row-click` (`{ row }`), `action` (`{ name, row }`),
`action-call`, `selection-change` (`{ ids, rows, selectedValue }`), `empty-action`,
`page-change` (`{ page }`).
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
npm install @loomidev/table lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/table build
pnpm --filter @loomidev/table typecheck
```

### Plain HTML

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/table"></script>

<loomi-table id="customers-table" searchable sortable paginated page-size="10"></loomi-table>
```

### Bundlers and single-page apps

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/table";
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

### React

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

### Vue

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

### Angular

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

### Svelte and Astro

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

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->
