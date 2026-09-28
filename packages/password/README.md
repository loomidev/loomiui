# @loomidev/password

`<loomi-password>` - a form-associated password field with reveal, prefixes, validation
and neutral strength hints.

## Installation

```bash
npm install @loomidev/password lit
```

```js
import "@loomidev/password"; // registers <loomi-password>
```

## Basic Usage

```html
<loomi-password name="password" label="Password"></loomi-password>
<loomi-password name="password" label="Password" required></loomi-password>
```

## Strength Requirements

Set `strength` with any combination of these optional tokens:

| Token | Requirement                     |
| ----- | ------------------------------- |
| `A`   | At least one uppercase letter.  |
| `a`   | At least one lowercase letter.  |
| `1`   | At least one number.            |
| `#`   | At least one special character. |

```html
<loomi-password label="Password" strength="Aa1#"></loomi-password>
```

The matching requirements render beneath the field with gray check marks. A requirement's
check mark and label turn green once the current value satisfies it.

Set `strength-color` to customize that met-state label color.

```html
<loomi-password label="Password" strength="Aa1#" strength-color="#14532d"></loomi-password>
```

## Prefixes

Use text, a built-in icon, a slot, or a prefix dropdown.

```html
<loomi-password prefix-icon="key" label="Password"></loomi-password>
<loomi-password prefix-options="personal,admin,service" label="Password"></loomi-password>
```

The selected dropdown value is available on `.prefixValue` and emits a composed
`loomi-prefix-change` event with `{ value }`.

## Inserting at the caret

`insertText(text)` inserts at the caret, replacing any selected text, as if the user had
typed it: `value` updates and `input` fires. The field keeps its caret while focus is on
another button, so it works from your own toolbar. `selectionStart`, `selectionEnd` and
`setSelectionRange()` read and set the caret, as on a native `<input>`.

A custom maths toolbar:

```html
<loomi-password name="answer" label="Answer"></loomi-password>
<div class="maths-toolbar">
  <button type="button" data-insert="\frac{a}{b}">a/b</button>
  <button type="button" data-insert="\sqrt{x}">√x</button>
  <button type="button" data-insert="^{2}">x²</button>
</div>

<script type="module">
  const field = document.querySelector('loomi-password[name="answer"]');
  document.querySelector(".maths-toolbar").addEventListener("click", (event) => {
    const text = event.target.closest("[data-insert]")?.dataset.insert;
    if (text) field.insertText(text);
  });
</script>
```

## Validation

`required`, `error-message`, `show-error-inline`, `validate()`, `checkValidity()` and
`reportValidity()` match `<loomi-input>`. Strength requirements also participate in
validity when `strength` is set.

```html
<loomi-password
  required
  strength="Aa1#"
  label="Password"
  error-message="Choose a stronger password"
  show-error-inline
></loomi-password>
```

## Forms

Pressing Enter in the field submits its `<form>`, as it does in a native `<input>`. If
the form has a submit button (a native one or a `<loomi-button can-submit>`), Enter
activates the first one, and nothing happens if that button is disabled. With no submit
button, the form submits only when it has a single text-like field. Submitting this way
runs validation and fires `submit` once, the same as clicking the button. Enter that
confirms an IME composition doesn't submit. Add `no-implicit-submit` to turn it off.

```html
<form action="/login" method="post">
  <loomi-input name="email" type="email" required></loomi-input>
  <loomi-password name="password" required></loomi-password>
  <loomi-button can-submit>Sign in</loomi-button>
</form>
```

## Field appearance

Use `variant="minimal"` for a bottom-border-only field:

```html
<loomi-password label="Password" variant="minimal"></loomi-password>
```

Use `label-position="inside"` to keep a compact label inside the top of the field,
with the password displayed beneath it:

```html
<loomi-password label="Password" label-position="inside"></loomi-password>
```

## Accessibility

For the library-wide baseline, see [Foundations - Accessibility](https://loomiui.com/foundations/#accessibility).

## Responsive behavior

For the shared container and viewport rules, see [Foundations - Responsive behavior](https://loomiui.com/foundations/#responsive-behavior).

## Dark mode

For theme activation, token overrides, and contrast guidance, see [Foundations - Dark mode](https://loomiui.com/foundations/#dark-mode).

## Attributes

| Attribute                 | Default   | Description                                                                                                                                      |
| ------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `name`                    | _(blank)_ | Submitted with the form.                                                                                                                         |
| `label`                   | _(blank)_ | Floating label.                                                                                                                                  |
| `label-position`          | `default` | `default` keeps the floating label; `inside` keeps a compact label inside the top of the field.                                                  |
| `placeholder`             | _(blank)_ | Placeholder text.                                                                                                                                |
| `value`                   | _(blank)_ | Current value.                                                                                                                                   |
| `required`                | `false`   | Marks the field required. _(boolean)_                                                                                                            |
| `no-implicit-submit`      | `false`   | Stops Enter in the field from submitting its form. _(boolean)_                                                                                   |
| `disabled`                | `false`   | Disable the field. _(boolean)_                                                                                                                   |
| `readonly`                | `false`   | Read-only field. _(boolean)_                                                                                                                     |
| `size`                    | `regular` | `tiny` \| `small` \| `regular` \| `medium` \| `big`. See [Sizing](https://github.com/loomidev/loomiui/blob/main/packages/core/README.md#sizing). |
| `variant`                 | `default` | `default` \| `minimal` (bottom border only, no box)                                                                                              |
| `prefix`                  | _(blank)_ | Text prefix.                                                                                                                                     |
| `prefix-icon`             | _(blank)_ | Icon-name prefix.                                                                                                                                |
| `prefix-options`          | _(blank)_ | Comma, pipe, or JSON array of dropdown options.                                                                                                  |
| `prefix-value`            | _(blank)_ | Selected prefix dropdown value.                                                                                                                  |
| `transparent-prefix`      | `true`    | Transparent (vs solid) prefix. _(boolean)_                                                                                                       |
| `viewable`                | `true`    | Show a reveal eye. _(boolean)_                                                                                                                   |
| `clearable`               | `false`   | Show a clear button when the field has a value. _(boolean)_                                                                                      |
| `strength`                | _(blank)_ | Requirement tokens: `A`, `a`, `1`, `#`.                                                                                                          |
| `strength-color`          | _(blank)_ | Custom color for met strength labels. Defaults to a darker success green.                                                                        |
| `error-message`           | _(blank)_ | Message shown when validation fails.                                                                                                             |
| `show-error-inline`       | `false`   | Render `error-message` beneath the field. _(boolean)_                                                                                            |
| `show-placeholder-always` | `false`   | Keep the placeholder visible even with a label. _(boolean)_                                                                                      |

### Methods

| Member                                                      | Description                                                          |
| ----------------------------------------------------------- | -------------------------------------------------------------------- |
| `.value`                                                    | Get/set the current value.                                           |
| `focus()` / `clear()`                                       | Focus or clear the field.                                            |
| `insertText(text)`                                          | Insert text at the caret, replacing any selection, and fire `input`. |
| `.selectionStart` / `.selectionEnd` / `setSelectionRange()` | The inner field's caret, as on a native input.                       |
| `validate()`                                                | Run validation now; returns `true` when valid.                       |

When used inside a native form, `form.reset()` restores the field's initial value and
clears its visible validation state.

## Slots

| Slot     | Description                                      |
| -------- | ------------------------------------------------ |
| `prefix` | Content rendered before the main value or label. |

## Events

| Event                 | Description                                   |
| --------------------- | --------------------------------------------- |
| `change`              | Fired when the value is committed or changed. |
| `input`               | Fired while the value is edited.              |
| `loomi-prefix-change` | Fired when the prefix changes.                |

Setting `value` from JavaScript updates the field and the submitted form value without firing events; each keystroke fires exactly one `input`. See the [value and events contract](https://github.com/loomidev/loomiui/blob/main/packages/core/README.md#value-and-events-contract).

<!-- bundle-size:start -->

## Bundle size

About **24.7 KB** minified and gzipped, including its styles and the shared `@loomidev/core` and `@loomidev/theme` code, and excluding `lit`. Icons load one at a time, on first use, and aren't included. Importing `@loomidev/icons/all` to load every Heroicon up front makes it 97.1 KB. Measured by `pnpm check:bundle-size`.

<!-- bundle-size:end -->

## Dependencies

- `@loomidev/core`
- `@loomidev/icons`
- `@loomidev/notification`
- `@loomidev/theme`
