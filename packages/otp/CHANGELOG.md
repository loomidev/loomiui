# @loomidev/otp

## 0.5.0

### Minor Changes

- ad81ae1: Give the remaining components with custom key handling the keyboard behavior their
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

### Patch Changes

- ec8801a: Restore every form-associated control to its initial state through native form resets,
  document submitted value formats, and add generated React 18 and React 19 JSX types.
- Updated dependencies [450d1d3]
- Updated dependencies [d3bc58c]
- Updated dependencies [742f156]
  - @loomidev/core@0.5.0
  - @loomidev/notification@0.5.0

## 0.4.1

### Patch Changes

- @loomidev/core@0.4.1
- @loomidev/notification@0.4.1

## 0.4.0

### Minor Changes

- 9344aad: Give the remaining components with custom key handling the keyboard behavior their
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

### Patch Changes

- 9344aad: Restore every form-associated control to its initial state through native form resets,
  document submitted value formats, and add generated React 18 and React 19 JSX types.
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
  - @loomidev/core@0.4.0
  - @loomidev/notification@0.4.0

## 0.3.0

### Patch Changes

- @loomidev/core@0.3.0
- @loomidev/notification@0.3.0

## 0.2.0

### Minor Changes

- fe159c4: First public release of LoomiUI.

  All `@loomidev/*` packages share a single version number and are released together,
  so any set of them installed at the same version is mutually compatible.

  Versions stay in the `0.x` range while the component APIs settle. Until `1.0.0`,
  a minor bump may contain breaking changes; pin an exact version if you need
  stability across upgrades.

- af01d41: Add async validation states to `<loomi-otp>`: call `startValidating()` to show a spinner
  in a new status slot next to the boxes (which also disables them), then `showSuccess()`
  to switch it to a green checkmark with green box borders, or `showError(message?)` to
  turn the boxes red. `showError()` also accepts an optional one-off message override.

  Added a `show-error-inline` attribute (default `false`) and a `label` attribute, matching
  `<loomi-input>`: on a valid→invalid transition, `error-message` now renders inline below
  the boxes only when `show-error-inline` is set, otherwise it surfaces as a
  `loomi-notification` toast titled with `label`. Previously `error-message` always
  rendered inline whenever `invalid` was true — add `show-error-inline` to existing
  `<loomi-otp>` usages that rely on the inline message to keep that behavior.

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

- e1e36b7: Make corner radius and control density themeable from `:root`, closing the gap where a
  downloaded theme could recolor components but couldn't reshape them.

  `@loomidev/theme` now ships four public token slots (defaults preserve current rendering
  exactly, so this is additive — no visual change unless you override them):

  - `--loomi-control-radius` (default `0.5rem`) — inputs, selects, buttons, checkbox, tag,
    tabs, pagination, pin, and every field-style control.
  - `--loomi-panel-radius` (default `0.875rem`) — cards, modals, popovers, menus, dropdown
    panels, tables, notifications, statistic/checkcards.
  - `--loomi-pill-radius` (default `9999px`) — pill/`radius="full"` shapes and pill tags.
  - `--loomi-density` (default `1`) — a unitless multiplier scaling control height and
    horizontal padding together (font size stays fixed), e.g. `:root { --loomi-density: 0.85 }`
    for a compact UI. Composes with the per-`size` presets rather than replacing them.

  Precedence is per-instance attribute → `:root` theme override → built-in default: an
  explicit `radius="full"`/`size="small"` still wins over a global token, while the _default_
  preset now defers to the theme. `<loomi-button>`'s `radius` attribute is reimplemented on
  top of `--loomi-control-radius`/`--loomi-pill-radius` instead of fixed Tailwind classes;
  its markup API is unchanged. True geometry (circular avatars, spinners, toggles, chart/QR/
  credit-card art) is intentionally left fixed and does not read these tokens.

- Updated dependencies [697386a]
- Updated dependencies [0b73a79]
- Updated dependencies [697386a]
- Updated dependencies [fe159c4]
- Updated dependencies [697386a]
- Updated dependencies [263ce12]
- Updated dependencies [697386a]
- Updated dependencies [e1e36b7]
  - @loomidev/core@0.2.0
  - @loomidev/notification@0.2.0
