---
"@loomidev/core": minor
---

**Breaking:** `@loomidev/core` now bundles only the English locale. Every other built-in locale is its own chunk, loaded on demand: `setLoomiLocale("fr")` imports it (and its base, e.g. `fr` for `fr-CA`) once, then switches, and now returns a promise that resolves when it has. Connected components re-render when the locale switches or a locale a component names in its `locale` attribute finishes loading. `builtinTranslations` is now a map of loaders, `loomiTranslations` holds only the locales loaded or registered so far, and the new `loadLoomiLocale()` preloads a locale without switching. `defineLoomiTranslations()` works as before, and its overrides stay on top of a built-in locale that loads later. An unknown locale falls back to English without a request.
