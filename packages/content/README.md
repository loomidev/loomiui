# @loomi/content

All LoomiUI **content / data-display** components in one install.

```bash
npm install @loomi/content lit
```

```js
import "@loomi/content"; // registers all content elements
```

| Package |
| --- |
| [`@loomi/card`](../card) |
| [`@loomi/avatar`](../avatar) |
| [`@loomi/accordion`](../accordion) |
| [`@loomi/tag`](../tag) |
| [`@loomi/tooltip`](../tooltip) |
| [`@loomi/popover`](../popover) |
| [`@loomi/empty-state`](../empty-state) |
| [`@loomi/statistic`](../statistic) |
| [`@loomi/rating`](../rating) |
| [`@loomi/timeline`](../timeline) |
| [`@loomi/progress`](../progress) |
| [`@loomi/listview`](../listview) |
| [`@loomi/contact-card`](../contact-card) |
| [`@loomi/centered-content`](../centered-content) |
| [`@loomi/sortable`](../sortable) |
| [`@loomi/processing`](../processing) |
| [`@loomi/horizontal-line-graph`](../horizontal-line-graph) |
| [`@loomi/chart`](../chart) |

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`@loomi/content` registers all LoomiUI content/display components. Use it when you want one import for a whole category instead of installing each component separately.

### Where to run commands

Run install commands from the app where you want to use this bundle. That means the folder that contains that app's `package.json`. If you are editing LoomiUI itself, run `pnpm --filter ...` commands from the top-level `components` folder.

```bash
cd /path/to/your-app
npm install @loomi/content lit
```

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomi/content build
pnpm --filter @loomi/content typecheck
```

### Plain HTML

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomi/content"></script>

<loomi-card title="Team member">
  <loomi-avatar label="AM" bg-color="green"></loomi-avatar>
  <loomi-tag color="green">Active</loomi-tag>
</loomi-card>
```

### Laravel Blade

```bash
cd /path/to/your-laravel-app
npm install @loomi/content lit
npm run dev
```

```js
// resources/js/app.js
import "@loomi/content";
```

```blade
<loomi-card title="Team member">
  <loomi-avatar label="AM" bg-color="green"></loomi-avatar>
  <loomi-tag color="green">Active</loomi-tag>
</loomi-card>
```

### React

```jsx
import "@loomi/content";

export function LoomiBundleExample() {
  return (
    <loomi-card title="Team member">
      <loomi-avatar label="AM" bg-color="green"></loomi-avatar>
      <loomi-tag color="green">Active</loomi-tag>
    </loomi-card>
  );
}
```

For array or object properties such as select `data` or table `columns`, assign the value with a ref after mount when using React 18.

### Vue

```vue
<script setup>
import "@loomi/content";
</script>

<template>
  <loomi-card title="Team member">
    <loomi-avatar label="AM" bg-color="green"></loomi-avatar>
    <loomi-tag color="green">Active</loomi-tag>
  </loomi-card>
</template>
```

Configure Vue's `compilerOptions.isCustomElement` for tags that start with `loomi-` if your tooling warns about unknown components.

### Angular

```ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomi/content";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-card title="Team member">
      <loomi-avatar label="AM" bg-color="green"></loomi-avatar>
      <loomi-tag color="green">Active</loomi-tag>
    </loomi-card>
  `,
})
export class AppComponent {}
```

### Svelte and Astro

```svelte
<script>
  import "@loomi/content";
</script>

<loomi-card title="Team member">
  <loomi-avatar label="AM" bg-color="green"></loomi-avatar>
  <loomi-tag color="green">Active</loomi-tag>
</loomi-card>
```

```astro
---
import "@loomi/content";
---

<loomi-card title="Team member">
  <loomi-avatar label="AM" bg-color="green"></loomi-avatar>
  <loomi-tag color="green">Active</loomi-tag>
</loomi-card>
```

### Server-side rendering notes

In Next.js, Nuxt, SvelteKit, and other SSR frameworks, put the bundle import in client-side code if the server build complains about browser-only APIs. The rendered HTML can still contain the `<loomi-*>` tags; the browser upgrades them after the JavaScript loads.

<!-- END loomi-framework-guide -->
