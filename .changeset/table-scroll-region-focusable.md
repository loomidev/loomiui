---
"@loomidev/table": minor
"@loomidev/core": patch
---

A table wider than its container now makes its scroll box a focusable, labelled `role="region"` with a visible focus ring, so keyboard users can reach it and scroll with the arrow keys (axe `scrollable-region-focusable`). It reverts to a plain box once the table fits. Name it with the new `aria-label` attribute, else the host `title`, else the localized "Scrollable table" (new `table.scrollRegion` key in core's locales). The scroll box is exposed as `part="scroll"`.
