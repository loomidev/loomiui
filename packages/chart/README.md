# @loomi/chart

`<loomi-chart>` — a lightweight, dependency-free SVG chart: `bar`, `line`, `pie` or
`donut`. Provide a single series via `data`.

```bash
npm install @loomi/chart lit
```

```js
import "@loomi/chart";
```

## Basic Usage

```html
<loomi-chart id="c"></loomi-chart>

<script type="module">
  document.getElementById("c").data = [
    { label: "Jan", value: 30 },
    { label: "Feb", value: 55 },
    { label: "Mar", value: 42 },
    { label: "Apr", value: 60 },
  ];
</script>
```

## Chart Types

```html
<loomi-chart id="bar-chart" type="bar"></loomi-chart>
<loomi-chart id="line-chart" type="line" color="green"></loomi-chart>
<loomi-chart id="pie-chart" type="pie" show-legend></loomi-chart>
<loomi-chart id="donut-chart" type="donut" show-legend></loomi-chart>

<script type="module">
  const series = [
    { label: "Red", value: 12 },
    { label: "Blue", value: 19 },
    { label: "Yellow", value: 13 },
    { label: "Green", value: 15 },
  ];
  for (const id of ["bar-chart", "line-chart", "pie-chart", "donut-chart"]) {
    document.getElementById(id).data = series;
  }
</script>
```

## Custom Colors per Segment

For `bar`/`pie`/`donut` charts, set `color` on individual data points to override the
single accent color.

```html
<loomi-chart id="colorway" type="pie" show-legend></loomi-chart>

<script type="module">
  document.getElementById("colorway").data = [
    { label: "Engineering", value: 40, color: "primary" },
    { label: "Design", value: 25, color: "pink" },
    { label: "Sales", value: 35, color: "orange" },
  ];
</script>
```

## Accent Color (Line Charts)

`color` on the `<loomi-chart>` element itself sets the line/stroke color for `line`
charts (and the default fill when points don't set their own `color`).

```html
<loomi-chart id="trend" type="line" color="violet"></loomi-chart>
```

## Showing the Legend

Most useful for `pie`/`donut` charts where labels can't fit directly on the chart.

```html
<loomi-chart id="with-legend" type="donut" show-legend></loomi-chart>
```

## Practical Example: Dashboard Card

```html
<loomi-card title="Monthly Revenue">
  <loomi-chart id="revenue" type="bar" color="primary"></loomi-chart>
</loomi-card>

<script type="module">
  document.getElementById("revenue").data = [
    { label: "Jan", value: 12000 },
    { label: "Feb", value: 15400 },
    { label: "Mar", value: 13900 },
    { label: "Apr", value: 18200 },
  ];
</script>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `type` | `bar` | `bar` \| `line` \| `pie` \| `donut` |
| `data` | `[]` | Series — `{ label, value, color? }[]` (property or JSON). |
| `color` | `primary` | Accent color for line charts, and the default for points without their own `color`. |
| `show-legend` | `false` | Show a legend (most useful for pie/donut). _(boolean)_ |

> A compact, dependency-free chart for dashboards — single series only, no mixed chart
> types, no Chart.js-style configuration objects. For heavier analytical charting
> (multiple datasets, bubble/radar/scatter, fine-grained axis control), pair LoomiUI with
> a dedicated charting library like Chart.js instead.

## Full Example

```html
<loomi-chart id="full-chart" type="donut" color="primary" show-legend></loomi-chart>

<script type="module">
  document.getElementById("full-chart").data = [
    { label: "Direct", value: 45, color: "primary" },
    { label: "Search", value: 30, color: "green" },
    { label: "Social", value: 25, color: "orange" },
  ];
</script>
```

<!-- BEGIN loomi-framework-guide -->

## Framework integration

`<loomi-chart>` is a standard custom element, so the browser can use it in plain HTML, Blade, React, Vue, Angular, Svelte, Astro, and most other frameworks. The important beginner rule is: install the package, import it once before the tag is rendered, then write the Loomi tag in your template.

### Where to run commands

Run install commands from the app where you want to use this component. That means the folder that contains that app's `package.json`. Do not run these install commands from `packages/chart` unless you are editing LoomiUI itself.

```bash
cd /path/to/your-app
npm install @loomi/chart lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomi/chart build
pnpm --filter @loomi/chart typecheck
```

### Plain HTML

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomi/chart"></script>

<loomi-chart id="sales-chart" type="bar" color="green"></loomi-chart>
```

### Bundlers and single-page apps

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomi/chart";
```


This component accepts `data` as a JavaScript property. Use an HTML attribute only for simple strings; use a property when you pass arrays, objects, or functions.

```js
const el = document.querySelector("loomi-chart");
el.data = [{ label: "Jan", value: 30 }, { label: "Feb", value: 55 }];
```

### Laravel Blade

Run the install command from your Laravel project root, then import the component in `resources/js/app.js`. If your project uses Laravel Vite, `npm run dev` and `npm run build` should also be run from the Laravel project root.

```bash
cd /path/to/your-laravel-app
npm install @loomi/chart lit
npm run dev
```

```js
// resources/js/app.js
import "@loomi/chart";
```

```blade
<loomi-chart id="sales-chart" type="bar" color="green"></loomi-chart>
```

### React

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import { useEffect, useRef } from "react";
import "@loomi/chart";

export function LoomiExample() {
  const el = useRef(null);

  useEffect(() => {
    el.current.data = [{ label: "Jan", value: 30 }, { label: "Feb", value: 55 }];
  }, []);

  return <loomi-chart ref={el}></loomi-chart>;
}
```

If TypeScript does not recognize the Loomi tag in JSX, add it to your app's JSX type declarations.

### Vue

Import the package in the component that uses it, or once in your main Vue file. Vue templates can use Loomi tags directly. For arrays, objects, or functions, pass the value as a JavaScript property instead of as plain text.

```vue
<script setup>
import { onMounted, ref } from "vue";
import "@loomi/chart";

const el = ref(null);

onMounted(() => {
  el.value.data = [{ label: "Jan", value: 30 }, { label: "Feb", value: 55 }];
});
</script>

<template>
  <loomi-chart ref="el"></loomi-chart>
</template>
```

If Vue warns that the tag is an unknown component, configure `compilerOptions.isCustomElement` for tags that start with `loomi-` in your Vite or Vue config.

### Angular

Import the package once and tell Angular to allow custom HTML tags with `CUSTOM_ELEMENTS_SCHEMA`. For NgModule apps, add the schema to the module instead of the standalone component.

```ts
// app.component.ts
import { AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, ViewChild } from "@angular/core";
import "@loomi/chart";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <loomi-chart #el></loomi-chart>
  `,
})
export class AppComponent implements AfterViewInit {
  @ViewChild("el") el!: ElementRef<any>;

  ngAfterViewInit() {
    this.el.nativeElement.data = [{ label: "Jan", value: 30 }, { label: "Feb", value: 55 }];
  }
}
```

### Svelte and Astro

Svelte can import the package inside a component script. Astro can import it in the frontmatter of the page or layout where the tag appears.

```svelte
<script>
  import { onMount } from "svelte";
  import "@loomi/chart";

  let el;

  onMount(() => {
    el.data = [{ label: "Jan", value: 30 }, { label: "Feb", value: 55 }];
  });
</script>

<loomi-chart bind:this={el}></loomi-chart>
```

```astro
---
import "@loomi/chart";
---

<loomi-chart id="sales-chart" type="bar" color="green"></loomi-chart>
```

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->
