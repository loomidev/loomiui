---
"@loomidev/otp": minor
"@loomidev/components": minor
"@loomidev/forms": minor
---

**Breaking:** renamed `@loomidev/pin` → `@loomidev/otp` and the element `<loomi-pin>` →
`<loomi-otp>`, to reflect that the component is a general one-time-passcode input, not only a
numeric PIN. Update imports (`@loomidev/pin` → `@loomidev/otp`, `@loomidev/components/pin` →
`@loomidev/components/otp`), the tag name, and the exported type names
(`LoomiPin`/`LoomiPinVerifyDetail` → `LoomiOtp`/`LoomiOtpVerifyDetail`). The
`loomi-verify` event name is unchanged.

New `type` attribute controls accepted characters: `numeric` (default — digits only, the
previous behavior, keeps `inputmode="numeric"`), `alphanumeric` (letters + digits), or
`text` (any non-whitespace). Non-matching characters are dropped on type and paste.

The value getter is now `code`; `pin` remains as a deprecated alias, and the `loomi-verify`
detail still carries both `code` and `pin`. Also fixed a display bug where a rejected
character (e.g. a letter in a numeric field) stayed visible in the box despite being
excluded from the value.
