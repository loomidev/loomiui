# @loomi/colorpicker

`<loomi-colorpicker>` — pick a color. Uses the native color input by default; pass a
comma-separated `colors` list for a custom swatch palette instead. **Form-associated**.

```bash
npm install @loomi/colorpicker lit
```

```js
import "@loomi/colorpicker/loomi-colorpicker.js";
```

## Basic Usage

```html
<loomi-colorpicker></loomi-colorpicker>
```

## Custom Swatch Palette

Pass a comma-separated list of HEX colors (including the `#`) to swap the native color
input for a custom palette of swatches — useful for a theme-builder UI where you want to
restrict users to an approved set of colors.

```html
<loomi-colorpicker colors="#ef4444,#f59e0b,#22c55e,#3b82f6,#8b5cf6,#ec4899"></loomi-colorpicker>
```

## Show Selected Value

By default the colorpicker only changes the swatch color — it doesn't display the HEX
value. Set `show-value` to display it next to the swatch.

```html
<loomi-colorpicker show-value selected-value="#16a34a"></loomi-colorpicker>
```

## Default / Pre-Selected Value

Useful in edit mode, to load a previously-saved color.

```html
<loomi-colorpicker selected-value="#3b82f6"></loomi-colorpicker>
```

## Sizes

The colorpicker comes in sizes that match other input fields, so it sits well alongside
them in a form.

```html
<loomi-colorpicker size="small"></loomi-colorpicker>
<loomi-colorpicker size="regular"></loomi-colorpicker>
<loomi-colorpicker size="medium"></loomi-colorpicker>
<loomi-colorpicker size="big"></loomi-colorpicker>
```

## Form Submission

Give the colorpicker a `name` to retrieve its value when the form is submitted.

```html
<loomi-colorpicker name="theme" selected-value="#909090"></loomi-colorpicker>
```

```js
new FormData(form).get("theme"); // "#909090"
```

## Reacting to a Selection

```js
document.querySelector("loomi-colorpicker").addEventListener("change", (e) => {
  console.log(e.detail.value); // "#3b82f6"
});
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `name` | _(blank)_ | Submitted with the form. |
| `selected-value` | `#000000` | Current/default color. |
| `colors` | _(blank)_ | Comma-separated HEX list → renders a swatch palette. |
| `show-value` | `false` | Show the selected HEX value. _(boolean)_ |
| `size` | `regular` | `small` \| `regular` \| `medium` \| `big` |

**Event:** `change` (`detail: { value }`).

## Full Example

```html
<loomi-colorpicker
  name="theme"
  size="medium"
  show-value
  colors="#989098,#cccc44,#323232,#16a34a,#3b82f6"
  selected-value="#909090"
></loomi-colorpicker>
```
