---
"@loomidev/select": minor
---

The trigger is now a WAI-ARIA select-only combobox: `role="combobox"` (was an implicit `button`) with `aria-controls` pointing at the option list while open, so `aria-activedescendant` is valid and the open select passes axe. `role="listbox"` moves from the panel wrapper to the option list itself, so the search box and empty-state action are no longer invalid listbox children. The combobox and listbox are named by the `label` (the value is read as the combobox's value); a select with no `label` can be named with a new `aria-label` attribute, forwarded from the host, and otherwise falls back to its placeholder. Fixes the axe `button-name` violation on placeholder-only selects. **Breaking for tests/automation:** queries for the trigger by `role=button` (e.g. Playwright `getByRole("button")`) must use `combobox`.
