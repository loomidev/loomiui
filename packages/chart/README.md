# @loomidev/chart

`<loomi-chart>` is a lightweight SVG chart component for quick visuals. Choose from
`bar`, `line`, `area`, `pie`, `donut`, `radar`, `radial`, or `scatter`, and pass a single data series
through its `data` property. Tooltips and the y-axis are on by default — disable either with
`show-tooltip="false"` or `show-y-axis="false"`.

```bash
npm install @loomidev/chart lit
```

```js
import "@loomidev/chart";
```


## Basic Usage

You need to define either  a unique `id` or `class` attribute on the chart element, then assign the `data` property in JavaScript. The `data` property is an array of objects, each with a `label`, a `value`, and an optional `color`.
`data` can either be loaded from an API or updated at runtime.

```html.skip
<loomi-chart id="basic" color="primary" color2="success" series-label="Revenue" series2-label="Target"></loomi-chart>

<script type="module">
  document.getElementById("basic").data = [
    { label: "Jan", value: 42, value2: 35 },
    { label: "Feb", value: 38, value2: 40 },
    { label: "Mar", value: 55, value2: 48 },
    { label: "Apr", value: 48, value2: 52 },
    { label: "May", value: 62, value2: 58 },
    { label: "Jun", value: 58, value2: 61 },
    { label: "Jul", value: 71, value2: 65 },
    { label: "Aug", value: 65, value2: 68 },
    { label: "Sep", value: 52, value2: 50 },
    { label: "Oct", value: 60, value2: 57 },
    { label: "Nov", value: 47, value2: 49 },
    { label: "Dec", value: 54, value2: 58 },
  ];
</script>
```

```js
<loomi-chart id="basic"></loomi-chart>
```

```js
<loomi-chart class="basic-chart"></loomi-chart>
```

```js
<script type="module">
    let chartData = [
        { label: "Jan", value: 42, value2: 35 },
        { label: "Feb", value: 38, value2: 40 },
        { label: "Mar", value: 55, value2: 48 },
        { label: "Apr", value: 48, value2: 52 },
        { label: "May", value: 62, value2: 58 },
        { label: "Jun", value: 58, value2: 61 },
        { label: "Jul", value: 71, value2: 65 },
        { label: "Aug", value: 65, value2: 68 },
        { label: "Sep", value: 52, value2: 50 },
        { label: "Oct", value: 60, value2: 57 },
        { label: "Nov", value: 47, value2: 49 },
        { label: "Dec", value: 54, value2: 58 },
    ];
    
    document.getElementById("basic").data = chartData;
    // or
    document.querySelector(".basic-chart").data = chartData;
</script>
```

The `data` property also accepts a JSON-encoded string passed directly through the HTML `data` attribute. 
This makes static charts possible even when no JavaScript runs on the page, which is useful in Markdown docs, 
CMS fields, emails, or server-rendered templates where inline scripting is limited.

When using attribute JSON, ensure the string is valid JSON syntax and properly escaped for HTML. 
If parsing fails, the component safely falls back to an empty data series instead of throwing an error, 
so the chart remains stable and the page does not break.

```html
<loomi-chart 
    type="bar" 
    data='[{"label":"Jan","value":30},{"label":"Feb","value":55}]'></loomi-chart>
```

## Hover Tooltips

Label/value tooltips are shown by default while hovering chart points. On cartesian
charts (`bar`, `line`, `area`, `scatter`), the nearest point is tracked as you move across
the plot — with a crosshair and active dot/bar highlight. Polar charts (`pie`, `donut`,
`radar`, `radial`) show a tooltip per slice/segment. Turn them off with `show-tooltip="false"`.

```html
<loomi-chart type="line" color="primary" color2="success" series-label="Revenue" series2-label="Target"
  data='[{"label":"Jan","value":42,"value2":35},{"label":"Feb","value":38,"value2":40},{"label":"Mar","value":55,"value2":48},{"label":"Apr","value":48,"value2":52},{"label":"May","value":62,"value2":58},{"label":"Jun","value":58,"value2":61},{"label":"Jul","value":71,"value2":65},{"label":"Aug","value":65,"value2":68},{"label":"Sep","value":52,"value2":50},{"label":"Oct","value":60,"value2":57},{"label":"Nov","value":47,"value2":49},{"label":"Dec","value":54,"value2":58}]'></loomi-chart>
```

## Chart Types
The chart component exposes a `type` attribute that lets you choose from a variety of
chart types. The `type` you choose depends on the data you're trying to visualize. 
Default `type` is `bar`. The available chart types are:

| Type | Description |
| --- | --- |
| `bar` | Compares values across categories — supports grouped bars via `value2`/`value3` or a `values` array. |
| `line` | Shows trends with a stroke, area fill, and dots. |
| `area` | Like `line` but emphasizes the filled region (no dots). |
| `pie` | Displays part-to-whole distribution in a full circle. |
| `donut` | Part-to-whole with a center hole and total label. |
| `radar` | Compares multiple metrics in a radial layout (recommended with 3+ points). |
| `radial` | Stacked radial bars around a center total (shadcn-style radial chart). |
| `scatter` | Plots independent points on shared axes without connecting lines. |

All chart types use the same `data` shape, so you can change `type` without reshaping the dataset.

```html
<loomi-chart id="bar-chart" type="bar" color="primary" color2="success" series-label="Revenue" series2-label="Target"></loomi-chart>
<loomi-chart id="line-chart" type="line" color="primary" color2="success" series-label="Revenue" series2-label="Target"></loomi-chart>
<loomi-chart id="pie-chart" type="pie" show-legend></loomi-chart>
<loomi-chart id="donut-chart" type="donut" show-legend></loomi-chart>
<loomi-chart id="radar-chart" type="radar" color="success"></loomi-chart>
<loomi-chart id="scatter-chart" type="scatter" color="warning"></loomi-chart>

<script type="module">
  const yearSeries = [
    { label: "Jan", value: 42, value2: 35 },
    { label: "Feb", value: 38, value2: 40 },
    { label: "Mar", value: 55, value2: 48 },
    { label: "Apr", value: 48, value2: 52 },
    { label: "May", value: 62, value2: 58 },
    { label: "Jun", value: 58, value2: 61 },
    { label: "Jul", value: 71, value2: 65 },
    { label: "Aug", value: 65, value2: 68 },
    { label: "Sep", value: 52, value2: 50 },
    { label: "Oct", value: 60, value2: 57 },
    { label: "Nov", value: 47, value2: 49 },
    { label: "Dec", value: 54, value2: 58 },
  ];
  document.getElementById("bar-chart").data = yearSeries;
  document.getElementById("line-chart").data = yearSeries;
  for (const id of ["pie-chart", "donut-chart", "radar-chart", "scatter-chart"]) {
    document.getElementById(id).data = [
      { label: "Direct", value: 45 },
      { label: "Search", value: 30 },
      { label: "Social", value: 15 },
      { label: "Email", value: 10 },
    ];
  }
</script>
```

`radar` plots each point around a circle (best with 3+ points) and connects them into a
filled shape — good for comparing several metrics on the same scale. `scatter` plots each
point as a standalone marker on the same axes as `bar`/`line`, with no connecting line.

## Dual series (bar & line)

Add an optional `value2` on each data point to compare two metrics per category — grouped
bars on `type="bar"` and a second line on `type="line"`. Set `color2`, `series-label`, and
`series2-label` to style and label each series in the tooltip.

```html
<loomi-chart type="bar" color="primary" color2="success" series-label="Revenue" series2-label="Target"
  data='[{"label":"Jan","value":42,"value2":35},{"label":"Feb","value":38,"value2":40},{"label":"Mar","value":55,"value2":48}]'></loomi-chart>
```

## Grouped bars (multiple series per category)

Use grouped bars when **one x-axis label maps to several bars** — e.g. tasks completed
by each developer across the week. The point's `label` is the category on the x-axis;
each entry in `values` is one bar with its own name and height.

| Field | Role |
| --- | --- |
| `label` | X-axis category (`Mon`, `Tue`, …) |
| `values[].label` | Series name in the legend and tooltip (`Mike`, `Sam`, …) |
| `values[].value` | Bar height |
| `values[].color` | Optional — overrides the palette for that series |

Series order follows first-seen labels across the dataset. Turn on `show-legend` so the
legend lists developers, not days. Hover a category to see every series value in the
tooltip.

`value` is still required on each point but ignored when `values` is present. For two or
three fixed series, `value2` / `value3` still work — use `values` when you need four or
more bars per category or labels that differ from `series-label`.

```html
<loomi-card title="Weekly Task Completions">
  <loomi-chart id="tasks" type="bar" show-legend shade="dark"></loomi-chart>
</loomi-card>

<script type="module">
  document.getElementById("tasks").data = [
    {
      label: "Mon",
      value: 0,
      values: [
        { label: "Mike", value: 4, color: "primary" },
        { label: "Sam", value: 6, color: "success" },
        { label: "Fred", value: 3, color: "warning" },
        { label: "Sara", value: 8, color: "success" },
      ],
    },
    {
      label: "Tue",
      value: 0,
      values: [
        { label: "Mike", value: 5, color: "primary" },
        { label: "Sam", value: 4, color: "success" },
        { label: "Fred", value: 7, color: "warning" },
        { label: "Sara", value: 6, color: "success" },
      ],
    },
    {
      label: "Wed",
      value: 0,
      values: [
        { label: "Mike", value: 3, color: "primary" },
        { label: "Sam", value: 8, color: "success" },
        { label: "Fred", value: 5, color: "warning" },
        { label: "Sara", value: 7, color: "success" },
      ],
    },
    {
      label: "Thu",
      value: 0,
      values: [
        { label: "Mike", value: 6, color: "primary" },
        { label: "Sam", value: 5, color: "success" },
        { label: "Fred", value: 4, color: "warning" },
        { label: "Sara", value: 9, color: "success" },
      ],
    },
    {
      label: "Fri",
      value: 0,
      values: [
        { label: "Mike", value: 7, color: "primary" },
        { label: "Sam", value: 6, color: "success" },
        { label: "Fred", value: 8, color: "warning" },
        { label: "Sara", value: 5, color: "success" },
      ],
    },
  ];
</script>
```

## Accent Color

`color` sets the chart's single accent: the bar fill, the line/dot stroke, the radar
polygon, and the scatter marker fill. Always assign `data` — an empty chart has nothing
to color.

```html
<loomi-chart id="trend" type="line" color="success"></loomi-chart>

<script type="module">
  document.getElementById("trend").data = [
    { label: "Jan", value: 42 },
    { label: "Feb", value: 38 },
    { label: "Mar", value: 55 },
    { label: "Apr", value: 48 },
    { label: "May", value: 62 },
    { label: "Jun", value: 58 },
    { label: "Jul", value: 71 },
    { label: "Aug", value: 65 },
    { label: "Sep", value: 52 },
    { label: "Oct", value: 60 },
    { label: "Nov", value: 47 },
    { label: "Dec", value: 54 },
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
    { label: "Design", value: 25, color: "error" },
    { label: "Sales", value: 35, color: "warning" },
  ];
</script>
```

## Gapped Pie and Donut Slices

Add `with-gap` when pie or donut segments need visible breathing room between slices.
The component draws a surface-colored stroke between pieces, so each slice stays
separate in light and dark themes.

```html
<loomi-chart type="donut" with-gap show-legend
  data='[{"label":"Direct","value":45},{"label":"Search","value":30},{"label":"Social","value":25}]'></loomi-chart>
```

## Shade Mode

`shade="light"` renders paler fills (and a paler line/radar stroke) instead of the
default, more saturated `dark` look. Useful on busy dashboards where bold colors compete
for attention.

```html
<loomi-chart type="bar" color="primary" shade="light"
  data='[{"label":"Jan","value":30},{"label":"Feb","value":55},{"label":"Mar","value":42},{"label":"Apr","value":60}]'></loomi-chart>

<loomi-chart type="donut" shade="light" show-legend
  data='[{"label":"Direct","value":45},{"label":"Search","value":30},{"label":"Social","value":25}]'></loomi-chart>
```

### Borders

In `shade="light"`, shapes get a border in a higher (darker) shade of their own color by
default, so pale fills stay well-defined. Turn it off with `show-border="false"` for a
flatter, monochrome look. Borders have no effect in `shade="dark"` (the default fill is
already saturated enough to read without one).

```html
<loomi-chart type="bar" color="warning" shade="light"
  data='[{"label":"Jan","value":30},{"label":"Feb","value":55},{"label":"Mar","value":42},{"label":"Apr","value":60}]'></loomi-chart>

<loomi-chart type="bar" color="warning" shade="light" show-border="false"
  data='[{"label":"Jan","value":30},{"label":"Feb","value":55},{"label":"Mar","value":42},{"label":"Apr","value":60}]'></loomi-chart>
```

## Showing the Y-Axis

The y-axis with min/max value labels is shown by default on `bar`, `line`, `area`, and
`scatter` charts. Hide it with `show-y-axis="false"`.

```html
<loomi-chart type="line" color="primary" show-y-axis="false"
  data='[{"label":"Jan","value":42},{"label":"Feb","value":38},{"label":"Mar","value":55},{"label":"Apr","value":48},{"label":"May","value":62},{"label":"Jun","value":58},{"label":"Jul","value":71},{"label":"Aug","value":65},{"label":"Sep","value":52},{"label":"Oct","value":60},{"label":"Nov","value":47},{"label":"Dec","value":54}]'></loomi-chart>
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
<loomi-chart type="donut" show-legend
  data='[{"label":"Direct","value":45},{"label":"Search","value":30},{"label":"Social","value":25}]'></loomi-chart>
```

### Legend Position

`legend-position` places the legend relative to the chart canvas: `top`, `bottom`
(default), `left`, or `right`. `left`/`right` lay the legend out in a column alongside
the chart instead of wrapping below it.

```html
<loomi-chart type="donut" show-legend legend-position="right"
  data='[{"label":"Direct","value":45},{"label":"Search","value":30},{"label":"Social","value":25}]'></loomi-chart>
```

## Practical Example: Dashboard Card

```html
<loomi-card title="Monthly Revenue">
  <div class="loomi-chart-grid">
    <loomi-chart id="revenue-bar" type="bar" color="primary" color2="success" series-label="Revenue" series2-label="Target"></loomi-chart>
    <loomi-chart id="revenue-line" type="line" color="primary" color2="success" series-label="Revenue" series2-label="Target"></loomi-chart>
  </div>
</loomi-card>

<script type="module">
  const revenue = [
    { label: "Jan", value: 12000, value2: 11000 },
    { label: "Feb", value: 15400, value2: 14000 },
    { label: "Mar", value: 13900, value2: 14500 },
    { label: "Apr", value: 18200, value2: 17000 },
    { label: "May", value: 16800, value2: 17500 },
    { label: "Jun", value: 19500, value2: 18800 },
    { label: "Jul", value: 21000, value2: 20000 },
    { label: "Aug", value: 18700, value2: 19200 },
    { label: "Sep", value: 17200, value2: 16800 },
    { label: "Oct", value: 19800, value2: 20500 },
    { label: "Nov", value: 16500, value2: 17000 },
    { label: "Dec", value: 22400, value2: 21500 },
  ];
  document.getElementById("revenue-bar").data = revenue;
  document.getElementById("revenue-line").data = revenue;
</script>
```

## Accessibility
- SVG root exposes `role="img"` with a descriptive `aria-label`.
- Interactive hits remain pointer-driven; provide a text summary nearby for critical data.

## Responsive behavior
- SVG scales to container width; legend wraps below `640px` when positioned horizontally.

## Dark mode
- Grid lines and axis labels use `--loomi-surface-border` and `--loomi-text-muted` instead of raw gray ramps.

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `type` | `bar` | `bar` \| `line` \| `area` \| `pie` \| `donut` \| `radar` \| `radial` \| `scatter` |
| `data` | `[]` | Series — `{ label, value, value2?, value3?, values?, color?, color2?, color3? }[]`. Use `values: [{ label, value, color? }]` on bar charts for 4+ grouped series per category. |
| `color` | `primary` | Primary series color. |
| `color2` | `success` | Second series color when points include `value2`. |
| `series-label` | `Series 1` | Tooltip label for the primary series. |
| `series2-label` | `Series 2` | Tooltip label for the second series. |
| `shade` | `dark` | `dark` \| `light` — lighter fills/strokes in `light` mode. |
| `show-border` | `true` | In `shade="light"`, outline shapes in a higher shade of their own color. No effect in `shade="dark"`. _(boolean)_ |
| `show-grid` | `true` | Horizontal dashed grid lines on cartesian charts. _(boolean)_ |
| `show-tooltip` | `true` | Show label/value tooltips while hovering chart points. _(boolean)_ |
| `show-y-axis` | `true` | Show a value axis with min/max labels (`bar`/`line`/`area`/`scatter`). _(boolean)_ |
| `vertical` | `false` | `type="line"` only — flips the axes so categories run top-to-bottom. _(boolean)_ |
| `show-legend` | `false` | Show a legend (most useful for pie/donut). _(boolean)_ |
| `legend-position` | `bottom` | `top` \| `bottom` \| `left` \| `right` — where the legend renders when `show-legend` is on. |
| `donut-radius` | `44` | Inner-hole radius (SVG units) for `type="donut"`. |
| `with-gap` | `false` | Adds visible separation between `pie` and `donut` slices. _(boolean)_ |

> A compact chart for dashboards — supports a second series on `bar`/`line` via `value2`.
> Its only runtime dependency is `@loomidev/tooltip`, used for polar-chart hover labels.

## Full Example

```html
<loomi-chart id="full-chart" type="donut" color="primary" show-legend></loomi-chart>

<script type="module">
  document.getElementById("full-chart").data = [
    { label: "Direct", value: 45, color: "primary" },
    { label: "Search", value: 30, color: "success" },
    { label: "Social", value: 25, color: "warning" },
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

### Choose your framework

<loomi-tabs>
<loomi-tab label="Plain HTML" active>

Use the CDN version for prototypes, documentation pages, or a quick reproduction. The import map tells the browser where to find Lit, which Loomi components use internally.

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3.3.3", "lit/": "https://esm.sh/lit@3.3.3/" } }
</script>
<script type="module" src="https://esm.sh/@loomidev/chart"></script>

<loomi-chart id="sales-chart" type="bar" color="success"></loomi-chart>
```

</loomi-tab>
<loomi-tab label="Bundlers and SPAs">

In Vite, Webpack, Parcel, Rollup, or a framework build pipeline, install the package and import it once in your main app JavaScript file. After that, you can use the Loomi tag anywhere in your app.

```js
import "@loomidev/chart";
```


This component accepts `data` either as a JavaScript property or as a JSON-encoded HTML attribute. Prefer the property when the series comes from an API or changes at runtime; the attribute is enough for static content with no JavaScript at all.

```js
const el = document.querySelector("loomi-chart");
el.data = [{ label: "Jan", value: 30 }, { label: "Feb", value: 55 }];
```

```html
<loomi-chart data='[{"label":"Jan","value":30},{"label":"Feb","value":55}]'></loomi-chart>
```

</loomi-tab>
<loomi-tab label="Laravel Blade">

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
<loomi-chart id="sales-chart" type="bar" color="success"></loomi-chart>
```

</loomi-tab>
<loomi-tab label="React">

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

</loomi-tab>
<loomi-tab label="Vue">

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

</loomi-tab>
<loomi-tab label="Angular">

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

</loomi-tab>
<loomi-tab label="Svelte and Astro">

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

<loomi-chart id="sales-chart" type="bar" color="success"></loomi-chart>
```

</loomi-tab>
</loomi-tabs>

### Server-side rendering notes

Frameworks such as Next.js, Nuxt, SvelteKit, and Astro sometimes render HTML on the server before browser-only code runs. If your framework complains, move the Loomi import to client-side code. In Next.js, that usually means a component with `"use client"`; in Nuxt, it often means a `.client.ts` plugin.

<!-- END loomi-framework-guide -->
