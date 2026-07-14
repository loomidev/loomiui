# @loomidev/resizable

`<loomi-resizable-panel-group>` lays out resizable panels separated by draggable
handles — similar to [shadcn/ui Resizable](https://ui.shadcn.com/docs/components/radix/resizable).

```bash
npm install @loomidev/resizable lit
```

```js
import "@loomidev/resizable";
```

## Basic Usage

```html
<loomi-resizable-panel-group style="height:200px;max-width:24rem;border:1px solid var(--loomi-surface-border);border-radius:0.5rem">
  <loomi-resizable-panel default-size="50%">
    <div style="display:flex;height:100%;align-items:center;justify-content:center">One</div>
  </loomi-resizable-panel>
  <loomi-resizable-handle with-handle></loomi-resizable-handle>
  <loomi-resizable-panel default-size="50%">
    <div style="display:flex;height:100%;align-items:center;justify-content:center">Two</div>
  </loomi-resizable-panel>
</loomi-resizable-panel-group>
```

## Vertical Layout

```html
<loomi-resizable-panel-group orientation="vertical" style="height:200px;max-width:24rem">
  <loomi-resizable-panel default-size="25%">Header</loomi-resizable-panel>
  <loomi-resizable-handle></loomi-resizable-handle>
  <loomi-resizable-panel default-size="75%">Content</loomi-resizable-panel>
</loomi-resizable-panel-group>
```

## Nested Groups

```html
<loomi-resizable-panel-group style="height:200px">
  <loomi-resizable-panel default-size="50%">One</loomi-resizable-panel>
  <loomi-resizable-handle with-handle></loomi-resizable-handle>
  <loomi-resizable-panel default-size="50%">
    <loomi-resizable-panel-group orientation="vertical" style="height:100%">
      <loomi-resizable-panel default-size="25%">Two</loomi-resizable-panel>
      <loomi-resizable-handle with-handle></loomi-resizable-handle>
      <loomi-resizable-panel default-size="75%">Three</loomi-resizable-panel>
    </loomi-resizable-panel-group>
  </loomi-resizable-panel>
</loomi-resizable-panel-group>
```

## Persist Layout

Set `auto-save-id` on a group to store panel sizes in `localStorage`. Provide
`panel-id` on each panel you want persisted.

```html
<loomi-resizable-panel-group auto-save-id="sidebar-layout" style="height:100vh">
  <loomi-resizable-panel panel-id="sidebar" default-size="20" min-size="15" max-size="40">
    Sidebar
  </loomi-resizable-panel>
  <loomi-resizable-handle with-handle></loomi-resizable-handle>
  <loomi-resizable-panel panel-id="main">Main</loomi-resizable-panel>
</loomi-resizable-panel-group>
```

## Events

Listen for `loomi-layout-change` on the group:

```js
group.addEventListener("loomi-layout-change", (event) => {
  console.log(event.detail.sizes, event.detail.layout);
});
```

## Accessibility

loomi-resizable-panel-group is built on semantic markup where the browser gives us the right behavior, and it adds ARIA only where the component has custom interaction. Keyboard users should be able to reach the same controls as pointer users, with visible focus treatment unless you explicitly turn it off on controls that support `show-focus-ring="false"`.

When the component displays status, progress, validation, or temporary feedback, pair it with clear labels or nearby text in your app so assistive technology users get the same context a sighted user gets from the visual treatment.

- Supports keyboard focus with visible `:focus-visible` styling on interactive controls.

## Responsive behavior

loomi-resizable-panel-group is designed to fit the layout you place it in. It uses fluid widths, `min-width: 0`, wrapping, truncation, or stacked layouts where that keeps the component usable in cards, forms, sidebars, and mobile screens.

For dense layouts, give the parent container an intentional width and let the component fill it. For long labels or user-provided content, prefer real text that can wrap or truncate instead of fixed pixel assumptions.

## Dark mode

loomi-resizable-panel-group uses Loomi semantic tokens such as `--loomi-surface`, `--loomi-surface-border`, `--loomi-text`, and palette accent tokens instead of hard-coded light colors. Borders, panels, hover states, and muted text are expected to shift with the active theme.

Add `.dark` to your app root with `@loomidev/theme-switcher`, or provide your own token overrides, and the component will inherit the dark-mode values through its shadow DOM.

- Respects `.dark` on `<html>` via `@loomidev/theme-switcher` or your app theme.

## Attributes

### `<loomi-resizable-panel-group>`

| Attribute      | Default      | Description                       |
| -------------- | ------------ | --------------------------------- |
| `orientation`  | `horizontal` | `horizontal` or `vertical`.       |
| `auto-save-id` | _(blank)_    | Persist layout in `localStorage`. |

### `<loomi-resizable-panel>`

| Attribute        | Default        | Description                               |
| ---------------- | -------------- | ----------------------------------------- |
| `default-size`   | _(even split)_ | Initial size (`50` or `50%`).             |
| `min-size`       | `0`            | Minimum size percentage.                  |
| `max-size`       | `100`          | Maximum size percentage.                  |
| `collapsible`    | `false`        | Double-click adjacent handle to collapse. |
| `collapsed-size` | `0`            | Size when collapsed.                      |
| `collapsed`      | `false`        | Collapse state.                           |
| `panel-id`       | _(blank)_      | Id for layout events and persistence.     |

### `<loomi-resizable-handle>`

| Attribute     | Default | Description               |
| ------------- | ------- | ------------------------- |
| `with-handle` | `false` | Show a visible grip icon. |
| `disabled`    | `false` | Disable dragging.         |

**Keyboard:** focus a handle and use arrow keys (hold Shift for larger steps).

## Dependencies

- `@loomidev/core`
