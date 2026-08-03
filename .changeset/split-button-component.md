---
"@loomidev/split-button": minor
"@loomidev/button": minor
"@loomidev/components": patch
---

Added `<loomi-split-button>` — a primary action joined to a caret that opens a menu of
related actions ("Create course ▾" → Import courses, Course templates). This pattern
previously had to be hand-assembled from a button plus a `<loomi-dropmenu>`, which ran
into four problems the component now handles.

The menu panel is promoted to the **top layer** with the popover API, so it is never
clipped by an ancestor's `overflow` — `<loomi-dropmenu>`'s panel is `position: absolute`
inside its own host, which rules it out for row-level menus in scrolling tables and card
headers. Without popover support the panel falls back to plain `position: fixed`.

Both halves are real `<loomi-button>`s (so `type`, `color`, `size`, `radius`, `outline`,
`icon`, `disabled`, `tag`/`href`, `can-submit` and `has-spinner` behave exactly as they do
on a plain button, and the halves can't drift apart), and menu rows are
`<loomi-dropmenu-item>`s. `<loomi-dropmenu>` couldn't be composed this way because its
trigger slot sits inside its own `<button>`, so slotting a button nested one inside
another. Parts are exposed for every piece — `split`, `primary`, `primary-button`,
`divider`, `caret`, `caret-button`, `panel` — rather than requiring consumers to drive
custom properties and give up on the pieces those can't reach.

The caret carries `aria-haspopup="menu"` and `aria-expanded` on its real `<button>`, takes
its accessible name from `menu-label`, and supports the standard menu-button keyboard
pattern (`ArrowDown` opens and focuses the first item, arrows/Home/End move, `Escape`
closes and restores focus to the caret, `Tab` closes without trapping). Activating the
primary half never opens the menu.

`@loomidev/button` gains a public `controlElement` getter plus `focus()`/`blur()` overrides
that forward to the inner `<button>`/`<a>`. The host element isn't focusable itself, so the
inherited `focus()` was a silent no-op — which broke any consumer needing to return focus
to a button, such as a menu restoring focus to its trigger.
