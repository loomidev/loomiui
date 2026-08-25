---
"@loomidev/dropmenu": patch
"@loomidev/profile-menu": patch
---

Make the dropmenu arrow readable. At 6px it was a barely-visible nub — the triangle is
filled with the panel's own surface color, so all that distinguishes it is a 1px sliver of
`--loomi-surface-border`, and at that size the sliver reads as a bump rather than a
pointer. `--loomi-dropmenu-arrow-size` is now 9px, keeping the same panel-matched colors.

Most obvious under `<loomi-profile-menu>`, whose trigger is a full card, but the arrow was
equally faint on every dropmenu — so this moves the shared default rather than overriding
it in one component. `--loomi-dropmenu-arrow-size` is still yours to override per instance.

profile-menu's `--loomi-dropmenu-arrow-inset` is recomputed to 0.6875rem, since it is
derived from half the arrow's width.
