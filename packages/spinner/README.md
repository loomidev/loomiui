# @loomidev/spinner

`<loomi-spinner>` — a themeable loading spinner in the full loomi palette.

```bash
npm install @loomidev/spinner lit
```

```js
import "@loomidev/spinner";
```

## Basic Usage

```html
<loomi-spinner></loomi-spinner>
```

## Different Colors

The default color is `gray`. Any loomi color works.

```html
<loomi-spinner color="primary"></loomi-spinner>
<loomi-spinner color="red"></loomi-spinner>
<loomi-spinner color="green"></loomi-spinner>
<loomi-spinner color="blue"></loomi-spinner>
<loomi-spinner color="purple"></loomi-spinner>
<loomi-spinner color="pink"></loomi-spinner>
<loomi-spinner color="orange"></loomi-spinner>
<loomi-spinner color="cyan"></loomi-spinner>
```

## Different Sizes

There are five sizes available. The default is `small`.

```html
<loomi-spinner size="small"></loomi-spinner>
<loomi-spinner size="medium"></loomi-spinner>
<loomi-spinner size="big"></loomi-spinner>
<loomi-spinner size="xl"></loomi-spinner>
<loomi-spinner size="omg"></loomi-spinner>
```

## Inside a Button

Most of the time you won't reach for `<loomi-spinner>` directly inside a button —
[`<loomi-button>`](../button) has built-in `has-spinner`/`show-spinner` attributes that
manage one for you. Use a standalone spinner for everything else: a loading section, a
table mid-fetch, a full-page overlay.

```html
<div style="text-align:center; padding: 2rem">
  <loomi-spinner size="big" color="primary"></loomi-spinner>
</div>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `size` | `small` | `small` \| `medium` \| `big` \| `xl` \| `omg` |
| `color` | `gray` | Any loomi color. |

## Full Example

```html
<loomi-spinner size="medium" color="blue"></loomi-spinner>
```

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-spinner>` is a standard custom element, so the browser can use it in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/spinner` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomidev/spinner lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/spinner build
pnpm --filter @loomidev/spinner typecheck
```

### Plain HTML

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/spinner"></script>

<loomi-spinner size="medium" color="primary" aria-label="Loading"></loomi-spinner>
```

### Bundlers and single-page apps

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/spinner";
```


### Laravel Blade

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomidev/spinner lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/spinner";
```

```blade
<loomi-spinner size="medium" color="primary" aria-label="Loading"></loomi-spinner>
```

### React

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import "@loomidev/spinner";

export function LoomiExample() {
  return (
    <loomi-spinner size="medium" color="primary" aria-label="Loading"></loomi-spinner>
  );
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

### Vue

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import "@loomidev/spinner";
</script>

<template>
  <loomi-spinner size="medium" color="primary" aria-label="Loading"></loomi-spinner>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

### Angular

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomidev/spinner";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-spinner size="medium" color="primary" aria-label="Loading"></loomi-spinner>
  `,
})
export class AppComponent {}
```

### Svelte and Astro

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import "@loomidev/spinner";
</script>

<loomi-spinner size="medium" color="primary" aria-label="Loading"></loomi-spinner>
```

```astro
---
import "@loomidev/spinner";
---

<loomi-spinner size="medium" color="primary" aria-label="Loading"></loomi-spinner>
```

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->
