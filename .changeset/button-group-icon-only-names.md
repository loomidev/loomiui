---
"@loomidev/button-group": patch
---

Icon-only and circle items now always carry an `aria-label` on their inner button. The item read `icon-only`/`circle` from its direct parent's properties, so when the group hadn't upgraded yet, or a wrapper sat between the two, the label was hidden with no `aria-label` in its place (axe `button-name`). It now follows the enclosing group's attributes, the same source the stylesheet uses to hide the label.
