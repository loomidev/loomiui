# @loomidev/radio

## 0.10.0

### Minor Changes

- 29cce36: Form controls now follow the native value-and-events contract (documented in `@loomidev/core`'s README), so framework two-way bindings work on the tags directly.
  
  - `<loomi-select>` gains a settable `value` (comma-joined when `multiple`) and `values` (`string[]`), and fires `input` before `change` on every pick. Typing in its search box no longer fires `input` on the host, and a pick survives a later `data` swap.
  - `<loomi-checkbox>` and `<loomi-toggle>` expose a read-only `type` of `"checkbox"`, `<loomi-radio>` one of `"radio"`. All three fire `input` (with `checked` already updated) before `change`. Setting a radio's `checked` unchecks the rest of its group, as a native radio does.
  - `<loomi-otp>` gains a settable `value` and now fires `input` on each edit and `change` when focus leaves the boxes. Moving it in the DOM no longer clears the code.
  - `<loomi-datepicker>`, `<loomi-timepicker>` and `<loomi-slider>` turn their read-only `value` into a settable one. `<loomi-checkcards>` gains `value`/`values`. `<loomi-filepicker>` gains a native-style `value` (set `""` to clear). Each now fires `input` before `change` on user edits. The timepicker and checkcards honor `selected-value` changes after the first render, and the timepicker converts between 12- and 24-hour input.
  - `<loomi-input>`, `<loomi-password>`, `<loomi-textarea>`, `<loomi-number>`, `<loomi-autocomplete>`, `<loomi-tag-input>`, `<loomi-text-editor>` and `<loomi-slider>` fire exactly one `input` per edit (the inner field's native event used to leak through as a second one). Text fields re-sync when a listener rewrites `value` mid-edit.
  - `<loomi-text-editor>` fires `change` only when focus leaves after an edit, not on every blur. `<loomi-number>` no longer fires an extra `input` on commit unless the commit clamped the number. `<loomi-autocomplete>` commits typed free text with `change` on leaving the field. `<loomi-timepicker>` no longer fires `change` for a pick that leaves the time unchanged.
  - `@loomidev/react` wrappers gain `onInput` where the controls newly declare `input`.

### Patch Changes

- ee9d5a7: Cut what components cost a consumer bundle.
  
  - Icons load on demand. `@loomidev/icons` no longer inlines Heroicons: each icon is its own module, loaded the first time it renders, through the new `loomiIcon()` directive, `hasLoomiIcon()` and `loadLoomiIcon()`. `getLoomiIcon()` now returns only icons that are ready (registered, provided or already loaded). `import "@loomidev/icons/all"` restores the eager set. Components ship their own chrome icons statically via `provideLoomiIcons()`. The Heroicons set is now complete (324 icons per variant).
  - Iconsax and Untitled UI are opt-in: `import "@loomidev/icons/iconsax"` / `"@loomidev/icons/untitledui"`. Until then their names are unknown and `<loomi-icon>` falls back to its slot with a one-time console warning. `<loomi-text-editor>` registers the toolbar icons it uses, so it needs neither.
  - Every package declares `"sideEffects"` precisely, so bundlers tree-shake unused modules.
  - `@loomidev/button` safelists only the utility classes it builds at runtime; its compiled styles drop from 89 KB to 14 KB. The button is now about 8.4 KB min+gz including styles (was about 102 KB).
  - `LOOMI_CONTROL_SIZES` moved to core's `size` module (same export from `@loomidev/core`), so importing it no longer pulls in the field stylesheets.
  - Each README has a Bundle size section, and `pnpm check:bundle-size` reports every package's size in CI with a 10 KB hard limit on the button.
- Updated dependencies [ee9d5a7]
- Updated dependencies [a0482d2]
- Updated dependencies [92bd99d]
- Updated dependencies [9f5d56f]
- Updated dependencies [29cce36]
  - @loomidev/core@0.10.0
  - @loomidev/theme@0.10.0

## 0.9.0

### Patch Changes

- @loomidev/core@0.9.0
  - @loomidev/theme@0.9.0

## 0.8.0

### Patch Changes

- Updated dependencies [661d4c0]
- Updated dependencies [d48fb64]
  - @loomidev/core@0.8.0
  - @loomidev/theme@0.8.0

## 0.7.0

### Patch Changes

- Updated dependencies [c952b7d]
  - @loomidev/core@0.7.0
  - @loomidev/theme@0.7.0

## 0.6.0

### Patch Changes

- Updated dependencies [fd109c2]
- Updated dependencies [fd109c2]
  - @loomidev/core@0.6.0
  - @loomidev/theme@0.6.0

## 0.5.0

### Minor Changes

- 450d1d3: Export a typed `EventMap` (and named detail interfaces) from fourteen more component
  packages. `@loomidev/react` derives each `on*` callback's type from these, so events on
  these components now carry a typed `detail` instead of falling back to `any`.

### Patch Changes

- ec8801a: Restore every form-associated control to its initial state through native form resets,
  document submitted value formats, and add generated React 18 and React 19 JSX types.
- 7227978: Support server-side rendering. Every component now renders to Declarative Shadow DOM
  under `@lit-labs/ssr`, so a page can ship real, styled markup before any JavaScript runs
  — from Astro, Nuxt or Next.js, or as static HTML served by Rails, Laravel or Django.

  Sixteen components previously threw when rendered without a DOM, because they read light
  DOM children, measured layout, or wrote inline styles on the host during `render()`.
  Those reads are now guarded with lit's `isServer`. Components that derive content from
  light-DOM children (`<loomi-select>` with `<option>` elements, `<loomi-tabs>`,
  `<loomi-table>` with a `<template slot="row">`) render without that content on the server
  and fill it in at hydration; passing the same data through properties server-renders.

  `<loomi-timepicker>`'s clock stylesheet is now interpolated as a static value rather than
  a binding, since lit-html cannot bind inside a `<style>` element.

- Updated dependencies [450d1d3]
- Updated dependencies [d3bc58c]
- Updated dependencies [742f156]
  - @loomidev/theme@0.5.0
  - @loomidev/core@0.5.0

## 0.4.1

### Patch Changes

- @loomidev/core@0.4.1
- @loomidev/theme@0.4.1

## 0.4.0

### Minor Changes

- 9344aad: Export a typed `EventMap` (and named detail interfaces) from fourteen more component
  packages. `@loomidev/react` derives each `on*` callback's type from these, so events on
  these components now carry a typed `detail` instead of falling back to `any`.

### Patch Changes

- 9344aad: Restore every form-associated control to its initial state through native form resets,
  document submitted value formats, and add generated React 18 and React 19 JSX types.
- 9344aad: Support server-side rendering. Every component now renders to Declarative Shadow DOM
  under `@lit-labs/ssr`, so a page can ship real, styled markup before any JavaScript runs
  — from Astro, Nuxt or Next.js, or as static HTML served by Rails, Laravel or Django.

  Sixteen components previously threw when rendered without a DOM, because they read light
  DOM children, measured layout, or wrote inline styles on the host during `render()`.
  Those reads are now guarded with lit's `isServer`. Components that derive content from
  light-DOM children (`<loomi-select>` with `<option>` elements, `<loomi-tabs>`,
  `<loomi-table>` with a `<template slot="row">`) render without that content on the server
  and fill it in at hydration; passing the same data through properties server-renders.

  `<loomi-timepicker>`'s clock stylesheet is now interpolated as a static value rather than
  a binding, since lit-html cannot bind inside a `<style>` element.

- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
  - @loomidev/theme@0.4.0
  - @loomidev/core@0.4.0

## 0.3.0

### Patch Changes

- @loomidev/core@0.3.0
- @loomidev/theme@0.3.0

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
- Updated dependencies [fe159c4]
- Updated dependencies [697386a]
- Updated dependencies [263ce12]
- Updated dependencies [697386a]
- Updated dependencies [49b905b]
- Updated dependencies [5644747]
- Updated dependencies [e1e36b7]
  - @loomidev/core@0.2.0
  - @loomidev/theme@0.2.0
