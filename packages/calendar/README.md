# Calendar

`<loomi-calendar>` — a production calendar and resource scheduler for admin and SaaS templates.

Month, week, day, agenda, and resource views with a collapsible sidebar (mini calendar + next-event detail), drag-and-drop editing, timezone display, and Loomi token styling aligned with `@loomidev/*` components.

## Accessibility
- Calendar grid with `aria-selected` days and roving focus.
- Previous/next month buttons are labelled; Escape closes popover parents.

## Responsive behavior
- Minimum width scales down; day cells shrink on small screens.

## Dark mode
- Day cells and chrome use `--loomi-calendar-*` aliases tied to semantic tokens.
- Selected days and primary actions use `--loomi-text-on-primary` on accent fills.

## Installation

```sh
npm install @loomidev/calendar
```

## Import

```js
import "@loomidev/calendar";
```

The calendar bundles its own UI dependencies (`loomi-datepicker`, `loomi-input`, `loomi-modal`, `loomi-select`, `loomi-tag-input`, `loomi-textarea`, `loomi-timepicker`, `loomi-toggle`, `loomi-tooltip`). Importing `@loomidev/calendar` registers those elements automatically.

## Basic Usage

Mount the element, then assign `events` as a JavaScript property. Each event uses native `Date` objects for `start` and `end`.

The calendar is **display-only by default**. It renders whatever you pass in; your app is responsible for fetching data from an API, normalizing it into `CalendarEvent` objects, and writing changes back when the user creates, edits, drags, or deletes events.

```html
<loomi-calendar view="week" editable show-sidebar></loomi-calendar>
```

```js
const calendar = document.querySelector("loomi-calendar");

// 1. Load events from your backend
const response = await fetch("/api/events?from=2026-07-01&to=2026-07-31");
const payload = await response.json();

// 2. Map API records into CalendarEvent objects
calendar.events = payload.map((record) => ({
  id: record.id,
  title: record.title,
  start: new Date(record.startsAt),
  end: new Date(record.endsAt),
  color: record.category, // "primary" | "secondary" | "success" | "warning" | "error"
  description: record.notes,
  isAllDay: record.allDay,
  resourceId: record.roomId,
  recurrence: record.recurrenceRule
    ? { frequency: record.recurrenceRule.frequency, label: record.recurrenceRule.label }
    : undefined,
  reminder: record.reminderText ? { label: record.reminderText } : undefined,
  invitees: record.attendees?.map((person) => ({
    id: person.id,
    name: person.name,
    avatarUrl: person.avatarUrl,
    status: person.rsvp, // "yes" | "no" | "awaiting"
  })),
}));

// 3. Persist user changes
calendar.addEventListener("loomi-event-create", async (event) => {
  const saved = await fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event.detail.event),
  }).then((res) => res.json());

  calendar.events = [...calendar.events, { ...event.detail.event, id: saved.id }];
});

calendar.addEventListener("loomi-event-change", async (event) => {
  const { event: updated } = event.detail;
  await fetch(`/api/events/${updated.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updated),
  });
  calendar.events = calendar.events.map((entry) => (entry.id === updated.id ? updated : entry));
});

calendar.addEventListener("loomi-event-delete", async (event) => {
  await fetch(`/api/events/${event.detail.event.id}`, { method: "DELETE" });
  calendar.events = calendar.events.filter((entry) => entry.id !== event.detail.event.id);
});
```

## Event colors

Event color is controlled by the optional `color` field on each `CalendarEvent`. The calendar does **not** infer colors automatically — you choose the token when mapping data from your API.

| `color` value | Typical use | Visual |
| --- | --- | --- |
| `primary` | Default meetings, internal events | Primary palette |
| `secondary` | Neutral blocks, focus time | Gray palette |
| `success` | Confirmed client meetings, completed milestones | Green palette |
| `warning` | Pending reviews, travel, deadlines | Amber palette |
| `error` | Critical incidents, cancellations | Red palette |

If `color` is omitted, events render with the **primary** palette. In the resource view, an event can also inherit color from its assigned `CalendarResource.color` when the event itself has no color.

Colors follow Loomi theme tokens (`--loomi-primary-*`, `--loomi-success-*`, etc.), so they stay consistent with buttons, alerts, and tags in the rest of your app.

## Data model

### `CalendarEvent`

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | `string` | yes | Stable unique id from your system |
| `title` | `string` | yes | Shown on pills, timed blocks, and sidebar detail |
| `start` | `Date` | yes | Event start |
| `end` | `Date` | yes | Event end (must be after `start`) |
| `color` | `CalendarEventColor` | no | Semantic palette token (see above) |
| `description` | `string` | no | Long-form notes; shown in sidebar “About this event” |
| `isAllDay` | `boolean` | no | Renders in all-day / spanning lanes |
| `resourceId` | `string` | no | Links to `CalendarResource.id` for resource view |
| `recurrence` | `{ frequency, label? }` | no | Display metadata (`daily` / `weekly` / `monthly` / `yearly`) |
| `reminder` | `{ label, minutesBefore? }` | no | e.g. `{ label: "10 min before" }` |
| `invitees` | `CalendarEventInvitee[]` | no | Guest list with RSVP status for sidebar avatars |
| `timezone` | `string` | no | IANA zone for per-event time labels |
| `editable` | `boolean` | no | Override global `editable` for this event |
| `draggable` | `boolean` | no | Override drag behavior for this event |

### `CalendarEventInvitee`

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `string` | Optional stable id |
| `name` | `string` | Display name |
| `email` | `string` | Optional |
| `avatarUrl` | `string` | Optional image URL |
| `initials` | `string` | Optional override when no avatar |
| `status` | `"yes" \| "no" \| "awaiting"` | Drives sidebar RSVP summary |

### `CalendarResource`

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `string` | Referenced by `event.resourceId` |
| `label` | `string` | Room / person / asset name |
| `color` | `CalendarEventColor` | Default color for events on this resource |
| `description` | `string` | Optional |

### Example: fully populated event

```js
{
  id: "evt_demo",
  title: "Product demo",
  start: new Date("2027-01-10T13:30:00"),
  end: new Date("2027-01-10T15:30:00"),
  color: "primary",
  description: "Sienna is inviting you to a scheduled Zoom meeting.\n\nJoin Zoom Meeting: https://example.com/zoom",
  reminder: { label: "10 min before", minutesBefore: 10 },
  recurrence: { frequency: "weekly", label: "Repeats weekly" },
  resourceId: "room-a",
  invitees: [
    { id: "u1", name: "Sienna Reed", avatarUrl: "/avatars/sienna.jpg", status: "yes" },
    { id: "u2", name: "Alex Kim", initials: "AK", status: "yes" },
    { id: "u3", name: "Jordan Lee", initials: "JL", status: "awaiting" },
  ],
}
```

## Sidebar

When `show-sidebar` is enabled (default):

- **Mini calendar** — navigate months; dates with events show a dot; click a date to focus the main view
- **Upcoming** — detail card for the **next** upcoming event only (title, date/time, reminder, guests, description)
- **Toggle** — toolbar button sets `sidebar-open` to show/hide the pane (closed by default; the choice is remembered in `localStorage` across reloads)

The sidebar reads from the same `events` array as the main grid. Populate invitees, reminder, and description on the next upcoming event to fill the detail card.

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

Enable `editable` to show the **Add event** button, open the create modal (title, schedule, color, resource, recurrence, reminder, invitees, description), drag events across days, and resize multi-day events horizontally.

```html
<loomi-calendar view="week" editable week-starts="monday" show-sidebar sidebar-open></loomi-calendar>
```

The create modal emits `loomi-event-create`. Drag/resize emits `loomi-event-change`. Sidebar actions emit `loomi-event-duplicate` and `loomi-event-delete`.

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
| `show-sidebar` | `boolean` | `true` | Shows the left pane with mini calendar and upcoming detail. |
| `sidebar-open` | `boolean` | `false` | Toggles the left pane visibility. Reflected attribute. When unset, restores the last choice from `localStorage` (`loomi-calendar-sidebar-open`). |
| `editable` | `boolean` | `false` | Enables create modal, drag, and resize. |
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
| `loomi-event-create` | `{ event }` |
| `loomi-event-change` | `{ event, previousStart, previousEnd, previousResourceId? }` |
| `loomi-event-delete` | `{ event }` |
| `loomi-event-duplicate` | `{ event }` |
| `loomi-sidebar-toggle` | `{ open }` |
| `loomi-slot-select` | `{ start, end, resourceId?, allDay? }` |

## Keyboard Shortcuts

| Key | Action |
| --- | --- |
| `←` / `→` | Previous / next range |
| `T` | Jump to today |
| `M` / `W` / `D` / `A` / `R` | Switch to month, week, day, agenda, or resource view |

## Design Notes

- Styling follows Loomi surface, border, text, and palette tokens used by `@loomidev/datepicker`, `@loomidev/tab`, and other components.
- The component renders and interacts with events but does not persist them. Listen for `loomi-event-create`, `loomi-event-change`, `loomi-event-delete`, and `loomi-event-duplicate`, then update your app state or API.
- Drag-and-drop emits change events only; the parent should update the `events` array.
- Recurrence is display metadata for now — expand instances server-side before passing events in, or store the rule on create and re-fetch.
