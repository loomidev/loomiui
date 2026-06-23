# @loomi/dropmenu

`<loomi-dropmenu>` — a dropdown action menu. Trigger via the default ellipsis icon, an icon name, or custom markup.

```bash
npm install @loomi/dropmenu lit
```

```js
import "@loomi/dropmenu/loomi-dropmenu.js";
```

## Usage

```html
<loomi-dropmenu divided>
  <loomi-dropmenu-item header>Project</loomi-dropmenu-item>
  <loomi-dropmenu-item icon="paper-airplane">Invite</loomi-dropmenu-item>
  <loomi-dropmenu-item icon="trash">Delete</loomi-dropmenu-item>
</loomi-dropmenu>

<loomi-dropmenu trigger="cog-6-tooth-icon">
  <loomi-dropmenu-item><a href="/settings">Settings</a></loomi-dropmenu-item>
</loomi-dropmenu>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `trigger` | _(ellipsis)_ | Icon name (with `-icon` suffix) for the trigger. |
| `trigger-on` | click | `click` \| `mouseover` |
| `position` | right | Menu alignment. `left` \| `right` |
| `divided` | false | Divider lines between items. _(boolean)_ |
| `scrollable` | false | Scroll items past `height`. _(boolean)_ |
| `height` | 200 | Max menu height (px) when scrollable. |
| `hide-after-click` | true | Close the menu after an item click. _(boolean)_ |

### `<loomi-dropmenu-item>`

| Attribute | Default | Description |
| --- | --- | --- |
| `icon` | _(blank)_ | Leading icon name. |
| `icon-right` | `false` | Place the icon after the label. _(boolean)_ |
| `header` | `false` | Non-clickable section header. _(boolean)_ |
| `divider` | `false` | Render a divider line. _(boolean)_ |

**Slots:** default (items), `trigger` (custom trigger markup).
