# @loomidev/command-palette

## 0.4.1

### Patch Changes

- @loomidev/core@0.4.1

## 0.4.0

### Minor Changes

- 9344aad: Bring the three components with bespoke keyboard interaction in line with the WAI-ARIA
  Authoring Practices.

  `<loomi-command-palette>` announced nothing as you arrowed through results: focus stays in
  the search field, so the highlighted option needs `aria-activedescendant`, which was
  absent. The field is now a `role="combobox"` wired to the listbox, options carry ids and
  sit outside the tab order, `Home`/`End` jump to the first and last enabled commands, `Tab`
  no longer escapes a dialog marked `aria-modal="true"`, and closing hands focus back to
  wherever it came from.

  `<loomi-context-menu>` supports `ArrowRight` to open a submenu and `ArrowLeft` to close it.
  Submenus were previously reachable by pointer only.

  `<loomi-data-grid>` marks its table `role="grid"` — arrow-key cell navigation makes it an
  interactive grid rather than a static table, and the two are announced differently.
  Sortable headers now expose `aria-sort` instead of conveying direction through a ▲/▼ glyph
  alone (that glyph is now `aria-hidden`), and selectable rows carry `aria-selected`.

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

### Patch Changes

- 505ea39: Replace raw gray ramps and `#ffffff` fallbacks with semantic Loomi surface, border, and
  on-primary text tokens so components respect dark mode and theme overrides consistently.
- Updated dependencies [697386a]
- Updated dependencies [0b73a79]
- Updated dependencies [697386a]
- Updated dependencies [fe159c4]
- Updated dependencies [697386a]
- Updated dependencies [263ce12]
- Updated dependencies [697386a]
- Updated dependencies [e1e36b7]
  - @loomidev/core@0.2.0
