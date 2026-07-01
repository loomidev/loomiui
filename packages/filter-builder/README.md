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

## Events

| Event | Detail |
| --- | --- |
| `loomi-filter-change` | `{ value }` |
| `loomi-filter-apply` | `{ value }` |

## Design Notes

- The value shape is intentionally API-friendly: `{ logic, rules }`.
- Apps should translate the emitted rules into SQL, API query params, GraphQL variables, or table-local filters.
- Server-side tables should listen for `loomi-filter-apply` and refresh data from the backend.
