# @loomidev/button-group

`<loomi-button-group>` and `<loomi-button-group-item>` — a horizontal row of
secondary-style toggle buttons with shared sizing, palette, icons, and disabled states.

```bash
npm install @loomidev/button-group lit
```

```js
import "@loomidev/button-group";
```


## Accessibility

loomi-button-group is built on semantic markup where the browser gives us the right behavior, and it adds ARIA only where the component has custom interaction. Keyboard users should be able to reach the same controls as pointer users, with visible focus treatment unless you explicitly turn it off on controls that support `show-focus-ring="false"`.

When the component displays status, progress, validation, or temporary feedback, pair it with clear labels or nearby text in your app so assistive technology users get the same context a sighted user gets from the visual treatment.

- Supports keyboard focus with visible `:focus-visible` styling on interactive controls.

## Responsive behavior

loomi-button-group is designed to fit the layout you place it in. It uses fluid widths, `min-width: 0`, wrapping, truncation, or stacked layouts where that keeps the component usable in cards, forms, sidebars, and mobile screens.

For dense layouts, give the parent container an intentional width and let the component fill it. For long labels or user-provided content, prefer real text that can wrap or truncate instead of fixed pixel assumptions.


## Dark mode

loomi-button-group uses Loomi semantic tokens such as `--loomi-surface`, `--loomi-surface-border`, `--loomi-text`, and palette accent tokens instead of hard-coded light colors. Borders, panels, hover states, and muted text are expected to shift with the active theme.

Add `.dark` to your app root with `@loomidev/theme-switcher`, or provide your own token overrides, and the component will inherit the dark-mode values through its shadow DOM.

- Respects `.dark` on `<html>` via `@loomidev/theme-switcher` or your app theme.
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

Icon-only items work too — omit `label` and set `icon` only.

```html
<loomi-button-group color="primary">
  <loomi-button-group-item value="bold" icon="bold" selected></loomi-button-group-item>
  <loomi-button-group-item value="italic" icon="italic"></loomi-button-group-item>
</loomi-button-group>
```

## Sizes and Colors

`size` accepts `tiny`, `small`, `regular` (default), `medium`, and `big`.

The selected item always uses a calm neutral gray fill — never a bright accent color —
so it reads as "chosen" without competing for attention. `color` accepts any loomi
color name and only tints the keyboard focus ring.

```html
<loomi-button-group size="small" color="success">
  <loomi-button-group-item label="Left" value="left" selected></loomi-button-group-item>
  <loomi-button-group-item label="Right" value="right"></loomi-button-group-item>
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
