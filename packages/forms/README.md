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
