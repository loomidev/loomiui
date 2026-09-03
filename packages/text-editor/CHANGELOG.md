# @loomidev/text-editor

## 0.5.0

### Patch Changes

- ec8801a: Restore every form-associated control to its initial state through native form resets,
  document submitted value formats, and add generated React 18 and React 19 JSX types.
- 87c5d42: Drop bogus events from the custom-elements manifests. A component that dispatches through
  a helper — `new CustomEvent(name, …)` — made the analyzer record an event literally called
  `name` (or `type`), which then showed up in editor completions and framework integrations.
  `pnpm cem` now prunes any event named after a dispatch variable, along with unnamed ones.
- Updated dependencies [450d1d3]
- Updated dependencies [d3bc58c]
- Updated dependencies [87c5d42]
- Updated dependencies [450d1d3]
- Updated dependencies [fdac5da]
- Updated dependencies [ec8801a]
- Updated dependencies [ec8801a]
- Updated dependencies [87c5d42]
- Updated dependencies [7227978]
- Updated dependencies [742f156]
  - @loomidev/theme@0.5.0
  - @loomidev/core@0.5.0
  - @loomidev/filepicker@0.5.0
  - @loomidev/input@0.5.0
  - @loomidev/modal@0.5.0
  - @loomidev/select@0.5.0
  - @loomidev/icon@0.5.0
  - @loomidev/notification@0.5.0
  - @loomidev/tooltip@0.5.0

## 0.4.1

### Patch Changes

- @loomidev/core@0.4.1
- @loomidev/filepicker@0.4.1
- @loomidev/icon@0.4.1
- @loomidev/input@0.4.1
- @loomidev/modal@0.4.1
- @loomidev/notification@0.4.1
- @loomidev/select@0.4.1
- @loomidev/theme@0.4.1
- @loomidev/tooltip@0.4.1

## 0.4.0

### Patch Changes

- 9344aad: Restore every form-associated control to its initial state through native form resets,
  document submitted value formats, and add generated React 18 and React 19 JSX types.
- 9344aad: Drop bogus events from the custom-elements manifests. A component that dispatches through
  a helper — `new CustomEvent(name, …)` — made the analyzer record an event literally called
  `name` (or `type`), which then showed up in editor completions and framework integrations.
  `pnpm cem` now prunes any event named after a dispatch variable, along with unnamed ones.
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
  - @loomidev/core@0.4.0
  - @loomidev/filepicker@0.4.0
  - @loomidev/input@0.4.0
  - @loomidev/modal@0.4.0
  - @loomidev/select@0.4.0
  - @loomidev/icon@0.4.0
  - @loomidev/notification@0.4.0
  - @loomidev/tooltip@0.4.0

## 0.3.0

### Patch Changes

- @loomidev/core@0.3.0
- @loomidev/filepicker@0.3.0
- @loomidev/icon@0.3.0
- @loomidev/input@0.3.0
- @loomidev/modal@0.3.0
- @loomidev/notification@0.3.0
- @loomidev/select@0.3.0
- @loomidev/theme@0.3.0
- @loomidev/tooltip@0.3.0

## 0.2.0

### Minor Changes

- fe159c4: First public release of LoomiUI.

  All `@loomidev/*` packages share a single version number and are released together,
  so any set of them installed at the same version is mutually compatible.

  Versions stay in the `0.x` range while the component APIs settle. Until `1.0.0`,
  a minor bump may contain breaking changes; pin an exact version if you need
  stability across upgrades.

- dfa040a: Added an `uploadHandler` property and a `no-file-upload` attribute to
  `<loomi-text-editor>`, so a file picked in the image or video embed dialog no longer has
  to be inlined as a `data:` URL.

  Set `editor.uploadHandler = async (file, kind) => url` to upload the file yourself and
  insert the returned URL instead. `kind` is `"image"` or `"video"`, so images and video can
  be routed to different endpoints with different validation. Without a handler the previous
  `data:` URL behavior is unchanged.

  This matters for any app that sanitizes editor HTML on save: a media allowlist of
  `http`/`https` strips a `data:` URL outright, so the author's image would vanish with no
  explanation, and nothing could track which uploads a document referenced. If the handler
  rejects or resolves `undefined`, nothing is inserted, the dialog stays open, and the
  failure is surfaced as a `<loomi-notification>` error toast rather than being swallowed.

  `no-file-upload` hides the picker in both embed dialogs, leaving URL entry only, for apps
  that accept media library URLs exclusively.

### Patch Changes

- 505ea39: Replace raw gray ramps and `#ffffff` fallbacks with semantic Loomi surface, border, and
  on-primary text tokens so components respect dark mode and theme overrides consistently.
- 5644747: Make the vertical spacing below form fields themeable via a new `--loomi-field-spacing`
  token (default `1rem`). Stacked fields already shipped this margin on most components but not
  all — it's now consistent across every stacked field and overridable from `:root`:

  ```css
  :root {
    --loomi-field-spacing: 0; /* own field spacing yourself, e.g. via a flex/grid gap container */
  }
  ```

  `datepicker` and `timepicker` previously had no bottom margin and now match the other
  fields (a 1rem gap by default). `otp` (standalone/centered) and `colorpicker` (an inline
  swatch) intentionally keep no field margin. The per-instance `no-clearing` escape hatch is
  unchanged.

- Updated dependencies [f4689e1]
- Updated dependencies [697386a]
- Updated dependencies [0b73a79]
- Updated dependencies [697386a]
- Updated dependencies [7d35f2f]
- Updated dependencies [8f0bc31]
- Updated dependencies [fe159c4]
- Updated dependencies [0b97dfb]
- Updated dependencies [697386a]
- Updated dependencies [263ce12]
- Updated dependencies [505ea39]
- Updated dependencies [697386a]
- Updated dependencies [49b905b]
- Updated dependencies [5644747]
- Updated dependencies [e1e36b7]
  - @loomidev/filepicker@0.2.0
  - @loomidev/core@0.2.0
  - @loomidev/icon@0.2.0
  - @loomidev/input@0.2.0
  - @loomidev/modal@0.2.0
  - @loomidev/notification@0.2.0
  - @loomidev/select@0.2.0
  - @loomidev/theme@0.2.0
  - @loomidev/tooltip@0.2.0
