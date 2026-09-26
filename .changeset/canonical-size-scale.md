---
"@loomidev/core": minor
"@loomidev/avatar": minor
"@loomidev/bell": minor
"@loomidev/button": minor
"@loomidev/button-group": minor
"@loomidev/calendar": minor
"@loomidev/card": minor
"@loomidev/chat": minor
"@loomidev/colorpicker": minor
"@loomidev/contact-card": minor
"@loomidev/countries": minor
"@loomidev/datepicker": minor
"@loomidev/drawer": minor
"@loomidev/emoji-picker": minor
"@loomidev/empty-state": minor
"@loomidev/fab": minor
"@loomidev/filepicker": minor
"@loomidev/input": minor
"@loomidev/modal": minor
"@loomidev/number": minor
"@loomidev/otp": minor
"@loomidev/password": minor
"@loomidev/autocomplete": minor
"@loomidev/profile-menu": minor
"@loomidev/progress": minor
"@loomidev/progress-steps": minor
"@loomidev/rating": minor
"@loomidev/react-types": minor
"@loomidev/select": minor
"@loomidev/side-nav": minor
"@loomidev/spinner": minor
"@loomidev/split-button": minor
"@loomidev/tag-input": minor
"@loomidev/text-editor": minor
"@loomidev/timepicker": minor
"@loomidev/timezonepicker": minor
---

**Breaking:** every `size` attribute (and `blur-size`, `image-size`, `icon-size`, `avatar-size`) now uses one ordered scale from `@loomidev/core`: `tiny` < `small` < `regular` < `medium` < `big` < `huge` < `omg`. A name means the same position in every component, every component defaults to `regular`, and an unsupported name renders as `regular`. The old names are removed, with no aliases.

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
