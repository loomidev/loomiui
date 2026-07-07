---
"@loomidev/emoji-picker": minor
---

Added a skin-tone picker to `<loomi-emoji-picker>`. A hand emoji now sits as a suffix
on the search input whenever the active emoji set includes tone-capable emoji (true of
the built-in curated set); clicking it opens a 6-way menu (default plus the 5
Fitzpatrick tones). The chosen tone applies to every matching emoji in the grid and to
the value that gets selected/submitted, and is remembered in `localStorage` across
sessions. Custom emoji passed via `.data` or `emojis` don't carry tone variants, so the
hand suffix is omitted when the picker is showing only custom data.
