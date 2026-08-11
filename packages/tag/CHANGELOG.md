# @loomidev/tag

## 0.3.0

### Patch Changes

- @loomidev/core@0.3.0
- @loomidev/icon@0.3.0

## 0.2.0

### Minor Changes

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
- Updated dependencies [7d35f2f]
- Updated dependencies [8f0bc31]
- Updated dependencies [fe159c4]
- Updated dependencies [697386a]
- Updated dependencies [263ce12]
- Updated dependencies [697386a]
- Updated dependencies [e1e36b7]
  - @loomidev/core@0.2.0
  - @loomidev/icon@0.2.0
