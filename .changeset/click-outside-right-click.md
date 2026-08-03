---
"@loomidev/core": minor
"@loomidev/context-menu": patch
"@loomidev/components": patch
---

`onClickOutside()` now closes on a right-click outside as well as a left-click. It only
watched `click`, so right-clicking elsewhere left an open dropmenu, select, popover,
picker or drawer sitting there — under the browser's own context menu, or under whatever
menu the right-click opened — which reads as a stuck panel. Every component built on the
helper inherits the fix.

`<loomi-context-menu>` had been carrying its own document-level `contextmenu` listener to
work around this; it now relies on the shared helper instead.
