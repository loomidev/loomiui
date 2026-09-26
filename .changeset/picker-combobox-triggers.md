---
"@loomidev/countries": minor
"@loomidev/timezonepicker": minor
"@loomidev/colorpicker": minor
---

The countries, timezone and color pickers' triggers are now WAI-ARIA select-only comboboxes, like `<loomi-select>`: `role="combobox"` (was an implicit `button`) with `aria-controls` while open, so their `aria-activedescendant` is valid and an open picker passes axe (`aria-allowed-attr`). In countries and timezonepicker, `role="listbox"` moves from the panel to the option list (the search box and "use my timezone" button aren't valid listbox children), the focused search box now tracks the highlighted option with `aria-activedescendant`, and a new `aria-label` attribute names a picker with no `label`. The color swatch reads the selected color as its value. **Breaking for tests/automation:** query these triggers by role `combobox`, not `button`.
