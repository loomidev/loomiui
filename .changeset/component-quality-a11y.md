---
"@loomidev/card": patch
"@loomidev/empty-state": patch
"@loomidev/horizontal-line-graph": patch
"@loomidev/listview": patch
---

Improve accessibility for interactive and status components:

- `<loomi-card>`: keyboard activation and `:focus-visible` styling when `url` is set
- `<loomi-empty-state>`: `role="status"` with polite live region and labelled heading wiring
- `<loomi-listview>`: list semantics for grouped rows
- `<loomi-horizontal-line-graph>`: descriptive `aria-label` on the SVG root
