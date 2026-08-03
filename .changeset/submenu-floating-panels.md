---
"@loomidev/dropmenu": minor
"@loomidev/context-menu": minor
"@loomidev/core": minor
"@loomidev/components": patch
---

Submenus in `<loomi-dropmenu>` and `<loomi-context-menu>` are now floating panels in their
own right, on the same terms as the menus that hold them. Previously each was
`position: absolute` inside its parent item, pinned to that row's right edge, which left
two gaps: a submenu opened near the right edge of the screen ran off it, never flipping to
the other side of its row or shifting up when it was taller than the room below; and a
menu with `scrollable` set clipped its own submenus, because that turns on `overflow`
inside the menu body.

Each submenu is now promoted to the top layer with the popover API and placed by core's
new `positionFloatingSubmenu()`, which flips and shifts to keep it on screen. A nested
submenu inherits whichever side its parent settled on, so a chain that had to flip keeps
going the same way instead of doubling back over its own parent. The resolved side is
published as `data-side="left" | "right"`, and the panel is exposed as the `submenu` part.

Opening moved from a `:host(:hover)`/`:host(:focus-within)` CSS rule to JS, since the panel
has to be measured and placed once visible. Hover and keyboard focus still open a submenu,
and closing now waits a moment after the pointer leaves both the row and the panel — the
gap between them no longer snaps the submenu shut mid-crossing. Closing a menu explicitly
closes any submenu it has open, which a top-layer panel needs.
