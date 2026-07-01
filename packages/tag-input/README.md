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

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `name` | _(blank)_ | Submitted with the form. |
| `label` | _(blank)_ | Floating label. |
| `placeholder` | _(blank)_ | Placeholder text for the draft input. |
| `value` | _(blank)_ | Comma-separated tag value. |
| `mode` | `inside` | `inside` or `below`. |
| `size` | `medium` | `tiny`, `small`, `regular`, `medium`, or `big`. |
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
