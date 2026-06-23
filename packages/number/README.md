# @loomi/number

`<loomi-number>` — a themeable number stepper with increment/decrement buttons, min/max/
step enforcement and a floating label. **Form-associated**.

```bash
npm install @loomi/number lit
```

```js
import "@loomi/number/loomi-number.js";
```

```html
<loomi-number label="Quantity" value="1"></loomi-number>
<loomi-number step="10" value="0"></loomi-number>
<loomi-number min="18" max="65" label="Your age" value="18"></loomi-number>
<loomi-number transparent-icons="false" size="big"></loomi-number>
```

The component enforces limits — the increment/decrement buttons disable at the bounds and
out-of-range values are clamped on commit.

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `name` | _(blank)_ | Submitted with the form. |
| `label` | _(blank)_ | Floating label. |
| `value` | _(blank)_ | Current value (also a property). |
| `min` | `0` | Minimum value. |
| `max` | `100` | Maximum value. |
| `step` | `1` | Increment/decrement amount. |
| `size` | `medium` | `small` \| `regular` \| `medium` \| `big` |
| `transparent-icons` | `true` | Transparent (vs solid) stepper buttons. _(boolean)_ |
| `with-dots` | `true` | Allow decimal values. _(boolean)_ |
| `required` | `false` | Marks the field required. _(boolean)_ |
| `disabled` | `false` | Disable the control. _(boolean)_ |
| `no-clearing` | `false` | Remove the default bottom margin. _(boolean)_ |

**Methods:** `focus()`. **Events:** `input`, `change` (composed). **Parts:** `field`, `input`.
