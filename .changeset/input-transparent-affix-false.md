---
"@loomidev/input": patch
"@loomidev/password": patch
"@loomidev/number": patch
---

`transparent-prefix="false"`, `transparent-suffix="false"` (input; `transparent-prefix` on password) and `transparent-icons="false"` (number) now render solid. The attributes were read as plain booleans, so `"false"` counted as true.
