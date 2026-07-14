# LoomiUI Components Agent Notes

Always reason and work like a senior software developer.

This repo is a package-per-component monorepo. Public component changes usually need:

- Source updates under `packages/<component>/src/`.
- README updates in the same package when the public API, behavior, or examples change.
- Generated CSS refresh with `node packages/<component>/scripts/build-styles.mjs` when `src/styles.css` changes. (Each package's script is a thin shim; the actual build logic lives in `scripts/lib/build-component-styles.mjs` at the repo root — edit that, not the shims.)
- Package-local TypeScript verification with `./node_modules/.bin/tsc -p packages/<component>/tsconfig.json` when possible.
- Focused tests with `./node_modules/.bin/web-test-runner packages/<component>/test/<file>.test.ts --config web-test-runner.config.mjs` when a package has tests.

Before hand-rolling new CSS/behavior in a component, check `@loomidev/core` first — every component already pulls it in via `loomiStyles(componentStyles)`, so reusing what's there beats copy-pasting a new version:

- Entrance/loading `@keyframes` -> `motionStyles` (`packages/core/src/motion.ts`): `loomi-fade-in`, `loomi-pop-in`, `loomi-rise-in`, `loomi-drop-in`, `loomi-slide-in`, `loomi-spin`.
- Floating dialog/panel drop-shadow -> `elevationStyles`'s `--loomi-shadow-elevated` (`packages/core/src/elevation.ts`).
- `:focus-visible` outline color -> `focusStyles`'s `--loomi-focus-ring-color` (`packages/core/src/focus.ts`). Never hardcode a bare `--loomi-primary-<shade>` with no fallback for this — the public theme slots have no default, so it silently renders no outline at all.
- Click-outside-closes-it -> `onClickOutside(el, handler)`.
- A short random id -> `randomSuffix()`.
- Arrow/Home/End menu navigation -> `nextMenuFocusIndex(event, currentIndex, itemCount)`, for a flat top-level menu that moves real DOM focus (dropmenu/context-menu's shape). Don't force it onto a component with a different navigation model (roving-tabindex toolbars, aria-activedescendant listboxes, grids) — those diverge enough that a shared helper would just add indirection.

Full reference, including when _not_ to reuse a token and why: `packages/core/README.md`.

Prefer package-local verification over broad `pnpm --filter ...` commands if pnpm starts reinstalling, asking no-TTY install prompts, or hitting network errors. Keep generated artifacts and source changes scoped to the packages you actually touched.

Do not edit generated docs output directly when a generator owns it. Update the package README or source metadata instead.

Tailwind 4.3's `@source` scanner silently ignores entries without a `**` glob segment: bare file paths (`./src/foo.ts`), single-star globs (`./src/*.ts`), and brace forms all scan NOTHING — no warning — while `./src` (a directory) and `**`-globs work. `scripts/lib/build-component-styles.mjs` rewrites the `sources` option to `dir/**/basename` globs to compensate; keep that rewrite if you touch the script. Symptom of a regression: a component renders half-styled — safelisted runtime colors (`bg-*`) still apply but statically-authored utilities (radius, typography, borders) fall back to user-agent defaults. Only `@loomidev/button` currently passes `sources` (it authors utilities in TS via `computeClasses()`), so it breaks first. Remember `examples/*.html` import `dist/`, so after fixing styles you must run the package's full build, not just `build-styles.mjs`, before checking the page.

Custom-event TypeScript typings follow a strict split (see the `declare global` blocks in each component module):

- Event names unique to one package augment the global `HTMLElementEventMap` in that package's component module, next to its `HTMLElementTagNameMap` entry, with exported `Loomi<X>…Detail` interfaces (re-exported from the package `index.ts`).
- Names dispatched by several packages with different detail shapes — `loomi-select`, `loomi-empty-action`, `loomi-page-change`, `loomi-selection-change` — must NEVER be globally augmented (consumers importing two packages would hit TS2717). They live in exported per-package event maps instead: `LoomiSelectEventMap`, `LoomiTableEventMap`, `DataGridEventMap<TRecord>`, etc.
- `loomi-prefix-change` is dispatched by both input and password: both globally declare it with the same inline literal `CustomEvent<{ value: string }>` — identical literals merge, so keep them textually identical in both files.
- Core's `loomi-locale-change` fires on `globalThis`, so it augments `WindowEventMap` (in `packages/core/src/i18n.ts`), not `HTMLElementEventMap`.

When adding a new event, check whether the name is already used by another package (`grep -rn '"loomi-<name>"' packages/*/src`) before choosing global vs per-package typing.

Never write `:host-context(.dark)` (or `::host-context(.dark)`) in a component's `src/styles.css` — it has no Firefox support at all (never implemented, no cross-browser equivalent), and the build's CSS optimizer will also flag the single-colon form as an invalid pseudo-class. For dark-mode-aware CSS beyond what the `--loomi-*` semantic tokens already handle automatically, watch `document.documentElement`'s `dark` class in JS with `watchDarkMode()` from `@loomidev/core` and reflect it as an `.is-dark` class on the component's own root element instead — see `isDarkContext` in `packages/button/src/loomi-button.ts` and the comment on `.loomi-btn--secondary.is-dark:hover` in `packages/button/src/styles.css` for the reference pattern, and `packages/core/src/dark-mode.ts` for why (a single shared `MutationObserver` backs every subscriber).
