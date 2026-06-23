# @loomi/icon

`<loomi-icon>` — render an icon from the shared `@loomi/icons` registry by name, or any custom SVG via the default slot. Color follows `currentColor`.

```bash
npm install @loomi/icon lit
```

```js
import "@loomi/icon/loomi-icon.js";
```

## Usage

```html
<loomi-icon name="bell-alert"></loomi-icon>
<loomi-icon name="trash" size="2rem" style="color:#dc2626"></loomi-icon>
<loomi-icon label="settings" name="key"></loomi-icon>

<!-- custom svg -->
<loomi-icon><svg viewBox="0 0 24 24">…</svg></loomi-icon>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `name` | _(blank)_ | Registered icon name (see @loomi/icons). |
| `size` | _(blank)_ | CSS size, e.g. `1.5rem`, `32px`. Sets `--loomi-icon-size`. |
| `stroke-width` | 1.5 | Stroke width for registry icons. |
| `label` | _(blank)_ | Accessible label; when omitted the icon is `aria-hidden`. |

**Slot:** default (custom `<svg>`).
