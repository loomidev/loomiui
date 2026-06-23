# @loomi/chart

`<loomi-chart>` — a lightweight SVG chart: `bar`, `line`, `pie` or `donut`. Provide a single series via `data`.

```bash
npm install @loomi/chart lit
```

```js
import "@loomi/chart/loomi-chart.js";
```

## Usage

```html
<loomi-chart id="c" type="bar" color="primary"></loomi-chart>
<loomi-chart type="donut" show-legend></loomi-chart>
<script type="module">
  document.getElementById("c").data = [
    { label: "Jan", value: 30 }, { label: "Feb", value: 55 }, { label: "Mar", value: 42 },
  ];
</script>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `type` | bar | `bar` \| `line` \| `pie` \| `donut` |
| `data` | [] | Series — `{ label, value, color? }[]` (property or JSON). |
| `color` | primary | Accent color for line charts. |
| `show-legend` | false | Show a legend (most useful for pie/donut). _(boolean)_ |

> A compact, dependency-free chart for dashboards. For heavy analytical charting, pair loomi with a dedicated charting library.
