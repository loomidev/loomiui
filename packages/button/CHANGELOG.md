# @loomidev/button

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

### Patch Changes

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

- 49b905b: Added `gray` to `<loomi-button>`'s supported `color` values. It was missing from the
  button's closed color list even though it's one of the 6 official LoomiUI palette
  colors (and already fully supported by every other component via `LoomiColor`), so
  `color="gray"` silently fell back to the `primary` palette instead of rendering gray.
- fe159c4: First public release of LoomiUI.

  All `@loomidev/*` packages share a single version number and are released together,
  so any set of them installed at the same version is mutually compatible.

  Versions stay in the `0.x` range while the component APIs settle. Until `1.0.0`,
  a minor bump may contain breaking changes; pin an exact version if you need
  stability across upgrades.

- 263ce12: Fixed `<loomi-select>` discarding an empty `selected-value`. A filter whose unfiltered
  choice carries `value=""` — "All categories", "Any status" — was read as "nothing
  selected", so the trigger fell back to its placeholder instead of showing the option the
  caller had chosen. An empty value now counts when the options actually offer one, and
  the selection is re-resolved when `data` arrives after `selected-value`, which is the
  usual order in a framework binding.

  Gave `<loomi-button>` `delegatesFocus`. The host was not focusable, so `el.focus()` on it
  did nothing at all — a silent no-op that only surfaces in keyboard testing, and the
  reason a component needing to hand focus back to a button trigger had to reach through
  the shadow root for it. `<loomi-split-button>` already did this; the two now agree.

  Fixed `<loomi-button can-submit>` never submitting anything. It set `type="submit"` on
  its rendered `<button>` — but that button is inside the component's shadow root, and form
  association does not cross a shadow boundary, so a consumer's `<form>` in the light DOM
  never heard about it. Clicking did nothing at all: no error, no submit, just a form that
  would not send. It now walks out through its shadow hosts to find the owning form and
  calls `requestSubmit()`, so the form's validation and its `submit` listeners still run.

  Added `positionFloatingPanel()` to `@loomidev/core`, extracted from
  `<loomi-split-button>`. It places a panel beside its anchor in viewport coordinates,
  flipping and shifting to stay on screen, so components that take their panel out of flow
  share one implementation rather than each growing their own.

- e931227: Added `<loomi-split-button>` — a primary action joined to a caret that opens a menu of
  related actions ("Create course ▾" → Import courses, Course templates). This pattern
  previously had to be hand-assembled from a button plus a `<loomi-dropmenu>`, which ran
  into four problems the component now handles.

  The menu panel is promoted to the **top layer** with the popover API, so it is never
  clipped by an ancestor's `overflow` — `<loomi-dropmenu>`'s panel is `position: absolute`
  inside its own host, which rules it out for row-level menus in scrolling tables and card
  headers. Without popover support the panel falls back to plain `position: fixed`.

  Both halves are real `<loomi-button>`s (so `type`, `color`, `size`, `radius`, `outline`,
  `icon`, `disabled`, `tag`/`href`, `can-submit` and `has-spinner` behave exactly as they do
  on a plain button, and the halves can't drift apart), and menu rows are
  `<loomi-dropmenu-item>`s. `<loomi-dropmenu>` couldn't be composed this way because its
  trigger slot sits inside its own `<button>`, so slotting a button nested one inside
  another. Parts are exposed for every piece — `split`, `primary`, `primary-button`,
  `divider`, `caret`, `caret-button`, `panel` — rather than requiring consumers to drive
  custom properties and give up on the pieces those can't reach.

  The caret carries `aria-haspopup="menu"` and `aria-expanded` on its real `<button>`, takes
  its accessible name from `menu-label`, and supports the standard menu-button keyboard
  pattern (`ArrowDown` opens and focuses the first item, arrows/Home/End move, `Escape`
  closes and restores focus to the caret, `Tab` closes without trapping). Activating the
  primary half never opens the menu.

  `@loomidev/button` gains a public `controlElement` getter plus `focus()`/`blur()` overrides
  that forward to the inner `<button>`/`<a>`. The host element isn't focusable itself, so the
  inherited `focus()` was a silent no-op — which broke any consumer needing to return focus
  to a button, such as a menu restoring focus to its trigger.

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
