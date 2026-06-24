# @loomi/bell

`<loomi-bell>` — a notification bell icon with an optional (optionally animated) status
dot, for telling users where to find notifications and whether they have unread ones.

```bash
npm install @loomi/bell lit
```

```js
import "@loomi/bell/loomi-bell.js";
```

## Basic Usage

By default the bell shows its status dot — meaning there's something unread.

```html
<loomi-bell></loomi-bell>
```

## No Dot Indicator

Once everything's read, hide the dot:

```html
<loomi-bell show-dot="false"></loomi-bell>
```

## Animated Dot Indicator

Add a "ping" animation to draw attention to new notifications:

```html
<loomi-bell animate-dot></loomi-bell>
```

## Inverted Bell

By default the bell is designed to sit on a light background. On a dark background, set
`invert` to render it white:

```html
<div style="background:#0f172a; padding: 1rem; display:inline-block">
  <loomi-bell invert></loomi-bell>
</div>
```

## Different Sizes

Two sizes are available; the default is `small`.

```html
<loomi-bell size="small"></loomi-bell>
<loomi-bell size="big"></loomi-bell>
```

## Different Colors

The status dot is `primary`-colored by default. Set `color` to any loomi color.

```html
<loomi-bell color="red" animate-dot></loomi-bell>
<loomi-bell color="green" animate-dot></loomi-bell>
<loomi-bell color="orange" animate-dot></loomi-bell>
<loomi-bell color="purple" animate-dot></loomi-bell>
```

## Wrapping It in a Trigger

`<loomi-bell>` doesn't open anything on its own — wire it up to whatever you need.
Pairing it with [`<loomi-dropmenu>`](../dropmenu) gets you a working notifications menu
with no extra JS:

```html
<loomi-dropmenu position="left">
  <loomi-bell slot="trigger" animate-dot></loomi-bell>
  <loomi-dropmenu-item header>Notifications</loomi-dropmenu-item>
  <loomi-dropmenu-item icon="bell-alert">Michael assigned a task to you</loomi-dropmenu-item>
  <loomi-dropmenu-item icon="check-circle">Your upload finished</loomi-dropmenu-item>
</loomi-dropmenu>
```

Or just listen for clicks yourself if you'd rather build your own panel or navigate to a
notifications page:

```html
<loomi-bell onclick="location.href='/notifications'"></loomi-bell>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `color` | `primary` | Status dot color. Any loomi color. |
| `size` | `small` | `small` \| `big` |
| `show-dot` | `true` | Show the status dot. _(boolean)_ |
| `animate-dot` | `false` | Ping animation on the dot. _(boolean)_ |
| `invert` | `false` | Render white, for dark backgrounds. _(boolean)_ |

## Full Example

```html
<loomi-bell color="pink" show-dot="false" animate-dot size="big"></loomi-bell>
```
