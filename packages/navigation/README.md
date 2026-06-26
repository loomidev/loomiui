# @loomi/navigation

All LoomiUI **navigation** components in one install.

```bash
npm install @loomi/navigation lit
```

```js
import "@loomi/navigation"; // registers all navigation elements
```

| Package |
| --- |
| [`@loomi/tab`](../tab) |
| [`@loomi/pagination`](../pagination) |
| [`@loomi/dropmenu`](../dropmenu) |
| [`@loomi/theme-switcher`](../theme-switcher) |

See the [root README](../../README.md) for the install/theming model.

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`@loomi/navigation` registers all LoomiUI navigation components. Use it when you want one import for a whole category instead of installing each component separately.

### Where to run commands

Run install commands from the app where you want to use this bundle. That means the folder that contains that app's `package.json`. If you are editing LoomiUI itself, run `pnpm --filter ...` commands from the top-level `components` folder.

```bash
cd /path/to/your-app
npm install @loomi/navigation lit
```

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomi/navigation build
pnpm --filter @loomi/navigation typecheck
```

### Plain HTML

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomi/navigation"></script>

<loomi-tabs>
  <loomi-tab label="Overview" active>Overview content</loomi-tab>
  <loomi-tab label="Billing">Billing content</loomi-tab>
</loomi-tabs>
```

### Laravel Blade

```bash
cd /path/to/your-laravel-app
npm install @loomi/navigation lit
npm run dev
```

```js
// resources/js/app.js
import "@loomi/navigation";
```

```blade
<loomi-tabs>
  <loomi-tab label="Overview" active>Overview content</loomi-tab>
  <loomi-tab label="Billing">Billing content</loomi-tab>
</loomi-tabs>
```

### React

```jsx
import "@loomi/navigation";

export function LoomiBundleExample() {
  return (
    <loomi-tabs>
      <loomi-tab label="Overview" active>Overview content</loomi-tab>
      <loomi-tab label="Billing">Billing content</loomi-tab>
    </loomi-tabs>
  );
}
```

For array or object properties such as select `data` or table `columns`, assign the value with a ref after mount when using React 18.

### Vue

```vue
<script setup>
import "@loomi/navigation";
</script>

<template>
  <loomi-tabs>
    <loomi-tab label="Overview" active>Overview content</loomi-tab>
    <loomi-tab label="Billing">Billing content</loomi-tab>
  </loomi-tabs>
</template>
```

Configure Vue's `compilerOptions.isCustomElement` for tags that start with `loomi-` if your tooling warns about unknown components.

### Angular

```ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomi/navigation";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-tabs>
      <loomi-tab label="Overview" active>Overview content</loomi-tab>
      <loomi-tab label="Billing">Billing content</loomi-tab>
    </loomi-tabs>
  `,
})
export class AppComponent {}
```

### Svelte and Astro

```svelte
<script>
  import "@loomi/navigation";
</script>

<loomi-tabs>
  <loomi-tab label="Overview" active>Overview content</loomi-tab>
  <loomi-tab label="Billing">Billing content</loomi-tab>
</loomi-tabs>
```

```astro
---
import "@loomi/navigation";
---

<loomi-tabs>
  <loomi-tab label="Overview" active>Overview content</loomi-tab>
  <loomi-tab label="Billing">Billing content</loomi-tab>
</loomi-tabs>
```

### Server-side rendering notes

In Next.js, Nuxt, SvelteKit, and other SSR frameworks, put the bundle import in client-side code if the server build complains about browser-only APIs. The rendered HTML can still contain the `<loomi-*>` tags; the browser upgrades them after the JavaScript loads.

<!-- END loomi-framework-guide -->
