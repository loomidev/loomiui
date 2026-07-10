# @loomidev/button-group

`<loomi-button-group>` and `<loomi-button-group-item>` — a horizontal row of
segmented toggle buttons with shared sizing, radius, icons, colors, outline mode, and
disabled states.

```bash
npm install @loomidev/button-group lit
```

```js
import "@loomidev/button-group";
```


## Accessibility

loomi-button-group is built on semantic markup where the browser gives us the right behavior, and it adds ARIA only where the component has custom interaction. Keyboard users should be able to reach the same controls as pointer users, with visible focus treatment on each item.

When the component displays status, progress, validation, or temporary feedback, pair it with clear labels or nearby text in your app so assistive technology users get the same context a sighted user gets from the visual treatment.

- Supports keyboard focus with visible `:focus-visible` styling on each button.
- Icon-only items should provide `label` or `aria-label` so the button still has an accessible name.

## Responsive behavior

loomi-button-group is designed to fit the layout you place it in. It uses fluid widths, `min-width: 0`, wrapping, truncation, or stacked layouts where that keeps the component usable in cards, forms, sidebars, and mobile screens.

For dense layouts, let the component keep its natural shrink-wrapped width and give the surrounding layout room to scroll or wrap. For long labels or user-provided content, prefer concise text instead of fixed pixel assumptions.


## Dark mode

loomi-button-group uses Loomi semantic tokens such as `--loomi-surface`, `--loomi-surface-border`, `--loomi-text`, and palette accent tokens instead of hard-coded light colors. Borders, panels, hover states, and muted text are expected to shift with the active theme.

Add `.dark` to your app root with `@loomidev/theme-switcher`, or provide your own token overrides, and the component will inherit the dark-mode values through its shadow DOM.

- Respects `.dark` on `<html>` via `@loomidev/theme-switcher` or your app theme.

## Attributes

### `<loomi-button-group>`

| Attribute | Default | Description |
| --- | --- | --- |
| `color` | `primary` | Accent color for the selected item text and focus ring. Accepts any Loomi color name. |
| `size` | `regular` | Button size. `tiny` \| `small` \| `regular` \| `medium` \| `big`. |
| `radius` | `medium` | Bar corner radius. `none` \| `small` \| `medium` \| `full`. |
| `outline` | `false` | Outline-only treatment: transparent track and selected item outline. _(boolean)_ |
| `icon-only` | `false` | Hide every item label visually and render square icon buttons. _(boolean)_ |
| `aria-label` | _(blank)_ | Accessible label for the internal `role="group"` wrapper. |
| `disabled` | `false` | Disable every item in the group. _(boolean)_ |

### `<loomi-button-group-item>`

| Attribute | Default | Description |
| --- | --- | --- |
| `label` | _(blank)_ | Visible label text. Also used as the accessible name when `icon-only` is set. |
| `value` | _(blank)_ | Value emitted in `button-group-change`; falls back to the label or text content. |
| `icon` | _(blank)_ | Built-in icon name from `@loomidev/icons`. |
| `icon-right` | `false` | Place the icon after the label. _(boolean)_ |
| `icon-only` | `false` | Hide this item's label visually and render a square icon button. _(boolean)_ |
| `aria-label` | _(blank)_ | Accessible label for icon-only items when `label` is not enough. |
| `selected` | `false` | Mark this item as active. _(boolean)_ |
| `disabled` | `false` | Disable only this item. _(boolean)_ |

## Basic Usage

Place `<loomi-button-group-item>` elements inside a group. One item can be marked
`selected` for the initial state.

```html
<loomi-button-group>
  <loomi-button-group-item label="Day" value="day" selected></loomi-button-group-item>
  <loomi-button-group-item label="Week" value="week"></loomi-button-group-item>
  <loomi-button-group-item label="Month" value="month"></loomi-button-group-item>
</loomi-button-group>
```

Listen for selection changes on the group:

```html
<loomi-button-group id="range">
  <loomi-button-group-item label="Day" value="day" selected></loomi-button-group-item>
  <loomi-button-group-item label="Week" value="week"></loomi-button-group-item>
</loomi-button-group>

<script type="module">
  document.querySelector("#range").addEventListener("button-group-change", (event) => {
    console.log(event.detail.value);
  });
</script>
```

## Icons

Use the same built-in icon names as `<loomi-button>`. Set `icon-right` to place the
icon after the label.

```html
<loomi-button-group>
  <loomi-button-group-item label="List" value="list" icon="list" selected></loomi-button-group-item>
  <loomi-button-group-item label="Grid" value="grid" icon="grid-2x2"></loomi-button-group-item>
</loomi-button-group>
```

Icon-only items work too. Set `icon-only` on the group when every item should be compact,
or on one item when only that button should hide its label.

```html
<loomi-button-group color="primary" icon-only aria-label="Text formatting">
  <loomi-button-group-item label="Bold" value="bold" icon="bold" selected></loomi-button-group-item>
  <loomi-button-group-item label="Italic" value="italic" icon="italic"></loomi-button-group-item>
</loomi-button-group>
```

## Sizes, Radius, Outline, and Colors

`size` accepts `tiny`, `small`, `regular` (default), `medium`, and `big`.
`radius` accepts the same values as `<loomi-button>`: `none`, `small`, `medium`
(default), and `full`. The segmented bar is shrink-wrapped, so it ends with the last
button instead of filling the parent width.

The selected item uses the same surface fill, accent text, and subtle shadow as
`<loomi-tabs tab-style="system">`. `color` accepts any Loomi color name and tints the
selected text plus focus ring. Add `outline` for a transparent, outline-only variant.

```html
<loomi-button-group size="small" radius="full" color="success">
  <loomi-button-group-item label="Left" value="left" selected></loomi-button-group-item>
  <loomi-button-group-item label="Right" value="right"></loomi-button-group-item>
</loomi-button-group>
```

```html
<loomi-button-group outline radius="small" color="error">
  <loomi-button-group-item label="Open" value="open" selected></loomi-button-group-item>
  <loomi-button-group-item label="Closed" value="closed"></loomi-button-group-item>
</loomi-button-group>
```

## Disabled States

Disable a single item with `disabled` on `<loomi-button-group-item>`, or disable the
entire group with `disabled` on `<loomi-button-group>`.

```html
<loomi-button-group disabled>
  <loomi-button-group-item label="Day" value="day" selected></loomi-button-group-item>
  <loomi-button-group-item label="Week" value="week"></loomi-button-group-item>
</loomi-button-group>
```

## Events

| Event | Detail |
| --- | --- |
| `button-group-change` | `{ value, label, index }` when the selected item changes |

## Dependencies

- `@loomidev/core`
- `@loomidev/icons`
- `@loomidev/theme`
