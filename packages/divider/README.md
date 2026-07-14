# @loomidev/divider

`<loomi-divider>` — a themeable content divider for separating layout regions
horizontally or vertically.

```bash
npm install @loomidev/divider lit
```

```js
import "@loomidev/divider";
```

## Basic Usage

```html
<loomi-divider></loomi-divider>
```

## With Content

Use `label` for simple text, or the default slot for richer content.

```html
<loomi-divider label="Today"></loomi-divider>

<loomi-divider color="primary">
  <strong>Account</strong>
</loomi-divider>
```

## Vertical Divider

Vertical dividers stretch to their parent height. Give the surrounding layout a
height or let content define it.

```html
<div style="display:flex;gap:1rem;min-height:8rem">
  <section>Left panel</section>
  <loomi-divider orientation="vertical"></loomi-divider>
  <section>Right panel</section>
</div>
```

Vertical dividers can carry content too.

```html
<loomi-divider orientation="vertical" label="or"></loomi-divider>
```

## Alignment And Styles

```html
<loomi-divider label="Start" align="start"></loomi-divider>
<loomi-divider label="End" align="end" variant="dashed"></loomi-divider>
<loomi-divider label="Dotted" variant="dotted" thickness="2px"></loomi-divider>
```

## Accessibility

loomi-divider is built on semantic markup where the browser gives us the right behavior, and it adds ARIA only where the component has custom interaction. Keyboard users should be able to reach the same controls as pointer users, with visible focus treatment unless you explicitly turn it off on controls that support `show-focus-ring="false"`.

When the component displays status, progress, validation, or temporary feedback, pair it with clear labels or nearby text in your app so assistive technology users get the same context a sighted user gets from the visual treatment.

- Supports keyboard focus with visible `:focus-visible` styling on interactive controls.

## Responsive behavior

loomi-divider is designed to fit the layout you place it in. It uses fluid widths, `min-width: 0`, wrapping, truncation, or stacked layouts where that keeps the component usable in cards, forms, sidebars, and mobile screens.

For dense layouts, give the parent container an intentional width and let the component fill it. For long labels or user-provided content, prefer real text that can wrap or truncate instead of fixed pixel assumptions.

## Dark mode

loomi-divider uses Loomi semantic tokens such as `--loomi-surface`, `--loomi-surface-border`, `--loomi-text`, and palette accent tokens instead of hard-coded light colors. Borders, panels, hover states, and muted text are expected to shift with the active theme.

Add `.dark` to your app root with `@loomidev/theme-switcher`, or provide your own token overrides, and the component will inherit the dark-mode values through its shadow DOM.

- Respects `.dark` on `<html>` via `@loomidev/theme-switcher` or your app theme.

## Attributes

| Attribute     | Default      | Description                                                          |
| ------------- | ------------ | -------------------------------------------------------------------- |
| `orientation` | `horizontal` | `horizontal` \| `vertical`                                           |
| `label`       | _(blank)_    | Simple divider text. The default slot takes precedence when present. |
| `align`       | `center`     | Content alignment: `start` \| `center` \| `end`.                     |
| `variant`     | `solid`      | Rule style: `solid` \| `dashed` \| `dotted`.                         |
| `color`       | `gray`       | Any loomi color.                                                     |
| `thickness`   | `1px`        | CSS length for the rule thickness.                                   |
| `spacing`     | `0.75rem`    | CSS length for the gap around divider content.                       |

**Slot:** default (optional content).

## Dependencies

- `@loomidev/core`
