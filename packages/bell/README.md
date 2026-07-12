# @loomidev/bell

`<loomi-bell>` — a notification bell icon with an optional (optionally animated) status
dot, for telling users where to find notifications and whether they have unread ones.

```bash
npm install @loomidev/bell lit
```

```js
import "@loomidev/bell";
```


## Basic Usage

By default the bell shows its status dot — meaning there's something unread.

```html
<loomi-bell></loomi-bell>
```

## No Dot Indicator

Once everything's read, hide the dot:

```html
<loomi-bell show-dot="false"></loomi-bell>
```

## Animated Dot Indicator

Add a "ping" animation to draw attention to new notifications:

```html
<loomi-bell animate-dot></loomi-bell>
```

## Inverted Bell

By default the bell is designed to sit on a light background. On a dark background, set
`invert` to render it white:

```html
<div style="background:#0f172a; padding: 1rem; display:inline-block">
  <loomi-bell invert></loomi-bell>
</div>
```

## Different Sizes

Two sizes are available; the default is `small`.

```html
<loomi-bell size="small"></loomi-bell>
<loomi-bell size="big"></loomi-bell>
```

## Different Colors

The status dot is `primary`-colored by default. Set `color` to any loomi color.

```html
<loomi-bell color="error" animate-dot></loomi-bell>
<loomi-bell color="success" animate-dot></loomi-bell>
<loomi-bell color="warning" animate-dot></loomi-bell>
<loomi-bell color="success" animate-dot></loomi-bell>
```

## Wrapping It in a Trigger

`<loomi-bell>` doesn't open anything on its own — wire it up to whatever you need.
Pairing it with [`<loomi-dropmenu>`](../dropmenu) gets you a working notifications menu
with no extra JS:

```html
<loomi-dropmenu placement="left">
  <loomi-bell slot="trigger" animate-dot></loomi-bell>
  <loomi-dropmenu-item header>Notifications</loomi-dropmenu-item>
  <loomi-dropmenu-item icon="bell-alert">Michael assigned a task to you</loomi-dropmenu-item>
  <loomi-dropmenu-item icon="check-circle">Your upload finished</loomi-dropmenu-item>
</loomi-dropmenu>
```

Or just listen for clicks yourself if you'd rather build your own panel or navigate to a
notifications page:

```html
<loomi-bell onclick="location.href='/notifications'"></loomi-bell>
```

## Accessibility

loomi-bell is built on semantic markup where the browser gives us the right behavior, and it adds ARIA only where the component has custom interaction. Keyboard users should be able to reach the same controls as pointer users, with visible focus treatment unless you explicitly turn it off on controls that support `show-focus-ring="false"`.

When the component displays status, progress, validation, or temporary feedback, pair it with clear labels or nearby text in your app so assistive technology users get the same context a sighted user gets from the visual treatment.

- Supports keyboard focus with visible `:focus-visible` styling on interactive controls.

## Responsive behavior

loomi-bell is designed to fit the layout you place it in. It uses fluid widths, `min-width: 0`, wrapping, truncation, or stacked layouts where that keeps the component usable in cards, forms, sidebars, and mobile screens.

For dense layouts, give the parent container an intentional width and let the component fill it. For long labels or user-provided content, prefer real text that can wrap or truncate instead of fixed pixel assumptions.


## Dark mode

loomi-bell uses Loomi semantic tokens such as `--loomi-surface`, `--loomi-surface-border`, `--loomi-text`, and palette accent tokens instead of hard-coded light colors. Borders, panels, hover states, and muted text are expected to shift with the active theme.

Add `.dark` to your app root with `@loomidev/theme-switcher`, or provide your own token overrides, and the component will inherit the dark-mode values through its shadow DOM.

- Respects `.dark` on `<html>` via `@loomidev/theme-switcher` or your app theme.

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `color` | `primary` | Status dot color. Any loomi color. |
| `size` | `small` | `small` \| `big` |
| `show-dot` | `true` | Show the status dot. _(boolean)_ |
| `animate-dot` | `false` | Ping animation on the dot. _(boolean)_ |
| `invert` | `false` | Render white, for dark backgrounds. _(boolean)_ |

## Full Example

```html
<loomi-bell color="error" show-dot="false" animate-dot size="big"></loomi-bell>
```

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-bell>` is a standard custom element, so the browser can use it in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/bell` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomidev/bell lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/bell build
pnpm --filter @loomidev/bell typecheck
```

### Choose your framework

<loomi-tabs>
<loomi-tab label="HTML" active>

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/bell"></script>

<loomi-bell show-dot animate-dot aria-label="Unread notifications"></loomi-bell>
```

</loomi-tab>
<loomi-tab label="Bundlers and SPAs">

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/bell";
```

</loomi-tab>
<loomi-tab label="Blade">

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomidev/bell lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/bell";
```

```blade
<loomi-bell show-dot animate-dot aria-label="Unread notifications"></loomi-bell>
```

</loomi-tab>
<loomi-tab label="React">

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import "@loomidev/bell";

export function LoomiExample() {
  return (
    <loomi-bell show-dot animate-dot aria-label="Unread notifications"></loomi-bell>
  );
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

</loomi-tab>
<loomi-tab label="Vue">

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import "@loomidev/bell";
</script>

<template>
  <loomi-bell show-dot animate-dot aria-label="Unread notifications"></loomi-bell>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

</loomi-tab>
<loomi-tab label="Angular">

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomidev/bell";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-bell show-dot animate-dot aria-label="Unread notifications"></loomi-bell>
  `,
})
export class AppComponent {}
```

</loomi-tab>
<loomi-tab label="Svelte / Astro">

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import "@loomidev/bell";
</script>

<loomi-bell show-dot animate-dot aria-label="Unread notifications"></loomi-bell>
```

```astro
---
import "@loomidev/bell";
---

<loomi-bell show-dot animate-dot aria-label="Unread notifications"></loomi-bell>
```

</loomi-tab>
</loomi-tabs>

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->

## Dependencies

- `@loomidev/core`
- `@loomidev/icons`
