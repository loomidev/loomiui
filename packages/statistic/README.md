# @loomi/statistic

`<loomi-statistic>` — a dashboard stat showing a number and label, with optional
currency, an icon, and a loading state. Takes up the full width of its parent.

```bash
npm install @loomi/statistic lit
```

```js
import "@loomi/statistic/loomi-statistic.js";
```

## Basic Usage

Numbers render as-is — format thousand separators and decimals yourself before setting
`number`.

```html
<loomi-statistic number="34,500,100" label="Total payments"></loomi-statistic>
```

Move the label below the number instead of above it:

```html
<loomi-statistic label-position="bottom" number="34,500,100" label="Total payments"></loomi-statistic>
```

## With Icons

Pass any markup into the `icon` slot — usually a `<loomi-icon>` on a colored background.
Icons sit on the left by default; flip them with `icon-position="right"`.

```html
<loomi-statistic number="34,500,100" label="Total payments">
  <loomi-icon slot="icon" name="banknotes" style="background: #3b82f6; color: white; border-radius: 9999px; padding: 0.5rem"></loomi-icon>
</loomi-statistic>

<loomi-statistic icon-position="right" number="1,204" label="Active users">
  <loomi-icon slot="icon" name="users" style="background: #f97316; color: white; border-radius: 9999px; padding: 0.5rem"></loomi-icon>
</loomi-statistic>
```

## With Currency

```html
<loomi-statistic currency="GHS" number="34,500,100" label="Total payments"></loomi-statistic>

<!-- currency on the right of the number instead -->
<loomi-statistic currency="GHS" currency-position="right" number="34,500,100" label="Total payments"></loomi-statistic>
```

The currency symbol renders at a smaller font size than the number itself.

## Loading State

Show a spinner in place of the number while the real value is still loading — e.g.
while waiting on an API response.

```html
<loomi-statistic label="Total payments" show-spinner></loomi-statistic>
```

```js
const el = document.querySelector("loomi-statistic");
const total = await fetchTotalPayments();
el.number = total.toLocaleString();
el.showSpinner = false;
```

## Card Styling

`has-shadow`, `has-border` and `radius` control the surrounding card, same vocabulary as
[`<loomi-card>`](../card).

```html
<loomi-statistic number="92" label="Score" has-shadow="false" has-border="false"></loomi-statistic>
<loomi-statistic number="92" label="Score" radius="large"></loomi-statistic>
```

## Clickable Statistics

```html
<loomi-statistic number="34,500" label="Total payments" url="/reports/payments"></loomi-statistic>
```

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `label` | _(blank)_ | Description text. |
| `number` | _(blank)_ | The value to display (format it yourself). |
| `label-position` | `top` | `top` \| `bottom` |
| `currency` | _(blank)_ | Currency symbol shown beside the number. |
| `currency-position` | `left` | `left` \| `right` |
| `icon-position` | `left` | `left` \| `right` |
| `has-shadow` / `has-border` | `true` | Card styling. _(boolean)_ |
| `radius` | `small` | `none` \| `small` \| `medium` \| `large` \| `xl` |
| `show-spinner` | `false` | Show a loading spinner instead of the number. _(boolean)_ |
| `url` | _(blank)_ | Navigate on click. |

**Slot:** `icon`.

## Full Example

```html
<loomi-statistic
  label="Total payments"
  label-position="bottom"
  number="34,500,100"
  currency="XOF"
  currency-position="right"
  icon-position="right"
  has-shadow="false"
  has-border="false"
>
  <loomi-icon slot="icon" name="banknotes"></loomi-icon>
</loomi-statistic>
```
