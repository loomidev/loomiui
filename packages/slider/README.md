# @loomi/slider

`<loomi-slider>` — select a numeric value with a slider. Form-associated: submits the value under `name`.

```bash
npm install @loomi/slider lit
```

```js
import "@loomi/slider/loomi-slider.js";
```

## Usage

```html
<loomi-slider selected="50"></loomi-slider>
<loomi-slider selected="30" color="pink" step="5"></loomi-slider>
<loomi-slider min="18" max="65" selected="25"></loomi-slider>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `name` | _(blank)_ | Submitted with the form. |
| `selected` | 0 | Current/default value. |
| `min / max` | 0 / 100 | Range bounds. |
| `step` | 1 | Increment. |
| `color` | primary | Any loomi color (themes the track via `accent-color`). |
| `show-values` | true | Show the value bubble. _(boolean)_ |

**Events:** `input`, `change` (composed). _(Dual-handle range selection is not yet implemented.)_
