# @loomidev/emoji-picker

`<loomi-emoji-picker>` is a searchable, keyboard-friendly emoji picker web component.
It is form-associated, so a selected emoji submits under `name` like a native form
control.

```bash
npm install @loomidev/emoji-picker lit
```

```js
import "@loomidev/emoji-picker";
```

```html
<loomi-emoji-picker name="reaction" label="Reaction"></loomi-emoji-picker>
```

## Custom emoji data

Use the built-in emoji set by default, or assign `.data` with your own objects. Each item
accepts `emoji`, `name` or `label`, `value`, `category`, and `keywords`.

```js
const picker = document.querySelector("loomi-emoji-picker");
picker.data = [
  { emoji: "🟢", name: "Green status", value: "green", category: "status" },
  { emoji: "🔴", name: "Red status", value: "red", category: "status" },
];
```

```html
<loomi-emoji-picker emojis="😀, 😎, 🚀, ❤️"></loomi-emoji-picker>
```

## Events

`change` fires with `detail: { value, emoji, item }` after selection.

`emoji-select` fires with `detail: { value, emoji, name, category, item }`.

## Attributes and properties

| Name | Default | Description |
| --- | --- | --- |
| `name` | `""` | Form field name. |
| `selected-value` | `""` | Current submitted value. Defaults to the emoji itself. |
| `label` | `""` | Optional field label. |
| `placeholder` | `Pick an emoji` | Closed trigger placeholder. |
| `inline` | `false` | Render the panel directly instead of a trigger popover. |
| `searchable` | `true` | Show the search input. |
| `show-categories` | `true` | Show category tabs. |
| `required` | `false` | Mark the picker invalid until a value is selected. |
| `disabled` | `false` | Disable the trigger. |
| `readonly` | `false` | Prevent changes while keeping the current value readable. |
| `size` | `medium` | `small`, `regular`, `medium`, or `big`. |

## Methods

| Method | Description |
| --- | --- |
| `reset()` | Clears the selected value. |
| `validate()` | Shows validation and returns whether the picker is valid. |
| `checkValidity()` | Mirrors native form validity. |
| `reportValidity()` | Shows the browser validation UI where supported. |
