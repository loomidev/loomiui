# @loomidev/forms

All LoomiUI **form** components in one install.

```bash
npm install @loomidev/forms lit
```

```js
import "@loomidev/forms"; // registers all form elements
```

| Package                                   |
| ----------------------------------------- |
| [`@loomidev/input`](../input)             |
| [`@loomidev/password`](../password)       |
| [`@loomidev/textarea`](../textarea)       |
| [`@loomidev/text-editor`](../text-editor) |
| [`@loomidev/select`](../select)           |
| [`@loomidev/checkbox`](../checkbox)       |
| [`@loomidev/radio`](../radio)             |
| [`@loomidev/toggle`](../toggle)           |
| [`@loomidev/number`](../number)           |
| [`@loomidev/slider`](../slider)           |
| [`@loomidev/otp`](../otp)                 |
| [`@loomidev/checkcards`](../checkcards)   |
| [`@loomidev/datepicker`](../datepicker)   |
| [`@loomidev/timepicker`](../timepicker)   |
| [`@loomidev/colorpicker`](../colorpicker) |
| [`@loomidev/filepicker`](../filepicker)   |

All form controls are **form-associated** — their values submit with a native `<form>` via `ElementInternals`.

<!-- BEGIN loomi-framework-guide -->

## Accessibility

For the library-wide baseline, see [Foundations — Accessibility](https://loomiui.com/foundations/#accessibility).

## Responsive behavior

For the shared container and viewport rules, see [Foundations — Responsive behavior](https://loomiui.com/foundations/#responsive-behavior).

## Dark mode

For theme activation, token overrides, and contrast guidance, see [Foundations — Dark mode](https://loomiui.com/foundations/#dark-mode).

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

### Choose your framework

<loomi-tabs>
<loomi-tab label="HTML" active>

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

</loomi-tab>
<loomi-tab label="Blade">

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

</loomi-tab>
<loomi-tab label="React">

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

</loomi-tab>
<loomi-tab label="Vue">

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

</loomi-tab>
<loomi-tab label="Angular">

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

</loomi-tab>
<loomi-tab label="Svelte / Astro">

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

</loomi-tab>
</loomi-tabs>

### Server-side rendering notes

In Next.js, Nuxt, SvelteKit, and other SSR frameworks, put the bundle import in client-side code if the server build complains about browser-only APIs. The rendered HTML can still contain the `<loomi-*>` tags; the browser upgrades them after the JavaScript loads.

<!-- END loomi-framework-guide -->

## Dependencies

- `@loomidev/checkbox`
- `@loomidev/checkcards`
- `@loomidev/colorpicker`
- `@loomidev/countries`
- `@loomidev/creditcard`
- `@loomidev/date-range-picker`
- `@loomidev/datepicker`
- `@loomidev/filepicker`
- `@loomidev/filter-builder`
- `@loomidev/input`
- `@loomidev/number`
- `@loomidev/password`
- `@loomidev/otp`
- `@loomidev/radio`
- `@loomidev/select`
- `@loomidev/slider`
- `@loomidev/text-editor`
- `@loomidev/textarea`
- `@loomidev/timepicker`
- `@loomidev/toggle`
