---
"@loomidev/calendar": minor
"@loomidev/checkbox": minor
"@loomidev/colorpicker": minor
"@loomidev/datepicker": minor
"@loomidev/drawer": minor
"@loomidev/filepicker": minor
"@loomidev/modal": minor
"@loomidev/radio": minor
"@loomidev/rating": minor
"@loomidev/slider": minor
"@loomidev/sortable": minor
"@loomidev/tag": minor
"@loomidev/timepicker": minor
"@loomidev/toggle": minor
"@loomidev/react": patch
---

Export a typed `EventMap` (and named detail interfaces) from fourteen more component
packages. `@loomidev/react` derives each `on*` callback's type from these, so events on
these components now carry a typed `detail` instead of falling back to `any`.
