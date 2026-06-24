# @loomi/avatar

`<loomi-avatar>` — a rounded image or initials avatar with an optional status dot. Wrap
several in `<loomi-avatars>` to stack them with an optional `+N` bubble. A logged-in user
header, a contact list, or an employee directory are all good fits.

```bash
npm install @loomi/avatar lit
```

```js
import "@loomi/avatar/loomi-avatar.js";
```

## Basic Usage

```html
<loomi-avatar image="/me.jpg"></loomi-avatar>
```

## Different Sizes

```html
<loomi-avatar image="/me.jpg" size="tiny"></loomi-avatar>
<loomi-avatar image="/me.jpg" size="small"></loomi-avatar>
<loomi-avatar image="/me.jpg" size="medium"></loomi-avatar>
<loomi-avatar image="/me.jpg" size="regular"></loomi-avatar>
<loomi-avatar image="/me.jpg" size="big"></loomi-avatar>
<loomi-avatar image="/me.jpg" size="huge"></loomi-avatar>
<loomi-avatar image="/me.jpg" size="omg"></loomi-avatar>
```

## Labels (Initials)

Skip `image` and set `label` to show initials instead — useful as a placeholder for
users without a profile picture.

```html
<loomi-avatar label="MK"></loomi-avatar>
<loomi-avatar label="MK" bg-color="primary"></loomi-avatar>
```

## Stacked Avatars

Wrap avatars in `<loomi-avatars stacked>` to overlap them — most visually consistent
when every child is the same size.

```html
<loomi-avatars stacked>
  <loomi-avatar image="/ada.jpg"></loomi-avatar>
  <loomi-avatar image="/sara.jpg"></loomi-avatar>
  <loomi-avatar label="RB"></loomi-avatar>
</loomi-avatars>
```

### Plus More

Set `plus` to a number to cap the visible avatars and show a trailing `+N` bubble
instead (this implies `stacked`).

```html
<loomi-avatars plus="34">
  <loomi-avatar label="SF"></loomi-avatar>
  <loomi-avatar label="ZH"></loomi-avatar>
  <loomi-avatar label="RB"></loomi-avatar>
</loomi-avatars>
```

## Dot Indicator

Add a status dot — for online/offline/busy presence.

```html
<loomi-avatar image="/me.jpg" dotted></loomi-avatar>
<loomi-avatar image="/me.jpg" dotted dot-position="top"></loomi-avatar>
```

The dot accepts any loomi color via `dot-color`:

```html
<loomi-avatars dotted>
  <loomi-avatar image="/a.jpg" dot-color="primary"></loomi-avatar>
  <loomi-avatar image="/b.jpg" dot-color="gray"></loomi-avatar>
  <loomi-avatar image="/c.jpg" dot-color="red"></loomi-avatar>
</loomi-avatars>
```

## Custom Background & Dot Colors

```html
<loomi-avatars dotted>
  <loomi-avatar label="SF" bg-color="orange" dot-color="orange"></loomi-avatar>
  <loomi-avatar label="ZH" bg-color="blue" dot-color="blue"></loomi-avatar>
  <loomi-avatar label="RB" bg-color="purple" dot-color="purple"></loomi-avatar>
</loomi-avatars>
```

## Hiding the Ring

By default avatars show a ring around them. Turn it off for a flatter look.

```html
<loomi-avatar image="/me.jpg" show-ring="false"></loomi-avatar>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `image` | _(blank)_ | Image URL. Shown as initials if 3 chars or fewer. |
| `label` | _(blank)_ | Initials shown when no image. |
| `size` | `regular` | `tiny` \| `small` \| `medium` \| `regular` \| `big` \| `huge` \| `omg` |
| `bg-color` | `gray` | Background/ring color for initials (any loomi color). |
| `dotted` | `false` | Show a status dot. _(boolean)_ |
| `dot-color` | `green` | Status dot color. |
| `dot-position` | `bottom` | `top` \| `bottom` |
| `show-ring` | `true` | Show the ring around the avatar. _(boolean)_ |

### `<loomi-avatars>` (group)

| Attribute | Default | Description |
| --- | --- | --- |
| `stacked` | `false` | Overlap children. _(boolean)_ |
| `plus` | `0` | Append a `+N` bubble (also forces stacking). |
| `size` | `regular` | Propagated to children. |

> Not (yet) ported from BladewindUI: a clickable `plus_action` callback on the `+N`
> bubble — listen for a `click` on the avatars group element instead.

## Full Example

```html
<loomi-avatars size="big" dotted dot-color="red" dot-position="top" plus="33" stacked>
  <loomi-avatar image="/a.jpg"></loomi-avatar>
  <loomi-avatar image="/b.jpg"></loomi-avatar>
  <loomi-avatar label="ZH" bg-color="cyan"></loomi-avatar>
</loomi-avatars>
```
