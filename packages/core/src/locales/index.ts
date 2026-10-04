// Built-in locales, one file per language. `en` is the only one bundled statically —
// it's the final fallback for every lookup. Every other locale is a loader that
// dynamically imports its file, so a consumer's bundler splits each language into its
// own chunk and an app only downloads the ones it actually switches to (see
// `loadLoomiLocale`/`setLoomiLocale` in ../i18n.ts).
//
// To add a new language:
//   1. Copy en.ts to <locale>.ts (e.g. ak.ts) and translate every string.
//   2. Add a loader for it to `builtinTranslations` below. Keep the import() specifier a
//      string literal so bundlers can see it and split the file out.
// Partial files are fine — `defineLoomiTranslations` (see ../i18n.ts) lets
// consumers merge in missing keys at runtime, so you don't have to translate
// every key to contribute a locale.
import type { LoomiTranslations } from "./types.js";
import { en } from "./en.js";

export { en };

/** Resolves a built-in locale's messages, importing its file on first call. */
export type LoomiTranslationsLoader = () => Promise<LoomiTranslations>;

export const builtinTranslations: Record<string, LoomiTranslationsLoader> = {
  en: () => Promise.resolve(en),
  ar: () => import("./ar.js").then((module) => module.ar),
  de: () => import("./de.js").then((module) => module.de),
  es: () => import("./es.js").then((module) => module.es),
  fr: () => import("./fr.js").then((module) => module.fr),
  it: () => import("./it.js").then((module) => module.it),
  ml: () => import("./ml.js").then((module) => module.ml),
  pt_BR: () => import("./pt_BR.js").then((module) => module.pt_BR),
  tr: () => import("./tr.js").then((module) => module.tr),
  zh_CN: () => import("./zh_CN.js").then((module) => module.zh_CN),
};

export type { LoomiTranslations, LoomiTranslationTree, LoomiTranslationValue } from "./types.js";
