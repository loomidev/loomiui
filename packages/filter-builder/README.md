# Filter Builder

`<loomi-filter-builder>` — a structured filter editor for tables, reports, CRM lists, and server-side query workflows.

Typed fields, field-specific operators, `and` / `or` logic, and API-friendly `{ logic, rules }` output.

## Installation

```sh
npm install @loomidev/filter-builder
```

## Import

```js
import "@loomidev/filter-builder";
```

## Basic Usage

Assign `fields` as a JavaScript property, then listen for apply events.

```js
const builder = document.querySelector("loomi-filter-builder");

builder.fields = [
  { key: "name", label: "Name", type: "text" },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: [
      { label: "Active", value: "Active" },
      { label: "Invited", value: "Invited" },
    ],
  },
];

builder.addEventListener("loomi-filter-apply", (event) => {
  console.log(event.detail.value);
});
```

```html
<loomi-filter-builder apply-label="Apply filters"></loomi-filter-builder>
```

## With Initial Rules

Seed the builder with an initial ruleset through a JavaScript property.

```html
<loomi-filter-builder logic="and"></loomi-filter-builder>
```

```js
builder.rules = [
  { id: "status-active", field: "status", operator: "equals", value: "Active" },
];
```

## Field types & operators

Each `fields` entry's `type` picks the value control it renders (a `select` for `"select"`, a typed `<input>` otherwise) and the default operator list offered for that row — override per-field with `field.operators`.

| `type` | Value control | Default operators |
| --- | --- | --- |
| `text` | Text input | `contains`, `equals`, `notEquals`, `startsWith`, `endsWith` |
| `number` | Number input | `equals`, `notEquals`, `gt`, `gte`, `lt`, `lte` |
| `date` | Date input | `equals`, `before`, `after` |
| `boolean` | _(none — operator alone is the value)_ | `isTrue`, `isFalse` |
| `select` | `field.options` dropdown | `equals`, `notEquals` |

```js
builder.fields = [
  { key: "revenue", label: "Revenue", type: "number", operators: ["gte", "lte"] },
];
```

## Accessibility

loomi-filter-builder is built on semantic markup where the browser gives us the right behavior, and it adds ARIA only where the component has custom interaction. Keyboard users should be able to reach the same controls as pointer users, with visible focus treatment unless you explicitly turn it off on controls that support `show-focus-ring="false"`.

When the component displays status, progress, validation, or temporary feedback, pair it with clear labels or nearby text in your app so assistive technology users get the same context a sighted user gets from the visual treatment.

- Each rule row exposes labelled field, operator, and value controls.
- Remove actions include an accessible name.

## Responsive behavior

loomi-filter-builder is designed to fit the layout you place it in. It uses fluid widths, `min-width: 0`, wrapping, truncation, or stacked layouts where that keeps the component usable in cards, forms, sidebars, and mobile screens.

For dense layouts, give the parent container an intentional width and let the component fill it. For long labels or user-provided content, prefer real text that can wrap or truncate instead of fixed pixel assumptions.

- Each rule row collapses to a single column below `720px`.

## Dark mode

loomi-filter-builder uses Loomi semantic tokens such as `--loomi-surface`, `--loomi-surface-border`, `--loomi-text`, and palette accent tokens instead of hard-coded light colors. Borders, panels, hover states, and muted text are expected to shift with the active theme.

Add `.dark` to your app root with `@loomidev/theme-switcher`, or provide your own token overrides, and the component will inherit the dark-mode values through its shadow DOM.

## Properties

| Property | Type | Default | Notes |
| --- | --- | --- | --- |
| `fields` | `FilterBuilderField[]` | `[]` | JavaScript property. Drives the field picker, value control, and operator list per row. |
| `rules` | `FilterBuilderRule[]` | `[]` | JavaScript property. Each rule is `{ id, field, operator, value }`. |
| `logic` | `"and" \| "or"` | `"and"` | Reflected attribute. Combinator shown in the header toggle. |
| `title` | `string` | `"Filters"` | Heading text. |
| `add-label` | `string` | `"Add filter"` | Label for the add-rule button. |
| `apply-label` | `string` | `"Apply filters"` | Label for the apply button (only rendered when `show-apply`). |
| `empty-label` | `string` | `"No filters added"` | Shown in place of the rule list when `rules` is empty. |
| `show-apply` | `boolean` | `true` | Reflected attribute. Hides the apply button when `false` — use this for filters that should apply live via `loomi-filter-change` instead. |

## Events

| Event | Detail |
| --- | --- |
| `loomi-filter-change` | `{ value }` — fires on every add/remove/edit of a rule or logic change. |
| `loomi-filter-apply` | `{ value }` — fires when the apply button is clicked. |

Both detail shapes are `{ logic, rules }` — the same object `fields`/`rules` describe.

## Design Notes

- The value shape is intentionally API-friendly: `{ logic, rules }`.
- Apps should translate the emitted rules into SQL, API query params, GraphQL variables, or table-local filters.
- Server-side tables should listen for `loomi-filter-apply` and refresh data from the backend.

## Dependencies

- `@loomidev/core`
