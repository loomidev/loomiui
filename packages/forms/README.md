# @loomidev/forms

All LoomiUI **form** components in one install.

```bash
npm install @loomidev/forms lit
```

```js
import "@loomidev/forms"; // registers all form elements
```

| Package |
| --- |
| [`@loomidev/input`](../input) |
| [`@loomidev/textarea`](../textarea) |
| [`@loomidev/text-editor`](../text-editor) |
| [`@loomidev/select`](../select) |
| [`@loomidev/checkbox`](../checkbox) |
| [`@loomidev/radio`](../radio) |
| [`@loomidev/toggle`](../toggle) |
| [`@loomidev/number`](../number) |
| [`@loomidev/slider`](../slider) |
| [`@loomidev/code`](../code) |
| [`@loomidev/checkcards`](../checkcards) |
| [`@loomidev/datepicker`](../datepicker) |
| [`@loomidev/timepicker`](../timepicker) |
| [`@loomidev/colorpicker`](../colorpicker) |
| [`@loomidev/filepicker`](../filepicker) |

All form controls are **form-associated** — their values submit with a native `<form>` via `ElementInternals`.

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`@loomidev/forms` registers all LoomiUI form controls. Use it when you want one import for a whole category instead of installing each component separately.

### Where to run commands

Run install commands from the app where you want to use this bundle. That means the folder that contains that app's `package.json`. If you are editing LoomiUI itself, run `pnpm --filter ...` commands from the top-level `components` folder.

```bash
cd /path/to/your-app
npm install @loomidev/forms lit
```

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/forms build
pnpm --filter @loomidev/forms typecheck
```

### Plain HTML

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/forms"></script>

<form>
  <loomi-input name="email" type="email" label="Email" required></loomi-input>
  <loomi-select name="role" label="Role" data='[{"label":"Admin","value":"admin"},{"label":"Member","value":"member"}]'></loomi-select>
  <loomi-button can-submit>Submit</loomi-button>
</form>
```

### Laravel Blade

```bash
cd /path/to/your-laravel-app
npm install @loomidev/forms lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/forms";
```

```blade
<form>
  <loomi-input name="email" type="email" label="Email" required></loomi-input>
  <loomi-select name="role" label="Role" data='[{"label":"Admin","value":"admin"},{"label":"Member","value":"member"}]'></loomi-select>
  <loomi-button can-submit>Submit</loomi-button>
</form>
```

### React

```jsx
import "@loomidev/forms";

export function LoomiBundleExample() {
  return (
    <form>
      <loomi-input name="email" type="email" label="Email" required></loomi-input>
      <loomi-select name="role" label="Role" data='[{"label":"Admin","value":"admin"},{"label":"Member","value":"member"}]'></loomi-select>
      <loomi-button can-submit>Submit</loomi-button>
    </form>
  );
}
```

For array or object properties such as select `data` or table `columns`, assign the value with a ref after mount when using React 18.

### Vue

```vue
<script setup>
import "@loomidev/forms";
</script>

<template>
  <form>
    <loomi-input name="email" type="email" label="Email" required></loomi-input>
    <loomi-select name="role" label="Role" data='[{"label":"Admin","value":"admin"},{"label":"Member","value":"member"}]'></loomi-select>
    <loomi-button can-submit>Submit</loomi-button>
  </form>
</template>
```

Configure Vue's `compilerOptions.isCustomElement` for tags that start with `loomi-` if your tooling warns about unknown components.

### Angular

```ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomidev/forms";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <form>
      <loomi-input name="email" type="email" label="Email" required></loomi-input>
      <loomi-select name="role" label="Role" data='[{"label":"Admin","value":"admin"},{"label":"Member","value":"member"}]'></loomi-select>
      <loomi-button can-submit>Submit</loomi-button>
    </form>
  `,
})
export class AppComponent {}
```

### Svelte and Astro

```svelte
<script>
  import "@loomidev/forms";
</script>

<form>
  <loomi-input name="email" type="email" label="Email" required></loomi-input>
  <loomi-select name="role" label="Role" data='[{"label":"Admin","value":"admin"},{"label":"Member","value":"member"}]'></loomi-select>
  <loomi-button can-submit>Submit</loomi-button>
</form>
```

```astro
---
import "@loomidev/forms";
---

<form>
  <loomi-input name="email" type="email" label="Email" required></loomi-input>
  <loomi-select name="role" label="Role" data='[{"label":"Admin","value":"admin"},{"label":"Member","value":"member"}]'></loomi-select>
  <loomi-button can-submit>Submit</loomi-button>
</form>
```

### Server-side rendering notes

In Next.js, Nuxt, SvelteKit, and other SSR frameworks, put the bundle import in client-side code if the server build complains about browser-only APIs. The rendered HTML can still contain the `<loomi-*>` tags; the browser upgrades them after the JavaScript loads.

<!-- END loomi-framework-guide -->
