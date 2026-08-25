---
"@loomidev/calendar": patch
"@loomidev/chat": patch
"@loomidev/command-palette": patch
"@loomidev/data-grid": patch
"@loomidev/date-range-picker": patch
"@loomidev/empty-state": patch
"@loomidev/filter-builder": patch
"@loomidev/input": patch
"@loomidev/react": patch
---

Document the events that were missing from the custom-elements manifests. The analyzer
only sees `new CustomEvent("literal-name")`, so events dispatched through a helper or a
template literal — all nine `<loomi-data-grid>` events, the three
`<loomi-date-range-picker>` events, `loomi-command-query-change`, `loomi-filter-apply`,
`loomi-reminder-create`, the `<loomi-chat-window>` attachment and recording events, and
`<loomi-input>`'s affix events — never reached `custom-elements.json`, and so never
reached the React wrappers either. They are now declared with `@fires` and generate typed
`on*` callback props.

`<loomi-empty-state>` documented a `loomi-action` event it never fires; its JSDoc now
names the `action` event the component actually dispatches.
