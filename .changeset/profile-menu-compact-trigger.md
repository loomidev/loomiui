---
"@loomidev/profile-menu": minor
---

Add a `compact` attribute that reduces the trigger to avatar + chevron (`compact="auto"` does so only below a 40rem viewport), so the menu fits phone-width headers without pushing the page wider. The name and description stay available to screen readers. The trigger's minimum width is now overridable with `--loomi-profile-menu-min-width` (set `0` to let it shrink and truncate the name in a constrained container), and its pieces are exposed as parts: `trigger`, `avatar`, `copy`, `name`, `description`, `chevron`.
