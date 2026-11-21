---
"@loomidev/core": minor
"@loomidev/card": minor
"@loomidev/contact-card": minor
"@loomidev/statistic": minor
"@loomidev/select": minor
"@loomidev/checkcards": minor
"@loomidev/tag": minor
"@loomidev/autocomplete": minor
"@loomidev/checkbox": minor
"@loomidev/colorpicker": minor
"@loomidev/countries": minor
"@loomidev/datepicker": minor
"@loomidev/emoji-picker": minor
"@loomidev/otp": minor
"@loomidev/radio": minor
"@loomidev/rating": minor
"@loomidev/slider": minor
"@loomidev/tag-input": minor
"@loomidev/text-editor": minor
"@loomidev/toggle": minor
"@loomidev/timepicker": minor
"@loomidev/timezonepicker": minor
"@loomidev/input": minor
"@loomidev/password": minor
"@loomidev/textarea": minor
"@loomidev/number": minor
"@loomidev/filepicker": minor
---

- **Security:** `loomi-card` and `loomi-contact-card` no longer run a `url` ending in `)` as JavaScript. Breaking if you relied on it: listen for `click` instead.
- `loomi-card`, `loomi-contact-card` and `loomi-statistic` render `url` as a real `<a href>` (with a new `target`), and select's `empty-action-url` is a real link. They can be opened in a new tab and work without JavaScript. `loomi-contact-card` no longer navigates twice.
- A disabled `<fieldset>` now disables every LoomiUI form control inside it.
- Back/forward navigation and browser autofill now restore LoomiUI field values.
- `loomi-select multiple`, `loomi-checkcards` (when `max` isn't 1) and `loomi-tags` submit one form entry per value, like a native `<select multiple>`, instead of one comma-joined value. Breaking for servers that split the comma string: read the repeated entries (or name the field `tags[]` in PHP/Laravel).
- Every form control now takes `error` for a server-supplied message. New in core: `LoomiFieldErrorController`, `multiValueFormValue()` and `isDisabled`.
