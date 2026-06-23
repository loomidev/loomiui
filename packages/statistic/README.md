# @loomi/statistic

`<loomi-statistic>` — a dashboard stat showing a number and label, with optional currency, icon and loading spinner.

```bash
npm install @loomi/statistic lit
```

```js
import "@loomi/statistic/loomi-statistic.js";
```

## Usage

```html
<loomi-statistic number="34,500" label="Total payments" currency="GHS"></loomi-statistic>
<loomi-statistic number="1,204" label="Active users" label-position="bottom"></loomi-statistic>
<loomi-statistic label="Loading…" show-spinner></loomi-statistic>

<loomi-statistic number="92" label="Score">
  <svg slot="icon" …></svg>
</loomi-statistic>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `label` | _(blank)_ | Description text. |
| `number` | _(blank)_ | The value to display (format it yourself). |
| `label-position` | top | `top` \| `bottom` |
| `currency` | _(blank)_ | Currency symbol shown beside the number. |
| `currency-position` | left | `left` \| `right` |
| `icon-position` | left | `left` \| `right` |
| `has-shadow / has-border` | true | Card styling. _(boolean)_ |
| `radius` | small | `none` \| `small` \| `medium` \| `large` \| `xl` |
| `show-spinner` | false | Show a loading spinner instead of the number. _(boolean)_ |
| `url` | _(blank)_ | Navigate on click. |

**Slot:** `icon`.
