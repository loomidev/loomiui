---
"@loomidev/password": patch
---

`<loomi-password>`: fix its style build script, which was a stale hand-rolled
copy that skipped the shared Tailwind color-token pipeline every other
package uses. Theme colors (focus/primary, error, success) silently failed to
resolve at runtime, so the field's focus ring, invalid border, and error text
never matched `<loomi-input>`.

Also: indent the strength requirement list by 10px, turn a requirement's
check mark and label green (instead of gray/black) once it's met, and replace
the native `<select>` used for prefix dropdowns with a custom, borderless
dropdown styled like `<loomi-select>`'s trigger and option list.
