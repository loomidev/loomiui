# @loomidev/timeline

`<loomi-timeline-item>` entries grouped in `<loomi-timeline>` — display events in
chronological order, like an activity feed.

```bash
npm install @loomidev/timeline lit
```

```js
import "@loomidev/timeline";
```

## Basic Usage

```html
<loomi-timeline>
  <loomi-timeline-item date="10 days ago" content="You signed up"></loomi-timeline-item>
  <loomi-timeline-item date="8 days ago" content="Customer rep assigned"></loomi-timeline-item>
  <loomi-timeline-item date="8 days ago" content="Customer rep called"></loomi-timeline-item>
  <loomi-timeline-item content="Account is being reviewed"></loomi-timeline-item>
  <loomi-timeline-item content="Account activated"></loomi-timeline-item>
</loomi-timeline>
```

The trailing connector line is removed from the last item automatically — there's
nothing to set.

## Rich Content

`content` only takes plain text. For HTML — bold text, links, code, etc. — put it in
the default slot instead; it overrides the `content` attribute.

```html
<loomi-timeline>
  <loomi-timeline-item date="10 days ago">
    <strong>You signed up</strong> with email <code>user@example.com</code>
  </loomi-timeline-item>
</loomi-timeline>
```

## Bigger Anchors

```html
<loomi-timeline anchor="big">
  <loomi-timeline-item date="10 days ago" content="You signed up"></loomi-timeline-item>
</loomi-timeline>
```

## Completed State

Filled circles mark a step as done; on a big anchor, a checkmark appears too.

```html
<loomi-timeline anchor="big">
  <loomi-timeline-item completed date="10 days ago" content="You signed up"></loomi-timeline-item>
  <loomi-timeline-item completed date="8 days ago" content="Customer rep assigned"></loomi-timeline-item>
  <loomi-timeline-item content="Account is being reviewed"></loomi-timeline-item>
</loomi-timeline>
```

## Stacked Timelines

`stacked` on the `<loomi-timeline>` wrapper puts dates above content instead of beside
it, and is shared by every child item.

```html
<loomi-timeline stacked>
  <loomi-timeline-item date="just now" content="Database server restarted"></loomi-timeline-item>
  <loomi-timeline-item date="30 minutes ago" content="2 endpoints are failing — check the logs"></loomi-timeline-item>
  <loomi-timeline-item date="Yesterday" content="Data recovery completed with 2 errors"></loomi-timeline-item>
</loomi-timeline>
```

`completed` on the wrapper marks every item as done at once — override a single item by
setting `completed="false"` directly on it.

```html
<loomi-timeline stacked completed anchor="big">
  <loomi-timeline-item date="just now" content="Database server restarted"></loomi-timeline-item>
  <loomi-timeline-item date="Yesterday" content="Data recovery" completed="false"></loomi-timeline-item>
</loomi-timeline>
```

## Anchor Icons and Avatars

Icons and avatars only render when `anchor="big"`.

```html
<loomi-timeline anchor="big" completed>
  <loomi-timeline-item date="10 days ago" content="You signed up" icon="bell-alert"></loomi-timeline-item>
  <loomi-timeline-item date="8 days ago" content="Customer rep assigned" icon="bolt"></loomi-timeline-item>
  <loomi-timeline-item content="Account is being reviewed" icon="key" completed="false"></loomi-timeline-item>
</loomi-timeline>

<loomi-timeline anchor="big">
  <loomi-timeline-item date="10 days ago" content="You signed up" avatar="/avatars/ada.jpg"></loomi-timeline-item>
  <loomi-timeline-item date="8 days ago" content="Customer rep assigned" avatar="/avatars/rep.jpg"></loomi-timeline-item>
</loomi-timeline>
```

## Placement

Set `placement` on the `<loomi-timeline>` wrapper — it's shared by every child item.
Default is `left` (anchor on the left, content to its right).

```html
<loomi-timeline placement="left" anchor="big">
  <loomi-timeline-item date="10 days ago" content="You signed up"></loomi-timeline-item>
  <loomi-timeline-item date="8 days ago" content="Customer rep assigned"></loomi-timeline-item>
</loomi-timeline>
```

`right` mirrors the whole layout — content on the left, anchor on the right:

```html
<loomi-timeline placement="right" anchor="big">
  <loomi-timeline-item date="10 days ago" content="You signed up"></loomi-timeline-item>
  <loomi-timeline-item date="8 days ago" content="Customer rep assigned"></loomi-timeline-item>
</loomi-timeline>
```

`alternate` centers a single spine and alternates each item to its left and right —
which side an item lands on is resolved from its position among its siblings, so
there's nothing to set per item:

```html
<loomi-timeline placement="alternate" anchor="big">
  <loomi-timeline-item date="10 days ago" content="You signed up"></loomi-timeline-item>
  <loomi-timeline-item date="8 days ago" content="Customer rep assigned"></loomi-timeline-item>
  <loomi-timeline-item date="2 days ago" content="Account is being reviewed"></loomi-timeline-item>
  <loomi-timeline-item content="Account activated"></loomi-timeline-item>
</loomi-timeline>
```

## Colors

```html
<loomi-timeline>
  <loomi-timeline-item date="10 days ago" content="You signed up" color="error" completed></loomi-timeline-item>
  <loomi-timeline-item date="8 days ago" content="Customer rep assigned" color="warning"></loomi-timeline-item>
  <loomi-timeline-item content="Account is being reviewed" color="success"></loomi-timeline-item>
</loomi-timeline>
```

## Accessibility

loomi-timeline is built on semantic markup where the browser gives us the right behavior, and it adds ARIA only where the component has custom interaction. Keyboard users should be able to reach the same controls as pointer users, with visible focus treatment unless you explicitly turn it off on controls that support `show-focus-ring="false"`.

When the component displays status, progress, validation, or temporary feedback, pair it with clear labels or nearby text in your app so assistive technology users get the same context a sighted user gets from the visual treatment.

- Supports keyboard focus with visible `:focus-visible` styling on interactive controls.

## Responsive behavior

loomi-timeline is designed to fit the layout you place it in. It uses fluid widths, `min-width: 0`, wrapping, truncation, or stacked layouts where that keeps the component usable in cards, forms, sidebars, and mobile screens.

For dense layouts, give the parent container an intentional width and let the component fill it. For long labels or user-provided content, prefer real text that can wrap or truncate instead of fixed pixel assumptions.

## Dark mode

loomi-timeline uses Loomi semantic tokens such as `--loomi-surface`, `--loomi-surface-border`, `--loomi-text`, and palette accent tokens instead of hard-coded light colors. Borders, panels, hover states, and muted text are expected to shift with the active theme.

Add `.dark` to your app root with `@loomidev/theme-switcher`, or provide your own token overrides, and the component will inherit the dark-mode values through its shadow DOM.

- Respects `.dark` on `<html>` via `@loomidev/theme-switcher` or your app theme.

## Attributes

### `<loomi-timeline-item>`

| Attribute   | Default   | Description                                                                                                  |
| ----------- | --------- | ------------------------------------------------------------------------------------------------------------ |
| `date`      | _(blank)_ | Date string.                                                                                                 |
| `content`   | _(blank)_ | Entry text (or use the default slot).                                                                        |
| `completed` | `false`   | Filled anchor (+ check when `anchor="big"`). _(boolean)_                                                     |
| `anchor`    | `small`   | `small` \| `big` (big enables icons/avatars).                                                                |
| `icon`      | _(blank)_ | Anchor icon name (big anchor).                                                                               |
| `avatar`    | _(blank)_ | Anchor image URL (big anchor).                                                                               |
| `stacked`   | `false`   | Date above content vs. in a left column. _(boolean)_                                                         |
| `placement` | `left`    | `left` \| `right` \| `alternate` — set on the `<loomi-timeline>` wrapper instead; it applies to every child. |
| `color`     | `primary` | Any loomi color.                                                                                             |

The trailing connector line and `alternate` left/right placement are both resolved
automatically from the item's position among its siblings — there is no `last` or
per-item side attribute to set.

### `<loomi-timeline>` (wrapper)

Shares `stacked`, `completed`, `anchor`, `icon`, `color`, and `placement` with all
children.

## Full Example

```html
<loomi-timeline stacked anchor="big" color="error" placement="alternate" completed>
  <loomi-timeline-item
    date="9 days ago"
    avatar="/avatars/me.jpg"
    content="I am a timeline"
    completed
  ></loomi-timeline-item>
  <loomi-timeline-item date="2 days ago" content="Still going" completed="false"></loomi-timeline-item>
</loomi-timeline>
```

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-timeline-item>` and `<loomi-timeline>` are standard custom elements, so the browser can use them in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/timeline` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomidev/timeline lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/timeline build
pnpm --filter @loomidev/timeline typecheck
```

### Choose your framework

<loomi-tabs>
<loomi-tab label="HTML" active>

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/timeline"></script>

<loomi-timeline>
  <loomi-timeline-item date="09:00" completed>Order placed</loomi-timeline-item>
  <loomi-timeline-item date="10:30">Payment confirmed</loomi-timeline-item>
</loomi-timeline>
```

</loomi-tab>
<loomi-tab label="Bundlers and SPAs">

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/timeline";
```

</loomi-tab>
<loomi-tab label="Blade">

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomidev/timeline lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/timeline";
```

```blade
<loomi-timeline>
  <loomi-timeline-item date="09:00" completed>Order placed</loomi-timeline-item>
  <loomi-timeline-item date="10:30">Payment confirmed</loomi-timeline-item>
</loomi-timeline>
```

</loomi-tab>
<loomi-tab label="React">

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import "@loomidev/timeline";

export function LoomiExample() {
  return (
    <loomi-timeline>
      <loomi-timeline-item date="09:00" completed>Order placed</loomi-timeline-item>
      <loomi-timeline-item date="10:30">Payment confirmed</loomi-timeline-item>
    </loomi-timeline>
  );
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

</loomi-tab>
<loomi-tab label="Vue">

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import "@loomidev/timeline";
</script>

<template>
  <loomi-timeline>
    <loomi-timeline-item date="09:00" completed>Order placed</loomi-timeline-item>
    <loomi-timeline-item date="10:30">Payment confirmed</loomi-timeline-item>
  </loomi-timeline>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

</loomi-tab>
<loomi-tab label="Angular">

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomidev/timeline";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-timeline>
      <loomi-timeline-item date="09:00" completed>Order placed</loomi-timeline-item>
      <loomi-timeline-item date="10:30">Payment confirmed</loomi-timeline-item>
    </loomi-timeline>
  `,
})
export class AppComponent {}
```

</loomi-tab>
<loomi-tab label="Svelte / Astro">

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import "@loomidev/timeline";
</script>

<loomi-timeline>
  <loomi-timeline-item date="09:00" completed>Order placed</loomi-timeline-item>
  <loomi-timeline-item date="10:30">Payment confirmed</loomi-timeline-item>
</loomi-timeline>
```

```astro
---
import "@loomidev/timeline";
---

<loomi-timeline>
  <loomi-timeline-item date="09:00" completed>Order placed</loomi-timeline-item>
  <loomi-timeline-item date="10:30">Payment confirmed</loomi-timeline-item>
</loomi-timeline>
```

</loomi-tab>
</loomi-tabs>

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->

## Dependencies

- `@loomidev/core`
- `@loomidev/icons`
