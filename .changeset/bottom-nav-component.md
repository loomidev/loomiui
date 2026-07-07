---
"@loomidev/bottom-nav": minor
"@loomidev/navigation": minor
"@loomidev/components": minor
---

Add `<loomi-bottom-nav>`/`<loomi-bottom-nav-item>`, a mobile bottom navigation bar with
icons (via `<loomi-icon>`), badges, eight active-state styles (`pill`, `underline`,
`top-line`, `background`, `icon-only`, `dot`, `border`, `minimal`), a `floating` variant,
safe-area-aware positioning, and arrow-key roving focus. Items render as a real `<a>` when
`href` is set or a `<button>` otherwise, and always fire a cancelable `loomi-change` event
so React Router, Vue Router, SvelteKit, Astro, Laravel, or any other router can own
navigation instead of the component forcing full page loads.
