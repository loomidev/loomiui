---
"@loomidev/video": minor
"@loomidev/content": minor
"@loomidev/components": minor
---

Add `<loomi-video>`, a themeable wrapper around the native `<video>` element. Renders the
browser's real media element under the hood and layers a themed control bar on top —
built from `@loomidev/button` and `@loomidev/slider` — with a circular play button, seek
and volume sliders, captions menu, picture-in-picture, and fullscreen support. Without the
`controls` attribute it's a bare, unstyled passthrough; with it, it adds loading/error
overlays, a click-to-play poster overlay, full keyboard shortcuts, and a `controls` slot
for fully custom markup. `<source>`/`<track>` children are forwarded onto the internal
`<video>` element for multi-format fallback and subtitle/caption tracks.
