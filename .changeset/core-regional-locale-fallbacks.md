---
"@loomidev/core": patch
---

Preserve regional translation registrations and resolve missing messages through the
regional locale, its base language, and English. Template interpolation also handles
overlapping parameter names such as `:page` and `:pages` independently.
