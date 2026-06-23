# @loomi/input

`<loomi-input>` — a themeable text input with a floating label, text/icon prefixes &
suffixes, password reveal, a clearable field, numeric filtering and inline validation.
It is **form-associated**: its value submits with the surrounding `<form>` under `name`.

## Installation

```bash
npm install @loomi/input lit
```

```js
import "@loomi/input/loomi-input.js"; // registers <loomi-input>
```

## Basic Usage

```html
<loomi-input label="Full name"></loomi-input>
<loomi-input placeholder="Full name"></loomi-input>
<loomi-input type="email" label="Email"></loomi-input>
```

## Password & Reveal

```html
<loomi-input type="password" label="Password"></loomi-input>
<loomi-input type="password" label="Password" viewable></loomi-input>
```

## Numeric

```html
<loomi-input numeric label="Phone"></loomi-input>
<loomi-input numeric with-dots label="Amount"></loomi-input>
<loomi-input numeric min="3" max="12" label="Days off"></loomi-input>
```

## Prefixes, Suffixes & Icons

Use text or a built-in [icon](../icons) (set `prefix-icon` / `suffix-icon`). Set
`transparent-prefix="false"` / `transparent-suffix="false"` for a solid affix.

```html
<loomi-input prefix="https://" placeholder="website"></loomi-input>
<loomi-input prefix="USD" transparent-prefix="false" placeholder="0.00" numeric></loomi-input>
<loomi-input suffix=".loomi.dev" transparent-suffix="false" placeholder="workspace"></loomi-input>
<loomi-input prefix-icon="envelope" placeholder="me@loomi.dev"></loomi-input>
<loomi-input prefix-icon="key" type="password" viewable placeholder="Password"></loomi-input>
```

Need full control? Use the `prefix` / `suffix` slots.

## Clearable

```html
<loomi-input clearable placeholder="I am clearable"></loomi-input>
```

## Sizes

`small` · `regular` · `medium` (default) · `big`.

```html
<loomi-input size="small" label="Small"></loomi-input>
<loomi-input size="big" label="Big"></loomi-input>
```

## Validation

```html
<loomi-input required label="Full name" error-message="Your name is required" show-error-inline></loomi-input>
```

```js
const ok = document.querySelector("loomi-input").validate(); // toggles `invalid`, returns boolean
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `name` | _(blank)_ | Submitted with the form. |
| `type` | `text` | `text` \| `email` \| `password` \| `search` \| `tel` \| `url` |
| `label` | _(blank)_ | Floating label (sits in the placeholder spot, floats on focus/fill). |
| `placeholder` | _(blank)_ | Placeholder text. |
| `value` | _(blank)_ | Current value (also a property). |
| `required` | `false` | Marks the field required (red asterisk on the label). _(boolean)_ |
| `disabled` | `false` | Disable the field. _(boolean)_ |
| `readonly` | `false` | Read-only field. _(boolean)_ |
| `numeric` | `false` | Allow digits only. _(boolean)_ |
| `with-dots` | `true` | Allow one decimal point when `numeric`. _(boolean)_ |
| `min` / `max` | _(blank)_ | Clamp numeric values on change. |
| `size` | `medium` | `small` \| `regular` \| `medium` \| `big` |
| `prefix` / `suffix` | _(blank)_ | Text affix. |
| `prefix-icon` / `suffix-icon` | _(blank)_ | Icon-name affix (see `@loomi/icons`). |
| `transparent-prefix` / `transparent-suffix` | `true` | Transparent (vs solid) affix. _(boolean)_ |
| `viewable` | `false` | Show a reveal eye when `type="password"`. _(boolean)_ |
| `clearable` | `false` | Show a clear (✕) button when the field has a value. _(boolean)_ |
| `error-message` | _(blank)_ | Message shown when validation fails. |
| `show-error-inline` | `false` | Render the error beneath the field. _(boolean)_ |
| `show-placeholder-always` | `false` | Keep the placeholder visible even with a label. _(boolean)_ |
| `no-clearing` | `false` | Remove the default bottom margin. _(boolean, attribute on host)_ |

### Methods & events

| Member | Description |
| --- | --- |
| `.value` | Get/set the current value. |
| `focus()` / `clear()` | Focus or clear the field. |
| `validate()` | Validate required state; returns boolean. |
| `input` / `change` | Native events (composed). |

### Slots & parts

| Slot / Part | Description |
| --- | --- |
| slot `prefix` / `suffix` | Custom affix content. |
| part `field` | The bordered container. |
| part `input` | The native `<input>`. |

## Theming

Inputs use the primary palette for focus and the gray palette for borders. Override from
your page — see the [root README](../../README.md#theming-the-edit-tailwindconfigjs-replacement).

> Not (yet) ported from BladewindUI: input masking, money formatting, dynamic masks and
> country flags. Open an issue if you need them.
