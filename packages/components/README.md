# @loomidev/components

The whole [LoomiUI](../../README.md) component library in one install. This umbrella package
re-exports every individual `@loomidev/*` component, so you can get everything with a single
dependency.

```bash
npm install @loomidev/components lit
```

```js
// register every LoomiUI custom element
import "@loomidev/components";

// …or just one component's entry
import "@loomidev/components/button";
```

It also re-exports the theming utilities from `@loomidev/theme`:

```js
import { LOOMI_COLORS, isLoomiColor, type LoomiColor } from "@loomidev/components";
```

## Want a smaller footprint?

Install only the components you use — each is a standalone package:

```bash
npm install @loomidev/button lit
```

See the [root README](../../README.md) for the full "install everything vs. install just
what you need" comparison and the theming model.

```js
// per-component entries are available too
import "@loomidev/components/input";
import "@loomidev/components/select";
```

## Included components

| Element | Package |
| --- | --- |
| `<loomi-button>` | [`@loomidev/button`](../button) |
| `<loomi-input>` | [`@loomidev/input`](../input) |
| `<loomi-password>` | [`@loomidev/password`](../password) |
| `<loomi-textarea>` | [`@loomidev/textarea`](../textarea) |
| `<loomi-text-editor>` | [`@loomidev/text-editor`](../text-editor) |
| `<loomi-checkbox>` | [`@loomidev/checkbox`](../checkbox) |
| `<loomi-radio>` | [`@loomidev/radio`](../radio) |
| `<loomi-toggle>` | [`@loomidev/toggle`](../toggle) |
| `<loomi-number>` | [`@loomidev/number`](../number) |
| `<loomi-select>` | [`@loomidev/select`](../select) |
| `<loomi-divider>` | [`@loomidev/divider`](../divider) |
| `<loomi-qrcode>` | [`@loomidev/qrcode`](../qrcode) |
| `<loomi-copy-to-clipboard>` | [`@loomidev/copy-to-clipboard`](../copy-to-clipboard) |
| `<loomi-context-menu>` | [`@loomidev/context-menu`](../context-menu) |
| `<loomi-timer>` | [`@loomidev/timer`](../timer) |

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`@loomidev/components` registers the full LoomiUI component set. Use it when you want one import for a whole category instead of installing each component separately.

### Where to run commands

Run install commands from the app where you want to use this bundle. That means the folder that contains that app's `package.json`. If you are editing LoomiUI itself, run `pnpm --filter ...` commands from the top-level `components` folder.

```bash
cd /path/to/your-app
npm install @loomidev/components lit
```

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/components build
pnpm --filter @loomidev/components typecheck
```

### Plain HTML

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/components"></script>

<loomi-button icon="check">Save</loomi-button>
<loomi-input name="email" label="Email"></loomi-input>
<loomi-card title="Account">Ready to go.</loomi-card>
```

### Laravel Blade

```bash
cd /path/to/your-laravel-app
npm install @loomidev/components lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/components";
```

```blade
<loomi-button icon="check">Save</loomi-button>
<loomi-input name="email" label="Email"></loomi-input>
<loomi-card title="Account">Ready to go.</loomi-card>
```

### React

```jsx
import "@loomidev/components";

export function LoomiBundleExample() {
  return (
    <>
      <loomi-button icon="check">Save</loomi-button>
      <loomi-input name="email" label="Email"></loomi-input>
      <loomi-card title="Account">Ready to go.</loomi-card>
    </>
  );
}
```

For array or object properties such as select `data` or table `columns`, assign the value with a ref after mount when using React 18.

### Vue

```vue
<script setup>
import "@loomidev/components";
</script>

<template>
  <loomi-button icon="check">Save</loomi-button>
  <loomi-input name="email" label="Email"></loomi-input>
  <loomi-card title="Account">Ready to go.</loomi-card>
</template>
```

Configure Vue's `compilerOptions.isCustomElement` for tags that start with `loomi-` if your tooling warns about unknown components.

### Angular

```ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomidev/components";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-button icon="check">Save</loomi-button>
    <loomi-input name="email" label="Email"></loomi-input>
    <loomi-card title="Account">Ready to go.</loomi-card>
  `,
})
export class AppComponent {}
```

### Svelte and Astro

```svelte
<script>
  import "@loomidev/components";
</script>

<loomi-button icon="check">Save</loomi-button>
<loomi-input name="email" label="Email"></loomi-input>
<loomi-card title="Account">Ready to go.</loomi-card>
```

```astro
---
import "@loomidev/components";
---

<loomi-button icon="check">Save</loomi-button>
<loomi-input name="email" label="Email"></loomi-input>
<loomi-card title="Account">Ready to go.</loomi-card>
```

### Server-side rendering notes

In Next.js, Nuxt, SvelteKit, and other SSR frameworks, put the bundle import in client-side code if the server build complains about browser-only APIs. The rendered HTML can still contain the `<loomi-*>` tags; the browser upgrades them after the JavaScript loads.

<!-- END loomi-framework-guide -->
