# Command Palette

`<loomi-command-palette>` — a keyboard-first navigation and action launcher for admin and SaaS templates.

Grouped commands, fuzzy search, keyboard selection, optional `href` navigation, and typed select/query/open-change events. Opens with `Cmd K` or `Ctrl K`.

## Accessibility

loomi-command-palette is built on semantic markup where the browser gives us the right behavior, and it adds ARIA only where the component has custom interaction. Keyboard users should be able to reach the same controls as pointer users, with visible focus treatment unless you explicitly turn it off on controls that support `show-focus-ring="false"`.

When the component displays status, progress, validation, or temporary feedback, pair it with clear labels or nearby text in your app so assistive technology users get the same context a sighted user gets from the visual treatment.

- Arrow keys move selection; Enter runs command; Escape closes and restores focus.
- Global shortcut (default ⌘K / Ctrl+K) documented for power users.

## Responsive behavior

loomi-command-palette is designed to fit the layout you place it in. It uses fluid widths, `min-width: 0`, wrapping, truncation, or stacked layouts where that keeps the component usable in cards, forms, sidebars, and mobile screens.

For dense layouts, give the parent container an intentional width and let the component fill it. For long labels or user-provided content, prefer real text that can wrap or truncate instead of fixed pixel assumptions.

## Dark mode

loomi-command-palette uses Loomi semantic tokens such as `--loomi-surface`, `--loomi-surface-border`, `--loomi-text`, and palette accent tokens instead of hard-coded light colors. Borders, panels, hover states, and muted text are expected to shift with the active theme.

Add `.dark` to your app root with `@loomidev/theme-switcher`, or provide your own token overrides, and the component will inherit the dark-mode values through its shadow DOM.

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
