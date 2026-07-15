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

For the library-wide baseline, see [Foundations — Accessibility](https://loomiui.com/foundations/#accessibility).

## Responsive behavior

For the shared container and viewport rules, see [Foundations — Responsive behavior](https://loomiui.com/foundations/#responsive-behavior).

## Dark mode

For theme activation, token overrides, and contrast guidance, see [Foundations — Dark mode](https://loomiui.com/foundations/#dark-mode).

## Attributes

### `<loomi-context-menu>`

| Attribute          | Default | Description                                                        |
| ------------------ | ------- | ------------------------------------------------------------------ |
| `disabled`         | `false` | Prevents opening the menu.                                         |
| `divided`          | `false` | Adds dividers between direct child items.                          |
| `placement`        | `auto`  | Horizontal alignment from the pointer: `auto`, `left`, or `right`. |
| `scrollable`       | `false` | Constrains the menu height and scrolls its contents.               |
| `height`           | `200`   | Scrollable menu height in pixels.                                  |
| `hide-after-click` | `true`  | Closes after a selectable item without a submenu is clicked.       |
| `icon-right`       | `false` | Places item icons on the right unless an item overrides it.        |

### `<loomi-context-menu-item>`

| Attribute    | Default   | Description                               |
| ------------ | --------- | ----------------------------------------- |
| `icon`       | _(blank)_ | Loomi icon name.                          |
| `shortcut`   | _(blank)_ | Shortcut text shown at the trailing edge. |
| `icon-right` | `false`   | Places this item's icon on the right.     |
| `header`     | `false`   | Renders non-selectable section text.      |
| `divider`    | `false`   | Renders a separator line.                 |
| `hover`      | `true`    | Enables hover/focus background styling.   |

## Methods

| Method                     | Description                             |
| -------------------------- | --------------------------------------- |
| `showAt(clientX, clientY)` | Opens the menu at viewport coordinates. |
| `hide()`                   | Closes the menu.                        |

## Styling hooks

The component understands its own CSS variables and the dropmenu variables where
that keeps visual compatibility useful.

| Variable                                 | Default                                          |
| ---------------------------------------- | ------------------------------------------------ |
| `--loomi-context-menu-z-index`           | `var(--loomi-dropmenu-z-index, 1000)`            |
| `--loomi-context-menu-min-width`         | `var(--loomi-dropmenu-min-width, 13.5rem)`       |
| `--loomi-context-menu-hover`             | `var(--loomi-dropmenu-hover, ...)`               |
| `--loomi-context-menu-submenu-min-width` | `var(--loomi-dropmenu-submenu-min-width, 12rem)` |

## Development

```bash
pnpm --filter @loomidev/context-menu build
pnpm --filter @loomidev/context-menu typecheck
```

## Dependencies

- `@loomidev/core`
- `@loomidev/icons`
