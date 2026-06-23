# @loomi/datepicker

`<loomi-datepicker>` — a calendar date picker (single or range) with locale-aware month/weekday names. Form-associated: submits the formatted date(s) under `name`.

```bash
npm install @loomi/datepicker lit
```

```js
import "@loomi/datepicker/loomi-datepicker.js";
```

## Usage

```html
<loomi-datepicker label="Pick a date"></loomi-datepicker>
<loomi-datepicker range format="dd/mm/yyyy"></loomi-datepicker>
<loomi-datepicker selected-value="2026-06-22" format="D d M, Y"></loomi-datepicker>
<loomi-datepicker min-date="2026-06-01" max-date="2026-06-30"></loomi-datepicker>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `name` | _(blank)_ | Submitted with the form. |
| `range` | false | Select a start/end range. _(boolean)_ |
| `selected-value` | _(blank)_ | Default ISO date, or `"start - end"` for range. |
| `min-date / max-date` | _(blank)_ | ISO bounds; out-of-range days are disabled. |
| `format` | yyyy-mm-dd | `yyyy-mm-dd` \| `dd-mm-yyyy` \| `mm-dd-yyyy` \| `yyyy/mm/dd` \| `dd/mm/yyyy` \| `mm/dd/yyyy` \| `D d M, Y` |
| `week-starts` | sunday | `sunday` \| `monday` |
| `placeholder / label` | Select a date | Field placeholder / label. |
| `required` | false | Append an asterisk. _(boolean)_ |
| `size` | regular | `tiny` \| `small` \| `regular` \| `medium` \| `big` |

**Property:** `value`. **Event:** `change` (`detail: { value, dates }`). Note: `selected-value`/`min-date`/`max-date` are parsed as ISO `yyyy-mm-dd`; the displayed value uses `format`.
