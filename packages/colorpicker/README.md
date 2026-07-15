# @loomidev/colorpicker

`<loomi-colorpicker>` — pick a color. Uses the native color input by default; pass a
comma-separated `colors` list for a custom swatch palette instead. **Form-associated**.

```bash
npm install @loomidev/colorpicker lit
```

```js
import "@loomidev/colorpicker";
```

## Basic Usage

```html
<loomi-colorpicker></loomi-colorpicker>
```

## Custom Swatch Palette

Pass a comma-separated list of HEX colors (including the `#`) to swap the native color
input for a custom palette of swatches — useful for a theme-builder UI where you want to
restrict users to an approved set of colors.

```html
<loomi-colorpicker colors="#ef4444,#f59e0b,#22c55e,#3b82f6,#8b5cf6,#ec4899"></loomi-colorpicker>
```

## Show Selected Value

By default the colorpicker only changes the swatch color — it doesn't display the HEX
value. Set `show-value` to display it next to the swatch.

```html
<loomi-colorpicker show-value selected-value="#16a34a"></loomi-colorpicker>
```

## Default / Pre-Selected Value

Useful in edit mode, to load a previously-saved color.

```html
<loomi-colorpicker selected-value="#3b82f6"></loomi-colorpicker>
```

## Sizes

The colorpicker comes in sizes that match other input fields, so it sits well alongside
them in a form.

```html
<loomi-colorpicker size="small"></loomi-colorpicker>
<loomi-colorpicker size="regular"></loomi-colorpicker>
<loomi-colorpicker size="medium"></loomi-colorpicker>
<loomi-colorpicker size="big"></loomi-colorpicker>
```

## Form Submission

Give the colorpicker a `name` to retrieve its value when the form is submitted.

```html
<loomi-colorpicker name="theme" selected-value="#909090"></loomi-colorpicker>
```

```js
new FormData(form).get("theme"); // "#909090"
```

## Reacting to a Selection

```js
document.querySelector("loomi-colorpicker").addEventListener("change", (e) => {
  console.log(e.detail.value); // "#3b82f6"
});
```

## Accessibility

For the library-wide baseline, see [Foundations — Accessibility](https://loomiui.com/foundations/#accessibility).

## Responsive behavior

For the shared container and viewport rules, see [Foundations — Responsive behavior](https://loomiui.com/foundations/#responsive-behavior).

## Dark mode

For theme activation, token overrides, and contrast guidance, see [Foundations — Dark mode](https://loomiui.com/foundations/#dark-mode).

## Attributes

| Attribute        | Default   | Description                                          |
| ---------------- | --------- | ---------------------------------------------------- |
| `name`           | _(blank)_ | Submitted with the form.                             |
| `selected-value` | `#000000` | Current/default color.                               |
| `colors`         | _(blank)_ | Comma-separated HEX list → renders a swatch palette. |
| `show-value`     | `false`   | Show the selected HEX value. _(boolean)_             |
| `size`           | `regular` | `small` \| `regular` \| `medium` \| `big`            |

**Event:** `change` (`detail: { value }`).

## Full Example

```html
<loomi-colorpicker
  name="theme"
  size="medium"
  show-value
  colors="#989098,#cccc44,#323232,#16a34a,#3b82f6"
  selected-value="#909090"
></loomi-colorpicker>
```

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-colorpicker>` is a standard custom element, so the browser can use it in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/colorpicker` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomidev/colorpicker lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/colorpicker build
pnpm --filter @loomidev/colorpicker typecheck
```

### Choose your framework

<loomi-tabs>
<loomi-tab label="HTML" active>

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/colorpicker"></script>

<loomi-colorpicker name="brand" selected-value="#16a34a" show-value></loomi-colorpicker>
```

</loomi-tab>
<loomi-tab label="Bundlers and SPAs">

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/colorpicker";
```

Because this is a form-capable component, give it a `name` when it should submit with a native `<form>`. Read its value with `new FormData(form).get("the-name")` just like you would for a built-in input.

</loomi-tab>
<loomi-tab label="Blade">

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomidev/colorpicker lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/colorpicker";
```

```blade
<loomi-colorpicker name="brand" selected-value="#16a34a" show-value></loomi-colorpicker>
```

</loomi-tab>
<loomi-tab label="React">

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import "@loomidev/colorpicker";

export function LoomiExample() {
  return (
    <loomi-colorpicker name="brand" selected-value="#16a34a" show-value></loomi-colorpicker>
  );
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

</loomi-tab>
<loomi-tab label="Vue">

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import "@loomidev/colorpicker";
</script>

<template>
  <loomi-colorpicker name="brand" selected-value="#16a34a" show-value></loomi-colorpicker>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

</loomi-tab>
<loomi-tab label="Angular">

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomidev/colorpicker";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-colorpicker name="brand" selected-value="#16a34a" show-value></loomi-colorpicker>
  `,
})
export class AppComponent {}
```

</loomi-tab>
<loomi-tab label="Svelte / Astro">

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import "@loomidev/colorpicker";
</script>

<loomi-colorpicker name="brand" selected-value="#16a34a" show-value></loomi-colorpicker>
```

```astro
---
import "@loomidev/colorpicker";
---

<loomi-colorpicker name="brand" selected-value="#16a34a" show-value></loomi-colorpicker>
```

</loomi-tab>
</loomi-tabs>

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->

## Dependencies

- `@loomidev/core`
