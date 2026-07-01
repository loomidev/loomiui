# Command Palette

`<loomi-command-palette>` — a keyboard-first navigation and action launcher for admin and SaaS templates.

Grouped commands, fuzzy search, keyboard selection, optional `href` navigation, and typed select/query/open-change events. Opens with `Cmd K` or `Ctrl K`.

## Installation


```sh
npm install @loomidev/command-palette
```

## Import

```js
import "@loomidev/command-palette";

```

```

## Basic Usage

Assign an `items` array as a JavaScript property. Each item can include a group, description, keywords, shortcut label, and optional `href`.

```js
const palette = document.querySelector("loomi-command-palette");

palette.items = [
  {
    id: "go-users",
    label: "Open users",
    description: "Manage members and invites",
    group: "Navigation",
    href: "/users",
    keywords: ["members", "accounts"],
    shortcut: "G U",
  },
  {
    id: "invite-member",
    label: "Invite member",
    description: "Send a team invitation",
    group: "Actions",
  },
];
```

```html
<loomi-command-palette placeholder="Search commands…"></loomi-command-palette>
```

Press `Cmd K` or `Ctrl K` to open the palette.

## Empty State

Use `empty-label` when no commands match the current query.

```html
<loomi-command-palette placeholder="Jump to…" empty-label="No matching commands"></loomi-command-palette>
```

## Events

| Event | Detail |
| --- | --- |
| `loomi-command-select` | `{ item }` |
| `loomi-command-open-change` | `{ open }` |
| `loomi-command-query-change` | `{ query }` |

## Design Notes

- The component emits a command-select event before navigating to `href`.
- Apps can omit `href` and handle commands entirely from the event.
- React wrappers should expose this as an `onCommandSelect` callback.
