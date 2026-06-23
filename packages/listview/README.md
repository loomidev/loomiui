# @loomi/listview

`<loomi-listview>` — a divided list of `<loomi-listview-item>` rows. Each item is a flex container; you control the content.

```bash
npm install @loomi/listview lit
```

```js
import "@loomi/listview/loomi-listview.js";
```

## Usage

```html
<loomi-listview compact>
  <loomi-listview-item>
    <strong>Michael Ocansey</strong> — Engineering
  </loomi-listview-item>
  <loomi-listview-item>
    <strong>Sara Field</strong> — Design
  </loomi-listview-item>
</loomi-listview>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `transparent` | false | Remove the white background. _(boolean)_ |
| `compact` | false | Reduce row padding. _(boolean)_ |

**Slots:** default (`<loomi-listview-item>` children); item default (row content).
