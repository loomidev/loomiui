# @loomidev/accordion

`<loomi-accordion>` / `<loomi-accordion-item>`  is a simple stack of clickable headers that when clicked on, expand to reveal their content or collapse to hide their content. 



```bash
npm install @loomidev/accordion lit
```

```js
import "@loomidev/accordion";
```


## Basic Usage

Each item needs a `title` for the clickable header, and the content goes in the default slot.

```html
<loomi-accordion>
  <loomi-accordion-item title="What is LoomiUI?">
    <div>
      <p>
LoomiUI is an open-source UI component library built with Lit and Web Components, designed to help developers build modern, accessible, and high-performance user interfaces that work across frameworks and platforms. By embracing web standards, its components can be used in plain HTML or integrated seamlessly into frameworks such as Astro, Laravel, React, Vue, Angular, and Svelte. The library emphasizes consistency, composability, theming through CSS custom properties, and an excellent developer experience backed by comprehensive, interactive documentation.</p>
<p>
Beyond the core library, LoomiUI is envisioned as a complete ecosystem for building production-ready applications. While the core components remain free and open source, developers can extend their workflow with premium templates, starter kits, advanced components, and developer tools that accelerate development without sacrificing flexibility. Every component is documented with live, interactive examples that demonstrate its capabilities, making it easy for developers to learn, customize, and confidently adopt LoomiUI in projects of any size.
      </p>
    </div>
  </loomi-accordion-item>
  <loomi-accordion-item title="How do I install it?">
    <div>
      <p>LoomiUI is installed with npm, following the same setup flow as most modern frontend libraries.</p>
      <p class="pt-4">
      If you are new to LoomiUI, the recommended starting point is the main package. Installing this package registers all available LoomiUI components in one step, which lets you start building right away without deciding on individual component packages up front.
      </p>
    </div>
  </loomi-accordion-item>
  <loomi-accordion-item title="Can I theme it?">
    <p>You customize LoomiUI with normal CSS variables, just like any other styles in your app. Add the variables in your own stylesheet, and every LoomiUI component on the page can pick them up automatically.</p>

<p>That means you can start small: change one color, preview it, and adjust as needed. When you are happy with it, the same values apply across buttons, inputs, alerts, and more.</p>
  </loomi-accordion-item>
</loomi-accordion>
```

## Custom Title Content

Need something richer than plain text? Use the `title` slot instead of the `title`
attribute.

```html
<loomi-accordion>
  <loomi-accordion-item>
    <div slot="title" style="display:flex;align-items:center;gap:0.5rem">
      <loomi-icon name="cube"></loomi-icon>
      <div>
        <div>What is LoomiUI?</div>
        <div class="text-xs text-gray-500">v1.0.0</div>
      </div>
    </div>
    <p>
LoomiUI is an open-source UI component library built with Lit and Web Components, designed to help developers build modern, accessible, and high-performance user interfaces that work across frameworks and platforms. By embracing web standards, its components can be used in plain HTML or integrated seamlessly into frameworks such as Astro, Laravel, React, Vue, Angular, and Svelte. The library emphasizes consistency, composability, theming through CSS custom properties, and an excellent developer experience backed by comprehensive, interactive documentation.</p>
    </p>
  </loomi-accordion-item>
</loomi-accordion>
```

## Open by Default

```html
<loomi-accordion>
  <loomi-accordion-item title="Open on load" open>
    <p>This section starts expanded.</p>
  </loomi-accordion-item>
  <loomi-accordion-item title="Closed on load">
    <p>This one doesn't.</p>
  </loomi-accordion-item>
</loomi-accordion>
```

## Open Multiple Accordion Items

By default opening one item closes whatever else is open. Set `can-open-multiple` to
let items stay open independently.

```html
<loomi-accordion can-open-multiple>
  <loomi-accordion-item title="Dawn" open>Morning lifts the blinds and paints the room in gold.</loomi-accordion-item>
  <loomi-accordion-item title="Rain" open>Soft rain counts the roofs while the garden learns its song.</loomi-accordion-item>
</loomi-accordion>
```

## Ungrouped Accordions

By default items sit inside one shared card, separated by divider lines. Set
`grouped="false"` for each item to render as its own standalone card.

```html
<loomi-accordion grouped="false">
  <loomi-accordion-item title="Standalone breeze">A small wind signs its name across the lake.</loomi-accordion-item>
  <loomi-accordion-item title="Standalone moon">The moon keeps watch while city windows blink.</loomi-accordion-item>
</loomi-accordion>
```

## No Padding

```html
<loomi-accordion-item title="Tight content" no-padding>
  <img src="/banner.jpg" alt="" />
</loomi-accordion-item>
```

## Accessibility

loomi-accordion is built on semantic markup where the browser gives us the right behavior, and it adds ARIA only where the component has custom interaction. Keyboard users should be able to reach the same controls as pointer users, with visible focus treatment unless you explicitly turn it off on controls that support `show-focus-ring="false"`.

When the component displays status, progress, validation, or temporary feedback, pair it with clear labels or nearby text in your app so assistive technology users get the same context a sighted user gets from the visual treatment.

- Supports keyboard focus with visible `:focus-visible` styling on interactive controls.

## Responsive behavior

loomi-accordion is designed to fit the layout you place it in. It uses fluid widths, `min-width: 0`, wrapping, truncation, or stacked layouts where that keeps the component usable in cards, forms, sidebars, and mobile screens.

For dense layouts, give the parent container an intentional width and let the component fill it. For long labels or user-provided content, prefer real text that can wrap or truncate instead of fixed pixel assumptions.


## Dark mode

loomi-accordion uses Loomi semantic tokens such as `--loomi-surface`, `--loomi-surface-border`, `--loomi-text`, and palette accent tokens instead of hard-coded light colors. Borders, panels, hover states, and muted text are expected to shift with the active theme.

Add `.dark` to your app root with `@loomidev/theme-switcher`, or provide your own token overrides, and the component will inherit the dark-mode values through its shadow DOM.

- Respects `.dark` on `<html>` via `@loomidev/theme-switcher` or your app theme.

## Attributes

### `<loomi-accordion>`

| Attribute | Default | Description |
| --- | --- | --- |
| `grouped` | `true` | Group items in one card (vs standalone cards). _(boolean)_ |
| `can-open-multiple` | `false` | Allow multiple open items. _(boolean)_ |
| `color` | _(blank)_ | Background color when `grouped="false"`. |

### `<loomi-accordion-item>`

| Attribute | Default | Description |
| --- | --- | --- |
| `title` | _(blank)_ | Header text (or use the `title` slot). |
| `open` | `false` | Open by default. _(boolean)_ |
| `color` | _(blank)_ | Standalone background color. |
| `no-padding` | `false` | Remove body padding. _(boolean)_ |

**Slots:** default (body), `title`.

## Full Example

```html
<loomi-accordion grouped="false" can-open-multiple color="error">
  <loomi-accordion-item title="What is loomi?" open>
    <p>Small pieces of UI,<br />stitched lightly to any app,<br />ready when called.</p>
  </loomi-accordion-item>
  <loomi-accordion-item title="How do I install it?">
    <p>Install what you need,<br />import once at the app edge,<br />then write the element.</p>
  </loomi-accordion-item>
</loomi-accordion>
```

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-accordion-item>` and `<loomi-accordion>` are standard custom elements, so the browser can use them in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/accordion` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomidev/accordion lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/accordion build
pnpm --filter @loomidev/accordion typecheck
```

### Choose your framework

<loomi-tabs>
<loomi-tab label="Plain HTML" active>

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/accordion"></script>

<loomi-accordion>
  <loomi-accordion-item title="Shipping">Orders usually ship in 2 business days.</loomi-accordion-item>
  <loomi-accordion-item title="Returns">Returns are accepted within 30 days.</loomi-accordion-item>
</loomi-accordion>
```

</loomi-tab>
<loomi-tab label="Bundlers and SPAs">

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/accordion";
```

</loomi-tab>
<loomi-tab label="Laravel Blade">

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomidev/accordion lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/accordion";
```

```blade
<loomi-accordion>
  <loomi-accordion-item title="Shipping">Orders usually ship in 2 business days.</loomi-accordion-item>
  <loomi-accordion-item title="Returns">Returns are accepted within 30 days.</loomi-accordion-item>
</loomi-accordion>
```

</loomi-tab>
<loomi-tab label="React">

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import "@loomidev/accordion";

export function LoomiExample() {
  return (
    <loomi-accordion>
      <loomi-accordion-item title="Shipping">Orders usually ship in 2 business days.</loomi-accordion-item>
      <loomi-accordion-item title="Returns">Returns are accepted within 30 days.</loomi-accordion-item>
    </loomi-accordion>
  );
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

</loomi-tab>
<loomi-tab label="Vue">

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import "@loomidev/accordion";
</script>

<template>
  <loomi-accordion>
    <loomi-accordion-item title="Shipping">Orders usually ship in 2 business days.</loomi-accordion-item>
    <loomi-accordion-item title="Returns">Returns are accepted within 30 days.</loomi-accordion-item>
  </loomi-accordion>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

</loomi-tab>
<loomi-tab label="Angular">

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";
import "@loomidev/accordion";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-accordion>
      <loomi-accordion-item title="Shipping">Orders usually ship in 2 business days.</loomi-accordion-item>
      <loomi-accordion-item title="Returns">Returns are accepted within 30 days.</loomi-accordion-item>
    </loomi-accordion>
  `,
})
export class AppComponent {}
```

</loomi-tab>
<loomi-tab label="Svelte and Astro">

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import "@loomidev/accordion";
</script>

<loomi-accordion>
  <loomi-accordion-item title="Shipping">Orders usually ship in 2 business days.</loomi-accordion-item>
  <loomi-accordion-item title="Returns">Returns are accepted within 30 days.</loomi-accordion-item>
</loomi-accordion>
```

```astro
---
import "@loomidev/accordion";
---

<loomi-accordion>
  <loomi-accordion-item title="Shipping">Orders usually ship in 2 business days.</loomi-accordion-item>
  <loomi-accordion-item title="Returns">Returns are accepted within 30 days.</loomi-accordion-item>
</loomi-accordion>
```

</loomi-tab>
</loomi-tabs>

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->

## Dependencies

- `@loomidev/core`
