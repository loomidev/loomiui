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

## Accessibility

loomi-button is built on semantic markup where the browser gives us the right behavior, and it adds ARIA only where the component has custom interaction. Keyboard users should be able to reach the same controls as pointer users, with visible focus treatment unless you explicitly turn it off on controls that support `show-focus-ring="false"`.

When the component displays status, progress, validation, or temporary feedback, pair it with clear labels or nearby text in your app so assistive technology users get the same context a sighted user gets from the visual treatment.

- Supports keyboard focus with visible `:focus-visible` styling on interactive controls.

## Responsive behavior

loomi-button is designed to fit the layout you place it in. It uses fluid widths, `min-width: 0`, wrapping, truncation, or stacked layouts where that keeps the component usable in cards, forms, sidebars, and mobile screens.

For dense layouts, give the parent container an intentional width and let the component fill it. For long labels or user-provided content, prefer real text that can wrap or truncate instead of fixed pixel assumptions.

## Dark mode

loomi-button uses Loomi semantic tokens such as `--loomi-surface`, `--loomi-surface-border`, `--loomi-text`, and palette accent tokens instead of hard-coded light colors. Borders, panels, hover states, and muted text are expected to shift with the active theme.

Add `.dark` to your app root with `@loomidev/theme-switcher`, or provide your own token overrides, and the component will inherit the dark-mode values through its shadow DOM.

- Respects `.dark` on `<html>` via `@loomidev/theme-switcher` or your app theme.

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

| Element                | Package                                     |
| ---------------------- | ------------------------------------------- |
| `<loomi-button>`       | [`@loomidev/button`](../button)             |
| `<loomi-input>`        | [`@loomidev/input`](../input)               |
| `<loomi-password>`     | [`@loomidev/password`](../password)         |
| `<loomi-textarea>`     | [`@loomidev/textarea`](../textarea)         |
| `<loomi-text-editor>`  | [`@loomidev/text-editor`](../text-editor)   |
| `<loomi-checkbox>`     | [`@loomidev/checkbox`](../checkbox)         |
| `<loomi-radio>`        | [`@loomidev/radio`](../radio)               |
| `<loomi-toggle>`       | [`@loomidev/toggle`](../toggle)             |
| `<loomi-number>`       | [`@loomidev/number`](../number)             |
| `<loomi-select>`       | [`@loomidev/select`](../select)             |
| `<loomi-divider>`      | [`@loomidev/divider`](../divider)           |
| `<loomi-qrcode>`       | [`@loomidev/qrcode`](../qrcode)             |
| `<loomi-clipboard>`    | [`@loomidev/clipboard`](../clipboard)       |
| `<loomi-context-menu>` | [`@loomidev/context-menu`](../context-menu) |
| `<loomi-profile-menu>` | [`@loomidev/profile-menu`](../profile-menu) |
| `<loomi-side-nav>`     | [`@loomidev/side-nav`](../side-nav)         |
| `<loomi-timer>`        | [`@loomidev/timer`](../timer)               |
| `<loomi-arc-meter>`    | [`@loomidev/arc-meter`](../arc-meter)       |

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

### Choose your framework

<loomi-tabs>
<loomi-tab label="HTML" active>

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/components"></script>

<loomi-button icon="check">Save</loomi-button>
<loomi-input name="email" label="Email"></loomi-input>
<loomi-card title="Account">Ready to go.</loomi-card>
```

</loomi-tab>
<loomi-tab label="Blade">

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

</loomi-tab>
<loomi-tab label="React">

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

</loomi-tab>
<loomi-tab label="Vue">

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

</loomi-tab>
<loomi-tab label="Angular">

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

</loomi-tab>
<loomi-tab label="Svelte / Astro">

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

</loomi-tab>
</loomi-tabs>

### Server-side rendering notes

In Next.js, Nuxt, SvelteKit, and other SSR frameworks, put the bundle import in client-side code if the server build complains about browser-only APIs. The rendered HTML can still contain the `<loomi-*>` tags; the browser upgrades them after the JavaScript loads.

<!-- END loomi-framework-guide -->

## Dependencies

- `@loomidev/accordion`
- `@loomidev/alert`
- `@loomidev/arc-meter`
- `@loomidev/autocomplete`
- `@loomidev/avatar`
- `@loomidev/bell`
- `@loomidev/button`
- `@loomidev/button-group`
- `@loomidev/calendar`
- `@loomidev/card`
- `@loomidev/centered-content`
- `@loomidev/chart`
- `@loomidev/checkbox`
- `@loomidev/checkcards`
- `@loomidev/clipboard`
- `@loomidev/colorpicker`
- `@loomidev/command-palette`
- `@loomidev/contact-card`
- `@loomidev/context-menu`
- `@loomidev/core`
- `@loomidev/countries`
- `@loomidev/creditcard`
- `@loomidev/data-grid`
- `@loomidev/date-range-picker`
- `@loomidev/datepicker`
- `@loomidev/divider`
- `@loomidev/drawer`
- `@loomidev/dropmenu`
- `@loomidev/emoji-picker`
- `@loomidev/empty-state`
- `@loomidev/filepicker`
- `@loomidev/filter-builder`
- `@loomidev/horizontal-line-graph`
- `@loomidev/icon`
- `@loomidev/icons`
- `@loomidev/input`
- `@loomidev/lightbox`
- `@loomidev/listview`
- `@loomidev/modal`
- `@loomidev/notification`
- `@loomidev/number`
- `@loomidev/pagination`
- `@loomidev/password`
- `@loomidev/otp`
- `@loomidev/popover`
- `@loomidev/processing`
- `@loomidev/profile-menu`
- `@loomidev/progress`
- `@loomidev/progress-steps`
- `@loomidev/qrcode`
- `@loomidev/radio`
- `@loomidev/rating`
- `@loomidev/resizable`
- `@loomidev/select`
- `@loomidev/side-nav`
- `@loomidev/slider`
- `@loomidev/sortable`
- `@loomidev/spinner`
- `@loomidev/statistic`
- `@loomidev/tab`
- `@loomidev/table`
- `@loomidev/tag`
- `@loomidev/tag-input`
- `@loomidev/text-editor`
- `@loomidev/textarea`
- `@loomidev/theme`
- `@loomidev/theme-switcher`
- `@loomidev/timeline`
- `@loomidev/timepicker`
- `@loomidev/timer`
- `@loomidev/toggle`
- `@loomidev/tooltip`
