# @loomidev/icon

## 0.3.0

### Patch Changes

- @loomidev/core@0.3.0
- @loomidev/icons@0.3.0

## 0.2.0

### Minor Changes

- 7d35f2f: Add `branded`, `shade`, and `radius` to `<loomi-icon>` for rendering icons on a rounded, primary-colored background badge (`shade="light"` for a soft tint, `shade="dark"` for a solid fill), matching the theme override behavior every other component already has.
- 8f0bc31: Add `iconsax` (outline/solid/twotone) and `untitledui` (outline) icon sets, selected via the new `<loomi-icon source="...">` attribute (`heroicons` stays the default). Unlike Heroicons, these ship as real `.svg` files fetched and cached on demand instead of being inlined as JS, so using one icon from either set doesn't bundle the other few thousand.
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
- Updated dependencies [8f0bc31]
- Updated dependencies [fe159c4]
- Updated dependencies [697386a]
- Updated dependencies [263ce12]
- Updated dependencies [697386a]
- Updated dependencies [e1e36b7]
  - @loomidev/core@0.2.0
  - @loomidev/icons@0.2.0
