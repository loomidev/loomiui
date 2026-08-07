# @loomidev/emoji-picker

## 0.2.0

### Minor Changes

- f954123: Refactored `<loomi-emoji-picker>` to open its search/categories/grid panel through a
  `<loomi-popover>` dropdown instead of hand-rolled open/close/outside-click logic. The
  trigger is now the selected emoji itself (no border, chevron, or text by default) —
  set the new `show-text` attribute to also show the name/placeholder text next to it.
  The emoji grid now shows 7 emojis per row instead of a width-dependent auto-fill count.

  Also fixed `show-text`, `show-categories`, and `searchable` so setting them to the
  literal string `"false"` in HTML markup (e.g. `show-text="false"`) actually disables
  them. Lit's default `type: Boolean` converter treats any attribute presence —
  including `"false"` — as `true`, so these properties now use a custom converter that
  honors a literal `"false"` value.

  `@loomidev/popover` gained a `disabled` attribute (disables the trigger), a
  `loomi-toggle` event (`detail: { open }`), and an `isOpen` getter, so consumers can
  build controlled, disable-aware dropdowns on top of it.

- 8ce464f: Added a skin-tone picker to `<loomi-emoji-picker>`. A hand emoji now sits as a suffix
  on the search input whenever the active emoji set includes tone-capable emoji (true of
  the built-in curated set); clicking it opens a 6-way menu (default plus the 5
  Fitzpatrick tones). The chosen tone applies to every matching emoji in the grid and to
  the value that gets selected/submitted, and is remembered in `localStorage` across
  sessions. Custom emoji passed via `.data` or `emojis` don't carry tone variants, so the
  hand suffix is omitted when the picker is showing only custom data.
- fe159c4: First public release of LoomiUI.

  All `@loomidev/*` packages share a single version number and are released together,
  so any set of them installed at the same version is mutually compatible.

  Versions stay in the `0.x` range while the component APIs settle. Until `1.0.0`,
  a minor bump may contain breaking changes; pin an exact version if you need
  stability across upgrades.

### Patch Changes

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
- Updated dependencies [f954123]
- Updated dependencies [fe159c4]
- Updated dependencies [697386a]
- Updated dependencies [263ce12]
- Updated dependencies [697386a]
- Updated dependencies [e1e36b7]
  - @loomidev/core@0.2.0
  - @loomidev/popover@0.2.0
