# @loomidev/countries

`<loomi-countries>` — a searchable country dropdown with a flag icon beside every name.
Defaults to a full built-in country list (`mode="names"`); set `mode="phone"` to show
just the selected country's flag + dial code beside a phone-number input instead.
**Form-associated**: submits the ISO code under `name` in `names` mode, or the dial code
and number concatenated in `phone` mode.

```bash
npm install @loomidev/countries lit
```

```js
import "@loomidev/countries";
```

## Basic Usage

Ships with its own built-in dataset of 250 countries (name, ISO 3166-1 alpha-2 code,
dial code, flag) — there's no `data` attribute to wire up.

```html
<loomi-countries name="country" label="Country"></loomi-countries>
```

### Selecting a Value

`selection` accepts a country name, an ISO alpha-2 code, or a dial code — whichever is
most convenient for the caller — and resolves to the canonical alpha-2 code.

```html
<loomi-countries selection="GH"></loomi-countries>
<loomi-countries selection="Ghana"></loomi-countries>
<loomi-countries selection="+233"></loomi-countries>
```

`selection` isn't just a one-time initial value — setting it again later (as an
attribute or the `.selection` property) re-syncs the visible selection.

```js
document.querySelector("loomi-countries").selection = "NG"; // updates immediately
```

### Placeholder vs Label

Same convention as `<loomi-select>`: `placeholder` shows hint text that disappears once
something is selected; `label` is always visible and floats above the trigger once a
value is chosen.

```html
<loomi-countries placeholder="What is your nationality"></loomi-countries>
<loomi-countries label="Where are you from?" required></loomi-countries>
```

### Disabled & Readonly

```html
<loomi-countries disabled label="Country"></loomi-countries>
<loomi-countries readonly selection="GH" label="Country"></loomi-countries>
```

## Phone Mode

Set `mode="phone"` to show just the selected country's flag (plus its dial code) beside
a `type="tel"` number field — one compound control instead of wiring up a select and an
input yourself with custom glue code.

```html
<loomi-countries mode="phone" name="phone" label="Phone number"></loomi-countries>
```

Pre-select the country the same way as in `names` mode:

```html
<loomi-countries mode="phone" selection="GH" label="Phone number"></loomi-countries>
```

Picking a country from the panel automatically focuses the number field. The number
field always accepts digits only — letters and punctuation are stripped as you type,
the same way `<loomi-input numeric>` behaves. It also auto-formats those digits using
the selected country's typical national number layout — pick Ghana and type
`241234567` and the field shows `(241)234-567`. The form-submitted value is the dial
code and the (formatted) number concatenated, e.g. `+233(241)234-567`; read `.value`
for just what's in the field.

```js
const el = document.querySelector("loomi-countries");
el.addEventListener("input", () => console.log(el.value)); // "(241)234-567"
```

About 20 territories (mostly ones that share a dial code with a parent country, like
Åland Islands) have no typical format in the underlying dataset — for those, the field
just accepts plain digits with no formatting.

### Overriding the Format With a Mask

Set `mask` to override the country's auto-detected format — same Alpine-style wildcards
as `<loomi-input>`'s `mask`: `9` any digit, `a` any letter, `*` any alphanumeric (in
practice only `9` is reachable here, since the field is already digit-only). Every
other character in the template is a literal inserted automatically.

```html
<loomi-countries mode="phone" mask="999.999.9999" label="Phone number"></loomi-countries>
```

`mask` only applies in `phone` mode; it's ignored in `names` mode. Leave it unset to use
the selected country's own format.

## Searching

The dropdown panel always includes a search box — with 250 entries, scrolling to find
one isn't realistic, so unlike `<loomi-select>` this isn't behind a `searchable` flag.
Search matches the country name, its ISO code, or its dial code, so typing "233" finds
Ghana in `phone` mode just as well as typing "gha" does.

## Reacting to Selection

```js
const el = document.querySelector("loomi-countries");
el.addEventListener("select", (e) => {
  console.log(e.detail); // { code: "GH", name: "Ghana", dialCode: "+233" }
});
```

## Get the Selected Value on Form Submission

Every `<loomi-countries>` participates in `ElementInternals` form association, so its
value submits like a native form control under whatever `name` you gave it.

```js
new FormData(form).get("country"); // "GH" in `names` mode
new FormData(form).get("phone");   // "+233241234567" in `phone` mode
```

## Required Fields

```html
<loomi-countries required label="Country"></loomi-countries>
<loomi-countries mode="phone" required label="Phone number"></loomi-countries>
```

## Clearing

```js
document.querySelector("loomi-countries").reset();
```

## Sizes

```html
<loomi-countries size="small"></loomi-countries>
<loomi-countries size="regular"></loomi-countries>
<loomi-countries size="medium"></loomi-countries>
<loomi-countries size="big"></loomi-countries>
```

## Accessibility

For the library-wide baseline, see [Foundations — Accessibility](https://loomiui.com/foundations/#accessibility).

## Responsive behavior

For the shared container and viewport rules, see [Foundations — Responsive behavior](https://loomiui.com/foundations/#responsive-behavior).

## Dark mode

For theme activation, token overrides, and contrast guidance, see [Foundations — Dark mode](https://loomiui.com/foundations/#dark-mode).

## Attributes

| Attribute           | Default              | Description                                                                                                                          |
| ------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `name`              | _(blank)_            | Submitted with the form.                                                                                                             |
| `mode`              | `names`              | `names` \| `phone`.                                                                                                                  |
| `placeholder`       | `Select a country`   | Trigger text when nothing is selected (`names` mode).                                                                                |
| `label`             | _(blank)_            | Floating label (takes precedence over placeholder).                                                                                  |
| `selection`         | _(blank)_            | Country name, ISO alpha-2 code, or dial code. Resolves to the alpha-2 code.                                                          |
| `value`             | _(blank)_            | The phone number portion, excluding the dial code (`phone` mode, digits only).                                                       |
| `mask`              | _(blank)_            | Overrides the selected country's auto-detected formatting mask — `9`/`a`/`*` wildcards, same as `<loomi-input>` (`phone` mode only). |
| `disabled`          | `false`              | Disable the control. _(boolean)_                                                                                                     |
| `readonly`          | `false`              | Read-only (cannot open). _(boolean)_                                                                                                 |
| `required`          | `false`              | Marks the field required. _(boolean)_                                                                                                |
| `size`              | `medium`             | `tiny` \| `small` \| `regular` \| `medium` \| `big`                                                                                  |
| `empty-placeholder` | `No countries found` | Shown when a search matches nothing.                                                                                                 |
| `invalid`           | `false`              | Reflects validity state; set automatically. _(boolean)_                                                                              |
| `locale`            | _(blank)_            | Locale for built-in strings (search box, placeholders, aria-labels).                                                                 |
| `no-clearing`       | `false`              | Remove the default bottom margin. _(boolean)_                                                                                        |

**Parts:** `trigger`, `panel`, `field` (`phone` mode), `input` (`phone` mode).
**Methods:** `reset()`, `validate()`, `checkValidity()`, `reportValidity()`.

> Flags are circle-flags (HatScripts, MIT) rather than the more detailed flag-icons set —
> at the ~20px size these render at, simplified circular artwork looks just as good and
> is roughly 10x lighter, and every flag gets the same circular footprint regardless of
> its native aspect ratio, which keeps names aligned down a long list.

## Events

| Event          | Description                                   |
| -------------- | --------------------------------------------- |
| `change`       | Fired when the value is committed or changed. |
| `input`        | Fired while the value is edited.              |
| `loomi-select` | Fired when a country is selected.             |

## Full Example

```html
<loomi-countries
  name="country"
  label="What is your nationality"
  selection="gh"
  required
></loomi-countries>

<loomi-countries
  mode="phone"
  name="phone"
  label="Phone number"
  selection="GH"
></loomi-countries>
```

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-countries>` is a standard custom element, so the browser can use it in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/countries` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomidev/countries lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/countries build
pnpm --filter @loomidev/countries typecheck
```

### Choose your framework

<loomi-tabs>
<loomi-tab label="HTML" active>

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/countries"></script>

<loomi-countries name="country" label="Country"></loomi-countries>
```

</loomi-tab>
<loomi-tab label="Bundlers and SPAs">

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/countries";
```

Because this is a form-capable component, give it a `name` when it should submit with a native `<form>`. Read its value with `new FormData(form).get("the-name")` just like you would for a built-in input.

</loomi-tab>
<loomi-tab label="Blade">

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomidev/countries lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/countries";
```

```blade
<loomi-countries
  name="country"
  label="Country"
></loomi-countries>
```

</loomi-tab>
<loomi-tab label="React">

React can render Loomi tags directly. If you need to set `selection` or `value` after mount, use a ref.

```jsx
import { useEffect, useRef } from "react";
import "@loomidev/countries";

export function LoomiExample() {
  const el = useRef(null);

  useEffect(() => {
    el.current.selection = "GH";
  }, []);

  return <loomi-countries ref={el} name="country" label="Country"></loomi-countries>;
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

</loomi-tab>
<loomi-tab label="Vue">

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly.

```vue
<script setup>
import { onMounted, ref } from "vue";
import "@loomidev/countries";

const el = ref(null);

onMounted(() => {
  el.value.selection = "GH";
});
</script>

<template>
  <loomi-countries ref="el" name="country" label="Country"></loomi-countries>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

</loomi-tab>
<loomi-tab label="Angular">

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, ViewChild } from "@angular/core";
import "@loomidev/countries";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-countries #el name="country" label="Country"></loomi-countries>
  `,
})
export class AppComponent implements AfterViewInit {
  @ViewChild("el") el!: ElementRef<any>;

  ngAfterViewInit() {
    this.el.nativeElement.selection = "GH";
  }
}
```

</loomi-tab>
<loomi-tab label="Svelte / Astro">

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import { onMount } from "svelte";
  import "@loomidev/countries";

  let el;

  onMount(() => {
    el.selection = "GH";
  });
</script>

<loomi-countries bind:this={el} name="country" label="Country"></loomi-countries>
```

```astro
---
import "@loomidev/countries";
---

<loomi-countries
  name="country"
  label="Country"
></loomi-countries>
```

</loomi-tab>
</loomi-tabs>

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->

## Dependencies

- `@loomidev/core`
- `@loomidev/theme`
