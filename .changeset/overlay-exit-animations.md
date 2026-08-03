---
"@loomidev/core": minor
"@loomidev/dropmenu": minor
"@loomidev/modal": minor
"@loomidev/split-button": minor
"@loomidev/context-menu": minor
"@loomidev/components": patch
---

Overlays now animate *out* as well as in. They already faded and rose into view, then
vanished instantly — an entrance with no exit reads as no animation at all.

`@loomidev/core` gains the reverse keyframes (`loomi-fade-out`, `loomi-drop-out`,
`loomi-rise-out`) alongside the existing entrances, and `onExitAnimationEnd(el, done)`,
which keeps an element rendered — and, for a popover, still in the top layer — until its
exit has played. It is backed by a timer, so `done` always fires even if the element ends
up with no animation, and it returns a cancel function so an overlay reopened mid-close
drops the pending exit instead of hiding itself a moment later.

`<loomi-dropmenu>` (panel and submenus), `<loomi-modal>` (backdrop and dialog),
`<loomi-split-button>` and `<loomi-context-menu>`'s submenus all use it. Panels play the
reverse of whichever entrance they used, so one that flipped above its trigger sinks back
down rather than rising away from it, and a closing panel stops taking pointer events so a
click can't land on something that is leaving.

Everything observable is still released synchronously when the close is requested — `open`
/ `isOpen`, the `close` event, focus restoration, the scroll lock, and every listener — so
only the visuals wait. Two consequences worth knowing when asserting on the DOM straight
after a close: the panel keeps its `open` class (plus a new `closing` class) until the
animation ends, and `<loomi-modal>` returns to its original DOM position when the exit
finishes rather than immediately, since moving a node cancels the animation running on it.
Setting `modal.open = false` directly still closes instantly; `hide()` is what animates.
