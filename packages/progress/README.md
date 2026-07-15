# @loomidev/progress

`<loomi-progress-bar>`, `<loomi-progress-circle>`, and `<loomi-progress-steps>` —
horizontal, circular, and stepped progress indicators.

```bash
npm install @loomidev/progress lit
```

```js
import "@loomidev/progress";
```

## Progress Bar — Basic Usage

```html
<loomi-progress-bar percentage="36"></loomi-progress-bar>
```

### Percentage Label

```html
<!-- label inside the bar -->
<loomi-progress-bar percentage="36" show-percentage-label></loomi-progress-bar>

<!-- label outside the bar (default position: top-left) -->
<loomi-progress-bar percentage="36" show-percentage-label show-percentage-label-inline="false"></loomi-progress-bar>

<!-- label as a tooltip above the fill -->
<loomi-progress-bar percentage="36" show-percentage-tooltip></loomi-progress-bar>

<!-- positioned top-center, with a suffix -->
<loomi-progress-bar
  percentage="75"
  show-percentage-label
  show-percentage-label-inline="false"
  percentage-label-position="top-center"
  percentage-suffix=" complete"
></loomi-progress-bar>
```

Available `percentage-label-position` values: `top-left` `top-center` `top-right`
`bottom-left` `bottom-center` `bottom-right`.

### Colors

Two shades per color: `faint` (default) and `dark`.

```html
<loomi-progress-bar percentage="30" color="success"></loomi-progress-bar>
<loomi-progress-bar percentage="40" color="warning"></loomi-progress-bar>
<loomi-progress-bar percentage="50" color="error" shade="dark"></loomi-progress-bar>
<loomi-progress-bar percentage="60" color="gray" shade="dark"></loomi-progress-bar>
```

### Striped and Animated

```html
<loomi-progress-bar percentage="60" color="error" shade="dark" striped></loomi-progress-bar>
<loomi-progress-bar percentage="50" color="success" shade="dark" striped animated></loomi-progress-bar>
```

## Progress Circle — Basic Usage

```html
<loomi-progress-circle percentage="45"></loomi-progress-circle>
```

The label is hidden by default. Show it with `show-label`; add the `%` sign with
`show-percent`.

```html
<loomi-progress-circle percentage="58" show-label></loomi-progress-circle>
<loomi-progress-circle percentage="58" show-label show-percent></loomi-progress-circle>
```

### Different Colors

```html
<loomi-progress-circle percentage="65" color="error"></loomi-progress-circle>
<loomi-progress-circle percentage="65" color="success" shade="dark"></loomi-progress-circle>
<loomi-progress-circle percentage="65" color="warning"></loomi-progress-circle>
```

### Different Sizes

```html
<loomi-progress-circle size="tiny" percentage="10"></loomi-progress-circle>
<loomi-progress-circle size="small" percentage="35"></loomi-progress-circle>
<loomi-progress-circle size="medium" percentage="60"></loomi-progress-circle>
<loomi-progress-circle size="big" percentage="80"></loomi-progress-circle>
<loomi-progress-circle size="large" percentage="95"></loomi-progress-circle>
```

`size` also accepts any pixel number for a fully custom diameter — pair it with
`circle-width` to keep the stroke proportional on larger circles.

```html
<loomi-progress-circle size="400" circle-width="50" percentage="89" show-label show-percent></loomi-progress-circle>
```

## Progress Steps

Progress steps now have their own package: [`@loomidev/progress-steps`](../progress-steps).
Use that package when you only need the stepper, or keep using `@loomidev/progress`
when you want the bar, circle, and stepper from one install.

## Accessibility

For the library-wide baseline, see [Foundations — Accessibility](https://loomiui.com/foundations/#accessibility).

## Responsive behavior

For the shared container and viewport rules, see [Foundations — Responsive behavior](https://loomiui.com/foundations/#responsive-behavior).

## Dark mode

For theme activation, token overrides, and contrast guidance, see [Foundations — Dark mode](https://loomiui.com/foundations/#dark-mode).

## Attributes

### Shared (bar and circle)

| Attribute    | Default   | Description            |
| ------------ | --------- | ---------------------- |
| `percentage` | `0`       | Fill percentage 0–100. |
| `color`      | `primary` | Any loomi color.       |
| `shade`      | `faint`   | `faint` \| `dark`      |

### `<loomi-progress-bar>`

| Attribute                      | Default    | Description                                                 |
| ------------------------------ | ---------- | ----------------------------------------------------------- |
| `show-percentage-label`        | `false`    | Show the % label. _(boolean)_                               |
| `show-percentage-tooltip`      | `false`    | Show the percentage in a tooltip above the bar. _(boolean)_ |
| `show-percentage-label-inline` | `true`     | Inside the bar vs. outside. _(boolean)_                     |
| `percentage-label-position`    | `top-left` | Outside-label placement.                                    |
| `percentage-prefix`            | _(blank)_  | Text shown before the percentage label.                     |
| `percentage-suffix`            | _(blank)_  | Text shown after the percentage label.                      |
| `striped`                      | `false`    | Diagonal-striped fill. _(boolean)_                          |
| `animated`                     | `false`    | Animates the stripes (requires `striped`). _(boolean)_      |

### `<loomi-progress-circle>`

| Attribute      | Default  | Description                                                           |
| -------------- | -------- | --------------------------------------------------------------------- |
| `size`         | `medium` | `tiny` \| `small` \| `medium` \| `big` \| `large`, or a pixel number. |
| `circle-width` | `10`     | Stroke thickness (viewBox units).                                     |
| `show-label`   | `false`  | Show the percentage in the center. _(boolean)_                        |
| `show-percent` | `false`  | Append a `%` sign. _(boolean)_                                        |

### `<loomi-progress-steps>`

| Attribute     | Default      | Description                                                  |
| ------------- | ------------ | ------------------------------------------------------------ |
| `current`     | `1`          | Current step number, starting at 1.                          |
| `color`       | `primary`    | Any loomi color.                                             |
| `orientation` | `horizontal` | `horizontal` \| `vertical`                                   |
| `size`        | `regular`    | `regular` \| `small`                                         |
| `clickable`   | `false`      | Lets child steps update `current` when selected. _(boolean)_ |

### `<loomi-progress-step>`

| Attribute     | Default    | Description                                                       |
| ------------- | ---------- | ----------------------------------------------------------------- |
| `label`       | _(blank)_  | Step label.                                                       |
| `description` | _(blank)_  | Secondary step text.                                              |
| `href`        | _(blank)_  | Renders the step as a link.                                       |
| `state`       | `upcoming` | `complete` \| `current` \| `upcoming` \| `error`                  |
| `value`       | `0`        | Optional value included in `loomi-progress-step-select` events.   |
| `active`      | `false`    | Marks this step current, same as `state="current"`. _(boolean)_   |
| `completed`   | `false`    | Marks this step complete, same as `state="complete"`. _(boolean)_ |
| `error`       | `false`    | Marks this step errored, same as `state="error"`. _(boolean)_     |
| `disabled`    | `false`    | Prevents selection. _(boolean)_                                   |
| `clickable`   | `false`    | Renders a selectable button when not using `href`. _(boolean)_    |
| `hide-index`  | `false`    | Hides the step number in incomplete markers. _(boolean)_          |

## Full Example

```html
<loomi-progress-bar
  percentage="50"
  color="error"
  show-percentage-label
  show-percentage-label-inline="false"
  percentage-label-position="top-left"
  percentage-prefix="uploading: "
  percentage-suffix=" completed"
  striped
  animated
></loomi-progress-bar>

<loomi-progress-circle
  percentage="50"
  color="error"
  size="medium"
  circle-width="12"
  show-label
  show-percent
></loomi-progress-circle>

<loomi-progress-steps current="2" color="error" clickable>
  <loomi-progress-step label="Details" description="Basic information"></loomi-progress-step>
  <loomi-progress-step label="Upload" description="Attach files"></loomi-progress-step>
  <loomi-progress-step label="Review" description="Confirm and submit"></loomi-progress-step>
</loomi-progress-steps>
```

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-progress-bar>`, `<loomi-progress-circle>`, `<loomi-progress-steps>`, and
`<loomi-progress-step>` are standard custom elements, so the browser can use them
in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other
frameworks. The important beginner rule is: install the package, import it once
before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/progress` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomidev/progress lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/progress build
pnpm --filter @loomidev/progress typecheck
```

### Choose your framework

<loomi-tabs>
<loomi-tab label="HTML" active>

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/progress"></script>

<loomi-progress-bar percentage="65" color="success" show-percent></loomi-progress-bar>
<loomi-progress-circle percentage="65" color="success"></loomi-progress-circle>
```

</loomi-tab>
<loomi-tab label="Bundlers and SPAs">

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/progress";
```

</loomi-tab>
<loomi-tab label="Blade">

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomidev/progress lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/progress";
```

```blade
<loomi-progress-bar percentage="65" color="success" show-percent></loomi-progress-bar>
<loomi-progress-circle percentage="65" color="success"></loomi-progress-circle>
```

</loomi-tab>
<loomi-tab label="React">

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import "@loomidev/progress";

export function LoomiExample() {
  return (
    <>
      <loomi-progress-bar percentage="65" color="success" show-percent></loomi-progress-bar>
      <loomi-progress-circle percentage="65" color="success"></loomi-progress-circle>
    </>
  );
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

</loomi-tab>
<loomi-tab label="Vue">

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import "@loomidev/progress";
</script>

<template>
  <loomi-progress-bar percentage="65" color="success" show-percent></loomi-progress-bar>
  <loomi-progress-circle percentage="65" color="success"></loomi-progress-circle>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

</loomi-tab>
<loomi-tab label="Angular">

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomidev/progress";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-progress-bar percentage="65" color="success" show-percent></loomi-progress-bar>
    <loomi-progress-circle percentage="65" color="success"></loomi-progress-circle>
  `,
})
export class AppComponent {}
```

</loomi-tab>
<loomi-tab label="Svelte / Astro">

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import "@loomidev/progress";
</script>

<loomi-progress-bar percentage="65" color="success" show-percent></loomi-progress-bar>
<loomi-progress-circle percentage="65" color="success"></loomi-progress-circle>
```

```astro
---
import "@loomidev/progress";
---

<loomi-progress-bar percentage="65" color="success" show-percent></loomi-progress-bar>
<loomi-progress-circle percentage="65" color="success"></loomi-progress-circle>
```

</loomi-tab>
</loomi-tabs>

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->

## Dependencies

- `@loomidev/core`
