# @loomi/listview

`<loomi-listview>` — a divided list of `<loomi-listview-item>` rows. It mimics
`<ul><li>`: the component only draws the dividing lines between items — what goes
inside each row is entirely up to you.

```bash
npm install @loomi/listview lit
```

```js
import "@loomi/listview/loomi-listview.js";
```

## Basic Usage

Each `<loomi-listview-item>` is a flex container, so laying out an avatar next to text
is just a couple of child elements.

```html
<loomi-card no-padding>
  <loomi-listview>
    <loomi-listview-item>
      <loomi-avatar size="small" image="/me.jpg"></loomi-avatar>
      <div>
        <div style="font-weight:500">Michael K. Ocansey</div>
        <div style="font-size:0.875rem;opacity:0.7">mike@loomiui.dev</div>
      </div>
    </loomi-listview-item>
    <loomi-listview-item>
      <loomi-avatar size="small" label="AJ" bg-color="orange"></loomi-avatar>
      <div>
        <div style="font-weight:500">Anonymous Jackson</div>
        <div style="font-size:0.875rem;opacity:0.7">fake@person.com</div>
      </div>
    </loomi-listview-item>
  </loomi-listview>
</loomi-card>
```

## Transparent Background

By default the list sits on a white background. Remove it to drop the list onto
whatever background color you set on a parent element instead.

```html
<loomi-listview transparent style="background:#fefce8">
  <loomi-listview-item>Item one</loomi-listview-item>
  <loomi-listview-item>Item two</loomi-listview-item>
</loomi-listview>
```

## Compact Spacing

Tightens the gap between rows — useful for dense sidebars or dropdown-style lists.

```html
<loomi-listview compact>
  <loomi-listview-item>Notifications</loomi-listview-item>
  <loomi-listview-item>Messages</loomi-listview-item>
  <loomi-listview-item>Settings</loomi-listview-item>
</loomi-listview>
```

## Attributes

### `<loomi-listview>`

| Attribute | Default | Description |
| --- | --- | --- |
| `transparent` | `false` | Remove the white background. _(boolean)_ |
| `compact` | `false` | Reduce row padding. _(boolean)_ |

**Slots:** default (`<loomi-listview-item>` children); item default (row content).

## Full Example

```html
<loomi-listview compact transparent style="background:#fefce8">
  <loomi-listview-item>
    <loomi-avatar size="small" image="/me.jpg"></loomi-avatar>
    <div>
      <div style="font-weight:500">Michael K. Ocansey</div>
      <div style="font-size:0.875rem;opacity:0.7">mike@loomiui.dev</div>
    </div>
  </loomi-listview-item>
</loomi-listview>
```
