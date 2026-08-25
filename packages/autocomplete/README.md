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

Assign suggestions as a JavaScript property, then listen for `loomi-select`.

```html
<loomi-autocomplete label="Assignee" placeholder="Search teammates"></loomi-autocomplete>

<script type="module">
  const field = document.querySelector("loomi-autocomplete");
  field.data = [
    { label: "Ada Lovelace", value: "ada", description: "Engineering", image: "/avatars/ada.jpg" },
    { label: "Grace Hopper", value: "grace", description: "Platform", image: "/avatars/grace.jpg" },
    { label: "Katherine Johnson", value: "katherine", description: "Analytics" },
  ];
  field.addEventListener("select", (event) => console.log(event.detail));
</script>
```

When an option is selected, the field displays the option `label` and optional `image`.
The component value remains the option `value`, and that value is what gets submitted
with a form.

Native `form.reset()` restores the initial submitted value and closes the suggestion
panel.

## Field appearance

Use `variant="minimal"` for a bottom-border-only field:

```html
<loomi-autocomplete variant="minimal" placeholder="Search people"></loomi-autocomplete>
```

Use `label-position="inside"` to keep a compact label inside the top of the field,
with the entered text displayed beneath it:

```html
<loomi-autocomplete label="Assignee" label-position="inside"></loomi-autocomplete>
```

## Accessibility

The input announces itself as a list autocomplete, keeps keyboard navigation inside the
suggestion list, and emits a normal `change` event when a value is chosen. Users can
type freely, use Up/Down to move through suggestions, press Enter to select, and press
Escape to close the panel.

For the library-wide baseline, see [Foundations — Accessibility](https://loomiui.com/foundations/#accessibility).

## Responsive behavior

The field fills its container, truncates long option labels, and keeps descriptions on
one readable line so the panel remains compact in forms, modals, and narrow layouts.

For the shared container and viewport rules, see [Foundations — Responsive behavior](https://loomiui.com/foundations/#responsive-behavior).

## Dark mode

The field, panel, borders, hover states, and focus ring use Loomi semantic tokens, so
they follow the app theme and `.dark` mode without custom overrides.

For theme activation, token overrides, and contrast guidance, see [Foundations — Dark mode](https://loomiui.com/foundations/#dark-mode).

## Attributes

| Attribute         | Default       | Description                                                                                                               |
| ----------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `label`           | _(blank)_     | Floating label text.                                                                                                      |
| `label-position`  | `default`     | `default` keeps the floating label; `inside` keeps a compact label inside the top of the field.                           |
| `placeholder`     | `Search...`   | Placeholder when no label is shown.                                                                                       |
| `selected-value`  | _(blank)_     | Sets the submitted value; matching options display their label and image.                                                 |
| `size`            | `medium`      | `tiny` \| `small` \| `regular` \| `medium` \| `big`.                                                                      |
| `variant`         | `default`     | `default` \| `minimal` (bottom border only, no box)                                                                       |
| `label-key`       | `label`       | Property name for option labels.                                                                                          |
| `value-key`       | `value`       | Property name for submitted values.                                                                                       |
| `description-key` | `description` | Property name for helper text.                                                                                            |
| `image-key`       | `image`       | Property name for optional option images.                                                                                 |
| `required`        | `false`       | Marks the field required.                                                                                                 |
| `disabled`        | `false`       | Disables input and selection.                                                                                             |
| `readonly`        | `false`       | Prevents edits.                                                                                                           |
| `show-focus-ring` | `true`        | Set `show-focus-ring="false"` to hide the focus halo.                                                                     |
| `clearable`       | `true`        | Read-only — always on. Shows an × button once the field has a value; clicking it empties the field and reopens the panel. |

## Events

| Event          | Detail                               |
| -------------- | ------------------------------------ |
| `loomi-select` | `{ item, value, label }`             |
| `input`        | Native input event.                  |
| `change`       | Native change event after selection. |

## Dependencies

- `@loomidev/core`
- `@loomidev/icons`
