# @loomidev/date-range-picker

## 0.4.1

### Patch Changes

- @loomidev/button@0.4.1
- @loomidev/core@0.4.1
- @loomidev/datepicker@0.4.1

## 0.4.0

### Patch Changes

- 9344aad: Document the events that were missing from the custom-elements manifests. The analyzer
  only sees `new CustomEvent("literal-name")`, so events dispatched through a helper or a
  template literal — all nine `<loomi-data-grid>` events, the three
  `<loomi-date-range-picker>` events, `loomi-command-query-change`, `loomi-filter-apply`,
  `loomi-reminder-create`, the `<loomi-chat-window>` attachment and recording events, and
  `<loomi-input>`'s affix events — never reached `custom-elements.json`, and so never
  reached the React wrappers either. They are now declared with `@fires` and generate typed
  `on*` callback props.

  `<loomi-empty-state>` documented a `loomi-action` event it never fires; its JSDoc now
  names the `action` event the component actually dispatches.

- 9344aad: Drop bogus events from the custom-elements manifests. A component that dispatches through
  a helper — `new CustomEvent(name, …)` — made the analyzer record an event literally called
  `name` (or `type`), which then showed up in editor completions and framework integrations.
  `pnpm cem` now prunes any event named after a dispatch variable, along with unnamed ones.
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
  - @loomidev/button@0.4.0
  - @loomidev/core@0.4.0
  - @loomidev/datepicker@0.4.0

## 0.3.0

### Patch Changes

- @loomidev/button@0.3.0
- @loomidev/core@0.3.0
- @loomidev/datepicker@0.3.0

## 0.2.0

### Minor Changes

- fe159c4: First public release of LoomiUI.

  All `@loomidev/*` packages share a single version number and are released together,
  so any set of them installed at the same version is mutually compatible.

  Versions stay in the `0.x` range while the component APIs settle. Until `1.0.0`,
  a minor bump may contain breaking changes; pin an exact version if you need
  stability across upgrades.

### Patch Changes

- 505ea39: Replace raw gray ramps and `#ffffff` fallbacks with semantic Loomi surface, border, and
  on-primary text tokens so components respect dark mode and theme overrides consistently.
- Updated dependencies [49b905b]
- Updated dependencies [697386a]
- Updated dependencies [0b73a79]
- Updated dependencies [697386a]
- Updated dependencies [fe159c4]
- Updated dependencies [697386a]
- Updated dependencies [263ce12]
- Updated dependencies [e931227]
- Updated dependencies [697386a]
- Updated dependencies [5644747]
- Updated dependencies [e1e36b7]
  - @loomidev/button@0.2.0
  - @loomidev/core@0.2.0
  - @loomidev/datepicker@0.2.0
