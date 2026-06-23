# @loomi/toggle

`<loomi-toggle>` — a themeable toggle/switch (a checkbox, spiced up).
**Form-associated**: submits `value` (default `"on"`) under `name` when checked.

```bash
npm install @loomi/toggle lit
```

```js
import "@loomi/toggle/loomi-toggle.js";
```

```html
<loomi-toggle>Send me newsletters</loomi-toggle>
<loomi-toggle label-position="right">Label on the right</loomi-toggle>
<loomi-toggle justified>Fills its container</loomi-toggle>
<loomi-toggle checked color="green">Checked &amp; green</loomi-toggle>
```

## Bars

```html
<loomi-toggle bar="thin">Thin</loomi-toggle>
<loomi-toggle bar="thick">Thick (default)</loomi-toggle>
<loomi-toggle bar="thicker">Thicker</loomi-toggle>
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
