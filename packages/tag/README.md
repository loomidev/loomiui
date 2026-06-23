# @loomi/tag

`<loomi-tag>` — a themeable label/badge. Faint or dark shade, optional outline, rounded, tiny, and a close button. Group with `<loomi-tags>`.

```bash
npm install @loomi/tag lit
```

```js
import "@loomi/tag/loomi-tag.js";
```

## Usage

```html
<loomi-tag label="pending"></loomi-tag>
<loomi-tag label="urgent" color="red" shade="dark"></loomi-tag>
<loomi-tag label="design" color="purple" outline rounded></loomi-tag>
<loomi-tag label="closable" color="cyan" can-close></loomi-tag>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `label` | _(blank)_ | Tag text (or use the default slot). |
| `color` | primary | Any loomi color. |
| `shade` | faint | `faint` \| `dark` |
| `outline` | false | Outline only, no fill. _(boolean)_ |
| `rounded` | false | Fully rounded. _(boolean)_ |
| `tiny` | false | Tiny size. _(boolean)_ |
| `uppercasing` | false | Uppercase the text. _(boolean)_ |
| `can-close` | false | Show a close button. _(boolean)_ |

**Slot:** default (content). **Event:** `close` (cancelable; the tag removes itself unless prevented).
