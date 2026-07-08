---
"@loomidev/theme": patch
---

Changed the default `warning` palette ramp from Tailwind's `orange` to `amber`. The
previous default sat only ~14° apart in hue from `error`'s `red` ramp at a similar
lightness/chroma, making the two easy to mix up at a glance (and especially hard to
tell apart for red-green colorblind users). `amber` (~58° hue) reads as a conventional
"caution" color and is clearly distinct from `error` in every component that uses
`color="warning"`. Purely a default-value change — the `--loomi-warning-*` token names
are unchanged, so any app that already overrides them is unaffected.
