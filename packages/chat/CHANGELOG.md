# @loomidev/chat

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
- Updated dependencies [ef51d5e]
- Updated dependencies [92bd99d]
- Updated dependencies [9f5d56f]
- Updated dependencies [29cce36]
  - @loomidev/avatar@0.10.0
  - @loomidev/button@0.10.0
  - @loomidev/core@0.10.0
  - @loomidev/dropmenu@0.10.0
  - @loomidev/icon@0.10.0
  - @loomidev/spinner@0.10.0
  - @loomidev/tooltip@0.10.0

## 0.9.0

### Patch Changes

- Updated dependencies [f46f84a]
- Updated dependencies [3bae883]
  - @loomidev/button@0.9.0
  - @loomidev/dropmenu@0.9.0
  - @loomidev/avatar@0.9.0
  - @loomidev/core@0.9.0
  - @loomidev/icon@0.9.0
  - @loomidev/spinner@0.9.0
  - @loomidev/tooltip@0.9.0

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
  - @loomidev/avatar@0.8.0
  - @loomidev/button@0.8.0
  - @loomidev/spinner@0.8.0
  - @loomidev/dropmenu@0.8.0
  - @loomidev/icon@0.8.0
  - @loomidev/tooltip@0.8.0

## 0.7.0

### Patch Changes

- Updated dependencies [c952b7d]
  - @loomidev/core@0.7.0
  - @loomidev/avatar@0.7.0
  - @loomidev/button@0.7.0
  - @loomidev/dropmenu@0.7.0
  - @loomidev/icon@0.7.0
  - @loomidev/spinner@0.7.0
  - @loomidev/tooltip@0.7.0

## 0.6.0

### Patch Changes

- Updated dependencies [fd109c2]
- Updated dependencies [fd109c2]
- Updated dependencies [fd109c2]
- Updated dependencies [fd109c2]
- Updated dependencies [fd109c2]
- Updated dependencies [fd109c2]
  - @loomidev/button@0.6.0
  - @loomidev/core@0.6.0
  - @loomidev/icon@0.6.0
  - @loomidev/tooltip@0.6.0
  - @loomidev/avatar@0.6.0
  - @loomidev/dropmenu@0.6.0
  - @loomidev/spinner@0.6.0

## 0.5.0

### Minor Changes

- 450d1d3: Fix accessibility defects found by a new library-wide axe sweep, and retune the theme's
  text tokens so every tier meets WCAG AA contrast on both the light and dark surface —
  `--loomi-text-muted` and `--loomi-text-faint` each shift one step (darker in light mode,
  lighter in dark), which is visible wherever muted copy and placeholders are rendered.

  `<loomi-button>` now forwards an `aria-label` written on the host to the inner control,
  so icon-only buttons can be named the way consumers already expect. `<loomi-progress-bar>`
  and `<loomi-progress-circle>` gain `label`, `<loomi-context-menu>` gains `label` for
  triggers whose slotted content is not text, and `<loomi-chat-window>` gains `locale`.

  Also fixed: `<loomi-autocomplete>` marks its input `role="combobox"` (`aria-expanded` was
  not permitted without it), `<loomi-context-menu>`'s target carries a button role,
  `<loomi-resizable-handle>` reports `aria-valuenow`, and the previously unnamed controls in
  `<loomi-pagination>`, `<loomi-colorpicker>`, `<loomi-filepicker>` and `<loomi-chat-window>`
  now have accessible names.

- 742f156: Make the last five components with hardcoded English translatable. `<loomi-chat-window>`,
  `<loomi-command-palette>`, `<loomi-data-grid>`, `<loomi-filter-builder>` and `<loomi-video>`
  each gain a `locale` property and route their own copy through the translation table, with
  new `en` keys for all of it.

  The gap was worst for text a consumer could not reach: `aria-label` values baked into
  templates were fixed English with no way to override them, which left screen reader users
  of a non-English page hearing "Select all rows" and "Search commands" regardless of the
  locale. Visible defaults (`emptyTitle`, `placeholder`, `addLabel`, …) now resolve through
  `loomiDefaultText`, so they translate while still yielding to any value a consumer sets.

### Patch Changes

- 87c5d42: Document the events that were missing from the custom-elements manifests. The analyzer
  only sees `new CustomEvent("literal-name")`, so events dispatched through a helper or a
  template literal — all nine `<loomi-data-grid>` events, the three
  `<loomi-date-range-picker>` events, `loomi-command-query-change`, `loomi-filter-apply`,
  `loomi-reminder-create`, the `<loomi-chat-window>` attachment and recording events, and
  `<loomi-input>`'s affix events — never reached `custom-elements.json`, and so never
  reached the React wrappers either. They are now declared with `@fires` and generate typed
  `on*` callback props.

  `<loomi-empty-state>` documented a `loomi-action` event it never fires; its JSDoc now
  names the `action` event the component actually dispatches.

- Updated dependencies [450d1d3]
- Updated dependencies [d3bc58c]
- Updated dependencies [ec8801a]
- Updated dependencies [ec8801a]
- Updated dependencies [7227978]
- Updated dependencies [742f156]
  - @loomidev/button@0.5.0
  - @loomidev/core@0.5.0
  - @loomidev/dropmenu@0.5.0
  - @loomidev/icon@0.5.0
  - @loomidev/avatar@0.5.0
  - @loomidev/spinner@0.5.0
  - @loomidev/tooltip@0.5.0

## 0.4.1

### Patch Changes

- @loomidev/avatar@0.4.1
- @loomidev/button@0.4.1
- @loomidev/core@0.4.1
- @loomidev/dropmenu@0.4.1
- @loomidev/icon@0.4.1
- @loomidev/spinner@0.4.1
- @loomidev/tooltip@0.4.1

## 0.4.0

### Minor Changes

- 9344aad: Fix accessibility defects found by a new library-wide axe sweep, and retune the theme's
  text tokens so every tier meets WCAG AA contrast on both the light and dark surface —
  `--loomi-text-muted` and `--loomi-text-faint` each shift one step (darker in light mode,
  lighter in dark), which is visible wherever muted copy and placeholders are rendered.

  `<loomi-button>` now forwards an `aria-label` written on the host to the inner control,
  so icon-only buttons can be named the way consumers already expect. `<loomi-progress-bar>`
  and `<loomi-progress-circle>` gain `label`, `<loomi-context-menu>` gains `label` for
  triggers whose slotted content is not text, and `<loomi-chat-window>` gains `locale`.

  Also fixed: `<loomi-autocomplete>` marks its input `role="combobox"` (`aria-expanded` was
  not permitted without it), `<loomi-context-menu>`'s target carries a button role,
  `<loomi-resizable-handle>` reports `aria-valuenow`, and the previously unnamed controls in
  `<loomi-pagination>`, `<loomi-colorpicker>`, `<loomi-filepicker>` and `<loomi-chat-window>`
  now have accessible names.

- 9344aad: Make the last five components with hardcoded English translatable. `<loomi-chat-window>`,
  `<loomi-command-palette>`, `<loomi-data-grid>`, `<loomi-filter-builder>` and `<loomi-video>`
  each gain a `locale` property and route their own copy through the translation table, with
  new `en` keys for all of it.

  The gap was worst for text a consumer could not reach: `aria-label` values baked into
  templates were fixed English with no way to override them, which left screen reader users
  of a non-English page hearing "Select all rows" and "Search commands" regardless of the
  locale. Visible defaults (`emptyTitle`, `placeholder`, `addLabel`, …) now resolve through
  `loomiDefaultText`, so they translate while still yielding to any value a consumer sets.

### Patch Changes

- 9344aad: Document the events that were missing from the custom-elements manifests. The analyzer
  only sees `new CustomEvent("literal-name")`, so events dispatched through a helper or a
  template literal — all nine `<loomi-data-grid>` events, the three
  `<loomi-date-range-picker>` events, `loomi-command-query-change`, `loomi-filter-apply`,
  `loomi-reminder-create`, the `<loomi-chat-window>` attachment and recording events, and
  `<loomi-input>`'s affix events — never reached `custom-elements.json`, and so never
  reached the React wrappers either. They are now declared with `@fires` and generate typed
  `on*` callback props.

  `<loomi-empty-state>` documented a `loomi-action` event it never fires; its JSDoc now
  names the `action` event the component actually dispatches.

- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
  - @loomidev/button@0.4.0
  - @loomidev/core@0.4.0
  - @loomidev/dropmenu@0.4.0
  - @loomidev/icon@0.4.0
  - @loomidev/avatar@0.4.0
  - @loomidev/spinner@0.4.0
  - @loomidev/tooltip@0.4.0

## 0.3.0

### Patch Changes

- @loomidev/avatar@0.3.0
- @loomidev/button@0.3.0
- @loomidev/core@0.3.0
- @loomidev/dropmenu@0.3.0
- @loomidev/icon@0.3.0
- @loomidev/spinner@0.3.0
- @loomidev/tooltip@0.3.0

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
- Updated dependencies [49b905b]
- Updated dependencies [697386a]
- Updated dependencies [0b73a79]
- Updated dependencies [0e4b550]
- Updated dependencies [8e300d8]
- Updated dependencies [697386a]
- Updated dependencies [7d35f2f]
- Updated dependencies [8f0bc31]
- Updated dependencies [fe159c4]
- Updated dependencies [697386a]
- Updated dependencies [263ce12]
- Updated dependencies [505ea39]
- Updated dependencies [505ea39]
- Updated dependencies [e931227]
- Updated dependencies [697386a]
- Updated dependencies [e1e36b7]
  - @loomidev/avatar@0.2.0
  - @loomidev/button@0.2.0
  - @loomidev/core@0.2.0
  - @loomidev/dropmenu@0.2.0
  - @loomidev/icon@0.2.0
  - @loomidev/spinner@0.2.0
  - @loomidev/tooltip@0.2.0
