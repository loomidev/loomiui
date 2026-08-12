---
"@loomidev/forms": patch
"@loomidev/input": patch
"@loomidev/password": patch
"@loomidev/autocomplete": patch
---

Expand native FormData integration coverage across scalar, choice, checked, range, date,
and time controls. Input, password, and autocomplete now restore their initial values and
clear transient state when their containing form is reset.
