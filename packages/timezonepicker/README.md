# @loomidev/timezonepicker

`<loomi-timezonepicker>` — a searchable dropdown over the full IANA timezone database
(`Intl.supportedValuesOf("timeZone")`). Each row shows its live local time and current
UTC offset (DST-aware, recomputed — never a baked-in value), and a pinned "Use my
timezone" row lets a visitor pick their own browser-detected zone in one click.
**Form-associated**: submits the IANA id (e.g. `"Africa/Accra"`) under `name`.

```bash
npm install @loomidev/timezonepicker lit
```

```js
import "@loomidev/timezonepicker";
```

## Basic Usage

Ships with its own built-in zone list — there's no `data` attribute to wire up.

```html
<loomi-timezonepicker name="timezone" label="Timezone"></loomi-timezonepicker>
```

## Selecting a Value

`selection` accepts a canonical IANA id or a bare city name (the zone's last path
segment), case-insensitively.

```html
<loomi-timezonepicker selection="Africa/Accra"></loomi-timezonepicker>
<loomi-timezonepicker selection="accra"></loomi-timezonepicker>
```

`selection` isn't just a one-time initial value — setting it again later (as an
attribute or the `.selection` property) re-syncs the visible selection.

```js
document.querySelector("loomi-timezonepicker").selection = "Asia/Tokyo"; // updates immediately
```

## Use My Timezone

Opening the panel shows a pinned row above the search results — `Intl.DateTimeFormat().resolvedOptions().timeZone`
plus its current offset — so a visitor can pick their own zone in one click instead of
typing a city name. It's opt-in (a click), never auto-selected on connect, so it never
fights with a `selection` you set yourself.

## Placeholder vs Label

Same convention as `<loomi-select>` and `<loomi-countries>`: `placeholder` shows hint
text that disappears once something is selected; `label` is always visible and floats
above the trigger once a value is chosen.

```html
<loomi-timezonepicker placeholder="What timezone are you in?"></loomi-timezonepicker>
<loomi-timezonepicker label="Timezone" required></loomi-timezonepicker>
```

## Disabled & Readonly

```html
<loomi-timezonepicker disabled label="Timezone"></loomi-timezonepicker>
<loomi-timezonepicker readonly selection="Africa/Accra" label="Timezone"></loomi-timezonepicker>
```

## Searching

Typing in the panel's search box matches against the city, region, full IANA id, and
the offset label (e.g. typing `"+5"` or `"UTC+05"` finds every zone at that offset).

## Reacting to Selection

```js
const el = document.querySelector("loomi-timezonepicker");
el.addEventListener("select", (e) => {
  console.log(e.detail); // { id, city, region, offsetLabel }
});
```

## Get the Selected Value on Form Submission

Every `<loomi-timezonepicker>` participates in `ElementInternals` form association, so
its value submits like a native form control under whatever `name` you gave it.

```js
new FormData(form).get("timezone"); // "Africa/Accra"
```

## Sizes

```html
<loomi-timezonepicker size="small" label="Timezone"></loomi-timezonepicker>
<loomi-timezonepicker size="regular" label="Timezone"></loomi-timezonepicker>
<loomi-timezonepicker size="medium" label="Timezone"></loomi-timezonepicker>
<loomi-timezonepicker size="big" label="Timezone"></loomi-timezonepicker>
```

## Accessibility

For the library-wide baseline, see [Foundations — Accessibility](https://loomiui.com/foundations/#accessibility).

## Responsive behavior

For the shared container and viewport rules, see [Foundations — Responsive behavior](https://loomiui.com/foundations/#responsive-behavior).

## Dark mode

For theme activation, token overrides, and contrast guidance, see [Foundations — Dark mode](https://loomiui.com/foundations/#dark-mode).

## Attributes

| Attribute           | Default              | Description                                                        |
| ------------------- | -------------------- | ------------------------------------------------------------------ |
| `name`              | _(blank)_            | Submitted with the form.                                           |
| `placeholder`       | `Select a timezone`  | Trigger text when nothing is selected.                             |
| `label`             | _(blank)_            | Floating label (takes precedence over placeholder).                |
| `selection`         | _(blank)_            | Canonical IANA id or bare city name; resolves to the canonical id. |
| `locale`            | _(blank)_            | Locale used to format each zone's current local time.              |
| `disabled`          | `false`              | Disable the picker. _(boolean)_                                    |
| `readonly`          | `false`              | Read-only (cannot open). _(boolean)_                               |
| `required`          | `false`              | Marks the field required. _(boolean)_                              |
| `size`              | `medium`             | `tiny` \| `small` \| `regular` \| `medium` \| `big`                |
| `variant`           | `default`            | `default` \| `minimal` (bottom border only, no box)                |
| `empty-placeholder` | `No timezones found` | Text shown when search matches nothing.                            |
| `no-clearing`       | `false`              | Remove the default bottom margin. _(boolean)_                      |

**Parts:** `trigger`, `panel`. **Methods:** `reset()`, `validate()`. **Events:**
`loomi-select` (`detail: { id, city, region, offsetLabel }`), `change` (composed).

## Full Example

```html
<loomi-timezonepicker
  name="timezone"
  label="What timezone are you in?"
  required
  selection="Africa/Accra"
  size="big"
></loomi-timezonepicker>
```

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-timezonepicker>` is a standard custom element, so the browser can use it in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/timezonepicker` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomidev/timezonepicker lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/timezonepicker build
pnpm --filter @loomidev/timezonepicker typecheck
```

### Choose your framework

<loomi-tabs>
<loomi-tab label="HTML" active>

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/timezonepicker"></script>

<loomi-timezonepicker name="timezone" label="Timezone"></loomi-timezonepicker>
```

</loomi-tab>
<loomi-tab label="Bundlers and SPAs">

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/timezonepicker";
```

Because this is a form-capable component, give it a `name` when it should submit with a native `<form>`. Read its value with `new FormData(form).get("the-name")` just like you would for a built-in input.

</loomi-tab>
<loomi-tab label="Blade">

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomidev/timezonepicker lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/timezonepicker";
```

```blade
<loomi-timezonepicker
  name="timezone"
  label="Timezone"
></loomi-timezonepicker>
```

</loomi-tab>
<loomi-tab label="React">

React can render Loomi tags directly.

```jsx
import "@loomidev/timezonepicker";

export function LoomiExample() {
  return <loomi-timezonepicker name="timezone" label="Timezone"></loomi-timezonepicker>;
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

</loomi-tab>
<loomi-tab label="Vue">

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly.

```vue
<script setup>
import "@loomidev/timezonepicker";
</script>

<template>
  <loomi-timezonepicker name="timezone" label="Timezone"></loomi-timezonepicker>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

</loomi-tab>
<loomi-tab label="Angular">

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import "@loomidev/timezonepicker";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<loomi-timezonepicker name="timezone" label="Timezone"></loomi-timezonepicker>`,
})
export class AppComponent {}
```

</loomi-tab>
<loomi-tab label="Svelte / Astro">

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import "@loomidev/timezonepicker";
</script>

<loomi-timezonepicker name="timezone" label="Timezone"></loomi-timezonepicker>
```

```astro
---
import "@loomidev/timezonepicker";
---

<loomi-timezonepicker name="timezone" label="Timezone"></loomi-timezonepicker>
```

</loomi-tab>
</loomi-tabs>

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->

## Dependencies

- `@loomidev/core`
- `@loomidev/theme`
