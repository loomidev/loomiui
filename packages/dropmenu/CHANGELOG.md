# @loomidev/dropmenu

## 0.2.0

### Minor Changes

- 0e4b550: Added a `label` property to `<loomi-dropmenu>`, which names both the trigger button
  and the menu panel for assistive technology.

  An icon-only dropmenu previously had no accessible name at all, and there was no way
  for a consumer to give it one: the trigger is a `<button>` inside the component's
  shadow root, so an `aria-label` placed on the host element never reaches it. A screen
  reader announced the control as an unnamed button, and a name-based query such as
  Playwright's `getByRole("button", { name })` could not find it.

  A trigger slotted with visible text names itself and should leave `label` unset,
  rather than have an invisible name override the words on screen.

- 8e300d8: Bring `<loomi-dropmenu-item>` closer to parity with shadcn/ui's dropdown menu: add
  `checkbox` and `radio` (with `group`/`value`) toggle rows that fire a `change` event
  and keep the menu open, a `disabled` state that blocks navigation and clicks, and a
  `variant="destructive"` style for irreversible actions.
- 697386a: `<loomi-dropmenu>`'s panel is no longer clipped by an ancestor's `overflow`. It was
  `position: absolute` inside its own host, so a menu opened from a row near the bottom of a
  scrolling table was cut off or invisible, with no way to scroll it back — which is why
  row-level action menus had to be hand-rolled with a panel teleported to `<body>`. The
  panel is now promoted to the top layer with the popover API and positioned against the
  viewport with core's `positionFloatingPanel()`, the same mechanism `<loomi-split-button>`
  uses. Browsers without popover support fall back to plain `position: fixed`.

  Two behavior changes come with it. The panel now flips above the trigger when there isn't
  room below (the arrow moves to its underside to keep pointing at the trigger, and the
  entrance animation rises instead of dropping), and `placement` is now a preference rather
  than a guarantee: a panel that would leave the viewport still swaps its alignment. The
  existing `auto`/`left`/`right` values are unchanged in meaning — `left`/`right` still pick
  which edge of the panel lines up with the trigger — and `placement` additionally accepts
  the shared `bottom-start`/`bottom-end`/`top-start`/`top-end` names the library's other
  floating panels use, which also choose the side the panel opens on.

  `<loomi-dropmenu>` also gains `show()`, `hide()`, an `isOpen` getter, and
  `focus()`/`blur()` that forward to the trigger. The trigger is a `<button>` in the shadow
  root, so the inherited `focus()` was a silent no-op — leaving a consumer no way to hand
  focus back to a row's menu button, which is the other reason row menus were being
  hand-rolled.

  The panel is exposed as the `menu` part. `--loomi-dropmenu-arrow-inset` now means the
  closest the arrow may come to either corner: the arrow is aimed at the trigger's center
  wherever the panel lands, rather than being inset from a fixed edge.

  `@loomidev/core` exports `supportsPopover(el)` alongside `positionFloatingPanel()`, and
  `<loomi-split-button>` drops its private copy of the flip-and-shift maths for the shared
  helper so the two can't drift. Its panel now also publishes `--loomi-anchor-width`
  (previously `--loomi-split-anchor-width`) and rises rather than drops when it flips above.

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
