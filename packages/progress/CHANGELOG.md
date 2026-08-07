# @loomidev/progress

## 0.2.0

### Minor Changes

- fe159c4: First public release of LoomiUI.

  All `@loomidev/*` packages share a single version number and are released together,
  so any set of them installed at the same version is mutually compatible.

  Versions stay in the `0.x` range while the component APIs settle. Until `1.0.0`,
  a minor bump may contain breaking changes; pin an exact version if you need
  stability across upgrades.

### Patch Changes

- a0c78bd: Fixed `<loomi-progress-circle>`/`<loomi-progress-bar>` rendering with a `NaN` pixel size
  when given an unrecognized `size` value. The fallback chain `SIZES[size] ?? Number(size) ??
120` never reached `120`, because `Number(size)` returns `NaN` (not nullish) for
  non-numeric input, so the `?? 120` branch was dead. It now falls back to the default 120
  via `Number(size) || 120`.
- 505ea39: Replace raw gray ramps and `#ffffff` fallbacks with semantic Loomi surface, border, and
  on-primary text tokens so components respect dark mode and theme overrides consistently.
- Updated dependencies [697386a]
- Updated dependencies [0b73a79]
- Updated dependencies [697386a]
- Updated dependencies [fe159c4]
- Updated dependencies [697386a]
- Updated dependencies [263ce12]
- Updated dependencies [697386a]
- Updated dependencies [e1e36b7]
  - @loomidev/core@0.2.0
