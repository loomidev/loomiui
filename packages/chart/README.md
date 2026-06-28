# @loomidev/chart

`<loomi-chart>` — a lightweight, dependency-free SVG chart: `bar`, `line`, `pie`, `donut`,
`radar` or `scatter`. Provide a single series via `data`.

```bash
npm install @loomidev/chart lit
```

```js
import "@loomidev/chart";
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
<loomi-chart id="radar-chart" type="radar" color="purple"></loomi-chart>
<loomi-chart id="scatter-chart" type="scatter" color="cyan"></loomi-chart>

<script type="module">
  const series = [
    { label: "Red", value: 12 },
    { label: "Blue", value: 19 },
    { label: "Yellow", value: 13 },
    { label: "Green", value: 15 },
  ];
  for (const id of ["bar-chart", "line-chart", "pie-chart", "donut-chart", "radar-chart", "scatter-chart"]) {
    document.getElementById(id).data = series;
  }
</script>
```

`radar` plots each point around a circle (best with 3+ points) and connects them into a
filled shape — good for comparing several metrics on the same scale. `scatter` plots each
point as a standalone marker on the same axes as `bar`/`line`, with no connecting line.

## Accent Color

`color` sets the chart's single accent: the bar fill, the line/dot stroke, the radar
polygon, and the scatter marker fill. Always assign `data` — an empty chart has nothing
to color.

```html
<loomi-chart id="trend" type="line" color="violet"></loomi-chart>

<script type="module">
  document.getElementById("trend").data = [
    { label: "Jan", value: 30 },
    { label: "Feb", value: 55 },
    { label: "Mar", value: 42 },
    { label: "Apr", value: 60 },
  ];
</script>
```

## Custom Colors per Segment

`pie`/`donut` automatically cycle a built-in palette per slice, since distinguishing
slices is the point of a proportional chart. `bar`/`scatter`/`radar` use the single
accent `color` by default, since they're more often a single series. Either way, set
`color` on individual data points to override the default for that point only.

```html
<loomi-chart id="colorway" type="bar" color="primary"></loomi-chart>

<script type="module">
  document.getElementById("colorway").data = [
    { label: "Engineering", value: 40, color: "primary" },
    { label: "Design", value: 25, color: "pink" },
    { label: "Sales", value: 35, color: "orange" },
  ];
</script>
```

## Shade Mode

`shade="light"` renders paler fills (and a paler line/radar stroke) instead of the
default, more saturated `dark` look. Useful on busy dashboards where bold colors compete
for attention.

```html
<loomi-chart id="soft-bars" type="bar" color="blue" shade="light"></loomi-chart>
<loomi-chart id="soft-donut" type="donut" shade="light" show-legend></loomi-chart>
```

### Borders

In `shade="light"`, shapes get a border in a higher (darker) shade of their own color by
default, so pale fills stay well-defined. Turn it off with `show-border="false"` for a
flatter, monochrome look. Borders have no effect in `shade="dark"` (the default fill is
already saturated enough to read without one).

```html
<loomi-chart id="bordered" type="bar" color="orange" shade="light"></loomi-chart>
<loomi-chart id="borderless" type="bar" color="orange" shade="light" show-border="false"></loomi-chart>
```

## Showing the Y-Axis

`show-y-axis` draws a value axis with min/max labels, for `bar`, `line` and `scatter`.

```html
<loomi-chart id="with-axis" type="line" color="primary" show-y-axis></loomi-chart>
```

## Vertical Line Charts

`vertical` (only on `type="line"`) flips the axes so categories run top-to-bottom and the
value runs left-to-right — handy when category labels are long, or to match a
horizontal-bar-style layout next to other vertical content.

```html
<loomi-chart id="vertical-trend" type="line" color="primary" vertical show-y-axis></loomi-chart>

<script type="module">
  document.getElementById("vertical-trend").data = [
    { label: "Engineering", value: 40 },
    { label: "Design", value: 25 },
    { label: "Sales", value: 35 },
  ];
</script>
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
| `type` | `bar` | `bar` \| `line` \| `pie` \| `donut` \| `radar` \| `scatter` |
| `data` | `[]` | Series — `{ label, value, color? }[]` (property or JSON). |
| `color` | `primary` | Single accent color. Fill for bar/scatter/radar, line/dot stroke for line, and the default for points without their own `color` (pie/donut cycle a built-in palette instead). |
| `shade` | `dark` | `dark` \| `light` — lighter fills/strokes in `light` mode. |
| `show-border` | `true` | In `shade="light"`, outline shapes in a higher shade of their own color. No effect in `shade="dark"`. _(boolean)_ |
| `show-y-axis` | `false` | Show a value axis with min/max labels (`bar`/`line`/`scatter`). _(boolean)_ |
| `vertical` | `false` | `type="line"` only — flips the axes so categories run top-to-bottom. _(boolean)_ |
| `show-legend` | `false` | Show a legend (most useful for pie/donut). _(boolean)_ |
| `donut-radius` | `44` | Inner-hole radius (SVG units) for `type="donut"`. |

> A compact, dependency-free chart for dashboards — single series only, no mixed chart
> types, no Chart.js-style configuration objects. For heavier analytical charting
> (multiple datasets per chart, bubble charts, fine-grained axis control), pair LoomiUI
> with a dedicated charting library like Chart.js instead.

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
npm install @loomidev/chart lit
```

If you are contributing to LoomiUI itself, first move to the top-level `components` folder. That is where the main `package.json` for all packages lives, and `pnpm --filter ...` commands should be run from there:

```bash
cd /path/to/your-copy-of-loomiui/components
pnpm --filter @loomidev/chart build
pnpm --filter @loomidev/chart typecheck
```

### Plain HTML

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/chart"></script>

<loomi-chart id="sales-chart" type="bar" color="green"></loomi-chart>
```

### Bundlers and single-page apps

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/chart";
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
npm install @loomidev/chart lit
npm run dev
```

```js
// resources/js/app.js
import "@loomidev/chart";
```

```blade
<loomi-chart id="sales-chart" type="bar" color="green"></loomi-chart>
```

### React

React can render Loomi tags directly. If you are on React 18, or if you need to pass arrays, objects, or functions, use a ref and assign those values after the component mounts.

```jsx
import { useEffect, useRef } from "react";
import "@loomidev/chart";

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
import "@loomidev/chart";

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
import "@loomidev/chart";

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
  import "@loomidev/chart";

  let el;

  onMount(() => {
    el.data = [{ label: "Jan", value: 30 }, { label: "Feb", value: 55 }];
  });
</script>

<loomi-chart bind:this={el}></loomi-chart>
```

```astro
---
import "@loomidev/chart";
---

<loomi-chart id="sales-chart" type="bar" color="green"></loomi-chart>
```

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->
