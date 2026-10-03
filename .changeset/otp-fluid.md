---
"@loomidev/otp": minor
---

`<loomi-otp>` can now fit the space it's given: `fluid` shrinks the boxes evenly to the host's width (never past the `size` maximum; the gap stays fixed), a `--loomi-otp-size` set on the host now wins over the `size` presets, and the row and boxes are exposed as `part="boxes"` / `part="box"`.
