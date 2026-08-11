# @loomidev/data-grid

## 0.3.0

### Patch Changes

- @loomidev/chart@0.3.0
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

- 505ea39: Replace raw gray ramps and `#ffffff` fallbacks with semantic Loomi surface, border, and
  on-primary text tokens so components respect dark mode and theme overrides consistently.
- 7350966: Fixed `<loomi-table>` and `<loomi-data-grid>`'s dark-mode heading/divider colors never
  actually applying. Both used `:host-context(.dark)` to swap in dark-aware tokens, but
  that selector has no Firefox support and isn't recognized by the build's CSS optimizer
  either, so the override silently never took effect in any browser. Both components now
  watch `.dark` on `<html>` in JS (via `watchDarkMode()` from `@loomidev/core`) and reflect
  it as an `.is-dark` class on themselves instead, matching the pattern `<loomi-button>`
  already uses.
- f954123: Update `<loomi-table>` and `<loomi-data-grid>` header background and row-divider colors to a warmer cream/tan tone in light mode (overridable via `--loomi-table-heading-bg`/`--loomi-table-divider` and `--loomi-data-grid-heading-bg`/`--loomi-data-grid-divider`). Dark mode is unaffected — it still falls back to the standard surface tokens.

  Also updates the card drop shadow to a subtler, closer-in style matching the same reference design: tightened on `<loomi-table>`'s `has-shadow` shell, and newly added to `<loomi-data-grid>`'s shell (which previously had none).

- Updated dependencies [697386a]
- Updated dependencies [0b73a79]
- Updated dependencies [697386a]
- Updated dependencies [fe159c4]
- Updated dependencies [697386a]
- Updated dependencies [263ce12]
- Updated dependencies [505ea39]
- Updated dependencies [697386a]
- Updated dependencies [e1e36b7]
  - @loomidev/core@0.2.0
  - @loomidev/chart@0.2.0
