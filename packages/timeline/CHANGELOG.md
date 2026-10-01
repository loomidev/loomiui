# @loomidev/timeline

## 0.10.0

### Minor Changes

- ee9d5a7: Cut what components cost a consumer bundle.
  
  - Icons load on demand. `@loomidev/icons` no longer inlines Heroicons: each icon is its own module, loaded the first time it renders, through the new `loomiIcon()` directive, `hasLoomiIcon()` and `loadLoomiIcon()`. `getLoomiIcon()` now returns only icons that are ready (registered, provided or already loaded). `import "@loomidev/icons/all"` restores the eager set. Components ship their own chrome icons statically via `provideLoomiIcons()`. The Heroicons set is now complete (324 icons per variant).
  - Iconsax and Untitled UI are opt-in: `import "@loomidev/icons/iconsax"` / `"@loomidev/icons/untitledui"`. Until then their names are unknown and `<loomi-icon>` falls back to its slot with a one-time console warning. `<loomi-text-editor>` registers the toolbar icons it uses, so it needs neither.
  - Every package declares `"sideEffects"` precisely, so bundlers tree-shake unused modules.
  - `@loomidev/button` safelists only the utility classes it builds at runtime; its compiled styles drop from 89 KB to 14 KB. The button is now about 8.4 KB min+gz including styles (was about 102 KB).
  - `LOOMI_CONTROL_SIZES` moved to core's `size` module (same export from `@loomidev/core`), so importing it no longer pulls in the field stylesheets.
  - Each README has a Bundle size section, and `pnpm check:bundle-size` reports every package's size in CI with a 10 KB hard limit on the button.

### Patch Changes

- Updated dependencies [ee9d5a7]
- Updated dependencies [a0482d2]
- Updated dependencies [92bd99d]
- Updated dependencies [9f5d56f]
- Updated dependencies [29cce36]
  - @loomidev/core@0.10.0
  - @loomidev/icons@0.10.0

## 0.9.0

### Patch Changes

- @loomidev/core@0.9.0
  - @loomidev/icons@0.9.0

## 0.8.0

### Patch Changes

- Updated dependencies [661d4c0]
- Updated dependencies [d48fb64]
  - @loomidev/core@0.8.0
  - @loomidev/icons@0.8.0

## 0.7.0

### Patch Changes

- Updated dependencies [c952b7d]
  - @loomidev/core@0.7.0
  - @loomidev/icons@0.7.0

## 0.6.0

### Patch Changes

- Updated dependencies [fd109c2]
- Updated dependencies [fd109c2]
  - @loomidev/core@0.6.0
  - @loomidev/icons@0.6.0

## 0.5.0

### Patch Changes

- 5c97138: Fix two grouping components that silently ignored part of their own API, both found by
  writing the tests that were missing.

  `<loomi-progress-steps>` could not change step after its first render. It derives each
  step's state from `current`, but skipped any step whose state the author had set — and it
  detected that by reading attributes, which `active`, `completed` and `error` all reflect.
  The state the group wrote therefore came back as author intent on the next sync, freezing
  every step at whatever the first render produced. Author intent is now recorded once, the
  first time each step is seen.

  `<loomi-timeline>` overrode an item's explicit `placement` with the group's, where `icon`
  and `color` beside it correctly treat the group's value as a default. An explicit
  `<loomi-timeline-item placement="left">` inside a right-placed timeline now keeps its own.

- Updated dependencies [450d1d3]
- Updated dependencies [d3bc58c]
- Updated dependencies [ec8801a]
- Updated dependencies [742f156]
  - @loomidev/core@0.5.0
  - @loomidev/icons@0.5.0

## 0.4.1

### Patch Changes

- @loomidev/core@0.4.1
- @loomidev/icons@0.4.1

## 0.4.0

### Patch Changes

- 9344aad: Fix two grouping components that silently ignored part of their own API, both found by
  writing the tests that were missing.

  `<loomi-progress-steps>` could not change step after its first render. It derives each
  step's state from `current`, but skipped any step whose state the author had set — and it
  detected that by reading attributes, which `active`, `completed` and `error` all reflect.
  The state the group wrote therefore came back as author intent on the next sync, freezing
  every step at whatever the first render produced. Author intent is now recorded once, the
  first time each step is seen.

  `<loomi-timeline>` overrode an item's explicit `placement` with the group's, where `icon`
  and `color` beside it correctly treat the group's value as a default. An explicit
  `<loomi-timeline-item placement="left">` inside a right-placed timeline now keeps its own.

- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
  - @loomidev/core@0.4.0
  - @loomidev/icons@0.4.0

## 0.3.0

### Patch Changes

- @loomidev/core@0.3.0
- @loomidev/icons@0.3.0

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
- Updated dependencies [8f0bc31]
- Updated dependencies [fe159c4]
- Updated dependencies [697386a]
- Updated dependencies [263ce12]
- Updated dependencies [697386a]
- Updated dependencies [e1e36b7]
  - @loomidev/core@0.2.0
  - @loomidev/icons@0.2.0
