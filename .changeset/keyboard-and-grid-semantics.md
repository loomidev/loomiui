---
"@loomidev/command-palette": minor
"@loomidev/context-menu": minor
"@loomidev/data-grid": minor
---

Bring the three components with bespoke keyboard interaction in line with the WAI-ARIA
Authoring Practices.

`<loomi-command-palette>` announced nothing as you arrowed through results: focus stays in
the search field, so the highlighted option needs `aria-activedescendant`, which was
absent. The field is now a `role="combobox"` wired to the listbox, options carry ids and
sit outside the tab order, `Home`/`End` jump to the first and last enabled commands, `Tab`
no longer escapes a dialog marked `aria-modal="true"`, and closing hands focus back to
wherever it came from.

`<loomi-context-menu>` supports `ArrowRight` to open a submenu and `ArrowLeft` to close it.
Submenus were previously reachable by pointer only.

`<loomi-data-grid>` marks its table `role="grid"` — arrow-key cell navigation makes it an
interactive grid rather than a static table, and the two are announced differently.
Sortable headers now expose `aria-sort` instead of conveying direction through a ▲/▼ glyph
alone (that glyph is now `aria-hidden`), and selectable rows carry `aria-selected`.
