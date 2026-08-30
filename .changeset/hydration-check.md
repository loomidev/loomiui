---
"@loomidev/statistic": patch
---

Fix a hydration mismatch in `<loomi-statistic>`. The icon wrapper was rendered behind an
`isServer` guard, so the server emitted it and a client with no slotted icon did not —
different template shapes, which Lit rejects with "Hydration value mismatch" and recovers
from by discarding the server-rendered DOM. The wrapper now always renders and collapses
through CSS when the host has no `[slot="icon"]`, which both sides compute identically.
