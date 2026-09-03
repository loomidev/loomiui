# @loomidev/react

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
