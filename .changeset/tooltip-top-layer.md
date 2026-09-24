---
"@loomidev/tooltip": minor
---

The tip now renders in the top layer, so it no longer adds a horizontal scrollbar to a table (or any `overflow` container) when used in the last column. It flips to the opposite side and shifts along the viewport edge when it would otherwise run off screen, keeping its arrow on the trigger. Escape dismisses it, and new `show()`/`hide()` methods open and close it programmatically.
