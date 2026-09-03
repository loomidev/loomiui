# @loomidev/components

## 0.5.0

### Patch Changes

- d3069e0: Use CSS logical properties for spacing and borders throughout, so components mirror
  correctly under `dir="rtl"`. 65 physical declarations across 22 stylesheets became their
  logical equivalents (`margin-left` → `margin-inline-start` and so on); they resolve
  identically in LTR, and the visual regression baselines are unchanged for every component
  as a result. Under `dir="rtl"`, 69 of 100 components now mirror, the remainder being
  symmetric by design. Arabic is one of the ten shipped locales, so this was already
  load-bearing.
- d3069e0: Add a visual regression suite. `pnpm test:visual` renders every component in both themes
  and compares the result against a committed baseline, which is the only check in the repo
  that guards appearance — a theme token change alters how dozens of components render while
  the unit tests, the accessibility sweep and the SSR check all still pass.
- Updated dependencies [450d1d3]
- Updated dependencies [ad81ae1]
- Updated dependencies [ae725e5]
- Updated dependencies [d3bc58c]
- Updated dependencies [87c5d42]
- Updated dependencies [ec8801a]
- Updated dependencies [450d1d3]
- Updated dependencies [fdac5da]
- Updated dependencies [ec8801a]
- Updated dependencies [9c0247e]
- Updated dependencies [ec8801a]
- Updated dependencies [ae725e5]
- Updated dependencies [ad81ae1]
- Updated dependencies [5c97138]
- Updated dependencies [50a4170]
- Updated dependencies [f854c5f]
- Updated dependencies [87c5d42]
- Updated dependencies [7227978]
- Updated dependencies [742f156]
- Updated dependencies [2bc1027]
  - @loomidev/theme@0.5.0
  - @loomidev/button@0.5.0
  - @loomidev/context-menu@0.5.0
  - @loomidev/progress@0.5.0
  - @loomidev/chat@0.5.0
  - @loomidev/autocomplete@0.5.0
  - @loomidev/calendar@0.5.0
  - @loomidev/colorpicker@0.5.0
  - @loomidev/core@0.5.0
  - @loomidev/filepicker@0.5.0
  - @loomidev/pagination@0.5.0
  - @loomidev/resizable@0.5.0
  - @loomidev/tag@0.5.0
  - @loomidev/command-palette@0.5.0
  - @loomidev/data-grid@0.5.0
  - @loomidev/date-range-picker@0.5.0
  - @loomidev/empty-state@0.5.0
  - @loomidev/filter-builder@0.5.0
  - @loomidev/input@0.5.0
  - @loomidev/dropmenu@0.5.0
  - @loomidev/profile-menu@0.5.0
  - @loomidev/checkbox@0.5.0
  - @loomidev/datepicker@0.5.0
  - @loomidev/drawer@0.5.0
  - @loomidev/modal@0.5.0
  - @loomidev/radio@0.5.0
  - @loomidev/rating@0.5.0
  - @loomidev/slider@0.5.0
  - @loomidev/sortable@0.5.0
  - @loomidev/timepicker@0.5.0
  - @loomidev/toggle@0.5.0
  - @loomidev/password@0.5.0
  - @loomidev/checkcards@0.5.0
  - @loomidev/countries@0.5.0
  - @loomidev/emoji-picker@0.5.0
  - @loomidev/number@0.5.0
  - @loomidev/otp@0.5.0
  - @loomidev/select@0.5.0
  - @loomidev/tag-input@0.5.0
  - @loomidev/text-editor@0.5.0
  - @loomidev/textarea@0.5.0
  - @loomidev/timezonepicker@0.5.0
  - @loomidev/statistic@0.5.0
  - @loomidev/icons@0.5.0
  - @loomidev/icon@0.5.0
  - @loomidev/timeline@0.5.0
  - @loomidev/creditcard@0.5.0
  - @loomidev/timer@0.5.0
  - @loomidev/bottom-nav@0.5.0
  - @loomidev/button-group@0.5.0
  - @loomidev/fab@0.5.0
  - @loomidev/photo-gallery@0.5.0
  - @loomidev/tab@0.5.0
  - @loomidev/table@0.5.0
  - @loomidev/video@0.5.0
  - @loomidev/accordion@0.5.0
  - @loomidev/alert@0.5.0
  - @loomidev/arc-meter@0.5.0
  - @loomidev/avatar@0.5.0
  - @loomidev/bell@0.5.0
  - @loomidev/card@0.5.0
  - @loomidev/centered-content@0.5.0
  - @loomidev/chart@0.5.0
  - @loomidev/clipboard@0.5.0
  - @loomidev/contact-card@0.5.0
  - @loomidev/divider@0.5.0
  - @loomidev/floating-panel@0.5.0
  - @loomidev/horizontal-line-graph@0.5.0
  - @loomidev/lightbox@0.5.0
  - @loomidev/listview@0.5.0
  - @loomidev/notification@0.5.0
  - @loomidev/popover@0.5.0
  - @loomidev/processing@0.5.0
  - @loomidev/qrcode@0.5.0
  - @loomidev/scroller@0.5.0
  - @loomidev/spinner@0.5.0
  - @loomidev/split-button@0.5.0
  - @loomidev/theme-switcher@0.5.0
  - @loomidev/tooltip@0.5.0
  - @loomidev/progress-steps@0.5.0
  - @loomidev/side-nav@0.5.0

## 0.4.1

### Patch Changes

- @loomidev/accordion@0.4.1
- @loomidev/alert@0.4.1
- @loomidev/arc-meter@0.4.1
- @loomidev/autocomplete@0.4.1
- @loomidev/avatar@0.4.1
- @loomidev/bell@0.4.1
- @loomidev/bottom-nav@0.4.1
- @loomidev/button@0.4.1
- @loomidev/button-group@0.4.1
- @loomidev/calendar@0.4.1
- @loomidev/card@0.4.1
- @loomidev/centered-content@0.4.1
- @loomidev/chart@0.4.1
- @loomidev/chat@0.4.1
- @loomidev/checkbox@0.4.1
- @loomidev/checkcards@0.4.1
- @loomidev/clipboard@0.4.1
- @loomidev/colorpicker@0.4.1
- @loomidev/command-palette@0.4.1
- @loomidev/contact-card@0.4.1
- @loomidev/context-menu@0.4.1
- @loomidev/core@0.4.1
- @loomidev/countries@0.4.1
- @loomidev/creditcard@0.4.1
- @loomidev/data-grid@0.4.1
- @loomidev/date-range-picker@0.4.1
- @loomidev/datepicker@0.4.1
- @loomidev/divider@0.4.1
- @loomidev/drawer@0.4.1
- @loomidev/dropmenu@0.4.1
- @loomidev/emoji-picker@0.4.1
- @loomidev/empty-state@0.4.1
- @loomidev/fab@0.4.1
- @loomidev/filepicker@0.4.1
- @loomidev/filter-builder@0.4.1
- @loomidev/floating-panel@0.4.1
- @loomidev/horizontal-line-graph@0.4.1
- @loomidev/icon@0.4.1
- @loomidev/icons@0.4.1
- @loomidev/input@0.4.1
- @loomidev/lightbox@0.4.1
- @loomidev/listview@0.4.1
- @loomidev/modal@0.4.1
- @loomidev/notification@0.4.1
- @loomidev/number@0.4.1
- @loomidev/otp@0.4.1
- @loomidev/pagination@0.4.1
- @loomidev/password@0.4.1
- @loomidev/photo-gallery@0.4.1
- @loomidev/popover@0.4.1
- @loomidev/processing@0.4.1
- @loomidev/profile-menu@0.4.1
- @loomidev/progress@0.4.1
- @loomidev/progress-steps@0.4.1
- @loomidev/qrcode@0.4.1
- @loomidev/radio@0.4.1
- @loomidev/rating@0.4.1
- @loomidev/resizable@0.4.1
- @loomidev/scroller@0.4.1
- @loomidev/select@0.4.1
- @loomidev/side-nav@0.4.1
- @loomidev/slider@0.4.1
- @loomidev/sortable@0.4.1
- @loomidev/spinner@0.4.1
- @loomidev/split-button@0.4.1
- @loomidev/statistic@0.4.1
- @loomidev/tab@0.4.1
- @loomidev/table@0.4.1
- @loomidev/tag@0.4.1
- @loomidev/tag-input@0.4.1
- @loomidev/text-editor@0.4.1
- @loomidev/textarea@0.4.1
- @loomidev/theme@0.4.1
- @loomidev/theme-switcher@0.4.1
- @loomidev/timeline@0.4.1
- @loomidev/timepicker@0.4.1
- @loomidev/timer@0.4.1
- @loomidev/timezonepicker@0.4.1
- @loomidev/toggle@0.4.1
- @loomidev/tooltip@0.4.1
- @loomidev/video@0.4.1

## 0.4.0

### Patch Changes

- 9344aad: Use CSS logical properties for spacing and borders throughout, so components mirror
  correctly under `dir="rtl"`. 65 physical declarations across 22 stylesheets became their
  logical equivalents (`margin-left` → `margin-inline-start` and so on); they resolve
  identically in LTR, and the visual regression baselines are unchanged for every component
  as a result. Under `dir="rtl"`, 69 of 100 components now mirror, the remainder being
  symmetric by design. Arabic is one of the ten shipped locales, so this was already
  load-bearing.
- 9344aad: Add a visual regression suite. `pnpm test:visual` renders every component in both themes
  and compares the result against a committed baseline, which is the only check in the repo
  that guards appearance — a theme token change alters how dozens of components render while
  the unit tests, the accessibility sweep and the SSR check all still pass.
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
  - @loomidev/theme@0.4.0
  - @loomidev/button@0.4.0
  - @loomidev/context-menu@0.4.0
  - @loomidev/progress@0.4.0
  - @loomidev/chat@0.4.0
  - @loomidev/autocomplete@0.4.0
  - @loomidev/calendar@0.4.0
  - @loomidev/colorpicker@0.4.0
  - @loomidev/core@0.4.0
  - @loomidev/filepicker@0.4.0
  - @loomidev/pagination@0.4.0
  - @loomidev/resizable@0.4.0
  - @loomidev/tag@0.4.0
  - @loomidev/command-palette@0.4.0
  - @loomidev/data-grid@0.4.0
  - @loomidev/date-range-picker@0.4.0
  - @loomidev/empty-state@0.4.0
  - @loomidev/filter-builder@0.4.0
  - @loomidev/input@0.4.0
  - @loomidev/dropmenu@0.4.0
  - @loomidev/profile-menu@0.4.0
  - @loomidev/checkbox@0.4.0
  - @loomidev/datepicker@0.4.0
  - @loomidev/drawer@0.4.0
  - @loomidev/modal@0.4.0
  - @loomidev/radio@0.4.0
  - @loomidev/rating@0.4.0
  - @loomidev/slider@0.4.0
  - @loomidev/sortable@0.4.0
  - @loomidev/timepicker@0.4.0
  - @loomidev/toggle@0.4.0
  - @loomidev/password@0.4.0
  - @loomidev/checkcards@0.4.0
  - @loomidev/countries@0.4.0
  - @loomidev/emoji-picker@0.4.0
  - @loomidev/number@0.4.0
  - @loomidev/otp@0.4.0
  - @loomidev/select@0.4.0
  - @loomidev/tag-input@0.4.0
  - @loomidev/text-editor@0.4.0
  - @loomidev/textarea@0.4.0
  - @loomidev/timezonepicker@0.4.0
  - @loomidev/statistic@0.4.0
  - @loomidev/icons@0.4.0
  - @loomidev/icon@0.4.0
  - @loomidev/timeline@0.4.0
  - @loomidev/creditcard@0.4.0
  - @loomidev/timer@0.4.0
  - @loomidev/bottom-nav@0.4.0
  - @loomidev/button-group@0.4.0
  - @loomidev/fab@0.4.0
  - @loomidev/photo-gallery@0.4.0
  - @loomidev/tab@0.4.0
  - @loomidev/table@0.4.0
  - @loomidev/video@0.4.0
  - @loomidev/accordion@0.4.0
  - @loomidev/alert@0.4.0
  - @loomidev/arc-meter@0.4.0
  - @loomidev/avatar@0.4.0
  - @loomidev/bell@0.4.0
  - @loomidev/card@0.4.0
  - @loomidev/centered-content@0.4.0
  - @loomidev/chart@0.4.0
  - @loomidev/clipboard@0.4.0
  - @loomidev/contact-card@0.4.0
  - @loomidev/divider@0.4.0
  - @loomidev/floating-panel@0.4.0
  - @loomidev/horizontal-line-graph@0.4.0
  - @loomidev/lightbox@0.4.0
  - @loomidev/listview@0.4.0
  - @loomidev/notification@0.4.0
  - @loomidev/popover@0.4.0
  - @loomidev/processing@0.4.0
  - @loomidev/qrcode@0.4.0
  - @loomidev/scroller@0.4.0
  - @loomidev/spinner@0.4.0
  - @loomidev/split-button@0.4.0
  - @loomidev/theme-switcher@0.4.0
  - @loomidev/tooltip@0.4.0
  - @loomidev/progress-steps@0.4.0
  - @loomidev/side-nav@0.4.0

## 0.3.0

### Patch Changes

- Updated dependencies [868d518]
  - @loomidev/profile-menu@0.3.0
  - @loomidev/accordion@0.3.0
  - @loomidev/alert@0.3.0
  - @loomidev/arc-meter@0.3.0
  - @loomidev/autocomplete@0.3.0
  - @loomidev/avatar@0.3.0
  - @loomidev/bell@0.3.0
  - @loomidev/bottom-nav@0.3.0
  - @loomidev/button@0.3.0
  - @loomidev/button-group@0.3.0
  - @loomidev/calendar@0.3.0
  - @loomidev/card@0.3.0
  - @loomidev/centered-content@0.3.0
  - @loomidev/chart@0.3.0
  - @loomidev/chat@0.3.0
  - @loomidev/checkbox@0.3.0
  - @loomidev/checkcards@0.3.0
  - @loomidev/clipboard@0.3.0
  - @loomidev/colorpicker@0.3.0
  - @loomidev/command-palette@0.3.0
  - @loomidev/contact-card@0.3.0
  - @loomidev/context-menu@0.3.0
  - @loomidev/core@0.3.0
  - @loomidev/countries@0.3.0
  - @loomidev/creditcard@0.3.0
  - @loomidev/data-grid@0.3.0
  - @loomidev/date-range-picker@0.3.0
  - @loomidev/datepicker@0.3.0
  - @loomidev/divider@0.3.0
  - @loomidev/drawer@0.3.0
  - @loomidev/dropmenu@0.3.0
  - @loomidev/emoji-picker@0.3.0
  - @loomidev/empty-state@0.3.0
  - @loomidev/fab@0.3.0
  - @loomidev/filepicker@0.3.0
  - @loomidev/filter-builder@0.3.0
  - @loomidev/floating-panel@0.3.0
  - @loomidev/horizontal-line-graph@0.3.0
  - @loomidev/icon@0.3.0
  - @loomidev/icons@0.3.0
  - @loomidev/input@0.3.0
  - @loomidev/lightbox@0.3.0
  - @loomidev/listview@0.3.0
  - @loomidev/modal@0.3.0
  - @loomidev/notification@0.3.0
  - @loomidev/number@0.3.0
  - @loomidev/otp@0.3.0
  - @loomidev/pagination@0.3.0
  - @loomidev/password@0.3.0
  - @loomidev/photo-gallery@0.3.0
  - @loomidev/popover@0.3.0
  - @loomidev/processing@0.3.0
  - @loomidev/progress@0.3.0
  - @loomidev/progress-steps@0.3.0
  - @loomidev/qrcode@0.3.0
  - @loomidev/radio@0.3.0
  - @loomidev/rating@0.3.0
  - @loomidev/resizable@0.3.0
  - @loomidev/scroller@0.3.0
  - @loomidev/select@0.3.0
  - @loomidev/side-nav@0.3.0
  - @loomidev/slider@0.3.0
  - @loomidev/sortable@0.3.0
  - @loomidev/spinner@0.3.0
  - @loomidev/split-button@0.3.0
  - @loomidev/statistic@0.3.0
  - @loomidev/tab@0.3.0
  - @loomidev/table@0.3.0
  - @loomidev/tag@0.3.0
  - @loomidev/tag-input@0.3.0
  - @loomidev/text-editor@0.3.0
  - @loomidev/textarea@0.3.0
  - @loomidev/theme@0.3.0
  - @loomidev/theme-switcher@0.3.0
  - @loomidev/timeline@0.3.0
  - @loomidev/timepicker@0.3.0
  - @loomidev/timer@0.3.0
  - @loomidev/timezonepicker@0.3.0
  - @loomidev/toggle@0.3.0
  - @loomidev/tooltip@0.3.0
  - @loomidev/video@0.3.0

## 0.2.0

### Minor Changes

- f954123: Add `<loomi-bottom-nav>`/`<loomi-bottom-nav-item>`, a mobile bottom navigation bar with
  icons (via `<loomi-icon>`), badges, eight active-state styles (`pill`, `underline`,
  `top-line`, `background`, `icon-only`, `dot`, `border`, `minimal`), a `floating` variant,
  safe-area-aware positioning, and arrow-key roving focus. Items render as a real `<a>` when
  `href` is set or a `<button>` otherwise, and always fire a cancelable `loomi-change` event
  so React Router, Vue Router, SvelteKit, Astro, Laravel, or any other router can own
  navigation instead of the component forcing full page loads.
- 0b73a79: Add `<loomi-creditcard>`, a flippable credit-card input with cardholder name, number,
  expiry, and CVC fields. The network logo (Visa, Mastercard, Amex, Discover, Diners Club,
  JCB, UnionPay, Maestro) is detected live from the number's prefix and shown alongside a
  contactless-payment glyph on the front face; an edge button flips the card to its back to
  enter the CVC. `@loomidev/core` gains matching `creditcard.*` translations across all
  built-in locales.
- f954123: Add `<loomi-fab>`, a floating action button that becomes a speed-dial menu when given `<loomi-fab-item>` children — corner `placement`, expand `direction`, `click`/`hover` triggers, `floating`/`docked` variants, an optional `backdrop`, `icons-only` mode (labels shown as a `<loomi-tooltip>` instead of inline text), and roving keyboard navigation. Icons render through the same `<loomi-icon>` registry and `icon-source` attribute as `<loomi-bottom-nav>`.
- f954123: Add `<loomi-floating-panel>`, a draggable, resizable panel that floats above the page — opened/closed by `name` via `showLoomiFloatingPanel()`/`hideLoomiFloatingPanel()`. Drag by the header or eight edge/corner resize handles (mouse or arrow keys), `bounded` viewport clamping, automatic bring-to-front stacking across multiple open panels, optional `auto-save-id` position/size persistence via `localStorage`, and non-modal `role="dialog"` semantics with focus-scoped Escape-to-close. Also adds `minimize`/`maximize` header buttons (collapse to title bar / fill the viewport, with a header double-click shortcut for maximize), and `drag-handle` to restrict dragging to a dedicated grip icon instead of the whole header.
- fe159c4: First public release of LoomiUI.

  All `@loomidev/*` packages share a single version number and are released together,
  so any set of them installed at the same version is mutually compatible.

  Versions stay in the `0.x` range while the component APIs settle. Until `1.0.0`,
  a minor bump may contain breaking changes; pin an exact version if you need
  stability across upgrades.

- af01d41: **Breaking:** renamed `@loomidev/pin` → `@loomidev/otp` and the element `<loomi-pin>` →
  `<loomi-otp>`, to reflect that the component is a general one-time-passcode input, not only a
  numeric PIN. Update imports (`@loomidev/pin` → `@loomidev/otp`, `@loomidev/components/pin` →
  `@loomidev/components/otp`), the tag name, and the exported type names
  (`LoomiPin`/`LoomiPinVerifyDetail` → `LoomiOtp`/`LoomiOtpVerifyDetail`). The
  `loomi-verify` event name is unchanged.

  New `type` attribute controls accepted characters: `numeric` (default — digits only, the
  previous behavior, keeps `inputmode="numeric"`), `alphanumeric` (letters + digits), or
  `text` (any non-whitespace). Non-matching characters are dropped on type and paste.

  The value getter is now `code`; `pin` remains as a deprecated alias, and the `loomi-verify`
  detail still carries both `code` and `pin`. Also fixed a display bug where a rejected
  character (e.g. a letter in a numeric field) stayed visible in the box despite being
  excluded from the value.

- 0d448ee: Add `<loomi-timer>`, an animated count up/down timer with optional controls, count-up stopwatch mode, count-down mode, themed progress styling, lifecycle events, and host font-size inheritance through normal `style` and `class` attributes.
- 24cbb64: `<loomi-timer>`: replace the `duration` attribute with `days`, `hours`, and `mins`
  (summed together to form the timer's length), always render Days/Hours/Mins/Secs
  digit segments with labels underneath, and add a `show-border` attribute
  (defaults to `false`) to toggle the background and border around the timer face.
- f954123: Add `<loomi-video>`, a themeable wrapper around the native `<video>` element. Renders the
  browser's real media element under the hood and layers a themed control bar on top —
  built from `@loomidev/button` and `@loomidev/slider` — with a circular play button, seek
  and volume sliders, captions menu, picture-in-picture, and fullscreen support. Without the
  `controls` attribute it's a bare, unstyled passthrough; with it, it adds loading/error
  overlays, a click-to-play poster overlay, full keyboard shortcuts, and a `controls` slot
  for fully custom markup. `<source>`/`<track>` children are forwarded onto the internal
  `<video>` element for multi-format fallback and subtitle/caption tracks.

### Patch Changes

- c9f3d6f: Add `<loomi-arc-meter>`, a semi-circle status meter with evenly distributed marker stops, a configurable marker color, and title/description labels.
- 697386a: `onClickOutside()` now closes on a right-click outside as well as a left-click. It only
  watched `click`, so right-clicking elsewhere left an open dropmenu, select, popover,
  picker or drawer sitting there — under the browser's own context menu, or under whatever
  menu the right-click opened — which reads as a stuck panel. Every component built on the
  helper inherits the fix.

  `<loomi-context-menu>` had been carrying its own document-level `contextmenu` listener to
  work around this; it now relies on the shared helper instead.

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

- Updated dependencies [49b905b]
- Updated dependencies [c9f3d6f]
- Updated dependencies [8c5fb3a]
- Updated dependencies [f4689e1]
- Updated dependencies [f954123]
- Updated dependencies [49b905b]
- Updated dependencies [25c1177]
- Updated dependencies [37951f5]
- Updated dependencies [697386a]
- Updated dependencies [505ea39]
- Updated dependencies [0b73a79]
- Updated dependencies [505ea39]
- Updated dependencies [0e4b550]
- Updated dependencies [8e300d8]
- Updated dependencies [697386a]
- Updated dependencies [f954123]
- Updated dependencies [8ce464f]
- Updated dependencies [f954123]
- Updated dependencies [f954123]
- Updated dependencies [7d35f2f]
- Updated dependencies [8f0bc31]
- Updated dependencies [fe159c4]
- Updated dependencies [0b97dfb]
- Updated dependencies [af01d41]
- Updated dependencies [af01d41]
- Updated dependencies [697386a]
- Updated dependencies [505ea39]
- Updated dependencies [a0c78bd]
- Updated dependencies [505ea39]
- Updated dependencies [263ce12]
- Updated dependencies [505ea39]
- Updated dependencies [505ea39]
- Updated dependencies [e931227]
- Updated dependencies [697386a]
- Updated dependencies [7350966]
- Updated dependencies [f954123]
- Updated dependencies [dfa040a]
- Updated dependencies [49b905b]
- Updated dependencies [5644747]
- Updated dependencies [e1e36b7]
- Updated dependencies [0d448ee]
- Updated dependencies [24cbb64]
- Updated dependencies [fe159c4]
- Updated dependencies [f954123]
  - @loomidev/alert@0.2.0
  - @loomidev/arc-meter@0.2.0
  - @loomidev/avatar@0.2.0
  - @loomidev/filepicker@0.2.0
  - @loomidev/bottom-nav@0.2.0
  - @loomidev/button@0.2.0
  - @loomidev/calendar@0.2.0
  - @loomidev/checkcards@0.2.0
  - @loomidev/core@0.2.0
  - @loomidev/context-menu@0.2.0
  - @loomidev/card@0.2.0
  - @loomidev/empty-state@0.2.0
  - @loomidev/horizontal-line-graph@0.2.0
  - @loomidev/listview@0.2.0
  - @loomidev/creditcard@0.2.0
  - @loomidev/dropmenu@0.2.0
  - @loomidev/split-button@0.2.0
  - @loomidev/emoji-picker@0.2.0
  - @loomidev/popover@0.2.0
  - @loomidev/fab@0.2.0
  - @loomidev/floating-panel@0.2.0
  - @loomidev/icon@0.2.0
  - @loomidev/icons@0.2.0
  - @loomidev/accordion@0.2.0
  - @loomidev/autocomplete@0.2.0
  - @loomidev/bell@0.2.0
  - @loomidev/button-group@0.2.0
  - @loomidev/centered-content@0.2.0
  - @loomidev/chart@0.2.0
  - @loomidev/chat@0.2.0
  - @loomidev/checkbox@0.2.0
  - @loomidev/clipboard@0.2.0
  - @loomidev/colorpicker@0.2.0
  - @loomidev/command-palette@0.2.0
  - @loomidev/contact-card@0.2.0
  - @loomidev/countries@0.2.0
  - @loomidev/data-grid@0.2.0
  - @loomidev/date-range-picker@0.2.0
  - @loomidev/datepicker@0.2.0
  - @loomidev/divider@0.2.0
  - @loomidev/drawer@0.2.0
  - @loomidev/filter-builder@0.2.0
  - @loomidev/input@0.2.0
  - @loomidev/lightbox@0.2.0
  - @loomidev/modal@0.2.0
  - @loomidev/notification@0.2.0
  - @loomidev/number@0.2.0
  - @loomidev/otp@0.2.0
  - @loomidev/pagination@0.2.0
  - @loomidev/password@0.2.0
  - @loomidev/photo-gallery@0.2.0
  - @loomidev/processing@0.2.0
  - @loomidev/profile-menu@0.2.0
  - @loomidev/progress@0.2.0
  - @loomidev/progress-steps@0.2.0
  - @loomidev/qrcode@0.2.0
  - @loomidev/radio@0.2.0
  - @loomidev/rating@0.2.0
  - @loomidev/resizable@0.2.0
  - @loomidev/scroller@0.2.0
  - @loomidev/select@0.2.0
  - @loomidev/side-nav@0.2.0
  - @loomidev/slider@0.2.0
  - @loomidev/sortable@0.2.0
  - @loomidev/spinner@0.2.0
  - @loomidev/statistic@0.2.0
  - @loomidev/tab@0.2.0
  - @loomidev/table@0.2.0
  - @loomidev/tag@0.2.0
  - @loomidev/tag-input@0.2.0
  - @loomidev/text-editor@0.2.0
  - @loomidev/textarea@0.2.0
  - @loomidev/theme@0.2.0
  - @loomidev/theme-switcher@0.2.0
  - @loomidev/timeline@0.2.0
  - @loomidev/timepicker@0.2.0
  - @loomidev/timer@0.2.0
  - @loomidev/timezonepicker@0.2.0
  - @loomidev/toggle@0.2.0
  - @loomidev/tooltip@0.2.0
  - @loomidev/video@0.2.0
