---
"@loomidev/core": minor
"@loomidev/input": minor
"@loomidev/password": minor
"@loomidev/number": minor
"@loomidev/otp": minor
"@loomidev/autocomplete": minor
"@loomidev/button": patch
---

Pressing Enter in a single-line field now submits its form, following the HTML spec's implicit submission. `<loomi-input>`, `<loomi-password>`, `<loomi-number>`, `<loomi-otp>` (once complete) and `<loomi-autocomplete>` (when no suggestion is highlighted) activate the form's default button, whether native or `<loomi-button can-submit>`. With no submit button they submit the form directly when it has only one text-like field. Validation runs and `submit` fires once. The Enter that commits an IME composition is ignored. Opt out per field with `no-implicit-submit`. `@loomidev/core` exports the shared `implicitlySubmit()` helper. `<loomi-autocomplete>` no longer opens its list on Enter inside a form.
