---
"@loomidev/emoji-picker": minor
---

Add a `show-text` attribute to `<loomi-emoji-picker>` to hide the selected emoji's
name next to the trigger emoji. Also fixed the picker grid to always show 6 emojis
per row instead of a width-dependent auto-fill count.

Fixed `show-text`, `show-categories`, and `searchable` so setting them to the
literal string `"false"` in HTML markup (e.g. `show-text="false"`) actually
disables them. Lit's default `type: Boolean` converter treats any attribute
presence — including `"false"` — as `true`, so these properties now use a
custom converter that honors a literal `"false"` value.
