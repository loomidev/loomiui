# @loomi/radio

`<loomi-radio>` — a themeable radio button. Give radios in a group the same `name` and
they become mutually exclusive (coordinated across the same DOM root, since native radio
grouping doesn't cross shadow boundaries). **Form-associated**.

```bash
npm install @loomi/radio lit
```

```js
import "@loomi/radio/loomi-radio.js";
```

```html
<loomi-radio name="genre" value="action" checked>Action</loomi-radio>
<loomi-radio name="genre" value="comedy">Comedy</loomi-radio>
<loomi-radio name="genre" value="drama">Drama</loomi-radio>

<loomi-radio color="red" checked>Red</loomi-radio>
<loomi-radio disabled>Disabled</loomi-radio>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `name` | _(blank)_ | Group name; submitted with the form. |
| `value` | _(blank)_ | Submitted value when selected. |
| `label` | _(blank)_ | Label text (or use the default slot). |
| `checked` | `false` | Checked state. _(boolean, reflected)_ |
| `disabled` | `false` | Disable the radio. _(boolean)_ |
| `color` | `primary` | Active color (any loomi color). |
| `no-clearing` | `false` | Remove the default bottom margin. _(boolean)_ |

**Slot:** default (label). **Part:** `dot`. **Event:** `change` (composed, fired on the
radio that becomes checked).
