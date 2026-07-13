---
"@loomidev/otp": minor
---

Add async validation states to `<loomi-otp>`: call `startValidating()` to show a spinner
in a new status slot next to the boxes (which also disables them), then `showSuccess()`
to switch it to a green checkmark with green box borders, or `showError(message?)` to
turn the boxes red. `showError()` also accepts an optional one-off message override.

Added a `show-error-inline` attribute (default `false`) and a `label` attribute, matching
`<loomi-input>`: on a valid→invalid transition, `error-message` now renders inline below
the boxes only when `show-error-inline` is set, otherwise it surfaces as a
`loomi-notification` toast titled with `label`. Previously `error-message` always
rendered inline whenever `invalid` was true — add `show-error-inline` to existing
`<loomi-otp>` usages that rely on the inline message to keep that behavior.
