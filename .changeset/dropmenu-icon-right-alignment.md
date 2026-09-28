---
"@loomidev/dropmenu": patch
---

`icon-right` no longer misaligns mixed menus. Items without an `icon` used to push their label to the right edge while items with one kept theirs on the left; now every label starts at the same edge and right-side icons line up in one column at the end of the row. The checkbox/radio indicator stays at the start, and shortcuts and the submenu chevron stay at the end. The layout mirrors under `dir="rtl"`.
