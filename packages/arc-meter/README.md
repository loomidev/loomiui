# @loomidev/arc-meter

`<loomi-arc-meter>` — a semi-circle status meter with evenly spaced marker stops.
It is useful for small status summaries such as risk, protection level, confidence,
completion stage, or health.

```bash
npm install @loomidev/arc-meter lit
```

```js
import "@loomidev/arc-meter";
```

## Basic Usage

```html
<loomi-arc-meter></loomi-arc-meter>
```

By default it renders the screenshot-style state:

- `markers="4"`
- `active-marker="1"`
- `title="Low"`
- `description="Protection level"`

## Custom Marker Count

`markers` controls how many marker positions are distributed inside the semi-circle.
The selected position is controlled by `active-marker`.

```html
<loomi-arc-meter
  markers="5"
  active-marker="3"
  title="Medium"
  description="Protection level"
></loomi-arc-meter>
```

## Marker Colors

Pass `marker-colors` as a comma-separated list in HTML, or set `markerColors` as an
array property in JavaScript. Loomi color names and raw CSS colors both work.

```html
<loomi-arc-meter
  markers="4"
  active-marker="2"
  marker-colors="error,warning,success,primary"
  title="Guarded"
  description="Protection level"
></loomi-arc-meter>
```

```html
<loomi-arc-meter id="security-meter"></loomi-arc-meter>

<script type="module">
  const meter = document.getElementById("security-meter");
  meter.markers = 4;
  meter.activeMarker = 1;
  meter.markerColors = ["#d92d20", "#f97316", "success", "primary"];
  meter.title = "Low";
  meter.description = "Protection level";
</script>
```

When no colors are passed, the component cycles through `error`, `warning`, `success`,
`primary`, `secondary`, and `gray`.

## In Cards

```html
<loomi-card>
  <loomi-arc-meter
    markers="4"
    active-marker="1"
    title="Low"
    description="Protection level"
  ></loomi-arc-meter>
</loomi-card>
```

## Accessibility

loomi-arc-meter exposes the visual summary as a single image-style status with an
ARIA label that includes the title, description, active marker, and total marker count.
Pair it with nearby text when the meter changes something important in the user flow.

## Responsive behavior

loomi-arc-meter uses `--loomi-arc-meter-width` for sizing and keeps the SVG ratio stable.
Set that CSS variable on the component when a card or dashboard needs a specific width.

```html
<loomi-arc-meter style="--loomi-arc-meter-width: 14rem"></loomi-arc-meter>
```

## Dark mode

loomi-arc-meter uses Loomi semantic tokens such as `--loomi-surface`,
`--loomi-surface-border`, `--loomi-text`, and palette color tokens. It inherits dark
mode from your app theme or `@loomidev/theme-switcher`.

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `markers` | `4` | Number of marker positions distributed inside the semi-circle. |
| `active-marker` | `1` | Selected marker position, clamped from `1` to `markers`. |
| `marker-colors` | `error,warning,success,primary,secondary,gray` | Marker colors as a comma-separated list. Use Loomi color names or CSS colors. |
| `title` | `Low` | Main label shown inside the meter. |
| `description` | `Protection level` | Supporting label shown under the title. |

## Full Example

```html
<loomi-arc-meter
  markers="4"
  active-marker="1"
  marker-colors="error,warning,success,primary"
  title="Low"
  description="Protection level"
></loomi-arc-meter>
```
