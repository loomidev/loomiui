# Release and Migration Communication

Use these templates after the version-packages PR is ready. Replace every bracketed
placeholder; remove sections that do not apply. Package changelogs remain the detailed
source of truth, while these messages explain impact and action in user language.

## Release notes template

````md
# LoomiUI [version]

[One sentence describing the release outcome and intended audience.]

## Highlights

- **[Capability]** — [What changed and why it matters.]
- **[Capability]** — [What changed and why it matters.]

## Packages

- `@loomidev/[package]@[version]`: [Concise user-visible change.]
- `@loomidev/[package]@[version]`: [Concise user-visible change.]

## Upgrade

```sh
pnpm update "@loomidev/*@[version]"
````

[State "No migration is required" or link to the migration section below.]

## Verification

- [Build/typecheck/test status or release workflow link]
- [Browser/accessibility verification relevant to the release]

## Thanks

[Credit external contributors when applicable.]

````

## Migration guide template

```md
# Migrating to LoomiUI [version]

## Who needs to act

[Describe the affected packages, APIs, configurations, and versions.]

## Before upgrading

1. Commit or stash local application changes.
2. Record the currently installed LoomiUI versions from the lockfile.
3. Run the application's existing tests for a baseline.

## Required changes

### [Old API or behavior] → [new API or behavior]

Before:

```html
[old example]
````

After:

```html
[new example]
```

Reason: [Why the contract changed.]

## Upgrade and verify

```sh
pnpm update "@loomidev/*@[version]"
pnpm build
pnpm test
```

Verify [specific rendering, events, form submission, accessibility, or theme behavior].

## Rollback

Restore the previous exact package versions and lockfile, reinstall with the frozen
lockfile, then redeploy the last known-good application build.

````

## Short announcement template

```md
LoomiUI [version] is available. [One-sentence highlight].

[Migration impact: none / action required with link]. Release notes: [link].
````

## Communication checklist

- Confirm npm shows every package/version named in the message.
- Link the merged version PR and generated package changelogs.
- State migration impact explicitly, including when there is none.
- Include a tested upgrade command and rollback path for breaking changes.
- Publish the same facts across channels; shorten wording without changing the contract.
