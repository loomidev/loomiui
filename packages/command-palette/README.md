# Command Palette

`<loomi-command-palette>` — a keyboard-first navigation and action launcher for admin and SaaS templates.

Grouped commands, fuzzy search, keyboard selection, optional `href` navigation, and typed select/query/open-change events. Opens with `Cmd K` or `Ctrl K`.

## Accessibility

- Arrow keys move selection; Enter runs command; Escape closes and restores focus.
- Global shortcut (default ⌘K / Ctrl+K) documented for power users.

For the library-wide baseline, see [Component foundations — Accessibility](https://loomiui.com/customization/component-foundations/#accessibility).

## Responsive behavior

For the shared container and viewport rules, see [Component foundations — Responsive behavior](https://loomiui.com/customization/component-foundations/#responsive-behavior).

## Dark mode

For theme activation, token overrides, and contrast guidance, see [Component foundations — Dark mode](https://loomiui.com/customization/component-foundations/#dark-mode).

## Attributes

| Attribute           | Type                   | Default                          | Notes                                                   |
| ------------------- | ---------------------- | -------------------------------- | ------------------------------------------------------- |
| `open`              | `boolean`              | `false`                          | Opens the command palette dialog. Reflected attribute.  |
| `query`             | `string`               | `""`                             | Current search value. Reflected attribute.              |
| `placeholder`       | `string`               | `"Search commands"`              | Search input and trigger placeholder text.              |
| `empty-title`       | `string`               | `"No commands found"`            | Heading shown when no commands match.                   |
| `empty-description` | `string`               | `"Try a different search term."` | Supporting empty-state copy.                            |
| `shortcut`          | `string`               | `"Cmd K"`                        | Shortcut hint shown in the trigger.                     |
| `items`             | `CommandPaletteItem[]` | `[]`                             | JavaScript property only; assign it from your app code. |

## Installation

```sh
npm install @loomidev/command-palette
```

## Import

```js
import "@loomidev/command-palette";
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

Use `empty-title` and `empty-description` when no commands match the current query.

```html
<loomi-command-palette
  placeholder="Jump to…"
  empty-title="No matching commands"
  empty-description="Try a project, customer, or setting"
></loomi-command-palette>
```

## Events

| Event                        | Detail      |
| ---------------------------- | ----------- |
| `loomi-command-select`       | `{ item }`  |
| `loomi-command-open-change`  | `{ open }`  |
| `loomi-command-query-change` | `{ query }` |

## Design Notes

- The component emits a command-select event before navigating to `href`.
- Apps can omit `href` and handle commands entirely from the event.
- React wrappers should expose this as an `onCommandSelect` callback.

## Dependencies

- `@loomidev/core`
