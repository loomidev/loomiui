---
"@loomidev/core": minor
"@loomidev/datepicker": patch
"@loomidev/timepicker": patch
"@loomidev/select": patch
"@loomidev/timezonepicker": patch
"@loomidev/countries": patch
"@loomidev/tag-input": patch
---

Visual fix: `<loomi-datepicker>` and `<loomi-timepicker>` labels now float onto the field's top border like `<loomi-input>` and `<loomi-select>`, and `label-position="inside"` lines up across every form control. `label-position="inside"` no longer reserves label space when `label` is empty, and an empty `<loomi-tag-input>` now matches the other controls' height. `@loomidev/core` adds `fieldLabelStyles`.
