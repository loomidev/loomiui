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
<loomi-tag-input mode="below" placeholder="Add tag" value="Marketing,mike"></loomi-tag-input>
```

Use `mode="inside"` (default) to keep tags inside the field, or `mode="below"` to
write tags beneath the field.

Set `color` to tint the chips. The default `shade="light"` uses a pale fill with a
border one shade stronger than the chip color.

```html
<loomi-tag-input label="Skills" color="success" value="Design,Research"></loomi-tag-input>
<loomi-tag-input label="Risks" color="warning" shade="dark" value="Blocked"></loomi-tag-input>
```

## Accessibility

loomi-tag-input is built on semantic markup where the browser gives us the right behavior, and it adds ARIA only where the component has custom interaction. Keyboard users should be able to reach the same controls as pointer users, with visible focus treatment unless you explicitly turn it off on controls that support `show-focus-ring="false"`.

When the component displays status, progress, validation, or temporary feedback, pair it with clear labels or nearby text in your app so assistive technology users get the same context a sighted user gets from the visual treatment.

- Supports keyboard focus with visible `:focus-visible` styling on interactive controls.

## Responsive behavior

loomi-tag-input is designed to fit the layout you place it in. It uses fluid widths, `min-width: 0`, wrapping, truncation, or stacked layouts where that keeps the component usable in cards, forms, sidebars, and mobile screens.

For dense layouts, give the parent container an intentional width and let the component fill it. For long labels or user-provided content, prefer real text that can wrap or truncate instead of fixed pixel assumptions.


## Dark mode

loomi-tag-input uses Loomi semantic tokens such as `--loomi-surface`, `--loomi-surface-border`, `--loomi-text`, and palette accent tokens instead of hard-coded light colors. Borders, panels, hover states, and muted text are expected to shift with the active theme.

Add `.dark` to your app root with `@loomidev/theme-switcher`, or provide your own token overrides, and the component will inherit the dark-mode values through its shadow DOM.

- Respects `.dark` on `<html>` via `@loomidev/theme-switcher` or your app theme.

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `name` | _(blank)_ | Submitted with the form. |
| `label` | _(blank)_ | Floating label. |
| `placeholder` | _(blank)_ | Placeholder text for the draft input. |
| `value` | _(blank)_ | Comma-separated tag value. |
| `mode` | `inside` | `inside` or `below`. |
| `size` | `medium` | `tiny`, `small`, `regular`, `medium`, or `big`. |
| `variant` | `default` | `default` or `minimal` (bottom border only, no box). |
| `color` | `primary` | Chip color. |
| `shade` | `light` | `light`, `faint`, or `dark`. |
| `required` | `false` | Requires at least one tag. |
| `disabled` | `false` | Disables input and tag removal. |
| `readonly` | `false` | Prevents editing and tag removal. |
| `suffix` / `suffix-icon` | _(blank)_ | Optional field suffix content. |

## Methods & Events

| Member | Description |
| --- | --- |
| `.tags` | Get or set the tag array. |
| `.value` | Comma-separated submitted value. |
| `focus()` / `clear()` | Focus the draft input or remove all tags. |
| `validate()` | Runs required validation and returns whether the control is valid. |
| `input` | Fires when draft text changes or tags change. |
| `change` | Fires when tags are added or removed. |

## Dependencies

- `@loomidev/core`
- `@loomidev/icons`
- `@loomidev/theme`
