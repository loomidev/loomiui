# @loomidev/horizontal-line-graph

`<loomi-horizontal-line-graph>` — a single proportion bar split into colored segments,
with an optional legend. Good for showing how a whole breaks down into parts — market
share, demographic split, budget allocation.

```bash
npm install @loomidev/horizontal-line-graph lit
```

```js
import "@loomidev/horizontal-line-graph";
```


## Accessibility
- `role="img"` with an `aria-label` summarizing segment percentages.
- Legend repeats segment labels for sighted users.

## Responsive behavior
- Legend wraps on narrow viewports.

## Dark mode
- Track and legend text use semantic muted/text tokens.
## Basic Usage

```html
<loomi-horizontal-line-graph id="g"></loomi-horizontal-line-graph>

<script type="module">
  document.getElementById("g").data = [
    { label: "Direct", value: 45, color: "primary" },
    { label: "Search", value: 30, color: "success" },
    { label: "Social", value: 25, color: "warning" },
  ];
</script>
```

## Custom Segment Colors

`color` on each segment accepts any loomi color name or a raw CSS color.

```html
<loomi-horizontal-line-graph id="ages"></loomi-horizontal-line-graph>

<script type="module">
  document.getElementById("ages").data = [
    { label: "Under 40", value: 24, color: "cyan" },
    { label: "40–60", value: 43, color: "#a855f7" },
    { label: "Above 60", value: 33, color: "gray" },
  ];
</script>
```

## Hiding the Legend or Values

```html
<loomi-horizontal-line-graph id="g2" show-legend="false"></loomi-horizontal-line-graph>
<loomi-horizontal-line-graph id="g3" show-values="false"></loomi-horizontal-line-graph>
```

## Practical Example: Side-by-Side Cards

```html
<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:1.5rem">
  <loomi-card title="Mobile Money Penetration">
    <loomi-horizontal-line-graph id="mm"></loomi-horizontal-line-graph>
  </loomi-card>
  <loomi-card title="Farmer Age Ratio">
    <loomi-horizontal-line-graph id="age"></loomi-horizontal-line-graph>
  </loomi-card>
</div>

<script type="module">
  document.getElementById("mm").data = [
    { label: "MTN", value: 55, color: "yellow" },
    { label: "Vodafone", value: 30, color: "error" },
    { label: "AirtelTigo", value: 15, color: "blue" },
  ];
  document.getElementById("age").data = [
    { label: "Above 60", value: 33, color: "cyan" },
    { label: "40–60", value: 43, color: "purple" },
    { label: "Under 40", value: 24, color: "gray" },
  ];
</script>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `data` | `[]` | Segments — `{ label, value, color? }[]` (loomi color name or any CSS color). |
| `show-legend` | `true` | Show the legend. _(boolean)_ |
| `show-values` | `true` | Show each segment's percentage. _(boolean)_ |

## Full Example

```html
<loomi-horizontal-line-graph id="full-graph"></loomi-horizontal-line-graph>

<script type="module">
  document.getElementById("full-graph").data = [
    { label: "Women Farmers", value: 55.8, color: "pink" },
    { label: "Men Farmers", value: 44.2, color: "blue" },
  ];
</script>
```

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-horizontal-line-graph>` is a standard custom element, so the browser can use it in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/horizontal-line-graph` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomidev/horizontal-line-graph lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/horizontal-line-graph build
pnpm --filter @loomidev/horizontal-line-graph typecheck
```

### Plain HTML

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/horizontal-line-graph"></script>

<loomi-horizontal-line-graph id="traffic-sources"></loomi-horizontal-line-graph>
```

### Bundlers and single-page apps

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/horizontal-line-graph";
```


This component accepts `data` as a JavaScript property. Use an HTML attribute only for simple strings; use a property when you pass arrays, objects, or functions.

```js
const el = document.querySelector("loomi-horizontal-line-graph");
el.data = [{ label: "Direct", value: 45, color: "primary" }, { label: "Search", value: 30, color: "success" }];
```

### Laravel Blade

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomidev/horizontal-line-graph lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/horizontal-line-graph";
```

```blade
<loomi-horizontal-line-graph id="traffic-sources"></loomi-horizontal-line-graph>
```

### React

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import { useEffect, useRef } from "react";
import "@loomidev/horizontal-line-graph";

export function LoomiExample() {
  const el = useRef(null);

  useEffect(() => {
    el.current.data = [{ label: "Direct", value: 45, color: "primary" }, { label: "Search", value: 30, color: "success" }];
  }, []);

  return <loomi-horizontal-line-graph ref={el}></loomi-horizontal-line-graph>;
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

### Vue

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import { onMounted, ref } from "vue";
import "@loomidev/horizontal-line-graph";

const el = ref(null);

onMounted(() => {
  el.value.data = [{ label: "Direct", value: 45, color: "primary" }, { label: "Search", value: 30, color: "success" }];
});
</script>

<template>
  <loomi-horizontal-line-graph ref="el"></loomi-horizontal-line-graph>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

### Angular

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, ViewChild } from "@angular/core";
import "@loomidev/horizontal-line-graph";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-horizontal-line-graph #el></loomi-horizontal-line-graph>
  `,
})
export class AppComponent implements AfterViewInit {
  @ViewChild("el") el!: ElementRef<any>;

  ngAfterViewInit() {
    this.el.nativeElement.data = [{ label: "Direct", value: 45, color: "primary" }, { label: "Search", value: 30, color: "success" }];
  }
}
```

### Svelte and Astro

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import { onMount } from "svelte";
  import "@loomidev/horizontal-line-graph";

  let el;

  onMount(() => {
    el.data = [{ label: "Direct", value: 45, color: "primary" }, { label: "Search", value: 30, color: "success" }];
  });
</script>

<loomi-horizontal-line-graph bind:this={el}></loomi-horizontal-line-graph>
```

```astro
---
import "@loomidev/horizontal-line-graph";
---

<loomi-horizontal-line-graph id="traffic-sources"></loomi-horizontal-line-graph>
```

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->
