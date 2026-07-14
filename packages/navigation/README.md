# @loomidev/navigation

All LoomiUI **navigation** components in one install.

```bash
npm install @loomidev/navigation lit
```

```js
import "@loomidev/navigation"; // registers all navigation elements
```

| Package                                         |
| ----------------------------------------------- |
| [`@loomidev/bottom-nav`](../bottom-nav)         |
| [`@loomidev/tab`](../tab)                       |
| [`@loomidev/pagination`](../pagination)         |
| [`@loomidev/dropmenu`](../dropmenu)             |
| [`@loomidev/context-menu`](../context-menu)     |
| [`@loomidev/theme-switcher`](../theme-switcher) |

See the [root README](../../README.md) for the install/theming model.

<!-- BEGIN loomi-framework-guide -->

## Accessibility

loomi-* is built on semantic markup where the browser gives us the right behavior, and it adds ARIA only where the component has custom interaction. Keyboard users should be able to reach the same controls as pointer users, with visible focus treatment unless you explicitly turn it off on controls that support `show-focus-ring="false"`.

When the component displays status, progress, validation, or temporary feedback, pair it with clear labels or nearby text in your app so assistive technology users get the same context a sighted user gets from the visual treatment.

- Supports keyboard focus with visible `:focus-visible` styling on interactive controls.

## Responsive behavior

loomi-* is designed to fit the layout you place it in. It uses fluid widths, `min-width: 0`, wrapping, truncation, or stacked layouts where that keeps the component usable in cards, forms, sidebars, and mobile screens.

For dense layouts, give the parent container an intentional width and let the component fill it. For long labels or user-provided content, prefer real text that can wrap or truncate instead of fixed pixel assumptions.

## Dark mode

loomi-* uses Loomi semantic tokens such as `--loomi-surface`, `--loomi-surface-border`, `--loomi-text`, and palette accent tokens instead of hard-coded light colors. Borders, panels, hover states, and muted text are expected to shift with the active theme.

Add `.dark` to your app root with `@loomidev/theme-switcher`, or provide your own token overrides, and the component will inherit the dark-mode values through its shadow DOM.

- Respects `.dark` on `<html>` via `@loomidev/theme-switcher` or your app theme.

## Framework integration

`@loomidev/navigation` registers all LoomiUI navigation components. Use it when you want one import for a whole category instead of installing each component separately.

### Where to run commands

Run install commands from the app where you want to use this bundle. That means the folder that contains that app's `package.json`. If you are editing LoomiUI itself, run `pnpm --filter ...` commands from the top-level `components` folder.

```bash
cd /path/to/your-app
npm install @loomidev/navigation lit
```

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/navigation build
pnpm --filter @loomidev/navigation typecheck
```

### Choose your framework

<loomi-tabs>
<loomi-tab label="HTML" active>

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/navigation"></script>

<loomi-tabs>
  <loomi-tab label="Overview" active>Overview content</loomi-tab>
  <loomi-tab label="Billing">Billing content</loomi-tab>
</loomi-tabs>
```

</loomi-tab>
<loomi-tab label="Blade">

```bash
cd /path/to/your-laravel-app
npm install @loomidev/navigation lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/navigation";
```

```blade
<loomi-tabs>
  <loomi-tab label="Overview" active>Overview content</loomi-tab>
  <loomi-tab label="Billing">Billing content</loomi-tab>
</loomi-tabs>
```

</loomi-tab>
<loomi-tab label="React">

```jsx
import "@loomidev/navigation";

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

</loomi-tab>
<loomi-tab label="Vue">

```vue
<script setup>
import "@loomidev/navigation";
</script>

<template>
  <loomi-tabs>
    <loomi-tab label="Overview" active>Overview content</loomi-tab>
    <loomi-tab label="Billing">Billing content</loomi-tab>
  </loomi-tabs>
</template>
```

Configure Vue's `compilerOptions.isCustomElement` for tags that start with `loomi-` if your tooling warns about unknown components.

</loomi-tab>
<loomi-tab label="Angular">

```ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomidev/navigation";

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

</loomi-tab>
<loomi-tab label="Svelte / Astro">

```svelte
<script>
  import "@loomidev/navigation";
</script>

<loomi-tabs>
  <loomi-tab label="Overview" active>Overview content</loomi-tab>
  <loomi-tab label="Billing">Billing content</loomi-tab>
</loomi-tabs>
```

```astro
---
import "@loomidev/navigation";
---

<loomi-tabs>
  <loomi-tab label="Overview" active>Overview content</loomi-tab>
  <loomi-tab label="Billing">Billing content</loomi-tab>
</loomi-tabs>
```

</loomi-tab>
</loomi-tabs>

### Server-side rendering notes

In Next.js, Nuxt, SvelteKit, and other SSR frameworks, put the bundle import in client-side code if the server build complains about browser-only APIs. The rendered HTML can still contain the `<loomi-*>` tags; the browser upgrades them after the JavaScript loads.

<!-- END loomi-framework-guide -->

## Dependencies

- `@loomidev/bottom-nav`
- `@loomidev/command-palette`
- `@loomidev/context-menu`
- `@loomidev/dropmenu`
- `@loomidev/pagination`
- `@loomidev/tab`
- `@loomidev/theme-switcher`
