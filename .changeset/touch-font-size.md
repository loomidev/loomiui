---
"@loomidev/core": minor
"@loomidev/textarea": minor
"@loomidev/otp": minor
"@loomidev/datepicker": minor
"@loomidev/creditcard": minor
"@loomidev/emoji-picker": minor
"@loomidev/filter-builder": minor
"@loomidev/command-palette": minor
"@loomidev/chat": minor
"@loomidev/text-editor": minor
"@loomidev/data-grid": minor
---

On touch devices (`pointer: coarse`), form controls now render their text at 16px or more, so iOS Safari no longer zooms the page when a field takes focus. This covers every sized field (input, number, password, select, autocomplete, tag-input, datepicker, timepicker, countries, timezonepicker), the select, countries, timezone and emoji search boxes, textarea, otp, creditcard, filter-builder, command-palette, the chat composer, the text-editor surface and the data-grid's inputs and page-size select. Desktop sizes are unchanged. Pages can move the floor with `--loomi-control-touch-font-size` (default `1rem`). `<loomi-datepicker>` gains an `input` part for the displayed date.
