---
"@loomidev/icon": patch
---

Fix the `branded` badge rendering with square corners regardless of `radius`.

The `radius` presets mapped to Tailwind `rounded-*` classes, but the icon package's style
build scans no sources, so those utilities were never compiled and every badge had
`border-radius: 0`. The presets are now plain CSS. The badge is also exposed as
`::part(badge)`, and a new `--loomi-icon-radius` custom property overrides the preset.
