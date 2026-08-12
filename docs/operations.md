# Operations Runbook

This runbook covers repository CI, package releases, rollback, and common failures. The
system design lives in [architecture.md](architecture.md); maintainer ownership and
escalation live in [maintainer-guide.md](maintainer-guide.md).

## Delivery topology

The repository builds 87 workspace projects. Hand-authored source and committed metadata
flow through GitHub Actions into independently installable `@loomidev/*` npm packages.
Generated `dist/` files are not committed.

```text
pull request -> CI build/typecheck/browser tests/metadata checks
             -> merge to main
             -> Changesets release workflow
             -> version-packages PR or npm Trusted Publishing
```

`development` is the integration branch; `main` is the release branch. The release
workflow runs only on pushes to `main` and publishes through npm Trusted Publishing
(OIDC), so no npm token belongs in repository configuration.

## Pre-merge verification

Run the same high-value sequence used by CI:

```sh
pnpm install --frozen-lockfile
pnpm check:conflicts
pnpm check:bundles
pnpm lint
pnpm format:check
pnpm build
pnpm check:styles
pnpm typecheck
pnpm test
pnpm check:cem
pnpm audit:quality
pnpm quality:readmes
```

For a package-local change, begin with its style generator (when present), TypeScript,
and focused browser test. Run the full matrix before merging a cross-package or release
change.

## Release procedure

1. Confirm every user-visible package change has a changeset.
2. Merge the reviewed change to `main` with CI green.
3. Watch the Release workflow. With pending changesets it opens or updates the
   version-packages PR.
4. Review versions and generated changelogs in that PR; do not edit package versions by
   hand on the feature branch.
5. Merge the version-packages PR. The next Release workflow builds and publishes through
   npm OIDC.
6. Verify representative packages with `npm view @loomidev/<name> version` and install
   them in a clean consumer project.
7. Publish communication using [release-communication.md](release-communication.md).

## Rollback

npm package versions are immutable. Never attempt to overwrite a bad version.

1. Stop further release merges and record the affected versions/packages.
2. If impact is severe, deprecate the affected npm version with a message pointing to
   the last known-good version.
3. Revert the faulty source change through a reviewed pull request.
4. Add a patch changeset, run the full verification matrix, merge, and publish a new
   version.
5. Update release communication with the affected range, replacement version, and
   consumer action.

If the release workflow fails before npm publication, fix or revert the workflow/source
and rerun it; do not create package versions manually unless the automated path is
unavailable and a maintainer has approved the exception.

## Health checks

After publishing:

- npm reports the expected version for `@loomidev/core`, the changed leaf packages, and
  any affected bundle package;
- a clean install resolves no `workspace:` ranges;
- representative imports load from package exports;
- the MCP server starts over stdio and lists the expected components;
- the documentation source reflects the shipped README/API contract.

## Troubleshooting

### pnpm tries to reinstall or asks for a TTY

Use direct package-local commands from the repository root. Set `CI=true` only when a
frozen, non-interactive install is genuinely required. Do not delete the workspace or
lockfile as a first response.

### Browser tests cannot find Chrome

Run `pnpm rebuild puppeteer`. CI separately caches Puppeteer's browser directory and
performs this rebuild after dependency installation.

### Browser tests time out with zero results

Keep `test/chai-dom-diff.js` wired through `testRunnerHtml`. It shortens live DOM values
before assertion diffs cross the browser/Node boundary.

### Generated styles are stale

Run `pnpm build && pnpm styles:manifest`, inspect the source and hash changes, then commit
the manifest. Never edit `src/generated/styles.css.ts` directly.

### Component manifests are stale

Run `pnpm cem`, inspect the affected `custom-elements.json`, and commit it with the source
API change.

### A package is missing from a bundle or MCP listing

Update the relevant bundle's dependencies and exports. `pnpm check:bundles` and the MCP
manifest build derive completeness from those package contracts.

### Release authentication fails

Confirm the GitHub `npm` environment and npm Trusted Publisher configuration match this
repository and workflow. Do not add `NODE_AUTH_TOKEN` or `NPM_TOKEN`; either forces the
legacy authentication path instead of OIDC.
