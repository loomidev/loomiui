---
"@loomidev/progress": patch
"@loomidev/timeline": patch
---

Fix two grouping components that silently ignored part of their own API, both found by
writing the tests that were missing.

`<loomi-progress-steps>` could not change step after its first render. It derives each
step's state from `current`, but skipped any step whose state the author had set — and it
detected that by reading attributes, which `active`, `completed` and `error` all reflect.
The state the group wrote therefore came back as author intent on the next sync, freezing
every step at whatever the first render produced. Author intent is now recorded once, the
first time each step is seen.

`<loomi-timeline>` overrode an item's explicit `placement` with the group's, where `icon`
and `color` beside it correctly treat the group's value as a default. An explicit
`<loomi-timeline-item placement="left">` inside a right-placed timeline now keeps its own.
