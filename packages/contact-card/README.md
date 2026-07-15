# @loomidev/contact-card

`<loomi-contact-card>` — a ready-made card for displaying a contact, with avatar, name,
position and contact rows. Saves you from manually building this layout out of
[`<loomi-card>`](../card) and [`<loomi-avatar>`](../avatar) every time.

```bash
npm install @loomidev/contact-card lit
```

```js
import "@loomidev/contact-card";
```

## Basic Usage

A default avatar placeholder is used when `image` isn't set.

```html
<loomi-contact-card
  name="Michael K. Ocansey"
  position="Senior Developer"
  department="Tech"
  email="mike@loomiui.dev"
  mobile="+233 123 456 789"
  birthday="01 May"
></loomi-contact-card>
```

## Custom Image

```html
<loomi-contact-card name="Sara Field" image="/sara.jpg" position="Designer"></loomi-contact-card>
```

When no `image` is set, initials are derived from `name` and shown as a label avatar
instead — same fallback behavior as [`<loomi-avatar>`](../avatar).

## Centered Layout

`centered` reflows the card to stack the avatar above the details, vertically centered
— handy in a grid of team members.

```html
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem">
  <loomi-contact-card name="Michael K. Ocansey" position="Senior Developer" centered></loomi-contact-card>
  <loomi-contact-card name="Sara Field" image="/sara.jpg" position="Designer" centered></loomi-contact-card>
  <loomi-contact-card name="Ada Boateng" position="Product" centered></loomi-contact-card>
</div>
```

## Clickable Contact Cards

Same `url` semantics as [`<loomi-card>`](../card) — a path, full URL, or JS function
call.

```html
<loomi-contact-card name="Michael K. Ocansey" position="Senior Developer" has-hover url="/team/mike"></loomi-contact-card>
```

## Extra Content

The default slot renders below the contact details — useful for tags, a short bio, or
action buttons.

```html
<loomi-contact-card name="Michael K. Ocansey" position="Senior Developer">
  <loomi-tag label="On leave" color="warning"></loomi-tag>
</loomi-contact-card>
```

## Card Styling

`has-shadow` and `has-hover` work exactly like on [`<loomi-card>`](../card).

```html
<loomi-contact-card name="Michael K. Ocansey" has-shadow="false"></loomi-contact-card>
```

## Accessibility

For the library-wide baseline, see [Component foundations — Accessibility](https://loomiui.com/customization/component-foundations/#accessibility).

## Responsive behavior

For the shared container and viewport rules, see [Component foundations — Responsive behavior](https://loomiui.com/customization/component-foundations/#responsive-behavior).

## Dark mode

For theme activation, token overrides, and contrast guidance, see [Component foundations — Dark mode](https://loomiui.com/customization/component-foundations/#dark-mode).

## Attributes

| Attribute    | Default   | Description                                   |
| ------------ | --------- | --------------------------------------------- |
| `name`       | _(blank)_ | Contact name (initials avatar when no image). |
| `position`   | _(blank)_ | Job title, shown under the name.              |
| `department` | _(blank)_ | Department, shown under the name.             |
| `image`      | _(blank)_ | Avatar image URL.                             |
| `email`      | _(blank)_ | Email address row, shown with an icon.        |
| `mobile`     | _(blank)_ | Phone number row, shown with an icon.         |
| `birthday`   | _(blank)_ | Birthday row, shown with an icon.             |
| `centered`   | `false`   | Vertically center the layout. _(boolean)_     |
| `has-shadow` | `true`    | Show a drop shadow. _(boolean)_               |
| `has-hover`  | `false`   | Lift the card on hover. _(boolean)_           |
| `url`        | _(blank)_ | Navigate on click.                            |

**Slot:** default (extra content below the details).

## Full Example

```html
<loomi-contact-card
  name="Michael K. Ocansey"
  position="Senior Copywriter"
  department="Tech"
  email="mike@loomiui.dev"
  mobile="+233.123.456.789"
  birthday="01-May"
  has-hover
  centered
  url="/team/mike"
>
  <loomi-tag label="Available" color="success"></loomi-tag>
</loomi-contact-card>
```

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-contact-card>` is a standard custom element, so the browser can use it in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/contact-card` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomidev/contact-card lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/contact-card build
pnpm --filter @loomidev/contact-card typecheck
```

### Choose your framework

<loomi-tabs>
<loomi-tab label="HTML" active>

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/contact-card"></script>

<loomi-contact-card
  name="Ama Mensah"
  position="Product Manager"
  department="Growth"
  email="ama@example.com"
></loomi-contact-card>
```

</loomi-tab>
<loomi-tab label="Bundlers and SPAs">

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/contact-card";
```

</loomi-tab>
<loomi-tab label="Blade">

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomidev/contact-card lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/contact-card";
```

```blade
<loomi-contact-card
  name="Ama Mensah"
  position="Product Manager"
  department="Growth"
  email="ama@example.com"
></loomi-contact-card>
```

</loomi-tab>
<loomi-tab label="React">

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import "@loomidev/contact-card";

export function LoomiExample() {
  return (
    <loomi-contact-card
      name="Ama Mensah"
      position="Product Manager"
      department="Growth"
      email="ama@example.com"
    ></loomi-contact-card>
  );
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

</loomi-tab>
<loomi-tab label="Vue">

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import "@loomidev/contact-card";
</script>

<template>
  <loomi-contact-card
    name="Ama Mensah"
    position="Product Manager"
    department="Growth"
    email="ama@example.com"
  ></loomi-contact-card>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

</loomi-tab>
<loomi-tab label="Angular">

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomidev/contact-card";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-contact-card
      name="Ama Mensah"
      position="Product Manager"
      department="Growth"
      email="ama@example.com"
    ></loomi-contact-card>
  `,
})
export class AppComponent {}
```

</loomi-tab>
<loomi-tab label="Svelte / Astro">

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import "@loomidev/contact-card";
</script>

<loomi-contact-card
  name="Ama Mensah"
  position="Product Manager"
  department="Growth"
  email="ama@example.com"
></loomi-contact-card>
```

```astro
---
import "@loomidev/contact-card";
---

<loomi-contact-card
  name="Ama Mensah"
  position="Product Manager"
  department="Growth"
  email="ama@example.com"
></loomi-contact-card>
```

</loomi-tab>
</loomi-tabs>

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->

## Dependencies

- `@loomidev/card`
- `@loomidev/core`
- `@loomidev/icons`
