# Release notes

Plain-language notes for each `vX.Y.Z` GitHub release, one file per version:
`release-notes/v<version>.md`.

The Release workflow uses the file for the version it just published as the notes of the
draft `vX.Y.Z` release, so the draft is ready to publish as written. Without a file for
that version it falls back to a technical draft assembled from the package changelogs
(`scripts/draft-release-notes.mjs`), which then needs rewriting before it's published.

## When to write one

Add `v<next version>.md` to the release pull request (`development` → `main`), so the
notes are reviewed with the code they describe. The next version is the current one with
the largest bump among the pending changesets: all packages are versioned together, so any
`minor` changeset makes it the next minor.

## How to write one

Write for the people using the components, not for this repo. The existing files are the
model:

- Open with a sentence or two on what the release is about.
- Group changes by what users will notice, not by package or changeset.
- Prefer concrete before/after examples: what a screen reader now says, what used to go
  wrong on a phone.
- Under **Breaking changes**, give the exact edit to make.
- Finish with **Upgrading**: the install command, and a reminder that a `^0.x` range won't
  pick up a new minor on its own.
- Leave out internals such as ARIA attribute plumbing, axe rule names and new package
  dependencies. The changesets and package CHANGELOGs keep that detail.

Check every claim against the code; plain wording can easily overstate a change.
