# Date Range Picker

`<loomi-date-range-picker>` — a reporting-friendly range control for dashboards, tables, exports, and billing views.

ISO date strings, presets, optional comparison ranges, apply/change events, and a responsive popover layout.

## Accessibility
- Popover pairs with calendar keyboard navigation.
- Preset and comparison controls are labelled.

## Responsive behavior
- Popover layout reflows on narrow viewports (single-column presets).

## Dark mode
- Popover shell uses `--loomi-date-*` semantic aliases.
## Installation


```sh
npm install @loomidev/date-range-picker
```

## Import

```js
import "@loomidev/date-range-picker";

```

```

## Basic Usage

```html
<loomi-date-range-picker label="Reporting period"></loomi-date-range-picker>
```

Set an initial range with attributes:

```html
<loomi-date-range-picker
  label="Last 30 days"
  start-date="2026-06-02"
  end-date="2026-07-01"
></loomi-date-range-picker>
```

## Comparison Mode

Enable `comparison` to show a second range for period-over-period reporting.

```html
<loomi-date-range-picker
  label="Revenue"
  comparison
  start-date="2026-06-02"
  end-date="2026-07-01"
  compare-start-date="2026-05-03"
  compare-end-date="2026-06-01"
></loomi-date-range-picker>
```

## Custom Presets

Presets are a JavaScript property for app-specific ranges.

```js
const picker = document.querySelector("loomi-date-range-picker");

picker.presets = [
  {
    id: "last-30-days",
    label: "Last 30 days",
    startDate: "2026-06-02",
    endDate: "2026-07-01",
    compareStartDate: "2026-05-03",
    compareEndDate: "2026-06-01",
  },
];

picker.addEventListener("loomi-date-range-apply", (event) => {
  console.log(event.detail.value);
});
```

## Events

| Event | Detail |
| --- | --- |
| `loomi-date-range-change` | `{ value, presetId }` |
| `loomi-date-range-apply` | `{ value, presetId }` |
| `loomi-date-range-open-change` | `{ open }` |

## Design Notes

- Values use `YYYY-MM-DD` strings so they are simple to pass through web components, React, APIs, and URLs.
- The component does not fetch data. Apps should listen for `loomi-date-range-apply` and refresh reports, tables, or charts.
- Comparison dates are optional and only included in event values when comparison mode is enabled.
