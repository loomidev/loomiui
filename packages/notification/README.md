# @loomidev/notification

`<loomi-notification>` — a container for stacked, auto-dismissing toasts. Unlike
[`@loomidev/alert`](../alert), notifications aren't permanently visible — they're triggered
from JavaScript and disappear on their own.

```bash
npm install @loomidev/notification lit
```

```js
import "@loomidev/notification";
```


## Accessibility
- Implements ARIA roles/states for custom interaction surfaces.
- Supports keyboard focus with visible `:focus-visible` styling on interactive controls.

## Responsive behavior
- Fluid width (`width: 100%`, `min-width: 0`) within flex and grid layouts.

## Dark mode
- Uses semantic `--loomi-surface`, `--loomi-surface-border`, and `--loomi-text` tokens where applicable.
- Respects `.dark` on `<html>` via `@loomidev/theme-switcher` or your app theme.
## Basic Usage

Place one `<loomi-notification>` anywhere on the page — ideally once, in a shared
layout, so it's available globally — then trigger toasts from anywhere with
`showLoomiNotification()`.

```html
<loomi-button onclick="showLoomiNotification('Saved', 'Your changes were saved.')">Save</loomi-button>

<loomi-notification></loomi-notification>
```

You don't strictly need to render `<loomi-notification>` yourself first —
`showLoomiNotification()` creates one (positioned `top-right`) automatically if none
exists on the page yet.

## Notification Types

The signature is `showLoomiNotification(title, message, type?, dismissIn?, name?)`.
`type` defaults to `"success"`.

```html
<loomi-button onclick="showLoomiNotification('Delete Successful', 'Your file was deleted.')">Success</loomi-button>
<loomi-button onclick="showLoomiNotification('Delete Failed', 'Could not delete. Try again.', 'error')">Error</loomi-button>
<loomi-button onclick="showLoomiNotification('Low Disk Space', 'You\'ve used 20GB of 25GB.', 'warning')">Warning</loomi-button>
<loomi-button onclick="showLoomiNotification('Invitation Accepted', 'Samuel accepted your invite.', 'info')">Info</loomi-button>

<loomi-notification></loomi-notification>
```

## Multiple Notifications

Trigger as many as you like — they stack, newest on top, each dismissing independently.

```html
<loomi-button onclick="showLoomiNotification('Upload 1 of 3', 'photo-1.jpg uploaded.'); showLoomiNotification('Upload 2 of 3', 'photo-2.jpg uploaded.'); showLoomiNotification('Upload 3 of 3', 'photo-3.jpg uploaded.')">
  Upload 3 Photos
</loomi-button>

<loomi-notification></loomi-notification>
```

## Auto-Dismiss Timing

The fourth argument is seconds before auto-dismiss — default `15`. Pass `0` to make a
notification persist until the user closes it manually.

```html
<loomi-button onclick="showLoomiNotification('Quick tip', 'This disappears fast.', 'info', 3)">Fast (3s)</loomi-button>
<loomi-button onclick="showLoomiNotification('Read this carefully', 'This stays until dismissed.', 'warning', 0)">Until Dismissed</loomi-button>

<loomi-notification></loomi-notification>
```

## Targeting an Existing Notification

Give a notification a `name` (the fifth argument) to re-render it in place instead of
stacking a duplicate — handy for a repeating error you don't want to spam the user with.

```html
<loomi-button onclick="showLoomiNotification('Upload Failed', 'Network error. Retrying… (1/3)', 'error', 0, 'upload-status')">
  Retry 1
</loomi-button>
<!-- click again with the same `name` — updates the existing toast instead of adding a new one -->
<loomi-button onclick="showLoomiNotification('Upload Failed', 'Network error. Retrying… (2/3)', 'error', 0, 'upload-status')">
  Retry 2
</loomi-button>

<loomi-notification></loomi-notification>
```

## Position

```html
<loomi-button onclick="showLoomiNotification('Bottom Right', 'I render from the bottom-right corner.')">Notify</loomi-button>

<loomi-notification position="bottom-right"></loomi-notification>
```

## Full Width

Add `full-width` to span the entire width of the page instead of floating as a corner
card. The banner anchors to the top or bottom edge based on `position` — any `top-*`
value anchors top, any `bottom-*` value anchors bottom.

```html
<loomi-button onclick="showLoomiNotification('Maintenance', 'We\'re deploying in 10 minutes.', 'warning')">Notify</loomi-button>

<loomi-notification position="top-center" full-width></loomi-notification>
```

## Using the Element Directly

If you already have a reference to the `<loomi-notification>` element, its `notify()`
method takes the same data as an object — useful if you're rendering it via a framework
and want to avoid the global-helper pattern:

```js
document.querySelector("loomi-notification").notify({
  title: "Saved",
  message: "Your changes were saved.",
  type: "success",
  dismissIn: 5,
});
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `position` | `top-right` | `top-right` \| `top-center` \| `top-left` \| `bottom-right` \| `bottom-center` \| `bottom-left` |
| `full-width` | `false` | Spans the entire page width, anchored top or bottom per `position`. _(boolean)_ |

**Helper:** `showLoomiNotification(title, message, type?, dismissIn?, name?)`.
**Method:** `notify({ title, message, type, dismissIn, name })`.

## Full Example

```html
<loomi-button
  onclick="showLoomiNotification('Profile Updated', 'Your changes have been saved.', 'success', 8, 'profile-save')"
>
  Save Profile
</loomi-button>

<loomi-notification position="bottom-right"></loomi-notification>
```

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-notification>` is a standard custom element, so the browser can use it in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/notification` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomidev/notification lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/notification build
pnpm --filter @loomidev/notification typecheck
```

### Plain HTML

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/notification"></script>

<loomi-notification position="top-right"></loomi-notification>
```

### Bundlers and single-page apps

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/notification";
```


### Laravel Blade

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomidev/notification lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/notification";
```

```blade
<loomi-notification position="top-right"></loomi-notification>
```

### React

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import "@loomidev/notification";

export function LoomiExample() {
  return (
    <loomi-notification position="top-right"></loomi-notification>
  );
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

### Vue

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import "@loomidev/notification";
</script>

<template>
  <loomi-notification position="top-right"></loomi-notification>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

### Angular

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomidev/notification";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-notification position="top-right"></loomi-notification>
  `,
})
export class AppComponent {}
```

### Svelte and Astro

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import "@loomidev/notification";
</script>

<loomi-notification position="top-right"></loomi-notification>
```

```astro
---
import "@loomidev/notification";
---

<loomi-notification position="top-right"></loomi-notification>
```

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->
