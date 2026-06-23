# @loomi/avatar

`<loomi-avatar>` — a rounded image or initials avatar with an optional status dot. Wrap several in `<loomi-avatars>` to stack them with an optional `+N` bubble.

```bash
npm install @loomi/avatar lit
```

```js
import "@loomi/avatar/loomi-avatar.js";
```

## Usage

```html
<loomi-avatar image="/me.jpg"></loomi-avatar>
<loomi-avatar label="MK" bg-color="primary" dotted></loomi-avatar>

<loomi-avatars stacked plus="34">
  <loomi-avatar label="SF" bg-color="blue"></loomi-avatar>
  <loomi-avatar label="RB" bg-color="purple"></loomi-avatar>
</loomi-avatars>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `image` | _(blank)_ | Image URL. Shown as initials if 3 chars or fewer. |
| `label` | _(blank)_ | Initials shown when no image. |
| `size` | regular | `tiny` \| `small` \| `medium` \| `regular` \| `big` \| `huge` \| `omg` |
| `bg-color` | gray | Background/ring color for initials (any loomi color). |
| `dotted` | false | Show a status dot. _(boolean)_ |
| `dot-color` | green | Status dot color. |
| `dot-position` | bottom | `top` \| `bottom` |
| `show-ring` | true | Show the ring around the avatar. _(boolean)_ |

### `<loomi-avatars>` (group)

| Attribute | Default | Description |
| --- | --- | --- |
| `stacked` | `false` | Overlap children. _(boolean)_ |
| `plus` | `0` | Append a `+N` bubble (also forces stacking). |
| `size` | `regular` | Propagated to children. |
