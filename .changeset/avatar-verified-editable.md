---
"@loomidev/avatar": minor
"@loomidev/filepicker": minor
---

Add `verified` (a primary-colored check-badge corner badge) and `editable` (click-to-replace with a crop dialog, swapping the image and firing a `change` event) to `<loomi-avatar>`. `editable` is built on a new `stealth` mode in `<loomi-filepicker>`, which hides the drop-zone/file list and is driven imperatively via new `open()`/`clear()` methods — useful for wiring file pick-and-crop flows to any custom trigger element.
