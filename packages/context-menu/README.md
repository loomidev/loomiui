# @loomidev/context-menu

`<loomi-context-menu>` gives any region a Loomi-styled right-click action menu.
It follows the same visual language and item API as `<loomi-dropmenu>`, but opens
from the pointer or keyboard context-menu gesture instead of a trigger button.

```bash
npm install @loomidev/context-menu lit
```

```ts
import "@loomidev/context-menu";
```


## Basic usage

Put the right-click target in the `target` slot and menu actions in the default
slot.

```html
<loomi-context-menu>
  <div slot="target">Right-click this file</div>

  <loomi-context-menu-item icon="document-duplicate">Duplicate</loomi-context-menu-item>
  <loomi-context-menu-item icon="pencil-square" shortcut="E">Rename</loomi-context-menu-item>
  <loomi-context-menu-item divider></loomi-context-menu-item>
  <loomi-context-menu-item icon="trash">Delete</loomi-context-menu-item>
</loomi-context-menu>
```

Keyboard users can focus the target and press the Context Menu key or `Shift+F10`.

## Items

`<loomi-context-menu-item>` supports the same core item affordances as dropmenu:

```html
<loomi-context-menu>
  <button slot="target">Actions</button>

  <loomi-context-menu-item header>Project</loomi-context-menu-item>
  <loomi-context-menu-item icon="user" shortcut="⌘K P">View profile</loomi-context-menu-item>
  <loomi-context-menu-item icon="question-mark-circle">
    Support
    <loomi-context-menu-item slot="submenu">Documentation</loomi-context-menu-item>
    <loomi-context-menu-item slot="submenu">Contact support</loomi-context-menu-item>
  </loomi-context-menu-item>
</loomi-context-menu>
```

## Accessibility

loomi-context-menu is built on semantic markup where the browser gives us the right behavior, and it adds ARIA only where the component has custom interaction. Keyboard users should be able to reach the same controls as pointer users, with visible focus treatment unless you explicitly turn it off on controls that support `show-focus-ring="false"`.

When the component displays status, progress, validation, or temporary feedback, pair it with clear labels or nearby text in your app so assistive technology users get the same context a sighted user gets from the visual treatment.

- Supports keyboard focus with visible `:focus-visible` styling on interactive controls.

## Responsive behavior

loomi-context-menu is designed to fit the layout you place it in. It uses fluid widths, `min-width: 0`, wrapping, truncation, or stacked layouts where that keeps the component usable in cards, forms, sidebars, and mobile screens.

For dense layouts, give the parent container an intentional width and let the component fill it. For long labels or user-provided content, prefer real text that can wrap or truncate instead of fixed pixel assumptions.


## Dark mode

loomi-context-menu uses Loomi semantic tokens such as `--loomi-surface`, `--loomi-surface-border`, `--loomi-text`, and palette accent tokens instead of hard-coded light colors. Borders, panels, hover states, and muted text are expected to shift with the active theme.

Add `.dark` to your app root with `@loomidev/theme-switcher`, or provide your own token overrides, and the component will inherit the dark-mode values through its shadow DOM.

- Respects `.dark` on `<html>` via `@loomidev/theme-switcher` or your app theme.

## Attributes

### `<loomi-context-menu>`

| Attribute | Default | Description |
| --- | --- | --- |
| `disabled` | `false` | Prevents opening the menu. |
| `divided` | `false` | Adds dividers between direct child items. |
| `placement` | `auto` | Horizontal alignment from the pointer: `auto`, `left`, or `right`. |
| `scrollable` | `false` | Constrains the menu height and scrolls its contents. |
| `height` | `200` | Scrollable menu height in pixels. |
| `hide-after-click` | `true` | Closes after a selectable item without a submenu is clicked. |
| `icon-right` | `false` | Places item icons on the right unless an item overrides it. |

### `<loomi-context-menu-item>`

| Attribute | Default | Description |
| --- | --- | --- |
| `icon` | _(blank)_ | Loomi icon name. |
| `shortcut` | _(blank)_ | Shortcut text shown at the trailing edge. |
| `icon-right` | `false` | Places this item's icon on the right. |
| `header` | `false` | Renders non-selectable section text. |
| `divider` | `false` | Renders a separator line. |
| `hover` | `true` | Enables hover/focus background styling. |

## Methods

| Method | Description |
| --- | --- |
| `showAt(clientX, clientY)` | Opens the menu at viewport coordinates. |
| `hide()` | Closes the menu. |

## Styling hooks

The component understands its own CSS variables and the dropmenu variables where
that keeps visual compatibility useful.

| Variable | Default |
| --- | --- |
| `--loomi-context-menu-z-index` | `var(--loomi-dropmenu-z-index, 1000)` |
| `--loomi-context-menu-min-width` | `var(--loomi-dropmenu-min-width, 13.5rem)` |
| `--loomi-context-menu-hover` | `var(--loomi-dropmenu-hover, ...)` |
| `--loomi-context-menu-submenu-min-width` | `var(--loomi-dropmenu-submenu-min-width, 12rem)` |

## Development

```bash
pnpm --filter @loomidev/context-menu build
pnpm --filter @loomidev/context-menu typecheck
```

## Dependencies

- `@loomidev/core`
- `@loomidev/icons`
