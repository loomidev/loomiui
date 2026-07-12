# @loomidev/rating

`<loomi-rating>` — a 0–5 rating control as stars, hearts or thumbs-up. **Form-associated**:
submits the rating under `name`.

```bash
npm install @loomidev/rating lit
```

```js
import "@loomidev/rating";
```


## Basic Usage

```html
<loomi-rating name="star-rating"></loomi-rating>
```

```html
<loomi-rating type="heart" name="heart-rating"></loomi-rating>
<loomi-rating type="thumbsup" name="thumb-rating"></loomi-rating>
```

Where there are multiple ratings on the same page, give each a unique `name`.

## Different Colors

Any loomi color works — the default is `orange`.

```html
<loomi-rating rating="1" color="error" name="error-rating"></loomi-rating>
<loomi-rating rating="2" color="yellow" name="yellow-rating"></loomi-rating>
<loomi-rating rating="3" color="success" name="success-rating"></loomi-rating>
<loomi-rating rating="4" color="primary" name="primary-rating"></loomi-rating>
<loomi-rating rating="5" color="error" name="error-rating"></loomi-rating>
<loomi-rating rating="3" color="success" name="success-rating"></loomi-rating>
<loomi-rating rating="4" color="success" name="violet-rating"></loomi-rating>
<loomi-rating rating="4" color="primary" name="indigo-rating"></loomi-rating>
```

## Different Sizes

```html
<loomi-rating rating="2" size="small" name="small-rating"></loomi-rating>
<loomi-rating rating="3" size="medium" type="thumbsup" name="medium-rating"></loomi-rating>
<loomi-rating rating="2" size="big" type="heart" name="big-rating"></loomi-rating>
```

## Reacting to a Rating

```html
<loomi-rating rating="2" name="album-rating"></loomi-rating>

<script type="module">
  document.querySelector('loomi-rating[name="album-rating"]').addEventListener("change", (e) => {
    console.log(e.detail.rating); // 1–5
    saveRating(e.detail.rating);
  });
</script>
```

## Disabled / Read-Only Ratings

Not every rating needs to be interactive — display a rating the user already gave as
read-only by setting `clickable="false"`.

```html
<loomi-rating rating="4" clickable="false"></loomi-rating>
```

## Form Submission

```html
<loomi-rating name="album_rating" rating="3"></loomi-rating>
```

```js
new FormData(form).get("album_rating"); // "3"
```

## Accessibility

loomi-rating is built on semantic markup where the browser gives us the right behavior, and it adds ARIA only where the component has custom interaction. Keyboard users should be able to reach the same controls as pointer users, with visible focus treatment unless you explicitly turn it off on controls that support `show-focus-ring="false"`.

When the component displays status, progress, validation, or temporary feedback, pair it with clear labels or nearby text in your app so assistive technology users get the same context a sighted user gets from the visual treatment.

- Supports keyboard focus with visible `:focus-visible` styling on interactive controls.

## Responsive behavior

loomi-rating is designed to fit the layout you place it in. It uses fluid widths, `min-width: 0`, wrapping, truncation, or stacked layouts where that keeps the component usable in cards, forms, sidebars, and mobile screens.

For dense layouts, give the parent container an intentional width and let the component fill it. For long labels or user-provided content, prefer real text that can wrap or truncate instead of fixed pixel assumptions.


## Dark mode

loomi-rating uses Loomi semantic tokens such as `--loomi-surface`, `--loomi-surface-border`, `--loomi-text`, and palette accent tokens instead of hard-coded light colors. Borders, panels, hover states, and muted text are expected to shift with the active theme.

Add `.dark` to your app root with `@loomidev/theme-switcher`, or provide your own token overrides, and the component will inherit the dark-mode values through its shadow DOM.

- Respects `.dark` on `<html>` via `@loomidev/theme-switcher` or your app theme.

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `name` | _(blank)_ | Submitted with the form. |
| `rating` | `0` | Current rating (0–5). |
| `type` | `star` | `star` \| `heart` \| `thumbsup` |
| `color` | `warning` | Any loomi color. |
| `size` | `small` | `small` \| `medium` \| `big` |
| `clickable` | `true` | Allow changing the rating. _(boolean)_ |

**Event:** `change` (`detail: { rating }`).

## Full Example

```html
<loomi-rating
  type="heart"
  name="album-rating"
  rating="3"
  color="yellow"
  size="big"
></loomi-rating>
```

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-rating>` is a standard custom element, so the browser can use it in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/rating` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomidev/rating lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/rating build
pnpm --filter @loomidev/rating typecheck
```

### Choose your framework

<loomi-tabs>
<loomi-tab label="HTML" active>

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/rating"></script>

<loomi-rating name="satisfaction" rating="4" clickable></loomi-rating>
```

</loomi-tab>
<loomi-tab label="Bundlers and SPAs">

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/rating";
```


Because this is a form-capable component, give it a `name` when it should submit with a native `<form>`. Read its value with `new FormData(form).get("the-name")` just like you would for a built-in input.

</loomi-tab>
<loomi-tab label="Blade">

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomidev/rating lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/rating";
```

```blade
<loomi-rating name="satisfaction" rating="4" clickable></loomi-rating>
```

</loomi-tab>
<loomi-tab label="React">

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import "@loomidev/rating";

export function LoomiExample() {
  return (
    <loomi-rating name="satisfaction" rating="4" clickable></loomi-rating>
  );
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

</loomi-tab>
<loomi-tab label="Vue">

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import "@loomidev/rating";
</script>

<template>
  <loomi-rating name="satisfaction" rating="4" clickable></loomi-rating>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

</loomi-tab>
<loomi-tab label="Angular">

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomidev/rating";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-rating name="satisfaction" rating="4" clickable></loomi-rating>
  `,
})
export class AppComponent {}
```

</loomi-tab>
<loomi-tab label="Svelte / Astro">

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import "@loomidev/rating";
</script>

<loomi-rating name="satisfaction" rating="4" clickable></loomi-rating>
```

```astro
---
import "@loomidev/rating";
---

<loomi-rating name="satisfaction" rating="4" clickable></loomi-rating>
```

</loomi-tab>
</loomi-tabs>

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->

## Dependencies

- `@loomidev/core`
