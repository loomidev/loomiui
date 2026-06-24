# @loomi/timeline

`<loomi-timeline>` items grouped in `<loomi-timelines>` — display events in
chronological order, like an activity feed.

```bash
npm install @loomi/timeline lit
```

```js
import "@loomi/timeline/loomi-timeline.js";
```

## Basic Usage

```html
<loomi-timelines>
  <loomi-timeline date="10 days ago" content="You signed up"></loomi-timeline>
  <loomi-timeline date="8 days ago" content="Customer rep assigned"></loomi-timeline>
  <loomi-timeline date="8 days ago" content="Customer rep called"></loomi-timeline>
  <loomi-timeline content="Account is being reviewed"></loomi-timeline>
  <loomi-timeline content="Account activated"></loomi-timeline>
</loomi-timelines>
```

## Bigger Anchors

```html
<loomi-timelines anchor="big">
  <loomi-timeline date="10 days ago" content="You signed up"></loomi-timeline>
</loomi-timelines>
```

## Completed State

Filled circles mark a step as done; on a big anchor, a checkmark appears too.

```html
<loomi-timelines anchor="big">
  <loomi-timeline completed date="10 days ago" content="You signed up"></loomi-timeline>
  <loomi-timeline completed date="8 days ago" content="Customer rep assigned"></loomi-timeline>
  <loomi-timeline content="Account is being reviewed"></loomi-timeline>
</loomi-timelines>
```

## Stacked Timelines

`stacked` on the `<loomi-timelines>` wrapper puts dates above content instead of beside
it, and is shared by every child item.

```html
<loomi-timelines stacked>
  <loomi-timeline date="just now" content="Database server restarted"></loomi-timeline>
  <loomi-timeline date="30 minutes ago" content="2 endpoints are failing — check the logs"></loomi-timeline>
  <loomi-timeline date="Yesterday" content="Data recovery completed with 2 errors"></loomi-timeline>
</loomi-timelines>
```

`completed` on the wrapper marks every item as done at once — override a single item by
setting `completed="false"` directly on it.

```html
<loomi-timelines stacked completed anchor="big">
  <loomi-timeline date="just now" content="Database server restarted"></loomi-timeline>
  <loomi-timeline date="Yesterday" content="Data recovery" completed="false"></loomi-timeline>
</loomi-timelines>
```

## Anchor Icons and Avatars

Icons and avatars only render when `anchor="big"`.

```html
<loomi-timelines anchor="big" completed>
  <loomi-timeline date="10 days ago" content="You signed up" icon="bell-alert"></loomi-timeline>
  <loomi-timeline date="8 days ago" content="Customer rep assigned" icon="bolt"></loomi-timeline>
  <loomi-timeline content="Account is being reviewed" icon="key" completed="false"></loomi-timeline>
</loomi-timelines>

<loomi-timelines anchor="big">
  <loomi-timeline date="10 days ago" content="You signed up" avatar="/avatars/ada.jpg"></loomi-timeline>
  <loomi-timeline date="8 days ago" content="Customer rep assigned" avatar="/avatars/rep.jpg"></loomi-timeline>
</loomi-timelines>
```

## Positioning

Only the `<loomi-timelines>` wrapper can be positioned; default is `center`.

```html
<loomi-timelines position="left" anchor="big">
  <loomi-timeline date="10 days ago" content="You signed up"></loomi-timeline>
</loomi-timelines>
```

## No Trailing Line

Set `last` on the final item to drop its trailing connector line — `<loomi-timelines>`
does this automatically for its own last child.

```html
<loomi-timeline content="Account activated" last></loomi-timeline>
```

## Colors

```html
<loomi-timelines>
  <loomi-timeline date="10 days ago" content="You signed up" color="pink" completed></loomi-timeline>
  <loomi-timeline date="8 days ago" content="Customer rep assigned" color="orange"></loomi-timeline>
  <loomi-timeline content="Account is being reviewed" color="purple"></loomi-timeline>
</loomi-timelines>
```

## Attributes

### `<loomi-timeline>`

| Attribute | Default | Description |
| --- | --- | --- |
| `date` | _(blank)_ | Date string. |
| `content` | _(blank)_ | Entry text (or use the default slot). |
| `completed` | `false` | Filled anchor (+ check when `anchor="big"`). _(boolean)_ |
| `anchor` | `small` | `small` \| `big` (big enables icons/avatars). |
| `icon` | _(blank)_ | Anchor icon name (big anchor). |
| `avatar` | _(blank)_ | Anchor image URL (big anchor). |
| `stacked` | `false` | Date above content vs. in a left column. _(boolean)_ |
| `last` | `false` | Remove the trailing connector line. _(boolean)_ |
| `color` | `blue` | Any loomi color. |

### `<loomi-timelines>` (wrapper)

Shares `stacked`, `completed`, `anchor`, `icon`, `color` with all children, and supports
`position` (`left` \| `center`). The last item's connector line is removed
automatically.

## Full Example

```html
<loomi-timelines stacked anchor="big" color="pink" position="left" completed>
  <loomi-timeline
    date="9 days ago"
    avatar="/avatars/me.jpg"
    content="I am a timeline"
    completed
  ></loomi-timeline>
  <loomi-timeline date="2 days ago" content="Still going" completed="false"></loomi-timeline>
</loomi-timelines>
```
