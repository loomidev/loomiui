# @loomidev/content

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

- c9f3d6f: Add `<loomi-arc-meter>`, a semi-circle status meter with evenly distributed marker stops, a configurable marker color, and title/description labels.
- Updated dependencies [c9f3d6f]
- Updated dependencies [8c5fb3a]
- Updated dependencies [f4689e1]
- Updated dependencies [25c1177]
- Updated dependencies [505ea39]
- Updated dependencies [f954123]
- Updated dependencies [fe159c4]
- Updated dependencies [a0c78bd]
- Updated dependencies [505ea39]
- Updated dependencies [505ea39]
- Updated dependencies [7350966]
- Updated dependencies [f954123]
- Updated dependencies [e1e36b7]
- Updated dependencies [0d448ee]
- Updated dependencies [24cbb64]
- Updated dependencies [f954123]
  - @loomidev/arc-meter@0.2.0
  - @loomidev/avatar@0.2.0
  - @loomidev/calendar@0.2.0
  - @loomidev/card@0.2.0
  - @loomidev/empty-state@0.2.0
  - @loomidev/horizontal-line-graph@0.2.0
  - @loomidev/listview@0.2.0
  - @loomidev/popover@0.2.0
  - @loomidev/accordion@0.2.0
  - @loomidev/centered-content@0.2.0
  - @loomidev/chart@0.2.0
  - @loomidev/chat@0.2.0
  - @loomidev/contact-card@0.2.0
  - @loomidev/data-grid@0.2.0
  - @loomidev/divider@0.2.0
  - @loomidev/lightbox@0.2.0
  - @loomidev/photo-gallery@0.2.0
  - @loomidev/processing@0.2.0
  - @loomidev/progress@0.2.0
  - @loomidev/qrcode@0.2.0
  - @loomidev/rating@0.2.0
  - @loomidev/scroller@0.2.0
  - @loomidev/sortable@0.2.0
  - @loomidev/statistic@0.2.0
  - @loomidev/tag@0.2.0
  - @loomidev/timeline@0.2.0
  - @loomidev/timer@0.2.0
  - @loomidev/tooltip@0.2.0
  - @loomidev/video@0.2.0
