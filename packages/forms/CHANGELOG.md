# @loomidev/forms

## 0.3.0

### Patch Changes

- @loomidev/autocomplete@0.3.0
- @loomidev/checkbox@0.3.0
- @loomidev/checkcards@0.3.0
- @loomidev/colorpicker@0.3.0
- @loomidev/countries@0.3.0
- @loomidev/creditcard@0.3.0
- @loomidev/date-range-picker@0.3.0
- @loomidev/datepicker@0.3.0
- @loomidev/emoji-picker@0.3.0
- @loomidev/filepicker@0.3.0
- @loomidev/filter-builder@0.3.0
- @loomidev/input@0.3.0
- @loomidev/number@0.3.0
- @loomidev/otp@0.3.0
- @loomidev/password@0.3.0
- @loomidev/radio@0.3.0
- @loomidev/select@0.3.0
- @loomidev/slider@0.3.0
- @loomidev/tag-input@0.3.0
- @loomidev/text-editor@0.3.0
- @loomidev/textarea@0.3.0
- @loomidev/timepicker@0.3.0
- @loomidev/timezonepicker@0.3.0
- @loomidev/toggle@0.3.0

## 0.2.0

### Minor Changes

- 0b73a79: Add `<loomi-creditcard>`, a flippable credit-card input with cardholder name, number,
  expiry, and CVC fields. The network logo (Visa, Mastercard, Amex, Discover, Diners Club,
  JCB, UnionPay, Maestro) is detected live from the number's prefix and shown alongside a
  contactless-payment glyph on the front face; an edge button flips the card to its back to
  enter the CVC. `@loomidev/core` gains matching `creditcard.*` translations across all
  built-in locales.
- fe159c4: First public release of LoomiUI.

  All `@loomidev/*` packages share a single version number and are released together,
  so any set of them installed at the same version is mutually compatible.

  Versions stay in the `0.x` range while the component APIs settle. Until `1.0.0`,
  a minor bump may contain breaking changes; pin an exact version if you need
  stability across upgrades.

- af01d41: **Breaking:** renamed `@loomidev/pin` → `@loomidev/otp` and the element `<loomi-pin>` →
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

### Patch Changes

- Updated dependencies [f4689e1]
- Updated dependencies [37951f5]
- Updated dependencies [0b73a79]
- Updated dependencies [505ea39]
- Updated dependencies [f954123]
- Updated dependencies [8ce464f]
- Updated dependencies [fe159c4]
- Updated dependencies [af01d41]
- Updated dependencies [af01d41]
- Updated dependencies [505ea39]
- Updated dependencies [263ce12]
- Updated dependencies [505ea39]
- Updated dependencies [dfa040a]
- Updated dependencies [5644747]
- Updated dependencies [e1e36b7]
- Updated dependencies [fe159c4]
  - @loomidev/filepicker@0.2.0
  - @loomidev/checkcards@0.2.0
  - @loomidev/creditcard@0.2.0
  - @loomidev/emoji-picker@0.2.0
  - @loomidev/autocomplete@0.2.0
  - @loomidev/checkbox@0.2.0
  - @loomidev/colorpicker@0.2.0
  - @loomidev/countries@0.2.0
  - @loomidev/date-range-picker@0.2.0
  - @loomidev/datepicker@0.2.0
  - @loomidev/filter-builder@0.2.0
  - @loomidev/input@0.2.0
  - @loomidev/number@0.2.0
  - @loomidev/otp@0.2.0
  - @loomidev/password@0.2.0
  - @loomidev/radio@0.2.0
  - @loomidev/select@0.2.0
  - @loomidev/slider@0.2.0
  - @loomidev/tag-input@0.2.0
  - @loomidev/text-editor@0.2.0
  - @loomidev/textarea@0.2.0
  - @loomidev/timepicker@0.2.0
  - @loomidev/timezonepicker@0.2.0
  - @loomidev/toggle@0.2.0
