# @loomidev/floating-panel

`<loomi-floating-panel>` — a draggable, resizable panel that floats above the page,
unanchored to any trigger. Think devtools panel, help widget, or a chat window you can
drag around and resize.

```bash
npm install @loomidev/floating-panel lit
```

```js
import "@loomidev/floating-panel";
```

## Basic Usage

Every panel is opened and closed by its unique `name`, using the exported
`showLoomiFloatingPanel()` / `hideLoomiFloatingPanel()` helpers (or the instance methods
`show()`/`hide()` if you already have a reference to the element). With no `top`/`left`
attribute, it opens centered in the viewport.

```html
<loomi-button onclick="showLoomiFloatingPanel('help')">Open help</loomi-button>

<loomi-floating-panel name="help" title="Need a hand?">
  Drag the header to move me, or grab an edge/corner to resize.
</loomi-floating-panel>

<script type="module">
  import { showLoomiFloatingPanel } from "@loomidev/floating-panel";
</script>
```

## Position & Size

`top`/`left` and `width`/`height` accept any CSS length and set the panel's initial rect.
Once the user drags or resizes it, the panel tracks its own pixel position from then on.

```html
<loomi-floating-panel
  name="notes"
  title="Notes"
  top="4rem"
  left="4rem"
  width="20rem"
  height="16rem"
>
  Opens pinned to the top-left instead of centered.
</loomi-floating-panel>
```

`min-width`/`min-height`/`max-width`/`max-height` (plain pixel numbers) constrain
resizing. `bounded` (default `true`) keeps the panel's edges inside the viewport while
dragging or resizing; set `bounded="false"` to allow it to move fully off-screen.

## Dragging & Resizing

Both are on by default. `no-drag` disables moving the panel by its header; `resizable="false"`
removes all eight resize handles.

```html
<loomi-floating-panel name="pinned" title="Pinned" no-drag resizable="false">
  Fixed in place — no header drag, no resize handles.
</loomi-floating-panel>
```

The header and each resize handle are keyboard-operable: focus the header and press the
arrow keys to move the panel; focus a resize handle and press the arrow keys to resize
from that edge/corner. Hold <kbd>Shift</kbd> for a bigger step.

## Minimize, Maximize & Drag Handle

`minimize` and `maximize` add header buttons that toggle collapsing the panel to just its
title bar, or expanding it to fill the viewport — both off by default. `drag-handle`
restricts dragging to a small grip icon instead of the whole header, useful once you add
your own interactive content there.

```html
<loomi-floating-panel name="window" title="Window-like" minimize maximize drag-handle>
  Minimize/maximize buttons appear in the header; only the grip icon drags.
</loomi-floating-panel>
```

Toggling either fires `loomi-minimize`/`loomi-maximize`; maximizing clears `minimized` and
vice versa, since a panel can't be both at once. Restoring from maximized snaps back to
the exact rect the panel had before — dragging and resizing are disabled while maximized
(and resizing while minimized, since there's no body to resize into). Double-clicking the
header also toggles maximize, when `maximize` is enabled.

## Multiple Panels & Stacking

Open as many panels as you like — clicking or dragging anywhere inside a panel (header,
body, or a resize handle) brings it to the front of the stack automatically, so the last
one you touched is always on top.

```html
<loomi-floating-panel name="a" title="Panel A" top="3rem" left="3rem">First</loomi-floating-panel>
<loomi-floating-panel name="b" title="Panel B" top="6rem" left="20rem">Second</loomi-floating-panel>
```

## Persisting Layout

Set `auto-save-id` to remember the panel's position and size in `localStorage` across
page reloads.

```html
<loomi-floating-panel name="chat" title="Support chat" auto-save-id="support-chat">
  Comes back exactly where you left it.
</loomi-floating-panel>
```

## Events

```js
const panel = document.querySelector('loomi-floating-panel[name="help"]');
panel.addEventListener("open", () => console.log("opened"));
panel.addEventListener("close", () => console.log("closed"));
panel.addEventListener("loomi-drag", (e) => console.log("moved to", e.detail)); // { top, left }
panel.addEventListener("loomi-resize", (e) => console.log("resized to", e.detail)); // { top, left, width, height }
panel.addEventListener("loomi-minimize", (e) => console.log("minimized:", e.detail.minimized));
panel.addEventListener("loomi-maximize", (e) => console.log("maximized:", e.detail.maximized));
```

## Accessibility

`<loomi-floating-panel>` renders as `role="dialog"` with `aria-modal="false"` — it never
traps focus or blocks the rest of the page, since it floats alongside content rather than
over it. Opening a panel moves focus to its header; closing it restores focus to whatever
was focused before, and <kbd>Escape</kbd> closes the panel only while focus is inside it
(so multiple open panels don't all close on one keypress).

- <kbd>Tab</kbd> / <kbd>Shift+Tab</kbd> — reach the minimize/maximize/close buttons,
  slotted content, and every resize handle (or the grip, when `drag-handle` is set).
- Arrow keys on the focused header (or grip) — move the panel; hold <kbd>Shift</kbd> for
  a 10px step.
- Arrow keys on a focused resize handle — resize from that edge/corner; hold
  <kbd>Shift</kbd> for a 10px step.
- <kbd>Escape</kbd> — close, while focus is inside the panel.
- Visible `:focus-visible` rings on the header, grip, header buttons, and resize handles.

For the library-wide baseline, see [Foundations — Accessibility](https://loomiui.com/foundations/#accessibility).

## Responsive behavior

The panel caps itself to `100dvw`/`100dvh` so it can never overflow the viewport even if
`width`/`height` are set larger than the screen, and `bounded` (on by default) keeps its
edges from being dragged or resized outside the viewport. On narrow viewports the header
and body padding tighten below a `480px` breakpoint.

For the shared container and viewport rules, see [Foundations — Responsive behavior](https://loomiui.com/foundations/#responsive-behavior).

## Dark mode

Uses semantic `--loomi-surface`, `--loomi-surface-border`, `--loomi-text`, and
`--loomi-text-secondary`/`--loomi-text-faint` tokens instead of hard-coded colors. Add
`.dark` to your app root with `@loomidev/theme-switcher`, or provide your own token
overrides, and the panel inherits the dark-mode values through its shadow DOM.

For theme activation, token overrides, and contrast guidance, see [Foundations — Dark mode](https://loomiui.com/foundations/#dark-mode).

## Attributes

| Attribute         | Default       | Description                                                                         |
| ----------------- | ------------- | ----------------------------------------------------------------------------------- |
| `name`            | _(blank)_     | Unique name for `showLoomiFloatingPanel()` / `hideLoomiFloatingPanel()`.            |
| `title`           | _(blank)_     | Header text.                                                                        |
| `open`            | `false`       | Open state (reflected). _(boolean)_                                                 |
| `show-close-icon` | `true`        | Show the header close (X) button. _(boolean)_                                       |
| `resizable`       | `true`        | Show the eight edge/corner resize handles. _(boolean)_                              |
| `no-drag`         | `false`       | Disable moving the panel by its header. _(boolean)_                                 |
| `bounded`         | `true`        | Keep the panel's edges inside the viewport while dragging/resizing. _(boolean)_     |
| `minimize`        | `false`       | Show a header button that collapses the panel to its title bar. _(boolean)_         |
| `maximize`        | `false`       | Show a header button that expands the panel to fill the viewport. _(boolean)_       |
| `drag-handle`     | `false`       | Restrict dragging to a dedicated grip icon instead of the whole header. _(boolean)_ |
| `minimized`       | `false`       | Current collapsed state (reflected); settable up front too. _(boolean)_             |
| `maximized`       | `false`       | Current fill-the-viewport state (reflected); settable up front too. _(boolean)_     |
| `top`             | _(blank)_     | Initial vertical position, any CSS length. Unset opens centered.                    |
| `left`            | _(blank)_     | Initial horizontal position, any CSS length. Unset opens centered.                  |
| `width`           | _(blank)_     | Initial width, any CSS length. Unset falls back to `22rem`.                         |
| `height`          | _(blank)_     | Initial height, any CSS length. Unset falls back to `26rem`.                        |
| `min-width`       | `220`         | Minimum width in pixels while resizing. _(number)_                                  |
| `min-height`      | `140`         | Minimum height in pixels while resizing. _(number)_                                 |
| `max-width`       | _(unbounded)_ | Maximum width in pixels while resizing. _(number)_                                  |
| `max-height`      | _(unbounded)_ | Maximum height in pixels while resizing. _(number)_                                 |
| `auto-save-id`    | _(blank)_     | Persist position/size to `localStorage` under this key.                             |
| `locale`          | _(blank)_     | Locale override for built-in aria labels.                                           |

Boolean attributes can be omitted, present, or set to `"false"` in HTML, for example
`resizable="false"` or `no-drag`.

**Methods:** `show()`, `hide()` (both void).
**Helpers:** `showLoomiFloatingPanel(name)`, `hideLoomiFloatingPanel(name)`.
**Events:** `open`, `close`, `loomi-drag` (`detail: { top, left }`), `loomi-resize`
(`detail: { top, left, width, height }`), `loomi-minimize` (`detail: { minimized }`),
`loomi-maximize` (`detail: { maximized }`).
**Slot:** default (body).

## Full Example

```html
<loomi-button onclick="showLoomiFloatingPanel('full-panel')">Open Full Example</loomi-button>
<loomi-floating-panel
  name="full-panel"
  title="Support chat"
  top="5rem"
  left="5rem"
  width="24rem"
  height="28rem"
  min-width="260"
  min-height="180"
  auto-save-id="support-chat"
>
  <p>Drag me, resize me, reload the page — I'll come back right here.</p>
</loomi-floating-panel>
```

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-floating-panel>` is a standard custom element, so the browser can use it in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/floating-panel` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomidev/floating-panel lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/floating-panel build
pnpm --filter @loomidev/floating-panel typecheck
```

### Choose your framework

<loomi-tabs>
<loomi-tab label="HTML" active>

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/floating-panel"></script>

<loomi-floating-panel name="help" title="Need a hand?">
  Drag the header to move me, or grab an edge/corner to resize.
</loomi-floating-panel>
```

</loomi-tab>
<loomi-tab label="Bundlers and SPAs">

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/floating-panel";
```

</loomi-tab>
<loomi-tab label="Blade">

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomidev/floating-panel lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/floating-panel";
```

```blade
<loomi-floating-panel name="help" title="Need a hand?">
  Drag the header to move me, or grab an edge/corner to resize.
</loomi-floating-panel>
```

</loomi-tab>
<loomi-tab label="React">

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import "@loomidev/floating-panel";

export function LoomiExample() {
  return (
    <loomi-floating-panel name="help" title="Need a hand?">
      Drag the header to move me, or grab an edge/corner to resize.
    </loomi-floating-panel>
  );
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

</loomi-tab>
<loomi-tab label="Vue">

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import "@loomidev/floating-panel";
</script>

<template>
  <loomi-floating-panel name="help" title="Need a hand?">
    Drag the header to move me, or grab an edge/corner to resize.
  </loomi-floating-panel>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

</loomi-tab>
<loomi-tab label="Angular">

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomidev/floating-panel";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-floating-panel name="help" title="Need a hand?">
      Drag the header to move me, or grab an edge/corner to resize.
    </loomi-floating-panel>
  `,
})
export class AppComponent {}
```

</loomi-tab>
<loomi-tab label="Svelte / Astro">

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import "@loomidev/floating-panel";
</script>

<loomi-floating-panel name="help" title="Need a hand?">
  Drag the header to move me, or grab an edge/corner to resize.
</loomi-floating-panel>
```

```astro
---
import "@loomidev/floating-panel";
---

<loomi-floating-panel name="help" title="Need a hand?">
  Drag the header to move me, or grab an edge/corner to resize.
</loomi-floating-panel>
```

</loomi-tab>
</loomi-tabs>

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->

## Dependencies

- `@loomidev/core`
- `@loomidev/icon`
