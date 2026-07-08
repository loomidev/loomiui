---
"@loomidev/table": patch
"@loomidev/data-grid": patch
---

Fixed `<loomi-table>` and `<loomi-data-grid>`'s dark-mode heading/divider colors never
actually applying. Both used `:host-context(.dark)` to swap in dark-aware tokens, but
that selector has no Firefox support and isn't recognized by the build's CSS optimizer
either, so the override silently never took effect in any browser. Both components now
watch `.dark` on `<html>` in JS (via `watchDarkMode()` from `@loomidev/core`) and reflect
it as an `.is-dark` class on themselves instead, matching the pattern `<loomi-button>`
already uses.
