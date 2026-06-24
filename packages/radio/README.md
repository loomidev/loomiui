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

## Basic Usage

```html
<loomi-radio name="tnc"></loomi-radio>
```

## Radio Groups

Radios are most useful in groups — give each radio in the group the same `name` to make
them mutually exclusive.

```html
<loomi-radio label="Action" name="genre" value="action"></loomi-radio>
<loomi-radio label="Comedy" name="genre" value="comedy"></loomi-radio>
<loomi-radio label="Drama" name="genre" value="drama"></loomi-radio>
<loomi-radio label="Thriller" name="genre" value="thriller"></loomi-radio>
```

Check one by default with `checked`:

```html
<loomi-radio label="I am checked by default" name="check_me" checked></loomi-radio>
```

Radios can also be disabled:

```html
<loomi-radio label="I am disabled" disabled></loomi-radio>
```

## Colored Radio Buttons

Any loomi color works: `primary` `secondary` `red` `blue` `green` `purple` `pink`
`orange` `black` `cyan` `violet` `indigo` `fuchsia` `gray`.

```html
<loomi-radio color="red" checked label="Red"></loomi-radio>
<loomi-radio color="yellow" label="Yellow"></loomi-radio>
<loomi-radio color="green" label="Green"></loomi-radio>
<loomi-radio color="pink" label="Pink"></loomi-radio>
<loomi-radio color="cyan" label="Cyan"></loomi-radio>
<loomi-radio color="purple" label="Purple"></loomi-radio>
<loomi-radio color="orange" label="Orange"></loomi-radio>
<loomi-radio color="violet" label="Violet"></loomi-radio>
<loomi-radio color="indigo" label="Indigo"></loomi-radio>
<loomi-radio color="fuchsia" label="Fuchsia"></loomi-radio>
```

## Radio Buttons and Forms

Give every radio in a group a `value` so the right one is submitted under the shared
`name` when the form is submitted.

```html
<loomi-radio name="notify_me" value="1" label="Send me weekly newsletters"></loomi-radio>
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

## Full Example

```html
<loomi-radio
  label="I agree to the terms and conditions"
  color="pink"
  name="tnc"
  value="yes"
></loomi-radio>
```
