# LoomiUI Components Agent Notes

Always reason and work like a senior software developer.

This repo is a package-per-component monorepo. Public component changes usually need:

- Source updates under `packages/<component>/src/`.
- README updates in the same package when the public API, behavior, or examples change.
- Generated CSS refresh with `node packages/<component>/scripts/build-styles.mjs` when `src/styles.css` changes.
- Package-local TypeScript verification with `./node_modules/.bin/tsc -p packages/<component>/tsconfig.json` when possible.
- Focused tests with `./node_modules/.bin/web-test-runner packages/<component>/test/<file>.test.ts --config web-test-runner.config.mjs` when a package has tests.

Prefer package-local verification over broad `pnpm --filter ...` commands if pnpm starts reinstalling, asking no-TTY install prompts, or hitting network errors. Keep generated artifacts and source changes scoped to the packages you actually touched.

Do not edit generated docs output directly when a generator owns it. Update the package README or source metadata instead.
