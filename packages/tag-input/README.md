# @loomidev/tag-input

`<loomi-tag-input>` is a form-associated tag entry field styled like
`<loomi-input>`. Type a word or phrase, press Enter, and it becomes a removable
gray outline tag.

## Installation

```bash
npm install @loomidev/tag-input lit
```

```js
import "@loomidev/tag-input";
```

## Usage

```html
<loomi-tag-input placeholder="Add tag"></loomi-tag-input>
<loomi-tag-input mode="below" placeholder="Add tag" value="Marketing,alex"></loomi-tag-input>
```

Use `mode="inside"` (default) to keep tags inside the field, or `mode="below"` to
write tags beneath the field.

Set `color` to tint the chips. The default `shade="light"` uses a pale fill with a
border one shade stronger than the chip color.

```html
<loomi-tag-input label="Skills" color="success" value="Design,Research"></loomi-tag-input>
<loomi-tag-input label="Risks" color="warning" shade="dark" value="Blocked"></loomi-tag-input>
```

## Field appearance

Use `variant="minimal"` for a bottom-border-only field:

```html
<loomi-tag-input label="Skills" variant="minimal"></loomi-tag-input>
```

Use `label-position="inside"` to keep a compact label inside the top of the field,
with tags and entered text displayed beneath it:

```html
<loomi-tag-input label="Skills" label-position="inside"></loomi-tag-input>
```

## Accessibility

For the library-wide baseline, see [Foundations — Accessibility](https://loomiui.com/foundations/#accessibility).

## Responsive behavior

For the shared container and viewport rules, see [Foundations — Responsive behavior](https://loomiui.com/foundations/#responsive-behavior).

## Dark mode

For theme activation, token overrides, and contrast guidance, see [Foundations — Dark mode](https://loomiui.com/foundations/#dark-mode).

## Attributes

| Attribute        | Default   | Description                                                                                     |
| ---------------- | --------- | ----------------------------------------------------------------------------------------------- |
| `name`           | _(blank)_ | Submitted with the form.                                                                        |
| `label`          | _(blank)_ | Floating label.                                                                                 |
| `label-position` | `default` | `default` keeps the floating label; `inside` keeps a compact label inside the top of the field. |
| `placeholder`    | _(blank)_ | Placeholder text for the draft input.                                                           |
| `value`          | _(blank)_ | Comma-separated tag value.                                                                      |
| `mode`           | `inside`  | `inside` or `below`.                                                                            |
| `size`           | `medium`  | `tiny`, `small`, `regular`, `medium`, or `big`.                                                 |
| `variant`        | `default` | `default` or `minimal` (bottom border only, no box).                                            |
| `color`          | `primary` | Chip color.                                                                                     |
| `shade`          | `light`   | `light`, `faint`, or `dark`.                                                                    |
| `required`       | `false`   | Requires at least one tag.                                                                      |
| `disabled`       | `false`   | Disables input and tag removal.                                                                 |
| `readonly`       | `false`   | Prevents editing and tag removal.                                                               |
| `suffix`         | _(blank)_ | Optional text suffix.                                                                           |
| `suffix-icon`    | _(blank)_ | Optional icon-name suffix (see `@loomidev/icons`).                                              |

## Slots

| Slot     | Description                                     |
| -------- | ----------------------------------------------- |
| `suffix` | Content rendered after the main value or label. |

## Events

| Event                       | Description                                        |
| --------------------------- | -------------------------------------------------- |
| `change`                    | Fired when the value is committed or changed.      |
| `input`                     | Fired while the value is edited.                   |
| `loomi-autocomplete-select` | Fired when an autocomplete suggestion is selected. |

## Methods

| Member                | Description                                                        |
| --------------------- | ------------------------------------------------------------------ |
| `.tags`               | Get or set the tag array.                                          |
| `.value`              | Comma-separated submitted value.                                   |
| `focus()` / `clear()` | Focus the draft input or remove all tags.                          |
| `validate()`          | Runs required validation and returns whether the control is valid. |

## Dependencies

- `@loomidev/core`
- `@loomidev/icons`
- `@loomidev/theme`
