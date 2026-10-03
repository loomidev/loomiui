# @loomidev/react

## 0.11.0

### Patch Changes

- @loomidev/components@0.11.0
  - @loomidev/react-types@0.11.0

## 0.10.0

### Minor Changes

- 92bd99d: Insert content at the caret from your own controls.
  
  - `<loomi-text-editor>` gains `insertText(text)`, `insertHTML(html)` and `getSelection()`. The editor remembers its last selection, so inserts from an external toolbar land at the caret (or at the end if nothing was ever selected). New `customTools` property renders app-defined toolbar buttons with the built-in look and tooltip; clicking one calls its `run(editor)` and fires `loomi-tool` with `{ id, insertText, insertHTML }`. New `toolbar-start` and `toolbar-end` slots.
  - `<loomi-input>`, `<loomi-password>` and `<loomi-textarea>` gain `insertText(text)` (replaces the selection and fires `input`), plus `selectionStart`, `selectionEnd` and `setSelectionRange()` forwarded to the inner field.
  - Fixes in `<loomi-text-editor>`: toolbar commands fired `input` twice per edit. It read the selection from the host's root instead of its own shadow root, so in Chromium its link, embed and AI tools didn't see the selection, and in WebKit a saved selection couldn't be restored.
  - `@loomidev/core` exports the `insertTextAtCaret()` helper; `@loomidev/react` adds `onLoomiTool` to `TextEditor`.
- 29cce36: Form controls now follow the native value-and-events contract (documented in `@loomidev/core`'s README), so framework two-way bindings work on the tags directly.
  
  - `<loomi-select>` gains a settable `value` (comma-joined when `multiple`) and `values` (`string[]`), and fires `input` before `change` on every pick. Typing in its search box no longer fires `input` on the host, and a pick survives a later `data` swap.
  - `<loomi-checkbox>` and `<loomi-toggle>` expose a read-only `type` of `"checkbox"`, `<loomi-radio>` one of `"radio"`. All three fire `input` (with `checked` already updated) before `change`. Setting a radio's `checked` unchecks the rest of its group, as a native radio does.
  - `<loomi-otp>` gains a settable `value` and now fires `input` on each edit and `change` when focus leaves the boxes. Moving it in the DOM no longer clears the code.
  - `<loomi-datepicker>`, `<loomi-timepicker>` and `<loomi-slider>` turn their read-only `value` into a settable one. `<loomi-checkcards>` gains `value`/`values`. `<loomi-filepicker>` gains a native-style `value` (set `""` to clear). Each now fires `input` before `change` on user edits. The timepicker and checkcards honor `selected-value` changes after the first render, and the timepicker converts between 12- and 24-hour input.
  - `<loomi-input>`, `<loomi-password>`, `<loomi-textarea>`, `<loomi-number>`, `<loomi-autocomplete>`, `<loomi-tag-input>`, `<loomi-text-editor>` and `<loomi-slider>` fire exactly one `input` per edit (the inner field's native event used to leak through as a second one). Text fields re-sync when a listener rewrites `value` mid-edit.
  - `<loomi-text-editor>` fires `change` only when focus leaves after an edit, not on every blur. `<loomi-number>` no longer fires an extra `input` on commit unless the commit clamped the number. `<loomi-autocomplete>` commits typed free text with `change` on leaving the field. `<loomi-timepicker>` no longer fires `change` for a pick that leaves the time unchanged.
  - `@loomidev/react` wrappers gain `onInput` where the controls newly declare `input`.

### Patch Changes

- ee9d5a7: Cut what components cost a consumer bundle.
  
  - Icons load on demand. `@loomidev/icons` no longer inlines Heroicons: each icon is its own module, loaded the first time it renders, through the new `loomiIcon()` directive, `hasLoomiIcon()` and `loadLoomiIcon()`. `getLoomiIcon()` now returns only icons that are ready (registered, provided or already loaded). `import "@loomidev/icons/all"` restores the eager set. Components ship their own chrome icons statically via `provideLoomiIcons()`. The Heroicons set is now complete (324 icons per variant).
  - Iconsax and Untitled UI are opt-in: `import "@loomidev/icons/iconsax"` / `"@loomidev/icons/untitledui"`. Until then their names are unknown and `<loomi-icon>` falls back to its slot with a one-time console warning. `<loomi-text-editor>` registers the toolbar icons it uses, so it needs neither.
  - Every package declares `"sideEffects"` precisely, so bundlers tree-shake unused modules.
  - `@loomidev/button` safelists only the utility classes it builds at runtime; its compiled styles drop from 89 KB to 14 KB. The button is now about 8.4 KB min+gz including styles (was about 102 KB).
  - `LOOMI_CONTROL_SIZES` moved to core's `size` module (same export from `@loomidev/core`), so importing it no longer pulls in the field stylesheets.
  - Each README has a Bundle size section, and `pnpm check:bundle-size` reports every package's size in CI with a 10 KB hard limit on the button.
- Updated dependencies [ee9d5a7]
  - @loomidev/components@0.10.0
  - @loomidev/react-types@0.10.0

## 0.9.0

### Patch Changes

- @loomidev/components@0.9.0
  - @loomidev/react-types@0.9.0

## 0.8.0

### Patch Changes

- Updated dependencies [661d4c0]
  - @loomidev/react-types@0.8.0
  - @loomidev/components@0.8.0

## 0.7.0

### Patch Changes

- @loomidev/components@0.7.0
  - @loomidev/react-types@0.7.0

## 0.6.0

### Patch Changes

- @loomidev/components@0.6.0
  - @loomidev/react-types@0.6.0

## 0.5.0

### Minor Changes

- 08a054c: Add per-component entry points to `@loomidev/react`. Every wrapper now lives in its own
  module and is exported under a subpath named after its tag:

  ```tsx
  import { DataGrid } from "@loomidev/react/data-grid";
  import { CommandPalette } from "@loomidev/react/command-palette";
  ```

  Importing from the package root still works and is unchanged, but it registers all ~100
  custom elements because the root barrel side-effect imports every component package. Apps
  that use a handful of components can now import them individually and ship only those
  elements.

### Patch Changes

- 87c5d42: Document the events that were missing from the custom-elements manifests. The analyzer
  only sees `new CustomEvent("literal-name")`, so events dispatched through a helper or a
  template literal — all nine `<loomi-data-grid>` events, the three
  `<loomi-date-range-picker>` events, `loomi-command-query-change`, `loomi-filter-apply`,
  `loomi-reminder-create`, the `<loomi-chat-window>` attachment and recording events, and
  `<loomi-input>`'s affix events — never reached `custom-elements.json`, and so never
  reached the React wrappers either. They are now declared with `@fires` and generate typed
  `on*` callback props.

  `<loomi-empty-state>` documented a `loomi-action` event it never fires; its JSDoc now
  names the `action` event the component actually dispatches.

- 450d1d3: Export a typed `EventMap` (and named detail interfaces) from fourteen more component
  packages. `@loomidev/react` derives each `on*` callback's type from these, so events on
  these components now carry a typed `detail` instead of falling back to `any`.
- Updated dependencies [ec8801a]
- Updated dependencies [d3069e0]
- Updated dependencies [d3069e0]
  - @loomidev/react-types@0.5.0
  - @loomidev/components@0.5.0

## 0.4.1

### Patch Changes

- bdc6c10: Bring `@loomidev/react` and `@loomidev/react-types` onto the shared version line. They were
  left out of the changesets `fixed` group, so they versioned independently and sat at 0.1.0
  while the other 86 packages moved to 0.4.0. They are in the group now, and this release
  pulls every package to the same version.
- Updated dependencies [bdc6c10]
  - @loomidev/react-types@0.4.1
  - @loomidev/components@0.4.1

## 0.1.0

### Minor Changes

- 9344aad: Add per-component entry points to `@loomidev/react`. Every wrapper now lives in its own
  module and is exported under a subpath named after its tag:

  ```tsx
  import { DataGrid } from "@loomidev/react/data-grid";
  import { CommandPalette } from "@loomidev/react/command-palette";
  ```

  Importing from the package root still works and is unchanged, but it registers all ~100
  custom elements because the root barrel side-effect imports every component package. Apps
  that use a handful of components can now import them individually and ship only those
  elements.

### Patch Changes

- 9344aad: Document the events that were missing from the custom-elements manifests. The analyzer
  only sees `new CustomEvent("literal-name")`, so events dispatched through a helper or a
  template literal — all nine `<loomi-data-grid>` events, the three
  `<loomi-date-range-picker>` events, `loomi-command-query-change`, `loomi-filter-apply`,
  `loomi-reminder-create`, the `<loomi-chat-window>` attachment and recording events, and
  `<loomi-input>`'s affix events — never reached `custom-elements.json`, and so never
  reached the React wrappers either. They are now declared with `@fires` and generate typed
  `on*` callback props.

  `<loomi-empty-state>` documented a `loomi-action` event it never fires; its JSDoc now
  names the `action` event the component actually dispatches.

- 9344aad: Export a typed `EventMap` (and named detail interfaces) from fourteen more component
  packages. `@loomidev/react` derives each `on*` callback's type from these, so events on
  these components now carry a typed `detail` instead of falling back to `any`.
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
- Updated dependencies [9344aad]
  - @loomidev/react-types@0.1.0
  - @loomidev/components@0.4.0
