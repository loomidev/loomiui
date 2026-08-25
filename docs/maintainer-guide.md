# Maintainer Guide

This guide defines repository administration, routine maintenance, and escalation. It
does not grant access; GitHub organization, npm scope, and environment permissions remain
the authoritative controls.

## Responsibilities

Maintainers:

- keep `development` and `main` protected by required CI and review;
- review public API compatibility, accessibility, generated metadata, and changesets;
- keep dependencies and security advisories triaged;
- oversee the Changesets release PR and npm Trusted Publishing;
- ensure issue state reflects verified repository evidence;
- keep contributor, architecture, operations, and security documentation current.

## Routine cadence

### Per pull request

- Confirm the change is scoped and its issue/acceptance criteria are clear.
- Require package README and custom-element metadata updates for public contracts.
- Require a changeset for publishable behavior; omit it for docs-only/internal tooling.
- Review focused tests plus the full CI result.
- Check that generated style and CEM artifacts are current.

### Weekly

- Triage new bugs, security alerts, dependency updates, and failed workflows.
- Review open release/version PRs and stalled high-priority issues.
- Check that issue labels, milestone, and roadmap metadata still match the work.

### Before release

- Follow [operations.md](operations.md), review all generated changelogs, and confirm npm
  environment approvals.
- Verify migration impact and prepare [release communication](release-communication.md).

## Issue administration

Treat task issues as completion units and feature/epic/milestone/release issues as parent
trackers. Close a task only after its source, tests, documentation, and CI evidence satisfy
the acceptance criteria. Do not infer completion from the title or from a related commit
alone.

When closing, leave a concise evidence comment naming the implementation, relevant tests,
and documentation. Parent trackers close only when their child scope and exit criteria are
actually complete.

## Access and secrets

- Prefer least privilege and organization-managed teams.
- Require two-factor authentication for privileged accounts.
- Keep npm publication on Trusted Publishing; never commit registry tokens.
- Review GitHub environment protection and branch rules after ownership changes.
- Remove stale collaborators and rotate any exposed credential immediately.

## Escalation paths

| Situation                                  | First response                                                                         | Escalate when                                                    | Destination                                                |
| ------------------------------------------ | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------- |
| CI or build regression                     | Reproduce with the failing job's exact command and isolate the package                 | Default branches are blocked or failures are non-deterministic   | Repository maintainer responsible for build tooling        |
| npm release failure                        | Stop additional release merges; inspect the Release workflow and npm publication state | A version partially published or credentials/OIDC are implicated | Release administrator and npm scope owner                  |
| Security report                            | Keep details private and follow `SECURITY.md`                                          | Credible impact, active exploitation, or secret exposure         | GitHub Security Advisory participants and repository owner |
| Accessibility regression                   | Add a minimal reproduction and affected interaction/assistive technology               | A public release is affected or remediation changes API          | Component maintainer plus accessibility reviewer           |
| Data loss or destructive repository action | Stop writes and preserve logs/current refs                                             | Recovery or force operations may be required                     | Repository owner                                           |
| Conduct or community concern               | Preserve relevant links and avoid public argument                                      | Safety, harassment, or maintainer conflict                       | Repository owner through a private channel                 |

If a named owner is unavailable, escalate to the GitHub organization owner. Never work
around rejected permissions with alternate credentials or unreviewed manual publication.

## Incident record

For material incidents, record:

- start/detection/resolution times in UTC;
- affected packages, versions, branches, or workflows;
- user impact and containment;
- commands or changes used for recovery;
- root cause and follow-up issues with owners.

Keep vulnerability details in the private advisory until coordinated disclosure.
