# @loomi/slider

`<loomi-slider>` — select a numeric value with a slider, instead of clicking
increment/decrement arrows or typing a value directly. **Form-associated**: submits the
value under `name`.

```bash
npm install @loomi/slider lit
```

```js
import "@loomi/slider/loomi-slider.js";
```

## Basic Usage

```html
<loomi-slider></loomi-slider>
```

Give each slider on a page a unique `name` if you need to read its value on form
submission — particularly important if there's more than one slider on the page.

## Different Colors

The default color is `primary`. Any loomi color works, and themes the native track via
`accent-color`.

```html
<loomi-slider selected="50" color="cyan"></loomi-slider>
<loomi-slider selected="30" color="pink"></loomi-slider>
<loomi-slider selected="70" color="indigo"></loomi-slider>
```

`selected` is also how you pre-populate the slider in edit mode.

## Step

By default the slider increments by `1`. Set `step` for a coarser interval.

```html
<loomi-slider selected="10" step="5"></loomi-slider>
```

## Min and Max Values

Default bounds are `0`–`100`.

```html
<loomi-slider min="18" max="65" selected="25"></loomi-slider>
```

## Hiding the Value Bubble

```html
<loomi-slider show-values="false"></loomi-slider>
```

## Form Submission

```html
<loomi-slider name="age" selected="34"></loomi-slider>
```

```js
new FormData(form).get("age"); // "34"
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `name` | _(blank)_ | Submitted with the form. |
| `selected` | `0` | Current/default value. |
| `min` / `max` | `0` / `100` | Range bounds. |
| `step` | `1` | Increment. |
| `color` | `primary` | Any loomi color (themes the track via `accent-color`). |
| `show-values` | `true` | Show the value bubble. _(boolean)_ |

**Events:** `input`, `change` (composed).

> Not (yet) implemented: dual-handle range selection (BladewindUI's own range slider is
> documented as buggy too).

## Full Example

```html
<loomi-slider
  name="volume"
  min="0"
  max="100"
  step="5"
  selected="65"
  color="violet"
></loomi-slider>
```
