# @loomidev/toggle

`<loomi-toggle>` — a themeable toggle/switch (a checkbox, spiced up).
**Form-associated**: submits `value` (default `"on"`) under `name` when checked.

```bash
npm install @loomidev/toggle lit
```

```js
import "@loomidev/toggle";
```


## Basic Usage

```html
<loomi-toggle></loomi-toggle>
```

## Labels

The label can sit on either side of the switch — default is `left`, flip it with
`label-position="right"`. Clicking the label toggles the component.

```html
<loomi-toggle>Send me quarterly newsletters</loomi-toggle>
<loomi-toggle label-position="right">Send me quarterly newsletters</loomi-toggle>
```

By default the toggle is an inline element, so several can sit side by side. Set
`justified` to make it fill its parent container, with the label and switch pushed to
opposite ends.

```html
<loomi-toggle justified>Send me quarterly newsletters</loomi-toggle>
```

## Thin and Thicker Bars

Three bar thicknesses are available — `thin` (Android-style), `thick` (default), and
`thicker` (iOS-style).

```html
<loomi-toggle bar="thin">Thin</loomi-toggle>
<loomi-toggle bar="thick">Thick (default)</loomi-toggle>
<loomi-toggle bar="thicker">Thicker</loomi-toggle>
```

## Checked and Disabled

```html
<loomi-toggle checked>I am checked at birth</loomi-toggle>
<loomi-toggle disabled>I am disabled</loomi-toggle>
<loomi-toggle checked disabled>Checked and disabled</loomi-toggle>
```

## Different Colors

Any loomi color works for the active/checked state: `primary` `secondary` `success`
`error` `warning` `gray` `success` `warning` `error` `primary`.

```html
<loomi-toggle color="error" checked>Red</loomi-toggle>
<loomi-toggle color="yellow" checked>Yellow</loomi-toggle>
<loomi-toggle color="success" checked>Green</loomi-toggle>
<loomi-toggle color="error" checked>Error</loomi-toggle>
<loomi-toggle color="warning" checked>Warning</loomi-toggle>
<loomi-toggle color="success" checked>Success</loomi-toggle>
<loomi-toggle color="warning" checked>Orange</loomi-toggle>
```

## Accessibility
- Implements ARIA roles/states for custom interaction surfaces.
- Supports keyboard focus with visible `:focus-visible` styling on interactive controls.

## Responsive behavior
- Fluid width (`width: 100%`, `min-width: 0`) within flex and grid layouts.

## Dark mode
- Uses semantic `--loomi-surface`, `--loomi-surface-border`, and `--loomi-text` tokens where applicable.
- Respects `.dark` on `<html>` via `@loomidev/theme-switcher` or your app theme.

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `name` | _(blank)_ | Submitted with the form when checked. |
| `value` | `on` | Submitted value. |
| `label` | _(blank)_ | Clickable label (or use the default slot). |
| `label-position` | `left` | `left` \| `right` |
| `checked` | `false` | Checked state. _(boolean, reflected)_ |
| `disabled` | `false` | Disable the toggle. _(boolean)_ |
| `justified` | `false` | Spread label + switch to fill the parent. _(boolean)_ |
| `bar` | `thick` | `thin` \| `thick` \| `thicker` |
| `color` | `primary` | Active color (any loomi color). |
| `no-clearing` | `false` | Remove the default bottom margin. _(boolean)_ |

**Slot:** default (label). **Parts:** `track`, `knob`. **Event:** `change` (composed).

## Full Example

```html
<loomi-toggle
  name="subscribe"
  color="success"
  label-position="right"
  bar="thin"
>
  Send me quarterly newsletters
</loomi-toggle>
```

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-toggle>` is a standard custom element, so the browser can use it in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/toggle` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomidev/toggle lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/toggle build
pnpm --filter @loomidev/toggle typecheck
```

### Choose your framework

<loomi-tabs>
<loomi-tab label="Plain HTML" active>

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/toggle"></script>

<loomi-toggle name="notifications" label="Email notifications" checked></loomi-toggle>
```

</loomi-tab>
<loomi-tab label="Bundlers and SPAs">

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/toggle";
```


Because this is a form-capable component, give it a `name` when it should submit with a native `<form>`. Read its value with `new FormData(form).get("the-name")` just like you would for a built-in input.

</loomi-tab>
<loomi-tab label="Laravel Blade">

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomidev/toggle lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/toggle";
```

```blade
<loomi-toggle name="notifications" label="Email notifications" checked></loomi-toggle>
```

</loomi-tab>
<loomi-tab label="React">

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import "@loomidev/toggle";

export function LoomiExample() {
  return (
    <loomi-toggle name="notifications" label="Email notifications" checked></loomi-toggle>
  );
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

</loomi-tab>
<loomi-tab label="Vue">

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import "@loomidev/toggle";
</script>

<template>
  <loomi-toggle name="notifications" label="Email notifications" checked></loomi-toggle>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

</loomi-tab>
<loomi-tab label="Angular">

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomidev/toggle";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-toggle name="notifications" label="Email notifications" checked></loomi-toggle>
  `,
})
export class AppComponent {}
```

</loomi-tab>
<loomi-tab label="Svelte and Astro">

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import "@loomidev/toggle";
</script>

<loomi-toggle name="notifications" label="Email notifications" checked></loomi-toggle>
```

```astro
---
import "@loomidev/toggle";
---

<loomi-toggle name="notifications" label="Email notifications" checked></loomi-toggle>
```

</loomi-tab>
</loomi-tabs>

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->
