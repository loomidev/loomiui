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

## Custom emoji data

The built-in emoji set is a compact curated list, not the full operating-system emoji
keyboard. Assign `.data` with your own larger set when your product needs a different
selection, or newer platform-specific symbols the built-in set doesn't have yet. Each
item accepts `emoji`, `name` or `label`, `value`, `category`, and `keywords` — custom
items don't get the skin-tone picker described below, since they carry no tone
variants of their own.

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

## Skin tone

When the active emoji set includes emoji that support skin tones (true of the built-in
curated set), a hand emoji sits as a suffix on the search input. Clicking it opens a
6-way tone menu (default plus the 5 Fitzpatrick tones); the chosen tone applies to
every emoji in the grid that has tone variants — and to `selected-value`/the submitted
form value once one is picked. The choice is remembered in `localStorage` for the next
time the picker opens.

Emoji supplied through `.data` or `emojis` don't carry tone variants, so the hand
suffix is omitted when the picker is showing only custom data.

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

`loomi-emoji-select` fires with `detail: { value, emoji, name, category, item }`.

## Accessibility

loomi-emoji-picker is built on semantic markup where the browser gives us the right behavior, and it adds ARIA only where the component has custom interaction. Keyboard users should be able to reach the same controls as pointer users, with visible focus treatment unless you explicitly turn it off on controls that support `show-focus-ring="false"`.

When the component displays status, progress, validation, or temporary feedback, pair it with clear labels or nearby text in your app so assistive technology users get the same context a sighted user gets from the visual treatment.

- Supports keyboard focus with visible `:focus-visible` styling on interactive controls.

## Responsive behavior

loomi-emoji-picker is designed to fit the layout you place it in. It uses fluid widths, `min-width: 0`, wrapping, truncation, or stacked layouts where that keeps the component usable in cards, forms, sidebars, and mobile screens.

For dense layouts, give the parent container an intentional width and let the component fill it. For long labels or user-provided content, prefer real text that can wrap or truncate instead of fixed pixel assumptions.

## Dark mode

loomi-emoji-picker uses Loomi semantic tokens such as `--loomi-surface`, `--loomi-surface-border`, `--loomi-text`, and palette accent tokens instead of hard-coded light colors. Borders, panels, hover states, and muted text are expected to shift with the active theme.

Add `.dark` to your app root with `@loomidev/theme-switcher`, or provide your own token overrides, and the component will inherit the dark-mode values through its shadow DOM.

- Respects `.dark` on `<html>` via `@loomidev/theme-switcher` or your app theme.

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

## Dependencies

- `@loomidev/core`
- `@loomidev/popover`
