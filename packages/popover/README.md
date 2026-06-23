# @loomi/popover

`<loomi-popover>` — a floating rich-content panel opened on click or hover. Unlike a tooltip, it can contain links, lists and custom markup.

```bash
npm install @loomi/popover lit
```

```js
import "@loomi/popover/loomi-popover.js";
```

## Usage

```html
<loomi-popover title="Account">
  <ul><li><a href="#">Edit</a></li><li><a href="#">Sign out</a></li></ul>
</loomi-popover>

<loomi-popover trigger="bell-icon" position="right" trigger-on="mouseover">
  <p>Hover content</p>
</loomi-popover>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `trigger` | information-circle | Trigger icon name (with optional `-icon` suffix). |
| `trigger-on` | click | `click` \| `mouseover` |
| `position` | bottom | `top` \| `bottom` \| `left` \| `right` |
| `title` | _(blank)_ | Optional heading above the content. |
| `width` | 280 | Panel width in pixels. |

**Methods:** `show()`, `hide()`, `toggle()`. **Slots:** default (content), `trigger` (custom trigger).
