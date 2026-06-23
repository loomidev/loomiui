# @loomi/progress

`<loomi-progress-bar>` and `<loomi-progress-circle>` — horizontal and circular progress indicators.

```bash
npm install @loomi/progress lit
```

```js
import "@loomi/progress/loomi-progress.js";
```

## Usage

```html
<loomi-progress-bar percentage="36" show-percentage-label></loomi-progress-bar>
<loomi-progress-bar percentage="60" color="green" shade="dark" striped animated></loomi-progress-bar>

<loomi-progress-circle percentage="65" show-label show-percent></loomi-progress-circle>
<loomi-progress-circle percentage="80" color="orange" size="small" show-label></loomi-progress-circle>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `percentage` | 0 | Fill percentage 0–100. (both) |
| `color` | primary | Any loomi color. (both) |
| `shade` | faint | `faint` \| `dark`. (both) |

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
