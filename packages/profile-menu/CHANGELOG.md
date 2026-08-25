# @loomidev/profile-menu

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
