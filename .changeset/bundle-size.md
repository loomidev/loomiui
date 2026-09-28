---
"@loomidev/accordion": patch
"@loomidev/alert": minor
"@loomidev/arc-meter": patch
"@loomidev/autocomplete": minor
"@loomidev/avatar": patch
"@loomidev/bell": patch
"@loomidev/bottom-nav": patch
"@loomidev/breadcrumb": patch
"@loomidev/button": minor
"@loomidev/button-group": minor
"@loomidev/calendar": patch
"@loomidev/card": patch
"@loomidev/centered-content": patch
"@loomidev/chart": patch
"@loomidev/chat": patch
"@loomidev/checkbox": patch
"@loomidev/checkcards": minor
"@loomidev/clipboard": minor
"@loomidev/colorpicker": patch
"@loomidev/command-palette": patch
"@loomidev/components": minor
"@loomidev/contact-card": minor
"@loomidev/content": patch
"@loomidev/context-menu": minor
"@loomidev/core": minor
"@loomidev/countries": patch
"@loomidev/creditcard": patch
"@loomidev/data-grid": patch
"@loomidev/date-range-picker": patch
"@loomidev/datepicker": patch
"@loomidev/divider": patch
"@loomidev/drawer": patch
"@loomidev/dropmenu": minor
"@loomidev/emoji-picker": patch
"@loomidev/empty-state": patch
"@loomidev/fab": patch
"@loomidev/filepicker": patch
"@loomidev/filter-builder": patch
"@loomidev/floating-panel": patch
"@loomidev/forms": patch
"@loomidev/horizontal-line-graph": patch
"@loomidev/icon": minor
"@loomidev/icons": minor
"@loomidev/input": minor
"@loomidev/lightbox": patch
"@loomidev/listview": patch
"@loomidev/modal": patch
"@loomidev/navigation": patch
"@loomidev/notification": patch
"@loomidev/number": patch
"@loomidev/otp": patch
"@loomidev/pagination": patch
"@loomidev/password": minor
"@loomidev/photo-gallery": patch
"@loomidev/popover": minor
"@loomidev/processing": patch
"@loomidev/profile-menu": minor
"@loomidev/progress": patch
"@loomidev/progress-steps": patch
"@loomidev/qrcode": patch
"@loomidev/radio": patch
"@loomidev/rating": patch
"@loomidev/react": patch
"@loomidev/react-types": patch
"@loomidev/resizable": patch
"@loomidev/scroller": patch
"@loomidev/select": patch
"@loomidev/side-nav": minor
"@loomidev/skeleton": patch
"@loomidev/slider": patch
"@loomidev/sortable": minor
"@loomidev/spinner": patch
"@loomidev/split-button": patch
"@loomidev/statistic": patch
"@loomidev/tab": minor
"@loomidev/table": minor
"@loomidev/tag": patch
"@loomidev/tag-input": minor
"@loomidev/text-editor": minor
"@loomidev/textarea": patch
"@loomidev/theme": patch
"@loomidev/theme-switcher": minor
"@loomidev/timeline": minor
"@loomidev/timepicker": patch
"@loomidev/timer": patch
"@loomidev/timezonepicker": patch
"@loomidev/toggle": patch
"@loomidev/tooltip": patch
"@loomidev/video": patch
---

Cut what components cost a consumer bundle.

- Icons load on demand. `@loomidev/icons` no longer inlines Heroicons: each icon is its own module, loaded the first time it renders, through the new `loomiIcon()` directive, `hasLoomiIcon()` and `loadLoomiIcon()`. `getLoomiIcon()` now returns only icons that are ready (registered, provided or already loaded). `import "@loomidev/icons/all"` restores the eager set. Components ship their own chrome icons statically via `provideLoomiIcons()`. The Heroicons set is now complete (324 icons per variant).
- Iconsax and Untitled UI are opt-in: `import "@loomidev/icons/iconsax"` / `"@loomidev/icons/untitledui"`. Until then their names are unknown and `<loomi-icon>` falls back to its slot with a one-time console warning. `<loomi-text-editor>` registers the toolbar icons it uses, so it needs neither.
- Every package declares `"sideEffects"` precisely, so bundlers tree-shake unused modules.
- `@loomidev/button` safelists only the utility classes it builds at runtime; its compiled styles drop from 89 KB to 14 KB. The button is now about 10 KB min+gz including styles (was about 102 KB).
- `LOOMI_CONTROL_SIZES` moved to core's `size` module (same export from `@loomidev/core`), so importing it no longer pulls in the field stylesheets.
- Each README has a Bundle size section, and `pnpm check:bundle-size` reports every package's size in CI with a 10 KB hard limit on the button.
