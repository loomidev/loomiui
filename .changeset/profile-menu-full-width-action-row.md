---
"@loomidev/profile-menu": minor
"@loomidev/dropmenu": minor
"@loomidev/button": minor
---

`<loomi-profile-menu>` now slots its `<loomi-dropmenu-item>` children through to the internal dropmenu instead of moving them into its shadow root, so page CSS (including `::part()` selectors) keeps styling the items and their content. `<loomi-dropmenu>` finds its items through the flattened default slot, so any wrapper that forwards items through a `<slot>` works the same way.

`<loomi-button>` gains a `full-width` attribute: the host becomes a block that fills its container, with the label centered.

`<loomi-dropmenu-item hover="false">` now actually turns the row tint off (the attribute used to be read as `true` whenever present). Pair it with a `full-width` button for a button row, like a Sign out action at the bottom of a profile menu.
