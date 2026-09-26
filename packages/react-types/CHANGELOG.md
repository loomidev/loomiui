# @loomidev/react-types

## 0.9.0

### Patch Changes

- @loomidev/components@0.9.0
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
  - @loomidev/components@0.8.0

## 0.7.0

### Patch Changes

- Updated dependencies [c952b7d]
  - @loomidev/core@0.7.0
  - @loomidev/components@0.7.0

## 0.6.0

### Patch Changes

- Updated dependencies [fd109c2]
- Updated dependencies [fd109c2]
  - @loomidev/core@0.6.0
  - @loomidev/components@0.6.0

## 0.5.0

### Minor Changes

- ec8801a: Restore every form-associated control to its initial state through native form resets,
  document submitted value formats, and add generated React 18 and React 19 JSX types.

### Patch Changes

- Updated dependencies [450d1d3]
- Updated dependencies [d3bc58c]
- Updated dependencies [d3069e0]
- Updated dependencies [742f156]
- Updated dependencies [d3069e0]
  - @loomidev/core@0.5.0
  - @loomidev/components@0.5.0

## 0.4.1

### Patch Changes

- bdc6c10: Bring `@loomidev/react` and `@loomidev/react-types` onto the shared version line. They were
  left out of the changesets `fixed` group, so they versioned independently and sat at 0.1.0
  while the other 86 packages moved to 0.4.0. They are in the group now, and this release
  pulls every package to the same version.
  - @loomidev/components@0.4.1
  - @loomidev/core@0.4.1

## 0.1.0

### Minor Changes

- 9344aad: Restore every form-associated control to its initial state through native form resets,
  document submitted value formats, and add generated React 18 and React 19 JSX types.

### Patch Changes

- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
  - @loomidev/core@0.4.0
  - @loomidev/components@0.4.0
