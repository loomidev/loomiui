# @loomi/colorpicker

`<loomi-colorpicker>` — pick a color. Uses the native color input by default; pass a comma-separated `colors` list for a swatch palette instead. Form-associated.

```bash
npm install @loomi/colorpicker lit
```

```js
import "@loomi/colorpicker/loomi-colorpicker.js";
```

## Usage

```html
<loomi-colorpicker show-value selected-value="#16a34a"></loomi-colorpicker>
<loomi-colorpicker colors="#ef4444,#f59e0b,#22c55e,#3b82f6,#8b5cf6" selected-value="#3b82f6"></loomi-colorpicker>
<loomi-colorpicker size="big"></loomi-colorpicker>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `name` | _(blank)_ | Submitted with the form. |
| `selected-value` | #000000 | Current/default color. |
| `colors` | _(blank)_ | Comma-separated HEX list → renders a swatch palette. |
| `show-value` | false | Show the selected HEX value. _(boolean)_ |
| `size` | regular | `small` \| `regular` \| `medium` \| `big` |

**Event:** `change` (`detail: { value }`).
