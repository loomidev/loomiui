# @loomidev/creditcard

## 0.12.0

### Patch Changes

- Updated dependencies [b16e5be]
  - @loomidev/core@0.12.0
  - @loomidev/theme@0.12.0

## 0.11.0

### Patch Changes

- Updated dependencies [fde1da3]
- Updated dependencies [e1723dc]
- Updated dependencies [624cfc1]
  - @loomidev/core@0.11.0
  - @loomidev/theme@0.11.0

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

### Patch Changes

- 87c5d42: Drop bogus events from the custom-elements manifests. A component that dispatches through
  a helper — `new CustomEvent(name, …)` — made the analyzer record an event literally called
  `name` (or `type`), which then showed up in editor completions and framework integrations.
  `pnpm cem` now prunes any event named after a dispatch variable, along with unnamed ones.
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

### Patch Changes

- 9344aad: Drop bogus events from the custom-elements manifests. A component that dispatches through
  a helper — `new CustomEvent(name, …)` — made the analyzer record an event literally called
  `name` (or `type`), which then showed up in editor completions and framework integrations.
  `pnpm cem` now prunes any event named after a dispatch variable, along with unnamed ones.
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

- 0b73a79: Add `<loomi-creditcard>`, a flippable credit-card input with cardholder name, number,
  expiry, and CVC fields. The network logo (Visa, Mastercard, Amex, Discover, Diners Club,
  JCB, UnionPay, Maestro) is detected live from the number's prefix and shown alongside a
  contactless-payment glyph on the front face; an edge button flips the card to its back to
  enter the CVC. `@loomidev/core` gains matching `creditcard.*` translations across all
  built-in locales.
- 505ea39: Add a `variant` attribute to `<loomi-creditcard>`. `variant="outline"` renders a bare
  card silhouette — soft gray border, no background fill — instead of the default
  full-color accent gradient face, for light or minimal UIs.
- fe159c4: First public release of LoomiUI.

  All `@loomidev/*` packages share a single version number and are released together,
  so any set of them installed at the same version is mutually compatible.

  Versions stay in the `0.x` range while the component APIs settle. Until `1.0.0`,
  a minor bump may contain breaking changes; pin an exact version if you need
  stability across upgrades.

### Patch Changes

- 505ea39: Replace raw gray ramps and `#ffffff` fallbacks with semantic Loomi surface, border, and
  on-primary text tokens so components respect dark mode and theme overrides consistently.
- 5644747: Make the vertical spacing below form fields themeable via a new `--loomi-field-spacing`
  token (default `1rem`). Stacked fields already shipped this margin on most components but not
  all — it's now consistent across every stacked field and overridable from `:root`:

  ```css
  :root {
    --loomi-field-spacing: 0; /* own field spacing yourself, e.g. via a flex/grid gap container */
  }
  ```

  `datepicker` and `timepicker` previously had no bottom margin and now match the other
  fields (a 1rem gap by default). `otp` (standalone/centered) and `colorpicker` (an inline
  swatch) intentionally keep no field margin. The per-instance `no-clearing` escape hatch is
  unchanged.

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
