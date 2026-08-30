---
"@loomidev/mcp-server": patch
---

Pull in patched versions of two transitive dependencies flagged by Dependabot.
`@hono/node-server` moves to 1.19.17 (path traversal in `serve-static` on Windows via an
encoded backslash) — it reaches users through `@loomidev/mcp-server`'s runtime dependency
on `@modelcontextprotocol/sdk`, which is the only one of the three advisories that ships.
`esbuild` moves to 0.28.1, which also collapses the two copies in the tree into one.
