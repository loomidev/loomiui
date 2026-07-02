# @loomidev/radio

`<loomi-radio>` — a themeable radio button. Give radios in a group the same `name` and
they become mutually exclusive (coordinated across the same DOM root, since native radio
grouping doesn't cross shadow boundaries). **Form-associated**.

```bash
npm install @loomidev/radio lit
```

```js
import "@loomidev/radio";
```


## Accessibility
- Prefer native HTML elements; add labels in your app shell where needed.
- Supports keyboard focus with visible `:focus-visible` styling on interactive controls.

## Responsive behavior
- Fluid width (`width: 100%`, `min-width: 0`) within flex and grid layouts.

## Dark mode
- Uses semantic `--loomi-surface`, `--loomi-surface-border`, and `--loomi-text` tokens where applicable.
- Respects `.dark` on `<html>` via `@loomidev/theme-switcher` or your app theme.
## Basic Usage

```html
<loomi-radio name="tnc"></loomi-radio>
```

## Radio Groups

Radios are most useful in groups — give each radio in the group the same `name` to make
them mutually exclusive.

```html
<loomi-radio label="Action" name="genre" value="action"></loomi-radio>
<loomi-radio label="Comedy" name="genre" value="comedy"></loomi-radio>
<loomi-radio label="Drama" name="genre" value="drama"></loomi-radio>
<loomi-radio label="Thriller" name="genre" value="thriller"></loomi-radio>
```

Check one by default with `checked`:

```html
<loomi-radio label="I am checked by default" name="check_me" checked></loomi-radio>
```

Radios can also be disabled:

```html
<loomi-radio label="I am disabled" disabled></loomi-radio>
```

## Colored Radio Buttons

Any loomi color works: `primary` `secondary` `success` `error` `warning` `gray`
`purple` `cyan` `pink` `blue`.

```html
<loomi-radio color="error" checked label="Red"></loomi-radio>
<loomi-radio color="yellow" label="Yellow"></loomi-radio>
<loomi-radio color="success" label="Green"></loomi-radio>
<loomi-radio color="pink" label="Pink"></loomi-radio>
<loomi-radio color="cyan" label="Cyan"></loomi-radio>
<loomi-radio color="purple" label="Purple"></loomi-radio>
<loomi-radio color="warning" label="Orange"></loomi-radio>
<loomi-radio color="purple" label="Violet"></loomi-radio>
<loomi-radio color="blue" label="Indigo"></loomi-radio>
<loomi-radio color="pink" label="Fuchsia"></loomi-radio>
```

## Radio Buttons and Forms

Give every radio in a group a `value` so the right one is submitted under the shared
`name` when the form is submitted.

```html
<loomi-radio name="notify_me" value="1" label="Send me weekly newsletters"></loomi-radio>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `name` | _(blank)_ | Group name; submitted with the form. |
| `value` | _(blank)_ | Submitted value when selected. |
| `label` | _(blank)_ | Label text (or use the default slot). |
| `checked` | `false` | Checked state. _(boolean, reflected)_ |
| `disabled` | `false` | Disable the radio. _(boolean)_ |
| `color` | `primary` | Active color (any loomi color). |
| `no-clearing` | `false` | Remove the default bottom margin. _(boolean)_ |

**Slot:** default (label). **Part:** `dot`. **Event:** `change` (composed, fired on the
radio that becomes checked).

## Full Example

```html
<loomi-radio
  label="I agree to the terms and conditions"
  color="pink"
  name="tnc"
  value="yes"
></loomi-radio>
```

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-radio>` is a standard custom element, so the browser can use it in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/radio` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomidev/radio lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/radio build
pnpm --filter @loomidev/radio typecheck
```

### Plain HTML

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/radio"></script>

<loomi-radio name="frequency" value="monthly" label="Monthly" checked></loomi-radio>
```

### Bundlers and single-page apps

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/radio";
```


Because this is a form-capable component, give it a `name` when it should submit with a native `<form>`. Read its value with `new FormData(form).get("the-name")` just like you would for a built-in input.

### Laravel Blade

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomidev/radio lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/radio";
```

```blade
<loomi-radio name="frequency" value="monthly" label="Monthly" checked></loomi-radio>
```

### React

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import "@loomidev/radio";

export function LoomiExample() {
  return (
    <loomi-radio name="frequency" value="monthly" label="Monthly" checked></loomi-radio>
  );
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

### Vue

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import "@loomidev/radio";
</script>

<template>
  <loomi-radio name="frequency" value="monthly" label="Monthly" checked></loomi-radio>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

### Angular

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomidev/radio";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-radio name="frequency" value="monthly" label="Monthly" checked></loomi-radio>
  `,
})
export class AppComponent {}
```

### Svelte and Astro

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import "@loomidev/radio";
</script>

<loomi-radio name="frequency" value="monthly" label="Monthly" checked></loomi-radio>
```

```astro
---
import "@loomidev/radio";
---

<loomi-radio name="frequency" value="monthly" label="Monthly" checked></loomi-radio>
```

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->
