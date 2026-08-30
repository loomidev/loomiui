---
"@loomidev/datepicker": minor
"@loomidev/otp": minor
"@loomidev/tag-input": minor
---

Give the remaining components with custom key handling the keyboard behavior their
patterns call for.

`<loomi-datepicker>`'s month was 31 individually tab-focusable buttons and no arrow keys,
so reaching a date meant tabbing through the month and leaving meant tabbing past the rest
of it. The grid now follows the WAI-ARIA date-grid pattern: `role="grid"` with
`columnheader` and `gridcell` semantics, a single roving tab stop that starts on the
selected day, arrows moving by day and week, `Home`/`End` for the ends of the week,
`PageUp`/`PageDown` for months, and arrowing off either end scrolling into the neighbouring
month. Each day also carries its full date as an accessible name — "10" alone means nothing
read aloud — and the selected day is marked `aria-selected`. `<loomi-date-range-picker>`
composes this calendar, so it inherits all of it.

`<loomi-otp>` only moved backwards, on Backspace into an empty box. Left and right arrows
now walk between boxes and `Home`/`End` jump to the ends, so correcting an earlier digit no
longer means the mouse or clearing everything after it.

`<loomi-tag-input>`'s suggestion list had `role="listbox"` and arrow keys but no
`aria-activedescendant`: focus stays in the text field, so the highlighted suggestion was
announced to nobody. The field is now a `role="combobox"` wired to the listbox, and the
suggestions carry ids.
