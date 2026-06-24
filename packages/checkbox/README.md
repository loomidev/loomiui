# @loomi/checkbox

`<loomi-checkbox>` — a themeable checkbox available in the full loomi palette.
**Form-associated**: submits `value` (default `"on"`) under `name` when checked.

```bash
npm install @loomi/checkbox lit
```

```js
import "@loomi/checkbox/loomi-checkbox.js";
```

## Basic Usage

```html
<loomi-checkbox>I agree to the terms</loomi-checkbox>
```

Labels can include HTML, since the label is the default slot:

```html
<loomi-checkbox>I agree to the <a href="/terms">terms and conditions</a></loomi-checkbox>
```

Checked and disabled, by default:

```html
<loomi-checkbox checked>Checked by default</loomi-checkbox>
<loomi-checkbox disabled>Disabled</loomi-checkbox>
<loomi-checkbox checked disabled>Checked and disabled</loomi-checkbox>
```

## Colored Checkboxes

Any loomi color works: `primary` `secondary` `red` `blue` `green` `purple` `pink`
`orange` `black` `cyan` `violet` `indigo` `fuchsia` `gray`.

```html
<loomi-checkbox color="red" checked>Red</loomi-checkbox>
<loomi-checkbox color="yellow" checked>Yellow</loomi-checkbox>
<loomi-checkbox color="green" checked>Green</loomi-checkbox>
<loomi-checkbox color="pink" checked>Pink</loomi-checkbox>
<loomi-checkbox color="cyan" checked>Cyan</loomi-checkbox>
<loomi-checkbox color="purple" checked>Purple</loomi-checkbox>
<loomi-checkbox color="orange" checked>Orange</loomi-checkbox>
<loomi-checkbox color="violet" checked>Violet</loomi-checkbox>
<loomi-checkbox color="indigo" checked>Indigo</loomi-checkbox>
<loomi-checkbox color="fuchsia" checked>Fuchsia</loomi-checkbox>
```

The color is applied through a per-instance `--loomi-accent` property, so a global theme
override (e.g. redefining `--loomi-pink-600` at `:root`) applies automatically — no need
to touch the component.

## Checkboxes and Forms

Give the checkbox a `name` and `value` so the right thing is submitted. If the box is
left unchecked, its name is omitted from the form payload entirely (standard checkbox
behavior).

```html
<loomi-checkbox name="notify_me" value="1">Send me weekly newsletters</loomi-checkbox>
```

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

**Slot:** default (label). **Part:** `box`. **Event:** `change` (composed).

## Full Example

```html
<loomi-checkbox
  name="tnc"
  value="yes"
  color="pink"
  checked
>
  I agree to the terms and conditions
</loomi-checkbox>
```
