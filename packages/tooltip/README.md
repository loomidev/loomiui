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

## Placement

```html
<loomi-tooltip content="Above" placement="top"><loomi-icon name="information-circle"></loomi-icon></loomi-tooltip>
<loomi-tooltip content="Below" placement="bottom"><loomi-icon name="information-circle"></loomi-icon></loomi-tooltip>
<loomi-tooltip content="To the left" placement="left"><loomi-icon name="information-circle"></loomi-icon></loomi-tooltip>
<loomi-tooltip content="To the right" placement="right"><loomi-icon name="information-circle"></loomi-icon></loomi-tooltip>
```

## Shade

Tooltips default to the dark shade. Use `shade="light"` for a white tooltip with dark
text.

```html
<loomi-tooltip content="Light tooltip" shade="light">
  <loomi-button type="secondary">Hover me</loomi-button>
</loomi-tooltip>
```

## Rich Content

For more than a line of text, use the `content` slot instead of the `content` attribute
— it accepts arbitrary HTML.

```html
<loomi-tooltip placement="right">
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

## Accessibility

loomi-tooltip is built on semantic markup where the browser gives us the right behavior, and it adds ARIA only where the component has custom interaction. Keyboard users should be able to reach the same controls as pointer users, with visible focus treatment unless you explicitly turn it off on controls that support `show-focus-ring="false"`.

When the component displays status, progress, validation, or temporary feedback, pair it with clear labels or nearby text in your app so assistive technology users get the same context a sighted user gets from the visual treatment.

- Supports keyboard focus with visible `:focus-visible` styling on interactive controls.

## Responsive behavior

loomi-tooltip is designed to fit the layout you place it in. It uses fluid widths, `min-width: 0`, wrapping, truncation, or stacked layouts where that keeps the component usable in cards, forms, sidebars, and mobile screens.

For dense layouts, give the parent container an intentional width and let the component fill it. For long labels or user-provided content, prefer real text that can wrap or truncate instead of fixed pixel assumptions.


## Dark mode

loomi-tooltip uses Loomi semantic tokens such as `--loomi-surface`, `--loomi-surface-border`, `--loomi-text`, and palette accent tokens instead of hard-coded light colors. Borders, panels, hover states, and muted text are expected to shift with the active theme.

Add `.dark` to your app root with `@loomidev/theme-switcher`, or provide your own token overrides, and the component will inherit the dark-mode values through its shadow DOM.

- `shade="light"` uses raised surface, border, and text tokens.

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `content` | _(blank)_ | Tooltip text (or use the `content` slot). |
| `placement` | `top` | `top` \| `bottom` \| `left` \| `right` |
| `shade` | `dark` | `dark` \| `light` |

**Slots:** default (trigger), `content` (rich tooltip body).

## Full Example

```html
<loomi-tooltip placement="right">
  <span slot="content">Your subscription renews on <b>July 1</b>.</span>
  <loomi-tag label="Pro plan" color="success"></loomi-tag>
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

### Choose your framework

<loomi-tabs>
<loomi-tab label="HTML" active>

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

</loomi-tab>
<loomi-tab label="Bundlers and SPAs">

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/tooltip";
```

</loomi-tab>
<loomi-tab label="Blade">

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

</loomi-tab>
<loomi-tab label="React">

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

</loomi-tab>
<loomi-tab label="Vue">

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

</loomi-tab>
<loomi-tab label="Angular">

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

</loomi-tab>
<loomi-tab label="Svelte / Astro">

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

</loomi-tab>
</loomi-tabs>

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->

## Dependencies

- `@loomidev/core`
