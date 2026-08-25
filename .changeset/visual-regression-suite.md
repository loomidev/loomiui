---
"@loomidev/components": patch
---

Add a visual regression suite. `pnpm test:visual` renders every component in both themes
and compares the result against a committed baseline, which is the only check in the repo
that guards appearance — a theme token change alters how dozens of components render while
the unit tests, the accessibility sweep and the SSR check all still pass.
