# @loomidev/dropmenu

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

- ef51d5e: `icon-right` no longer misaligns mixed menus. Items without an `icon` used to push their label to the right edge while items with one kept theirs on the left; now every label starts at the same edge and right-side icons line up in one column at the end of the row. The checkbox/radio indicator stays at the start, and shortcuts and the submenu chevron stay at the end. The layout mirrors under `dir="rtl"`.
- Updated dependencies [ee9d5a7]
- Updated dependencies [a0482d2]
- Updated dependencies [92bd99d]
- Updated dependencies [9f5d56f]
- Updated dependencies [29cce36]
  - @loomidev/core@0.10.0
  - @loomidev/icons@0.10.0

## 0.9.0

### Minor Changes

- 3bae883: `<loomi-profile-menu>` now slots its `<loomi-dropmenu-item>` children through to the internal dropmenu instead of moving them into its shadow root, so page CSS (including `::part()` selectors) keeps styling the items and their content. `<loomi-dropmenu>` finds its items through the flattened default slot, so any wrapper that forwards items through a `<slot>` works the same way.
  
  `<loomi-button>` gains a `full-width` attribute: the host becomes a block that fills its container, with the label centered.
  
  `<loomi-dropmenu-item hover="false">` now actually turns the row tint off (the attribute used to be read as `true` whenever present). Pair it with a `full-width` button for a button row, like a Sign out action at the bottom of a profile menu.

### Patch Changes

- @loomidev/core@0.9.0
  - @loomidev/icons@0.9.0

## 0.8.0

### Minor Changes

- d48fb64: Add an `arrowAnchor` property to `<loomi-dropmenu>`: the panel aligns to that element instead of the whole trigger, so its arrow lands right on it (the trigger still decides whether the panel opens below or flips above). It's re-measured on every placement, so it stays correct when the panel flips up or swaps alignment. `<loomi-profile-menu>` now positions its menu from the chevron (from the avatar + chevron pair when compact), so the caret sits under the chevron with either `placement`. `positionFloatingPanel()` gains an `alignTo` option to support this.

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

- Updated dependencies [fd109c2]
- Updated dependencies [fd109c2]
  - @loomidev/core@0.6.0
  - @loomidev/icons@0.6.0

## 0.5.0

### Patch Changes

- ec8801a: Make the dropmenu arrow readable. At 6px it was a barely-visible nub — the triangle is
  filled with the panel's own surface color, so all that distinguishes it is a 1px sliver of
  `--loomi-surface-border`, and at that size the sliver reads as a bump rather than a
  pointer. `--loomi-dropmenu-arrow-size` is now 9px, keeping the same panel-matched colors.

  Most obvious under `<loomi-profile-menu>`, whose trigger is a full card, but the arrow was
  equally faint on every dropmenu — so this moves the shared default rather than overriding
  it in one component. `--loomi-dropmenu-arrow-size` is still yours to override per instance.

  profile-menu's `--loomi-dropmenu-arrow-inset` is recomputed to 0.6875rem, since it is
  derived from half the arrow's width.

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

### Patch Changes

- 9344aad: Make the dropmenu arrow readable. At 6px it was a barely-visible nub — the triangle is
  filled with the panel's own surface color, so all that distinguishes it is a 1px sliver of
  `--loomi-surface-border`, and at that size the sliver reads as a bump rather than a
  pointer. `--loomi-dropmenu-arrow-size` is now 9px, keeping the same panel-matched colors.

  Most obvious under `<loomi-profile-menu>`, whose trigger is a full card, but the arrow was
  equally faint on every dropmenu — so this moves the shared default rather than overriding
  it in one component. `--loomi-dropmenu-arrow-size` is still yours to override per instance.

  profile-menu's `--loomi-dropmenu-arrow-inset` is recomputed to 0.6875rem, since it is
  derived from half the arrow's width.

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
