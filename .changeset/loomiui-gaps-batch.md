---
"@loomidev/core": minor
"@loomidev/input": minor
"@loomidev/password": minor
"@loomidev/textarea": minor
"@loomidev/select": minor
"@loomidev/number": minor
"@loomidev/filepicker": minor
"@loomidev/dropmenu": minor
"@loomidev/pagination": minor
"@loomidev/empty-state": minor
"@loomidev/table": minor
"@loomidev/tab": minor
"@loomidev/icons": minor
"@loomidev/theme": minor
---

- Every form control (`input`, `password`, `textarea`, `select`, `number`, `filepicker`) takes an `error` attribute: a message supplied from outside, such as a server-side rejection, shown below the field on load with `aria-invalid`/`aria-describedby`, and cleared when the user edits the value.
- `loomi-dropmenu-item` takes `href`, `target` and `rel`; the whole row renders as a real link (so `loomi-profile-menu` rows can be links too).
- `loomi-pagination` takes `href-template` (e.g. `/orders?page={page}`) to render every control as a link; `loomi-page-change` is then cancelable.
- `loomi-empty-state` takes `button-href`/`button-target`, and renders slotted content in the actions row.
- `loomi-table` manual templates: a `footer` template rendered as `<tfoot>`, `align`/`nowrap`/`width` column options on header cells, `row`/`header-cell`/`cell`/`footer-cell` parts, and built-in cell helper classes.
- `loomi-tabs` takes `overflow="scroll"` for a single scrolling line of headings with edge fades and scroll buttons; `url` tabs render as real links.
- `@loomidev/icons` accepts upstream Heroicons spellings (`squares-2x2`, `h1`) and warns once about unknown names.
- `loomi-number`'s floating label can use the full field width instead of truncating between the stepper buttons.
- `@loomidev/theme/undefined.css`: optional placeholders that reserve space for `loomi-*` elements before they are defined.
