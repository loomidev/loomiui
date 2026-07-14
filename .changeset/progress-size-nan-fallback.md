---
"@loomidev/progress": patch
---

Fixed `<loomi-progress-circle>`/`<loomi-progress-bar>` rendering with a `NaN` pixel size
when given an unrecognized `size` value. The fallback chain `SIZES[size] ?? Number(size) ??
120` never reached `120`, because `Number(size)` returns `NaN` (not nullish) for
non-numeric input, so the `?? 120` branch was dead. It now falls back to the default 120
via `Number(size) || 120`.
