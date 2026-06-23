# @loomi/horizontal-line-graph

`<loomi-horizontal-line-graph>` — a single proportion bar split into colored segments, with an optional legend.

```bash
npm install @loomi/horizontal-line-graph lit
```

```js
import "@loomi/horizontal-line-graph/loomi-horizontal-line-graph.js";
```

## Usage

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

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `data` | [] | Segments — `{ label, value, color? }[]` (loomi color name or any CSS color). |
| `show-legend` | true | Show the legend. _(boolean)_ |
| `show-values` | true | Show each segment's percentage. _(boolean)_ |
