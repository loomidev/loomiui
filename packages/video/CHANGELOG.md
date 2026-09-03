# @loomidev/video

## 0.5.0

### Minor Changes

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

- 2bc1027: `<loomi-video>` no longer renders twice on first paint. It kept a `mediaReady` flag whose
  only job was to force a second pass so the picture-in-picture check could see the internal
  `<video>`; PiP support is a property of the browser, so it is now read from
  `HTMLVideoElement.prototype` and the control bar gets the button on the first render
  instead of growing one a frame later. The redundant volume read-back is gone too, and the
  one piece of state that genuinely depends on the rendered DOM — the subtitle track list —
  is read just after the update cycle rather than inside it.
- Updated dependencies [450d1d3]
- Updated dependencies [d3bc58c]
- Updated dependencies [450d1d3]
- Updated dependencies [ec8801a]
- Updated dependencies [ec8801a]
- Updated dependencies [7227978]
- Updated dependencies [742f156]
  - @loomidev/button@0.5.0
  - @loomidev/core@0.5.0
  - @loomidev/slider@0.5.0
  - @loomidev/icon@0.5.0
  - @loomidev/spinner@0.5.0

## 0.4.1

### Patch Changes

- @loomidev/button@0.4.1
- @loomidev/core@0.4.1
- @loomidev/icon@0.4.1
- @loomidev/slider@0.4.1
- @loomidev/spinner@0.4.1

## 0.4.0

### Minor Changes

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

- 9344aad: `<loomi-video>` no longer renders twice on first paint. It kept a `mediaReady` flag whose
  only job was to force a second pass so the picture-in-picture check could see the internal
  `<video>`; PiP support is a property of the browser, so it is now read from
  `HTMLVideoElement.prototype` and the control bar gets the button on the first render
  instead of growing one a frame later. The redundant volume read-back is gone too, and the
  one piece of state that genuinely depends on the rendered DOM — the subtitle track list —
  is read just after the update cycle rather than inside it.
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
  - @loomidev/button@0.4.0
  - @loomidev/core@0.4.0
  - @loomidev/slider@0.4.0
  - @loomidev/icon@0.4.0
  - @loomidev/spinner@0.4.0

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
