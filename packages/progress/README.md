# @loomi/progress

`<loomi-progress-bar>` and `<loomi-progress-circle>` — horizontal and circular progress
indicators, with a subtle fill animation.

```bash
npm install @loomi/progress lit
```

```js
import "@loomi/progress/loomi-progress.js";
```

## Progress Bar — Basic Usage

```html
<loomi-progress-bar percentage="36"></loomi-progress-bar>
```

### Percentage Label

```html
<!-- label inside the bar -->
<loomi-progress-bar percentage="36" show-percentage-label></loomi-progress-bar>

<!-- label outside the bar (default position: top-left) -->
<loomi-progress-bar percentage="36" show-percentage-label show-percentage-label-inline="false"></loomi-progress-bar>

<!-- positioned top-center, with a suffix -->
<loomi-progress-bar
  percentage="75"
  show-percentage-label
  show-percentage-label-inline="false"
  percentage-label-position="top-center"
  percentage-suffix=" complete"
></loomi-progress-bar>
```

Available `percentage-label-position` values: `top-left` `top-center` `top-right`
`bottom-left` `bottom-center` `bottom-right`.

### Colors

Two shades per color: `faint` (default) and `dark`.

```html
<loomi-progress-bar percentage="30" color="green"></loomi-progress-bar>
<loomi-progress-bar percentage="40" color="pink"></loomi-progress-bar>
<loomi-progress-bar percentage="50" color="cyan" shade="dark"></loomi-progress-bar>
<loomi-progress-bar percentage="60" color="purple" shade="dark"></loomi-progress-bar>
```

### Striped and Animated

```html
<loomi-progress-bar percentage="60" color="red" shade="dark" striped></loomi-progress-bar>
<loomi-progress-bar percentage="50" color="violet" shade="dark" striped animated></loomi-progress-bar>
```

## Progress Circle — Basic Usage

```html
<loomi-progress-circle percentage="45"></loomi-progress-circle>
```

The label is hidden by default. Show it with `show-label`; add the `%` sign with
`show-percent`.

```html
<loomi-progress-circle percentage="58" show-label></loomi-progress-circle>
<loomi-progress-circle percentage="58" show-label show-percent></loomi-progress-circle>
```

### Different Colors

```html
<loomi-progress-circle percentage="65" color="red"></loomi-progress-circle>
<loomi-progress-circle percentage="65" color="green" shade="dark"></loomi-progress-circle>
<loomi-progress-circle percentage="65" color="violet"></loomi-progress-circle>
```

### Different Sizes

```html
<loomi-progress-circle size="tiny" percentage="10"></loomi-progress-circle>
<loomi-progress-circle size="small" percentage="35"></loomi-progress-circle>
<loomi-progress-circle size="medium" percentage="60"></loomi-progress-circle>
<loomi-progress-circle size="big" percentage="80"></loomi-progress-circle>
<loomi-progress-circle size="large" percentage="95"></loomi-progress-circle>
```

`size` also accepts any pixel number for a fully custom diameter — pair it with
`circle-width` to keep the stroke proportional on larger circles.

```html
<loomi-progress-circle size="400" circle-width="50" percentage="89" show-label show-percent></loomi-progress-circle>
```

## Attributes

### Shared (both)

| Attribute | Default | Description |
| --- | --- | --- |
| `percentage` | `0` | Fill percentage 0–100. |
| `color` | `primary` | Any loomi color. |
| `shade` | `faint` | `faint` \| `dark` |

### `<loomi-progress-bar>`

| Attribute | Default | Description |
| --- | --- | --- |
| `show-percentage-label` | `false` | Show the % label. _(boolean)_ |
| `show-percentage-label-inline` | `true` | Inside the bar vs. outside. _(boolean)_ |
| `percentage-label-position` | `top-left` | Outside-label placement. |
| `percentage-prefix` / `percentage-suffix` | _(blank)_ | Label affixes. |
| `striped` / `animated` | `false` | Striped (and animated) fill. _(boolean)_ |

### `<loomi-progress-circle>`

| Attribute | Default | Description |
| --- | --- | --- |
| `size` | `medium` | `tiny` \| `small` \| `medium` \| `big` \| `large`, or a pixel number. |
| `circle-width` | `10` | Stroke thickness (viewBox units). |
| `show-label` | `false` | Show the percentage in the center. _(boolean)_ |
| `show-percent` | `false` | Append a `%` sign. _(boolean)_ |

## Full Example

```html
<loomi-progress-bar
  percentage="50"
  color="red"
  show-percentage-label
  show-percentage-label-inline="false"
  percentage-label-position="top-left"
  percentage-prefix="uploading: "
  percentage-suffix=" completed"
  striped
  animated
></loomi-progress-bar>

<loomi-progress-circle
  percentage="50"
  color="red"
  size="medium"
  circle-width="12"
  show-label
  show-percent
></loomi-progress-circle>
```
