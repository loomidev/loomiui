# @loomidev/icon

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
