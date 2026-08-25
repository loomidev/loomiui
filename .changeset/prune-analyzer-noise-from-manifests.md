---
"@loomidev/creditcard": patch
"@loomidev/date-range-picker": patch
"@loomidev/input": patch
"@loomidev/password": patch
"@loomidev/tag-input": patch
"@loomidev/text-editor": patch
"@loomidev/textarea": patch
"@loomidev/timer": patch
---

Drop bogus events from the custom-elements manifests. A component that dispatches through
a helper — `new CustomEvent(name, …)` — made the analyzer record an event literally called
`name` (or `type`), which then showed up in editor completions and framework integrations.
`pnpm cem` now prunes any event named after a dispatch variable, along with unnamed ones.
