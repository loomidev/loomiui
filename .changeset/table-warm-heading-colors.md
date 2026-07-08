---
"@loomidev/table": patch
"@loomidev/data-grid": patch
---

Update `<loomi-table>` and `<loomi-data-grid>` header background and row-divider colors to a warmer cream/tan tone in light mode (overridable via `--loomi-table-heading-bg`/`--loomi-table-divider` and `--loomi-data-grid-heading-bg`/`--loomi-data-grid-divider`). Dark mode is unaffected — it still falls back to the standard surface tokens.

Also updates the card drop shadow to a subtler, closer-in style matching the same reference design: tightened on `<loomi-table>`'s `has-shadow` shell, and newly added to `<loomi-data-grid>`'s shell (which previously had none).
