---
"@loomidev/theme": minor
"@loomidev/datepicker": patch
"@loomidev/timepicker": patch
"@loomidev/input": patch
"@loomidev/password": patch
"@loomidev/number": patch
"@loomidev/select": patch
"@loomidev/textarea": patch
"@loomidev/countries": patch
"@loomidev/timezonepicker": patch
"@loomidev/tag-input": patch
"@loomidev/text-editor": patch
"@loomidev/creditcard": patch
"@loomidev/autocomplete": patch
---

Make the vertical spacing below form fields themeable via a new `--loomi-field-spacing`
token (default `1rem`). Stacked fields already shipped this margin on most components but not
all — it's now consistent across every stacked field and overridable from `:root`:

```css
:root {
  --loomi-field-spacing: 0; /* own field spacing yourself, e.g. via a flex/grid gap container */
}
```

`datepicker` and `timepicker` previously had no bottom margin and now match the other
fields (a 1rem gap by default). `otp` (standalone/centered) and `colorpicker` (an inline
swatch) intentionally keep no field margin. The per-instance `no-clearing` escape hatch is
unchanged.
