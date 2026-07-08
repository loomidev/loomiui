---
"@loomidev/button": minor
---

Added `gray` to `<loomi-button>`'s supported `color` values. It was missing from the
button's closed color list even though it's one of the 6 official LoomiUI palette
colors (and already fully supported by every other component via `LoomiColor`), so
`color="gray"` silently fell back to the `primary` palette instead of rendering gray.
