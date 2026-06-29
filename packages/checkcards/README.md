# @loomidev/checkcards

`<loomi-checkcards>` — selectable cards, a prettier alternative to checkboxes or radio
groups. Define content in a `<loomi-checkcard>` and give it a `value` — that's what gets
submitted when the form is submitted. **Form-associated**: submits the selected values
(comma-joined) under `name`.

```bash
npm install @loomidev/checkcards lit
```

```js
import "@loomidev/checkcards";
```

## Basic Usage

Cards take up the width of their parent — use a grid or flex container to lay several
out side by side.

```html
<loomi-checkcards name="hosting">
  <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:1rem">
    <loomi-checkcard value="aws" title="Amazon Web Services">
      A subsidiary of Amazon that provides on-demand cloud computing.
    </loomi-checkcard>
    <loomi-checkcard value="dOcean" title="DigitalOcean">
      A cloud infrastructure provider focused on simplicity.
    </loomi-checkcard>
  </div>
</loomi-checkcards>
```

### Compact Mode

```html
<loomi-checkcards name="hosting-compact" compact>
  <loomi-checkcard value="dOcean" title="DigitalOcean"></loomi-checkcard>
</loomi-checkcards>
```

## Max Selection

By default only one card can be selected at a time. Raise the limit with `max`.

```html
<loomi-checkcards name="hosting-3" max="3">
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem">
    <loomi-checkcard value="aws" title="AWS"></loomi-checkcard>
    <loomi-checkcard value="azure" title="Azure"></loomi-checkcard>
    <loomi-checkcard value="dOcean" title="DigitalOcean"></loomi-checkcard>
    <loomi-checkcard value="gcp" title="Google Cloud"></loomi-checkcard>
  </div>
</loomi-checkcards>
```

### Automatically Select New Cards

When `max` is reached, by default selecting a new card drops the oldest selection to
make room (`auto-select-new`, on by default) — this keeps exactly `max` cards selected
without ever blocking the user. Set `auto-select-new="false"` to block new selections
instead, requiring the user to unselect a card first.

```html
<loomi-checkcards name="hosting-block" max="3" auto-select-new="false">
  ...
</loomi-checkcards>
```

## Icons and Avatars

The card's content is entirely up to you, but for convenience a leading `icon` (from
[`@loomidev/icons`](../icons)) or `avatar` (an image URL, or ≤3 characters for an initials
label) can be set directly on `<loomi-checkcard>`. The `color` attribute on the parent
`<loomi-checkcards>` controls the icon/avatar color.

```html
<loomi-checkcards name="hosting-icons" color="primary">
  <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:1rem">
    <loomi-checkcard value="aws" title="AWS" icon="cloud-arrow-up">
      A copy of your messages will be backed up to AWS.
    </loomi-checkcard>
    <loomi-checkcard value="gdrive" title="Google Drive" icon="circle-stack">
      A copy of your messages will be backed up to Google Drive.
    </loomi-checkcard>
  </div>
</loomi-checkcards>

<loomi-checkcards name="hosting-avatars" max="2">
  <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:1rem">
    <loomi-checkcard value="mike" title="Michael Ocansey" avatar="/avatars/mike.jpg">
      Follow Michael to know when they post a new update.
    </loomi-checkcard>
    <loomi-checkcard value="francis" title="Francis Appiah" avatar="FA">
      Follow Francis to know when they post a new update.
    </loomi-checkcard>
  </div>
</loomi-checkcards>
```

## Colors

`color` controls icon/avatar color; `border-color` controls the card's border and
selected-state checkmark color. Both accept any LoomiUI color.

```html
<loomi-checkcards name="hosting-colors" color="warning" border-color="warning">
  <loomi-checkcard value="aws" title="AWS" icon="cloud-arrow-up"></loomi-checkcard>
</loomi-checkcards>
```

## Form Submission

```html
<loomi-checkcards name="hosting" selected-value="aws,gcp">
  <loomi-checkcard value="aws" title="AWS"></loomi-checkcard>
  <loomi-checkcard value="gcp" title="Google Cloud"></loomi-checkcard>
</loomi-checkcards>
```

```js
new FormData(form).get("hosting"); // "aws,gcp"
```

## Attributes

### `<loomi-checkcards>`

| Attribute | Default | Description |
| --- | --- | --- |
| `name` | _(blank)_ | Submitted with the form. |
| `max` | `1` | Max selectable cards. |
| `auto-select-new` | `true` | Drop the oldest selection when exceeding `max` (vs blocking). _(boolean)_ |
| `color` / `border-color` | `primary` | Accent / border color (any loomi color). |
| `border-width` | `2` | Card border width (px). |
| `radius` | `medium` | `none` \| `small` \| `medium` \| `full` |
| `compact` | `false` | Reduced padding. _(boolean)_ |
| `selected-value` | _(blank)_ | Comma-separated values to pre-select. |

### `<loomi-checkcard>`

| Attribute | Default | Description |
| --- | --- | --- |
| `value` | _(blank)_ | Submitted value. |
| `title` | _(blank)_ | Card title. |
| `icon` | _(blank)_ | Leading icon name. |
| `avatar` | _(blank)_ | Image URL, or ≤3 chars for an initials label. |

**Slot:** default (card body). **Event:** `change` (`detail: { values }`).

## Full Example

```html
<loomi-checkcards
  name="hosting"
  max="3"
  color="primary"
  border-color="gray"
  border-width="2"
  radius="medium"
  selected-value="aws,azure"
>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem">
    <loomi-checkcard value="aws" title="Amazon Web Services" icon="cloud-arrow-up">
      A subsidiary of Amazon that provides on-demand cloud computing.
    </loomi-checkcard>
    <loomi-checkcard value="azure" title="Microsoft Azure" icon="circle-stack">
      Microsoft's cloud computing platform.
    </loomi-checkcard>
    <loomi-checkcard value="dOcean" title="DigitalOcean" icon="server">
      A cloud infrastructure provider focused on simplicity.
    </loomi-checkcard>
  </div>
</loomi-checkcards>
```

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-checkcard>` and `<loomi-checkcards>` are standard custom elements, so the browser can use them in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/checkcards` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomidev/checkcards lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/checkcards build
pnpm --filter @loomidev/checkcards typecheck
```

### Plain HTML

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/checkcards"></script>

<loomi-checkcards name="plan" selected-value="pro">
  <loomi-checkcard value="starter" title="Starter">For small projects.</loomi-checkcard>
  <loomi-checkcard value="pro" title="Pro">For growing teams.</loomi-checkcard>
</loomi-checkcards>
```

### Bundlers and single-page apps

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/checkcards";
```


Because this is a form-capable component, give it a `name` when it should submit with a native `<form>`. Read its value with `new FormData(form).get("the-name")` just like you would for a built-in input.

### Laravel Blade

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomidev/checkcards lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/checkcards";
```

```blade
<loomi-checkcards name="plan" selected-value="pro">
  <loomi-checkcard value="starter" title="Starter">For small projects.</loomi-checkcard>
  <loomi-checkcard value="pro" title="Pro">For growing teams.</loomi-checkcard>
</loomi-checkcards>
```

### React

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import "@loomidev/checkcards";

export function LoomiExample() {
  return (
    <loomi-checkcards name="plan" selected-value="pro">
      <loomi-checkcard value="starter" title="Starter">For small projects.</loomi-checkcard>
      <loomi-checkcard value="pro" title="Pro">For growing teams.</loomi-checkcard>
    </loomi-checkcards>
  );
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

### Vue

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import "@loomidev/checkcards";
</script>

<template>
  <loomi-checkcards name="plan" selected-value="pro">
    <loomi-checkcard value="starter" title="Starter">For small projects.</loomi-checkcard>
    <loomi-checkcard value="pro" title="Pro">For growing teams.</loomi-checkcard>
  </loomi-checkcards>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

### Angular

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomidev/checkcards";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-checkcards name="plan" selected-value="pro">
      <loomi-checkcard value="starter" title="Starter">For small projects.</loomi-checkcard>
      <loomi-checkcard value="pro" title="Pro">For growing teams.</loomi-checkcard>
    </loomi-checkcards>
  `,
})
export class AppComponent {}
```

### Svelte and Astro

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import "@loomidev/checkcards";
</script>

<loomi-checkcards name="plan" selected-value="pro">
  <loomi-checkcard value="starter" title="Starter">For small projects.</loomi-checkcard>
  <loomi-checkcard value="pro" title="Pro">For growing teams.</loomi-checkcard>
</loomi-checkcards>
```

```astro
---
import "@loomidev/checkcards";
---

<loomi-checkcards name="plan" selected-value="pro">
  <loomi-checkcard value="starter" title="Starter">For small projects.</loomi-checkcard>
  <loomi-checkcard value="pro" title="Pro">For growing teams.</loomi-checkcard>
</loomi-checkcards>
```

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->
