---
"@loomidev/statistic": minor
---

Add a `description` attribute and slot for a muted line of context under the number (hidden while the spinner shows), and an `icon-background` attribute that puts the icon in a tinted circle.

Also fixes the empty icon wrapper not collapsing in Chromium: a `<loomi-statistic>` with no icon no longer reserves an icon gap there.
