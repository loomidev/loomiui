---
"@loomidev/core": minor
"@loomidev/input": patch
"@loomidev/password": patch
"@loomidev/textarea": patch
"@loomidev/number": patch
"@loomidev/autocomplete": patch
"@loomidev/tag-input": patch
"@loomidev/text-editor": patch
---

Form controls coerce an assigned `value` to a string like native inputs (`7` → `"7"`, `null`/`undefined` → `""`). `<loomi-input numeric>` used to throw `e.replace is not a function` and stop rendering when given a number. `<loomi-input>` also keeps rendering with the raw value, and logs a warning, if normalising it throws (e.g. a custom `dynamicMask`). `@loomidev/core` exports the shared `toControlValue()` helper.
