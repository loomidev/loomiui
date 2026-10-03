# @loomidev/otp

## 0.11.0

### Minor Changes

- d6ffefd: `<loomi-otp>` can now fit the space it's given: `fluid` shrinks the boxes evenly to the host's width (never past the `size` maximum; the gap stays fixed), a `--loomi-otp-size` set on the host now wins over the `size` presets, and the row and boxes are exposed as `part="boxes"` / `part="box"`.

### Patch Changes

- Updated dependencies [fde1da3]
- Updated dependencies [e1723dc]
- Updated dependencies [624cfc1]
  - @loomidev/core@0.11.0
  - @loomidev/notification@0.11.0

## 0.10.0

### Minor Changes

- 9f5d56f: Pressing Enter in a single-line field now submits its form, following the HTML spec's implicit submission. `<loomi-input>`, `<loomi-password>`, `<loomi-number>`, `<loomi-otp>` (once complete) and `<loomi-autocomplete>` (when no suggestion is highlighted) activate the form's default button, whether native or `<loomi-button can-submit>`. With no submit button they submit the form directly when it has only one text-like field. Validation runs and `submit` fires once. The Enter that commits an IME composition is ignored. Opt out per field with `no-implicit-submit`. `@loomidev/core` exports the shared `implicitlySubmit()` helper. `<loomi-autocomplete>` no longer opens its list on Enter inside a form.
- 29cce36: Form controls now follow the native value-and-events contract (documented in `@loomidev/core`'s README), so framework two-way bindings work on the tags directly.
  
  - `<loomi-select>` gains a settable `value` (comma-joined when `multiple`) and `values` (`string[]`), and fires `input` before `change` on every pick. Typing in its search box no longer fires `input` on the host, and a pick survives a later `data` swap.
  - `<loomi-checkbox>` and `<loomi-toggle>` expose a read-only `type` of `"checkbox"`, `<loomi-radio>` one of `"radio"`. All three fire `input` (with `checked` already updated) before `change`. Setting a radio's `checked` unchecks the rest of its group, as a native radio does.
  - `<loomi-otp>` gains a settable `value` and now fires `input` on each edit and `change` when focus leaves the boxes. Moving it in the DOM no longer clears the code.
  - `<loomi-datepicker>`, `<loomi-timepicker>` and `<loomi-slider>` turn their read-only `value` into a settable one. `<loomi-checkcards>` gains `value`/`values`. `<loomi-filepicker>` gains a native-style `value` (set `""` to clear). Each now fires `input` before `change` on user edits. The timepicker and checkcards honor `selected-value` changes after the first render, and the timepicker converts between 12- and 24-hour input.
  - `<loomi-input>`, `<loomi-password>`, `<loomi-textarea>`, `<loomi-number>`, `<loomi-autocomplete>`, `<loomi-tag-input>`, `<loomi-text-editor>` and `<loomi-slider>` fire exactly one `input` per edit (the inner field's native event used to leak through as a second one). Text fields re-sync when a listener rewrites `value` mid-edit.
  - `<loomi-text-editor>` fires `change` only when focus leaves after an edit, not on every blur. `<loomi-number>` no longer fires an extra `input` on commit unless the commit clamped the number. `<loomi-autocomplete>` commits typed free text with `change` on leaving the field. `<loomi-timepicker>` no longer fires `change` for a pick that leaves the time unchanged.
  - `@loomidev/react` wrappers gain `onInput` where the controls newly declare `input`.

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
- Updated dependencies [92bd99d]
- Updated dependencies [9f5d56f]
- Updated dependencies [29cce36]
  - @loomidev/core@0.10.0
  - @loomidev/notification@0.10.0

## 0.9.0

### Patch Changes

- Updated dependencies [c12e752]
  - @loomidev/notification@0.9.0
  - @loomidev/core@0.9.0

## 0.8.0

### Minor Changes

- 661d4c0: **Breaking:** every `size` attribute (and `blur-size`, `image-size`, `icon-size`, `avatar-size`) now uses one ordered scale from `@loomidev/core`: `tiny` < `small` < `regular` < `medium` < `big` < `huge` < `omg`. A name means the same position in every component, every component defaults to `regular`, and an unsupported name renders as `regular`. The old names are removed, with no aliases.
  
  Renamed sizes:
  
  | Component                                  | Attribute    | Old → new                                                                                           |
  | ------------------------------------------ | ------------ | --------------------------------------------------------------------------------------------------- |
  | modal                                      | `size`       | `medium` → `regular` (default), `large` → `big`, `xl` → `huge`                                      |
  | modal                                      | `blur-size`  | `medium` → `regular` (default), `large` → `big`, `xl` → `huge`                                      |
  | card                                       | `size`       | `default` → `regular`, `sm` → `small`                                                               |
  | drawer                                     | `size`       | `medium` → `regular` (default), `large` → `big`                                                     |
  | empty-state                                | `image-size` | `medium` → `regular` (default), `large` → `big`, `xl` → `huge`                                      |
  | side-nav                                   | `icon-size`  | `large` → `big`                                                                                     |
  | spinner                                    | `size`       | `small` → `regular` (default), `xl` → `huge`; the `sm`/`md`/`lg` aliases are removed                |
  | bell, otp                                  | `size`       | `small` → `regular` (default)                                                                       |
  | rating                                     | `size`       | `small` → `regular` (default)                                                                       |
  | progress-circle                            | `size`       | `medium` → `regular` (default), `large` → `huge`                                                    |
  | progress-arc                               | `size`       | `medium` → `regular` (default), `large` → `huge`                                                    |
  
  Resized:
  
  - **avatar:** `medium` moves from 2.5rem (smaller than `regular`) to 3.5rem, between `regular` (3rem, still the default) and `big` (4rem).
  - **fab:** `medium` moves from 3.25rem (smaller than `regular`) to 4.25rem, above `regular` (3.75rem, still the default).
  - **input, select, number, password, autocomplete, countries, tag-input, timepicker, timezonepicker, emoji-picker:** the default is now `regular` (was `medium`), so a default field is 2.5rem tall and lines up with a default `<loomi-button>`. Set `size="medium"` for the previous 2.75rem height. emoji-picker's `big` trigger is now 3rem, matching the other controls.
  
  Types: every size property is typed with the new `LoomiSize` export from `@loomidev/core` (so custom-elements.json and editor autocomplete show the same list everywhere), and the per-component size types are removed: `LoomiAutocompleteSize`, `LoomiAvatarSize`, `LoomiBellSize`, `LoomiButtonSize`, `LoomiButtonGroupSize`, `LoomiCardSize`, `LoomiColorpickerSize`, `LoomiCountriesSize`, `LoomiDatepickerSize`, `LoomiDrawerSize`, `LoomiEmojiPickerSize`, `LoomiEmptyImageSize`, `LoomiFabSize`, `LoomiInputSize`, `LoomiModalSize`, `LoomiNumberSize`, `LoomiPasswordSize`, `LoomiProgressStepSize`, `LoomiRatingSize`, `LoomiSelectSize`, `LoomiSideNavIconSize`, `LoomiSpinnerSize`, `LoomiSplitButtonSize`, `LoomiTagInputSize`, `LoomiTimezonepickerSize`. Use `LoomiSize` instead.
  
  New in `@loomidev/core`: `LOOMI_SIZES`, `LoomiSize`, `isLoomiSize`, `LOOMI_DEFAULT_SIZE`, `LOOMI_CONTROL_SIZES`, `resolveLoomiSize` and `LoomiSizeSupport`. Each sized component declares the names it supports in a static `supportedSizes` map. See the "Sizing" section of the core README.

### Patch Changes

- Updated dependencies [661d4c0]
- Updated dependencies [d48fb64]
  - @loomidev/core@0.8.0
  - @loomidev/notification@0.8.0

## 0.7.0

### Patch Changes

- Updated dependencies [c952b7d]
  - @loomidev/core@0.7.0
  - @loomidev/notification@0.7.0

## 0.6.0

### Patch Changes

- Updated dependencies [fd109c2]
- Updated dependencies [fd109c2]
  - @loomidev/core@0.6.0
  - @loomidev/notification@0.6.0

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
