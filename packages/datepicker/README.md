# @loomidev/datepicker

`<loomi-datepicker>` — a calendar date picker (single or range) with locale-aware
month/weekday names. **Form-associated**: submits the formatted date(s) under `name`.

```bash
npm install @loomidev/datepicker lit
```

```js
import "@loomidev/datepicker";
```

## Basic Usage

By default the datepicker fills the width of its parent container; wrap it to constrain
the width.

```html
<loomi-datepicker></loomi-datepicker>
```

```html
<div style="width: 14rem">
  <loomi-datepicker label="Invoice Date"></loomi-datepicker>
</div>
```

## Inline Calendar

By default the calendar is a popup triggered by clicking the field (`dp-style="popup"`).
Set `dp-style="inline"` to render the calendar directly in the page — always visible,
with no triggering input.

```html
<loomi-datepicker dp-style="inline"></loomi-datepicker>
```

## Range Calendar

Set `range` to select a start and end date. The field shows both dates separated by a
dash, e.g. `2026-06-10 - 2026-06-30`.

```html
<loomi-datepicker range></loomi-datepicker>
```

### Required Fields

An asterisk is appended to the label/placeholder when `required`.

```html
<loomi-datepicker required></loomi-datepicker>
```

## Date Formats

```html
<loomi-datepicker format="dd-mm-yyyy"></loomi-datepicker>
<loomi-datepicker format="mm-dd-yyyy"></loomi-datepicker>
<loomi-datepicker format="D d M, Y" range></loomi-datepicker>
<loomi-datepicker format="yyyy-mm-dd"></loomi-datepicker>
```

When using a range datepicker, the chosen `format` is applied to both dates.

## With Default Values

Useful in edit mode, or to show the user what they previously filtered by.
`selected-value` and the range bounds are always parsed as ISO `yyyy-mm-dd`, regardless
of the display `format`.

```html
<loomi-datepicker selected-value="2026-06-22"></loomi-datepicker>
```

A range datepicker accepts a default range as `"start - end"`:

```html
<loomi-datepicker range selected-value="2026-06-10 - 2026-06-30"></loomi-datepicker>
```

## Min and Max Dates

Restrict selectable dates — anything outside the bounds is disabled and grayed out.

```html
<loomi-datepicker min-date="2026-06-01"></loomi-datepicker>
<loomi-datepicker max-date="2026-06-30"></loomi-datepicker>
<loomi-datepicker min-date="2026-06-01" max-date="2026-06-30"></loomi-datepicker>
```

## Week Start Day

```html
<loomi-datepicker week-starts="monday"></loomi-datepicker>
```

## Internationalization

`<loomi-datepicker>` uses Loomi's shared i18n defaults for the placeholder, navigation
labels, formatted month names, weekday headings, and `D d M, Y` display format.

```js
import { setLoomiLocale, defineLoomiTranslations } from "@loomidev/core";
import "@loomidev/datepicker";

setLoomiLocale("fr");

defineLoomiTranslations("ak", {
  datepicker: {
    placeholder: "Paw da a wobɛpaw",
    previousMonth: "Bosome a atwam",
    nextMonth: "Bosome a edi hɔ",
    monthsShort: ["S-Ɔ", "K-Ɔ", "E-Ɔ", "E-O", "E-K", "O-A", "A-K", "D-Ɔ", "F-Ɛ", "Ɔ-A", "O-O", "M-Ɔ"],
    weekdaysShort: ["Kwe", "Dwo", "Ben", "Wuk", "Yaw", "Fia", "Mem"],
  },
});
```

```html
<!-- Override only this datepicker. -->
<loomi-datepicker locale="de"></loomi-datepicker>
```

Built-in locales: `en`, `ar`, `de`, `es`, `fr`, `it`, `ml`, `pt_BR`, `tr`, and
`zh_CN`. Custom locales may provide `monthsShort`, `monthsLong`, and `weekdaysShort`
arrays. A custom `placeholder` attribute still overrides the translated default.

## Sizes

```html
<loomi-datepicker size="tiny"></loomi-datepicker>
<loomi-datepicker size="small"></loomi-datepicker>
<loomi-datepicker size="regular"></loomi-datepicker>
<loomi-datepicker size="medium"></loomi-datepicker>
<loomi-datepicker size="big"></loomi-datepicker>
```

## Reacting to a Selection

```js
document.querySelector("loomi-datepicker").addEventListener("change", (e) => {
  console.log(e.detail.value); // formatted string, e.g. "2026-06-22"
  console.log(e.detail.dates); // Date object(s)
});
```

## Field appearance

Use `variant="minimal"` for a bottom-border-only field:

```html
<loomi-datepicker variant="minimal" placeholder="Choose a date"></loomi-datepicker>
```

Use `label-position="inside"` to keep a compact label inside the top of the field,
with the selected date displayed beneath it:

```html
<loomi-datepicker label="Start date" label-position="inside"></loomi-datepicker>
```

## Accessibility

For the library-wide baseline, see [Foundations — Accessibility](https://loomiui.com/foundations/#accessibility).

## Responsive behavior

For the shared container and viewport rules, see [Foundations — Responsive behavior](https://loomiui.com/foundations/#responsive-behavior).

## Dark mode

For theme activation, token overrides, and contrast guidance, see [Foundations — Dark mode](https://loomiui.com/foundations/#dark-mode).

## Attributes

| Attribute        | Default         | Description                                                                                                |
| ---------------- | --------------- | ---------------------------------------------------------------------------------------------------------- |
| `name`           | _(blank)_       | Submitted with the form.                                                                                   |
| `dp-style`       | `popup`         | `popup` (input + panel) \| `inline` (calendar always visible, no triggering input).                        |
| `range`          | `false`         | Select a start/end range. _(boolean)_                                                                      |
| `selected-value` | _(blank)_       | Default ISO date, or `"start - end"` for range.                                                            |
| `min-date`       | _(blank)_       | ISO lower bound; earlier days are disabled.                                                                |
| `max-date`       | _(blank)_       | ISO upper bound; later days are disabled.                                                                  |
| `format`         | `yyyy-mm-dd`    | `yyyy-mm-dd` \| `dd-mm-yyyy` \| `mm-dd-yyyy` \| `yyyy/mm/dd` \| `dd/mm/yyyy` \| `mm/dd/yyyy` \| `D d M, Y` |
| `week-starts`    | `sunday`        | `sunday` \| `monday`                                                                                       |
| `placeholder`    | `Select a date` | Closed-field placeholder text.                                                                             |
| `label`          | _(blank)_       | Optional field label.                                                                                      |
| `label-position` | `default`       | `default` keeps the label above the field; `inside` keeps a compact label inside the top of the field.     |
| `locale`         | _(global)_      | Override the shared Loomi locale for this datepicker.                                                      |
| `required`       | `false`         | Append an asterisk. _(boolean)_                                                                            |
| `size`           | `regular`       | `tiny` \| `small` \| `regular` \| `medium` \| `big`                                                        |
| `variant`        | `default`       | `default` \| `minimal` (bottom border only, no box)                                                        |

**Property:** `value`. **Event:** `change` (`detail: { value, dates }`).

## Events

| Event    | Description                                   |
| -------- | --------------------------------------------- |
| `change` | Fired when the value is committed or changed. |

## Full Example

```html
<loomi-datepicker
  name="invoice_date"
  range
  required
  label="Invoice Date"
  format="dd/mm/yyyy"
  min-date="2026-06-01"
  max-date="2026-06-30"
  week-starts="monday"
  size="big"
></loomi-datepicker>
```

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-datepicker>` is a standard custom element, so the browser can use it in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/datepicker` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomidev/datepicker lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/datepicker build
pnpm --filter @loomidev/datepicker typecheck
```

### Choose your framework

<loomi-tabs>
<loomi-tab label="HTML" active>

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/datepicker"></script>

<loomi-datepicker name="start_date" label="Start date" required></loomi-datepicker>
```

</loomi-tab>
<loomi-tab label="Bundlers and SPAs">

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/datepicker";
```

Because this is a form-capable component, give it a `name` when it should submit with a native `<form>`. Read its value with `new FormData(form).get("the-name")` just like you would for a built-in input.

</loomi-tab>
<loomi-tab label="Blade">

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomidev/datepicker lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/datepicker";
```

```blade
<loomi-datepicker name="start_date" label="Start date" required></loomi-datepicker>
```

</loomi-tab>
<loomi-tab label="React">

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import "@loomidev/datepicker";

export function LoomiExample() {
  return (
    <loomi-datepicker name="start_date" label="Start date" required></loomi-datepicker>
  );
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

</loomi-tab>
<loomi-tab label="Vue">

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import "@loomidev/datepicker";
</script>

<template>
  <loomi-datepicker name="start_date" label="Start date" required></loomi-datepicker>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

</loomi-tab>
<loomi-tab label="Angular">

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomidev/datepicker";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-datepicker name="start_date" label="Start date" required></loomi-datepicker>
  `,
})
export class AppComponent {}
```

</loomi-tab>
<loomi-tab label="Svelte / Astro">

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import "@loomidev/datepicker";
</script>

<loomi-datepicker name="start_date" label="Start date" required></loomi-datepicker>
```

```astro
---
import "@loomidev/datepicker";
---

<loomi-datepicker name="start_date" label="Start date" required></loomi-datepicker>
```

</loomi-tab>
</loomi-tabs>

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->

## Dependencies

- `@loomidev/core`
- `@loomidev/icons`
