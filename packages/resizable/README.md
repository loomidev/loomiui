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

For the library-wide baseline, see [Foundations — Accessibility](https://loomiui.com/foundations/#accessibility).

## Responsive behavior

For the shared container and viewport rules, see [Foundations — Responsive behavior](https://loomiui.com/foundations/#responsive-behavior).

## Dark mode

For theme activation, token overrides, and contrast guidance, see [Foundations — Dark mode](https://loomiui.com/foundations/#dark-mode).

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
