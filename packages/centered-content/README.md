# @loomidev/centered-content

`<loomi-centered-content>` — vertically and horizontally centers its content. Great for
sign-in screens, empty pages and hero sections.

```bash
npm install @loomidev/centered-content lit
```

```js
import "@loomidev/centered-content";
```


## Basic Usage

```html
<loomi-centered-content>
  <h1>Welcome back</h1>
  <p>Sign in to continue.</p>
</loomi-centered-content>
```

## Custom Dimensions

`min-height` controls how tall the centering area is; `max-width` caps the width of the
content inside it. Both accept any CSS length.

```html
<loomi-centered-content min-height="100vh" max-width="20rem">
  <h1>Welcome back</h1>
</loomi-centered-content>
```

## Practical Example: Sign-In Screen

```html
<loomi-centered-content min-height="100vh" max-width="24rem">
  <loomi-card>
    <h1 style="margin:0 0 1rem">Sign in</h1>
    <loomi-input type="email" label="Email"></loomi-input>
    <loomi-input type="password" label="Password"></loomi-input>
    <loomi-button block>Sign in</loomi-button>
  </loomi-card>
</loomi-centered-content>
```

## Practical Example: Empty Page

Pair it with [`<loomi-empty-state>`](../empty-state) for a centered "nothing here yet"
screen.

```html
<loomi-centered-content min-height="70vh" max-width="28rem">
  <loomi-empty-state
    heading="No projects yet"
    message="Create your first project to get started."
    button-label="New project"
  ></loomi-empty-state>
</loomi-centered-content>
```

## Accessibility
- Prefer native HTML elements; add labels in your app shell where needed.
- Supports keyboard focus with visible `:focus-visible` styling on interactive controls.

## Responsive behavior
- Fluid width (`width: 100%`, `min-width: 0`) within flex and grid layouts.

## Dark mode
- Uses semantic `--loomi-surface`, `--loomi-surface-border`, and `--loomi-text` tokens where applicable.
- Respects `.dark` on `<html>` via `@loomidev/theme-switcher` or your app theme.

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `min-height` | `60vh` | Height of the centering area (any CSS length). |
| `max-width` | `28rem` | Max width of the inner content (any CSS length). |

**Slot:** default (centered content).

## Full Example

```html
<loomi-centered-content min-height="100vh" max-width="22rem">
  <loomi-card>
    <h1>404</h1>
    <p>This page doesn't exist.</p>
    <loomi-button url="/">Back home</loomi-button>
  </loomi-card>
</loomi-centered-content>
```

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-centered-content>` is a standard custom element, so the browser can use it in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/centered-content` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomidev/centered-content lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/centered-content build
pnpm --filter @loomidev/centered-content typecheck
```

### Choose your framework

<loomi-tabs>
<loomi-tab label="Plain HTML" active>

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/centered-content"></script>

<loomi-centered-content min-height="240px" max-width="32rem">
  <loomi-empty-state heading="Nothing here yet" message="Create your first record to get started."></loomi-empty-state>
</loomi-centered-content>
```

</loomi-tab>
<loomi-tab label="Bundlers and SPAs">

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/centered-content";
```

</loomi-tab>
<loomi-tab label="Laravel Blade">

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomidev/centered-content lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/centered-content";
```

```blade
<loomi-centered-content min-height="240px" max-width="32rem">
  <loomi-empty-state heading="Nothing here yet" message="Create your first record to get started."></loomi-empty-state>
</loomi-centered-content>
```

</loomi-tab>
<loomi-tab label="React">

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import "@loomidev/centered-content";

export function LoomiExample() {
  return (
    <loomi-centered-content min-height="240px" max-width="32rem">
      <loomi-empty-state heading="Nothing here yet" message="Create your first record to get started."></loomi-empty-state>
    </loomi-centered-content>
  );
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

</loomi-tab>
<loomi-tab label="Vue">

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import "@loomidev/centered-content";
</script>

<template>
  <loomi-centered-content min-height="240px" max-width="32rem">
    <loomi-empty-state heading="Nothing here yet" message="Create your first record to get started."></loomi-empty-state>
  </loomi-centered-content>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

</loomi-tab>
<loomi-tab label="Angular">

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomidev/centered-content";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-centered-content min-height="240px" max-width="32rem">
      <loomi-empty-state heading="Nothing here yet" message="Create your first record to get started."></loomi-empty-state>
    </loomi-centered-content>
  `,
})
export class AppComponent {}
```

</loomi-tab>
<loomi-tab label="Svelte and Astro">

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import "@loomidev/centered-content";
</script>

<loomi-centered-content min-height="240px" max-width="32rem">
  <loomi-empty-state heading="Nothing here yet" message="Create your first record to get started."></loomi-empty-state>
</loomi-centered-content>
```

```astro
---
import "@loomidev/centered-content";
---

<loomi-centered-content min-height="240px" max-width="32rem">
  <loomi-empty-state heading="Nothing here yet" message="Create your first record to get started."></loomi-empty-state>
</loomi-centered-content>
```

</loomi-tab>
</loomi-tabs>

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->
