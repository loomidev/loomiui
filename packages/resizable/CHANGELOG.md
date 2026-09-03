# @loomidev/resizable

## 0.5.0

### Patch Changes

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

- Updated dependencies [450d1d3]
- Updated dependencies [d3bc58c]
- Updated dependencies [742f156]
  - @loomidev/core@0.5.0

## 0.4.1

### Patch Changes

- @loomidev/core@0.4.1

## 0.4.0

### Patch Changes

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

- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
  - @loomidev/core@0.4.0

## 0.3.0

### Patch Changes

- @loomidev/core@0.3.0

## 0.2.0

### Minor Changes

- fe159c4: First public release of LoomiUI.

  All `@loomidev/*` packages share a single version number and are released together,
  so any set of them installed at the same version is mutually compatible.

  Versions stay in the `0.x` range while the component APIs settle. Until `1.0.0`,
  a minor bump may contain breaking changes; pin an exact version if you need
  stability across upgrades.

### Patch Changes

- Updated dependencies [697386a]
- Updated dependencies [0b73a79]
- Updated dependencies [697386a]
- Updated dependencies [fe159c4]
- Updated dependencies [697386a]
- Updated dependencies [263ce12]
- Updated dependencies [697386a]
- Updated dependencies [e1e36b7]
  - @loomidev/core@0.2.0
