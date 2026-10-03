# @loomidev/split-button

## 0.11.0

### Patch Changes

- Updated dependencies [fde1da3]
- Updated dependencies [e1723dc]
- Updated dependencies [624cfc1]
  - @loomidev/core@0.11.0
  - @loomidev/button@0.11.0
  - @loomidev/dropmenu@0.11.0

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
- Updated dependencies [ef51d5e]
- Updated dependencies [92bd99d]
- Updated dependencies [9f5d56f]
- Updated dependencies [29cce36]
  - @loomidev/button@0.10.0
  - @loomidev/core@0.10.0
  - @loomidev/dropmenu@0.10.0

## 0.9.0

### Patch Changes

- Updated dependencies [f46f84a]
- Updated dependencies [3bae883]
  - @loomidev/button@0.9.0
  - @loomidev/dropmenu@0.9.0
  - @loomidev/core@0.9.0

## 0.8.0

### Minor Changes

- 661d4c0: **Breaking:** every `size` attribute (and `blur-size`, `image-size`, `icon-size`, `avatar-size`) now uses one ordered scale from `@loomidev/core`: `tiny` < `small` < `regular` < `medium` < `big` < `huge` < `omg`. A name means the same position in every component, every component defaults to `regular`, and an unsupported name renders as `regular`. The old names are removed, with no aliases.
  
  Renamed sizes:
  
  | Component                                  | Attribute    | Old → new                                                                                           |
  | ------------------------------------------ | ------------ | --------------------------------------------------------------------------------------------------- |
  | modal                                      | `size`       | `medium` → `regular` (default), `large` → `big`, `xl` → `huge`                                      |
  | modal                                      | `blur-size`  | `medium` → `regular` (default), `large` → `big`, `xl` → `huge`                                      |
  | card                                       | `size`       | `default` → `regular`, `sm` → `small`                                                               |
  | drawer                                     | `size`       | `medium` → `regular` (default), `large` → `big`                                                     |
  | empty-state                                | `image-size` | `medium` → `regular` (default), `large` → `big`, `xl` → `huge`                                      |
  | side-nav                                   | `icon-size`  | `large` → `big`                                                                                     |
  | spinner                                    | `size`       | `small` → `regular` (default), `xl` → `huge`; the `sm`/`md`/`lg` aliases are removed                |
  | bell, otp                                  | `size`       | `small` → `regular` (default)                                                                       |
  | rating                                     | `size`       | `small` → `regular` (default)                                                                       |
  | progress-circle                            | `size`       | `medium` → `regular` (default), `large` → `huge`                                                    |
  | progress-arc                               | `size`       | `medium` → `regular` (default), `large` → `huge`                                                    |
  
  Resized:
  
  - **avatar:** `medium` moves from 2.5rem (smaller than `regular`) to 3.5rem, between `regular` (3rem, still the default) and `big` (4rem).
  - **fab:** `medium` moves from 3.25rem (smaller than `regular`) to 4.25rem, above `regular` (3.75rem, still the default).
  - **input, select, number, password, autocomplete, countries, tag-input, timepicker, timezonepicker, emoji-picker:** the default is now `regular` (was `medium`), so a default field is 2.5rem tall and lines up with a default `<loomi-button>`. Set `size="medium"` for the previous 2.75rem height. emoji-picker's `big` trigger is now 3rem, matching the other controls.
  
  Types: every size property is typed with the new `LoomiSize` export from `@loomidev/core` (so custom-elements.json and editor autocomplete show the same list everywhere), and the per-component size types are removed: `LoomiAutocompleteSize`, `LoomiAvatarSize`, `LoomiBellSize`, `LoomiButtonSize`, `LoomiButtonGroupSize`, `LoomiCardSize`, `LoomiColorpickerSize`, `LoomiCountriesSize`, `LoomiDatepickerSize`, `LoomiDrawerSize`, `LoomiEmojiPickerSize`, `LoomiEmptyImageSize`, `LoomiFabSize`, `LoomiInputSize`, `LoomiModalSize`, `LoomiNumberSize`, `LoomiPasswordSize`, `LoomiProgressStepSize`, `LoomiRatingSize`, `LoomiSelectSize`, `LoomiSideNavIconSize`, `LoomiSpinnerSize`, `LoomiSplitButtonSize`, `LoomiTagInputSize`, `LoomiTimezonepickerSize`. Use `LoomiSize` instead.
  
  New in `@loomidev/core`: `LOOMI_SIZES`, `LoomiSize`, `isLoomiSize`, `LOOMI_DEFAULT_SIZE`, `LOOMI_CONTROL_SIZES`, `resolveLoomiSize` and `LoomiSizeSupport`. Each sized component declares the names it supports in a static `supportedSizes` map. See the "Sizing" section of the core README.

### Patch Changes

- Updated dependencies [661d4c0]
- Updated dependencies [d48fb64]
  - @loomidev/core@0.8.0
  - @loomidev/button@0.8.0
  - @loomidev/dropmenu@0.8.0

## 0.7.0

### Patch Changes

- Updated dependencies [c952b7d]
  - @loomidev/core@0.7.0
  - @loomidev/button@0.7.0
  - @loomidev/dropmenu@0.7.0

## 0.6.0

### Patch Changes

- Updated dependencies [fd109c2]
- Updated dependencies [fd109c2]
- Updated dependencies [fd109c2]
- Updated dependencies [fd109c2]
  - @loomidev/button@0.6.0
  - @loomidev/core@0.6.0
  - @loomidev/dropmenu@0.6.0

## 0.5.0

### Patch Changes

- Updated dependencies [450d1d3]
- Updated dependencies [d3bc58c]
- Updated dependencies [ec8801a]
- Updated dependencies [742f156]
  - @loomidev/button@0.5.0
  - @loomidev/core@0.5.0
  - @loomidev/dropmenu@0.5.0

## 0.4.1

### Patch Changes

- @loomidev/button@0.4.1
- @loomidev/core@0.4.1
- @loomidev/dropmenu@0.4.1

## 0.4.0

### Patch Changes

- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
  - @loomidev/button@0.4.0
  - @loomidev/core@0.4.0
  - @loomidev/dropmenu@0.4.0

## 0.3.0

### Patch Changes

- @loomidev/button@0.3.0
- @loomidev/core@0.3.0
- @loomidev/dropmenu@0.3.0

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

### Patch Changes

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

- Updated dependencies [49b905b]
- Updated dependencies [697386a]
- Updated dependencies [0b73a79]
- Updated dependencies [0e4b550]
- Updated dependencies [8e300d8]
- Updated dependencies [697386a]
- Updated dependencies [fe159c4]
- Updated dependencies [697386a]
- Updated dependencies [263ce12]
- Updated dependencies [e931227]
- Updated dependencies [697386a]
- Updated dependencies [e1e36b7]
  - @loomidev/button@0.2.0
  - @loomidev/core@0.2.0
  - @loomidev/dropmenu@0.2.0
