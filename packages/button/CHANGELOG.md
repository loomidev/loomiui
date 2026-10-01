# @loomidev/button

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

- 9f5d56f: Pressing Enter in a single-line field now submits its form, following the HTML spec's implicit submission. `<loomi-input>`, `<loomi-password>`, `<loomi-number>`, `<loomi-otp>` (once complete) and `<loomi-autocomplete>` (when no suggestion is highlighted) activate the form's default button, whether native or `<loomi-button can-submit>`. With no submit button they submit the form directly when it has only one text-like field. Validation runs and `submit` fires once. The Enter that commits an IME composition is ignored. Opt out per field with `no-implicit-submit`. `@loomidev/core` exports the shared `implicitlySubmit()` helper. `<loomi-autocomplete>` no longer opens its list on Enter inside a form.
- Updated dependencies [ee9d5a7]
- Updated dependencies [a0482d2]
- Updated dependencies [92bd99d]
- Updated dependencies [9f5d56f]
- Updated dependencies [29cce36]
  - @loomidev/core@0.10.0
  - @loomidev/icons@0.10.0
  - @loomidev/theme@0.10.0

## 0.9.0

### Minor Changes

- 3bae883: `<loomi-profile-menu>` now slots its `<loomi-dropmenu-item>` children through to the internal dropmenu instead of moving them into its shadow root, so page CSS (including `::part()` selectors) keeps styling the items and their content. `<loomi-dropmenu>` finds its items through the flattened default slot, so any wrapper that forwards items through a `<slot>` works the same way.
  
  `<loomi-button>` gains a `full-width` attribute: the host becomes a block that fills its container, with the label centered.
  
  `<loomi-dropmenu-item hover="false">` now actually turns the row tint off (the attribute used to be read as `true` whenever present). Pair it with a `full-width` button for a button row, like a Sign out action at the bottom of a profile menu.

### Patch Changes

- f46f84a: `type="secondary"` with a `color` now stays an outline: surface fill with the palette's border and text, the same hover and focus as `outline color="…"`, instead of switching to a solid fill. Plain `type="secondary"` is unchanged. `info` and `gray` outlines also get their palette border and hover (they previously fell back to the default border). `<loomi-split-button type="secondary" color="…">` picks this up too.
- @loomidev/core@0.9.0
  - @loomidev/icons@0.9.0
  - @loomidev/theme@0.9.0

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
  - @loomidev/icons@0.8.0
  - @loomidev/theme@0.8.0

## 0.7.0

### Patch Changes

- Updated dependencies [c952b7d]
  - @loomidev/core@0.7.0
  - @loomidev/icons@0.7.0
  - @loomidev/theme@0.7.0

## 0.6.0

### Minor Changes

- fd109c2: Remove `border-width="4"` and `border-width="8"` from `<loomi-button>`; only `1` (default) and `2` remain, and other values fall back to `1`. `outline` is now documented as primary-only: a `secondary` button is already an outline, so `type="secondary" outline` is redundant.
- fd109c2: Add a `circle` attribute for square, full-radius icon buttons, intended only for icon-only buttons.

### Patch Changes

- Updated dependencies [fd109c2]
- Updated dependencies [fd109c2]
  - @loomidev/core@0.6.0
  - @loomidev/icons@0.6.0
  - @loomidev/theme@0.6.0

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

### Patch Changes

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
