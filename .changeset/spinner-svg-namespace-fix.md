---
"@loomidev/spinner": patch
---

Fix `type="spinner"` and `type="dot"` rendering nothing. Their fading lines/dots
were generated as nested `html` template fragments inserted into an `<svg>`, which
the browser parses in the HTML namespace instead of the SVG namespace, silently
dropping the shapes. They now use Lit's `svg` tag function so the elements render
correctly.
