# @loomidev/drawer

`<loomi-drawer>` — a panel that slides in from the edge of the screen, with configurable
size, an optional backdrop, and focus management built in.

```bash
npm install @loomidev/drawer lit
```

```js
import "@loomidev/drawer";
```


## Default Drawer

Drawers are usually triggered by an action — a button click, say. Every LoomiUI drawer is
opened and closed by its unique `name`, using the exported `showLoomiDrawer()` /
`hideLoomiDrawer()` helpers (or the instance methods `show()`/`hide()` if you already have
a reference to the element).

> **Important:** give every drawer on a page a unique `name` — it's how `showLoomiDrawer()`
> finds the right one.

The default drawer slides in from the right, shows a close button, and dismisses on
backdrop click, outside click, or <kbd>Esc</kbd>.

```html
<loomi-button onclick="showLoomiDrawer('filters')">Open filters</loomi-button>

<loomi-drawer name="filters" title="Filters">
  Filter controls go here.
</loomi-drawer>

<script type="module">
  import { showLoomiDrawer } from "@loomidev/drawer";
</script>
```

## Positions

Set `position` to slide in from any edge. Left/right drawers span the full height and
size by width; top/bottom drawers span the full width and size by height.

```html
<loomi-button onclick="showLoomiDrawer('left')">Left</loomi-button>
<loomi-drawer position="left" title="Left" name="left">Slides in from the left.</loomi-drawer>

<loomi-button onclick="showLoomiDrawer('right')">Right</loomi-button>
<loomi-drawer position="right" title="Right" name="right">The default.</loomi-drawer>

<loomi-button onclick="showLoomiDrawer('top')">Top</loomi-button>
<loomi-drawer position="top" title="Top" name="top">Slides down from the top.</loomi-drawer>

<loomi-button onclick="showLoomiDrawer('bottom')">Bottom</loomi-button>
<loomi-drawer position="bottom" title="Bottom" name="bottom">Slides up from the bottom.</loomi-drawer>
```

## Sizes

```html
<loomi-button onclick="showLoomiDrawer('small-drawer')">Small</loomi-button>
<loomi-drawer size="small" title="Small" name="small-drawer">20rem wide.</loomi-drawer>

<loomi-button onclick="showLoomiDrawer('medium-drawer')">Medium</loomi-button>
<loomi-drawer size="medium" title="Medium" name="medium-drawer">28rem wide — the default.</loomi-drawer>

<loomi-button onclick="showLoomiDrawer('large-drawer')">Large</loomi-button>
<loomi-drawer size="large" title="Large" name="large-drawer">36rem wide.</loomi-drawer>
```

On screens narrower than 30rem, left/right drawers expand to full width regardless of size.

## Scrollable Body

The header (title and close button) stays fixed; slotted content scrolls independently
once it overflows the drawer's height.

```html
<loomi-button onclick="showLoomiDrawer('long')">Terms</loomi-button>
<loomi-drawer name="long" title="Terms of service">
  <p>… a few thousand words …</p>
</loomi-drawer>
```

## Backdrop, Outside Click & Escape

Three independent toggles control dismissal:

- `backdrop` (default `true`) — shows a dimmed overlay behind the panel and blocks
  interaction with the rest of the page while open.
- `close-on-outside-click` (default `true`) — clicking outside the panel closes it. This
  works even with `backdrop="false"`, since it's just watching for clicks outside the
  panel rather than relying on the backdrop element itself.
- <kbd>Esc</kbd> always closes the drawer — there's no attribute to turn that off.

```html
<!-- no dimming overlay, but the rest of the page stays inert because outside clicks
     are still being watched -->
<loomi-drawer name="quiet" backdrop="false">No backdrop, but outside clicks still close me.</loomi-drawer>

<!-- only the close button or Escape can dismiss it -->
<loomi-drawer name="pinned" close-on-outside-click="false">
  Click outside all you want — only the X (or Escape) closes me.
</loomi-drawer>
```

### Non-Modal Drawers

When `backdrop="false"`, the drawer also stops being treated as a modal dialog: it sets
`aria-modal="false"` and no longer traps <kbd>Tab</kbd> inside the panel, so keyboard users
can still reach the rest of the page. Use this for a persistent, non-blocking side panel
rather than a true overlay.

## Custom Animations

Every part of the slide animation is overridable through CSS custom properties — no
rebuild required:

| Property | Default |
| --- | --- |
| `--loomi-drawer-duration` | `0.3s` |
| `--loomi-drawer-easing` | `cubic-bezier(0.32, 0.72, 0, 1)` |
| `--loomi-drawer-enter-animation` | `loomi-drawer-in-<position>` |
| `--loomi-drawer-exit-animation` | `loomi-drawer-out-<position>` |

Override the timing globally:

```css
:root {
  --loomi-drawer-duration: 0.5s;
  --loomi-drawer-easing: ease-in-out;
}
```

Or supply your own `@keyframes` and point the drawer at them for a fully custom motion
(e.g. a bounce instead of a linear slide). `position`/`size` aren't reflected as
attributes, so scope the override with a class or `:root` instead of an attribute
selector:

```css
@keyframes my-bounce-in {
  0% { transform: translateX(100%); }
  60% { transform: translateX(-1rem); }
  100% { transform: translateX(0); }
}
:root {
  --loomi-drawer-enter-animation: my-bounce-in;
}
```

`prefers-reduced-motion: reduce` is honored automatically — the animation still runs (so
`hide()` resolves promptly) but at a near-instant duration.

## Accessibility
- Same overlay contract as modal; labelled close control.

## Responsive behavior
- Full-width sheet on mobile; side inset from `768px`.

## Dark mode
- Panel uses `--loomi-surface` and border tokens.

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `name` | _(blank)_ | Unique name for `showLoomiDrawer()` / `hideLoomiDrawer()`. |
| `title` | _(blank)_ | Header text. |
| `position` | `right` | `left` \| `right` \| `top` \| `bottom` |
| `size` | `medium` | `small` \| `medium` \| `large` |
| `open` | `false` | Open state (reflected). _(boolean)_ |
| `show-close-icon` | `true` | Show the header close (X) button. _(boolean)_ |
| `backdrop` | `true` | Dim the page behind the drawer and block interaction with it. _(boolean)_ |
| `close-on-outside-click` | `true` | Clicking outside the panel closes it. _(boolean)_ |
| `prevent-scroll` | `true` | Prevent document scrolling while open. _(boolean)_ |
| `locale` | _(blank)_ | Locale override for built-in aria labels. |

Boolean attributes can be omitted, present, or set to `"false"` in HTML, for example
`backdrop="false"` or `show-close-icon`.

**Methods:** `show()` (void), `hide()` (returns a `Promise<void>` that resolves once the
close animation finishes and the drawer unmounts).
**Helpers:** `showLoomiDrawer(name)`, `hideLoomiDrawer(name)`.
**Events:** `open`, `close` (fires as the close animation starts, not when it finishes).
**Slot:** default (body).

## Focus Handling

Opening a drawer moves focus into it (the close button if shown, otherwise the first
focusable element, otherwise the panel itself). While `backdrop` is on, <kbd>Tab</kbd> is
trapped inside the panel; closing it restores focus to whatever was focused before — all
automatic, no setup needed.

## Full Example

```html
<loomi-button onclick="showLoomiDrawer('full-drawer')">Open Full Example</loomi-button>
<loomi-drawer
  name="full-drawer"
  title="Edit profile"
  position="right"
  size="large"
  show-close-icon
  backdrop
  close-on-outside-click="false"
  style="--loomi-drawer-duration: 0.4s;"
>
  <p>Only the close button or Escape can dismiss this one.</p>
</loomi-drawer>
```

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-drawer>` is a standard custom element, so the browser can use it in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/drawer` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomidev/drawer lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/drawer build
pnpm --filter @loomidev/drawer typecheck
```

### Choose your framework

<loomi-tabs>
<loomi-tab label="Plain HTML" active>

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/drawer"></script>

<loomi-drawer name="filters" title="Filters">
  Filter controls go here.
</loomi-drawer>
```

</loomi-tab>
<loomi-tab label="Bundlers and SPAs">

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/drawer";
```

</loomi-tab>
<loomi-tab label="Laravel Blade">

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomidev/drawer lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/drawer";
```

```blade
<loomi-drawer name="filters" title="Filters">
  Filter controls go here.
</loomi-drawer>
```

</loomi-tab>
<loomi-tab label="React">

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import "@loomidev/drawer";

export function LoomiExample() {
  return (
    <loomi-drawer name="filters" title="Filters">
      Filter controls go here.
    </loomi-drawer>
  );
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

</loomi-tab>
<loomi-tab label="Vue">

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import "@loomidev/drawer";
</script>

<template>
  <loomi-drawer name="filters" title="Filters">
    Filter controls go here.
  </loomi-drawer>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

</loomi-tab>
<loomi-tab label="Angular">

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomidev/drawer";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-drawer name="filters" title="Filters">
      Filter controls go here.
    </loomi-drawer>
  `,
})
export class AppComponent {}
```

</loomi-tab>
<loomi-tab label="Svelte and Astro">

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import "@loomidev/drawer";
</script>

<loomi-drawer name="filters" title="Filters">
  Filter controls go here.
</loomi-drawer>
```

```astro
---
import "@loomidev/drawer";
---

<loomi-drawer name="filters" title="Filters">
  Filter controls go here.
</loomi-drawer>
```

</loomi-tab>
</loomi-tabs>

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->
