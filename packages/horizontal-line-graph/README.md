# @loomi/horizontal-line-graph

`<loomi-horizontal-line-graph>` — a single proportion bar split into colored segments,
with an optional legend. Good for showing how a whole breaks down into parts — market
share, demographic split, budget allocation.

```bash
npm install @loomi/horizontal-line-graph lit
```

```js
import "@loomi/horizontal-line-graph/loomi-horizontal-line-graph.js";
```

## Basic Usage

```html
<loomi-horizontal-line-graph id="g"></loomi-horizontal-line-graph>

<script type="module">
  document.getElementById("g").data = [
    { label: "Direct", value: 45, color: "primary" },
    { label: "Search", value: 30, color: "green" },
    { label: "Social", value: 25, color: "orange" },
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
    { label: "Vodafone", value: 30, color: "red" },
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
