---
"@loomidev/countries": patch
"@loomidev/timezonepicker": patch
"@loomidev/datepicker": patch
"@loomidev/timepicker": patch
"@loomidev/colorpicker": patch
"@loomidev/autocomplete": patch
"@loomidev/tag-input": patch
"@loomidev/password": patch
"@loomidev/popover": patch
"@loomidev/chart": patch
---

Dropdown panels now open in the top layer, so opening one inside a modal (or any `overflow` container) no longer makes that container scroll or clips the panel. Panels flip above their field when there isn't room below and follow it when an ancestor scrolls; the popover also keeps its arrow on the trigger when shifted to stay on screen.
