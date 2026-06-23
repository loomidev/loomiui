# @loomi/accordion

`<loomi-accordion>` groups `<loomi-accordion-item>` collapsible sections. By default only one item is open at a time.

```bash
npm install @loomi/accordion lit
```

```js
import "@loomi/accordion/loomi-accordion.js";
```

## Usage

```html
<loomi-accordion>
  <loomi-accordion-item title="Section one" open>…</loomi-accordion-item>
  <loomi-accordion-item title="Section two">…</loomi-accordion-item>
</loomi-accordion>

<!-- standalone, colored -->
<loomi-accordion grouped="false" color="yellow" can-open-multiple>
  <loomi-accordion-item title="A">…</loomi-accordion-item>
</loomi-accordion>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `grouped` | true | Group items in one card (vs standalone cards). _(boolean)_ |
| `can-open-multiple` | false | Allow multiple open items. _(boolean)_ |
| `color` | _(blank)_ | Background color when `grouped="false"`. |

### `<loomi-accordion-item>`

| Attribute | Default | Description |
| --- | --- | --- |
| `title` | _(blank)_ | Header text (or use the `title` slot). |
| `open` | `false` | Open by default. _(boolean)_ |
| `color` | _(blank)_ | Standalone background color. |
| `no-padding` | `false` | Remove body padding. _(boolean)_ |

**Slots:** default (body), `title`.
