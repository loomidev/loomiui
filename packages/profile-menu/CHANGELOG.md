# @loomidev/profile-menu

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

- d48fb64: Add an `arrowAnchor` property to `<loomi-dropmenu>`: the panel aligns to that element instead of the whole trigger, so its arrow lands right on it (the trigger still decides whether the panel opens below or flips above). It's re-measured on every placement, so it stays correct when the panel flips up or swaps alignment. `<loomi-profile-menu>` now positions its menu from the chevron (from the avatar + chevron pair when compact), so the caret sits under the chevron with either `placement`. `positionFloatingPanel()` gains an `alignTo` option to support this.
- Updated dependencies [661d4c0]
- Updated dependencies [d48fb64]
  - @loomidev/core@0.8.0
  - @loomidev/avatar@0.8.0
  - @loomidev/card@0.8.0
  - @loomidev/dropmenu@0.8.0
  - @loomidev/icons@0.8.0
  - @loomidev/theme@0.8.0

## 0.7.0

### Minor Changes

- c952b7d: Add a `compact` attribute that reduces the trigger to avatar + chevron (`compact="auto"` does so only below a 40rem viewport), so the menu fits phone-width headers without pushing the page wider. The name and description stay available to screen readers. The trigger's minimum width is now overridable with `--loomi-profile-menu-min-width` (set `0` to let it shrink and truncate the name in a constrained container), and its pieces are exposed as parts: `trigger`, `avatar`, `copy`, `name`, `description`, `chevron`.

### Patch Changes

- Updated dependencies [c952b7d]
  - @loomidev/core@0.7.0
  - @loomidev/avatar@0.7.0
  - @loomidev/card@0.7.0
  - @loomidev/dropmenu@0.7.0
  - @loomidev/icons@0.7.0
  - @loomidev/theme@0.7.0

## 0.6.0

### Patch Changes

- Updated dependencies [fd109c2]
- Updated dependencies [fd109c2]
  - @loomidev/core@0.6.0
  - @loomidev/avatar@0.6.0
  - @loomidev/card@0.6.0
  - @loomidev/dropmenu@0.6.0
  - @loomidev/icons@0.6.0
  - @loomidev/theme@0.6.0

## 0.5.0

### Minor Changes

- f854c5f: Add an `avatar-position` attribute to `<loomi-profile-menu>`. Set it to `right` to put
  the avatar after the name and description, with the chevron still trailing.

### Patch Changes

- ec8801a: Make the dropmenu arrow readable. At 6px it was a barely-visible nub — the triangle is
  filled with the panel's own surface color, so all that distinguishes it is a 1px sliver of
  `--loomi-surface-border`, and at that size the sliver reads as a bump rather than a
  pointer. `--loomi-dropmenu-arrow-size` is now 9px, keeping the same panel-matched colors.

  Most obvious under `<loomi-profile-menu>`, whose trigger is a full card, but the arrow was
  equally faint on every dropmenu — so this moves the shared default rather than overriding
  it in one component. `--loomi-dropmenu-arrow-size` is still yours to override per instance.

  profile-menu's `--loomi-dropmenu-arrow-inset` is recomputed to 0.6875rem, since it is
  derived from half the arrow's width.

- 50a4170: Keep a consistent 6px gap between the avatar and identity labels.
- Updated dependencies [450d1d3]
- Updated dependencies [d3bc58c]
- Updated dependencies [ec8801a]
- Updated dependencies [ec8801a]
- Updated dependencies [742f156]
  - @loomidev/theme@0.5.0
  - @loomidev/core@0.5.0
  - @loomidev/dropmenu@0.5.0
  - @loomidev/icons@0.5.0
  - @loomidev/avatar@0.5.0
  - @loomidev/card@0.5.0

## 0.4.1

### Patch Changes

- @loomidev/avatar@0.4.1
- @loomidev/card@0.4.1
- @loomidev/core@0.4.1
- @loomidev/dropmenu@0.4.1
- @loomidev/icons@0.4.1
- @loomidev/theme@0.4.1

## 0.4.0

### Minor Changes

- 9344aad: Add an `avatar-position` attribute to `<loomi-profile-menu>`. Set it to `right` to put
  the avatar after the name and description, with the chevron still trailing.

### Patch Changes

- 9344aad: Make the dropmenu arrow readable. At 6px it was a barely-visible nub — the triangle is
  filled with the panel's own surface color, so all that distinguishes it is a 1px sliver of
  `--loomi-surface-border`, and at that size the sliver reads as a bump rather than a
  pointer. `--loomi-dropmenu-arrow-size` is now 9px, keeping the same panel-matched colors.

  Most obvious under `<loomi-profile-menu>`, whose trigger is a full card, but the arrow was
  equally faint on every dropmenu — so this moves the shared default rather than overriding
  it in one component. `--loomi-dropmenu-arrow-size` is still yours to override per instance.

  profile-menu's `--loomi-dropmenu-arrow-inset` is recomputed to 0.6875rem, since it is
  derived from half the arrow's width.

- 9344aad: Keep a consistent 6px gap between the avatar and identity labels.
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
  - @loomidev/theme@0.4.0
  - @loomidev/core@0.4.0
  - @loomidev/dropmenu@0.4.0
  - @loomidev/icons@0.4.0
  - @loomidev/avatar@0.4.0
  - @loomidev/card@0.4.0

## 0.3.0

### Minor Changes

- 868d518: Add an `avatar-position` attribute to `<loomi-profile-menu>`. Set it to `right` to put
  the avatar after the name and description, with the chevron still trailing.

### Patch Changes

- @loomidev/avatar@0.3.0
- @loomidev/card@0.3.0
- @loomidev/core@0.3.0
- @loomidev/dropmenu@0.3.0
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

- Updated dependencies [f4689e1]
- Updated dependencies [697386a]
- Updated dependencies [505ea39]
- Updated dependencies [0b73a79]
- Updated dependencies [0e4b550]
- Updated dependencies [8e300d8]
- Updated dependencies [697386a]
- Updated dependencies [8f0bc31]
- Updated dependencies [fe159c4]
- Updated dependencies [697386a]
- Updated dependencies [263ce12]
- Updated dependencies [505ea39]
- Updated dependencies [697386a]
- Updated dependencies [49b905b]
- Updated dependencies [5644747]
- Updated dependencies [e1e36b7]
  - @loomidev/avatar@0.2.0
  - @loomidev/core@0.2.0
  - @loomidev/card@0.2.0
  - @loomidev/dropmenu@0.2.0
  - @loomidev/icons@0.2.0
  - @loomidev/theme@0.2.0
