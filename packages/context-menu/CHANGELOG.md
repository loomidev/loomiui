# @loomidev/context-menu

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

- 9344aad: Bring the three components with bespoke keyboard interaction in line with the WAI-ARIA
  Authoring Practices.

  `<loomi-command-palette>` announced nothing as you arrowed through results: focus stays in
  the search field, so the highlighted option needs `aria-activedescendant`, which was
  absent. The field is now a `role="combobox"` wired to the listbox, options carry ids and
  sit outside the tab order, `Home`/`End` jump to the first and last enabled commands, `Tab`
  no longer escapes a dialog marked `aria-modal="true"`, and closing hands focus back to
  wherever it came from.

  `<loomi-context-menu>` supports `ArrowRight` to open a submenu and `ArrowLeft` to close it.
  Submenus were previously reachable by pointer only.

  `<loomi-data-grid>` marks its table `role="grid"` — arrow-key cell navigation makes it an
  interactive grid rather than a static table, and the two are announced differently.
  Sortable headers now expose `aria-sort` instead of conveying direction through a ▲/▼ glyph
  alone (that glyph is now `aria-hidden`), and selectable rows carry `aria-selected`.

### Patch Changes

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

- fe159c4: First public release of LoomiUI.

  All `@loomidev/*` packages share a single version number and are released together,
  so any set of them installed at the same version is mutually compatible.

  Versions stay in the `0.x` range while the component APIs settle. Until `1.0.0`,
  a minor bump may contain breaking changes; pin an exact version if you need
  stability across upgrades.

- 697386a: Overlays now animate _out_ as well as in. They already faded and rose into view, then
  vanished instantly — an entrance with no exit reads as no animation at all.

  `@loomidev/core` gains the reverse keyframes (`loomi-fade-out`, `loomi-drop-out`,
  `loomi-rise-out`) alongside the existing entrances, and `onExitAnimationEnd(el, done)`,
  which keeps an element rendered — and, for a popover, still in the top layer — until its
  exit has played. It is backed by a timer, so `done` always fires even if the element ends
  up with no animation, and it returns a cancel function so an overlay reopened mid-close
  drops the pending exit instead of hiding itself a moment later.

  `<loomi-dropmenu>` (panel and submenus), `<loomi-modal>` (backdrop and dialog),
  `<loomi-split-button>` and `<loomi-context-menu>`'s submenus all use it. Panels play the
  reverse of whichever entrance they used, so one that flipped above its trigger sinks back
  down rather than rising away from it, and a closing panel stops taking pointer events so a
  click can't land on something that is leaving.

  Everything observable is still released synchronously when the close is requested — `open`
  / `isOpen`, the `close` event, focus restoration, the scroll lock, and every listener — so
  only the visuals wait. Two consequences worth knowing when asserting on the DOM straight
  after a close: the panel keeps its `open` class (plus a new `closing` class) until the
  animation ends, and `<loomi-modal>` returns to its original DOM position when the exit
  finishes rather than immediately, since moving a node cancels the animation running on it.
  Setting `modal.open = false` directly still closes instantly; `hide()` is what animates.

- 697386a: Submenus in `<loomi-dropmenu>` and `<loomi-context-menu>` are now floating panels in their
  own right, on the same terms as the menus that hold them. Previously each was
  `position: absolute` inside its parent item, pinned to that row's right edge, which left
  two gaps: a submenu opened near the right edge of the screen ran off it, never flipping to
  the other side of its row or shifting up when it was taller than the room below; and a
  menu with `scrollable` set clipped its own submenus, because that turns on `overflow`
  inside the menu body.

  Each submenu is now promoted to the top layer with the popover API and placed by core's
  new `positionFloatingSubmenu()`, which flips and shifts to keep it on screen. A nested
  submenu inherits whichever side its parent settled on, so a chain that had to flip keeps
  going the same way instead of doubling back over its own parent. The resolved side is
  published as `data-side="left" | "right"`, and the panel is exposed as the `submenu` part.

  Opening moved from a `:host(:hover)`/`:host(:focus-within)` CSS rule to JS, since the panel
  has to be measured and placed once visible. Hover and keyboard focus still open a submenu,
  and closing now waits a moment after the pointer leaves both the row and the panel — the
  gap between them no longer snaps the submenu shut mid-crossing. Closing a menu explicitly
  closes any submenu it has open, which a top-layer panel needs.

### Patch Changes

- 697386a: `onClickOutside()` now closes on a right-click outside as well as a left-click. It only
  watched `click`, so right-clicking elsewhere left an open dropmenu, select, popover,
  picker or drawer sitting there — under the browser's own context menu, or under whatever
  menu the right-click opened — which reads as a stuck panel. Every component built on the
  helper inherits the fix.

  `<loomi-context-menu>` had been carrying its own document-level `contextmenu` listener to
  work around this; it now relies on the shared helper instead.

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
- Updated dependencies [e1e36b7]
  - @loomidev/core@0.2.0
  - @loomidev/icons@0.2.0
