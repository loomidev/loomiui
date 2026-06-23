# @loomi/checkbox

`<loomi-checkbox>` — a themeable checkbox available in the full loomi palette.
**Form-associated**: submits `value` (default `"on"`) under `name` when checked.

```bash
npm install @loomi/checkbox lit
```

```js
import "@loomi/checkbox/loomi-checkbox.js";
```

```html
<loomi-checkbox>I agree to the terms</loomi-checkbox>
<loomi-checkbox checked>Checked by default</loomi-checkbox>
<loomi-checkbox disabled>Disabled</loomi-checkbox>

<!-- HTML in the label via the default slot -->
<loomi-checkbox>I agree to the <a href="/terms">terms</a></loomi-checkbox>

<!-- form usage -->
<loomi-checkbox name="notify_me" value="1">Send me newsletters</loomi-checkbox>
```

## Colored checkboxes

```html
<loomi-checkbox color="red" checked>Red</loomi-checkbox>
<loomi-checkbox color="green" checked>Green</loomi-checkbox>
<loomi-checkbox color="purple" checked>Purple</loomi-checkbox>
```

Any loomi color works: `primary` `secondary` `red` `blue` `green` `purple` `pink`
`orange` `black` `cyan` `violet` `indigo` `fuchsia` `gray`.

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `name` | _(blank)_ | Submitted with the form when checked. |
| `value` | `on` | Submitted value. |
| `label` | _(blank)_ | Label text (or use the default slot for HTML). |
| `checked` | `false` | Checked state. _(boolean, reflected)_ |
| `disabled` | `false` | Disable the checkbox. _(boolean)_ |
| `color` | `primary` | Active color (any loomi color). |
| `no-clearing` | `false` | Remove the default bottom margin. _(boolean)_ |

**Slot:** default (label). **Part:** `box`. **Event:** `change` (composed). The color is
applied through a per-instance `--loomi-accent` property, so the global theme override
applies automatically.
