# @loomidev/listview

`<loomi-listview>` — a divided list of `<loomi-listview-item>` rows. It mimics
`<ul><li>`: the component only draws the dividing lines between items — what goes
inside each row is entirely up to you.

```bash
npm install @loomidev/listview lit
```

```js
import "@loomidev/listview";
```

## Basic Usage

Each `<loomi-listview-item>` is a flex container, so laying out an avatar next to text
is just a couple of child elements.

```html
<loomi-card no-padding>
  <loomi-listview>
    <loomi-listview-item>
      <loomi-avatar size="small" image="/me.jpg"></loomi-avatar>
      <div>
        <div style="font-weight:500">Alex R. Bennett</div>
        <div style="font-size:0.875rem;opacity:0.7">alex@loomiui.dev</div>
      </div>
    </loomi-listview-item>
    <loomi-listview-item>
      <loomi-avatar size="small" label="AJ" bg-color="warning"></loomi-avatar>
      <div>
        <div style="font-weight:500">Anonymous Jackson</div>
        <div style="font-size:0.875rem;opacity:0.7">fake@person.com</div>
      </div>
    </loomi-listview-item>
  </loomi-listview>
</loomi-card>
```

## Transparent Background

By default the list sits on a white background. Remove it to drop the list onto
whatever background color you set on a parent element instead.

```html
<loomi-listview transparent style="background:#fefce8">
  <loomi-listview-item>Item one</loomi-listview-item>
  <loomi-listview-item>Item two</loomi-listview-item>
</loomi-listview>
```

## Compact Spacing

Tightens the gap between rows — useful for dense sidebars or dropdown-style lists.

```html
<loomi-listview compact>
  <loomi-listview-item>Notifications</loomi-listview-item>
  <loomi-listview-item>Messages</loomi-listview-item>
  <loomi-listview-item>Settings</loomi-listview-item>
</loomi-listview>
```

## Accessibility

For the library-wide baseline, see [Foundations — Accessibility](https://loomiui.com/foundations/#accessibility).

## Responsive behavior

For the shared container and viewport rules, see [Foundations — Responsive behavior](https://loomiui.com/foundations/#responsive-behavior).

## Dark mode

For theme activation, token overrides, and contrast guidance, see [Foundations — Dark mode](https://loomiui.com/foundations/#dark-mode).

## Attributes

### `<loomi-listview>`

| Attribute     | Default | Description                              |
| ------------- | ------- | ---------------------------------------- |
| `transparent` | `false` | Remove the white background. _(boolean)_ |
| `compact`     | `false` | Reduce row padding. _(boolean)_          |

## Slots

| Slot        | Description                          |
| ----------- | ------------------------------------ |
| _(default)_ | Content placed inside the component. |

## Full Example

```html
<loomi-listview compact transparent style="background:#fefce8">
  <loomi-listview-item>
    <loomi-avatar size="small" image="/me.jpg"></loomi-avatar>
    <div>
      <div style="font-weight:500">Alex R. Bennett</div>
      <div style="font-size:0.875rem;opacity:0.7">alex@loomiui.dev</div>
    </div>
  </loomi-listview-item>
</loomi-listview>
```

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-listview-item>` and `<loomi-listview>` are standard custom elements, so the browser can use them in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/listview` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomidev/listview lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/listview build
pnpm --filter @loomidev/listview typecheck
```

### Choose your framework

<loomi-tabs>
<loomi-tab label="HTML" active>

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/listview"></script>

<loomi-listview compact>
  <loomi-listview-item>Profile updated</loomi-listview-item>
  <loomi-listview-item>Payment received</loomi-listview-item>
</loomi-listview>
```

</loomi-tab>
<loomi-tab label="Bundlers and SPAs">

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/listview";
```

</loomi-tab>
<loomi-tab label="Blade">

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomidev/listview lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/listview";
```

```blade
<loomi-listview compact>
  <loomi-listview-item>Profile updated</loomi-listview-item>
  <loomi-listview-item>Payment received</loomi-listview-item>
</loomi-listview>
```

</loomi-tab>
<loomi-tab label="React">

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import "@loomidev/listview";

export function LoomiExample() {
  return (
    <loomi-listview compact>
      <loomi-listview-item>Profile updated</loomi-listview-item>
      <loomi-listview-item>Payment received</loomi-listview-item>
    </loomi-listview>
  );
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

</loomi-tab>
<loomi-tab label="Vue">

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import "@loomidev/listview";
</script>

<template>
  <loomi-listview compact>
    <loomi-listview-item>Profile updated</loomi-listview-item>
    <loomi-listview-item>Payment received</loomi-listview-item>
  </loomi-listview>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

</loomi-tab>
<loomi-tab label="Angular">

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomidev/listview";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-listview compact>
      <loomi-listview-item>Profile updated</loomi-listview-item>
      <loomi-listview-item>Payment received</loomi-listview-item>
    </loomi-listview>
  `,
})
export class AppComponent {}
```

</loomi-tab>
<loomi-tab label="Svelte / Astro">

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import "@loomidev/listview";
</script>

<loomi-listview compact>
  <loomi-listview-item>Profile updated</loomi-listview-item>
  <loomi-listview-item>Payment received</loomi-listview-item>
</loomi-listview>
```

```astro
---
import "@loomidev/listview";
---

<loomi-listview compact>
  <loomi-listview-item>Profile updated</loomi-listview-item>
  <loomi-listview-item>Payment received</loomi-listview-item>
</loomi-listview>
```

</loomi-tab>
</loomi-tabs>

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->

## Dependencies

- `@loomidev/core`
