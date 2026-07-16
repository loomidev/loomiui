# @loomidev/lightbox

`<loomi-lightbox-image>` — click an image to view it fullscreen. It wraps a single
existing image with no shared container or parent gallery required, so it's a natural
fit for images scattered across a blog post, article, or card grid — drop one anywhere,
independently of any others on the page.

```bash
npm install @loomidev/lightbox lit
```

```js
import "@loomidev/lightbox";
```

## Basic Usage

Wrap the `<img>` you already have. The component reuses its `alt` text for the
fullscreen view and the trigger's accessible label, so you don't have to repeat it.

```html
<p>
  Some text before the photo…
  <loomi-lightbox-image src="/photos/lake-full.jpg">
    <img src="/photos/lake-thumb.jpg" alt="Lake at sunrise" />
  </loomi-lightbox-image>
  …and some text after it.
</p>
```

`src` is the full-size image shown in the fullscreen view; the slotted `<img>` (usually a
smaller thumbnail) is what's actually visible on the page. If you have no existing `<img>`
to wrap, omit the slot and set `alt` directly — the component renders its own from `src`
and `alt`.

```html
<loomi-lightbox-image src="/photos/lake-full.jpg" alt="Lake at sunrise"></loomi-lightbox-image>
```

## Grouping — Next/Prev across scattered images

Give two or more instances the same `group` to enable Next/Prev navigation between them
while the viewer is open — they don't need to be adjacent in the DOM; membership is
resolved in document order whenever the viewer opens.

```html
<article>
  <p>… <loomi-lightbox-image src="/a-full.jpg" group="trip"><img src="/a-thumb.jpg" alt="Day one" /></loomi-lightbox-image> …</p>
  <p>… <loomi-lightbox-image src="/b-full.jpg" group="trip"><img src="/b-thumb.jpg" alt="Day two" /></loomi-lightbox-image> …</p>
  <p>… <loomi-lightbox-image src="/c-full.jpg" group="trip"><img src="/c-thumb.jpg" alt="Day three" /></loomi-lightbox-image> …</p>
</article>
```

Leave `group` unset for a standalone single-image viewer — no Next/Prev controls appear.

## Caption

```html
<loomi-lightbox-image src="/photos/lake-full.jpg" caption="Lake at sunrise, June 2026">
  <img src="/photos/lake-thumb.jpg" alt="Lake at sunrise" />
</loomi-lightbox-image>
```

## Keyboard

<kbd>Escape</kbd> closes the viewer; <kbd>ArrowLeft</kbd>/<kbd>ArrowRight</kbd> move to
the previous/next image when `group` is set. <kbd>Tab</kbd>/<kbd>Shift+Tab</kbd> stay
trapped inside the viewer while it's open, and clicking the backdrop also closes it.

## JavaScript API

```js
const lightbox = document.querySelector("loomi-lightbox-image");
lightbox.show();
lightbox.hide();
lightbox.open; // current open state (reflected attribute)
```

```js
lightbox.addEventListener("loomi-open", () => console.log("opened"));
lightbox.addEventListener("loomi-close", () => console.log("closed"));
```

## Accessibility

- The trigger renders as a real `<button>` (`aria-haspopup="dialog"`), so keyboard users
  can open the viewer the same way mouse users click the image — not just a bare
  clickable `<img>` with no keyboard path.
- The fullscreen view is `role="dialog"` with `aria-modal="true"`, traps
  <kbd>Tab</kbd>/<kbd>Shift+Tab</kbd> inside it, moves focus in on open, and restores
  focus to whatever triggered it on close.
- Every icon-only button (close, previous, next) has an `aria-label`, sourced from
  `@loomidev/core`'s locale strings.
- Supports keyboard focus with visible `:focus-visible` styling on the trigger and every
  viewer control.

For the library-wide baseline, see [Foundations — Accessibility](https://loomiui.com/foundations/#accessibility).

## Responsive behavior

The trigger is `display: inline-block` and only wraps its slotted content — it adds no
layout of its own, so it never disturbs the image's existing flow in a paragraph, card,
or grid. The fullscreen image scales to fit the viewport (`object-fit: contain`) at any
screen size, and viewer controls shrink slightly under 480px.

For the shared container and viewport rules, see [Foundations — Responsive behavior](https://loomiui.com/foundations/#responsive-behavior).

## Dark mode

The trigger's `:focus-visible` ring uses the shared `--loomi-focus-ring-color` token, so
it follows the same theme as every other component. The fullscreen viewer itself is
always a dark scrim regardless of theme, like most image viewers — its controls are
white-on-dark by design, not something that should flip with `.dark`.

For theme activation, token overrides, and contrast guidance, see [Foundations — Dark mode](https://loomiui.com/foundations/#dark-mode).

## Attributes

| Attribute | Default      | Description                                                                                                               |
| --------- | ------------ | ------------------------------------------------------------------------------------------------------------------------- |
| `src`     | _(required)_ | Full-size image URL, shown in the fullscreen view.                                                                        |
| `alt`     | _(blank)_    | Alt text for the fullscreen image and the trigger's label. Falls back to the slotted `<img>`'s own `alt` when left unset. |
| `caption` | _(blank)_    | Optional caption shown below the image in the fullscreen view.                                                            |
| `group`   | _(blank)_    | Instances sharing this value get Next/Prev navigation between them. Leave unset for a standalone viewer.                  |
| `open`    | `false`      | Whether the fullscreen view is currently showing. _(boolean, reflected)_                                                  |
| `locale`  | _(blank)_    | Locale override for built-in aria labels.                                                                                 |

**Methods:** `show()`, `hide()`.

## Slots

| Slot        | Description                          |
| ----------- | ------------------------------------ |
| _(default)_ | Content placed inside the component. |

## Events

| Event         | Description                     |
| ------------- | ------------------------------- |
| `loomi-close` | Fired when the lightbox closes. |
| `loomi-open`  | Fired when the lightbox opens.  |

## Full Example

```html
<loomi-lightbox-image src="/photos/lake-full.jpg" group="trip" caption="Lake at sunrise">
  <img src="/photos/lake-thumb.jpg" alt="Lake at sunrise" />
</loomi-lightbox-image>
```

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-lightbox-image>` is a standard custom element, so the browser can use it in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/lightbox` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomidev/lightbox lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/lightbox build
pnpm --filter @loomidev/lightbox typecheck
```

### Choose your framework

<loomi-tabs>
<loomi-tab label="HTML" active>

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/lightbox"></script>

<loomi-lightbox-image src="/photos/lake-full.jpg">
  <img src="/photos/lake-thumb.jpg" alt="Lake at sunrise" />
</loomi-lightbox-image>
```

</loomi-tab>
<loomi-tab label="Bundlers and SPAs">

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/lightbox";
```

</loomi-tab>
<loomi-tab label="Blade">

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomidev/lightbox lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/lightbox";
```

```blade
<loomi-lightbox-image src="/photos/lake-full.jpg">
  <img src="/photos/lake-thumb.jpg" alt="Lake at sunrise" />
</loomi-lightbox-image>
```

</loomi-tab>
<loomi-tab label="React">

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import "@loomidev/lightbox";

export function LoomiExample() {
  return (
    <loomi-lightbox-image src="/photos/lake-full.jpg">
      <img src="/photos/lake-thumb.jpg" alt="Lake at sunrise" />
    </loomi-lightbox-image>
  );
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

</loomi-tab>
<loomi-tab label="Vue">

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import "@loomidev/lightbox";
</script>

<template>
  <loomi-lightbox-image src="/photos/lake-full.jpg">
    <img src="/photos/lake-thumb.jpg" alt="Lake at sunrise" />
  </loomi-lightbox-image>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

</loomi-tab>
<loomi-tab label="Angular">

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomidev/lightbox";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-lightbox-image src="/photos/lake-full.jpg">
      <img src="/photos/lake-thumb.jpg" alt="Lake at sunrise" />
    </loomi-lightbox-image>
  `,
})
export class AppComponent {}
```

</loomi-tab>
<loomi-tab label="Svelte / Astro">

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import "@loomidev/lightbox";
</script>

<loomi-lightbox-image src="/photos/lake-full.jpg">
  <img src="/photos/lake-thumb.jpg" alt="Lake at sunrise" />
</loomi-lightbox-image>
```

```astro
---
import "@loomidev/lightbox";
---

<loomi-lightbox-image src="/photos/lake-full.jpg">
  <img src="/photos/lake-thumb.jpg" alt="Lake at sunrise" />
</loomi-lightbox-image>
```

</loomi-tab>
</loomi-tabs>

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->

## Dependencies

- `@loomidev/core`
- `@loomidev/icon`
