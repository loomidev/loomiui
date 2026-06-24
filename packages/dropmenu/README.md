# @loomi/dropmenu

`<loomi-dropmenu>` — a dropdown action menu. Different from [`<loomi-select>`](../select)
in purpose: select submits a value with a form, dropmenu doesn't carry a value at all —
it's for quick actions, like "Edit / Delete" on a row.

```bash
npm install @loomi/dropmenu lit
```

```js
import "@loomi/dropmenu/loomi-dropmenu.js";
```

## Basic Usage

The default trigger is a horizontal-ellipsis icon.

```html
<loomi-dropmenu>
  <loomi-dropmenu-item>Invite to Project</loomi-dropmenu-item>
  <loomi-dropmenu-item>Assign Task</loomi-dropmenu-item>
  <loomi-dropmenu-item>Send Message</loomi-dropmenu-item>
</loomi-dropmenu>
```

## Trigger Icon

Swap the trigger for any icon from [`@loomi/icons`](../icons).

```html
<loomi-dropmenu trigger="musical-note">
  <loomi-dropmenu-item>Add to playlist</loomi-dropmenu-item>
  <loomi-dropmenu-item>Play again</loomi-dropmenu-item>
</loomi-dropmenu>

<loomi-dropmenu trigger="cog-6-tooth">
  <loomi-dropmenu-item>Company settings</loomi-dropmenu-item>
  <loomi-dropmenu-item>User settings</loomi-dropmenu-item>
</loomi-dropmenu>
```

## Trigger on Hover

Opens on `click` by default; switch to `mouseover` for a hover-activated menu.

```html
<loomi-dropmenu trigger="musical-note" trigger-on="mouseover">
  <loomi-dropmenu-item>Add to playlist</loomi-dropmenu-item>
  <loomi-dropmenu-item>Play again</loomi-dropmenu-item>
</loomi-dropmenu>
```

## Custom Trigger Markup

Use the `trigger` slot to make a button, avatar, or any other element the trigger
instead of an icon.

```html
<loomi-dropmenu>
  <loomi-button slot="trigger" type="secondary" size="tiny">Options</loomi-button>
  <loomi-dropmenu-item>Add to playlist</loomi-dropmenu-item>
  <loomi-dropmenu-item>Play again</loomi-dropmenu-item>
</loomi-dropmenu>

<loomi-dropmenu>
  <div slot="trigger" style="display:flex;align-items:center;gap:0.5rem;box-shadow:0 1px 2px rgb(0 0 0 / 0.1);padding:0 1rem;border-radius:0.375rem">
    <loomi-avatar size="small" image="/john.jpg"></loomi-avatar>
    <div>
      <div><strong>John C. Doe</strong></div>
      <div style="font-size:0.875rem">Tech, IT Support</div>
    </div>
    <loomi-icon name="chevron-down" style="width:1rem;height:1rem"></loomi-icon>
  </div>
  <loomi-dropmenu-item>Deactivate my account</loomi-dropmenu-item>
  <loomi-dropmenu-item>Delete Profile</loomi-dropmenu-item>
</loomi-dropmenu>
```

## Item Actions

Each `<loomi-dropmenu-item>` can contain any markup — a link, a button, or just text —
and you're free to attach a regular `click` listener.

```html
<loomi-dropmenu trigger="light-bulb">
  <loomi-dropmenu-item><a href="/library" target="_blank">Go to Library</a></loomi-dropmenu-item>
  <loomi-dropmenu-item id="show-modal-item">Show a Modal</loomi-dropmenu-item>
</loomi-dropmenu>

<script type="module">
  import { showLoomiModal } from "@loomi/modal/loomi-modal.js";
  document.getElementById("show-modal-item").addEventListener("click", () => showLoomiModal("dropmenu-demo"));
</script>
```

## Headers, Icons and Dividers

### Headers

A header is still a `<loomi-dropmenu-item>`, just without hover styling or a pointer
cursor, and with a divider line separating it from the items below.

```html
<loomi-dropmenu>
  <loomi-dropmenu-item header>Project</loomi-dropmenu-item>
  <loomi-dropmenu-item icon="paper-airplane">Invite</loomi-dropmenu-item>
  <loomi-dropmenu-item icon="trash">Delete</loomi-dropmenu-item>
</loomi-dropmenu>
```

### Icons

```html
<loomi-dropmenu-item icon="pencil-square">Edit Profile</loomi-dropmenu-item>
```

By default an item's icon sits on the left. Set `icon-right` on the menu (applies to
every item) or on an individual item to flip it.

```html
<loomi-dropmenu icon-right>
  <loomi-dropmenu-item icon="pencil-square">Edit Profile</loomi-dropmenu-item>
</loomi-dropmenu>
```

### Dividers

```html
<loomi-dropmenu>
  <loomi-dropmenu-item>Edit</loomi-dropmenu-item>
  <loomi-dropmenu-item divider></loomi-dropmenu-item>
  <loomi-dropmenu-item>Delete</loomi-dropmenu-item>
</loomi-dropmenu>
```

Use `divided` on the menu itself for a thin line between every item instead, regardless
of explicit divider items.

```html
<loomi-dropmenu divided>
  <loomi-dropmenu-item>Add to playlist</loomi-dropmenu-item>
  <loomi-dropmenu-item>Play again</loomi-dropmenu-item>
</loomi-dropmenu>
```

## Menu Position

By default the menu chooses the side with the most visible space. This helps menus
inside documentation shells, tables and sidebars avoid opening underneath nearby page
chrome.

```html
<loomi-dropmenu position="auto">…</loomi-dropmenu>
<loomi-dropmenu position="left">…</loomi-dropmenu>
<loomi-dropmenu position="right">…</loomi-dropmenu>
```

## Scrollable Menus

For long item lists, cap the menu's height and let it scroll instead of growing
indefinitely.

```html
<loomi-dropmenu scrollable height="150">
  <loomi-dropmenu-item>Item 1</loomi-dropmenu-item>
  <loomi-dropmenu-item>Item 2</loomi-dropmenu-item>
  <!-- … -->
</loomi-dropmenu>
```

## Keeping the Menu Open After a Click

By default clicking any item closes the menu. Set `hide-after-click="false"` to keep it
open — useful when items are themselves toggles or checkboxes.

```html
<loomi-dropmenu hide-after-click="false">
  <loomi-dropmenu-item><loomi-checkbox>Email notifications</loomi-checkbox></loomi-dropmenu-item>
  <loomi-dropmenu-item><loomi-checkbox>SMS notifications</loomi-checkbox></loomi-dropmenu-item>
</loomi-dropmenu>
```

## Pairing with `<loomi-bell>`

See [`<loomi-bell>`'s README](../bell#wrapping-it-in-a-trigger) for a worked example of
`<loomi-dropmenu>` as a notifications panel.

## Attributes

### `<loomi-dropmenu>`

| Attribute | Default | Description |
| --- | --- | --- |
| `trigger` | _(ellipsis)_ | Icon name (with `-icon` suffix) for the trigger. |
| `trigger-on` | `click` | `click` \| `mouseover` |
| `position` | `auto` | Menu alignment. `auto` \| `left` \| `right` |
| `divided` | `false` | Divider lines between items. _(boolean)_ |
| `scrollable` | `false` | Scroll items past `height`. _(boolean)_ |
| `height` | `200` | Max menu height (px) when scrollable. |
| `hide-after-click` | `true` | Close the menu after an item click. _(boolean)_ |
| `icon-right` | `false` | Place every item's icon after its label. _(boolean)_ |

### `<loomi-dropmenu-item>`

| Attribute | Default | Description |
| --- | --- | --- |
| `icon` | _(blank)_ | Leading icon name. |
| `icon-right` | `false` | Place the icon after the label. _(boolean)_ |
| `header` | `false` | Non-clickable section header. _(boolean)_ |
| `divider` | `false` | Render a divider line. _(boolean)_ |

**Slots:** default (items), `trigger` (custom trigger markup).

## Full Example

```html
<loomi-dropmenu trigger="pencil-square" trigger-on="mouseover" divided scrollable height="150" position="left">
  <loomi-dropmenu-item header>Profile</loomi-dropmenu-item>
  <loomi-dropmenu-item icon="user">View Profile</loomi-dropmenu-item>
  <loomi-dropmenu-item icon="pencil-square">Edit Profile</loomi-dropmenu-item>
  <loomi-dropmenu-item divider></loomi-dropmenu-item>
  <loomi-dropmenu-item icon="trash">Delete Account</loomi-dropmenu-item>
</loomi-dropmenu>
```
