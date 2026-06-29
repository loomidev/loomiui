# @loomidev/pagination

`<loomi-pagination>` — page controls driven by `total`, `page-size` and `page`. The
component this very docs site uses to render its own [`<loomi-table>`](../table)
pagination — and the [bottom prev/next nav](../card) you see at the foot of every page
on this site is built from [`<loomi-card>`](../card), not this component, in case you're
looking for that pattern instead.

```bash
npm install @loomidev/pagination lit
```

```js
import "@loomidev/pagination";
```

## Basic Usage

```html
<loomi-pagination total="240" page-size="25"></loomi-pagination>
```

## Pagination Styles

Three visual styles are available — arrows (default), numbered pages, or a page-jump
dropdown.

```html
<loomi-pagination total="240" page-size="25" pagination-style="arrows"></loomi-pagination>
<loomi-pagination total="240" page-size="25" pagination-style="numbers"></loomi-pagination>
<loomi-pagination total="240" page-size="25" pagination-style="dropdown"></loomi-pagination>
```

## Starting on a Specific Page

```html
<loomi-pagination total="240" page-size="25" page="3"></loomi-pagination>
```

## The Total Label

By default a "Showing X to Y of Z" label appears alongside the controls. Customize the
wording with `total-label` (`:a`/`:b`/`:c` are replaced with the start, end, and total),
or hide it entirely.

```html
<loomi-pagination total="240" page-size="25" total-label="Showing :a–:b of :c results"></loomi-pagination>
<loomi-pagination total="240" page-size="25" show-total="false"></loomi-pagination>
```

## Color

`color` sets the active-page color in the `numbers` style.

```html
<loomi-pagination total="240" page-size="25" pagination-style="numbers" color="purple"></loomi-pagination>
```

## Reacting to Page Changes

```html
<loomi-pagination id="p" total="240" page-size="25"></loomi-pagination>

<script type="module">
  document.getElementById("p").addEventListener("page-change", (e) => {
    console.log(e.detail.page); // the new current page
    loadPage(e.detail.page);
  });
</script>
```

Read the total number of pages at any time via the `pageCount` property.

```js
document.getElementById("p").pageCount; // 10, for total=240 page-size=25
```

## Driving a Table

[`<loomi-table>`](../table) renders `<loomi-pagination>` internally when `paginated` is
set — see its README for the full composition. Use `<loomi-pagination>` directly when
you're paginating something other than a `<loomi-table>` (a custom list, a gallery, API
results you render yourself).

```html
<div id="results"></div>
<loomi-pagination id="results-pager" total="0" page-size="20"></loomi-pagination>

<script type="module">
  const pager = document.getElementById("results-pager");
  async function loadPage(page) {
    const { items, total } = await fetchResults(page, 20);
    pager.total = total;
    renderResults(items);
  }
  pager.addEventListener("page-change", (e) => loadPage(e.detail.page));
  loadPage(1);
</script>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `total` | `0` | Total number of items. |
| `page-size` | `10` | Items per page. |
| `page` | `1` | Current page (1-based). |
| `pagination-style` | `arrows` | `arrows` \| `numbers` \| `dropdown` |
| `show-total` | `true` | Show the "Showing :a to :b of :c" label. _(boolean)_ |
| `total-label` | `Showing :a to :b of :c` | Label format (`:a` start, `:b` end, `:c` total). |
| `color` | `primary` | Active-page color. |

**Event:** `page-change` (`detail: { page }`). **Property:** `pageCount` (read-only).

## Full Example

```html
<loomi-pagination
  total="240"
  page-size="25"
  page="1"
  pagination-style="numbers"
  color="purple"
  total-label="Showing :a–:b of :c results"
></loomi-pagination>
```

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-pagination>` is a standard custom element, so the browser can use it in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/pagination` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomidev/pagination lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/pagination build
pnpm --filter @loomidev/pagination typecheck
```

### Plain HTML

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/pagination"></script>

<loomi-pagination total="120" page-size="10" page="1" pagination-style="numbers"></loomi-pagination>
```

### Bundlers and single-page apps

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/pagination";
```


### Laravel Blade

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomidev/pagination lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/pagination";
```

```blade
<loomi-pagination total="120" page-size="10" page="1" pagination-style="numbers"></loomi-pagination>
```

### React

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import "@loomidev/pagination";

export function LoomiExample() {
  return (
    <loomi-pagination total="120" page-size="10" page="1" pagination-style="numbers"></loomi-pagination>
  );
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

### Vue

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import "@loomidev/pagination";
</script>

<template>
  <loomi-pagination total="120" page-size="10" page="1" pagination-style="numbers"></loomi-pagination>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

### Angular

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomidev/pagination";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-pagination total="120" page-size="10" page="1" pagination-style="numbers"></loomi-pagination>
  `,
})
export class AppComponent {}
```

### Svelte and Astro

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import "@loomidev/pagination";
</script>

<loomi-pagination total="120" page-size="10" page="1" pagination-style="numbers"></loomi-pagination>
```

```astro
---
import "@loomidev/pagination";
---

<loomi-pagination total="120" page-size="10" page="1" pagination-style="numbers"></loomi-pagination>
```

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->
