# @loomidev/select

`<loomi-select>` — a themeable custom select. Supports a `data` array (or JSON string),
manual `<option>` children, search, multiple selection, images and a floating label.
**Form-associated**: submits the selected value(s) under `name` (comma-joined for multiple).

```bash
npm install @loomidev/select lit
```

```js
import "@loomidev/select";
```


## Basic Usage (Data-Driven)

Pass an array via the `.data` property, or a JSON string via the `data` attribute. Keys
default to `label` / `value`.

```html
<loomi-select
  name="country"
  label="Country"
  data='[{"label":"Ghana","value":"gh"},{"label":"Nigeria","value":"ng"},{"label":"Kenya","value":"ke"}]'
></loomi-select>
```

```js
document.querySelector("loomi-select").data = [
  { label: "Ghana", value: "gh" },
  { label: "Nigeria", value: "ng" },
];
```

### Custom Key Names

It's not always practical to rewrite your data to use `label`/`value` keys. Remap them
with `label-key` / `value-key`.

```html
<loomi-select
  label-key="country"
  value-key="code"
  data='[{"country":"Ghana","code":"gh"},{"country":"Nigeria","code":"ng"}]'
></loomi-select>
```

### Placeholder vs Label

`placeholder` shows hint text that disappears once something is selected. `label` is
always visible (floats above the trigger once a value is chosen). When both are set,
`label` takes precedence.

```html
<loomi-select placeholder="What is your nationality" data="..."></loomi-select>
<loomi-select label="Where are you from?" required data="..."></loomi-select>
```

### Selecting a Value by Default

```html
<loomi-select selected-value="gh" placeholder="What is your nationality" data="..."></loomi-select>
```

`selected-value` isn't just a one-time initial value — setting it again later (as an
attribute or the `.selectedValue` property) re-syncs the visible selection, which is
useful for swapping which record a select reflects (e.g. re-pointing one "assignee"
select at a different task) without re-creating the element.

```js
document.querySelector("loomi-select").selectedValue = "ng"; // updates immediately
```

### Disabled & Readonly

```html
<loomi-select disabled placeholder="What is your nationality" data="..."></loomi-select>
<loomi-select readonly placeholder="What is your nationality" data="..."></loomi-select>
```

## With Images

Set `image-key` to the key in your data that holds an image URL, to render a small image
beside each option — handy for "assign to" pickers.

```html
<loomi-select
  placeholder="Assign task to"
  label-key="name"
  value-key="id"
  image-key="picture"
  data='[{"id":1,"name":"Ada","picture":"/avatars/ada.jpg"}]'
></loomi-select>
```

## Searchable Select

```html
<loomi-select searchable label-key="country" value-key="code" data="..."></loomi-select>
```

## Empty Select

When there's no data yet (e.g. waiting on an API response), the select shows
`empty-placeholder`. If `searchable` is also set, the search box automatically hides
since there's nothing to search.

```html
<loomi-select searchable empty-placeholder="No countries available" data="[]"></loomi-select>
```

## Select Multiple Items

Set `multiple` to allow more than one selection. Unlike the single select, a multiple
select stays open after each pick — click outside it to close.

```html
<loomi-select
  multiple
  searchable
  max-selectable="3"
  label="Select a country"
  label-key="country"
  value-key="code"
  data="..."
></loomi-select>
```

Trying to select past `max-selectable` blocks the extra selection.

### Pre-Selecting Multiple Values

Use a comma-separated list for `selected-value`.

```html
<loomi-select multiple selected-value="gh,ng,ke" label-key="country" value-key="code" data="..."></loomi-select>
```

## Manual Options

When your data isn't coming from an array, use plain `<option>` children instead.

```html
<loomi-select name="gender" placeholder="Select gender">
  <option value="male">Male</option>
  <option value="female">Female</option>
  <option value="other">Prefer not to say</option>
</loomi-select>
```

## Reacting to Selection

```js
const el = document.querySelector("loomi-select");
el.addEventListener("select", (e) => {
  console.log(e.detail); // { value, label, values }
});
```

## Get the Selected Value on Form Submission

Every `<loomi-select>` participates in `ElementInternals` form association, so its value
submits like a native form control under whatever `name` you gave it — comma-joined for
multiple selects.

```js
new FormData(form).get("country"); // "gh"
new FormData(form).get("tags");     // "pop,jazz" (multiple)
```

## Sizes

```html
<loomi-select size="small" data="..."></loomi-select>
<loomi-select size="regular" data="..."></loomi-select>
<loomi-select size="medium" data="..."></loomi-select>
<loomi-select size="big" data="..."></loomi-select>
```

## Empty State CTA

When there are no options, `empty-placeholder` shows the empty message. Add
`empty-action-label` for a small CTA; clicking it emits `empty-action`, and
`empty-action-url` can navigate directly.

```html
<loomi-select
  label="Project"
  empty-placeholder="No projects yet"
  empty-action-label="Create project"
></loomi-select>
```

## Accessibility

loomi-select is built on semantic markup where the browser gives us the right behavior, and it adds ARIA only where the component has custom interaction. Keyboard users should be able to reach the same controls as pointer users, with visible focus treatment unless you explicitly turn it off on controls that support `show-focus-ring="false"`.

When the component displays status, progress, validation, or temporary feedback, pair it with clear labels or nearby text in your app so assistive technology users get the same context a sighted user gets from the visual treatment.


## Responsive behavior

loomi-select is designed to fit the layout you place it in. It uses fluid widths, `min-width: 0`, wrapping, truncation, or stacked layouts where that keeps the component usable in cards, forms, sidebars, and mobile screens.

For dense layouts, give the parent container an intentional width and let the component fill it. For long labels or user-provided content, prefer real text that can wrap or truncate instead of fixed pixel assumptions.


## Dark mode

loomi-select uses Loomi semantic tokens such as `--loomi-surface`, `--loomi-surface-border`, `--loomi-text`, and palette accent tokens instead of hard-coded light colors. Borders, panels, hover states, and muted text are expected to shift with the active theme.

Add `.dark` to your app root with `@loomidev/theme-switcher`, or provide your own token overrides, and the component will inherit the dark-mode values through its shadow DOM.


## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `name` | _(blank)_ | Submitted with the form. |
| `placeholder` | `Select One` | Trigger text when nothing is selected. |
| `label` | _(blank)_ | Floating label (takes precedence over placeholder). |
| `data` | `[]` | Options array — property (`.data`) or JSON-string attribute. |
| `label-key` | `label` | Row key used as each option's display text. |
| `value-key` | `value` | Row key used as each option's submitted value. |
| `image-key` | _(blank)_ | Key holding an image URL to show beside each option. |
| `selected-value` | _(blank)_ | Default value(s); comma-separated for multiple. |
| `searchable` | `false` | Show a search box. _(boolean)_ |
| `multiple` | `false` | Allow multiple selection. _(boolean)_ |
| `max-selectable` | `-1` | Max items when multiple (`-1` = no limit). |
| `disabled` | `false` | Disable the select. _(boolean)_ |
| `readonly` | `false` | Read-only (cannot open). _(boolean)_ |
| `required` | `false` | Marks the field required. _(boolean)_ |
| `size` | `medium` | `small` \| `regular` \| `medium` \| `big` |
| `variant` | `default` | `default` \| `minimal` (bottom border only, no box) |
| `empty-placeholder` | `No options available` | Text shown when there are no options. |
| `empty-action-label` | _(blank)_ | CTA label shown in the empty state. |
| `empty-action-url` | _(blank)_ | Optional URL to navigate to when the empty CTA is clicked. |
| `no-clearing` | `false` | Remove the default bottom margin. _(boolean)_ |

**Slot:** default (manual `<option>` children). **Parts:** `trigger`, `panel`.
**Methods:** `reset()`, `validate()`. **Events:** `select` (`detail: { value, label, values }`),
`change` (composed), `empty-action` (`detail: { url }`).


## Full Example

```html
<loomi-select
  name="country"
  label="What is your nationality"
  data='[{"label":"Ghana","value":"gh"},{"label":"Nigeria","value":"ng"}]'
  value-key="value"
  label-key="label"
  required
  selected-value="gh"
  searchable
  size="big"
></loomi-select>
```

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-select>` is a standard custom element, so the browser can use it in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/select` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomidev/select lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/select build
pnpm --filter @loomidev/select typecheck
```

### Choose your framework

<loomi-tabs>
<loomi-tab label="Plain HTML" active>

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/select"></script>

<loomi-select
  name="country"
  label="Country"
  data='[{"label":"Ghana","value":"gh"},{"label":"Nigeria","value":"ng"}]'
></loomi-select>
```

</loomi-tab>
<loomi-tab label="Bundlers and SPAs">

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/select";
```


Because this is a form-capable component, give it a `name` when it should submit with a native `<form>`. Read its value with `new FormData(form).get("the-name")` just like you would for a built-in input.

This component accepts `data` as a JavaScript property. Use an HTML attribute only for simple strings; use a property when you pass arrays, objects, or functions.

```js
const el = document.querySelector("loomi-select");
el.data = [{ label: "Ghana", value: "gh" }, { label: "Nigeria", value: "ng" }];
```

</loomi-tab>
<loomi-tab label="Laravel Blade">

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomidev/select lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/select";
```

```blade
<loomi-select
  name="country"
  label="Country"
  data='[{"label":"Ghana","value":"gh"},{"label":"Nigeria","value":"ng"}]'
></loomi-select>
```

</loomi-tab>
<loomi-tab label="React">

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import { useEffect, useRef } from "react";
import "@loomidev/select";

export function LoomiExample() {
  const el = useRef(null);

  useEffect(() => {
    el.current.data = [{ label: "Ghana", value: "gh" }, { label: "Nigeria", value: "ng" }];
  }, []);

  return <loomi-select ref={el}></loomi-select>;
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

</loomi-tab>
<loomi-tab label="Vue">

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import { onMounted, ref } from "vue";
import "@loomidev/select";

const el = ref(null);

onMounted(() => {
  el.value.data = [{ label: "Ghana", value: "gh" }, { label: "Nigeria", value: "ng" }];
});
</script>

<template>
  <loomi-select ref="el"></loomi-select>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

</loomi-tab>
<loomi-tab label="Angular">

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, ViewChild } from "@angular/core";
import "@loomidev/select";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-select #el></loomi-select>
  `,
})
export class AppComponent implements AfterViewInit {
  @ViewChild("el") el!: ElementRef<any>;

  ngAfterViewInit() {
    this.el.nativeElement.data = [{ label: "Ghana", value: "gh" }, { label: "Nigeria", value: "ng" }];
  }
}
```

</loomi-tab>
<loomi-tab label="Svelte and Astro">

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import { onMount } from "svelte";
  import "@loomidev/select";

  let el;

  onMount(() => {
    el.data = [{ label: "Ghana", value: "gh" }, { label: "Nigeria", value: "ng" }];
  });
</script>

<loomi-select bind:this={el}></loomi-select>
```

```astro
---
import "@loomidev/select";
---

<loomi-select
  name="country"
  label="Country"
  data='[{"label":"Ghana","value":"gh"},{"label":"Nigeria","value":"ng"}]'
></loomi-select>
```

</loomi-tab>
</loomi-tabs>

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->

## Dependencies

- `@loomidev/core`
- `@loomidev/theme`
