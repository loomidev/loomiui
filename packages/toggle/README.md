# @loomi/toggle

`<loomi-toggle>` — a themeable toggle/switch (a checkbox, spiced up).
**Form-associated**: submits `value` (default `"on"`) under `name` when checked.

```bash
npm install @loomi/toggle lit
```

```js
import "@loomi/toggle/loomi-toggle.js";
```

## Basic Usage

```html
<loomi-toggle></loomi-toggle>
```

## Labels

The label can sit on either side of the switch — default is `left`, flip it with
`label-position="right"`. Clicking the label toggles the component.

```html
<loomi-toggle>Send me quarterly newsletters</loomi-toggle>
<loomi-toggle label-position="right">Send me quarterly newsletters</loomi-toggle>
```

By default the toggle is an inline element, so several can sit side by side. Set
`justified` to make it fill its parent container, with the label and switch pushed to
opposite ends.

```html
<loomi-toggle justified>Send me quarterly newsletters</loomi-toggle>
```

## Thin and Thicker Bars

Three bar thicknesses are available — `thin` (Android-style), `thick` (default), and
`thicker` (iOS-style).

```html
<loomi-toggle bar="thin">Thin</loomi-toggle>
<loomi-toggle bar="thick">Thick (default)</loomi-toggle>
<loomi-toggle bar="thicker">Thicker</loomi-toggle>
```

## Checked and Disabled

```html
<loomi-toggle checked>I am checked at birth</loomi-toggle>
<loomi-toggle disabled>I am disabled</loomi-toggle>
<loomi-toggle checked disabled>Checked and disabled</loomi-toggle>
```

## Different Colors

Any loomi color works for the active/checked state: `primary` `secondary` `red` `blue`
`green` `purple` `pink` `orange` `black` `cyan` `violet` `indigo` `fuchsia` `gray`.

```html
<loomi-toggle color="red" checked>Red</loomi-toggle>
<loomi-toggle color="yellow" checked>Yellow</loomi-toggle>
<loomi-toggle color="green" checked>Green</loomi-toggle>
<loomi-toggle color="pink" checked>Pink</loomi-toggle>
<loomi-toggle color="cyan" checked>Cyan</loomi-toggle>
<loomi-toggle color="purple" checked>Purple</loomi-toggle>
<loomi-toggle color="orange" checked>Orange</loomi-toggle>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `name` | _(blank)_ | Submitted with the form when checked. |
| `value` | `on` | Submitted value. |
| `label` | _(blank)_ | Clickable label (or use the default slot). |
| `label-position` | `left` | `left` \| `right` |
| `checked` | `false` | Checked state. _(boolean, reflected)_ |
| `disabled` | `false` | Disable the toggle. _(boolean)_ |
| `justified` | `false` | Spread label + switch to fill the parent. _(boolean)_ |
| `bar` | `thick` | `thin` \| `thick` \| `thicker` |
| `color` | `primary` | Active color (any loomi color). |
| `no-clearing` | `false` | Remove the default bottom margin. _(boolean)_ |

**Slot:** default (label). **Parts:** `track`, `knob`. **Event:** `change` (composed).

## Full Example

```html
<loomi-toggle
  name="subscribe"
  color="purple"
  label-position="right"
  bar="thin"
>
  Send me quarterly newsletters
</loomi-toggle>
```
