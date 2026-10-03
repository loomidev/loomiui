# @loomidev/forms

## 0.12.0

### Patch Changes

- Updated dependencies [7569d90]
- Updated dependencies [7569d90]
- Updated dependencies [b16e5be]
  - @loomidev/datepicker@0.12.0
  - @loomidev/filepicker@0.12.0
  - @loomidev/select@0.12.0
  - @loomidev/timepicker@0.12.0
  - @loomidev/autocomplete@0.12.0
  - @loomidev/tag-input@0.12.0
  - @loomidev/number@0.12.0
  - @loomidev/otp@0.12.0
  - @loomidev/date-range-picker@0.12.0
  - @loomidev/text-editor@0.12.0
  - @loomidev/checkbox@0.12.0
  - @loomidev/checkcards@0.12.0
  - @loomidev/colorpicker@0.12.0
  - @loomidev/countries@0.12.0
  - @loomidev/creditcard@0.12.0
  - @loomidev/emoji-picker@0.12.0
  - @loomidev/filter-builder@0.12.0
  - @loomidev/input@0.12.0
  - @loomidev/password@0.12.0
  - @loomidev/radio@0.12.0
  - @loomidev/slider@0.12.0
  - @loomidev/textarea@0.12.0
  - @loomidev/timezonepicker@0.12.0
  - @loomidev/toggle@0.12.0

## 0.11.0

### Patch Changes

- Updated dependencies [fde1da3]
- Updated dependencies [e1723dc]
- Updated dependencies [f8d070d]
- Updated dependencies [d6ffefd]
- Updated dependencies [fde1da3]
- Updated dependencies [f8d070d]
  - @loomidev/datepicker@0.11.0
  - @loomidev/timepicker@0.11.0
  - @loomidev/select@0.11.0
  - @loomidev/timezonepicker@0.11.0
  - @loomidev/countries@0.11.0
  - @loomidev/tag-input@0.11.0
  - @loomidev/input@0.11.0
  - @loomidev/password@0.11.0
  - @loomidev/textarea@0.11.0
  - @loomidev/number@0.11.0
  - @loomidev/otp@0.11.0
  - @loomidev/autocomplete@0.11.0
  - @loomidev/text-editor@0.11.0
  - @loomidev/checkbox@0.11.0
  - @loomidev/checkcards@0.11.0
  - @loomidev/colorpicker@0.11.0
  - @loomidev/creditcard@0.11.0
  - @loomidev/date-range-picker@0.11.0
  - @loomidev/emoji-picker@0.11.0
  - @loomidev/filepicker@0.11.0
  - @loomidev/filter-builder@0.11.0
  - @loomidev/radio@0.11.0
  - @loomidev/slider@0.11.0
  - @loomidev/toggle@0.11.0

## 0.10.0

### Patch Changes

- ee9d5a7: Cut what components cost a consumer bundle.
  
  - Icons load on demand. `@loomidev/icons` no longer inlines Heroicons: each icon is its own module, loaded the first time it renders, through the new `loomiIcon()` directive, `hasLoomiIcon()` and `loadLoomiIcon()`. `getLoomiIcon()` now returns only icons that are ready (registered, provided or already loaded). `import "@loomidev/icons/all"` restores the eager set. Components ship their own chrome icons statically via `provideLoomiIcons()`. The Heroicons set is now complete (324 icons per variant).
  - Iconsax and Untitled UI are opt-in: `import "@loomidev/icons/iconsax"` / `"@loomidev/icons/untitledui"`. Until then their names are unknown and `<loomi-icon>` falls back to its slot with a one-time console warning. `<loomi-text-editor>` registers the toolbar icons it uses, so it needs neither.
  - Every package declares `"sideEffects"` precisely, so bundlers tree-shake unused modules.
  - `@loomidev/button` safelists only the utility classes it builds at runtime; its compiled styles drop from 89 KB to 14 KB. The button is now about 8.4 KB min+gz including styles (was about 102 KB).
  - `LOOMI_CONTROL_SIZES` moved to core's `size` module (same export from `@loomidev/core`), so importing it no longer pulls in the field stylesheets.
  - Each README has a Bundle size section, and `pnpm check:bundle-size` reports every package's size in CI with a 10 KB hard limit on the button.
- Updated dependencies [ee9d5a7]
- Updated dependencies [a0482d2]
- Updated dependencies [0a62363]
- Updated dependencies [92bd99d]
- Updated dependencies [9f5d56f]
- Updated dependencies [29cce36]
  - @loomidev/autocomplete@0.10.0
  - @loomidev/checkbox@0.10.0
  - @loomidev/checkcards@0.10.0
  - @loomidev/colorpicker@0.10.0
  - @loomidev/countries@0.10.0
  - @loomidev/creditcard@0.10.0
  - @loomidev/date-range-picker@0.10.0
  - @loomidev/datepicker@0.10.0
  - @loomidev/emoji-picker@0.10.0
  - @loomidev/filepicker@0.10.0
  - @loomidev/filter-builder@0.10.0
  - @loomidev/input@0.10.0
  - @loomidev/number@0.10.0
  - @loomidev/otp@0.10.0
  - @loomidev/password@0.10.0
  - @loomidev/radio@0.10.0
  - @loomidev/select@0.10.0
  - @loomidev/slider@0.10.0
  - @loomidev/tag-input@0.10.0
  - @loomidev/text-editor@0.10.0
  - @loomidev/textarea@0.10.0
  - @loomidev/timepicker@0.10.0
  - @loomidev/timezonepicker@0.10.0
  - @loomidev/toggle@0.10.0

## 0.9.0

### Patch Changes

- @loomidev/date-range-picker@0.9.0
  - @loomidev/filepicker@0.9.0
  - @loomidev/input@0.9.0
  - @loomidev/otp@0.9.0
  - @loomidev/password@0.9.0
  - @loomidev/text-editor@0.9.0
  - @loomidev/autocomplete@0.9.0
  - @loomidev/checkbox@0.9.0
  - @loomidev/checkcards@0.9.0
  - @loomidev/colorpicker@0.9.0
  - @loomidev/countries@0.9.0
  - @loomidev/creditcard@0.9.0
  - @loomidev/datepicker@0.9.0
  - @loomidev/emoji-picker@0.9.0
  - @loomidev/filter-builder@0.9.0
  - @loomidev/number@0.9.0
  - @loomidev/radio@0.9.0
  - @loomidev/select@0.9.0
  - @loomidev/slider@0.9.0
  - @loomidev/tag-input@0.9.0
  - @loomidev/textarea@0.9.0
  - @loomidev/timepicker@0.9.0
  - @loomidev/timezonepicker@0.9.0
  - @loomidev/toggle@0.9.0

## 0.8.0

### Patch Changes

- Updated dependencies [661d4c0]
  - @loomidev/colorpicker@0.8.0
  - @loomidev/countries@0.8.0
  - @loomidev/datepicker@0.8.0
  - @loomidev/emoji-picker@0.8.0
  - @loomidev/filepicker@0.8.0
  - @loomidev/input@0.8.0
  - @loomidev/number@0.8.0
  - @loomidev/otp@0.8.0
  - @loomidev/password@0.8.0
  - @loomidev/autocomplete@0.8.0
  - @loomidev/select@0.8.0
  - @loomidev/tag-input@0.8.0
  - @loomidev/text-editor@0.8.0
  - @loomidev/timepicker@0.8.0
  - @loomidev/timezonepicker@0.8.0
  - @loomidev/checkbox@0.8.0
  - @loomidev/checkcards@0.8.0
  - @loomidev/creditcard@0.8.0
  - @loomidev/date-range-picker@0.8.0
  - @loomidev/filter-builder@0.8.0
  - @loomidev/radio@0.8.0
  - @loomidev/slider@0.8.0
  - @loomidev/textarea@0.8.0
  - @loomidev/toggle@0.8.0

## 0.7.0

### Patch Changes

- Updated dependencies [927c52f]
- Updated dependencies [c952b7d]
  - @loomidev/countries@0.7.0
  - @loomidev/timezonepicker@0.7.0
  - @loomidev/colorpicker@0.7.0
  - @loomidev/select@0.7.0
  - @loomidev/text-editor@0.7.0
  - @loomidev/autocomplete@0.7.0
  - @loomidev/checkbox@0.7.0
  - @loomidev/checkcards@0.7.0
  - @loomidev/creditcard@0.7.0
  - @loomidev/date-range-picker@0.7.0
  - @loomidev/datepicker@0.7.0
  - @loomidev/emoji-picker@0.7.0
  - @loomidev/filepicker@0.7.0
  - @loomidev/filter-builder@0.7.0
  - @loomidev/input@0.7.0
  - @loomidev/number@0.7.0
  - @loomidev/otp@0.7.0
  - @loomidev/password@0.7.0
  - @loomidev/radio@0.7.0
  - @loomidev/slider@0.7.0
  - @loomidev/tag-input@0.7.0
  - @loomidev/textarea@0.7.0
  - @loomidev/timepicker@0.7.0
  - @loomidev/toggle@0.7.0

## 0.6.0

### Patch Changes

- Updated dependencies [fd109c2]
- Updated dependencies [fd109c2]
  - @loomidev/countries@0.6.0
  - @loomidev/timezonepicker@0.6.0
  - @loomidev/datepicker@0.6.0
  - @loomidev/timepicker@0.6.0
  - @loomidev/colorpicker@0.6.0
  - @loomidev/autocomplete@0.6.0
  - @loomidev/tag-input@0.6.0
  - @loomidev/password@0.6.0
  - @loomidev/select@0.6.0
  - @loomidev/date-range-picker@0.6.0
  - @loomidev/checkbox@0.6.0
  - @loomidev/checkcards@0.6.0
  - @loomidev/creditcard@0.6.0
  - @loomidev/emoji-picker@0.6.0
  - @loomidev/filepicker@0.6.0
  - @loomidev/filter-builder@0.6.0
  - @loomidev/input@0.6.0
  - @loomidev/number@0.6.0
  - @loomidev/otp@0.6.0
  - @loomidev/radio@0.6.0
  - @loomidev/slider@0.6.0
  - @loomidev/text-editor@0.6.0
  - @loomidev/textarea@0.6.0
  - @loomidev/toggle@0.6.0

## 0.5.0

### Patch Changes

- fdac5da: Expand native FormData integration coverage across scalar, choice, checked, range, date,
  and time controls. Input, password, and autocomplete now restore their initial values and
  clear transient state when their containing form is reset.
- ec8801a: Restore every form-associated control to its initial state through native form resets,
  document submitted value formats, and add generated React 18 and React 19 JSX types.
- Updated dependencies [450d1d3]
- Updated dependencies [87c5d42]
- Updated dependencies [450d1d3]
- Updated dependencies [fdac5da]
- Updated dependencies [ec8801a]
- Updated dependencies [ad81ae1]
- Updated dependencies [87c5d42]
- Updated dependencies [7227978]
- Updated dependencies [742f156]
  - @loomidev/autocomplete@0.5.0
  - @loomidev/colorpicker@0.5.0
  - @loomidev/filepicker@0.5.0
  - @loomidev/date-range-picker@0.5.0
  - @loomidev/filter-builder@0.5.0
  - @loomidev/input@0.5.0
  - @loomidev/checkbox@0.5.0
  - @loomidev/datepicker@0.5.0
  - @loomidev/radio@0.5.0
  - @loomidev/slider@0.5.0
  - @loomidev/timepicker@0.5.0
  - @loomidev/toggle@0.5.0
  - @loomidev/password@0.5.0
  - @loomidev/checkcards@0.5.0
  - @loomidev/countries@0.5.0
  - @loomidev/emoji-picker@0.5.0
  - @loomidev/number@0.5.0
  - @loomidev/otp@0.5.0
  - @loomidev/select@0.5.0
  - @loomidev/tag-input@0.5.0
  - @loomidev/text-editor@0.5.0
  - @loomidev/textarea@0.5.0
  - @loomidev/timezonepicker@0.5.0
  - @loomidev/creditcard@0.5.0

## 0.4.1

### Patch Changes

- @loomidev/autocomplete@0.4.1
- @loomidev/checkbox@0.4.1
- @loomidev/checkcards@0.4.1
- @loomidev/colorpicker@0.4.1
- @loomidev/countries@0.4.1
- @loomidev/creditcard@0.4.1
- @loomidev/date-range-picker@0.4.1
- @loomidev/datepicker@0.4.1
- @loomidev/emoji-picker@0.4.1
- @loomidev/filepicker@0.4.1
- @loomidev/filter-builder@0.4.1
- @loomidev/input@0.4.1
- @loomidev/number@0.4.1
- @loomidev/otp@0.4.1
- @loomidev/password@0.4.1
- @loomidev/radio@0.4.1
- @loomidev/select@0.4.1
- @loomidev/slider@0.4.1
- @loomidev/tag-input@0.4.1
- @loomidev/text-editor@0.4.1
- @loomidev/textarea@0.4.1
- @loomidev/timepicker@0.4.1
- @loomidev/timezonepicker@0.4.1
- @loomidev/toggle@0.4.1

## 0.4.0

### Patch Changes

- 9344aad: Expand native FormData integration coverage across scalar, choice, checked, range, date,
  and time controls. Input, password, and autocomplete now restore their initial values and
  clear transient state when their containing form is reset.
- 9344aad: Restore every form-associated control to its initial state through native form resets,
  document submitted value formats, and add generated React 18 and React 19 JSX types.
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
  - @loomidev/autocomplete@0.4.0
  - @loomidev/colorpicker@0.4.0
  - @loomidev/filepicker@0.4.0
  - @loomidev/date-range-picker@0.4.0
  - @loomidev/filter-builder@0.4.0
  - @loomidev/input@0.4.0
  - @loomidev/checkbox@0.4.0
  - @loomidev/datepicker@0.4.0
  - @loomidev/radio@0.4.0
  - @loomidev/slider@0.4.0
  - @loomidev/timepicker@0.4.0
  - @loomidev/toggle@0.4.0
  - @loomidev/password@0.4.0
  - @loomidev/checkcards@0.4.0
  - @loomidev/countries@0.4.0
  - @loomidev/emoji-picker@0.4.0
  - @loomidev/number@0.4.0
  - @loomidev/otp@0.4.0
  - @loomidev/select@0.4.0
  - @loomidev/tag-input@0.4.0
  - @loomidev/text-editor@0.4.0
  - @loomidev/textarea@0.4.0
  - @loomidev/timezonepicker@0.4.0
  - @loomidev/creditcard@0.4.0

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
