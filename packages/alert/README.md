# @loomidev/alert

`<loomi-alert>` — an inline alert message. Four prebuilt types with default icons,
`faint`/`dark` shades, palette overrides, an optional avatar, and a dismiss button.
For floating/overlay alerts instead, see [`@loomidev/notification`](../notification).

```bash
npm install @loomidev/alert lit
```

```js
import "@loomidev/alert";
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

Four prebuilt types, each with its own default icon and color:

```html
<loomi-alert>Your subscription is expiring in 19 days. <a href="#">Renew now</a></loomi-alert>
<loomi-alert type="error">You do not have permission to upload files.</loomi-alert>
<loomi-alert type="warning">Well, this is your first warning.</loomi-alert>
<loomi-alert type="success">Files were successfully uploaded.</loomi-alert>
```

## Shades

Set `shade="dark"` for a solid-fill variant instead of the default tinted `faint`
background.

```html
<loomi-alert shade="dark">Your subscription is expiring in 19 days.</loomi-alert>
<loomi-alert type="error" shade="dark">You do not have permission to upload files.</loomi-alert>
```

## Hiding Icons

The type icon and the dismiss (×) icon can each be hidden independently.

```html
<!-- hide the dismiss icon only -->
<loomi-alert show-close-icon="false">Message here.</loomi-alert>

<!-- hide the type icon only -->
<loomi-alert show-icon="false">Message here.</loomi-alert>

<!-- hide both -->
<loomi-alert show-icon="false" show-close-icon="false">Message here.</loomi-alert>
```

## Custom Colors

`color` overrides the type's default palette — any loomi color, on either shade, plus a
`transparent` background for a borderless, no-fill look.

```html
<loomi-alert color="pink">I am a pink alert.</loomi-alert>
<loomi-alert color="pink" shade="dark">I am a pink alert. Dark version.</loomi-alert>
<loomi-alert color="cyan">I am a cyan alert.</loomi-alert>
<loomi-alert color="purple">I am a violet alert.</loomi-alert>
<loomi-alert color="transparent">I am a transparent alert.</loomi-alert>
```

## Custom Icons

The four prebuilt types already have default icons (`information-circle`, `x-circle`,
`exclamation-triangle`, `check-circle`). Set `icon` to use a different one from the
shared [`@loomidev/icons`](../icons) registry — most useful together with a custom `color`.

```html
<loomi-alert color="blue" icon="bell-alert">No more snoozing. Wake up!</loomi-alert>
<loomi-alert color="blue" shade="dark" icon="key">Your subscription is expiring soon.</loomi-alert>
```

## Avatars

Use an image as the prefix instead of an icon by setting `avatar` to an image URL.

```html
<loomi-alert color="purple" shade="dark" avatar="/images/jane.jpg">
  Jane has been added to your friends list.
</loomi-alert>

<!-- with a ring -->
<loomi-alert color="cyan" shade="dark" avatar="/images/jane.jpg" show-ring>
  <strong>New friend request</strong><br />
  Jane C. Doe wants to connect.
</loomi-alert>
```

## Dismissing

Clicking the close icon removes the alert from the DOM. Listen for `close` (and call
`event.preventDefault()`) if you need to intercept the dismiss — e.g. to persist that
the user has seen it before letting the element disappear.

```js
document.querySelector("loomi-alert").addEventListener("close", (e) => {
  // e.preventDefault() to stop it from removing itself
  console.log("dismissed");
});
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `type` | `info` | `info` \| `error` \| `warning` \| `success` |
| `shade` | `faint` | `faint` \| `dark` |
| `color` | _(blank)_ | Override color — any loomi color, or `transparent`. |
| `icon` | _(blank)_ | Icon name override (see [`@loomidev/icons`](../icons)). |
| `avatar` | _(blank)_ | Image URL shown instead of the icon. |
| `show-icon` | `true` | Show the type icon. _(boolean)_ |
| `show-close-icon` | `true` | Show the dismiss button. _(boolean)_ |
| `show-ring` | `false` | Ring around the avatar. _(boolean)_ |

**Slot:** default (message, may contain HTML). **Event:** `close` (cancelable).

## Full Example

```html
<loomi-alert
  type="warning"
  shade="dark"
  color="pink"
  icon="key"
  show-close-icon="true"
>
  Stay safe. Wash your hands for 20 seconds.
</loomi-alert>
```

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-alert>` is a standard custom element, so the browser can use it in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/alert` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomidev/alert lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/alert build
pnpm --filter @loomidev/alert typecheck
```

### Plain HTML

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/alert"></script>

<loomi-alert type="success" show-close-icon>Settings saved.</loomi-alert>
```

### Bundlers and single-page apps

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/alert";
```


### Laravel Blade

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomidev/alert lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/alert";
```

```blade
<loomi-alert type="success" show-close-icon>Settings saved.</loomi-alert>
```

### React

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import "@loomidev/alert";

export function LoomiExample() {
  return (
    <loomi-alert type="success" show-close-icon>Settings saved.</loomi-alert>
  );
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

### Vue

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import "@loomidev/alert";
</script>

<template>
  <loomi-alert type="success" show-close-icon>Settings saved.</loomi-alert>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

### Angular

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomidev/alert";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-alert type="success" show-close-icon>Settings saved.</loomi-alert>
  `,
})
export class AppComponent {}
```

### Svelte and Astro

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import "@loomidev/alert";
</script>

<loomi-alert type="success" show-close-icon>Settings saved.</loomi-alert>
```

```astro
---
import "@loomidev/alert";
---

<loomi-alert type="success" show-close-icon>Settings saved.</loomi-alert>
```

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->
