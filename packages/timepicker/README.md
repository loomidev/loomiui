# @loomi/timepicker

`<loomi-timepicker>` — pick a time, as a `popup` (input + panel) or `inline`, in 12- or
24-hour format. **Form-associated**: submits a formatted time (e.g. `3:25PM` or `03:25`)
under `name`.

```bash
npm install @loomi/timepicker lit
```

```js
import "@loomi/timepicker/loomi-timepicker.js";
```

## Basic Usage

```html
<loomi-timepicker></loomi-timepicker>
```

## Inline Style

By default the timepicker is a popup — an input that opens a panel. Set `tp-style` to
`inline` to render the hour/minute pickers directly on the page instead, with no input
or popup involved (handy for a settings page where the field is always visible).

```html
<loomi-timepicker tp-style="inline"></loomi-timepicker>
```

> The attribute is `tp-style`, not `style` — `style` is a reserved HTML attribute for
> inline CSS.

## Time Formats

The default is 12-hour format (1–12 with AM/PM). Set `format="24"` for 24-hour format
(00–23, no AM/PM).

```html
<loomi-timepicker format="24"></loomi-timepicker>
<loomi-timepicker tp-style="inline" format="24"></loomi-timepicker>
```

## Required Fields

```html
<loomi-timepicker required></loomi-timepicker>
<loomi-timepicker label="Start Time" required></loomi-timepicker>
```

## Default Values

```html
<!-- 12-hour format -->
<loomi-timepicker selected-value="3:25PM"></loomi-timepicker>

<!-- 24-hour format -->
<loomi-timepicker selected-value="14:30" format="24"></loomi-timepicker>

<!-- inline, pre-selected -->
<loomi-timepicker tp-style="inline" selected-value="3:25PM"></loomi-timepicker>
```

## Form Values

Specify a `name` to retrieve the value on form submission.

```html
<loomi-timepicker name="event_time" format="24"></loomi-timepicker>
```

```js
new FormData(form).get("event_time"); // "14:30" (format="24") or "2:30PM" (default)
```

## Reacting to a Selection

```js
document.querySelector("loomi-timepicker").addEventListener("change", (e) => {
  console.log(e.detail.value); // "3:25PM" or "15:25"
});
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `name` | _(blank)_ | Submitted with the form. |
| `tp-style` | `popup` | `popup` \| `inline` (the attribute is `tp-style`; `style` is reserved). |
| `format` | `12` | `12` \| `24` |
| `selected-value` | _(blank)_ | Default time (e.g. `3:25PM` or `03:25`). |
| `label` / `placeholder` | _(blank)_ / `HH:MM` | Popup field label / placeholder. |
| `required` | `false` | Append an asterisk. _(boolean)_ |

**Property:** `value`. **Event:** `change` (`detail: { value }`).

## Full Example

```html
<loomi-timepicker
  name="start_time"
  format="24"
  required
  label="Start Time"
  placeholder="HH:MM"
  tp-style="inline"
  selected-value="00:35"
></loomi-timepicker>
```
