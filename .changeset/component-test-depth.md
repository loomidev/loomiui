---
"@loomidev/tag": patch
---

Deepen component test coverage. Eleven packages that carried one to three smoke tests now
cover their actual behavior: pagination's page arithmetic, boundary clamping and ellipsis
collapsing; accordion's single-open and multi-open semantics; autocomplete's filtering,
arrow-key wrapping and Enter selection; rating, toggle, textarea, number and tag form
participation; tooltip placement; and listview and statistic rendering.

One case documents behavior that was previously untested and is easy to trip over:
`<loomi-tags>` ties selection to form participation, so an instance without a `name`
ignores `selected-value` and marks nothing selectable.
