# @loomi/tooltip

`<loomi-tooltip>` — shows a short tooltip on hover/focus of its trigger content.

```bash
npm install @loomi/tooltip lit
```

```js
import "@loomi/tooltip/loomi-tooltip.js";
```

## Basic Usage

Wrap whatever should trigger the tooltip in the default slot, and set `content` for
simple text.

```html
<loomi-tooltip content="Helpful hint">
  <loomi-button>Hover me</loomi-button>
</loomi-tooltip>
```

## Positioning

```html
<loomi-tooltip content="Above" position="top"><loomi-icon name="information-circle"></loomi-icon></loomi-tooltip>
<loomi-tooltip content="Below" position="bottom"><loomi-icon name="information-circle"></loomi-icon></loomi-tooltip>
<loomi-tooltip content="To the left" position="left"><loomi-icon name="information-circle"></loomi-icon></loomi-tooltip>
<loomi-tooltip content="To the right" position="right"><loomi-icon name="information-circle"></loomi-icon></loomi-tooltip>
```

## Rich Content

For more than a line of text, use the `content` slot instead of the `content` attribute
— it accepts arbitrary HTML.

```html
<loomi-tooltip position="right">
  <span slot="content">Rich <b>HTML</b> content, with a <a href="/docs">link</a></span>
  <loomi-icon name="information-circle"></loomi-icon>
</loomi-tooltip>
```

## On Icons, Buttons, or Any Element

The trigger can be anything — an icon, a button, plain text, an avatar.

```html
<loomi-tooltip content="3 unread notifications">
  <loomi-bell animate-dot></loomi-bell>
</loomi-tooltip>

<loomi-tooltip content="Delete this item">
  <loomi-button type="danger" size="small">Delete</loomi-button>
</loomi-tooltip>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `content` | _(blank)_ | Tooltip text (or use the `content` slot). |
| `position` | `top` | `top` \| `bottom` \| `left` \| `right` |

**Slots:** default (trigger), `content` (rich tooltip body).

## Full Example

```html
<loomi-tooltip position="right">
  <span slot="content">Your subscription renews on <b>July 1</b>.</span>
  <loomi-tag label="Pro plan" color="violet"></loomi-tag>
</loomi-tooltip>
```
