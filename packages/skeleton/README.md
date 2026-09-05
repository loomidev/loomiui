# @loomidev/skeleton

`<loomi-skeleton>` - a shimmering placeholder shown in place of content that hasn't
loaded yet: a line of text, an avatar, a card thumbnail, or a whole paragraph.

```bash
npm install @loomidev/skeleton lit
```

```js
import "@loomidev/skeleton";
```

## Basic Usage

```html
<loomi-skeleton></loomi-skeleton>
```

## Shapes

```html
<loomi-skeleton variant="text" width="12rem"></loomi-skeleton>
<loomi-skeleton variant="circle" width="3rem"></loomi-skeleton>
<loomi-skeleton variant="rect" width="100%" height="10rem"></loomi-skeleton>
```

## Paragraph Placeholder

Set `lines` on the default `variant="text"` for a stack of placeholder lines. The
last line renders shorter, matching how a real paragraph ends mid-line.

```html
<loomi-skeleton lines="3"></loomi-skeleton>
```

## Composing A Card Placeholder

There's no built-in composite shape - combine instances in your own layout instead.

```html
<div style="display:flex;gap:0.75rem;align-items:center">
  <loomi-skeleton variant="circle" width="2.5rem"></loomi-skeleton>
  <div style="flex:1">
    <loomi-skeleton lines="2"></loomi-skeleton>
  </div>
</div>
```

## Animation

`animation` defaults to `shimmer`, a light sweep across the placeholder. Switch to
`pulse` for a slower fade in/out, or `none` for a static block.

```html
<loomi-skeleton animation="pulse"></loomi-skeleton>
<loomi-skeleton animation="none"></loomi-skeleton>
```

## Sizing

`width`, `height`, and `radius` accept any CSS length and override the defaults for
the chosen `variant`.

```html
<loomi-skeleton variant="rect" width="4rem" height="4rem" radius="0.75rem"></loomi-skeleton>
```

## Accessibility

Each placeholder (or paragraph group, for `lines` greater than 1) carries
`role="status"` with an accessible name that defaults to a translated "Loading";
pass `label` to override it, or `locale` to pick a different built-in translation.
Motion slows down rather than stopping under `prefers-reduced-motion`, so the
placeholder still reads as "still loading" rather than finished. For the
library-wide baseline, see [Foundations - Accessibility](https://loomiui.com/foundations/#accessibility).

## Dark mode

The shimmer sweep is a translucent white overlay, so it reads correctly over the
theme's dark-mode surface color with no extra configuration. For theme activation,
token overrides, and contrast guidance, see [Foundations - Dark mode](https://loomiui.com/foundations/#dark-mode).

## Attributes

| Attribute   | Default   | Description                                                                 |
| ----------- | --------- | ---------------------------------------------------------------------------|
| `variant`   | `text`    | Shape: `text` \| `circle` \| `rect`.                                       |
| `width`     | _(auto)_  | CSS length. Defaults to `100%` (`text`, `rect`) or `3rem` (`circle`).       |
| `height`    | _(auto)_  | CSS length. Defaults to `1em` (`text`), the resolved width (`circle`), or `8rem` (`rect`). |
| `radius`    | _(auto)_  | CSS length for corner rounding. Defaults per `variant`.                    |
| `lines`     | `1`       | Number of stacked placeholder lines. Only applies to `variant="text"`.     |
| `animation` | `shimmer` | `shimmer` \| `pulse` \| `none`.                                            |
| `label`     | _(blank)_ | Accessible name announced while loading.                                   |
| `locale`    | _(blank)_ | Locale for the default accessible name.                                    |

## Dependencies

- `@loomidev/core`
