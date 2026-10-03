# @loomidev/icon

## 0.12.0

### Patch Changes

- Updated dependencies [b16e5be]
  - @loomidev/core@0.12.0
  - @loomidev/icons@0.12.0

## 0.11.0

### Patch Changes

- Updated dependencies [fde1da3]
- Updated dependencies [e1723dc]
- Updated dependencies [624cfc1]
  - @loomidev/core@0.11.0
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

- fd109c2: Fix the `branded` badge rendering with square corners regardless of `radius`.
  
  The `radius` presets mapped to Tailwind `rounded-*` classes, but the icon package's style
  build scans no sources, so those utilities were never compiled and every badge had
  `border-radius: 0`. The presets are now plain CSS. The badge is also exposed as
  `::part(badge)`, and a new `--loomi-icon-radius` custom property overrides the preset.
- Updated dependencies [fd109c2]
- Updated dependencies [fd109c2]
  - @loomidev/core@0.6.0
  - @loomidev/icons@0.6.0

## 0.5.0

### Minor Changes

- ec8801a: Fix `source="iconsax"` and `source="untitledui"` rendering blank in bundled apps.

  Disk-based icons resolved their `.svg` files through `new URL("./svg/", import.meta.url)`.
  A bundler inlines that module into a chunk and never copies `dist/svg/`, so the URL
  pointed somewhere that does not exist and the fetch 404'd — silently, because a failed
  fetch leaves the sized placeholder `<svg>` empty. Vite's dev server made it worse by
  serving `node_modules` over HTTP, so it only broke in production builds.

  Icons now load from per-icon ES modules generated into `dist/icons/`, referenced through
  static literal specifiers that every bundler can trace and code-split. No configuration
  and no asset-copying step.

  Two additions for finer control:

  - `registerLoomiDiskIcon(source, name, markup, type?)` renders a statically imported icon
    with no runtime lookup and no dynamic chunk, via the new
    `@loomidev/icons/icons/<source>/<type>/<name>.js` subpath.
  - `setLoomiIconBasePath(path)` / `getLoomiIconBasePath()` serve the raw `.svg` files from
    a path you control — a copied folder or a CDN — keeping icon data out of your JS.

  Also adds `hasLoomiDiskIcon(source, name, type?)`, a synchronous name check that loads
  nothing. The raw `.svg` files still ship and still resolve wherever the package keeps its
  real module URL (CDN, import map, plain `<script type="module">`).

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
- Updated dependencies [ec8801a]
- Updated dependencies [742f156]
  - @loomidev/core@0.5.0
  - @loomidev/icons@0.5.0

## 0.4.1

### Patch Changes

- @loomidev/core@0.4.1
- @loomidev/icons@0.4.1

## 0.4.0

### Minor Changes

- 9344aad: Fix `source="iconsax"` and `source="untitledui"` rendering blank in bundled apps.

  Disk-based icons resolved their `.svg` files through `new URL("./svg/", import.meta.url)`.
  A bundler inlines that module into a chunk and never copies `dist/svg/`, so the URL
  pointed somewhere that does not exist and the fetch 404'd — silently, because a failed
  fetch leaves the sized placeholder `<svg>` empty. Vite's dev server made it worse by
  serving `node_modules` over HTTP, so it only broke in production builds.

  Icons now load from per-icon ES modules generated into `dist/icons/`, referenced through
  static literal specifiers that every bundler can trace and code-split. No configuration
  and no asset-copying step.

  Two additions for finer control:

  - `registerLoomiDiskIcon(source, name, markup, type?)` renders a statically imported icon
    with no runtime lookup and no dynamic chunk, via the new
    `@loomidev/icons/icons/<source>/<type>/<name>.js` subpath.
  - `setLoomiIconBasePath(path)` / `getLoomiIconBasePath()` serve the raw `.svg` files from
    a path you control — a copied folder or a CDN — keeping icon data out of your JS.

  Also adds `hasLoomiDiskIcon(source, name, type?)`, a synchronous name check that loads
  nothing. The raw `.svg` files still ship and still resolve wherever the package keeps its
  real module URL (CDN, import map, plain `<script type="module">`).

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
  - @loomidev/core@0.4.0
  - @loomidev/icons@0.4.0

## 0.3.0

### Patch Changes

- @loomidev/core@0.3.0
- @loomidev/icons@0.3.0

## 0.2.0

### Minor Changes

- 7d35f2f: Add `branded`, `shade`, and `radius` to `<loomi-icon>` for rendering icons on a rounded, primary-colored background badge (`shade="light"` for a soft tint, `shade="dark"` for a solid fill), matching the theme override behavior every other component already has.
- 8f0bc31: Add `iconsax` (outline/solid/twotone) and `untitledui` (outline) icon sets, selected via the new `<loomi-icon source="...">` attribute (`heroicons` stays the default). Unlike Heroicons, these ship as real `.svg` files fetched and cached on demand instead of being inlined as JS, so using one icon from either set doesn't bundle the other few thousand.
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
