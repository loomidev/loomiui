# @loomidev/statistic

`<loomi-statistic>` — a dashboard stat showing a number and label, with optional
currency, an icon, and a loading state. Takes up the full width of its parent.

```bash
npm install @loomidev/statistic lit
```

```js
import "@loomidev/statistic";
```


## Basic Usage

Numbers render as-is — format thousand separators and decimals yourself before setting
`number`.

```html
<loomi-statistic number="34,500,100" label="Total payments"></loomi-statistic>
```

Move the label below the number instead of above it:

```html
<loomi-statistic label-position="bottom" number="34,500,100" label="Total payments"></loomi-statistic>
```

## With Icons

Pass any markup into the `icon` slot — usually a `<loomi-icon>` on a colored background.
Icons sit on the left by default; flip them with `icon-position="right"`.

```html
<loomi-statistic number="34,500,100" label="Total payments">
  <loomi-icon slot="icon" name="banknotes" style="background: #15803d; color: white; border-radius: 9999px; padding: 0.5rem"></loomi-icon>
</loomi-statistic>

<loomi-statistic icon-position="right" number="1,204" label="Active users">
  <loomi-icon slot="icon" name="users" style="background: #f97316; color: white; border-radius: 9999px; padding: 0.5rem"></loomi-icon>
</loomi-statistic>
```

You can also style the icon from the statistic host with `icon-color` and `icon-size`.

```html
<loomi-statistic number="1,204" label="Active users" icon-color="#15803d" icon-size="2rem">
  <loomi-icon slot="icon" name="users"></loomi-icon>
</loomi-statistic>
```

## With Currency

```html
<loomi-statistic currency="GHS" number="34,500,100" label="Total payments"></loomi-statistic>

<!-- currency on the right of the number instead -->
<loomi-statistic currency="GHS" currency-position="right" number="34,500,100" label="Total payments"></loomi-statistic>
```

The currency symbol renders at a smaller font size than the number itself.

## Loading State

Show a spinner in place of the number while the real value is still loading — e.g.
while waiting on an API response.

```html
<loomi-statistic label="Total payments" show-spinner></loomi-statistic>
```

```js
const el = document.querySelector("loomi-statistic");
const total = await fetchTotalPayments();
el.number = total.toLocaleString();
el.showSpinner = false;
```

## Card Styling

`<loomi-statistic>` renders as a floating glass surface by default — a translucent,
backdrop-blurred background, a hairline border, and a soft drop shadow — the same frame
treatment as [`<loomi-card>`](../card) and the "Sales Overview" card on the LoomiUI
homepage. Turn either off with `has-border` / `has-shadow`; turning off `has-shadow` also
drops the translucency and blur, since those are part of the same floating-card material.

```html
<loomi-statistic number="92" label="Score" has-shadow="false" has-border="false"></loomi-statistic>
<loomi-statistic number="92" label="Score" radius="large"></loomi-statistic>
```

## Clickable Statistics

```html
<loomi-statistic number="34,500" label="Total payments" url="/reports/payments"></loomi-statistic>
```

## Accessibility

loomi-statistic is built on semantic markup where the browser gives us the right behavior, and it adds ARIA only where the component has custom interaction. Keyboard users should be able to reach the same controls as pointer users, with visible focus treatment unless you explicitly turn it off on controls that support `show-focus-ring="false"`.

When the component displays status, progress, validation, or temporary feedback, pair it with clear labels or nearby text in your app so assistive technology users get the same context a sighted user gets from the visual treatment.

- Supports keyboard focus with visible `:focus-visible` styling on interactive controls.

## Responsive behavior

loomi-statistic is designed to fit the layout you place it in. It uses fluid widths, `min-width: 0`, wrapping, truncation, or stacked layouts where that keeps the component usable in cards, forms, sidebars, and mobile screens.

For dense layouts, give the parent container an intentional width and let the component fill it. For long labels or user-provided content, prefer real text that can wrap or truncate instead of fixed pixel assumptions.


## Dark mode

loomi-statistic uses Loomi semantic tokens such as `--loomi-surface`, `--loomi-surface-border`, `--loomi-text`, and palette accent tokens instead of hard-coded light colors. Borders, panels, hover states, and muted text are expected to shift with the active theme.

Add `.dark` to your app root with `@loomidev/theme-switcher`, or provide your own token overrides, and the component will inherit the dark-mode values through its shadow DOM.

- Respects `.dark` on `<html>` via `@loomidev/theme-switcher` or your app theme.

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `label` | _(blank)_ | Description text. |
| `number` | _(blank)_ | The value to display (format it yourself). |
| `label-position` | `top` | `top` \| `bottom` |
| `currency` | _(blank)_ | Currency symbol shown beside the number. |
| `currency-position` | `left` | `left` \| `right` |
| `icon-position` | `left` | `left` \| `right` |
| `icon-color` | _(blank)_ | CSS color applied to the icon slot wrapper. |
| `icon-size` | _(blank)_ | CSS size applied to slotted icons. |
| `has-shadow` | `true` | Show a drop shadow. _(boolean)_ |
| `has-border` | `true` | Show a border. _(boolean)_ |
| `radius` | `medium` | `none` \| `small` \| `medium` \| `large` \| `xl` |
| `show-spinner` | `false` | Show a loading spinner instead of the number. _(boolean)_ |
| `url` | _(blank)_ | Navigate on click. |

**Slot:** `icon`.

## Full Example

```html
<loomi-statistic
  label="Total payments"
  label-position="bottom"
  number="34,500,100"
  currency="XOF"
  currency-position="right"
  icon-position="right"
  has-shadow="false"
  has-border="false"
>
  <loomi-icon slot="icon" name="banknotes"></loomi-icon>
</loomi-statistic>
```

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-statistic>` is a standard custom element, so the browser can use it in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/statistic` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomidev/statistic lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/statistic build
pnpm --filter @loomidev/statistic typecheck
```

### Choose your framework

<loomi-tabs>
<loomi-tab label="HTML" active>

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/statistic"></script>

<loomi-statistic label="Revenue" number="12450" currency="GHS" has-border></loomi-statistic>
```

</loomi-tab>
<loomi-tab label="Bundlers and SPAs">

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/statistic";
```

</loomi-tab>
<loomi-tab label="Blade">

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomidev/statistic lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/statistic";
```

```blade
<loomi-statistic label="Revenue" number="12450" currency="GHS" has-border></loomi-statistic>
```

</loomi-tab>
<loomi-tab label="React">

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import "@loomidev/statistic";

export function LoomiExample() {
  return (
    <loomi-statistic label="Revenue" number="12450" currency="GHS" has-border></loomi-statistic>
  );
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

</loomi-tab>
<loomi-tab label="Vue">

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import "@loomidev/statistic";
</script>

<template>
  <loomi-statistic label="Revenue" number="12450" currency="GHS" has-border></loomi-statistic>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

</loomi-tab>
<loomi-tab label="Angular">

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomidev/statistic";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-statistic label="Revenue" number="12450" currency="GHS" has-border></loomi-statistic>
  `,
})
export class AppComponent {}
```

</loomi-tab>
<loomi-tab label="Svelte / Astro">

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import "@loomidev/statistic";
</script>

<loomi-statistic label="Revenue" number="12450" currency="GHS" has-border></loomi-statistic>
```

```astro
---
import "@loomidev/statistic";
---

<loomi-statistic label="Revenue" number="12450" currency="GHS" has-border></loomi-statistic>
```

</loomi-tab>
</loomi-tabs>

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->

## Dependencies

- `@loomidev/card`
- `@loomidev/core`
