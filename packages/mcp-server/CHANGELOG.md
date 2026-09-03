# @loomidev/mcp-server

## 0.5.0

### Patch Changes

- 439b8e8: Override `@puppeteer/browsers` to v3, which replaced `extract-zip` with `modern-tar` and so
  removes the last outstanding Dependabot advisory (GHSA-jmr9-qjv8-65gv, an unpatched symlink
  path traversal with no fixed release). It was dev-only — it arrived through
  `@web/test-runner`'s built-in Chrome launcher, which this repo does not use since the test
  runner moved to Playwright — but it is now simply absent from the tree.
- 53a6faa: Validate component metadata, bundle-derived categories, and built-in locale shapes while
  building the MCP documentation manifest. Include all component packages and record locale
  translation coverage in the bundled manifest.
- 26f6217: Pull in patched versions of two transitive dependencies flagged by Dependabot.
  `@hono/node-server` moves to 1.19.17 (path traversal in `serve-static` on Windows via an
  encoded backslash) — it reaches users through `@loomidev/mcp-server`'s runtime dependency
  on `@modelcontextprotocol/sdk`, which is the only one of the three advisories that ships.
  `esbuild` moves to 0.28.1, which also collapses the two copies in the tree into one.

## 0.4.1

## 0.4.0

### Patch Changes

- 9344aad: Override `@puppeteer/browsers` to v3, which replaced `extract-zip` with `modern-tar` and so
  removes the last outstanding Dependabot advisory (GHSA-jmr9-qjv8-65gv, an unpatched symlink
  path traversal with no fixed release). It was dev-only — it arrived through
  `@web/test-runner`'s built-in Chrome launcher, which this repo does not use since the test
  runner moved to Playwright — but it is now simply absent from the tree.
- 9344aad: Validate component metadata, bundle-derived categories, and built-in locale shapes while
  building the MCP documentation manifest. Include all component packages and record locale
  translation coverage in the bundled manifest.
- 9344aad: Pull in patched versions of two transitive dependencies flagged by Dependabot.
  `@hono/node-server` moves to 1.19.17 (path traversal in `serve-static` on Windows via an
  encoded backslash) — it reaches users through `@loomidev/mcp-server`'s runtime dependency
  on `@modelcontextprotocol/sdk`, which is the only one of the three advisories that ships.
  `esbuild` moves to 0.28.1, which also collapses the two copies in the tree into one.

## 0.3.0

## 0.2.0

### Minor Changes

- fe159c4: First public release of LoomiUI.

  All `@loomidev/*` packages share a single version number and are released together,
  so any set of them installed at the same version is mutually compatible.

  Versions stay in the `0.x` range while the component APIs settle. Until `1.0.0`,
  a minor bump may contain breaking changes; pin an exact version if you need
  stability across upgrades.
