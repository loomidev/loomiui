# @loomidev/timer

## 0.4.0

### Patch Changes

- 9344aad: Drop bogus events from the custom-elements manifests. A component that dispatches through
  a helper — `new CustomEvent(name, …)` — made the analyzer record an event literally called
  `name` (or `type`), which then showed up in editor completions and framework integrations.
  `pnpm cem` now prunes any event named after a dispatch variable, along with unnamed ones.
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
  - @loomidev/core@0.4.0

## 0.3.0

### Patch Changes

- @loomidev/core@0.3.0

## 0.2.0

### Minor Changes

- fe159c4: First public release of LoomiUI.

  All `@loomidev/*` packages share a single version number and are released together,
  so any set of them installed at the same version is mutually compatible.

  Versions stay in the `0.x` range while the component APIs settle. Until `1.0.0`,
  a minor bump may contain breaking changes; pin an exact version if you need
  stability across upgrades.

- 0d448ee: Add `<loomi-timer>`, an animated count up/down timer with optional controls, count-up stopwatch mode, count-down mode, themed progress styling, lifecycle events, and host font-size inheritance through normal `style` and `class` attributes.
- 24cbb64: `<loomi-timer>`: replace the `duration` attribute with `days`, `hours`, and `mins`
  (summed together to form the timer's length), always render Days/Hours/Mins/Secs
  digit segments with labels underneath, and add a `show-border` attribute
  (defaults to `false`) to toggle the background and border around the timer face.

### Patch Changes

- Updated dependencies [697386a]
- Updated dependencies [0b73a79]
- Updated dependencies [697386a]
- Updated dependencies [fe159c4]
- Updated dependencies [697386a]
- Updated dependencies [263ce12]
- Updated dependencies [697386a]
- Updated dependencies [e1e36b7]
  - @loomidev/core@0.2.0
