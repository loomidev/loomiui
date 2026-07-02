# @loomidev/content

All LoomiUI **content / data-display** components in one install.

```bash
npm install @loomidev/content lit
```

```js
import "@loomidev/content"; // registers all content elements
```

| Package |
| --- |
| [`@loomidev/card`](../card) |
| [`@loomidev/divider`](../divider) |
| [`@loomidev/qrcode`](../qrcode) |
| [`@loomidev/avatar`](../avatar) |
| [`@loomidev/accordion`](../accordion) |
| [`@loomidev/tag`](../tag) |
| [`@loomidev/tooltip`](../tooltip) |
| [`@loomidev/popover`](../popover) |
| [`@loomidev/empty-state`](../empty-state) |
| [`@loomidev/statistic`](../statistic) |
| [`@loomidev/rating`](../rating) |
| [`@loomidev/timeline`](../timeline) |
| [`@loomidev/progress`](../progress) |
| [`@loomidev/listview`](../listview) |
| [`@loomidev/contact-card`](../contact-card) |
| [`@loomidev/centered-content`](../centered-content) |
| [`@loomidev/sortable`](../sortable) |
| [`@loomidev/processing`](../processing) |
| [`@loomidev/horizontal-line-graph`](../horizontal-line-graph) |
| [`@loomidev/chart`](../chart) |

<!-- BEGIN loomi-framework-guide -->


## Accessibility
- Prefer native HTML elements; add labels in your app shell where needed.
- Supports keyboard focus with visible `:focus-visible` styling on interactive controls.

## Responsive behavior
- Fluid width (`width: 100%`, `min-width: 0`) within flex and grid layouts.

## Dark mode
- Uses semantic `--loomi-surface`, `--loomi-surface-border`, and `--loomi-text` tokens where applicable.
- Respects `.dark` on `<html>` via `@loomidev/theme-switcher` or your app theme.
## Framework integration

`@loomidev/content` registers all LoomiUI content/display components. Use it when you want one import for a whole category instead of installing each component separately.

### Where to run commands

Run install commands from the app where you want to use this bundle. That means the folder that contains that app's `package.json`. If you are editing LoomiUI itself, run `pnpm --filter ...` commands from the top-level `components` folder.

```bash
cd /path/to/your-app
npm install @loomidev/content lit
```

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/content build
pnpm --filter @loomidev/content typecheck
```

### Choose your framework

<loomi-tabs>
<loomi-tab label="Plain HTML" active>

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/content"></script>

<loomi-card title="Team member">
  <loomi-avatar label="AM" bg-color="success"></loomi-avatar>
  <loomi-tag color="success">Active</loomi-tag>
</loomi-card>
```

</loomi-tab>
<loomi-tab label="Laravel Blade">

```bash
cd /path/to/your-laravel-app
npm install @loomidev/content lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/content";
```

```blade
<loomi-card title="Team member">
  <loomi-avatar label="AM" bg-color="success"></loomi-avatar>
  <loomi-tag color="success">Active</loomi-tag>
</loomi-card>
```

</loomi-tab>
<loomi-tab label="React">

```jsx
import "@loomidev/content";

export function LoomiBundleExample() {
  return (
    <loomi-card title="Team member">
      <loomi-avatar label="AM" bg-color="success"></loomi-avatar>
      <loomi-tag color="success">Active</loomi-tag>
    </loomi-card>
  );
}
```

For array or object properties such as select `data` or table `columns`, assign the value with a ref after mount when using React 18.

</loomi-tab>
<loomi-tab label="Vue">

```vue
<script setup>
import "@loomidev/content";
</script>

<template>
  <loomi-card title="Team member">
    <loomi-avatar label="AM" bg-color="success"></loomi-avatar>
    <loomi-tag color="success">Active</loomi-tag>
  </loomi-card>
</template>
```

Configure Vue's `compilerOptions.isCustomElement` for tags that start with `loomi-` if your tooling warns about unknown components.

</loomi-tab>
<loomi-tab label="Angular">

```ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomidev/content";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-card title="Team member">
      <loomi-avatar label="AM" bg-color="success"></loomi-avatar>
      <loomi-tag color="success">Active</loomi-tag>
    </loomi-card>
  `,
})
export class AppComponent {}
```

</loomi-tab>
<loomi-tab label="Svelte and Astro">

```svelte
<script>
  import "@loomidev/content";
</script>

<loomi-card title="Team member">
  <loomi-avatar label="AM" bg-color="success"></loomi-avatar>
  <loomi-tag color="success">Active</loomi-tag>
</loomi-card>
```

```astro
---
import "@loomidev/content";
---

<loomi-card title="Team member">
  <loomi-avatar label="AM" bg-color="success"></loomi-avatar>
  <loomi-tag color="success">Active</loomi-tag>
</loomi-card>
```

</loomi-tab>
</loomi-tabs>

### Server-side rendering notes

In Next.js, Nuxt, SvelteKit, and other SSR frameworks, put the bundle import in client-side code if the server build complains about browser-only APIs. The rendered HTML can still contain the `<loomi-*>` tags; the browser upgrades them after the JavaScript loads.

<!-- END loomi-framework-guide -->
