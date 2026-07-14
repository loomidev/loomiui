# @loomidev/processing

`<loomi-processing>` — a process indicator with `processing` (spinner), `success` and
`failed` states. Best used inside a [`<loomi-modal>`](../modal) while an async task runs,
switching `state` (and `title`/`message`) once it resolves.

```bash
npm install @loomidev/processing lit
```

```js
import "@loomidev/processing";
```

## Basic Usage

```html
<loomi-processing title="Uploading…" message="Please wait."></loomi-processing>
```

## States

```html
<loomi-processing state="processing" title="Deleting pending payment"></loomi-processing>
<loomi-processing state="success" title="Done!" message="Pending payment was deleted successfully."></loomi-processing>
<loomi-processing state="failed" title="Failed" message="Pending payment could not be deleted."></loomi-processing>
```

## Color

The spinner color (only relevant in the `processing` state) accepts any loomi color.

```html
<loomi-processing color="success" title="Uploading…"></loomi-processing>
```

## Full Flow Example

A typical pattern shows `<loomi-processing>` inside a modal while an API call runs,
then swaps `state` based on the result.

```html
<loomi-modal name="delete-payment" show-action-buttons="false">
  <loomi-processing id="delete-status" state="processing" title="Deleting pending payment"></loomi-processing>
</loomi-modal>

<script type="module">
  import { showLoomiModal } from "@loomidev/modal";

  async function deletePayment(id) {
    const status = document.getElementById("delete-status");
    status.state = "processing";
    status.title = "Deleting pending payment";
    showLoomiModal("delete-payment");

    try {
      await fetch(`/payments/${id}`, { method: "DELETE" });
      status.state = "success";
      status.title = "Done!";
      status.message = "Pending payment was deleted successfully.";
    } catch {
      status.state = "failed";
      status.title = "Failed";
      status.message = "Pending payment could not be deleted.";
    }
  }
</script>
```

## Accessibility

loomi-processing is built on semantic markup where the browser gives us the right behavior, and it adds ARIA only where the component has custom interaction. Keyboard users should be able to reach the same controls as pointer users, with visible focus treatment unless you explicitly turn it off on controls that support `show-focus-ring="false"`.

When the component displays status, progress, validation, or temporary feedback, pair it with clear labels or nearby text in your app so assistive technology users get the same context a sighted user gets from the visual treatment.

- Supports keyboard focus with visible `:focus-visible` styling on interactive controls.

## Responsive behavior

loomi-processing is designed to fit the layout you place it in. It uses fluid widths, `min-width: 0`, wrapping, truncation, or stacked layouts where that keeps the component usable in cards, forms, sidebars, and mobile screens.

For dense layouts, give the parent container an intentional width and let the component fill it. For long labels or user-provided content, prefer real text that can wrap or truncate instead of fixed pixel assumptions.

## Dark mode

loomi-processing uses Loomi semantic tokens such as `--loomi-surface`, `--loomi-surface-border`, `--loomi-text`, and palette accent tokens instead of hard-coded light colors. Borders, panels, hover states, and muted text are expected to shift with the active theme.

Add `.dark` to your app root with `@loomidev/theme-switcher`, or provide your own token overrides, and the component will inherit the dark-mode values through its shadow DOM.

- Respects `.dark` on `<html>` via `@loomidev/theme-switcher` or your app theme.

## Attributes

| Attribute | Default      | Description                           |
| --------- | ------------ | ------------------------------------- |
| `state`   | `processing` | `processing` \| `success` \| `failed` |
| `title`   | _(blank)_    | Heading text.                         |
| `message` | _(blank)_    | Supporting text.                      |
| `color`   | `primary`    | Spinner color (processing state).     |

## Full Example

```html
<loomi-processing
  id="status"
  state="processing"
  title="Deleting pending payment"
  message="This will only take a moment."
  color="error"
></loomi-processing>
```

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-processing>` is a standard custom element, so the browser can use it in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/processing` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomidev/processing lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/processing build
pnpm --filter @loomidev/processing typecheck
```

### Choose your framework

<loomi-tabs>
<loomi-tab label="HTML" active>

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/processing"></script>

<loomi-processing state="loading" title="Uploading" message="Please wait while the file is saved."></loomi-processing>
```

</loomi-tab>
<loomi-tab label="Bundlers and SPAs">

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/processing";
```

</loomi-tab>
<loomi-tab label="Blade">

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomidev/processing lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/processing";
```

```blade
<loomi-processing state="loading" title="Uploading" message="Please wait while the file is saved."></loomi-processing>
```

</loomi-tab>
<loomi-tab label="React">

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import "@loomidev/processing";

export function LoomiExample() {
  return (
    <loomi-processing state="loading" title="Uploading" message="Please wait while the file is saved."></loomi-processing>
  );
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

</loomi-tab>
<loomi-tab label="Vue">

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import "@loomidev/processing";
</script>

<template>
  <loomi-processing state="loading" title="Uploading" message="Please wait while the file is saved."></loomi-processing>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

</loomi-tab>
<loomi-tab label="Angular">

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomidev/processing";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-processing state="loading" title="Uploading" message="Please wait while the file is saved."></loomi-processing>
  `,
})
export class AppComponent {}
```

</loomi-tab>
<loomi-tab label="Svelte / Astro">

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import "@loomidev/processing";
</script>

<loomi-processing state="loading" title="Uploading" message="Please wait while the file is saved."></loomi-processing>
```

```astro
---
import "@loomidev/processing";
---

<loomi-processing state="loading" title="Uploading" message="Please wait while the file is saved."></loomi-processing>
```

</loomi-tab>
</loomi-tabs>

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->

## Dependencies

- `@loomidev/core`
- `@loomidev/icons`
