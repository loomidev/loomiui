---
"@loomidev/core": minor
"@loomidev/dropmenu": minor
"@loomidev/profile-menu": patch
---

Add an `arrowAnchor` property to `<loomi-dropmenu>`: the panel aligns to that element instead of the whole trigger, so its arrow lands right on it (the trigger still decides whether the panel opens below or flips above). It's re-measured on every placement, so it stays correct when the panel flips up or swaps alignment. `<loomi-profile-menu>` now positions its menu from the chevron (from the avatar + chevron pair when compact), so the caret sits under the chevron with either `placement`. `positionFloatingPanel()` gains an `alignTo` option to support this.
