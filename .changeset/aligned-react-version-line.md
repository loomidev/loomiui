---
"@loomidev/react": patch
"@loomidev/react-types": patch
---

Bring `@loomidev/react` and `@loomidev/react-types` onto the shared version line. They were
left out of the changesets `fixed` group, so they versioned independently and sat at 0.1.0
while the other 86 packages moved to 0.4.0. They are in the group now, and this release
pulls every package to the same version.
