# @loomidev/number

`<loomi-number>` — a themeable number stepper with increment/decrement buttons, min/max/
step enforcement and a floating label. **Form-associated**.

```bash
npm install @loomidev/number lit
```

```js
import "@loomidev/number";
```


## Basic Usage

```html
<loomi-number value="1"></loomi-number>
```

Increment/decrement by any step:

```html
<loomi-number step="10" value="0"></loomi-number>
```

## Sizes

```html
<loomi-number size="small"></loomi-number>
<loomi-number size="regular"></loomi-number>
<loomi-number size="medium"></loomi-number>
<loomi-number size="big"></loomi-number>
```

## Button Transparency

By default the increment/decrement buttons are transparent. Set
`transparent-icons="false"` for a solid background.

```html
<loomi-number transparent-icons="false"></loomi-number>
<loomi-number transparent-icons="false" size="big"></loomi-number>
```

## Labels

```html
<loomi-number label="Quantity" value="1"></loomi-number>
```

## Minimum and Maximum Limits

```html
<loomi-number min="18" max="65" label="Your age" value="18"></loomi-number>
```

The increment/decrement buttons disable at the bounds, and manually typing an
out-of-range value clamps it back to the limit on commit.

## Decimal Values

```html
<loomi-number with-dots="false" value="3"></loomi-number>
```

## Form Values

```html
<loomi-number name="age" value="18"></loomi-number>
```

```js
new FormData(form).get("age"); // "18"
```

## Accessibility

loomi-number is built on semantic markup where the browser gives us the right behavior, and it adds ARIA only where the component has custom interaction. Keyboard users should be able to reach the same controls as pointer users, with visible focus treatment unless you explicitly turn it off on controls that support `show-focus-ring="false"`.

When the component displays status, progress, validation, or temporary feedback, pair it with clear labels or nearby text in your app so assistive technology users get the same context a sighted user gets from the visual treatment.

- Supports keyboard focus with visible `:focus-visible` styling on interactive controls.

## Responsive behavior

loomi-number is designed to fit the layout you place it in. It uses fluid widths, `min-width: 0`, wrapping, truncation, or stacked layouts where that keeps the component usable in cards, forms, sidebars, and mobile screens.

For dense layouts, give the parent container an intentional width and let the component fill it. For long labels or user-provided content, prefer real text that can wrap or truncate instead of fixed pixel assumptions.


## Dark mode

loomi-number uses Loomi semantic tokens such as `--loomi-surface`, `--loomi-surface-border`, `--loomi-text`, and palette accent tokens instead of hard-coded light colors. Borders, panels, hover states, and muted text are expected to shift with the active theme.

Add `.dark` to your app root with `@loomidev/theme-switcher`, or provide your own token overrides, and the component will inherit the dark-mode values through its shadow DOM.

- Respects `.dark` on `<html>` via `@loomidev/theme-switcher` or your app theme.

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `name` | _(blank)_ | Submitted with the form. |
| `label` | _(blank)_ | Floating label. |
| `value` | _(blank)_ | Current value (also a property). |
| `min` | `0` | Minimum value. |
| `max` | `100` | Maximum value. |
| `step` | `1` | Increment/decrement amount. |
| `size` | `medium` | `small` \| `regular` \| `medium` \| `big` |
| `variant` | `default` | `default` \| `minimal` (bottom border only, no box) |
| `transparent-icons` | `true` | Transparent (vs solid) stepper buttons. _(boolean)_ |
| `with-dots` | `true` | Allow decimal values. _(boolean)_ |
| `required` | `false` | Marks the field required. _(boolean)_ |
| `disabled` | `false` | Disable the control. _(boolean)_ |
| `no-clearing` | `false` | Remove the default bottom margin. _(boolean)_ |

**Methods:** `focus()`. **Events:** `input`, `change` (composed). **Parts:** `field`, `input`.

## Full Example

```html
<loomi-number
  name="age"
  label="Age"
  size="big"
  transparent-icons="true"
  min="18"
  max="65"
  step="1"
  value="18"
></loomi-number>
```

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-number>` is a standard custom element, so the browser can use it in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/number` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomidev/number lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/number build
pnpm --filter @loomidev/number typecheck
```

### Choose your framework

<loomi-tabs>
<loomi-tab label="Plain HTML" active>

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/number"></script>

<loomi-number name="quantity" label="Quantity" min="1" max="10" step="1"></loomi-number>
```

</loomi-tab>
<loomi-tab label="Bundlers and SPAs">

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/number";
```


Because this is a form-capable component, give it a `name` when it should submit with a native `<form>`. Read its value with `new FormData(form).get("the-name")` just like you would for a built-in input.

</loomi-tab>
<loomi-tab label="Laravel Blade">

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomidev/number lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/number";
```

```blade
<loomi-number name="quantity" label="Quantity" min="1" max="10" step="1"></loomi-number>
```

</loomi-tab>
<loomi-tab label="React">

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import "@loomidev/number";

export function LoomiExample() {
  return (
    <loomi-number name="quantity" label="Quantity" min="1" max="10" step="1"></loomi-number>
  );
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

</loomi-tab>
<loomi-tab label="Vue">

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import "@loomidev/number";
</script>

<template>
  <loomi-number name="quantity" label="Quantity" min="1" max="10" step="1"></loomi-number>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

</loomi-tab>
<loomi-tab label="Angular">

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomidev/number";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-number name="quantity" label="Quantity" min="1" max="10" step="1"></loomi-number>
  `,
})
export class AppComponent {}
```

</loomi-tab>
<loomi-tab label="Svelte and Astro">

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import "@loomidev/number";
</script>

<loomi-number name="quantity" label="Quantity" min="1" max="10" step="1"></loomi-number>
```

```astro
---
import "@loomidev/number";
---

<loomi-number name="quantity" label="Quantity" min="1" max="10" step="1"></loomi-number>
```

</loomi-tab>
</loomi-tabs>

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->

## Dependencies

- `@loomidev/core`
- `@loomidev/theme`
