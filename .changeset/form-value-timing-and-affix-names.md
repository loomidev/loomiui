---
"@loomidev/core": minor
"@loomidev/input": minor
---

- Form controls now update their form value before firing `input` and `change`, so `new FormData(form)` or `form.requestSubmit()` inside a listener sees the new value. Before, `loomi-number`'s stepper, `loomi-input`, `loomi-textarea`, `loomi-checkbox` and `loomi-toggle` (among others) reported the previous value until the next microtask. The fix lives in `LoomiElement`, so it covers every control.
- `loomi-input` takes `prefix-name` / `suffix-name` to submit the selected dropdown affix with the form, and `prefix-options` / `suffix-options` accept `{ value, label }` pairs (or a value-to-label object) so an id can be submitted while a label is shown.
