---
"@loomidev/data-grid": minor
---

Columns can now configure their always-open input: `inputType`, `inputMode`, `placeholder` and `autocomplete`, plus `invalid(row)` (sets `aria-invalid` and an invalid look) and `cellClass(row)` callbacks. The input is exposed as the `cell-input` part (and `cell-input-invalid`), with `--loomi-data-grid-invalid-color` / `--loomi-data-grid-invalid-bg` to restyle the invalid state.
