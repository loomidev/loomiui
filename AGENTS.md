# LoomiUI Components Agent Notes

Always reason and work like a senior software developer.

This repo is a package-per-component monorepo. Public component changes usually need:

- Source updates under `packages/<component>/src/`.
- README updates in the same package when the public API, behavior, or examples change.
- Generated CSS refresh with `node packages/<component>/scripts/build-styles.mjs` when `src/styles.css` changes.
- Package-local TypeScript verification with `./node_modules/.bin/tsc -p packages/<component>/tsconfig.json` when possible.
- Focused tests with `./node_modules/.bin/web-test-runner packages/<component>/test/<file>.test.ts --config web-test-runner.config.mjs` when a package has tests.

Before hand-rolling new CSS/behavior in a component, check `@loomidev/core` first — every component already pulls it in via `loomiStyles(componentStyles)`, so reusing what's there beats copy-pasting a new version:

- Entrance/loading `@keyframes` -> `motionStyles` (`packages/core/src/motion.ts`): `loomi-fade-in`, `loomi-pop-in`, `loomi-rise-in`, `loomi-drop-in`, `loomi-slide-in`, `loomi-spin`.
- Floating dialog/panel drop-shadow -> `elevationStyles`'s `--loomi-shadow-elevated` (`packages/core/src/elevation.ts`).
- `:focus-visible` outline color -> `focusStyles`'s `--loomi-focus-ring-color` (`packages/core/src/focus.ts`). Never hardcode a bare `--loomi-primary-<shade>` with no fallback for this — the public theme slots have no default, so it silently renders no outline at all.
- Click-outside-closes-it -> `onClickOutside(el, handler)`.
- A short random id -> `randomSuffix()`.
- Arrow/Home/End menu navigation -> `nextMenuFocusIndex(event, currentIndex, itemCount)`, for a flat top-level menu that moves real DOM focus (dropmenu/context-menu's shape). Don't force it onto a component with a different navigation model (roving-tabindex toolbars, aria-activedescendant listboxes, grids) — those diverge enough that a shared helper would just add indirection.

Full reference, including when *not* to reuse a token and why: `packages/core/README.md`.

Prefer package-local verification over broad `pnpm --filter ...` commands if pnpm starts reinstalling, asking no-TTY install prompts, or hitting network errors. Keep generated artifacts and source changes scoped to the packages you actually touched.

Do not edit generated docs output directly when a generator owns it. Update the package README or source metadata instead.
