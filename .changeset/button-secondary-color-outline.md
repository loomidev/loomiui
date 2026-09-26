---
"@loomidev/button": patch
---

`type="secondary"` with a `color` now stays an outline: surface fill with the palette's border and text, the same hover and focus as `outline color="…"`, instead of switching to a solid fill. Plain `type="secondary"` is unchanged. `info` and `gray` outlines also get their palette border and hover (they previously fell back to the default border). `<loomi-split-button type="secondary" color="…">` picks this up too.
