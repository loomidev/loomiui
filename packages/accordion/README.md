# @loomi/accordion

`<loomi-accordion>` groups `<loomi-accordion-item>` collapsible sections. By default
only one item is open at a time, organizing content compactly without giving up access
to it.

```bash
npm install @loomi/accordion lit
```

```js
import "@loomi/accordion";
```

## Basic Usage

Each item needs a `title` for its clickable header; the body is its default slot.

```html
<loomi-accordion>
  <loomi-accordion-item title="What is loomi?">
    <p>A framework-agnostic Lit web component library.</p>
  </loomi-accordion-item>
  <loomi-accordion-item title="How do I install it?">
    <p>npm install the package for whichever component you need.</p>
  </loomi-accordion-item>
  <loomi-accordion-item title="Can I theme it?">
    <p>Yes — override the public CSS custom properties at :root.</p>
  </loomi-accordion-item>
</loomi-accordion>
```

## Custom Title Content

If a plain string title isn't enough, use the `title` slot instead of the `title`
attribute.

```html
<loomi-accordion>
  <loomi-accordion-item>
    <div slot="title" style="display:flex;align-items:center;gap:0.5rem">
      <loomi-icon name="cube"></loomi-icon>
      <div>
        <div>What is LoomiUI?</div>
        <div style="font-size:0.75rem;opacity:0.7">v1.0.0</div>
      </div>
    </div>
    <p>A framework-agnostic Lit web component library.</p>
  </loomi-accordion-item>
</loomi-accordion>
```

## Open by Default

```html
<loomi-accordion>
  <loomi-accordion-item title="Open on load" open>
    <p>This section starts expanded.</p>
  </loomi-accordion-item>
  <loomi-accordion-item title="Closed on load">
    <p>This one doesn't.</p>
  </loomi-accordion-item>
</loomi-accordion>
```

## Open Multiple Accordion Items

By default opening one item closes whatever else is open. Set `can-open-multiple` to
let items stay open independently.

```html
<loomi-accordion can-open-multiple>
  <loomi-accordion-item title="Section A" open>…</loomi-accordion-item>
  <loomi-accordion-item title="Section B" open>…</loomi-accordion-item>
</loomi-accordion>
```

## Ungrouped Accordions

By default items sit inside one shared card, separated by divider lines. Set
`grouped="false"` for each item to render as its own standalone card.

```html
<loomi-accordion grouped="false">
  <loomi-accordion-item title="Standalone item one">…</loomi-accordion-item>
  <loomi-accordion-item title="Standalone item two">…</loomi-accordion-item>
</loomi-accordion>
```

## Colorful Accordions

`color` only applies when `grouped="false"`, since grouped accordions share one
container background.

```html
<loomi-accordion grouped="false" color="yellow">
  <loomi-accordion-item title="A pop of color">…</loomi-accordion-item>
</loomi-accordion>
```

It can also be set per-item to mix colors within one ungrouped accordion:

```html
<loomi-accordion grouped="false">
  <loomi-accordion-item title="Blue item" color="blue">…</loomi-accordion-item>
  <loomi-accordion-item title="Pink item" color="pink">…</loomi-accordion-item>
</loomi-accordion>
```

## No Padding

```html
<loomi-accordion-item title="Tight content" no-padding>
  <img src="/banner.jpg" alt="" />
</loomi-accordion-item>
```

## Attributes

### `<loomi-accordion>`

| Attribute | Default | Description |
| --- | --- | --- |
| `grouped` | `true` | Group items in one card (vs standalone cards). _(boolean)_ |
| `can-open-multiple` | `false` | Allow multiple open items. _(boolean)_ |
| `color` | _(blank)_ | Background color when `grouped="false"`. |

### `<loomi-accordion-item>`

| Attribute | Default | Description |
| --- | --- | --- |
| `title` | _(blank)_ | Header text (or use the `title` slot). |
| `open` | `false` | Open by default. _(boolean)_ |
| `color` | _(blank)_ | Standalone background color. |
| `no-padding` | `false` | Remove body padding. _(boolean)_ |

**Slots:** default (body), `title`.

## Full Example

```html
<loomi-accordion grouped="false" can-open-multiple color="pink">
  <loomi-accordion-item title="What is loomi?" open>
    <p>A framework-agnostic Lit web component library.</p>
  </loomi-accordion-item>
  <loomi-accordion-item title="How do I install it?">
    <p>npm install the package for whichever component you need.</p>
  </loomi-accordion-item>
</loomi-accordion>
```

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-accordion-item>` and `<loomi-accordion>` are standard custom elements, so the browser can use them in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/accordion` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomi/accordion lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomi/accordion build
pnpm --filter @loomi/accordion typecheck
```

### Plain HTML

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomi/accordion"></script>

<loomi-accordion>
  <loomi-accordion-item title="Shipping">Orders usually ship in 2 business days.</loomi-accordion-item>
  <loomi-accordion-item title="Returns">Returns are accepted within 30 days.</loomi-accordion-item>
</loomi-accordion>
```

### Bundlers and single-page apps

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomi/accordion";
```


### Laravel Blade

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomi/accordion lit
npm run dev
```

```js
// resources/js/app.js
import "@loomi/accordion";
```

```blade
<loomi-accordion>
  <loomi-accordion-item title="Shipping">Orders usually ship in 2 business days.</loomi-accordion-item>
  <loomi-accordion-item title="Returns">Returns are accepted within 30 days.</loomi-accordion-item>
</loomi-accordion>
```

### React

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import "@loomi/accordion";

export function LoomiExample() {
  return (
    <loomi-accordion>
      <loomi-accordion-item title="Shipping">Orders usually ship in 2 business days.</loomi-accordion-item>
      <loomi-accordion-item title="Returns">Returns are accepted within 30 days.</loomi-accordion-item>
    </loomi-accordion>
  );
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

### Vue

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import "@loomi/accordion";
</script>

<template>
  <loomi-accordion>
    <loomi-accordion-item title="Shipping">Orders usually ship in 2 business days.</loomi-accordion-item>
    <loomi-accordion-item title="Returns">Returns are accepted within 30 days.</loomi-accordion-item>
  </loomi-accordion>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

### Angular

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomi/accordion";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-accordion>
      <loomi-accordion-item title="Shipping">Orders usually ship in 2 business days.</loomi-accordion-item>
      <loomi-accordion-item title="Returns">Returns are accepted within 30 days.</loomi-accordion-item>
    </loomi-accordion>
  `,
})
export class AppComponent {}
```

### Svelte and Astro

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import "@loomi/accordion";
</script>

<loomi-accordion>
  <loomi-accordion-item title="Shipping">Orders usually ship in 2 business days.</loomi-accordion-item>
  <loomi-accordion-item title="Returns">Returns are accepted within 30 days.</loomi-accordion-item>
</loomi-accordion>
```

```astro
---
import "@loomi/accordion";
---

<loomi-accordion>
  <loomi-accordion-item title="Shipping">Orders usually ship in 2 business days.</loomi-accordion-item>
  <loomi-accordion-item title="Returns">Returns are accepted within 30 days.</loomi-accordion-item>
</loomi-accordion>
```

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->
