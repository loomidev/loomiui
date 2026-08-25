---
"@loomidev/core": minor
"@loomidev/chat": minor
"@loomidev/command-palette": minor
"@loomidev/data-grid": minor
"@loomidev/filter-builder": minor
"@loomidev/video": minor
---

Make the last five components with hardcoded English translatable. `<loomi-chat-window>`,
`<loomi-command-palette>`, `<loomi-data-grid>`, `<loomi-filter-builder>` and `<loomi-video>`
each gain a `locale` property and route their own copy through the translation table, with
new `en` keys for all of it.

The gap was worst for text a consumer could not reach: `aria-label` values baked into
templates were fixed English with no way to override them, which left screen reader users
of a non-English page hearing "Select all rows" and "Search commands" regardless of the
locale. Visible defaults (`emptyTitle`, `placeholder`, `addLabel`, …) now resolve through
`loomiDefaultText`, so they translate while still yielding to any value a consumer sets.
