# @loomidev/icons

## 0.3.0

## 0.2.0

### Minor Changes

- 8f0bc31: Add `iconsax` (outline/solid/twotone) and `untitledui` (outline) icon sets, selected via the new `<loomi-icon source="...">` attribute (`heroicons` stays the default). Unlike Heroicons, these ship as real `.svg` files fetched and cached on demand instead of being inlined as JS, so using one icon from either set doesn't bundle the other few thousand.
- fe159c4: First public release of LoomiUI.

  All `@loomidev/*` packages share a single version number and are released together,
  so any set of them installed at the same version is mutually compatible.

  Versions stay in the `0.x` range while the component APIs settle. Until `1.0.0`,
  a minor bump may contain breaking changes; pin an exact version if you need
  stability across upgrades.
