# @loomi/card

`<loomi-card>` — a content card with an optional title and header/footer slots. Content
is entirely up to you; the card just provides the frame.

```bash
npm install @loomi/card lit
```

```js
import "@loomi/card";
```

## Basic Usage

```html
<loomi-card>Card content goes here.</loomi-card>
<loomi-card title="Recent activity">Card content goes here.</loomi-card>
```

## Different Radii

```html
<loomi-card radius="none">No rounding.</loomi-card>
<loomi-card radius="small">Small (default).</loomi-card>
<loomi-card radius="medium">Medium.</loomi-card>
<loomi-card radius="large">Large.</loomi-card>
<loomi-card radius="xl">Extra large.</loomi-card>
```

## Clickable Cards

Set `url` to make the whole card act as a link — a path, a full URL, or a JS function
call (evaluated as `javascript:`). Pair it with `has-hover` for a hover-shadow cue.

```html
<loomi-card has-hover url="/dashboard">Click anywhere on me</loomi-card>
<loomi-card has-hover url="https://loomiui.com">Opens in a new context via window.open</loomi-card>
```

## Compact & No-Padding

`compact` tightens the padding; `no-padding` removes it entirely so content touches the
card's edges (useful for an `<img>` filling the card).

```html
<loomi-card compact>Tighter padding all around.</loomi-card>
<loomi-card no-padding><img src="/photo.jpg" alt="" /></loomi-card>
```

## Practical Example: Grid of Nav Cards

```html
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1.25rem">
  <loomi-card has-hover url="/projects">
    <loomi-icon name="folder"></loomi-icon>
    <span>Projects</span>
  </loomi-card>
  <loomi-card has-hover url="/tasks">
    <loomi-icon name="check-circle"></loomi-icon>
    <span>Tasks</span>
  </loomi-card>
  <loomi-card has-hover url="/ideas">
    <loomi-icon name="light-bulb"></loomi-icon>
    <span>Ideas</span>
  </loomi-card>
</div>
```

## Practical Example: Compact Contact List

```html
<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:0.75rem">
  <loomi-card compact>
    <div style="display:flex;align-items:center;gap:0.5rem">
      <loomi-avatar image="/mike.jpg"></loomi-avatar>
      <div>
        <b>Michael K. Ocansey</b>
        <div style="font-size:0.875rem">Senior Developer</div>
      </div>
    </div>
  </loomi-card>
  <loomi-card compact>
    <div style="display:flex;align-items:center;gap:0.5rem">
      <loomi-avatar label="SA"></loomi-avatar>
      <div>
        <b>Sara Appiah</b>
        <div style="font-size:0.875rem">Designer</div>
      </div>
    </div>
  </loomi-card>
</div>
```

## Header and Footer

Headers and footers are slots, so there's no restriction on what goes in them. They're
independent — set either one without the other. When `header` is set, the card body
loses its default padding, so style the body yourself.

```html
<loomi-card>
  <div slot="header" style="display:flex;align-items:center;gap:0.5rem;padding:0.75rem 1rem">
    <loomi-avatar size="small" image="/mike.jpg"></loomi-avatar>
    <span>mkocansey · Greater Accra</span>
  </div>

  <img src="/photo.jpg" alt="" />

  <div slot="footer" style="display:flex;justify-content:space-between;padding:1rem">
    <div style="display:flex;gap:1rem">
      <loomi-icon name="heart"></loomi-icon>
      <loomi-icon name="chat-bubble-oval-left-ellipsis"></loomi-icon>
    </div>
  </div>
</loomi-card>
```

## Using It in the Docs Site

This very documentation site dogfoods `<loomi-card>` for its own previous/next page
navigation at the bottom of every page — see the [architecture
guide](../../../docs/src/content/docs/architecture.mdx) for how that's wired up.

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `title` | _(blank)_ | Card heading (ignored when a header slot is present). |
| `radius` | `small` | `none` \| `small` \| `medium` \| `large` \| `xl` |
| `compact` | `false` | Reduce padding. _(boolean)_ |
| `no-padding` | `false` | Remove padding. _(boolean)_ |
| `has-shadow` | `true` | Drop shadow. _(boolean)_ |
| `has-hover` | `false` | Extra shadow on hover. _(boolean)_ |
| `url` | _(blank)_ | Navigate on click (path, `fn()` call, or full URL). |

**Slots:** default (body), `header`, `footer`. When a `header` slot is set, the body
padding is removed.

> Not (yet) ported from BladewindUI: the dedicated Contact Card variant — compose
> [`<loomi-avatar>`](../avatar) inside a compact `<loomi-card>` instead, as shown above.

## Full Example

```html
<loomi-card
  title="Recent updates"
  has-shadow
  has-hover="false"
  no-padding
  radius="large"
  url="/user"
>
  <div slot="header">...</div>
  ...
  <div slot="footer">...</div>
</loomi-card>
```

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-card>` is a standard custom element, so the browser can use it in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/card` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomi/card lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomi/card build
pnpm --filter @loomi/card typecheck
```

### Plain HTML

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomi/card"></script>

<loomi-card title="Billing">
  <p>Your next invoice is due on Friday.</p>
</loomi-card>
```

### Bundlers and single-page apps

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomi/card";
```


### Laravel Blade

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomi/card lit
npm run dev
```

```js
// resources/js/app.js
import "@loomi/card";
```

```blade
<loomi-card title="Billing">
  <p>Your next invoice is due on Friday.</p>
</loomi-card>
```

### React

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import "@loomi/card";

export function LoomiExample() {
  return (
    <loomi-card title="Billing">
      <p>Your next invoice is due on Friday.</p>
    </loomi-card>
  );
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

### Vue

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import "@loomi/card";
</script>

<template>
  <loomi-card title="Billing">
    <p>Your next invoice is due on Friday.</p>
  </loomi-card>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

### Angular

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomi/card";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-card title="Billing">
      <p>Your next invoice is due on Friday.</p>
    </loomi-card>
  `,
})
export class AppComponent {}
```

### Svelte and Astro

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import "@loomi/card";
</script>

<loomi-card title="Billing">
  <p>Your next invoice is due on Friday.</p>
</loomi-card>
```

```astro
---
import "@loomi/card";
---

<loomi-card title="Billing">
  <p>Your next invoice is due on Friday.</p>
</loomi-card>
```

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->
