# @loomi/tooltip

`<loomi-tooltip>` — shows a tooltip on hover/focus of its trigger content.

```bash
npm install @loomi/tooltip lit
```

```js
import "@loomi/tooltip/loomi-tooltip.js";
```

## Usage

```html
<loomi-tooltip content="Helpful hint">
  <loomi-button>Hover me</loomi-button>
</loomi-tooltip>

<loomi-tooltip position="right">
  <span slot="content">Rich <b>HTML</b> content</span>
  <loomi-icon name="information-circle"></loomi-icon>
</loomi-tooltip>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `content` | _(blank)_ | Tooltip text (or use the `content` slot). |
| `position` | top | `top` \| `bottom` \| `left` \| `right` |

**Slots:** default (trigger), `content` (rich tooltip body).
