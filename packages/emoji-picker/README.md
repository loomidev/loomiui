# @loomidev/emoji-picker

`<loomi-emoji-picker>` is a searchable, keyboard-friendly emoji picker web component.
The trigger is the emoji itself — clicking it opens a dropdown (built on
[`@loomidev/popover`](../popover)) with a search box, category tabs, and a 7-per-row
emoji grid. It is form-associated, so a selected emoji submits under `name` like a
native form control.

```bash
npm install @loomidev/emoji-picker lit
```

```js
import "@loomidev/emoji-picker";
```

```html
<loomi-emoji-picker name="reaction" label="Reaction"></loomi-emoji-picker>
```


## Accessibility
- Implements ARIA roles/states for custom interaction surfaces.
- Supports keyboard focus with visible `:focus-visible` styling on interactive controls.

## Responsive behavior
- Fluid width (`width: 100%`, `min-width: 0`) within flex and grid layouts.

## Dark mode
- Uses semantic `--loomi-surface`, `--loomi-surface-border`, and `--loomi-text` tokens where applicable.
- Respects `.dark` on `<html>` via `@loomidev/theme-switcher` or your app theme.
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

## Dropdown, search, and categories

Clicking the trigger opens a dropdown containing a search box, a row of category
tabs, and a grid of emoji (7 per row). Set `searchable="false"` or
`show-categories="false"` to drop either piece; `inline` renders the same body
permanently in place of a trigger, with no dropdown at all.

```html
<loomi-emoji-picker searchable="false" show-categories="false"></loomi-emoji-picker>
<loomi-emoji-picker inline></loomi-emoji-picker>
```

## Trigger label

By default the trigger shows only the selected emoji (or a placeholder face) — nothing
else. Set `show-text` to also show the name/placeholder text next to it, useful when
the picker needs to read clearly as a labeled field rather than a compact icon button.

```html
<loomi-emoji-picker show-text selected-value="🚀"></loomi-emoji-picker>
```

Unlike most boolean HTML attributes, `show-text` (along with `show-categories` and
`searchable`) understands the literal string `"false"`, so turning it back off in
markup works as expected too:

```html
<loomi-emoji-picker show-text="false"></loomi-emoji-picker>
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
| `inline` | `false` | Render the panel directly instead of a trigger dropdown. |
| `searchable` | `true` | Show the search input. |
| `show-categories` | `true` | Show category tabs. |
| `show-text` | `false` | Show the selected emoji's name (or placeholder) next to the trigger emoji. |
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
