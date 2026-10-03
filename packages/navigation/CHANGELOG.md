# @loomidev/navigation

## 0.11.0

### Patch Changes

- @loomidev/bottom-nav@0.11.0
  - @loomidev/breadcrumb@0.11.0
  - @loomidev/command-palette@0.11.0
  - @loomidev/context-menu@0.11.0
  - @loomidev/dropmenu@0.11.0
  - @loomidev/pagination@0.11.0
  - @loomidev/profile-menu@0.11.0
  - @loomidev/side-nav@0.11.0
  - @loomidev/tab@0.11.0
  - @loomidev/theme-switcher@0.11.0
  - @loomidev/progress-steps@0.11.0

## 0.10.0

### Patch Changes

- ee9d5a7: Cut what components cost a consumer bundle.
  
  - Icons load on demand. `@loomidev/icons` no longer inlines Heroicons: each icon is its own module, loaded the first time it renders, through the new `loomiIcon()` directive, `hasLoomiIcon()` and `loadLoomiIcon()`. `getLoomiIcon()` now returns only icons that are ready (registered, provided or already loaded). `import "@loomidev/icons/all"` restores the eager set. Components ship their own chrome icons statically via `provideLoomiIcons()`. The Heroicons set is now complete (324 icons per variant).
  - Iconsax and Untitled UI are opt-in: `import "@loomidev/icons/iconsax"` / `"@loomidev/icons/untitledui"`. Until then their names are unknown and `<loomi-icon>` falls back to its slot with a one-time console warning. `<loomi-text-editor>` registers the toolbar icons it uses, so it needs neither.
  - Every package declares `"sideEffects"` precisely, so bundlers tree-shake unused modules.
  - `@loomidev/button` safelists only the utility classes it builds at runtime; its compiled styles drop from 89 KB to 14 KB. The button is now about 8.4 KB min+gz including styles (was about 102 KB).
  - `LOOMI_CONTROL_SIZES` moved to core's `size` module (same export from `@loomidev/core`), so importing it no longer pulls in the field stylesheets.
  - Each README has a Bundle size section, and `pnpm check:bundle-size` reports every package's size in CI with a 10 KB hard limit on the button.
- Updated dependencies [ee9d5a7]
- Updated dependencies [ef51d5e]
  - @loomidev/bottom-nav@0.10.0
  - @loomidev/breadcrumb@0.10.0
  - @loomidev/command-palette@0.10.0
  - @loomidev/context-menu@0.10.0
  - @loomidev/dropmenu@0.10.0
  - @loomidev/pagination@0.10.0
  - @loomidev/profile-menu@0.10.0
  - @loomidev/progress-steps@0.10.0
  - @loomidev/side-nav@0.10.0
  - @loomidev/tab@0.10.0
  - @loomidev/theme-switcher@0.10.0

## 0.9.0

### Patch Changes

- Updated dependencies [3bae883]
  - @loomidev/profile-menu@0.9.0
  - @loomidev/dropmenu@0.9.0
  - @loomidev/theme-switcher@0.9.0
  - @loomidev/bottom-nav@0.9.0
  - @loomidev/breadcrumb@0.9.0
  - @loomidev/command-palette@0.9.0
  - @loomidev/context-menu@0.9.0
  - @loomidev/pagination@0.9.0
  - @loomidev/progress-steps@0.9.0
  - @loomidev/side-nav@0.9.0
  - @loomidev/tab@0.9.0

## 0.8.0

### Patch Changes

- Updated dependencies [661d4c0]
- Updated dependencies [d48fb64]
  - @loomidev/profile-menu@0.8.0
  - @loomidev/progress-steps@0.8.0
  - @loomidev/side-nav@0.8.0
  - @loomidev/dropmenu@0.8.0
  - @loomidev/bottom-nav@0.8.0
  - @loomidev/breadcrumb@0.8.0
  - @loomidev/command-palette@0.8.0
  - @loomidev/context-menu@0.8.0
  - @loomidev/pagination@0.8.0
  - @loomidev/tab@0.8.0
  - @loomidev/theme-switcher@0.8.0

## 0.7.0

### Patch Changes

- Updated dependencies [c952b7d]
- Updated dependencies [9152ef3]
  - @loomidev/profile-menu@0.7.0
  - @loomidev/tab@0.7.0
  - @loomidev/bottom-nav@0.7.0
  - @loomidev/breadcrumb@0.7.0
  - @loomidev/command-palette@0.7.0
  - @loomidev/context-menu@0.7.0
  - @loomidev/dropmenu@0.7.0
  - @loomidev/pagination@0.7.0
  - @loomidev/progress-steps@0.7.0
  - @loomidev/side-nav@0.7.0
  - @loomidev/theme-switcher@0.7.0

## 0.6.0

### Patch Changes

- Updated dependencies [fd109c2]
- Updated dependencies [fd109c2]
- Updated dependencies [fd109c2]
- Updated dependencies [fd109c2]
- Updated dependencies [fd109c2]
  - @loomidev/progress-steps@0.6.0
  - @loomidev/breadcrumb@0.6.0
  - @loomidev/bottom-nav@0.6.0
  - @loomidev/command-palette@0.6.0
  - @loomidev/context-menu@0.6.0
  - @loomidev/dropmenu@0.6.0
  - @loomidev/pagination@0.6.0
  - @loomidev/profile-menu@0.6.0
  - @loomidev/side-nav@0.6.0
  - @loomidev/tab@0.6.0
  - @loomidev/theme-switcher@0.6.0

## 0.5.0

### Patch Changes

- Updated dependencies [450d1d3]
- Updated dependencies [87c5d42]
- Updated dependencies [ec8801a]
- Updated dependencies [ae725e5]
- Updated dependencies [50a4170]
- Updated dependencies [f854c5f]
- Updated dependencies [7227978]
- Updated dependencies [742f156]
  - @loomidev/context-menu@0.5.0
  - @loomidev/pagination@0.5.0
  - @loomidev/command-palette@0.5.0
  - @loomidev/dropmenu@0.5.0
  - @loomidev/profile-menu@0.5.0
  - @loomidev/bottom-nav@0.5.0
  - @loomidev/tab@0.5.0
  - @loomidev/theme-switcher@0.5.0
  - @loomidev/progress-steps@0.5.0
  - @loomidev/side-nav@0.5.0

## 0.4.1

### Patch Changes

- @loomidev/bottom-nav@0.4.1
- @loomidev/command-palette@0.4.1
- @loomidev/context-menu@0.4.1
- @loomidev/dropmenu@0.4.1
- @loomidev/pagination@0.4.1
- @loomidev/profile-menu@0.4.1
- @loomidev/progress-steps@0.4.1
- @loomidev/side-nav@0.4.1
- @loomidev/tab@0.4.1
- @loomidev/theme-switcher@0.4.1

## 0.4.0

### Patch Changes

- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
  - @loomidev/context-menu@0.4.0
  - @loomidev/pagination@0.4.0
  - @loomidev/command-palette@0.4.0
  - @loomidev/dropmenu@0.4.0
  - @loomidev/profile-menu@0.4.0
  - @loomidev/bottom-nav@0.4.0
  - @loomidev/tab@0.4.0
  - @loomidev/theme-switcher@0.4.0
  - @loomidev/progress-steps@0.4.0
  - @loomidev/side-nav@0.4.0

## 0.3.0

### Patch Changes

- Updated dependencies [868d518]
  - @loomidev/profile-menu@0.3.0
  - @loomidev/bottom-nav@0.3.0
  - @loomidev/command-palette@0.3.0
  - @loomidev/context-menu@0.3.0
  - @loomidev/dropmenu@0.3.0
  - @loomidev/pagination@0.3.0
  - @loomidev/progress-steps@0.3.0
  - @loomidev/side-nav@0.3.0
  - @loomidev/tab@0.3.0
  - @loomidev/theme-switcher@0.3.0

## 0.2.0

### Minor Changes

- f954123: Add `<loomi-bottom-nav>`/`<loomi-bottom-nav-item>`, a mobile bottom navigation bar with
  icons (via `<loomi-icon>`), badges, eight active-state styles (`pill`, `underline`,
  `top-line`, `background`, `icon-only`, `dot`, `border`, `minimal`), a `floating` variant,
  safe-area-aware positioning, and arrow-key roving focus. Items render as a real `<a>` when
  `href` is set or a `<button>` otherwise, and always fire a cancelable `loomi-change` event
  so React Router, Vue Router, SvelteKit, Astro, Laravel, or any other router can own
  navigation instead of the component forcing full page loads.
- fe159c4: First public release of LoomiUI.

  All `@loomidev/*` packages share a single version number and are released together,
  so any set of them installed at the same version is mutually compatible.

  Versions stay in the `0.x` range while the component APIs settle. Until `1.0.0`,
  a minor bump may contain breaking changes; pin an exact version if you need
  stability across upgrades.

### Patch Changes

- Updated dependencies [f954123]
- Updated dependencies [697386a]
- Updated dependencies [0e4b550]
- Updated dependencies [8e300d8]
- Updated dependencies [697386a]
- Updated dependencies [fe159c4]
- Updated dependencies [697386a]
- Updated dependencies [505ea39]
- Updated dependencies [697386a]
- Updated dependencies [e1e36b7]
  - @loomidev/bottom-nav@0.2.0
  - @loomidev/context-menu@0.2.0
  - @loomidev/dropmenu@0.2.0
  - @loomidev/command-palette@0.2.0
  - @loomidev/pagination@0.2.0
  - @loomidev/profile-menu@0.2.0
  - @loomidev/progress-steps@0.2.0
  - @loomidev/side-nav@0.2.0
  - @loomidev/tab@0.2.0
  - @loomidev/theme-switcher@0.2.0
