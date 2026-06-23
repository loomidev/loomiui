# @loomi/alert

`<loomi-alert>` — an inline alert message. Four prebuilt types with default icons, `faint`/`dark` shades, palette overrides, an optional avatar, and a dismiss button. (For floating/overlay alerts, a `notification` component is planned.)

```bash
npm install @loomi/alert lit
```

```js
import "@loomi/alert/loomi-alert.js";
```

## Usage

```html
<loomi-alert>Subscription expiring. <a href="#">Renew</a></loomi-alert>
<loomi-alert type="success">Saved!</loomi-alert>
<loomi-alert type="error" shade="dark">Permission denied.</loomi-alert>
<loomi-alert color="purple" icon="bell-alert">Custom color + icon.</loomi-alert>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `type` | info | `info` \| `error` \| `warning` \| `success` |
| `shade` | faint | `faint` \| `dark` |
| `color` | _(blank)_ | Override color (any loomi color, or `transparent`). |
| `icon` | _(blank)_ | Icon name override (see @loomi/icons). |
| `avatar` | _(blank)_ | Image URL shown instead of the icon. |
| `show-icon` | true | Show the type icon. _(boolean)_ |
| `show-close-icon` | true | Show the dismiss button. _(boolean)_ |
| `show-ring` | false | Ring around the avatar. _(boolean)_ |

**Slot:** default (message, may contain HTML). **Event:** `close` (cancelable).
