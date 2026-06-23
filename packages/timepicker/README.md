# @loomi/timepicker

`<loomi-timepicker>` — pick a time, as a `popup` (input + panel) or `inline`, in 12- or 24-hour format. Form-associated: submits a formatted time (e.g. `3:25PM` or `03:25`) under `name`.

```bash
npm install @loomi/timepicker lit
```

```js
import "@loomi/timepicker/loomi-timepicker.js";
```

## Usage

```html
<loomi-timepicker label="Start time"></loomi-timepicker>
<loomi-timepicker format="24" selected-value="14:30"></loomi-timepicker>
<loomi-timepicker tp-style="inline" selected-value="3:25PM"></loomi-timepicker>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `name` | _(blank)_ | Submitted with the form. |
| `tp-style` | popup | `popup` \| `inline` (the attribute is `tp-style`; `style` is reserved). |
| `format` | 12 | `12` \| `24` |
| `selected-value` | _(blank)_ | Default time (e.g. `3:25PM` or `03:25`). |
| `label / placeholder` | _(blank)_ / HH:MM | Popup field label / placeholder. |
| `required` | false | Append an asterisk. _(boolean)_ |

**Property:** `value`. **Event:** `change` (`detail: { value }`).
