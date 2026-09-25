---
"@loomidev/select": minor
---

The trigger button is now named for assistive technology: by its `label` plus the current value (the label alone while only the placeholder shows), and the options listbox by the label. A select with no `label` can be named with a new `aria-label` attribute, forwarded from the host to the trigger and listbox. Fixes the axe `button-name` violation on placeholder-only selects.
