---
"@loomidev/theme": minor
"@loomidev/core": minor
"@loomidev/button": minor
"@loomidev/table": minor
"@loomidev/lightbox": minor
"@loomidev/checkcards": minor
"@loomidev/filepicker": minor
"@loomidev/empty-state": minor
---

Fixes from issue #208.

- theme: `tailwind-colors.css` fallbacks are valid CSS (`var(--_loomi-*-default)`) and the file declares the defaults on `:root`, so it works on the page. New `@loomidev/theme/defaults.css` publishes every default on `:root` (dark values under `.dark`).
- theme: semantic tokens (`--loomi-surface`, `--loomi-text`, `--loomi-text-on-primary`, …) are now private defaults like the palette, so a page's `:root` override reaches inside every component. Breaking: these are no longer declared under their public names on `:host`.
- button: `color="secondary"` on a solid button fills with the secondary palette. Filled text uses `--loomi-text-on-<color>` (white by default). A `can-submit` button with `name`/`value` adds the pair to the submission. `element.click()` on the host submits or follows the link like a native button. A disabled fieldset disables it.
- table: authored `part` attributes are documented as styleable, `<template slot="styles">` applies a stylesheet inside the table, and new `badge`, `muted`, `thumb` and `actions` cell helpers.
- lightbox: the trigger has `part="trigger"` and fills the host; the fallback image has `part="image"`.
- checkcards: `required` blocks an empty submission and keeps the last selected card.
- filepicker: `capture` opens the phone camera.
- empty-state: the built-in illustration is a WebP loaded on demand, so importing the component no longer pulls in ~170 kB.
