// Built-in locales, one file per language. To add a new language:
//   1. Copy en.ts to <locale>.ts (e.g. ak.ts) and translate every string.
//   2. Import it below and add it to `builtinTranslations`.
// Partial files are fine — `defineLoomiTranslations` (see ../i18n.ts) lets
// consumers merge in missing keys at runtime, so you don't have to translate
// every key to contribute a locale.
import type { LoomiTranslations } from "./types.js";
import { en } from "./en.js";
import { ar } from "./ar.js";
import { de } from "./de.js";
import { es } from "./es.js";
import { fr } from "./fr.js";
import { it } from "./it.js";
import { ml } from "./ml.js";
import { pt_BR } from "./pt_BR.js";
import { tr } from "./tr.js";
import { zh_CN } from "./zh_CN.js";

export const builtinTranslations: Record<string, LoomiTranslations> = {
  en,
  ar,
  de,
  es,
  fr,
  it,
  ml,
  pt_BR,
  tr,
  zh_CN,
};

export type { LoomiTranslations, LoomiTranslationTree, LoomiTranslationValue } from "./types.js";
