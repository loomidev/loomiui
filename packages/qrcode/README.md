# @loomidev/qrcode

`<loomi-qrcode>` renders a real QR code from a URL or short text value. It includes optional scanner-style corner brackets, a gradient fill, and an animated scan beam.

```bash
npm install @loomidev/qrcode lit
```

```js
import "@loomidev/qrcode";
```

```html
<loomi-qrcode
  url="https://loomiui.com"
  corner-borders
  gradient
  gradient-scan
></loomi-qrcode>
```

## Examples

```html
<loomi-qrcode url="https://example.com"></loomi-qrcode>

<loomi-qrcode
  url="https://example.com/pay/invoice-245"
  size="260"
  error-correction="H"
  corner-borders
  corner-border-color="var(--loomi-success-600)"
  gradient
  gradient-from="var(--loomi-success-600)"
  gradient-to="var(--loomi-cyan-500)"
  gradient-scan
></loomi-qrcode>
```

## Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `url` | `string` | `""` | URL to encode. Takes precedence over `value`. |
| `value` | `string` | `""` | Text to encode when `url` is not set. |
| `size` | `number` | `220` | Rendered square size in pixels. Minimum visual size is 96px. |
| `error-correction` | `"L" \| "M" \| "Q" \| "H"` | `"M"` | QR error correction level. Use `H` when adding visual effects around the code. |
| `quiet-zone` | `number` | `4` | Number of light modules around the QR matrix. |
| `foreground` | `string` | `var(--loomi-text)` | Solid module color when `gradient` is off. |
| `background` | `string` | `var(--loomi-surface)` | QR background color. |
| `radius` | `"none" \| "small" \| "medium" \| "large" \| "full"` | `"medium"` | Outer frame radius. |
| `gradient` | `boolean` | `false` | Fill QR modules with a diagonal gradient. |
| `gradient-from` | `string` | `var(--loomi-primary-600)` | Gradient start color. |
| `gradient-to` | `string` | `var(--loomi-cyan-500)` | Gradient end color. |
| `module-radius` | `number` | `0` | Radius for each dark module, from `0` to `0.5`. |
| `corner-borders` | `boolean` | `false` | Show scanner-style corner brackets. |
| `corner-border-color` | `string` | `var(--loomi-primary-600)` | Corner bracket color. |
| `corner-border-width` | `string` | `4px` | Corner bracket stroke width. |
| `corner-border-length` | `string` | `34px` | Length of each bracket arm. |
| `gradient-scan` | `boolean` | `false` | Show an animated scan gradient over the QR code. |
| `scan-color` | `string` | `rgba(14, 165, 233, 0.72)` | Scan beam color. |
| `scan-duration` | `string` | `2.4s` | Scan animation duration. |
| `aria-label` | `string` | generated | Accessible label for the rendered QR image. |

## Notes

The encoder supports byte-mode QR codes through version 10, which covers typical URLs and short payloads. For longer values, shorten the URL before encoding.
