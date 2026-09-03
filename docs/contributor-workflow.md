# Contributor Workflow

This is the shortest path from issue to review. Use
[CONTRIBUTING.md](../CONTRIBUTING.md) when you need the design rationale or detailed
component-creation and publishing guides.

## 1. Prepare

```sh
corepack enable
pnpm install
pnpm build
```

Read the issue, the affected package README, its source, and its existing tests before
editing. Check `@loomidev/core` for shared behavior and tokens before adding local copies.

## 2. Change the source of truth

- Component behavior: `packages/<name>/src/`
- Component styles: `packages/<name>/src/styles.css`
- Public contract/examples: `packages/<name>/README.md`
- Public element metadata: source JSDoc, then `pnpm cem`
- Shared style compiler: `scripts/lib/build-component-styles.mjs`
- Generated documentation: update its README/source input, not generated output

## 3. Verify locally

For a component with styles and tests:

```sh
node packages/<name>/scripts/build-styles.mjs   # skip if the package has no scripts/ dir —
                                                 # its styles are a `css` template literal,
                                                 # not a compiled styles.css
./node_modules/.bin/tsc -p packages/<name>/tsconfig.json
./node_modules/.bin/web-test-runner packages/<name>/test/<file>.test.ts --config web-test-runner.config.mjs
```

Then run the relevant repository checks. Cross-package or build-tooling changes require
the full matrix in [operations.md](operations.md).

## 4. Prepare the change

```sh
pnpm changeset       # publishable behavior only
pnpm format:check
git diff --check
```

Review the final diff for unrelated files, generated-output mistakes, and public docs
drift. In the pull request, state what changed, why, validation performed, and any browser
or external verification still outstanding.

## Common traps

- Tests import `dist/`; rebuild before testing.
- Generated style modules are ignored; refresh their manifest after intentional changes.
- Component CEM files are committed; regenerate them after public API changes.
- Shared event names with different detail shapes cannot all augment
  `HTMLElementEventMap`.
- `:host-context(.dark)` is unsupported in Firefox; use semantic tokens or the shared
  dark-mode watcher pattern.
- Preserve existing uncommitted work and never stage unrelated files silently.
