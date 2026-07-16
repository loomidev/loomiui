# @loomidev/tag

`<loomi-tag>` — a themeable label/badge for grouping items or showing status. Faint or
dark shade, optional outline, rounded, tiny, and a close button. Group several in
`<loomi-tags>` to make them selectable, like a fancier checkbox group.

```bash
npm install @loomidev/tag lit
```

```js
import "@loomidev/tag";
```

## Basic Usage

```html
<loomi-tag label="pending"></loomi-tag>
```

## Light, Faint, and Dark Shades

Tags default to a faint tint. Set `shade="light"` for a paler chip with a border one
shade stronger than the tag color, or `shade="dark"` for a deeper solid fill.

```html
<loomi-tag label="pending" color="success" shade="light"></loomi-tag>
<loomi-tag label="pending" color="success"></loomi-tag>
<loomi-tag label="pending" color="success" shade="dark"></loomi-tag>
```

Common semantic colors: `primary` `secondary` `info` `success` `error` `warning` `gray`.

## With Close Icons

Useful for removable selections, like a list of chosen filters. The tag removes itself
from the DOM on click by default.

```html
<loomi-tag label="pending" can-close></loomi-tag>
<loomi-tag label="pending" can-close color="warning"></loomi-tag>
```

Intercept the removal by listening for the cancelable `close` event:

```js
document.querySelector("loomi-tag").addEventListener("close", (e) => {
  e.preventDefault(); // stop it from removing itself
  console.log("user wants to remove this tag — confirm first?");
});
```

## Tiny Tags

Handy as a small hint next to a menu item — e.g. flagging what's new.

```html
<loomi-tag label="just added" tiny color="success"></loomi-tag>
<loomi-tag label="new" tiny color="warning" shade="dark"></loomi-tag>
```

## Rounded Tags

```html
<loomi-tag label="pending" rounded></loomi-tag>
<loomi-tag label="pending" can-close rounded color="warning"></loomi-tag>
```

## Outline Tags

No background fill — just a border in `color`. The shade still affects how light or
dark the outline is.

```html
<loomi-tag label="pending" outline color="warning"></loomi-tag>
<loomi-tag label="pending" can-close outline color="warning" shade="dark"></loomi-tag>
```

## Selectable Tags

Wrap tags in `<loomi-tags name="...">` to use them as a form control, similar to a
checkbox group — give each `<loomi-tag>` a `value`, and the parent submits the selected
values (comma-joined) under `name`.

```html
<loomi-tags name="stack" color="warning" max="3">
  <loomi-tag label="laravel" value="laravel"></loomi-tag>
  <loomi-tag label="javascript" value="js"></loomi-tag>
  <loomi-tag label="node js" value="node"></loomi-tag>
  <loomi-tag label="tailwindcss" value="tailwind"></loomi-tag>
</loomi-tags>
```

### Pre-Selected Values

```html
<loomi-tags name="fridays" color="error" selected-value="hangout,sleep">
  <loomi-tag label="hangout with friends" value="hangout"></loomi-tag>
  <loomi-tag label="watch movies" value="movies"></loomi-tag>
  <loomi-tag label="sleeeeep" value="sleep"></loomi-tag>
</loomi-tags>
```

### Reacting to Selection

```js
document.querySelector("loomi-tags").addEventListener("change", (e) => {
  console.log(e.detail.values); // ["hangout", "sleep"]
});
```

## Accessibility

For the library-wide baseline, see [Foundations — Accessibility](https://loomiui.com/foundations/#accessibility).

## Responsive behavior

For the shared container and viewport rules, see [Foundations — Responsive behavior](https://loomiui.com/foundations/#responsive-behavior).

## Dark mode

For theme activation, token overrides, and contrast guidance, see [Foundations — Dark mode](https://loomiui.com/foundations/#dark-mode).

## Attributes

### `<loomi-tag>`

| Attribute     | Default   | Description                                 |
| ------------- | --------- | ------------------------------------------- |
| `label`       | _(blank)_ | Tag text (or use the default slot).         |
| `color`       | `primary` | Any loomi color.                            |
| `shade`       | `faint`   | `light` \| `faint` \| `dark`                |
| `outline`     | `false`   | Outline only, no fill. _(boolean)_          |
| `rounded`     | `false`   | Fully rounded. _(boolean)_                  |
| `tiny`        | `false`   | Tiny size. _(boolean)_                      |
| `uppercasing` | `false`   | Uppercase the text. _(boolean)_             |
| `can-close`   | `false`   | Show a close button. _(boolean)_            |
| `value`       | _(blank)_ | Submitted value when inside `<loomi-tags>`. |

### `<loomi-tags>` (selectable group)

| Attribute        | Default   | Description                                |
| ---------------- | --------- | ------------------------------------------ |
| `name`           | _(blank)_ | Submitted with the form.                   |
| `max`            | _(blank)_ | Max selectable tags (no limit by default). |
| `selected-value` | _(blank)_ | Comma-separated values to pre-select.      |
| `required`       | `false`   | Marks the field required. _(boolean)_      |

## Slots

| Slot        | Description                          |
| ----------- | ------------------------------------ |
| _(default)_ | Content placed inside the component. |

## Events

| Event             | Description                                   |
| ----------------- | --------------------------------------------- |
| `change`          | Fired when the value is committed or changed. |
| `close`           | Fired when the component closes.              |
| `loomi-tag-click` | Fired when a tag is activated.                |

## Full Example

```html
<loomi-tags name="stack" color="warning" max="3" required>
  <loomi-tag label="accounting" value="accounting" can-close rounded outline shade="dark"></loomi-tag>
  <loomi-tag label="marketing" value="marketing"></loomi-tag>
  <loomi-tag label="tech" value="tech"></loomi-tag>
</loomi-tags>
```

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-tag>` and `<loomi-tags>` are standard custom elements, so the browser can use them in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/tag` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomidev/tag lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/tag build
pnpm --filter @loomidev/tag typecheck
```

### Choose your framework

<loomi-tabs>
<loomi-tab label="HTML" active>

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/tag"></script>

<loomi-tags>
  <loomi-tag color="success" label="Active"></loomi-tag>
  <loomi-tag color="warning" outline>Pending review</loomi-tag>
</loomi-tags>
```

</loomi-tab>
<loomi-tab label="Bundlers and SPAs">

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/tag";
```

</loomi-tab>
<loomi-tab label="Blade">

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomidev/tag lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/tag";
```

```blade
<loomi-tags>
  <loomi-tag color="success" label="Active"></loomi-tag>
  <loomi-tag color="warning" outline>Pending review</loomi-tag>
</loomi-tags>
```

</loomi-tab>
<loomi-tab label="React">

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import "@loomidev/tag";

export function LoomiExample() {
  return (
    <loomi-tags>
      <loomi-tag color="success" label="Active"></loomi-tag>
      <loomi-tag color="warning" outline>Pending review</loomi-tag>
    </loomi-tags>
  );
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

</loomi-tab>
<loomi-tab label="Vue">

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import "@loomidev/tag";
</script>

<template>
  <loomi-tags>
    <loomi-tag color="success" label="Active"></loomi-tag>
    <loomi-tag color="warning" outline>Pending review</loomi-tag>
  </loomi-tags>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

</loomi-tab>
<loomi-tab label="Angular">

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomidev/tag";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-tags>
      <loomi-tag color="success" label="Active"></loomi-tag>
      <loomi-tag color="warning" outline>Pending review</loomi-tag>
    </loomi-tags>
  `,
})
export class AppComponent {}
```

</loomi-tab>
<loomi-tab label="Svelte / Astro">

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import "@loomidev/tag";
</script>

<loomi-tags>
  <loomi-tag color="success" label="Active"></loomi-tag>
  <loomi-tag color="warning" outline>Pending review</loomi-tag>
</loomi-tags>
```

```astro
---
import "@loomidev/tag";
---

<loomi-tags>
  <loomi-tag color="success" label="Active"></loomi-tag>
  <loomi-tag color="warning" outline>Pending review</loomi-tag>
</loomi-tags>
```

</loomi-tab>
</loomi-tabs>

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->

## Dependencies

- `@loomidev/core`
- `@loomidev/icon`
