# @loomidev/tooltip

`<loomi-tooltip>` — shows a short tooltip on hover/focus of its trigger content.

```bash
npm install @loomidev/tooltip lit
```

```js
import "@loomidev/tooltip";
```

## Basic Usage

Wrap whatever should trigger the tooltip in the default slot, and set `content` for
simple text.

```html
<loomi-tooltip content="Helpful hint">
  <loomi-button>Hover me</loomi-button>
</loomi-tooltip>
```

## Positioning

```html
<loomi-tooltip content="Above" position="top"><loomi-icon name="information-circle"></loomi-icon></loomi-tooltip>
<loomi-tooltip content="Below" position="bottom"><loomi-icon name="information-circle"></loomi-icon></loomi-tooltip>
<loomi-tooltip content="To the left" position="left"><loomi-icon name="information-circle"></loomi-icon></loomi-tooltip>
<loomi-tooltip content="To the right" position="right"><loomi-icon name="information-circle"></loomi-icon></loomi-tooltip>
```

## Rich Content

For more than a line of text, use the `content` slot instead of the `content` attribute
— it accepts arbitrary HTML.

```html
<loomi-tooltip position="right">
  <span slot="content">Rich <b>HTML</b> content, with a <a href="/docs">link</a></span>
  <loomi-icon name="information-circle"></loomi-icon>
</loomi-tooltip>
```

## On Icons, Buttons, or Any Element

The trigger can be anything — an icon, a button, plain text, an avatar.

```html
<loomi-tooltip content="3 unread notifications">
  <loomi-bell animate-dot></loomi-bell>
</loomi-tooltip>

<loomi-tooltip content="Delete this item">
  <loomi-button type="danger" size="small">Delete</loomi-button>
</loomi-tooltip>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `content` | _(blank)_ | Tooltip text (or use the `content` slot). |
| `position` | `top` | `top` \| `bottom` \| `left` \| `right` |

**Slots:** default (trigger), `content` (rich tooltip body).

## Full Example

```html
<loomi-tooltip position="right">
  <span slot="content">Your subscription renews on <b>July 1</b>.</span>
  <loomi-tag label="Pro plan" color="violet"></loomi-tag>
</loomi-tooltip>
```

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-tooltip>` is a standard custom element, so the browser can use it in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/tooltip` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomidev/tooltip lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/tooltip build
pnpm --filter @loomidev/tooltip typecheck
```

### Plain HTML

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/tooltip"></script>

<loomi-tooltip content="Only admins can change this setting">
  <loomi-button>Permissions</loomi-button>
</loomi-tooltip>
```

### Bundlers and single-page apps

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/tooltip";
```


### Laravel Blade

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomidev/tooltip lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/tooltip";
```

```blade
<loomi-tooltip content="Only admins can change this setting">
  <loomi-button>Permissions</loomi-button>
</loomi-tooltip>
```

### React

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import "@loomidev/tooltip";

export function LoomiExample() {
  return (
    <loomi-tooltip content="Only admins can change this setting">
      <loomi-button>Permissions</loomi-button>
    </loomi-tooltip>
  );
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

### Vue

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import "@loomidev/tooltip";
</script>

<template>
  <loomi-tooltip content="Only admins can change this setting">
    <loomi-button>Permissions</loomi-button>
  </loomi-tooltip>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

### Angular

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomidev/tooltip";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-tooltip content="Only admins can change this setting">
      <loomi-button>Permissions</loomi-button>
    </loomi-tooltip>
  `,
})
export class AppComponent {}
```

### Svelte and Astro

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import "@loomidev/tooltip";
</script>

<loomi-tooltip content="Only admins can change this setting">
  <loomi-button>Permissions</loomi-button>
</loomi-tooltip>
```

```astro
---
import "@loomidev/tooltip";
---

<loomi-tooltip content="Only admins can change this setting">
  <loomi-button>Permissions</loomi-button>
</loomi-tooltip>
```

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->
