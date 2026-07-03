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
- Implements ARIA roles/states for custom interaction surfaces.
- Supports keyboard focus with visible `:focus-visible` styling on interactive controls.

## Responsive behavior
- Fluid width (`width: 100%`, `min-width: 0`) within flex and grid layouts.

## Dark mode
- Uses semantic `--loomi-surface`, `--loomi-surface-border`, and `--loomi-text` tokens where applicable.
- Respects `.dark` on `<html>` via `@loomidev/theme-switcher` or your app theme.

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `orientation` | `horizontal` | `horizontal` \| `vertical` |
| `label` | _(blank)_ | Simple divider text. The default slot takes precedence when present. |
| `align` | `center` | Content alignment: `start` \| `center` \| `end`. |
| `variant` | `solid` | Rule style: `solid` \| `dashed` \| `dotted`. |
| `color` | `gray` | Any loomi color. |
| `thickness` | `1px` | CSS length for the rule thickness. |
| `spacing` | `0.75rem` | CSS length for the gap around divider content. |

**Slot:** default (optional content).
