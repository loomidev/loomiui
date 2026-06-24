# @loomi/chart

`<loomi-chart>` — a lightweight, dependency-free SVG chart: `bar`, `line`, `pie` or
`donut`. Provide a single series via `data`.

```bash
npm install @loomi/chart lit
```

```js
import "@loomi/chart/loomi-chart.js";
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
