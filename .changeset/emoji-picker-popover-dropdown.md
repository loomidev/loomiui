---
"@loomidev/emoji-picker": minor
"@loomidev/popover": minor
---

Refactored `<loomi-emoji-picker>` to open its search/categories/grid panel through a
`<loomi-popover>` dropdown instead of hand-rolled open/close/outside-click logic. The
trigger is now the selected emoji itself (no border, chevron, or text by default) —
set the new `show-text` attribute to also show the name/placeholder text next to it.
The emoji grid now shows 7 emojis per row instead of a width-dependent auto-fill count.

Also fixed `show-text`, `show-categories`, and `searchable` so setting them to the
literal string `"false"` in HTML markup (e.g. `show-text="false"`) actually disables
them. Lit's default `type: Boolean` converter treats any attribute presence —
including `"false"` — as `true`, so these properties now use a custom converter that
honors a literal `"false"` value.

`@loomidev/popover` gained a `disabled` attribute (disables the trigger), a
`loomi-toggle` event (`detail: { open }`), and an `isOpen` getter, so consumers can
build controlled, disable-aware dropdowns on top of it.
