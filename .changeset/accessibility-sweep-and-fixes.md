---
"@loomidev/theme": minor
"@loomidev/button": minor
"@loomidev/context-menu": minor
"@loomidev/progress": minor
"@loomidev/chat": minor
"@loomidev/autocomplete": patch
"@loomidev/calendar": patch
"@loomidev/colorpicker": patch
"@loomidev/core": patch
"@loomidev/filepicker": patch
"@loomidev/pagination": patch
"@loomidev/resizable": patch
---

Fix accessibility defects found by a new library-wide axe sweep, and retune the theme's
text tokens so every tier meets WCAG AA contrast on both the light and dark surface —
`--loomi-text-muted` and `--loomi-text-faint` each shift one step (darker in light mode,
lighter in dark), which is visible wherever muted copy and placeholders are rendered.

`<loomi-button>` now forwards an `aria-label` written on the host to the inner control,
so icon-only buttons can be named the way consumers already expect. `<loomi-progress-bar>`
and `<loomi-progress-circle>` gain `label`, `<loomi-context-menu>` gains `label` for
triggers whose slotted content is not text, and `<loomi-chat-window>` gains `locale`.

Also fixed: `<loomi-autocomplete>` marks its input `role="combobox"` (`aria-expanded` was
not permitted without it), `<loomi-context-menu>`'s target carries a button role,
`<loomi-resizable-handle>` reports `aria-valuenow`, and the previously unnamed controls in
`<loomi-pagination>`, `<loomi-colorpicker>`, `<loomi-filepicker>` and `<loomi-chat-window>`
now have accessible names.
