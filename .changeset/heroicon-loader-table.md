---
"@loomidev/icons": patch
---

The Heroicons loader that the first dynamic icon fetches is smaller: about 3.5 KB gzipped, down from 4.4 KB. Each icon still loads as its own chunk in every bundler, and an unknown icon name resolves `undefined` without a request.
