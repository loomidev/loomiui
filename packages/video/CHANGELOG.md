# @loomidev/video

## 0.3.0

### Patch Changes

- @loomidev/button@0.3.0
- @loomidev/core@0.3.0
- @loomidev/icon@0.3.0
- @loomidev/slider@0.3.0
- @loomidev/spinner@0.3.0

## 0.2.0

### Minor Changes

- fe159c4: First public release of LoomiUI.

  All `@loomidev/*` packages share a single version number and are released together,
  so any set of them installed at the same version is mutually compatible.

  Versions stay in the `0.x` range while the component APIs settle. Until `1.0.0`,
  a minor bump may contain breaking changes; pin an exact version if you need
  stability across upgrades.

- f954123: Add `<loomi-video>`, a themeable wrapper around the native `<video>` element. Renders the
  browser's real media element under the hood and layers a themed control bar on top —
  built from `@loomidev/button` and `@loomidev/slider` — with a circular play button, seek
  and volume sliders, captions menu, picture-in-picture, and fullscreen support. Without the
  `controls` attribute it's a bare, unstyled passthrough; with it, it adds loading/error
  overlays, a click-to-play poster overlay, full keyboard shortcuts, and a `controls` slot
  for fully custom markup. `<source>`/`<track>` children are forwarded onto the internal
  `<video>` element for multi-format fallback and subtitle/caption tracks.

### Patch Changes

- Updated dependencies [49b905b]
- Updated dependencies [697386a]
- Updated dependencies [0b73a79]
- Updated dependencies [697386a]
- Updated dependencies [7d35f2f]
- Updated dependencies [8f0bc31]
- Updated dependencies [fe159c4]
- Updated dependencies [697386a]
- Updated dependencies [263ce12]
- Updated dependencies [505ea39]
- Updated dependencies [e931227]
- Updated dependencies [697386a]
- Updated dependencies [e1e36b7]
  - @loomidev/button@0.2.0
  - @loomidev/core@0.2.0
  - @loomidev/icon@0.2.0
  - @loomidev/slider@0.2.0
  - @loomidev/spinner@0.2.0
