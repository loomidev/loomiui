---
"@loomidev/alert": patch
---

Fixed `<loomi-alert>`'s leading icon/avatar and close button vertically centering
against the message instead of aligning to the top. This was barely noticeable on a
single-line message but looked clearly wrong once the message wrapped to two or more
lines, with both floating in the middle of the block instead of sitting level with the
first line.
