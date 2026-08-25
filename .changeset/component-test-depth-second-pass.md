---
"@loomidev/calendar": patch
---

Deepen tests across the packages that still carried a single smoke test. `calendar` covers
view switching, event rendering and re-rendering, locale-driven weekday headings and week
start; `date-range-picker` covers open/close, presets and range reflection; `checkcards`
covers selection limits and form submission; `filter-builder` covers adding, removing and
emitting; plus keyboard coverage for the components changed alongside.

Writing them pinned down three defaults that are easy to get wrong from the outside:
`<loomi-calendar>` hides weekends unless asked, `<loomi-date-range-picker>` shows presets
unless asked not to, and `<loomi-otp>` sizes itself from `total-digits` rather than
`digits`.
