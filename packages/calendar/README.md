# Calendar

`<loomi-calendar>` — a production calendar and resource scheduler for admin and SaaS templates.

Month, week, day, agenda, and resource views with all-day rows, overlapping timed events, drag-and-drop editing, timezone display, and Loomi token styling aligned with `@loomidev/*` components.

## Installation


```sh
npm install @loomidev/calendar
```

## Import

```js
import "@loomidev/calendar";

```

```

## Basic Usage

Assign `events` as a JavaScript property. Each event uses `Date` objects for `start` and `end`.

```js
const calendar = document.querySelector("loomi-calendar");

calendar.events = [
  {
    id: "evt_001",
    title: "Product review",
    start: new Date("2026-07-01T10:00:00"),
    end: new Date("2026-07-01T11:00:00"),
    color: "primary",
    description: "Quarterly roadmap review",
  },
  {
    id: "evt_002",
    title: "Team offsite",
    start: new Date("2026-07-03T00:00:00"),
    end: new Date("2026-07-05T23:59:59"),
    color: "success",
    isAllDay: true,
    recurrence: { frequency: "yearly", label: "Repeats yearly" },
  },
];
```

```html
<loomi-calendar view="month"></loomi-calendar>
```

## Week View

```html
<loomi-calendar
  view="week"
  week-starts="monday"
  show-timezone
  start-hour="8"
  end-hour="18"
></loomi-calendar>
```

## Resource Scheduler

Assign `resources` and set `view="resource"` for room, staff, or asset timelines.

```js
calendar.resources = [
  { id: "room-a", label: "Room A", color: "primary" },
  { id: "room-b", label: "Room B", color: "secondary" },
];

calendar.events = [
  {
    id: "evt_003",
    title: "Board meeting",
    resourceId: "room-a",
    start: new Date("2026-07-01T09:00:00"),
    end: new Date("2026-07-01T10:30:00"),
    color: "primary",
  },
];
```

```html
<loomi-calendar view="resource" show-timezone start-hour="8" end-hour="18"></loomi-calendar>
```

## Editing

Enable `editable` to allow slot selection, drag-to-move, and resize handles. The component emits events; the parent owns persistence.

```html
<loomi-calendar view="week" editable week-starts="monday"></loomi-calendar>
```

## Properties

| Property | Type | Default | Notes |
| --- | --- | --- | --- |
| `events` | `CalendarEvent[]` | `[]` | JavaScript property. |
| `resources` | `CalendarResource[]` | `[]` | Used by the resource view. |
| `view` | `"month" \| "week" \| "day" \| "agenda" \| "resource"` | `"month"` | Reflected attribute. |
| `date` | `Date` | `new Date()` | Focus date for the active view. |
| `locale` | `string` | `"en"` | Passed to Loomi i18n helpers. |
| `week-starts` | `"sunday" \| "monday"` | `"sunday"` | First day of the week. |
| `timezone` | `string` | browser timezone | IANA timezone used for labels. |
| `show-timezone` | `boolean` | `false` | Shows a timezone badge in the toolbar. |
| `show-weekends` | `boolean` | `true` | Hides Saturday/Sunday in week view when false. |
| `editable` | `boolean` | `false` | Enables slot create, drag, and resize. |
| `loading` | `boolean` | `false` | Shows a loading overlay. |
| `start-hour` | `number` | `6` | First visible hour in timed views. |
| `end-hour` | `number` | `18` | Last visible hour in timed views. |
| `slot-minutes` | `number` | `30` | Snap interval for create/drag actions. |

## Events

| Event | Detail |
| --- | --- |
| `loomi-view-change` | `{ view }` |
| `loomi-date-change` | `{ date }` |
| `loomi-event-click` | `{ event }` |
| `loomi-event-change` | `{ event, previousStart, previousEnd, previousResourceId? }` |
| `loomi-slot-select` | `{ start, end, resourceId?, allDay? }` |

## Keyboard Shortcuts

| Key | Action |
| --- | --- |
| `←` / `→` | Previous / next range |
| `T` | Jump to today |
| `M` / `W` / `D` / `A` / `R` | Switch to month, week, day, agenda, or resource view |

## Design Notes

- Styling follows Loomi surface, border, text, and palette tokens used by `@loomidev/datepicker`, `@loomidev/tab`, and other Pro components.
- The component renders and interacts with events but does not persist them. Listen for `loomi-event-change` and `loomi-slot-select`, then update your app state or API.
- Drag-and-drop emits change events only; the parent should update the `events` array.
- Recurrence is display metadata for now (`event.recurrence.label`).
