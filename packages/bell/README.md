# @loomi/bell

`<loomi-bell>` — a notification bell with an optional (optionally animated) status dot.

```bash
npm install @loomi/bell lit
```

```js
import "@loomi/bell/loomi-bell.js";
```

## Usage

```html
<loomi-bell></loomi-bell>
<loomi-bell color="red" animate-dot></loomi-bell>
<loomi-bell size="big" show-dot="false"></loomi-bell>
<loomi-bell invert></loomi-bell>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `color` | primary | Dot color (any loomi color). |
| `size` | small | `small` \| `big` |
| `show-dot` | true | Show the status dot. _(boolean)_ |
| `animate-dot` | false | Ping animation on the dot. _(boolean)_ |
| `invert` | false | Render white (for dark backgrounds). _(boolean)_ |

Wrap it in a `<loomi-tooltip>` or your own trigger to open a notifications menu.
