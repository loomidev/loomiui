---
"@loomidev/progress": minor
---

Add a `<loomi-progress-arc>` variant: a semicircular tick gauge with the percentage
and an optional `caption` centered underneath, plus a default slot for extra content
like a "Show details" button.

Fix `<loomi-progress-bar show-percentage-label-inline="false">` having no effect.
Lit's default boolean-attribute converter only checks whether the attribute is
present, so writing `="false"` on a `true`-by-default boolean left it `true`. The
attribute now reads its string value, so `="false"` actually disables it — which
also fixes `percentage-label-position` and `percentage-suffix`/`percentage-prefix`
silently doing nothing, since they only render on the outside label that inline
mode was suppressing.

Also fix `percentage-suffix` getting a forced extra space (`" complete"` rendered
as `"75%  complete"`). It's now inserted verbatim, same as `percentage-prefix`, so
the caller controls the spacing.
