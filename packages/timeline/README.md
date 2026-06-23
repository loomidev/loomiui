# @loomi/timeline

`<loomi-timeline>` items grouped in `<loomi-timelines>` — a chronological feed with optional big anchors, icons, avatars and completed states.

```bash
npm install @loomi/timeline lit
```

```js
import "@loomi/timeline/loomi-timeline.js";
```

## Usage

```html
<loomi-timelines anchor="big">
  <loomi-timeline date="10 days ago" content="You signed up" icon="check" completed></loomi-timeline>
  <loomi-timeline date="8 days ago" content="Rep assigned" icon="user" completed></loomi-timeline>
  <loomi-timeline content="Account activated" icon="bell"></loomi-timeline>
</loomi-timelines>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `date` | _(blank)_ | Date string. |
| `content` | _(blank)_ | Entry text (or use the default slot). |
| `completed` | false | Filled anchor (+ check when `anchor="big"`). _(boolean)_ |
| `anchor` | small | `small` \| `big` (big enables icons/avatars). |
| `icon` | _(blank)_ | Anchor icon name (big anchor). |
| `avatar` | _(blank)_ | Anchor image URL (big anchor). |
| `stacked` | false | Date above content vs. in a left column. _(boolean)_ |
| `last` | false | Remove the trailing connector line. _(boolean)_ |
| `color` | blue | Any loomi color. |

### `<loomi-timelines>` (wrapper)

Shares `stacked`, `completed`, `anchor`, `icon`, `color` with all children, and supports `position` (`left` \| `center`). The last item's connector line is removed automatically.
