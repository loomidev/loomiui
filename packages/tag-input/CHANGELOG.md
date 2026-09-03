# @loomidev/tag-input

## 0.5.0

### Minor Changes

- ad81ae1: Give the remaining components with custom key handling the keyboard behavior their
  patterns call for.

  `<loomi-datepicker>`'s month was 31 individually tab-focusable buttons and no arrow keys,
  so reaching a date meant tabbing through the month and leaving meant tabbing past the rest
  of it. The grid now follows the WAI-ARIA date-grid pattern: `role="grid"` with
  `columnheader` and `gridcell` semantics, a single roving tab stop that starts on the
  selected day, arrows moving by day and week, `Home`/`End` for the ends of the week,
  `PageUp`/`PageDown` for months, and arrowing off either end scrolling into the neighbouring
  month. Each day also carries its full date as an accessible name — "10" alone means nothing
  read aloud — and the selected day is marked `aria-selected`. `<loomi-date-range-picker>`
  composes this calendar, so it inherits all of it.

  `<loomi-otp>` only moved backwards, on Backspace into an empty box. Left and right arrows
  now walk between boxes and `Home`/`End` jump to the ends, so correcting an earlier digit no
  longer means the mouse or clearing everything after it.

  `<loomi-tag-input>`'s suggestion list had `role="listbox"` and arrow keys but no
  `aria-activedescendant`: focus stays in the text field, so the highlighted suggestion was
  announced to nobody. The field is now a `role="combobox"` wired to the listbox, and the
  suggestions carry ids.

### Patch Changes

- ec8801a: Restore every form-associated control to its initial state through native form resets,
  document submitted value formats, and add generated React 18 and React 19 JSX types.
- 87c5d42: Drop bogus events from the custom-elements manifests. A component that dispatches through
  a helper — `new CustomEvent(name, …)` — made the analyzer record an event literally called
  `name` (or `type`), which then showed up in editor completions and framework integrations.
  `pnpm cem` now prunes any event named after a dispatch variable, along with unnamed ones.
- Updated dependencies [450d1d3]
- Updated dependencies [d3bc58c]
- Updated dependencies [ec8801a]
- Updated dependencies [742f156]
  - @loomidev/theme@0.5.0
  - @loomidev/core@0.5.0
  - @loomidev/icons@0.5.0

## 0.4.1

### Patch Changes

- @loomidev/core@0.4.1
- @loomidev/icons@0.4.1
- @loomidev/theme@0.4.1

## 0.4.0

### Minor Changes

- 9344aad: Give the remaining components with custom key handling the keyboard behavior their
  patterns call for.

  `<loomi-datepicker>`'s month was 31 individually tab-focusable buttons and no arrow keys,
  so reaching a date meant tabbing through the month and leaving meant tabbing past the rest
  of it. The grid now follows the WAI-ARIA date-grid pattern: `role="grid"` with
  `columnheader` and `gridcell` semantics, a single roving tab stop that starts on the
  selected day, arrows moving by day and week, `Home`/`End` for the ends of the week,
  `PageUp`/`PageDown` for months, and arrowing off either end scrolling into the neighbouring
  month. Each day also carries its full date as an accessible name — "10" alone means nothing
  read aloud — and the selected day is marked `aria-selected`. `<loomi-date-range-picker>`
  composes this calendar, so it inherits all of it.

  `<loomi-otp>` only moved backwards, on Backspace into an empty box. Left and right arrows
  now walk between boxes and `Home`/`End` jump to the ends, so correcting an earlier digit no
  longer means the mouse or clearing everything after it.

  `<loomi-tag-input>`'s suggestion list had `role="listbox"` and arrow keys but no
  `aria-activedescendant`: focus stays in the text field, so the highlighted suggestion was
  announced to nobody. The field is now a `role="combobox"` wired to the listbox, and the
  suggestions carry ids.

### Patch Changes

- 9344aad: Restore every form-associated control to its initial state through native form resets,
  document submitted value formats, and add generated React 18 and React 19 JSX types.
- 9344aad: Drop bogus events from the custom-elements manifests. A component that dispatches through
  a helper — `new CustomEvent(name, …)` — made the analyzer record an event literally called
  `name` (or `type`), which then showed up in editor completions and framework integrations.
  `pnpm cem` now prunes any event named after a dispatch variable, along with unnamed ones.
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
  - @loomidev/theme@0.4.0
  - @loomidev/core@0.4.0
  - @loomidev/icons@0.4.0

## 0.3.0

### Patch Changes

- @loomidev/core@0.3.0
- @loomidev/icons@0.3.0
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
- Updated dependencies [8f0bc31]
- Updated dependencies [fe159c4]
- Updated dependencies [697386a]
- Updated dependencies [263ce12]
- Updated dependencies [697386a]
- Updated dependencies [49b905b]
- Updated dependencies [5644747]
- Updated dependencies [e1e36b7]
  - @loomidev/core@0.2.0
  - @loomidev/icons@0.2.0
  - @loomidev/theme@0.2.0
