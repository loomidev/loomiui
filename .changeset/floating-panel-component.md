---
"@loomidev/floating-panel": minor
"@loomidev/components": minor
---

Add `<loomi-floating-panel>`, a draggable, resizable panel that floats above the page — opened/closed by `name` via `showLoomiFloatingPanel()`/`hideLoomiFloatingPanel()`. Drag by the header or eight edge/corner resize handles (mouse or arrow keys), `bounded` viewport clamping, automatic bring-to-front stacking across multiple open panels, optional `auto-save-id` position/size persistence via `localStorage`, and non-modal `role="dialog"` semantics with focus-scoped Escape-to-close. Also adds `minimize`/`maximize` header buttons (collapse to title bar / fill the viewport, with a header double-click shortcut for maximize), and `drag-handle` to restrict dragging to a dedicated grip icon instead of the whole header.
