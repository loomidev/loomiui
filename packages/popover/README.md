# @loomidev/popover

`<loomi-popover>` — a floating rich-content panel opened on click or hover. Unlike a
tooltip, it can contain links, lists, images, or any custom markup — not just a line of
text.

```bash
npm install @loomidev/popover lit
```

```js
import "@loomidev/popover";
```

## Basic Usage

The default trigger is an information-circle icon.

```html
<loomi-popover>
  <p>This is the popover content. You can put <strong>any markup</strong> here.</p>
</loomi-popover>
```

## Trigger Icon

Swap the default trigger for any icon from [`@loomidev/icons`](../icons).

```html
<loomi-popover trigger="question-mark-circle">
  <p>Triggered by a question-mark icon.</p>
</loomi-popover>

<loomi-popover trigger="bell">
  <p>Triggered by a bell icon.</p>
</loomi-popover>

<loomi-popover trigger="ellipsis-vertical">
  <p>Triggered by a vertical ellipsis icon.</p>
</loomi-popover>
```

## Custom Trigger Markup

When an icon isn't enough, use the `trigger` slot to make a button, badge, or avatar
the trigger instead.

```html
<loomi-popover>
  <loomi-button slot="trigger" size="small" type="secondary">Options</loomi-button>
  <ul>
    <li><a href="#">Edit record</a></li>
    <li><a href="#">Duplicate</a></li>
    <li><a href="#">Delete</a></li>
  </ul>
</loomi-popover>
```

## Title

An optional heading, separated from the content by a subtle border.

```html
<loomi-popover title="Account Actions">
  <ul>
    <li><a href="#">Edit profile</a></li>
    <li><a href="#">Change password</a></li>
    <li><a href="#">Sign out</a></li>
  </ul>
</loomi-popover>
```

## Position

```html
<loomi-popover position="top">…</loomi-popover>
<loomi-popover position="bottom">…</loomi-popover>
<loomi-popover position="left">…</loomi-popover>
<loomi-popover position="right">…</loomi-popover>
```

## Trigger Event

Opens on `click` by default; set `trigger-on="mouseover"` to open on hover instead.

```html
<loomi-popover trigger-on="mouseover">
  <p>This popover opens on mouseover.</p>
</loomi-popover>
```

## Width

```html
<loomi-popover width="360" title="Wider popover">
  <p>More room for longer content.</p>
</loomi-popover>
```

## JavaScript API

```js
const popover = document.querySelector("loomi-popover");
popover.show();
popover.hide();
popover.toggle();
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `trigger` | `information-circle` | Trigger icon name (from `@loomidev/icons`). Ignored when the `trigger` slot is used. |
| `trigger-on` | `click` | `click` \| `mouseover` |
| `position` | `bottom` | `top` \| `bottom` \| `left` \| `right` |
| `title` | _(blank)_ | Optional heading above the content. |
| `width` | `280` | Panel width in pixels. |

**Methods:** `show()`, `hide()`, `toggle()`. **Slots:** default (content), `trigger`
(custom trigger).

## Full Example

```html
<loomi-popover trigger="ellipsis-vertical" trigger-on="click" position="bottom" title="User Actions" width="300">
  <ul>
    <li><a href="#">Edit</a></li>
    <li><a href="#">Delete</a></li>
  </ul>
</loomi-popover>
```

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-popover>` is a standard custom element, so the browser can use it in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/popover` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomidev/popover lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/popover build
pnpm --filter @loomidev/popover typecheck
```

### Plain HTML

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/popover"></script>

<loomi-popover title="Customer note" trigger-on="click">
  <loomi-button slot="trigger">View note</loomi-button>
  Payment terms were updated last week.
</loomi-popover>
```

### Bundlers and single-page apps

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/popover";
```


### Laravel Blade

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomidev/popover lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/popover";
```

```blade
<loomi-popover title="Customer note" trigger-on="click">
  <loomi-button slot="trigger">View note</loomi-button>
  Payment terms were updated last week.
</loomi-popover>
```

### React

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import "@loomidev/popover";

export function LoomiExample() {
  return (
    <loomi-popover title="Customer note" trigger-on="click">
      <loomi-button slot="trigger">View note</loomi-button>
      Payment terms were updated last week.
    </loomi-popover>
  );
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

### Vue

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import "@loomidev/popover";
</script>

<template>
  <loomi-popover title="Customer note" trigger-on="click">
    <loomi-button slot="trigger">View note</loomi-button>
    Payment terms were updated last week.
  </loomi-popover>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

### Angular

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomidev/popover";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-popover title="Customer note" trigger-on="click">
      <loomi-button slot="trigger">View note</loomi-button>
      Payment terms were updated last week.
    </loomi-popover>
  `,
})
export class AppComponent {}
```

### Svelte and Astro

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import "@loomidev/popover";
</script>

<loomi-popover title="Customer note" trigger-on="click">
  <loomi-button slot="trigger">View note</loomi-button>
  Payment terms were updated last week.
</loomi-popover>
```

```astro
---
import "@loomidev/popover";
---

<loomi-popover title="Customer note" trigger-on="click">
  <loomi-button slot="trigger">View note</loomi-button>
  Payment terms were updated last week.
</loomi-popover>
```

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->
