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

Use `marker-color` to set the colour of the filled arc and active marker. Loomi
color names, HEX values, CSS named colours, and other valid CSS colour values all
work.

```html
<loomi-arc-meter
  markers="4"
  active-marker="2"
  marker-color="warning"
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
  meter.markerColor = "#d92d20";
  meter.title = "Low";
  meter.description = "Protection level";
</script>
```

When no colour is passed, the component uses `error`.

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

For the library-wide baseline, see [Component foundations — Accessibility](https://loomiui.com/customization/component-foundations/#accessibility).

## Responsive behavior

loomi-arc-meter uses `--loomi-arc-meter-width` for sizing and keeps the SVG ratio stable.
Set that CSS variable on the component when a card or dashboard needs a specific width.

```html
<loomi-arc-meter style="--loomi-arc-meter-width: 14rem"></loomi-arc-meter>
```

For the shared container and viewport rules, see [Component foundations — Responsive behavior](https://loomiui.com/customization/component-foundations/#responsive-behavior).

## Dark mode

loomi-arc-meter uses Loomi semantic tokens such as `--loomi-surface`,
`--loomi-surface-border`, `--loomi-text`, and palette color tokens. It inherits dark
mode from your app theme or `@loomidev/theme-switcher`.

For theme activation, token overrides, and contrast guidance, see [Component foundations — Dark mode](https://loomiui.com/customization/component-foundations/#dark-mode).

## Attributes

| Attribute       | Default            | Description                                                                      |
| --------------- | ------------------ | -------------------------------------------------------------------------------- |
| `markers`       | `4`                | Number of marker positions distributed inside the semi-circle.                   |
| `active-marker` | `1`                | Selected marker position, clamped from `1` to `markers`.                         |
| `marker-color`  | `error`            | Colour of the filled arc and active marker. Use a Loomi color name or CSS color. |
| `title`         | `Low`              | Main label shown inside the meter.                                               |
| `description`   | `Protection level` | Supporting label shown under the title.                                          |

## Full Example

```html
<loomi-arc-meter
  markers="4"
  active-marker="1"
  marker-color="error"
  title="Low"
  description="Protection level"
></loomi-arc-meter>
```
