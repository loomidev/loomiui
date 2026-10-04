# @loomidev/tag-input

## 0.12.0

### Minor Changes

- b16e5be: `label-position="top"` on select, datepicker, timepicker, autocomplete, tag-input, number and otp: a plain label above the field, outside its border, rendered like `<loomi-input label-position="top">` and naming the control's trigger. The datepicker and timepicker fields are now focusable buttons that open with Enter, Space or ArrowDown. Core exports `loomiTopLabel()`, `TOP_LABEL_ID` and `fieldTopLabelStyles`.

### Patch Changes

- Updated dependencies [b16e5be]
  - @loomidev/core@0.12.0
  - @loomidev/icons@0.12.0
  - @loomidev/theme@0.12.0

## 0.11.0

### Patch Changes

- fde1da3: Visual fix: `<loomi-datepicker>` and `<loomi-timepicker>` labels now float onto the field's top border like `<loomi-input>` and `<loomi-select>`, and `label-position="inside"` lines up across every form control. `label-position="inside"` no longer reserves label space when `label` is empty, and an empty `<loomi-tag-input>` now matches the other controls' height. `@loomidev/core` adds `fieldLabelStyles`.
- Updated dependencies [fde1da3]
- Updated dependencies [e1723dc]
- Updated dependencies [624cfc1]
  - @loomidev/core@0.11.0
  - @loomidev/icons@0.11.0
  - @loomidev/theme@0.11.0

## 0.10.0

### Minor Changes

- ee9d5a7: Cut what components cost a consumer bundle.
  
  - Icons load on demand. `@loomidev/icons` no longer inlines Heroicons: each icon is its own module, loaded the first time it renders, through the new `loomiIcon()` directive, `hasLoomiIcon()` and `loadLoomiIcon()`. `getLoomiIcon()` now returns only icons that are ready (registered, provided or already loaded). `import "@loomidev/icons/all"` restores the eager set. Components ship their own chrome icons statically via `provideLoomiIcons()`. The Heroicons set is now complete (324 icons per variant).
  - Iconsax and Untitled UI are opt-in: `import "@loomidev/icons/iconsax"` / `"@loomidev/icons/untitledui"`. Until then their names are unknown and `<loomi-icon>` falls back to its slot with a one-time console warning. `<loomi-text-editor>` registers the toolbar icons it uses, so it needs neither.
  - Every package declares `"sideEffects"` precisely, so bundlers tree-shake unused modules.
  - `@loomidev/button` safelists only the utility classes it builds at runtime; its compiled styles drop from 89 KB to 14 KB. The button is now about 8.4 KB min+gz including styles (was about 102 KB).
  - `LOOMI_CONTROL_SIZES` moved to core's `size` module (same export from `@loomidev/core`), so importing it no longer pulls in the field stylesheets.
  - Each README has a Bundle size section, and `pnpm check:bundle-size` reports every package's size in CI with a 10 KB hard limit on the button.
- 29cce36: Form controls now follow the native value-and-events contract (documented in `@loomidev/core`'s README), so framework two-way bindings work on the tags directly.
  
  - `<loomi-select>` gains a settable `value` (comma-joined when `multiple`) and `values` (`string[]`), and fires `input` before `change` on every pick. Typing in its search box no longer fires `input` on the host, and a pick survives a later `data` swap.
  - `<loomi-checkbox>` and `<loomi-toggle>` expose a read-only `type` of `"checkbox"`, `<loomi-radio>` one of `"radio"`. All three fire `input` (with `checked` already updated) before `change`. Setting a radio's `checked` unchecks the rest of its group, as a native radio does.
  - `<loomi-otp>` gains a settable `value` and now fires `input` on each edit and `change` when focus leaves the boxes. Moving it in the DOM no longer clears the code.
  - `<loomi-datepicker>`, `<loomi-timepicker>` and `<loomi-slider>` turn their read-only `value` into a settable one. `<loomi-checkcards>` gains `value`/`values`. `<loomi-filepicker>` gains a native-style `value` (set `""` to clear). Each now fires `input` before `change` on user edits. The timepicker and checkcards honor `selected-value` changes after the first render, and the timepicker converts between 12- and 24-hour input.
  - `<loomi-input>`, `<loomi-password>`, `<loomi-textarea>`, `<loomi-number>`, `<loomi-autocomplete>`, `<loomi-tag-input>`, `<loomi-text-editor>` and `<loomi-slider>` fire exactly one `input` per edit (the inner field's native event used to leak through as a second one). Text fields re-sync when a listener rewrites `value` mid-edit.
  - `<loomi-text-editor>` fires `change` only when focus leaves after an edit, not on every blur. `<loomi-number>` no longer fires an extra `input` on commit unless the commit clamped the number. `<loomi-autocomplete>` commits typed free text with `change` on leaving the field. `<loomi-timepicker>` no longer fires `change` for a pick that leaves the time unchanged.
  - `@loomidev/react` wrappers gain `onInput` where the controls newly declare `input`.

### Patch Changes

- a0482d2: Form controls coerce an assigned `value` to a string like native inputs (`7` → `"7"`, `null`/`undefined` → `""`). `<loomi-input numeric>` used to throw `e.replace is not a function` and stop rendering when given a number. `<loomi-input>` also keeps rendering with the raw value, and logs a warning, if normalising it throws (e.g. a custom `dynamicMask`). `@loomidev/core` exports the shared `toControlValue()` helper.
- Updated dependencies [ee9d5a7]
- Updated dependencies [a0482d2]
- Updated dependencies [92bd99d]
- Updated dependencies [9f5d56f]
- Updated dependencies [29cce36]
  - @loomidev/core@0.10.0
  - @loomidev/icons@0.10.0
  - @loomidev/theme@0.10.0

## 0.9.0

### Patch Changes

- @loomidev/core@0.9.0
  - @loomidev/icons@0.9.0
  - @loomidev/theme@0.9.0

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
  - @loomidev/icons@0.8.0
  - @loomidev/theme@0.8.0

## 0.7.0

### Patch Changes

- Updated dependencies [c952b7d]
  - @loomidev/core@0.7.0
  - @loomidev/icons@0.7.0
  - @loomidev/theme@0.7.0

## 0.6.0

### Patch Changes

- fd109c2: Dropdown panels now open in the top layer, so opening one inside a modal (or any `overflow` container) no longer makes that container scroll or clips the panel. Panels flip above their field when there isn't room below and follow it when an ancestor scrolls; the popover also keeps its arrow on the trigger when shifted to stay on screen.
- Updated dependencies [fd109c2]
- Updated dependencies [fd109c2]
  - @loomidev/core@0.6.0
  - @loomidev/icons@0.6.0
  - @loomidev/theme@0.6.0

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
- 87c5d42: Drop bogus events from the custom-elements manifests. A component that dispatches through
  a helper — `new CustomEvent(name, …)` — made the analyzer record an event literally called
  `name` (or `type`), which then showed up in editor completions and framework integrations.
  `pnpm cem` now prunes any event named after a dispatch variable, along with unnamed ones.
- Updated dependencies [450d1d3]
- Updated dependencies [d3bc58c]
- Updated dependencies [ec8801a]
- Updated dependencies [742f156]
  - @loomidev/theme@0.5.0
  - @loomidev/core@0.5.0
  - @loomidev/icons@0.5.0

## 0.4.1

### Patch Changes

- @loomidev/core@0.4.1
- @loomidev/icons@0.4.1
- @loomidev/theme@0.4.1

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
- 9344aad: Drop bogus events from the custom-elements manifests. A component that dispatches through
  a helper — `new CustomEvent(name, …)` — made the analyzer record an event literally called
  `name` (or `type`), which then showed up in editor completions and framework integrations.
  `pnpm cem` now prunes any event named after a dispatch variable, along with unnamed ones.
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
  - @loomidev/theme@0.4.0
  - @loomidev/core@0.4.0
  - @loomidev/icons@0.4.0

## 0.3.0

### Patch Changes

- @loomidev/core@0.3.0
- @loomidev/icons@0.3.0
- @loomidev/theme@0.3.0

## 0.2.0

### Minor Changes

- fe159c4: First public release of LoomiUI.

  All `@loomidev/*` packages share a single version number and are released together,
  so any set of them installed at the same version is mutually compatible.

  Versions stay in the `0.x` range while the component APIs settle. Until `1.0.0`,
  a minor bump may contain breaking changes; pin an exact version if you need
  stability across upgrades.

### Patch Changes

- 505ea39: Replace raw gray ramps and `#ffffff` fallbacks with semantic Loomi surface, border, and
  on-primary text tokens so components respect dark mode and theme overrides consistently.
- 5644747: Make the vertical spacing below form fields themeable via a new `--loomi-field-spacing`
  token (default `1rem`). Stacked fields already shipped this margin on most components but not
  all — it's now consistent across every stacked field and overridable from `:root`:

  ```css
  :root {
    --loomi-field-spacing: 0; /* own field spacing yourself, e.g. via a flex/grid gap container */
  }
  ```

  `datepicker` and `timepicker` previously had no bottom margin and now match the other
  fields (a 1rem gap by default). `otp` (standalone/centered) and `colorpicker` (an inline
  swatch) intentionally keep no field margin. The per-instance `no-clearing` escape hatch is
  unchanged.

- Updated dependencies [697386a]
- Updated dependencies [0b73a79]
- Updated dependencies [697386a]
- Updated dependencies [8f0bc31]
- Updated dependencies [fe159c4]
- Updated dependencies [697386a]
- Updated dependencies [263ce12]
- Updated dependencies [697386a]
- Updated dependencies [49b905b]
- Updated dependencies [5644747]
- Updated dependencies [e1e36b7]
  - @loomidev/core@0.2.0
  - @loomidev/icons@0.2.0
  - @loomidev/theme@0.2.0
