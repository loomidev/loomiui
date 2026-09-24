---
"@loomidev/button": minor
---

Remove `border-width="4"` and `border-width="8"` from `<loomi-button>`; only `1` (default) and `2` remain, and other values fall back to `1`. `outline` is now documented as primary-only: a `secondary` button is already an outline, so `type="secondary" outline` is redundant.
