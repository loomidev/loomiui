---
"@loomidev/data-grid": minor
---

Add `inlineEditingModule({ mode: "always" })`: editable cells render their input permanently, Enter/ArrowDown/ArrowUp move between rows, and pasting multi-line or tab-separated text fills the cells below. New public `grid.focusCell(rowIndex, columnKey)` waits for render before focusing.
