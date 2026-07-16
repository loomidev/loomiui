# @loomidev/icon

`<loomi-icon>` — render an icon from the shared [`@loomidev/icons`](../icons) registry by
name, or any custom SVG via the default slot.

```bash
npm install @loomidev/icon lit
```

```js
import "@loomidev/icon";
```

## Basic Usage

```html
<loomi-icon name="bell-alert"></loomi-icon>
<loomi-icon name="check-circle"></loomi-icon>
<loomi-icon name="trash"></loomi-icon>
```

## Icon Sources

`source` picks which icon set `name` is looked up in. `heroicons` is the default.

```html
<loomi-icon name="bell-alert"></loomi-icon>
<!-- same as source="heroicons" -->

<loomi-icon source="iconsax" name="add"></loomi-icon>
<loomi-icon source="untitledui" name="user-02"></loomi-icon>
```

`heroicons` is inlined into `@loomidev/icon` at build time, so it renders instantly.
`iconsax` and `untitledui` are disk-based: the first time a page uses a given icon, it's
fetched as a real `.svg` file and cached in memory — every later use of that same icon,
anywhere on the page, is instant. Until that first fetch resolves, `<loomi-icon>` renders
a correctly-sized empty placeholder, so there's no layout jump.

### Outline, Solid, and Twotone

`variant` picks the visual style. Not every source ships every style:

| Source       | Available `variant` values                   |
| ------------ | -------------------------------------------- |
| `heroicons`  | `outline` (default), `solid`                 |
| `iconsax`    | `outline` (default), `solid`, `twotone`      |
| `untitledui` | `outline` (default; the only style it ships) |

Requesting a `variant` a source doesn't have (e.g. `source="untitledui" variant="solid"`)
falls back to `outline` rather than rendering nothing.

```html
<loomi-icon name="bell-alert" variant="outline"></loomi-icon>
<loomi-icon name="bell-alert" variant="solid"></loomi-icon>

<loomi-icon source="iconsax" name="add" variant="outline"></loomi-icon>
<loomi-icon source="iconsax" name="add" variant="solid"></loomi-icon>
<loomi-icon source="iconsax" name="add" variant="twotone"></loomi-icon>
```

## Icons From a Directory

Use `directory` when your project has custom icon files. The `name` becomes the file
name. If `name` has no extension, `.svg` is used.

`directory` is not resolved relative to the component package or the JavaScript module.
It is written directly into the rendered `<img src="...">`, so the browser resolves it
the same way it resolves any normal image URL in your page:

- `directory="assets/images"` is relative to the current page URL.
- `directory="/assets/images"` is root-relative to your site or app domain.
- `directory="https://cdn.example.com/icons"` is an absolute external URL.

```html
<loomi-icon name="airpods" directory="assets/images"></loomi-icon>
<!-- renders assets/images/airpods.svg -->

<loomi-icon name="airpods" directory="/assets/images"></loomi-icon>
<!-- renders /assets/images/airpods.svg -->

<loomi-icon name="airpods.png" directory="assets/images"></loomi-icon>
<!-- renders assets/images/airpods.png -->
```

## Sizing

Icons default to `1.5rem`. Set `size` to any CSS length — it's applied via the
`--loomi-icon-size` custom property, so you could also override that variable directly
from your own CSS if you'd rather size a whole group of icons at once.

```html
<loomi-icon name="star" size="1rem"></loomi-icon>
<loomi-icon name="star" size="2rem"></loomi-icon>
<loomi-icon name="star" size="3rem"></loomi-icon>
```

## Coloring

There's no `color` attribute — icons render with `currentColor`, so they
inherit the text color of whatever they're placed in. Set `color` (or `class`) on the
icon itself, or on a parent, like any other inline element.

```html
<loomi-icon name="bell-alert" style="color:#dc2626"></loomi-icon>
<span style="color:#16a34a">
  <loomi-icon name="check-circle"></loomi-icon> Saved
</span>
```

This doesn't apply to `branded` badges (below) — those always use the theme's `primary`
color, not the inherited/inline `color`.

## Branded Badges

Set `branded` to sit the icon on a rounded, primary-colored background instead of
rendering it bare — a common "featured icon" treatment for empty states, onboarding
steps, or notification list items.

```html
<loomi-icon source="iconsax" name="gift" variant="solid" branded shade="dark"></loomi-icon>
<loomi-icon source="untitledui" name="file-02" branded shade="light"></loomi-icon>
```

| Attribute | Default  | Description                                                                                                                               |
| --------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `branded` | `false`  | Renders the icon on a background badge instead of bare.                                                                                   |
| `shade`   | `light`  | `light` (soft primary tint behind a darker primary icon) \| `dark` (solid primary fill behind a white icon). Only applies when `branded`. |
| `radius`  | `medium` | Badge corner rounding: `none` \| `small` \| `medium` \| `full`. Only applies when `branded`.                                              |

The badge always uses the theme's `primary` color (the same `--loomi-primary-*` slots
every other component reads), so a single `:root { --loomi-primary-600: ...; }` override
re-skins every branded icon on the page along with everything else. Padding and the icon
itself both scale with `size`/`--loomi-icon-size`, so a bigger badge stays proportional.

## Accessible Labels

By default an icon is purely decorative (`aria-hidden="true"`) — appropriate when it
sits next to visible text (as in a button or tab heading). If the icon is the _only_
content conveying meaning (e.g. an icon-only button), set `label` so screen readers
announce it.

```html
<loomi-icon name="trash" label="Delete"></loomi-icon>
```

## Custom SVG

Don't have a registered icon for what you need? Drop any raw `<svg>` into the default
slot instead of setting `name` — it's sized and colored the same way (set its `stroke`
to `currentColor` and it'll inherit color the same as a registry icon).

```html
<loomi-icon size="2rem">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M12 2l2 7h7l-5.5 4 2 7-5.5-4-5.5 4 2-7L2 9h7z" />
  </svg>
</loomi-icon>
```

## Registering Custom Icons

For an icon you'll reuse across your app, register it once with the shared registry
instead of repeating raw SVG markup everywhere — it then becomes usable via `name` from
any component that renders icons (`<loomi-icon>`, `<loomi-button icon="...">`,
`<loomi-tab icon="...">`, `<loomi-alert icon="...">`, and more):

```js
import { registerLoomiIcon } from "@loomidev/icons";
import { svg } from "lit";

registerLoomiIcon("rocket", svg`<path d="…" />`);
```

```html
<loomi-icon name="rocket"></loomi-icon>
```

## Accessibility

For the library-wide baseline, see [Foundations — Accessibility](https://loomiui.com/foundations/#accessibility).

## Responsive behavior

For the shared container and viewport rules, see [Foundations — Responsive behavior](https://loomiui.com/foundations/#responsive-behavior).

## Dark mode

For theme activation, token overrides, and contrast guidance, see [Foundations — Dark mode](https://loomiui.com/foundations/#dark-mode).

## Attributes

| Attribute      | Default     | Description                                                                                                                                                                          |
| -------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `name`         | _(blank)_   | Registered icon name (see [`@loomidev/icons`](../icons)).                                                                                                                            |
| `source`       | `heroicons` | Icon set. `heroicons` \| `iconsax` \| `untitledui`. Ignored when `directory` is set.                                                                                                 |
| `variant`      | `outline`   | Visual style. `outline` \| `solid` \| `twotone` — availability depends on `source` (see [Outline, Solid, and Twotone](#outline-solid-and-twotone)). Ignored when `directory` is set. |
| `directory`    | _(blank)_   | Directory URL for file-based icons. Written directly to `<img src>`, so relative paths resolve from the current page URL; `.svg` is added when `name` has no extension.              |
| `size`         | _(blank)_   | CSS size, e.g. `1.5rem`, `32px`. Sets `--loomi-icon-size`.                                                                                                                           |
| `stroke-width` | `1.5`       | Stroke width. Heroicons `outline` only — `iconsax` and `untitledui` ship a fixed weight per icon.                                                                                    |
| `label`        | _(blank)_   | Accessible label; when omitted the icon is `aria-hidden`.                                                                                                                            |
| `branded`      | `false`     | Renders the icon on a primary-colored background badge (see [Branded Badges](#branded-badges)).                                                                                      |
| `shade`        | `light`     | Badge background: `light` \| `dark`. Only applies when `branded`.                                                                                                                    |
| `radius`       | `medium`    | Badge corner radius: `none` \| `small` \| `medium` \| `full`. Only applies when `branded`.                                                                                           |

## Slots

| Slot        | Description                          |
| ----------- | ------------------------------------ |
| _(default)_ | Content placed inside the component. |

## Full Example

```html
<loomi-icon
  name="bell-alert"
  variant="solid"
  size="2rem"
  label="Notifications"
  style="color:#7c3aed"
></loomi-icon>

<loomi-icon
  source="iconsax"
  name="notification"
  variant="twotone"
  size="2rem"
  label="Notifications"
  style="color:#7c3aed"
></loomi-icon>
```

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-icon>` is a standard custom element, so the browser can use it in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/icon` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomidev/icon lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/icon build
pnpm --filter @loomidev/icon typecheck
```

### Choose your framework

<loomi-tabs>
<loomi-tab label="HTML" active>

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/icon"></script>

<loomi-icon name="bell-alert" variant="outline" size="1.5rem" label="Notifications"></loomi-icon>
```

</loomi-tab>
<loomi-tab label="Bundlers and SPAs">

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/icon";
```

</loomi-tab>
<loomi-tab label="Blade">

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomidev/icon lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/icon";
```

```blade
<loomi-icon name="bell-alert" variant="outline" size="1.5rem" label="Notifications"></loomi-icon>
```

</loomi-tab>
<loomi-tab label="React">

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import "@loomidev/icon";

export function LoomiExample() {
  return (
    <loomi-icon name="bell-alert" variant="outline" size="1.5rem" label="Notifications"></loomi-icon>
  );
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

</loomi-tab>
<loomi-tab label="Vue">

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import "@loomidev/icon";
</script>

<template>
  <loomi-icon name="bell-alert" variant="outline" size="1.5rem" label="Notifications"></loomi-icon>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

</loomi-tab>
<loomi-tab label="Angular">

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomidev/icon";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-icon name="bell-alert" variant="outline" size="1.5rem" label="Notifications"></loomi-icon>
  `,
})
export class AppComponent {}
```

</loomi-tab>
<loomi-tab label="Svelte / Astro">

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import "@loomidev/icon";
</script>

<loomi-icon name="bell-alert" variant="outline" size="1.5rem" label="Notifications"></loomi-icon>
```

```astro
---
import "@loomidev/icon";
---

<loomi-icon name="bell-alert" variant="outline" size="1.5rem" label="Notifications"></loomi-icon>
```

</loomi-tab>
</loomi-tabs>

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->

## Dependencies

- `@loomidev/core`
- `@loomidev/icons`
