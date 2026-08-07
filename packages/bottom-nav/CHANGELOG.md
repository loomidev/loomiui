# @loomidev/bottom-nav

## 0.2.0

### Minor Changes

- f954123: Add `<loomi-bottom-nav>`/`<loomi-bottom-nav-item>`, a mobile bottom navigation bar with
  icons (via `<loomi-icon>`), badges, eight active-state styles (`pill`, `underline`,
  `top-line`, `background`, `icon-only`, `dot`, `border`, `minimal`), a `floating` variant,
  safe-area-aware positioning, and arrow-key roving focus. Items render as a real `<a>` when
  `href` is set or a `<button>` otherwise, and always fire a cancelable `loomi-change` event
  so React Router, Vue Router, SvelteKit, Astro, Laravel, or any other router can own
  navigation instead of the component forcing full page loads.
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
- Updated dependencies [7d35f2f]
- Updated dependencies [8f0bc31]
- Updated dependencies [fe159c4]
- Updated dependencies [697386a]
- Updated dependencies [263ce12]
- Updated dependencies [697386a]
- Updated dependencies [e1e36b7]
  - @loomidev/core@0.2.0
  - @loomidev/icon@0.2.0
  - @loomidev/icons@0.2.0
