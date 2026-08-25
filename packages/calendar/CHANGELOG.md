# @loomidev/calendar

## 0.3.0

### Patch Changes

- @loomidev/context-menu@0.3.0
- @loomidev/core@0.3.0
- @loomidev/datepicker@0.3.0
- @loomidev/dropmenu@0.3.0
- @loomidev/input@0.3.0
- @loomidev/modal@0.3.0
- @loomidev/select@0.3.0
- @loomidev/tag-input@0.3.0
- @loomidev/textarea@0.3.0
- @loomidev/timepicker@0.3.0
- @loomidev/toggle@0.3.0
- @loomidev/tooltip@0.3.0

## 0.2.0

### Minor Changes

- fe159c4: First public release of LoomiUI.

  All `@loomidev/*` packages share a single version number and are released together,
  so any set of them installed at the same version is mutually compatible.

  Versions stay in the `0.x` range while the component APIs settle. Until `1.0.0`,
  a minor bump may contain breaking changes; pin an exact version if you need
  stability across upgrades.

### Patch Changes

- 25c1177: Fixed the resource scheduler (`view="resource"`) rendering each room/resource row far
  too tall (up to hundreds of pixels instead of the intended ~72px) and positioning events
  under the wrong hour column on any viewport too narrow to fit every hour at its 80px
  minimum width. Both were caused by `.resource-timeline`: a stray `min-height` formula
  meant for the vertical day/week grid was overriding its intended fixed row height, and
  its absolutely-positioned `.resource-track` child contributed no intrinsic width of its
  own, so the row could compute a narrower width than the header above it and throw off
  the event `left`/`width` percentages.
- 505ea39: Replace raw gray ramps and `#ffffff` fallbacks with semantic Loomi surface, border, and
  on-primary text tokens so components respect dark mode and theme overrides consistently.
- Updated dependencies [697386a]
- Updated dependencies [0b73a79]
- Updated dependencies [0e4b550]
- Updated dependencies [8e300d8]
- Updated dependencies [697386a]
- Updated dependencies [fe159c4]
- Updated dependencies [0b97dfb]
- Updated dependencies [697386a]
- Updated dependencies [263ce12]
- Updated dependencies [505ea39]
- Updated dependencies [697386a]
- Updated dependencies [5644747]
- Updated dependencies [e1e36b7]
  - @loomidev/core@0.2.0
  - @loomidev/context-menu@0.2.0
  - @loomidev/dropmenu@0.2.0
  - @loomidev/datepicker@0.2.0
  - @loomidev/input@0.2.0
  - @loomidev/modal@0.2.0
  - @loomidev/select@0.2.0
  - @loomidev/tag-input@0.2.0
  - @loomidev/textarea@0.2.0
  - @loomidev/timepicker@0.2.0
  - @loomidev/toggle@0.2.0
  - @loomidev/tooltip@0.2.0
