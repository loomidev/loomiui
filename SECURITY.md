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
   `npm view @loomi/core`).

When reporting, please include:
- The affected package(s) and version(s).
- A description of the vulnerability and its potential impact.
- Steps to reproduce, or a minimal repro if possible.

## What to expect

- Acknowledgement of your report as soon as possible.
- An initial assessment of severity and whether it's accepted as a valid vulnerability.
- Coordination on a fix and a disclosure date — we'll credit you in the advisory and
  release notes unless you ask not to be.

## Scope

This policy covers the `@loomi/*` packages published from this repository. It does not
cover the [docs site](https://loomiui.com) infrastructure, third-party dependencies
(report those upstream), or the `examples/*.html` demo pages (not published, dev-only).
