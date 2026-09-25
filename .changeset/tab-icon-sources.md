---
"@loomidev/tab": minor
---

`<loomi-tab>` gains `icon-source` (`heroicons` | `iconsax` | `untitledui`, default `heroicons`) and `icon-variant` (`outline` | `solid` | `twotone`). Heading icons now render through `<loomi-icon>`, so the disk-based iconsax and untitledui sets load on first use with no consumer-side registration, filled sets keep their own fills instead of inheriting heroicon stroke styling, and every source matches in size and colour across active and hover states. Each heading icon is exposed as `part="tab-icon"`. Adds a dependency on `@loomidev/icon`.
