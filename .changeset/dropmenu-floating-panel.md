---
"@loomidev/dropmenu": minor
"@loomidev/split-button": patch
"@loomidev/core": minor
"@loomidev/components": patch
---

`<loomi-dropmenu>`'s panel is no longer clipped by an ancestor's `overflow`. It was
`position: absolute` inside its own host, so a menu opened from a row near the bottom of a
scrolling table was cut off or invisible, with no way to scroll it back — which is why
row-level action menus had to be hand-rolled with a panel teleported to `<body>`. The
panel is now promoted to the top layer with the popover API and positioned against the
viewport with core's `positionFloatingPanel()`, the same mechanism `<loomi-split-button>`
uses. Browsers without popover support fall back to plain `position: fixed`.

Two behavior changes come with it. The panel now flips above the trigger when there isn't
room below (the arrow moves to its underside to keep pointing at the trigger, and the
entrance animation rises instead of dropping), and `placement` is now a preference rather
than a guarantee: a panel that would leave the viewport still swaps its alignment. The
existing `auto`/`left`/`right` values are unchanged in meaning — `left`/`right` still pick
which edge of the panel lines up with the trigger — and `placement` additionally accepts
the shared `bottom-start`/`bottom-end`/`top-start`/`top-end` names the library's other
floating panels use, which also choose the side the panel opens on.

`<loomi-dropmenu>` also gains `show()`, `hide()`, an `isOpen` getter, and
`focus()`/`blur()` that forward to the trigger. The trigger is a `<button>` in the shadow
root, so the inherited `focus()` was a silent no-op — leaving a consumer no way to hand
focus back to a row's menu button, which is the other reason row menus were being
hand-rolled.

The panel is exposed as the `menu` part. `--loomi-dropmenu-arrow-inset` now means the
closest the arrow may come to either corner: the arrow is aimed at the trigger's center
wherever the panel lands, rather than being inset from a fixed edge.

`@loomidev/core` exports `supportsPopover(el)` alongside `positionFloatingPanel()`, and
`<loomi-split-button>` drops its private copy of the flip-and-shift maths for the shared
helper so the two can't drift. Its panel now also publishes `--loomi-anchor-width`
(previously `--loomi-split-anchor-width`) and rises rather than drops when it flips above.
