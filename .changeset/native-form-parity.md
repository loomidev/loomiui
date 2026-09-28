---
"@loomidev/autocomplete": minor
"@loomidev/checkbox": minor
"@loomidev/checkcards": minor
"@loomidev/core": minor
"@loomidev/datepicker": minor
"@loomidev/filepicker": minor
"@loomidev/input": minor
"@loomidev/number": minor
"@loomidev/otp": minor
"@loomidev/password": minor
"@loomidev/radio": minor
"@loomidev/react": minor
"@loomidev/select": minor
"@loomidev/slider": minor
"@loomidev/tag-input": minor
"@loomidev/text-editor": minor
"@loomidev/textarea": minor
"@loomidev/timepicker": minor
"@loomidev/toggle": minor
---

Form controls now follow the native value-and-events contract (documented in `@loomidev/core`'s README), so framework two-way bindings work on the tags directly.

- `<loomi-select>` gains a settable `value` (comma-joined when `multiple`) and `values` (`string[]`), and fires `input` before `change` on every pick. Typing in its search box no longer fires `input` on the host, and a pick survives a later `data` swap.
- `<loomi-checkbox>` and `<loomi-toggle>` expose a read-only `type` of `"checkbox"`, `<loomi-radio>` one of `"radio"`. All three fire `input` (with `checked` already updated) before `change`. Setting a radio's `checked` unchecks the rest of its group, as a native radio does.
- `<loomi-otp>` gains a settable `value` and now fires `input` on each edit and `change` when focus leaves the boxes. Moving it in the DOM no longer clears the code.
- `<loomi-datepicker>`, `<loomi-timepicker>` and `<loomi-slider>` turn their read-only `value` into a settable one. `<loomi-checkcards>` gains `value`/`values`. `<loomi-filepicker>` gains a native-style `value` (set `""` to clear). Each now fires `input` before `change` on user edits. The timepicker and checkcards honor `selected-value` changes after the first render, and the timepicker converts between 12- and 24-hour input.
- `<loomi-input>`, `<loomi-password>`, `<loomi-textarea>`, `<loomi-number>`, `<loomi-autocomplete>`, `<loomi-tag-input>`, `<loomi-text-editor>` and `<loomi-slider>` fire exactly one `input` per edit (the inner field's native event used to leak through as a second one). Text fields re-sync when a listener rewrites `value` mid-edit.
- `<loomi-text-editor>` fires `change` only when focus leaves after an edit, not on every blur. `<loomi-number>` no longer fires an extra `input` on commit unless the commit clamped the number. `<loomi-autocomplete>` commits typed free text with `change` on leaving the field. `<loomi-timepicker>` no longer fires `change` for a pick that leaves the time unchanged.
- `@loomidev/react` wrappers gain `onInput` where the controls newly declare `input`.
