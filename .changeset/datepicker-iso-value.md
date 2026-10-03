---
"@loomidev/datepicker": minor
---

**Breaking:** `<loomi-datepicker>`'s `value`, its `change` `detail.value` and the form value submitted under `name` are now always ISO `yyyy-mm-dd` (range: `yyyy-mm-dd - yyyy-mm-dd`), like a native `<input type="date">`, whatever `format` displays. The formatted text is available as the new read-only `displayValue`. Setting `value` still accepts ISO or the configured numeric `format`.
