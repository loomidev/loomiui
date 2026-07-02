# @loomidev/slider

`<loomi-slider>` — select a numeric value with a slider, instead of clicking
increment/decrement arrows or typing a value directly. **Form-associated**: submits the
value under `name`.

```bash
npm install @loomidev/slider lit
```

```js
import "@loomidev/slider";
```


## Accessibility
- Implements ARIA roles/states for custom interaction surfaces.
- Supports keyboard focus with visible `:focus-visible` styling on interactive controls.

## Responsive behavior
- Fluid width (`width: 100%`, `min-width: 0`) within flex and grid layouts.

## Dark mode
- Uses semantic `--loomi-surface`, `--loomi-surface-border`, and `--loomi-text` tokens where applicable.
- Respects `.dark` on `<html>` via `@loomidev/theme-switcher` or your app theme.
## Basic Usage

```html
<loomi-slider></loomi-slider>
```

Give each slider on a page a unique `name` if you need to read its value on form
submission — particularly important if there's more than one slider on the page.

## Different Colors

The default color is `primary`. Any loomi color works, and themes the native track via
`accent-color`.

```html
<loomi-slider selected="50" color="cyan"></loomi-slider>
<loomi-slider selected="30" color="pink"></loomi-slider>
<loomi-slider selected="70" color="blue"></loomi-slider>
```

`selected` is also how you pre-populate the slider in edit mode.

## Step

By default the slider increments by `1`. Set `step` for a coarser interval.

```html
<loomi-slider selected="10" step="5"></loomi-slider>
```

## Min and Max Values

Default bounds are `0`–`100`.

```html
<loomi-slider min="18" max="65" selected="25"></loomi-slider>
```

The current value is shown in a tooltip above the slider handle and moves with it.

## Range Selection

Add `range` for a dual-handle slider. `selected` controls the start value and
`selected-end` controls the end value.

```html
<loomi-slider name="budget" range selected="20" selected-end="80"></loomi-slider>
```

When submitted in a form, a range slider submits the ordered values joined with
`" - "`.

```js
new FormData(form).get("budget"); // "20 - 80"
```

## Hiding the Value Tooltip

```html
<loomi-slider show-values="false"></loomi-slider>
```

## Form Submission

```html
<loomi-slider name="age" selected="34"></loomi-slider>
```

```js
new FormData(form).get("age"); // "34"
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `name` | _(blank)_ | Submitted with the form. |
| `selected` | `0` | Current/default value. |
| `selected-end` | `100` | End value when `range` is enabled. |
| `range` | `false` | Enable dual-handle range selection. _(boolean)_ |
| `min` / `max` | `0` / `100` | Range bounds. |
| `step` | `1` | Increment. |
| `color` | `primary` | Any loomi color (themes the track via `accent-color`). |
| `show-values` | `true` | Show the handle value tooltip. _(boolean)_ |

**Events:** `input`, `change` (composed).

## Full Example

```html
<loomi-slider
  name="volume"
  min="0"
  max="100"
  step="5"
  selected="65"
  color="purple"
></loomi-slider>
```

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-slider>` is a standard custom element, so the browser can use it in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/slider` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomidev/slider lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/slider build
pnpm --filter @loomidev/slider typecheck
```

### Choose your framework

<loomi-tabs>
<loomi-tab label="Plain HTML" active>

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/slider"></script>

<loomi-slider name="budget" min="0" max="100" step="5" selected="40" show-values></loomi-slider>
```

</loomi-tab>
<loomi-tab label="Bundlers and SPAs">

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/slider";
```


Because this is a form-capable component, give it a `name` when it should submit with a native `<form>`. Read its value with `new FormData(form).get("the-name")` just like you would for a built-in input.

</loomi-tab>
<loomi-tab label="Laravel Blade">

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomidev/slider lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/slider";
```

```blade
<loomi-slider name="budget" min="0" max="100" step="5" selected="40" show-values></loomi-slider>
```

</loomi-tab>
<loomi-tab label="React">

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import "@loomidev/slider";

export function LoomiExample() {
  return (
    <loomi-slider name="budget" min="0" max="100" step="5" selected="40" show-values></loomi-slider>
  );
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

</loomi-tab>
<loomi-tab label="Vue">

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import "@loomidev/slider";
</script>

<template>
  <loomi-slider name="budget" min="0" max="100" step="5" selected="40" show-values></loomi-slider>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

</loomi-tab>
<loomi-tab label="Angular">

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomidev/slider";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-slider name="budget" min="0" max="100" step="5" selected="40" show-values></loomi-slider>
  `,
})
export class AppComponent {}
```

</loomi-tab>
<loomi-tab label="Svelte and Astro">

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import "@loomidev/slider";
</script>

<loomi-slider name="budget" min="0" max="100" step="5" selected="40" show-values></loomi-slider>
```

```astro
---
import "@loomidev/slider";
---

<loomi-slider name="budget" min="0" max="100" step="5" selected="40" show-values></loomi-slider>
```

</loomi-tab>
</loomi-tabs>

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->
