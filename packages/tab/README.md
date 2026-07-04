# @loomidev/tab

`<loomi-tabs>` builds a heading bar from its `<loomi-tab>` children and toggles which
panel is visible. There is no separate heading/body/content wiring to keep in sync — each `<loomi-tab>` carries its own
heading (`label`/`icon`) **and** its own panel content together, so there's nothing to
name-match by hand.

```bash
npm install @loomidev/tab lit
```

```js
import "@loomidev/tab";
```


## Basic Usage

Wrap any number of `<loomi-tab>` elements in a `<loomi-tabs>`. The tab marked `active`
is selected by default — it doesn't have to be the first one. If none is marked
`active`, the first non-disabled tab is selected automatically.

```html
<loomi-tabs>
  <loomi-tab label="Profile" active>
    <h3>Account profile</h3>
    <p>Update the public name, team role, and contact email shown across the workspace.</p>
    <loomi-button size="small">Save profile</loomi-button>
  </loomi-tab>
  <loomi-tab label="Security">
    <h3>Security</h3>
    <p>Require two-step verification and review the devices that are currently signed in.</p>
    <loomi-button size="small" type="secondary">Manage devices</loomi-button>
  </loomi-tab>
  <loomi-tab label="Notifications">
    <h3>Notifications</h3>
    <p>Choose which product updates, approvals, and billing alerts should send email.</p>
    <loomi-toggle label="Weekly summary" checked></loomi-toggle>
  </loomi-tab>
</loomi-tabs>
```

Listen for `tab-change` on `<loomi-tabs>` if you need to react to the switch (e.g. lazy-
loading a panel's data):

```js
document.querySelector("loomi-tabs").addEventListener("tab-change", (e) => {
  console.log(e.detail.label); // the newly active tab's label
});
```

## Different Colors

The active tab's underline (or background, depending on style — see below) uses the
default. Set `color` on `<loomi-tabs>` to pick a different one; it applies to every
child tab.

```html
<loomi-tabs color="error">
  <loomi-tab label="Red Tab" active>…</loomi-tab>
  <loomi-tab label="The Other Tab">…</loomi-tab>
</loomi-tabs>

<loomi-tabs color="success">
  <loomi-tab label="Green Tab" active>…</loomi-tab>
  <loomi-tab label="The Other Tab">…</loomi-tab>
</loomi-tabs>
```

Common semantic colors: `primary` `secondary` `success` `error` `warning` `gray`.

## Other Tab Styles

`<loomi-tabs>` comes in three styles, set via `tab-style`. The default is `simple` (an
underlined heading row, as in every example above).

### System Tab Style

A segmented-control look — the active tab gets a raised pill inside a tinted track.

```html
<loomi-tabs tab-style="system">
  <loomi-tab label="Monthly" active>…</loomi-tab>
  <loomi-tab label="Yearly">…</loomi-tab>
</loomi-tabs>
```

### Pills Tab Style

Each tab is its own independent pill; the active one fills with `color`.

```html
<loomi-tabs tab-style="pills" color="success">
  <loomi-tab label="All" active>24 open conversations</loomi-tab>
  <loomi-tab label="Unread">5 conversations need a reply</loomi-tab>
  <loomi-tab label="Archived">128 resolved conversations</loomi-tab>
</loomi-tabs>
```

## With Icons

Set `icon` on a `<loomi-tab>` to prefix its heading with an icon from the shared
[`@loomidev/icons`](../icons) registry. Works in any of the three styles.

```html
<loomi-tabs>
  <loomi-tab label="Overview" icon="information-circle" active>…</loomi-tab>
  <loomi-tab label="Activity" icon="bell-alert">…</loomi-tab>
  <loomi-tab label="Security" icon="lock-closed">…</loomi-tab>
</loomi-tabs>
```

Need an icon that isn't built in? Register your own — no need to fork the registry:

```js
import { registerLoomiIcon } from "@loomidev/icons";
import { svg } from "lit";

registerLoomiIcon("rocket", svg`<path d="…" />`);
```

```html
<loomi-tab label="Launches" icon="rocket">…</loomi-tab>
```

## Disabled Tabs & Tabs That Navigate

Set `disabled` to fade out a tab and ignore clicks on it (and skip it during
keyboard navigation — see below):

```html
<loomi-tabs>
  <loomi-tab label="Available" active>…</loomi-tab>
  <loomi-tab label="Coming Soon" disabled>…</loomi-tab>
</loomi-tabs>
```

Set `url` instead of relying on the built-in panel switching to make a tab behave like a
plain link — clicking it navigates via `location.href` rather than showing a panel:

```html
<loomi-tabs>
  <loomi-tab label="Dashboard" active>…</loomi-tab>
  <loomi-tab label="Full Settings →" url="/settings"></loomi-tab>
</loomi-tabs>
```

## Keyboard Navigation

`<loomi-tabs>` implements the [WAI-ARIA APG "tabs" pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
out of the box: once a tab heading has focus, <kbd>←</kbd>/<kbd>→</kbd> (or
<kbd>↑</kbd>/<kbd>↓</kbd>) move between tabs and switch the active panel immediately
(automatic activation), and <kbd>Home</kbd>/<kbd>End</kbd> jump to the first/last
enabled tab. Disabled tabs are skipped. No setup required — this works the same in
every style.

## Accessibility

loomi-tabs is built on semantic markup where the browser gives us the right behavior, and it adds ARIA only where the component has custom interaction. Keyboard users should be able to reach the same controls as pointer users, with visible focus treatment unless you explicitly turn it off on controls that support `show-focus-ring="false"`.

When the component displays status, progress, validation, or temporary feedback, pair it with clear labels or nearby text in your app so assistive technology users get the same context a sighted user gets from the visual treatment.

- See APG link in README.

## Responsive behavior

loomi-tabs is designed to fit the layout you place it in. It uses fluid widths, `min-width: 0`, wrapping, truncation, or stacked layouts where that keeps the component usable in cards, forms, sidebars, and mobile screens.

For dense layouts, give the parent container an intentional width and let the component fill it. For long labels or user-provided content, prefer real text that can wrap or truncate instead of fixed pixel assumptions.


## Dark mode

loomi-tabs uses Loomi semantic tokens such as `--loomi-surface`, `--loomi-surface-border`, `--loomi-text`, and palette accent tokens instead of hard-coded light colors. Borders, panels, hover states, and muted text are expected to shift with the active theme.

Add `.dark` to your app root with `@loomidev/theme-switcher`, or provide your own token overrides, and the component will inherit the dark-mode values through its shadow DOM.


## Attributes

### `<loomi-tabs>`

| Attribute | Default | Description |
| --- | --- | --- |
| `color` | primary | Active-tab color. Any loomi color. |
| `tab-style` | simple | `simple` \| `system` \| `pills` |

### `<loomi-tab>`

| Attribute | Default | Description |
| --- | --- | --- |
| `label` | _(blank)_ | Heading text. |
| `icon` | _(blank)_ | Heading icon name (see [`@loomidev/icons`](../icons)). |
| `active` | `false` | Selected by default. _(boolean)_ |
| `disabled` | `false` | Disabled tab — faded out, ignores clicks and keyboard focus. _(boolean)_ |
| `url` | _(blank)_ | Navigate to this URL instead of switching panels. |

**Event:** `tab-change` (`detail: { label }`), fired on `<loomi-tabs>` when the active
tab changes by click or keyboard.

## Full Example

```html
<loomi-tabs color="success" tab-style="pills">
  <loomi-tab label="Overview" icon="information-circle" active>
    <p>Revenue is up 12% this month and all scheduled payouts have cleared.</p>
  </loomi-tab>
  <loomi-tab label="Activity" icon="bell-alert">
    <p>Three payment disputes need a response before Friday.</p>
  </loomi-tab>
  <loomi-tab label="Archived" disabled>
    <p>Nothing archived yet.</p>
  </loomi-tab>
  <loomi-tab label="Full report →" url="/reports/full"></loomi-tab>
</loomi-tabs>
```

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-tab>` and `<loomi-tabs>` are standard custom elements, so the browser can use them in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/tab` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomidev/tab lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/tab build
pnpm --filter @loomidev/tab typecheck
```

### Choose your framework

<loomi-tabs>
<loomi-tab label="Plain HTML" active>

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/tab"></script>

<loomi-tabs>
  <loomi-tab label="Overview" active>Account summary</loomi-tab>
  <loomi-tab label="Invoices">Recent invoices</loomi-tab>
</loomi-tabs>
```

</loomi-tab>
<loomi-tab label="Bundlers and SPAs">

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/tab";
```

</loomi-tab>
<loomi-tab label="Laravel Blade">

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomidev/tab lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/tab";
```

```blade
<loomi-tabs>
  <loomi-tab label="Overview" active>Account summary</loomi-tab>
  <loomi-tab label="Invoices">Recent invoices</loomi-tab>
</loomi-tabs>
```

</loomi-tab>
<loomi-tab label="React">

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import "@loomidev/tab";

export function LoomiExample() {
  return (
    <loomi-tabs>
      <loomi-tab label="Overview" active>Account summary</loomi-tab>
      <loomi-tab label="Invoices">Recent invoices</loomi-tab>
    </loomi-tabs>
  );
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

</loomi-tab>
<loomi-tab label="Vue">

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import "@loomidev/tab";
</script>

<template>
  <loomi-tabs>
    <loomi-tab label="Overview" active>Account summary</loomi-tab>
    <loomi-tab label="Invoices">Recent invoices</loomi-tab>
  </loomi-tabs>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

</loomi-tab>
<loomi-tab label="Angular">

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomidev/tab";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-tabs>
      <loomi-tab label="Overview" active>Account summary</loomi-tab>
      <loomi-tab label="Invoices">Recent invoices</loomi-tab>
    </loomi-tabs>
  `,
})
export class AppComponent {}
```

</loomi-tab>
<loomi-tab label="Svelte and Astro">

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import "@loomidev/tab";
</script>

<loomi-tabs>
  <loomi-tab label="Overview" active>Account summary</loomi-tab>
  <loomi-tab label="Invoices">Recent invoices</loomi-tab>
</loomi-tabs>
```

```astro
---
import "@loomidev/tab";
---

<loomi-tabs>
  <loomi-tab label="Overview" active>Account summary</loomi-tab>
  <loomi-tab label="Invoices">Recent invoices</loomi-tab>
</loomi-tabs>
```

</loomi-tab>
</loomi-tabs>

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->

## Dependencies

- `@loomidev/core`
- `@loomidev/icons`
