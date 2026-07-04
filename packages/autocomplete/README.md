# @loomidev/autocomplete

`<loomi-autocomplete>` is a text field with a suggestion panel. It follows the same
spacing, borders, focus ring, labels, and dark-mode tokens as `<loomi-input>` and
`<loomi-select>`.

```bash
npm install @loomidev/autocomplete lit
```

```js
import "@loomidev/autocomplete";
```

## Basic Usage

Assign suggestions as a JavaScript property, then listen for `select`.

```html
<loomi-autocomplete label="Assignee" placeholder="Search teammates"></loomi-autocomplete>

<script type="module">
  const field = document.querySelector("loomi-autocomplete");
  field.data = [
    { label: "Ada Lovelace", value: "ada", description: "Engineering" },
    { label: "Grace Hopper", value: "grace", description: "Platform" },
    { label: "Katherine Johnson", value: "katherine", description: "Analytics" },
  ];
  field.addEventListener("select", (event) => console.log(event.detail));
</script>
```

## Accessibility

loomi-autocomplete is built on semantic markup where the browser gives us the right behavior, and it adds ARIA only where the component has custom interaction. Keyboard users should be able to reach the same controls as pointer users, with visible focus treatment unless you explicitly turn it off on controls that support `show-focus-ring="false"`.

When the component displays status, progress, validation, or temporary feedback, pair it with clear labels or nearby text in your app so assistive technology users get the same context a sighted user gets from the visual treatment.

The input announces itself as a list autocomplete, keeps keyboard navigation inside the
suggestion list, and emits a normal `change` event when a value is chosen. Users can
type freely, use Up/Down to move through suggestions, press Enter to select, and press
Escape to close the panel.

## Responsive behavior

loomi-autocomplete is designed to fit the layout you place it in. It uses fluid widths, `min-width: 0`, wrapping, truncation, or stacked layouts where that keeps the component usable in cards, forms, sidebars, and mobile screens.

For dense layouts, give the parent container an intentional width and let the component fill it. For long labels or user-provided content, prefer real text that can wrap or truncate instead of fixed pixel assumptions.

The field fills its container, truncates long option labels, and keeps descriptions on
one readable line so the panel remains compact in forms, modals, and narrow layouts.

## Dark mode

loomi-autocomplete uses Loomi semantic tokens such as `--loomi-surface`, `--loomi-surface-border`, `--loomi-text`, and palette accent tokens instead of hard-coded light colors. Borders, panels, hover states, and muted text are expected to shift with the active theme.

Add `.dark` to your app root with `@loomidev/theme-switcher`, or provide your own token overrides, and the component will inherit the dark-mode values through its shadow DOM.

The field, panel, borders, hover states, and focus ring use Loomi semantic tokens, so
they follow the app theme and `.dark` mode without custom overrides.

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `label` | _(blank)_ | Floating label text. |
| `placeholder` | `Search...` | Placeholder when no label is shown. |
| `selected-value` | _(blank)_ | Use `.value` as a property for controlled text. |
| `size` | `medium` | `tiny` \| `small` \| `regular` \| `medium` \| `big`. |
| `label-key` | `label` | Property name for option labels. |
| `value-key` | `value` | Property name for submitted values. |
| `description-key` | `description` | Property name for helper text. |
| `image-key` | `image` | Property name for optional option images. |
| `required` | `false` | Marks the field required. |
| `disabled` | `false` | Disables input and selection. |
| `readonly` | `false` | Prevents edits. |
| `show-focus-ring` | `true` | Set `show-focus-ring="false"` to hide the focus halo. |

## Events

| Event | Detail |
| --- | --- |
| `select` | `{ item, value, label }` |
| `input` | Native input event. |
| `change` | Native change event after selection. |

## Dependencies

- `@loomidev/core`
