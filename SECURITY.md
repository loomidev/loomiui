# Security Policy

## Supported versions

loomi is currently pre-1.0 (every package is versioned independently, starting at
`0.x`). Only the **latest published version of each affected package** is supported
with security fixes. There is no backport policy yet — that will be introduced once
packages start reaching `1.0`.

## Reporting a vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.**

Instead, report it privately using one of these methods:

1. **GitHub Security Advisories** (preferred): open a draft advisory at
   `https://github.com/<org>/<repo>/security/advisories/new` for this repository. This
   notifies maintainers privately and gives us a place to coordinate a fix and a
   disclosure timeline with you.
2. **Email**: if you don't have GitHub access or prefer email, contact the maintainer
   directly (see the `author`/contact info on the npm packages, e.g.
   `npm view @loomidev/core`).

When reporting, please include:

- The affected package(s) and version(s).
- A description of the vulnerability and its potential impact.
- Steps to reproduce, or a minimal repro if possible.

## What to expect

- Acknowledgement of your report as soon as possible.
- An initial assessment of severity and whether it's accepted as a valid vulnerability.
- Coordination on a fix and a disclosure date — we'll credit you in the advisory and
  release notes unless you ask not to be.

## Secret scanning

Every push and pull request runs [gitleaks](https://github.com/gitleaks/gitleaks) in CI
against the diff, looking for credential-shaped strings (API keys, tokens, private keys)
before they land in history. If a scan flags a real secret in your branch:

1. Rotate/revoke the credential immediately at its source (it must be treated as
   compromised the moment it's pushed, even to a branch that never merges).
2. Do not rely on a follow-up commit to "remove" it — it stays in git history. Force-push
   a rewritten branch, or ask a maintainer to help scrub history on a shared branch.
3. Open a report per "Reporting a vulnerability" above if the secret could have exposed
   user data or a production system.

A flagged match that isn't a real secret (a test fixture, an example key) can be
allowlisted in `.gitleaks.toml` at the repo root — add the specific rule or path rather
than disabling the scan.

## Scope

This policy covers the `@loomidev/*` packages published from this repository. It does not
cover the [docs site](https://loomiui.com) infrastructure, third-party dependencies
(report those upstream), or the `examples/*.html` demo pages (not published, dev-only).
