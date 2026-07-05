# @loomidev/photo-gallery

`<loomi-photo-gallery>` — an album grid built from `<loomi-photo-gallery-item>` children,
with a toolbar (album list, zoom, square thumbnails, slideshow) and a full-size lightbox
viewer opened by clicking a photo (zoom, rotate, favourite, share). Every toolbar icon can
be hidden individually.

```bash
npm install @loomidev/photo-gallery lit
```

```js
import "@loomidev/photo-gallery";
```


## Basic Usage

Each photo is a `<loomi-photo-gallery-item>` child — a plain data holder, like an
`<option>`, that never renders itself. The gallery draws the grid tiles and lightbox from
its attributes.

```html
<loomi-photo-gallery>
  <loomi-photo-gallery-item src="/photos/lake-full.jpg" thumb="/photos/lake-thumb.jpg" alt="Lake at sunrise"></loomi-photo-gallery-item>
  <loomi-photo-gallery-item src="/photos/trail-full.jpg" thumb="/photos/trail-thumb.jpg" alt="Forest trail"></loomi-photo-gallery-item>
  <loomi-photo-gallery-item src="/photos/peak-full.jpg" thumb="/photos/peak-thumb.jpg" alt="Mountain peak" favourite></loomi-photo-gallery-item>
</loomi-photo-gallery>
```

`thumb` is optional — it falls back to `src` when omitted. Clicking a tile opens the
lightbox at that photo; the small heart button on each tile favourites it without opening
anything.

## Albums

Set `album` on any item to group it. The toolbar's album-list button (and the panel
itself) only appear once more than one album exists — an "All" entry is always added
automatically. `album-view` picks how the open panel looks: a vertical `sidebar` (default)
or a horizontal `thumbnails` strip.

```html
<loomi-photo-gallery album-view="thumbnails">
  <loomi-photo-gallery-item src="/photos/a1.jpg" album="Iceland"></loomi-photo-gallery-item>
  <loomi-photo-gallery-item src="/photos/a2.jpg" album="Iceland"></loomi-photo-gallery-item>
  <loomi-photo-gallery-item src="/photos/b1.jpg" album="Japan"></loomi-photo-gallery-item>
</loomi-photo-gallery>
```

`album-panel-open` (default `true`) controls whether the panel is currently open — set it
up front, bind it, or let the toolbar button toggle it.

## Zoom & Square Thumbnails

The zoom in/out buttons resize the grid tiles between 96px and 320px (`thumb-size`,
settable up front too). `square-thumbnails` forces every tile to a 1:1 crop instead of
each photo's natural aspect ratio.

```html
<loomi-photo-gallery thumb-size="220" square-thumbnails></loomi-photo-gallery>
```

## Slideshow

The slideshow button opens the lightbox (if it isn't already open) and advances through
the currently visible photos every `slideshow-interval` milliseconds (default `3000`),
looping back to the first after the last. Any manual navigation, or closing the lightbox,
stops it — clicking the button again also stops it.

```html
<loomi-photo-gallery slideshow-interval="5000"></loomi-photo-gallery>
```

```js
gallery.startSlideshow();
gallery.stopSlideshow();
```

## Lightbox

Clicking a tile (or calling `openLightbox(index)`) opens a full-viewport lightbox with its
own toolbar: zoom in/out, favourite, rotate left, and share — plus prev/next navigation
when there's more than one photo. <kbd>Escape</kbd>, the arrow keys, <kbd>+</kbd>/<kbd>-</kbd>,
and <kbd>r</kbd> all work while it's focused; clicking the backdrop also closes it.

Rotate keeps accumulating (-90° every click) rather than resetting to 0 — so repeated
clicks keep visibly spinning the photo left instead of jumping backward — and resets only
when you move to a different photo. Share calls `navigator.share()` when available,
otherwise copies the full-size URL to the clipboard (showing a small "Link copied" toast);
either way, a `loomi-share` event fires first so you can hook in your own share flow
(e.g. a custom share sheet).

```js
gallery.openLightbox(2);
gallery.closeLightbox();
gallery.nextPhoto();
gallery.prevPhoto();
```

## Toggling Toolbar Icons

Every toolbar button — in both the grid toolbar and the lightbox toolbar — can be hidden
individually via its own `show-*` attribute, all `true` by default.

```html
<loomi-photo-gallery
  show-album-toggle="false"
  show-slideshow="false"
  lightbox-show-share="false"
  lightbox-show-rotate="false"
>
  ...
</loomi-photo-gallery>
```

The lightbox's close (×) button follows the same pattern (`lightbox-show-close`) —
<kbd>Escape</kbd> and clicking the backdrop still close it either way.

## Events

```js
gallery.addEventListener("loomi-favourite", (e) => console.log(e.detail)); // { index, src, favourite }
gallery.addEventListener("loomi-photo-open", (e) => console.log(e.detail)); // { index, src }
gallery.addEventListener("loomi-photo-close", () => console.log("closed"));
gallery.addEventListener("loomi-photo-change", (e) => console.log(e.detail)); // { index, src }
gallery.addEventListener("loomi-rotate", (e) => console.log(e.detail)); // { index, rotation }
gallery.addEventListener("loomi-share", (e) => console.log(e.detail)); // { index, src }
gallery.addEventListener("loomi-slideshow-start", () => console.log("slideshow started"));
gallery.addEventListener("loomi-slideshow-end", () => console.log("slideshow stopped"));
gallery.addEventListener("loomi-album-change", (e) => console.log(e.detail)); // { album }
```

## Accessibility

- The grid toolbar and lightbox toolbar both render as `role="toolbar"`; the lightbox
  itself is `role="dialog"` with `aria-modal="true"`.
- Opening the lightbox moves focus into it and traps <kbd>Tab</kbd>/<kbd>Shift+Tab</kbd>
  inside; closing it restores focus to whatever triggered it.
- Every icon-only button has an `aria-label` (and matching `title`), sourced from
  `@loomidev/core`'s locale strings.
- The favourite, album, slideshow, and square-thumbnail toggle buttons expose their state
  via `aria-pressed`.

## Responsive behavior

The grid uses `repeat(auto-fill, minmax(var(--loomi-pg-tile), 1fr))`, so tiles reflow to
fit the container at any width — no explicit column count to manage. The album sidebar
narrows on viewports under `480px`.

## Dark mode

Uses semantic `--loomi-surface-border`, `--loomi-text`, `--loomi-text-secondary`, and
`--loomi-text-faint` tokens for the toolbar/grid/album chrome (the lightbox itself is a
dark scrim regardless of theme, like most photo viewers). Add `.dark` to your app root
with `@loomidev/theme-switcher`, or provide your own token overrides.

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `album-view` | `sidebar` | `sidebar` or `thumbnails` layout for the album panel. |
| `square-thumbnails` | `false` | Force 1:1 cropped grid thumbnails. _(boolean)_ |
| `thumb-size` | `160` | Grid thumbnail size in pixels (96–320). _(number)_ |
| `slideshow-interval` | `3000` | Milliseconds between slides while running. _(number)_ |
| `album-panel-open` | `true` | Whether the album panel is currently open. _(boolean, reflected)_ |
| `show-album-toggle` | `true` | Show the album-list toolbar button. _(boolean)_ |
| `show-zoom-in` / `show-zoom-out` | `true` | Show the grid zoom buttons. _(boolean)_ |
| `show-square-toggle` | `true` | Show the square-thumbnails toolbar button. _(boolean)_ |
| `show-slideshow` | `true` | Show the slideshow toolbar button. _(boolean)_ |
| `lightbox-show-zoom-in` / `lightbox-show-zoom-out` | `true` | Show the lightbox zoom buttons. _(boolean)_ |
| `lightbox-show-favourite` | `true` | Show the lightbox favourite button. _(boolean)_ |
| `lightbox-show-rotate` | `true` | Show the lightbox rotate-left button. _(boolean)_ |
| `lightbox-show-share` | `true` | Show the lightbox share button. _(boolean)_ |
| `lightbox-show-close` | `true` | Show the lightbox close button. _(boolean)_ |
| `color` | `primary` | Accent color for active toolbar/album states. |
| `locale` | _(blank)_ | Locale override for built-in aria labels. |

Boolean attributes can be omitted, present, or set to `"false"` in HTML.

**`<loomi-photo-gallery-item>` attributes:** `src` (required), `thumb`, `alt`, `album`,
`caption`, `favourite` _(boolean, reflected)_.

**Methods:** `openLightbox(index)`, `closeLightbox()`, `nextPhoto()`, `prevPhoto()`,
`startSlideshow()`, `stopSlideshow()`.
**Events:** `loomi-favourite`, `loomi-photo-open`, `loomi-photo-close`,
`loomi-photo-change`, `loomi-rotate`, `loomi-share`, `loomi-slideshow-start`,
`loomi-slideshow-end`, `loomi-album-change`.
**Slot:** default (`<loomi-photo-gallery-item>` children).

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-photo-gallery>` is a standard custom element, so the browser can use it in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/photo-gallery` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomidev/photo-gallery lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/photo-gallery build
pnpm --filter @loomidev/photo-gallery typecheck
```

### Choose your framework

<loomi-tabs>
<loomi-tab label="Plain HTML" active>

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/photo-gallery"></script>

<loomi-photo-gallery>
  <loomi-photo-gallery-item src="/photos/lake-full.jpg" thumb="/photos/lake-thumb.jpg" alt="Lake at sunrise"></loomi-photo-gallery-item>
</loomi-photo-gallery>
```

</loomi-tab>
<loomi-tab label="Bundlers and SPAs">

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/photo-gallery";
```

</loomi-tab>
<loomi-tab label="Laravel Blade">

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomidev/photo-gallery lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/photo-gallery";
```

```blade
<loomi-photo-gallery>
  <loomi-photo-gallery-item src="/photos/lake-full.jpg" alt="Lake at sunrise"></loomi-photo-gallery-item>
</loomi-photo-gallery>
```

</loomi-tab>
<loomi-tab label="React">

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import "@loomidev/photo-gallery";

export function LoomiExample() {
  return (
    <loomi-photo-gallery>
      <loomi-photo-gallery-item src="/photos/lake-full.jpg" alt="Lake at sunrise"></loomi-photo-gallery-item>
    </loomi-photo-gallery>
  );
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

</loomi-tab>
<loomi-tab label="Vue">

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import "@loomidev/photo-gallery";
</script>

<template>
  <loomi-photo-gallery>
    <loomi-photo-gallery-item src="/photos/lake-full.jpg" alt="Lake at sunrise"></loomi-photo-gallery-item>
  </loomi-photo-gallery>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

</loomi-tab>
<loomi-tab label="Angular">

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomidev/photo-gallery";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-photo-gallery>
      <loomi-photo-gallery-item src="/photos/lake-full.jpg" alt="Lake at sunrise"></loomi-photo-gallery-item>
    </loomi-photo-gallery>
  `,
})
export class AppComponent {}
```

</loomi-tab>
<loomi-tab label="Svelte and Astro">

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import "@loomidev/photo-gallery";
</script>

<loomi-photo-gallery>
  <loomi-photo-gallery-item src="/photos/lake-full.jpg" alt="Lake at sunrise"></loomi-photo-gallery-item>
</loomi-photo-gallery>
```

```astro
---
import "@loomidev/photo-gallery";
---

<loomi-photo-gallery>
  <loomi-photo-gallery-item src="/photos/lake-full.jpg" alt="Lake at sunrise"></loomi-photo-gallery-item>
</loomi-photo-gallery>
```

</loomi-tab>
</loomi-tabs>

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->

## Dependencies

- `@loomidev/core`
- `@loomidev/icon`
