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

## Different Spin Types

Use `type` to pick the indicator style. The type names match Untitled UI's
loading indicator options.

```html
<loomi-spinner type="simple"></loomi-spinner>
<loomi-spinner type="spinner"></loomi-spinner>
<loomi-spinner type="dot"></loomi-spinner>
```

Add a label when the indicator needs visible loading text.

```html
<loomi-spinner type="simple" size="md" label="Loading..."></loomi-spinner>
<loomi-spinner type="spinner" size="md" label="Loading..."></loomi-spinner>
<loomi-spinner type="dot" size="md" label="Loading..."></loomi-spinner>
```

## Different Colors

The default color is `gray`. Any loomi color works.

```html
<loomi-spinner color="primary"></loomi-spinner>
<loomi-spinner color="error"></loomi-spinner>
<loomi-spinner color="success"></loomi-spinner>
<loomi-spinner color="primary"></loomi-spinner>
<loomi-spinner color="success"></loomi-spinner>
<loomi-spinner color="error"></loomi-spinner>
<loomi-spinner color="warning"></loomi-spinner>
<loomi-spinner color="warning"></loomi-spinner>
```

## Different Sizes

There are five sizes available. The default is `small`. The `sm`, `md`, and
`lg` aliases are also accepted for compatibility with Untitled UI examples.

```html
<loomi-spinner size="sm"></loomi-spinner>
<loomi-spinner size="md"></loomi-spinner>
<loomi-spinner size="lg"></loomi-spinner>
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

## Accessibility

loomi-spinner is built on semantic markup where the browser gives us the right behavior, and it adds ARIA only where the component has custom interaction. Keyboard users should be able to reach the same controls as pointer users, with visible focus treatment unless you explicitly turn it off on controls that support `show-focus-ring="false"`.

When the component displays status, progress, validation, or temporary feedback, pair it with clear labels or nearby text in your app so assistive technology users get the same context a sighted user gets from the visual treatment.

- Supports keyboard focus with visible `:focus-visible` styling on interactive controls.

## Responsive behavior

loomi-spinner is designed to fit the layout you place it in. It uses fluid widths, `min-width: 0`, wrapping, truncation, or stacked layouts where that keeps the component usable in cards, forms, sidebars, and mobile screens.

For dense layouts, give the parent container an intentional width and let the component fill it. For long labels or user-provided content, prefer real text that can wrap or truncate instead of fixed pixel assumptions.


## Dark mode

loomi-spinner uses Loomi semantic tokens such as `--loomi-surface`, `--loomi-surface-border`, `--loomi-text`, and palette accent tokens instead of hard-coded light colors. Borders, panels, hover states, and muted text are expected to shift with the active theme.

Add `.dark` to your app root with `@loomidev/theme-switcher`, or provide your own token overrides, and the component will inherit the dark-mode values through its shadow DOM.

- Respects `.dark` on `<html>` via `@loomidev/theme-switcher` or your app theme.

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `type` | `simple` | `simple` \| `spinner` \| `dot` (legacy: `line-simple`, `line-spinner`, `dot-circle`) |
| `size` | `small` | `sm` \| `md` \| `lg` \| `small` \| `medium` \| `big` \| `xl` \| `omg` |
| `color` | `gray` | Any loomi color. |
| `label` | `""` | Optional visible loading label. |

## Full Example

```html
<loomi-spinner type="spinner" size="md" color="primary" label="Loading..."></loomi-spinner>
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

### Choose your framework

<loomi-tabs>
<loomi-tab label="HTML" active>

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/spinner"></script>

<loomi-spinner size="medium" color="primary" aria-label="Loading"></loomi-spinner>
```

</loomi-tab>
<loomi-tab label="Bundlers and SPAs">

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/spinner";
```

</loomi-tab>
<loomi-tab label="Blade">

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

</loomi-tab>
<loomi-tab label="React">

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

</loomi-tab>
<loomi-tab label="Vue">

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

</loomi-tab>
<loomi-tab label="Angular">

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

</loomi-tab>
<loomi-tab label="Svelte / Astro">

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

</loomi-tab>
</loomi-tabs>

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->

## Dependencies

- `@loomidev/core`
