# @loomidev/calendar

## 0.5.0

### Minor Changes

- 450d1d3: Export a typed `EventMap` (and named detail interfaces) from fourteen more component
  packages. `@loomidev/react` derives each `on*` callback's type from these, so events on
  these components now carry a typed `detail` instead of falling back to `any`.

### Patch Changes

- 450d1d3: Fix accessibility defects found by a new library-wide axe sweep, and retune the theme's
  text tokens so every tier meets WCAG AA contrast on both the light and dark surface —
  `--loomi-text-muted` and `--loomi-text-faint` each shift one step (darker in light mode,
  lighter in dark), which is visible wherever muted copy and placeholders are rendered.

  `<loomi-button>` now forwards an `aria-label` written on the host to the inner control,
  so icon-only buttons can be named the way consumers already expect. `<loomi-progress-bar>`
  and `<loomi-progress-circle>` gain `label`, `<loomi-context-menu>` gains `label` for
  triggers whose slotted content is not text, and `<loomi-chat-window>` gains `locale`.

  Also fixed: `<loomi-autocomplete>` marks its input `role="combobox"` (`aria-expanded` was
  not permitted without it), `<loomi-context-menu>`'s target carries a button role,
  `<loomi-resizable-handle>` reports `aria-valuenow`, and the previously unnamed controls in
  `<loomi-pagination>`, `<loomi-colorpicker>`, `<loomi-filepicker>` and `<loomi-chat-window>`
  now have accessible names.

- ad81ae1: Deepen tests across the packages that still carried a single smoke test. `calendar` covers
  view switching, event rendering and re-rendering, locale-driven weekday headings and week
  start; `date-range-picker` covers open/close, presets and range reflection; `checkcards`
  covers selection limits and form submission; `filter-builder` covers adding, removing and
  emitting; plus keyboard coverage for the components changed alongside.

  Writing them pinned down three defaults that are easy to get wrong from the outside:
  `<loomi-calendar>` hides weekends unless asked, `<loomi-date-range-picker>` shows presets
  unless asked not to, and `<loomi-otp>` sizes itself from `total-digits` rather than
  `digits`.

- 87c5d42: Document the events that were missing from the custom-elements manifests. The analyzer
  only sees `new CustomEvent("literal-name")`, so events dispatched through a helper or a
  template literal — all nine `<loomi-data-grid>` events, the three
  `<loomi-date-range-picker>` events, `loomi-command-query-change`, `loomi-filter-apply`,
  `loomi-reminder-create`, the `<loomi-chat-window>` attachment and recording events, and
  `<loomi-input>`'s affix events — never reached `custom-elements.json`, and so never
  reached the React wrappers either. They are now declared with `@fires` and generate typed
  `on*` callback props.

  `<loomi-empty-state>` documented a `loomi-action` event it never fires; its JSDoc now
  names the `action` event the component actually dispatches.

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
- Updated dependencies [87c5d42]
- Updated dependencies [ec8801a]
- Updated dependencies [450d1d3]
- Updated dependencies [fdac5da]
- Updated dependencies [ec8801a]
- Updated dependencies [ae725e5]
- Updated dependencies [ad81ae1]
- Updated dependencies [87c5d42]
- Updated dependencies [7227978]
- Updated dependencies [742f156]
  - @loomidev/context-menu@0.5.0
  - @loomidev/core@0.5.0
  - @loomidev/input@0.5.0
  - @loomidev/dropmenu@0.5.0
  - @loomidev/datepicker@0.5.0
  - @loomidev/modal@0.5.0
  - @loomidev/timepicker@0.5.0
  - @loomidev/toggle@0.5.0
  - @loomidev/select@0.5.0
  - @loomidev/tag-input@0.5.0
  - @loomidev/textarea@0.5.0
  - @loomidev/tooltip@0.5.0

## 0.4.1

### Patch Changes

- @loomidev/context-menu@0.4.1
- @loomidev/core@0.4.1
- @loomidev/datepicker@0.4.1
- @loomidev/dropmenu@0.4.1
- @loomidev/input@0.4.1
- @loomidev/modal@0.4.1
- @loomidev/select@0.4.1
- @loomidev/tag-input@0.4.1
- @loomidev/textarea@0.4.1
- @loomidev/timepicker@0.4.1
- @loomidev/toggle@0.4.1
- @loomidev/tooltip@0.4.1

## 0.4.0

### Minor Changes

- 9344aad: Export a typed `EventMap` (and named detail interfaces) from fourteen more component
  packages. `@loomidev/react` derives each `on*` callback's type from these, so events on
  these components now carry a typed `detail` instead of falling back to `any`.

### Patch Changes

- 9344aad: Fix accessibility defects found by a new library-wide axe sweep, and retune the theme's
  text tokens so every tier meets WCAG AA contrast on both the light and dark surface —
  `--loomi-text-muted` and `--loomi-text-faint` each shift one step (darker in light mode,
  lighter in dark), which is visible wherever muted copy and placeholders are rendered.

  `<loomi-button>` now forwards an `aria-label` written on the host to the inner control,
  so icon-only buttons can be named the way consumers already expect. `<loomi-progress-bar>`
  and `<loomi-progress-circle>` gain `label`, `<loomi-context-menu>` gains `label` for
  triggers whose slotted content is not text, and `<loomi-chat-window>` gains `locale`.

  Also fixed: `<loomi-autocomplete>` marks its input `role="combobox"` (`aria-expanded` was
  not permitted without it), `<loomi-context-menu>`'s target carries a button role,
  `<loomi-resizable-handle>` reports `aria-valuenow`, and the previously unnamed controls in
  `<loomi-pagination>`, `<loomi-colorpicker>`, `<loomi-filepicker>` and `<loomi-chat-window>`
  now have accessible names.

- 9344aad: Deepen tests across the packages that still carried a single smoke test. `calendar` covers
  view switching, event rendering and re-rendering, locale-driven weekday headings and week
  start; `date-range-picker` covers open/close, presets and range reflection; `checkcards`
  covers selection limits and form submission; `filter-builder` covers adding, removing and
  emitting; plus keyboard coverage for the components changed alongside.

  Writing them pinned down three defaults that are easy to get wrong from the outside:
  `<loomi-calendar>` hides weekends unless asked, `<loomi-date-range-picker>` shows presets
  unless asked not to, and `<loomi-otp>` sizes itself from `total-digits` rather than
  `digits`.

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
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
  - @loomidev/context-menu@0.4.0
  - @loomidev/core@0.4.0
  - @loomidev/input@0.4.0
  - @loomidev/dropmenu@0.4.0
  - @loomidev/datepicker@0.4.0
  - @loomidev/modal@0.4.0
  - @loomidev/timepicker@0.4.0
  - @loomidev/toggle@0.4.0
  - @loomidev/select@0.4.0
  - @loomidev/tag-input@0.4.0
  - @loomidev/textarea@0.4.0
  - @loomidev/tooltip@0.4.0

## 0.3.0

### Patch Changes

- @loomidev/context-menu@0.3.0
- @loomidev/core@0.3.0
- @loomidev/datepicker@0.3.0
- @loomidev/dropmenu@0.3.0
- @loomidev/input@0.3.0
- @loomidev/modal@0.3.0
- @loomidev/select@0.3.0
- @loomidev/tag-input@0.3.0
- @loomidev/textarea@0.3.0
- @loomidev/timepicker@0.3.0
- @loomidev/toggle@0.3.0
- @loomidev/tooltip@0.3.0

## 0.2.0

### Minor Changes

- fe159c4: First public release of LoomiUI.

  All `@loomidev/*` packages share a single version number and are released together,
  so any set of them installed at the same version is mutually compatible.

  Versions stay in the `0.x` range while the component APIs settle. Until `1.0.0`,
  a minor bump may contain breaking changes; pin an exact version if you need
  stability across upgrades.

### Patch Changes

- 25c1177: Fixed the resource scheduler (`view="resource"`) rendering each room/resource row far
  too tall (up to hundreds of pixels instead of the intended ~72px) and positioning events
  under the wrong hour column on any viewport too narrow to fit every hour at its 80px
  minimum width. Both were caused by `.resource-timeline`: a stray `min-height` formula
  meant for the vertical day/week grid was overriding its intended fixed row height, and
  its absolutely-positioned `.resource-track` child contributed no intrinsic width of its
  own, so the row could compute a narrower width than the header above it and throw off
  the event `left`/`width` percentages.
- 505ea39: Replace raw gray ramps and `#ffffff` fallbacks with semantic Loomi surface, border, and
  on-primary text tokens so components respect dark mode and theme overrides consistently.
- Updated dependencies [697386a]
- Updated dependencies [0b73a79]
- Updated dependencies [0e4b550]
- Updated dependencies [8e300d8]
- Updated dependencies [697386a]
- Updated dependencies [fe159c4]
- Updated dependencies [0b97dfb]
- Updated dependencies [697386a]
- Updated dependencies [263ce12]
- Updated dependencies [505ea39]
- Updated dependencies [697386a]
- Updated dependencies [5644747]
- Updated dependencies [e1e36b7]
  - @loomidev/core@0.2.0
  - @loomidev/context-menu@0.2.0
  - @loomidev/dropmenu@0.2.0
  - @loomidev/datepicker@0.2.0
  - @loomidev/input@0.2.0
  - @loomidev/modal@0.2.0
  - @loomidev/select@0.2.0
  - @loomidev/tag-input@0.2.0
  - @loomidev/textarea@0.2.0
  - @loomidev/timepicker@0.2.0
  - @loomidev/toggle@0.2.0
  - @loomidev/tooltip@0.2.0
