---
"@loomidev/sortable": minor
"@loomidev/core": patch
---

`<loomi-sortable>` rows can now be your own light-DOM markup: direct children with a `data-id`. Buttons, links, badges and rich content inside a row keep working and keep page styles. With `has-handle`, only the handle starts a drag; without one, drags starting on interactive elements are ignored. Rows reorder with mouse, touch (via the handle) and keyboard (Alt+Arrow, or Space to pick up / move / drop), announced through a live region, and `loomi-reorder` reports the data-ids. The DOM is never reordered, so treat the event as the source of truth. `items` keeps working.
