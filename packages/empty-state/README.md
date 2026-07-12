# @loomidev/empty-state

`<loomi-empty-state>` — a friendly placeholder for empty content, so users see a helpful
message instead of a boring blank page. Comes with a built-in illustration, but is
intentionally minimal so different apps can shape it to their needs.

```bash
npm install @loomidev/empty-state lit
```

```js
import "@loomidev/empty-state";
```


## Basic Usage

```html
<loomi-empty-state
  message="Awesome! You have no documents to approve."
  button-label="Go to Dashboard"
></loomi-empty-state>
```

## Custom Image

```html
<loomi-empty-state
  message="You haven't saved any gists yet."
  image="/illustrations/no-code.svg"
  button-label="Create Gist"
></loomi-empty-state>
```

## With a Heading

```html
<loomi-empty-state
  heading="Create gists already"
  message="You haven't saved any gists yet."
  image="/illustrations/no-code.svg"
  button-label="Create Gist"
></loomi-empty-state>
```

## Reacting to the Action Button

```js
document.querySelector("loomi-empty-state").addEventListener("action", () => {
  router.push("/gists/new");
});
```

## Without a Call to Action

Omit `button-label` to show a message with no action button — appropriate when there's
nothing for the user to actively do yet.

```html
<loomi-card title="Recent Activity">
  <loomi-empty-state
    image="/illustrations/no-activity.svg"
    message="Your recent activity will show up here once your team gets moving."
  ></loomi-empty-state>
</loomi-card>
```

## Custom Content (No Illustration)

Set `show-image="false"` to take full control via the default slot instead of the
built-in image/heading/message/button layout.

```html
<loomi-empty-state show-image="false">
  <loomi-icon name="finger-print" style="width: 3rem; height: 3rem"></loomi-icon>
  <p>You have no biometric data available</p>
  <loomi-button color="error" size="small">Add biometric info</loomi-button>
</loomi-empty-state>
```

## Image Sizes

```html
<loomi-empty-state message="Small" image-size="small"></loomi-empty-state>
<loomi-empty-state message="Large" image-size="large"></loomi-empty-state>
<loomi-empty-state message="Extra large" image-size="xl"></loomi-empty-state>
```

## Using It Inside `<loomi-select>` and `<loomi-table>`

[`<loomi-select>`](../select) and [`<loomi-table>`](../table) currently render their own
plain-text empty states rather than a full `<loomi-empty-state>` — see those packages'
READMEs for their respective `empty-placeholder` / `no-data-message` attributes. Use
`<loomi-empty-state>` directly wherever you need the richer illustration + CTA version.

## Replacing the Built-in Illustration

The default illustration (shown whenever `image` is left blank) is a PNG bundled with
the package and inlined as a data URI at build time, so it works the same whether the
package is loaded from npm, a bundler, or a CDN — no extra network request and no
asset-path resolution for consumers to configure.

If you're contributing to LoomiUI itself and want to change it, replace
`src/assets/default-image.png` with a same-named PNG and rebuild:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/empty-state build
```

`scripts/build-assets.mjs` re-encodes whatever PNG is at that path into
`src/generated/default-image.ts` on every build — no code changes needed.

## Accessibility

loomi-empty-state is built on semantic markup where the browser gives us the right behavior, and it adds ARIA only where the component has custom interaction. Keyboard users should be able to reach the same controls as pointer users, with visible focus treatment unless you explicitly turn it off on controls that support `show-focus-ring="false"`.

When the component displays status, progress, validation, or temporary feedback, pair it with clear labels or nearby text in your app so assistive technology users get the same context a sighted user gets from the visual treatment.

- Decorative illustration is hidden from assistive tech; action button is a native `<button>`.

## Responsive behavior

loomi-empty-state is designed to fit the layout you place it in. It uses fluid widths, `min-width: 0`, wrapping, truncation, or stacked layouts where that keeps the component usable in cards, forms, sidebars, and mobile screens.

For dense layouts, give the parent container an intentional width and let the component fill it. For long labels or user-provided content, prefer real text that can wrap or truncate instead of fixed pixel assumptions.


## Dark mode

loomi-empty-state uses Loomi semantic tokens such as `--loomi-surface`, `--loomi-surface-border`, `--loomi-text`, and palette accent tokens instead of hard-coded light colors. Borders, panels, hover states, and muted text are expected to shift with the active theme.

Add `.dark` to your app root with `@loomidev/theme-switcher`, or provide your own token overrides, and the component will inherit the dark-mode values through its shadow DOM.


## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `heading` | _(blank)_ | Optional heading. |
| `message` | _(blank)_ | Main message text. |
| `button-label` | _(blank)_ | Action button text (omit to hide). |
| `image` | _(blank)_ | Custom image URL (defaults to a built-in illustration). |
| `image-size` | `medium` | `small` \| `medium` \| `large` \| `xl` \| `omg` |
| `show-image` | `true` | Show the illustration. Set `false` to use the slot. _(boolean)_ |

**Slot:** default (custom content when `show-image="false"`). **Event:** `action`
(button click).

## Full Example

```html
<loomi-empty-state
  heading="Nothing to see here"
  message="Hey! You've cleaned up your inbox nicely."
  button-label="Compose a message"
  image="/illustrations/empty-inbox.png"
  image-size="xl"
></loomi-empty-state>
```

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-empty-state>` is a standard custom element, so the browser can use it in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/empty-state` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomidev/empty-state lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/empty-state build
pnpm --filter @loomidev/empty-state typecheck
```

### Choose your framework

<loomi-tabs>
<loomi-tab label="HTML" active>

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/empty-state"></script>

<loomi-empty-state
  heading="No invoices"
  message="Invoices will appear here after the first payment."
  button-label="Create invoice"
></loomi-empty-state>
```

</loomi-tab>
<loomi-tab label="Bundlers and SPAs">

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/empty-state";
```

</loomi-tab>
<loomi-tab label="Blade">

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomidev/empty-state lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/empty-state";
```

```blade
<loomi-empty-state
  heading="No invoices"
  message="Invoices will appear here after the first payment."
  button-label="Create invoice"
></loomi-empty-state>
```

</loomi-tab>
<loomi-tab label="React">

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import "@loomidev/empty-state";

export function LoomiExample() {
  return (
    <loomi-empty-state
      heading="No invoices"
      message="Invoices will appear here after the first payment."
      button-label="Create invoice"
    ></loomi-empty-state>
  );
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

</loomi-tab>
<loomi-tab label="Vue">

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import "@loomidev/empty-state";
</script>

<template>
  <loomi-empty-state
    heading="No invoices"
    message="Invoices will appear here after the first payment."
    button-label="Create invoice"
  ></loomi-empty-state>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

</loomi-tab>
<loomi-tab label="Angular">

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomidev/empty-state";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-empty-state
      heading="No invoices"
      message="Invoices will appear here after the first payment."
      button-label="Create invoice"
    ></loomi-empty-state>
  `,
})
export class AppComponent {}
```

</loomi-tab>
<loomi-tab label="Svelte / Astro">

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import "@loomidev/empty-state";
</script>

<loomi-empty-state
  heading="No invoices"
  message="Invoices will appear here after the first payment."
  button-label="Create invoice"
></loomi-empty-state>
```

```astro
---
import "@loomidev/empty-state";
---

<loomi-empty-state
  heading="No invoices"
  message="Invoices will appear here after the first payment."
  button-label="Create invoice"
></loomi-empty-state>
```

</loomi-tab>
</loomi-tabs>

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->

## Dependencies

- `@loomidev/core`
