# @loomidev/theme-switcher

`<loomi-theme-switcher>` — a light/dark/system theme toggle, so you don't have to build
your own theme-switching mechanism. Persists the choice to `localStorage` and toggles
the `dark` class on `<html>`. There should only be one on a page at a time — this very
docs site uses it in the top-right of the nav bar.

```bash
npm install @loomidev/theme-switcher lit
```

```js
import "@loomidev/theme-switcher";
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
<loomi-theme-switcher></loomi-theme-switcher>
```

## Variants

The default `horizontal` variant renders the compact segmented control. Use
`variant="dropmenu"` to render the same choices inside `<loomi-dropmenu>`.

```html
<loomi-theme-switcher></loomi-theme-switcher>
<loomi-theme-switcher variant="dropmenu"></loomi-theme-switcher>
```

Style your dark theme against the `dark` class loomi adds to `<html>`:

```html
<style>
  :root.dark body {
    background: #0b1220;
    color: #e2e8f0;
  }
</style>
```

## Avoiding a Flash of the Wrong Theme

Since the saved theme is only applied once the component upgrades, call
`applyLoomiTheme(getLoomiTheme())` as early as possible in your page — ideally in a
blocking `<script>` in `<head>`, before first paint.

```html
<head>
  <script type="module">
    import { applyLoomiTheme, getLoomiTheme } from "@loomidev/theme-switcher";
    applyLoomiTheme(getLoomiTheme());
  </script>
</head>
```

## Icon Position

Icons sit before the label by default; flip them with `icon-right`.

```html
<loomi-theme-switcher icon-right></loomi-theme-switcher>
```

## Custom Labels

Useful for translating the switcher into another language, or for different wording
(e.g. "Auto" instead of "System").

```html
<loomi-theme-switcher light-text="Light Mode" dark-text="Dark Mode" system-text="Auto"></loomi-theme-switcher>
```

## Custom Icons

```html
<loomi-theme-switcher light-icon="sun" dark-icon="moon" system-icon="computer-desktop"></loomi-theme-switcher>
```

## Reacting to a Theme Change

```js
document.querySelector("loomi-theme-switcher").addEventListener("theme-change", (e) => {
  console.log(e.detail.theme); // "light" | "dark" | "system"
});
```

## Reading or Setting the Theme Programmatically

```js
import { applyLoomiTheme, getLoomiTheme } from "@loomidev/theme-switcher";

getLoomiTheme(); // "light" | "dark" | "system"
applyLoomiTheme("dark"); // switch programmatically, e.g. from a settings page
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `light-text` / `dark-text` / `system-text` | `Light` / `Dark` / `System` | Option labels (translatable). |
| `light-icon` / `dark-icon` / `system-icon` | `sun` / `moon` / `computer-desktop` | Option icon names. |
| `icon-right` | `false` | Place icons after the text. _(boolean)_ |
| `variant` | `horizontal` | Render style: `horizontal` or `dropmenu`. |

**Helpers:** `applyLoomiTheme(mode)`, `getLoomiTheme()`. **Event:** `theme-change`
(`detail: { theme }`).

## Full Example

```html
<loomi-theme-switcher
  icon-right
  light-text="Light Mode"
  dark-text="Dark Mode"
  system-text="Auto"
></loomi-theme-switcher>
```

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-theme-switcher>` is a standard custom element, so the browser can use it in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/theme-switcher` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomidev/theme-switcher lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/theme-switcher build
pnpm --filter @loomidev/theme-switcher typecheck
```

### Plain HTML

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/theme-switcher"></script>

<loomi-theme-switcher variant="dropmenu"></loomi-theme-switcher>
```

### Bundlers and single-page apps

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/theme-switcher";
```


### Laravel Blade

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomidev/theme-switcher lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/theme-switcher";
```

```blade
<loomi-theme-switcher variant="dropmenu"></loomi-theme-switcher>
```

### React

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import "@loomidev/theme-switcher";

export function LoomiExample() {
  return (
    <loomi-theme-switcher variant="dropmenu"></loomi-theme-switcher>
  );
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

### Vue

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import "@loomidev/theme-switcher";
</script>

<template>
  <loomi-theme-switcher variant="dropmenu"></loomi-theme-switcher>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

### Angular

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomidev/theme-switcher";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-theme-switcher variant="dropmenu"></loomi-theme-switcher>
  `,
})
export class AppComponent {}
```

### Svelte and Astro

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import "@loomidev/theme-switcher";
</script>

<loomi-theme-switcher variant="dropmenu"></loomi-theme-switcher>
```

```astro
---
import "@loomidev/theme-switcher";
---

<loomi-theme-switcher variant="dropmenu"></loomi-theme-switcher>
```

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->
