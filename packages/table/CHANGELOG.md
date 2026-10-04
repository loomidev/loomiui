# @loomidev/table

## 0.12.0

### Patch Changes

- Updated dependencies [b16e5be]
  - @loomidev/core@0.12.0
  - @loomidev/checkbox@0.12.0
  - @loomidev/input@0.12.0
  - @loomidev/pagination@0.12.0
  - @loomidev/icons@0.12.0

## 0.11.0

### Patch Changes

- Updated dependencies [fde1da3]
- Updated dependencies [e1723dc]
- Updated dependencies [f8d070d]
- Updated dependencies [fde1da3]
- Updated dependencies [624cfc1]
  - @loomidev/core@0.11.0
  - @loomidev/input@0.11.0
  - @loomidev/checkbox@0.11.0
  - @loomidev/pagination@0.11.0
  - @loomidev/icons@0.11.0

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
  - @loomidev/checkbox@0.10.0
  - @loomidev/core@0.10.0
  - @loomidev/icons@0.10.0
  - @loomidev/input@0.10.0
  - @loomidev/pagination@0.10.0

## 0.9.0

### Patch Changes

- @loomidev/input@0.9.0
  - @loomidev/checkbox@0.9.0
  - @loomidev/core@0.9.0
  - @loomidev/icons@0.9.0
  - @loomidev/pagination@0.9.0

## 0.8.0

### Patch Changes

- Updated dependencies [661d4c0]
- Updated dependencies [d48fb64]
  - @loomidev/core@0.8.0
  - @loomidev/input@0.8.0
  - @loomidev/checkbox@0.8.0
  - @loomidev/pagination@0.8.0
  - @loomidev/icons@0.8.0

## 0.7.0

### Minor Changes

- c952b7d: A table wider than its container now makes its scroll box a focusable, labelled `role="region"` with a visible focus ring, so keyboard users can reach it and scroll with the arrow keys (axe `scrollable-region-focusable`). It reverts to a plain box once the table fits. Name it with the new `aria-label` attribute, else the host `title`, else the localized "Scrollable table" (new `table.scrollRegion` key in core's locales). The scroll box is exposed as `part="scroll"`.

### Patch Changes

- Updated dependencies [c952b7d]
  - @loomidev/core@0.7.0
  - @loomidev/checkbox@0.7.0
  - @loomidev/icons@0.7.0
  - @loomidev/input@0.7.0
  - @loomidev/pagination@0.7.0

## 0.6.0

### Minor Changes

- fd109c2: Add a `<template slot="body">` for static rows, so a manually authored table works in plain HTML. The README's manual-layout example used bare `<th>`/`<tr>` children, which the HTML parser drops before they reach the component.

### Patch Changes

- Updated dependencies [fd109c2]
- Updated dependencies [fd109c2]
  - @loomidev/core@0.6.0
  - @loomidev/checkbox@0.6.0
  - @loomidev/input@0.6.0
  - @loomidev/pagination@0.6.0
  - @loomidev/icons@0.6.0

## 0.5.0

### Patch Changes

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
- Updated dependencies [450d1d3]
- Updated dependencies [fdac5da]
- Updated dependencies [ec8801a]
- Updated dependencies [ec8801a]
- Updated dependencies [87c5d42]
- Updated dependencies [7227978]
- Updated dependencies [742f156]
  - @loomidev/core@0.5.0
  - @loomidev/pagination@0.5.0
  - @loomidev/input@0.5.0
  - @loomidev/checkbox@0.5.0
  - @loomidev/icons@0.5.0

## 0.4.1

### Patch Changes

- @loomidev/checkbox@0.4.1
- @loomidev/core@0.4.1
- @loomidev/icons@0.4.1
- @loomidev/input@0.4.1
- @loomidev/pagination@0.4.1

## 0.4.0

### Patch Changes

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
  - @loomidev/core@0.4.0
  - @loomidev/pagination@0.4.0
  - @loomidev/input@0.4.0
  - @loomidev/checkbox@0.4.0
  - @loomidev/icons@0.4.0

## 0.3.0

### Patch Changes

- @loomidev/checkbox@0.3.0
- @loomidev/core@0.3.0
- @loomidev/icons@0.3.0
- @loomidev/input@0.3.0
- @loomidev/pagination@0.3.0

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
- 7350966: Fixed `<loomi-table>` and `<loomi-data-grid>`'s dark-mode heading/divider colors never
  actually applying. Both used `:host-context(.dark)` to swap in dark-aware tokens, but
  that selector has no Firefox support and isn't recognized by the build's CSS optimizer
  either, so the override silently never took effect in any browser. Both components now
  watch `.dark` on `<html>` in JS (via `watchDarkMode()` from `@loomidev/core`) and reflect
  it as an `.is-dark` class on themselves instead, matching the pattern `<loomi-button>`
  already uses.
- f954123: Update `<loomi-table>` and `<loomi-data-grid>` header background and row-divider colors to a warmer cream/tan tone in light mode (overridable via `--loomi-table-heading-bg`/`--loomi-table-divider` and `--loomi-data-grid-heading-bg`/`--loomi-data-grid-divider`). Dark mode is unaffected — it still falls back to the standard surface tokens.

  Also updates the card drop shadow to a subtler, closer-in style matching the same reference design: tightened on `<loomi-table>`'s `has-shadow` shell, and newly added to `<loomi-data-grid>`'s shell (which previously had none).

- e1e36b7: Make corner radius and control density themeable from `:root`, closing the gap where a
  downloaded theme could recolor components but couldn't reshape them.

  `@loomidev/theme` now ships four public token slots (defaults preserve current rendering
  exactly, so this is additive — no visual change unless you override them):

  - `--loomi-control-radius` (default `0.5rem`) — inputs, selects, buttons, checkbox, tag,
    tabs, pagination, pin, and every field-style control.
  - `--loomi-panel-radius` (default `0.875rem`) — cards, modals, popovers, menus, dropdown
    panels, tables, notifications, statistic/checkcards.
  - `--loomi-pill-radius` (default `9999px`) — pill/`radius="full"` shapes and pill tags.
  - `--loomi-density` (default `1`) — a unitless multiplier scaling control height and
    horizontal padding together (font size stays fixed), e.g. `:root { --loomi-density: 0.85 }`
    for a compact UI. Composes with the per-`size` presets rather than replacing them.

  Precedence is per-instance attribute → `:root` theme override → built-in default: an
  explicit `radius="full"`/`size="small"` still wins over a global token, while the _default_
  preset now defers to the theme. `<loomi-button>`'s `radius` attribute is reimplemented on
  top of `--loomi-control-radius`/`--loomi-pill-radius` instead of fixed Tailwind classes;
  its markup API is unchanged. True geometry (circular avatars, spinners, toggles, chart/QR/
  credit-card art) is intentionally left fixed and does not read these tokens.

- Updated dependencies [697386a]
- Updated dependencies [0b73a79]
- Updated dependencies [697386a]
- Updated dependencies [8f0bc31]
- Updated dependencies [fe159c4]
- Updated dependencies [697386a]
- Updated dependencies [263ce12]
- Updated dependencies [697386a]
- Updated dependencies [5644747]
- Updated dependencies [e1e36b7]
  - @loomidev/core@0.2.0
  - @loomidev/icons@0.2.0
  - @loomidev/checkbox@0.2.0
  - @loomidev/input@0.2.0
  - @loomidev/pagination@0.2.0
