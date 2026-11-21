# @loomidev/theme

## 0.17.0

No changes in this release.

## 0.16.0

No changes in this release.

## 0.15.0

### Minor Changes

- f689dc6: - Every form control (`input`, `password`, `textarea`, `select`, `number`, `filepicker`) takes an `error` attribute: a message supplied from outside, such as a server-side rejection, shown below the field on load with `aria-invalid`/`aria-describedby`, and cleared when the user edits the value.
  - `loomi-dropmenu-item` takes `href`, `target` and `rel`; the whole row renders as a real link (so `loomi-profile-menu` rows can be links too).
  - `loomi-pagination` takes `href-template` (e.g. `/orders?page={page}`) to render every control as a link; `loomi-page-change` is then cancelable.
  - `loomi-empty-state` takes `button-href`/`button-target`, and renders slotted content in the actions row.
  - `loomi-table` manual templates: a `footer` template rendered as `<tfoot>`, `align`/`nowrap`/`width` column options on header cells, `row`/`header-cell`/`cell`/`footer-cell` parts, and built-in cell helper classes.
  - `loomi-tabs` takes `overflow="scroll"` for a single scrolling line of headings with edge fades and scroll buttons; `url` tabs render as real links.
  - `@loomidev/icons` accepts upstream Heroicons spellings (`squares-2x2`, `h1`) and warns once about unknown names.
  - `loomi-number`'s floating label can use the full field width instead of truncating between the stepper buttons.
  - `@loomidev/theme/undefined.css`: optional placeholders that reserve space for `loomi-*` elements before they are defined.

## 0.14.0

No changes in this release.

## 0.13.0

No changes in this release.

## 0.12.0

No changes in this release.

## 0.11.0

No changes in this release.

## 0.10.0

### Patch Changes

- ee9d5a7: Cut what components cost a consumer bundle.
  
  - Icons load on demand. `@loomidev/icons` no longer inlines Heroicons: each icon is its own module, loaded the first time it renders, through the new `loomiIcon()` directive, `hasLoomiIcon()` and `loadLoomiIcon()`. `getLoomiIcon()` now returns only icons that are ready (registered, provided or already loaded). `import "@loomidev/icons/all"` restores the eager set. Components ship their own chrome icons statically via `provideLoomiIcons()`. The Heroicons set is now complete (324 icons per variant).
  - Iconsax and Untitled UI are opt-in: `import "@loomidev/icons/iconsax"` / `"@loomidev/icons/untitledui"`. Until then their names are unknown and `<loomi-icon>` falls back to its slot with a one-time console warning. `<loomi-text-editor>` registers the toolbar icons it uses, so it needs neither.
  - Every package declares `"sideEffects"` precisely, so bundlers tree-shake unused modules.
  - `@loomidev/button` safelists only the utility classes it builds at runtime; its compiled styles drop from 89 KB to 14 KB. The button is now about 8.4 KB min+gz including styles (was about 102 KB).
  - `LOOMI_CONTROL_SIZES` moved to core's `size` module (same export from `@loomidev/core`), so importing it no longer pulls in the field stylesheets.
  - Each README has a Bundle size section, and `pnpm check:bundle-size` reports every package's size in CI with a 10 KB hard limit on the button.

## 0.9.0

## 0.8.0

## 0.7.0

## 0.6.0

## 0.5.0

### Minor Changes

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

## 0.4.1

## 0.4.0

### Minor Changes

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

## 0.3.0

## 0.2.0

### Minor Changes

- fe159c4: First public release of LoomiUI.

  All `@loomidev/*` packages share a single version number and are released together,
  so any set of them installed at the same version is mutually compatible.

  Versions stay in the `0.x` range while the component APIs settle. Until `1.0.0`,
  a minor bump may contain breaking changes; pin an exact version if you need
  stability across upgrades.

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

### Patch Changes

- 49b905b: Changed the default `warning` palette ramp from Tailwind's `orange` to `amber`. The
  previous default sat only ~14° apart in hue from `error`'s `red` ramp at a similar
  lightness/chroma, making the two easy to mix up at a glance (and especially hard to
  tell apart for red-green colorblind users). `amber` (~58° hue) reads as a conventional
  "caution" color and is clearly distinct from `error` in every component that uses
  `color="warning"`. Purely a default-value change — the `--loomi-warning-*` token names
  are unchanged, so any app that already overrides them is unaffected.
