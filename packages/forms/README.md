# @loomi/forms

All LoomiUI **form** components in one install.

```bash
npm install @loomi/forms lit
```

```js
import "@loomi/forms"; // registers all form elements
```

| Package |
| --- |
| [`@loomi/input`](../input) |
| [`@loomi/textarea`](../textarea) |
| [`@loomi/select`](../select) |
| [`@loomi/checkbox`](../checkbox) |
| [`@loomi/radio`](../radio) |
| [`@loomi/toggle`](../toggle) |
| [`@loomi/number`](../number) |
| [`@loomi/slider`](../slider) |
| [`@loomi/code`](../code) |
| [`@loomi/checkcards`](../checkcards) |
| [`@loomi/datepicker`](../datepicker) |
| [`@loomi/timepicker`](../timepicker) |
| [`@loomi/colorpicker`](../colorpicker) |
| [`@loomi/filepicker`](../filepicker) |

All form controls are **form-associated** — their values submit with a native `<form>` via `ElementInternals`.

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`@loomi/forms` registers all LoomiUI form controls. Use it when you want one import for a whole category instead of installing each component separately.

### Where to run commands

Run install commands from the app where you want to use this bundle. That means the folder that contains that app's `package.json`. If you are editing LoomiUI itself, run `pnpm --filter ...` commands from the top-level `components` folder.

```bash
cd /path/to/your-app
npm install @loomi/forms lit
```

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomi/forms build
pnpm --filter @loomi/forms typecheck
```

### Plain HTML

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomi/forms"></script>

<form>
  <loomi-input name="email" type="email" label="Email" required></loomi-input>
  <loomi-select name="role" label="Role" data='[{"label":"Admin","value":"admin"},{"label":"Member","value":"member"}]'></loomi-select>
  <loomi-button can-submit>Submit</loomi-button>
</form>
```

### Laravel Blade

```bash
cd /path/to/your-laravel-app
npm install @loomi/forms lit
npm run dev
```

```js
// resources/js/app.js
import "@loomi/forms";
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
import "@loomi/forms";

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
import "@loomi/forms";
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
import "@loomi/forms";

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
  import "@loomi/forms";
</script>

<form>
  <loomi-input name="email" type="email" label="Email" required></loomi-input>
  <loomi-select name="role" label="Role" data='[{"label":"Admin","value":"admin"},{"label":"Member","value":"member"}]'></loomi-select>
  <loomi-button can-submit>Submit</loomi-button>
</form>
```

```astro
---
import "@loomi/forms";
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
