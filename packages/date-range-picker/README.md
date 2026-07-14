# Date Range Picker

`<loomi-date-range-picker>` — a reporting-friendly range control for dashboards, tables, exports, and billing views.

ISO date strings, presets, optional comparison ranges, apply/change events, and a responsive popover layout.

## Accessibility

loomi-date-range-picker is built on semantic markup where the browser gives us the right behavior, and it adds ARIA only where the component has custom interaction. Keyboard users should be able to reach the same controls as pointer users, with visible focus treatment unless you explicitly turn it off on controls that support `show-focus-ring="false"`.

When the component displays status, progress, validation, or temporary feedback, pair it with clear labels or nearby text in your app so assistive technology users get the same context a sighted user gets from the visual treatment.

- Preset and comparison controls are labelled.

## Responsive behavior

loomi-date-range-picker is designed to fit the layout you place it in. It uses fluid widths, `min-width: 0`, wrapping, truncation, or stacked layouts where that keeps the component usable in cards, forms, sidebars, and mobile screens.

For dense layouts, give the parent container an intentional width and let the component fill it. For long labels or user-provided content, prefer real text that can wrap or truncate instead of fixed pixel assumptions.

## Dark mode

loomi-date-range-picker uses Loomi semantic tokens such as `--loomi-surface`, `--loomi-surface-border`, `--loomi-text`, and palette accent tokens instead of hard-coded light colors. Borders, panels, hover states, and muted text are expected to shift with the active theme.

Add `.dark` to your app root with `@loomidev/theme-switcher`, or provide your own token overrides, and the component will inherit the dark-mode values through its shadow DOM.

## Installation

```sh
npm install @loomidev/date-range-picker
```

## Import

```js
import "@loomidev/date-range-picker";

```

````

## Basic Usage

```html
<loomi-date-range-picker label="Reporting period"></loomi-date-range-picker>
````

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

| Event                          | Detail                |
| ------------------------------ | --------------------- |
| `loomi-date-range-change`      | `{ value, presetId }` |
| `loomi-date-range-apply`       | `{ value, presetId }` |
| `loomi-date-range-open-change` | `{ open }`            |

## Design Notes

- Values use `YYYY-MM-DD` strings so they are simple to pass through web components, React, APIs, and URLs.
- The component does not fetch data. Apps should listen for `loomi-date-range-apply` and refresh reports, tables, or charts.
- Comparison dates are optional and only included in event values when comparison mode is enabled.

## Dependencies

- `@loomidev/button`
- `@loomidev/core`
- `@loomidev/datepicker`
