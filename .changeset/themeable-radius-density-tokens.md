---
"@loomidev/theme": minor
"@loomidev/core": minor
"@loomidev/button": minor
"@loomidev/card": patch
"@loomidev/checkbox": patch
"@loomidev/checkcards": patch
"@loomidev/colorpicker": patch
"@loomidev/context-menu": patch
"@loomidev/countries": patch
"@loomidev/datepicker": patch
"@loomidev/dropmenu": patch
"@loomidev/emoji-picker": patch
"@loomidev/floating-panel": patch
"@loomidev/listview": patch
"@loomidev/modal": patch
"@loomidev/notification": patch
"@loomidev/pagination": patch
"@loomidev/pin": patch
"@loomidev/popover": patch
"@loomidev/select": patch
"@loomidev/statistic": patch
"@loomidev/tab": patch
"@loomidev/table": patch
"@loomidev/tag": patch
"@loomidev/timepicker": patch
"@loomidev/timezonepicker": patch
---

Make corner radius and control density themeable from `:root`, closing the gap where a
downloaded theme could recolor components but couldn't reshape them.

`@loomidev/theme` now ships four public token slots (defaults preserve current rendering
exactly, so this is additive — no visual change unless you override them):

- `--loomi-control-radius` (default `0.5rem`) — inputs, selects, buttons, checkbox, tag,
  tabs, pagination, pin, and every field-style control.
- `--loomi-panel-radius` (default `0.875rem`) — cards, modals, popovers, menus, dropdown
  panels, tables, notifications, statistic/checkcards.
- `--loomi-pill-radius` (default `9999px`) — pill/`radius="full"` shapes and pill tags.
- `--loomi-density` (default `1`) — a unitless multiplier scaling control height and
  horizontal padding together (font size stays fixed), e.g. `:root { --loomi-density: 0.85 }`
  for a compact UI. Composes with the per-`size` presets rather than replacing them.

Precedence is per-instance attribute → `:root` theme override → built-in default: an
explicit `radius="full"`/`size="small"` still wins over a global token, while the *default*
preset now defers to the theme. `<loomi-button>`'s `radius` attribute is reimplemented on
top of `--loomi-control-radius`/`--loomi-pill-radius` instead of fixed Tailwind classes;
its markup API is unchanged. True geometry (circular avatars, spinners, toggles, chart/QR/
credit-card art) is intentionally left fixed and does not read these tokens.
