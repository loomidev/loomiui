# @loomi/datepicker

`<loomi-datepicker>` — a calendar date picker (single or range) with locale-aware
month/weekday names. **Form-associated**: submits the formatted date(s) under `name`.

```bash
npm install @loomi/datepicker lit
```

```js
import "@loomi/datepicker/loomi-datepicker.js";
```

## Basic Usage

By default the datepicker fills the width of its parent container; wrap it to constrain
the width.

```html
<loomi-datepicker></loomi-datepicker>
```

```html
<div style="width: 14rem">
  <loomi-datepicker label="Invoice Date"></loomi-datepicker>
</div>
```

## Range Calendar

Set `range` to select a start and end date. The field shows both dates separated by a
dash, e.g. `2026-06-10 - 2026-06-30`.

```html
<loomi-datepicker range></loomi-datepicker>
```

### Required Fields

An asterisk is appended to the label/placeholder when `required`.

```html
<loomi-datepicker required></loomi-datepicker>
```

## Date Formats

```html
<loomi-datepicker format="dd-mm-yyyy"></loomi-datepicker>
<loomi-datepicker format="mm-dd-yyyy"></loomi-datepicker>
<loomi-datepicker format="D d M, Y" range></loomi-datepicker>
<loomi-datepicker format="yyyy-mm-dd"></loomi-datepicker>
```

When using a range datepicker, the chosen `format` is applied to both dates.

## With Default Values

Useful in edit mode, or to show the user what they previously filtered by.
`selected-value` and the range bounds are always parsed as ISO `yyyy-mm-dd`, regardless
of the display `format`.

```html
<loomi-datepicker selected-value="2026-06-22"></loomi-datepicker>
```

A range datepicker accepts a default range as `"start - end"`:

```html
<loomi-datepicker range selected-value="2026-06-10 - 2026-06-30"></loomi-datepicker>
```

## Min and Max Dates

Restrict selectable dates — anything outside the bounds is disabled and grayed out.

```html
<loomi-datepicker min-date="2026-06-01"></loomi-datepicker>
<loomi-datepicker max-date="2026-06-30"></loomi-datepicker>
<loomi-datepicker min-date="2026-06-01" max-date="2026-06-30"></loomi-datepicker>
```

## Week Start Day

```html
<loomi-datepicker week-starts="monday"></loomi-datepicker>
```

## Sizes

```html
<loomi-datepicker size="tiny"></loomi-datepicker>
<loomi-datepicker size="small"></loomi-datepicker>
<loomi-datepicker size="regular"></loomi-datepicker>
<loomi-datepicker size="medium"></loomi-datepicker>
<loomi-datepicker size="big"></loomi-datepicker>
```

## Reacting to a Selection

```js
document.querySelector("loomi-datepicker").addEventListener("change", (e) => {
  console.log(e.detail.value); // formatted string, e.g. "2026-06-22"
  console.log(e.detail.dates); // Date object(s)
});
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `name` | _(blank)_ | Submitted with the form. |
| `range` | `false` | Select a start/end range. _(boolean)_ |
| `selected-value` | _(blank)_ | Default ISO date, or `"start - end"` for range. |
| `min-date` / `max-date` | _(blank)_ | ISO bounds; out-of-range days are disabled. |
| `format` | `yyyy-mm-dd` | `yyyy-mm-dd` \| `dd-mm-yyyy` \| `mm-dd-yyyy` \| `yyyy/mm/dd` \| `dd/mm/yyyy` \| `mm/dd/yyyy` \| `D d M, Y` |
| `week-starts` | `sunday` | `sunday` \| `monday` |
| `placeholder` / `label` | `Select a date` | Field placeholder / label. |
| `required` | `false` | Append an asterisk. _(boolean)_ |
| `size` | `regular` | `tiny` \| `small` \| `regular` \| `medium` \| `big` |

**Property:** `value`. **Event:** `change` (`detail: { value, dates }`).

## Full Example

```html
<loomi-datepicker
  name="invoice_date"
  range
  required
  label="Invoice Date"
  format="dd/mm/yyyy"
  min-date="2026-06-01"
  max-date="2026-06-30"
  week-starts="monday"
  size="big"
></loomi-datepicker>
```
