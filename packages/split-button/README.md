# @loomidev/split-button

`<loomi-split-button>` is a primary action with a caret beside it that opens a menu of
related actions — "Create course ▾" → _Import courses_, _Course templates_.

It is different from [`<loomi-button-group>`](../button-group), which is a segmented
pick-one control, and from [`<loomi-dropmenu>`](../dropmenu), which is the menu half on its
own. Reach for a split button when one action is clearly the common case and the rest are
variations on it.

```bash
npm install @loomidev/split-button lit
```

```js
import "@loomidev/split-button";
```

## Basic Usage

The default slot is the primary half's label. Menu rows go in the `menu` slot as
[`<loomi-dropmenu-item>`](../dropmenu) elements, so every item feature — icons, shortcuts,
headers, dividers, checkbox/radio rows, destructive styling — works here unchanged.

```html
<loomi-split-button>
  Create course
  <loomi-dropmenu-item slot="menu" icon="arrow-down-tray">Import courses</loomi-dropmenu-item>
  <loomi-dropmenu-item slot="menu" icon="document-duplicate">Course templates</loomi-dropmenu-item>
</loomi-split-button>
```

Clicking the primary half runs the primary action and **never** opens the menu. Only the
caret opens it.

## It Works Inside Scrolling and Clipped Containers

The menu panel is promoted to the browser's **top layer** using the popover API, so it is
never clipped by an ancestor's `overflow`. This is the reason to use a split button rather
than hand-rolling one from a button plus a `<loomi-dropmenu>`: the dropmenu's panel is
positioned inside its own host, so any ancestor with `overflow: hidden` or
`overflow-x: auto` — a table wrapper, a card body, a scroll area — cuts it off.

```html
<div style="overflow: hidden; border-radius: 0.75rem">
  <table>
    <tr>
      <td>Introduction to Ceramics</td>
      <td>
        <loomi-split-button size="small">
          Publish
          <loomi-dropmenu-item slot="menu">Schedule…</loomi-dropmenu-item>
          <loomi-dropmenu-item slot="menu" variant="destructive">Unpublish</loomi-dropmenu-item>
        </loomi-split-button>
      </td>
    </tr>
  </table>
</div>
```

On a browser without popover support the panel falls back to plain `position: fixed`,
which still escapes ordinary `overflow` clipping — it degrades rather than breaking.

## Matching `<loomi-button>`

Both halves are real `<loomi-button>` elements, so the visual attributes are the same ones
you already know and the two halves cannot drift apart.

```html
<loomi-split-button type="secondary">Save<loomi-dropmenu-item slot="menu">Save as draft</loomi-dropmenu-item></loomi-split-button>
<loomi-split-button color="error" outline>Delete<loomi-dropmenu-item slot="menu">Delete all</loomi-dropmenu-item></loomi-split-button>
<loomi-split-button size="small" radius="full">Add<loomi-dropmenu-item slot="menu">Add many</loomi-dropmenu-item></loomi-split-button>
```

## Icons, Spinners and Links

`icon`, `has-spinner`/`show-spinner`, `can-submit`, and `tag`/`href` apply to the primary
half, exactly as on a plain button.

```html
<loomi-split-button icon="plus">
  New lesson
  <loomi-dropmenu-item slot="menu">New quiz</loomi-dropmenu-item>
</loomi-split-button>

<loomi-split-button has-spinner id="save">
  Save
  <loomi-dropmenu-item slot="menu">Save and close</loomi-dropmenu-item>
</loomi-split-button>
```

```js
const el = document.querySelector("#save");
el.addEventListener("click", async () => {
  el.showSpinner = true;
  await save();
  el.showSpinner = false;
});
```

## Menu Placement

`placement` is `auto` by default: the panel opens below the pair, aligned to the caret
(end) edge, and flips above or to the other edge only when the viewport leaves it no room.
Set it explicitly to pin one behavior.

```html
<loomi-split-button placement="bottom-start">
  Export
  <loomi-dropmenu-item slot="menu">Export as CSV</loomi-dropmenu-item>
</loomi-split-button>
```

## Dividing the Items

```html
<loomi-split-button divided>
  Create course
  <loomi-dropmenu-item slot="menu">Import courses</loomi-dropmenu-item>
  <loomi-dropmenu-item slot="menu">Course templates</loomi-dropmenu-item>
</loomi-split-button>
```

## Keeping the Menu Open After a Click

The menu closes when an item is chosen. Set `hide-after-click="false"` to keep it open —
useful for a menu of toggles. Checkbox and radio items, and items with a submenu, keep the
menu open regardless.

```html
<loomi-split-button hide-after-click="false">
  Columns
  <loomi-dropmenu-item slot="menu" checkbox checked>Title</loomi-dropmenu-item>
  <loomi-dropmenu-item slot="menu" checkbox>Enrolled</loomi-dropmenu-item>
</loomi-split-button>
```

## Disabling

`disabled` disables both halves. `menu-disabled` disables only the caret, leaving the
primary action usable.

```html
<loomi-split-button disabled>Create course</loomi-split-button>
<loomi-split-button menu-disabled>
  Create course
  <loomi-dropmenu-item slot="menu">Import courses</loomi-dropmenu-item>
</loomi-split-button>
```

## Styling

Every structural piece is a CSS `part`, so you can restyle without reverse-engineering
custom properties.

```css
loomi-split-button::part(primary-button) {
  min-width: 10rem;
}
loomi-split-button::part(divider) {
  background: rgba(0, 0, 0, 0.25);
}
loomi-split-button::part(panel) {
  border-radius: 1rem;
}
```

| Custom property                 | Default                     | Description                                        |
| ------------------------------- | --------------------------- | -------------------------------------------------- |
| `--loomi-split-divider-color`   | `rgba(255, 255, 255, 0.35)` | The seam between the halves on a solid button.     |
| `--loomi-split-caret-pad`       | `0.5rem`                    | Horizontal padding on the caret half.              |
| `--loomi-split-panel-min-width` | `max-content`               | Set to `var(--loomi-anchor-width)` to match width. |
| `--loomi-split-panel-padding`   | `0.25rem`                   | Padding inside the panel.                          |
| `--loomi-split-panel-radius`    | `0.625rem`                  | Panel corner radius.                               |
| `--loomi-split-z-index`         | `1000`                      | Only relevant in the no-popover fallback.          |

The panel exposes `--loomi-anchor-width` (the measured width of the button pair), so
a menu that should be at least as wide as its button is one line:

```css
loomi-split-button::part(panel) {
  min-width: var(--loomi-anchor-width);
}
```

## Accessibility

- The caret carries `aria-haspopup="menu"` and `aria-expanded`, set on the real `<button>`
  inside it, and takes its accessible name from `menu-label` (default `"More actions"`)
  since it has no visible text.
- The panel is a `role="menu"`; rows are `<loomi-dropmenu-item>` menu items.
- `ArrowDown`/`ArrowUp` on the caret opens the menu and focuses the first/last item.
  Arrows, `Home` and `End` move between items; `Enter`/`Space` activates one.
- `Escape` closes the menu and returns focus to the caret. `Tab` closes it and lets focus
  continue normally — a menu button is not a focus trap.
- The primary half is a plain button: activating it never opens the menu.
- The host delegates focus and implements `focus()`/`blur()`, so `el.focus()` lands on the
  primary half.
- Supports keyboard focus with visible `:focus-visible` styling on interactive controls.

## Responsive behavior

- The panel is capped at `min(22rem, 100vw - 1rem)` and clamped into the viewport, so it
  stays fully visible on narrow screens.
- Fluid width (`width: 100%`, `min-width: 0`) within flex and grid layouts.

## Dark mode

- Uses semantic `--loomi-surface`, `--loomi-surface-border`, and `--loomi-text` tokens where applicable.
- Respects `.dark` on `<html>` via `@loomidev/theme-switcher` or your app theme.

## Attributes

| Attribute          | Default         | Description                                                                        |
| ------------------ | --------------- | ---------------------------------------------------------------------------------- |
| `type`             | `primary`       | `primary` (solid) or `secondary` (bordered ghost). Applied to both halves.         |
| `color`            | _(from `type`)_ | `primary` \| `secondary` \| `info` \| `success` \| `error` \| `warning` \| `gray`. |
| `size`             | `regular`       | `tiny` \| `small` \| `regular` \| `medium` \| `big`.                               |
| `radius`           | `medium`        | `none` \| `small` \| `medium` \| `full`. Only the outer corners are rounded.       |
| `outline`          | `false`         | Render both halves as outlines.                                                    |
| `border-width`     | `2`             | Outline border width. Also sets the width of the seam between the halves.          |
| `icon`             | _(blank)_       | Icon name for the primary half.                                                    |
| `icon-right`       | `false`         | Put the primary half's icon after its label.                                       |
| `disabled`         | `false`         | Disable both halves.                                                               |
| `menu-disabled`    | `false`         | Disable only the caret.                                                            |
| `tag`              | `button`        | Render the primary half as `button` or `a`.                                        |
| `href`             | _(blank)_       | Link target for the primary half; implies `tag="a"`.                               |
| `can-submit`       | `false`         | Render the primary half as `type="submit"`.                                        |
| `has-spinner`      | `false`         | Give the primary half a spinner (hidden until `show-spinner`).                     |
| `show-spinner`     | `false`         | Show the primary half's spinner.                                                   |
| `uppercase`        | `false`         | Uppercase the primary half's label.                                                |
| `placement`        | `auto`          | `auto` \| `bottom-start` \| `bottom-end` \| `top-start` \| `top-end`.              |
| `divided`          | `false`         | Hairline between menu items.                                                       |
| `hide-after-click` | `true`          | Close the menu when an item is chosen.                                             |
| `menu-label`       | `More actions`  | Accessible name for the caret.                                                     |
| `open-menu`        | _(reflected)_   | Present while the menu is open. Read-only — use `show()`/`hide()` to change it.    |

**Properties:** every attribute above is also a property (`hideAfterClick`, `menuLabel`,
`borderWidth`, …), plus `isOpen` (read-only).

**Methods:** `show()`, `hide()`, `focus()`, `blur()`.

## Slots

| Slot      | Description                                        |
| --------- | -------------------------------------------------- |
| _default_ | The primary half's label.                          |
| `menu`    | `<loomi-dropmenu-item>` rows for the caret's menu. |

## Parts

| Part             | Description                                |
| ---------------- | ------------------------------------------ |
| `split`          | The wrapper holding both halves.           |
| `primary`        | The primary half (`<loomi-button>` host).  |
| `primary-button` | The primary half's inner `<button>`/`<a>`. |
| `divider`        | The seam between the two halves.           |
| `caret`          | The caret half (`<loomi-button>` host).    |
| `caret-button`   | The caret's inner `<button>`.              |
| `panel`          | The floating menu panel.                   |

## Events

| Event                | Description                                                             |
| -------------------- | ----------------------------------------------------------------------- |
| `click`              | Native click from either half. Check `event.target` to tell them apart. |
| `loomi-split-toggle` | `detail: { open }` when the menu opens or closes.                       |

Menu item clicks bubble from the `<loomi-dropmenu-item>` elements themselves, so listen on
the item — or on the split button, and read `event.target`.

```js
document.querySelector("loomi-split-button").addEventListener("click", (event) => {
  const item = event.target.closest?.("loomi-dropmenu-item");
  if (item) console.log("menu action:", item.textContent.trim());
});
```

## Full Example

```html
<loomi-split-button color="success" icon="plus" menu-label="More create options" divided>
  Create course
  <loomi-dropmenu-item slot="menu" header>From existing</loomi-dropmenu-item>
  <loomi-dropmenu-item slot="menu" icon="arrow-down-tray" shortcut="⌘I">Import courses</loomi-dropmenu-item>
  <loomi-dropmenu-item slot="menu" icon="document-duplicate">Course templates</loomi-dropmenu-item>
  <loomi-dropmenu-item slot="menu" divider></loomi-dropmenu-item>
  <loomi-dropmenu-item slot="menu" icon="trash" variant="destructive">Clear drafts</loomi-dropmenu-item>
</loomi-split-button>
```

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-dropmenu-item>` and `<loomi-dropmenu>` are standard custom elements, so the browser can use them in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/dropmenu` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomidev/split-button lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/split-button build
pnpm --filter @loomidev/split-button typecheck
```

### Choose your framework

<loomi-tabs>
<loomi-tab label="HTML" active>

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/split-button"></script>

<loomi-dropmenu>
  <span slot="trigger" style="font-weight:600">Actions</span>
  <loomi-dropmenu-item icon="pencil-square">Edit</loomi-dropmenu-item>
  <loomi-dropmenu-item icon="trash">Delete</loomi-dropmenu-item>
</loomi-dropmenu>
```

</loomi-tab>
<loomi-tab label="Bundlers and SPAs">

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/split-button";
```

</loomi-tab>
<loomi-tab label="Blade">

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomidev/split-button lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/split-button";
```

```blade
<loomi-dropmenu>
  <span slot="trigger" style="font-weight:600">Actions</span>
  <loomi-dropmenu-item icon="pencil-square">Edit</loomi-dropmenu-item>
  <loomi-dropmenu-item icon="trash">Delete</loomi-dropmenu-item>
</loomi-dropmenu>
```

</loomi-tab>
<loomi-tab label="React">

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import "@loomidev/split-button";

export function LoomiExample() {
  return (
    <loomi-dropmenu>
      <span slot="trigger" style="font-weight:600">Actions</span>
      <loomi-dropmenu-item icon="pencil-square">Edit</loomi-dropmenu-item>
      <loomi-dropmenu-item icon="trash">Delete</loomi-dropmenu-item>
    </loomi-dropmenu>
  );
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

</loomi-tab>
<loomi-tab label="Vue">

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import "@loomidev/split-button";
</script>

<template>
  <loomi-dropmenu>
    <span slot="trigger" style="font-weight:600">Actions</span>
    <loomi-dropmenu-item icon="pencil-square">Edit</loomi-dropmenu-item>
    <loomi-dropmenu-item icon="trash">Delete</loomi-dropmenu-item>
  </loomi-dropmenu>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

</loomi-tab>
<loomi-tab label="Angular">

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomidev/split-button";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-dropmenu>
      <span slot="trigger" style="font-weight:600">Actions</span>
      <loomi-dropmenu-item icon="pencil-square">Edit</loomi-dropmenu-item>
      <loomi-dropmenu-item icon="trash">Delete</loomi-dropmenu-item>
    </loomi-dropmenu>
  `,
})
export class AppComponent {}
```

</loomi-tab>
<loomi-tab label="Svelte / Astro">

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import "@loomidev/split-button";
</script>

<loomi-dropmenu>
  <span slot="trigger" style="font-weight:600">Actions</span>
  <loomi-dropmenu-item icon="pencil-square">Edit</loomi-dropmenu-item>
  <loomi-dropmenu-item icon="trash">Delete</loomi-dropmenu-item>
</loomi-dropmenu>
```

```astro
---
import "@loomidev/split-button";
---

<loomi-dropmenu>
  <span slot="trigger" style="font-weight:600">Actions</span>
  <loomi-dropmenu-item icon="pencil-square">Edit</loomi-dropmenu-item>
  <loomi-dropmenu-item icon="trash">Delete</loomi-dropmenu-item>
</loomi-dropmenu>
```

</loomi-tab>
</loomi-tabs>

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->

## Dependencies

- `@loomidev/button`
- `@loomidev/core`
- `@loomidev/dropmenu`
