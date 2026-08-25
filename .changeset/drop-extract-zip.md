---
"@loomidev/mcp-server": patch
---

Override `@puppeteer/browsers` to v3, which replaced `extract-zip` with `modern-tar` and so
removes the last outstanding Dependabot advisory (GHSA-jmr9-qjv8-65gv, an unpatched symlink
path traversal with no fixed release). It was dev-only — it arrived through
`@web/test-runner`'s built-in Chrome launcher, which this repo does not use since the test
runner moved to Playwright — but it is now simply absent from the tree.
