import {
  builtinTranslations,
  en,
  type LoomiTranslations,
  type LoomiTranslationValue,
} from "./locales/index.js";
import { notifyTranslationsChange } from "./translation-events.js";

export { builtinTranslations };
export { onLoomiTranslationsChange } from "./translation-events.js";

export type {
  LoomiTranslationTree,
  LoomiTranslationValue,
  LoomiTranslations,
  LoomiTranslationsLoader,
} from "./locales/index.js";

export type LoomiLocale =
  "en" | "ar" | "de" | "es" | "fr" | "it" | "ml" | "pt_BR" | "tr" | "zh_CN" | string;

const DEFAULT_LOCALE = "en";
let activeLocale = DEFAULT_LOCALE;

/**
 * Every locale's messages that are available synchronously: `en`, the built-in locales
 * loaded so far, and anything registered with `defineLoomiTranslations`.
 */
export const loomiTranslations: Record<string, LoomiTranslations> = {
  // A copy, so registering English overrides never mutates the module's own export.
  en: mergeTranslations({}, en),
};

const loadedBuiltins = new Set<string>([DEFAULT_LOCALE]);
const pendingBuiltins = new Map<string, Promise<void>>();

/** The registered or built-in key matching `raw` case-insensitively, if there is one. */
function knownLocaleKey(raw: string): string | undefined {
  if (Object.hasOwn(loomiTranslations, raw) || Object.hasOwn(builtinTranslations, raw)) return raw;
  const lower = raw.toLowerCase();
  const matches = (key: string) => key.toLowerCase() === lower;
  return (
    Object.keys(loomiTranslations).find(matches) ?? Object.keys(builtinTranslations).find(matches)
  );
}

function normalizeLocale(locale?: string): string {
  const raw = (locale || activeLocale || DEFAULT_LOCALE).replace("-", "_");
  return knownLocaleKey(raw) ?? knownLocaleKey(raw.split("_")[0]) ?? raw;
}

function translationLocaleKey(locale: LoomiLocale): string {
  const raw = locale.replace("-", "_");
  return knownLocaleKey(raw) ?? raw;
}

/** The built-in locales a lookup in `locale` reads from (itself and its base) that aren't loaded yet. */
function unloadedBuiltins(locale: LoomiLocale): string[] {
  const raw = locale.replace("-", "_");
  const keys = [knownLocaleKey(raw.split("_")[0]), knownLocaleKey(raw)];
  return [...new Set(keys)].filter(
    (key): key is string =>
      !!key && Object.hasOwn(builtinTranslations, key) && !loadedBuiltins.has(key),
  );
}

function loadBuiltin(key: string): Promise<void> {
  let pending = pendingBuiltins.get(key);
  if (!pending) {
    pending = builtinTranslations[key]()
      .then((messages) => {
        // Built-in copy goes underneath anything the app already registered for this
        // locale, so a `defineLoomiTranslations` override made before the load still wins.
        const registered = loomiTranslations[key];
        loomiTranslations[key] = mergeTranslations(
          mergeTranslations({}, messages),
          registered ?? {},
        );
        loadedBuiltins.add(key);
        notifyTranslationsChange();
      })
      .finally(() => pendingBuiltins.delete(key));
    pendingBuiltins.set(key, pending);
  }
  return pending;
}

/**
 * Load a built-in locale (and its base language, e.g. `fr` for `fr_CA`) without making it
 * the active one. `setLoomiLocale` does this for you; call it directly to preload a
 * locale that only some components use through their `locale` attribute, so they render
 * translated on the first paint instead of re-rendering once it arrives. Each locale is
 * fetched at most once, and a locale that isn't built in resolves immediately.
 */
export function loadLoomiLocale(locale: LoomiLocale): Promise<void> {
  const keys = unloadedBuiltins(locale);
  return keys.length ? Promise.all(keys.map(loadBuiltin)).then(() => undefined) : Promise.resolve();
}

function intlLocale(locale?: string): string {
  return normalizeLocale(locale).replace("_", "-");
}

function readPath(
  source: LoomiTranslations | undefined,
  path: string,
): LoomiTranslationValue | undefined {
  return path.split(".").reduce<LoomiTranslationValue | undefined>((value, part) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
    return value[part];
  }, source);
}

function readLocalizedValue(path: string, locale?: LoomiLocale): LoomiTranslationValue | undefined {
  const key = normalizeLocale(locale);
  // A component's own `locale` can name a built-in locale nobody has loaded yet. Fetch it
  // in the background; this lookup falls back to English and the component re-renders
  // once it arrives.
  if (unloadedBuiltins(key).length) loadLoomiLocale(key).catch(() => undefined);
  return (
    readPath(loomiTranslations[key], path) ??
    readPath(loomiTranslations[key.split("_")[0]], path) ??
    readPath(loomiTranslations[DEFAULT_LOCALE], path)
  );
}

function mergeTranslations(
  target: LoomiTranslations,
  source: LoomiTranslations,
): LoomiTranslations {
  for (const [key, value] of Object.entries(source)) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      const existing = target[key];
      target[key] = mergeTranslations(
        existing && typeof existing === "object" && !Array.isArray(existing) ? existing : {},
        value,
      );
    } else {
      target[key] = value;
    }
  }
  return target;
}

function formatTemplate(template: string, params: Record<string, string | number> = {}): string {
  return template.replace(/:([A-Za-z0-9_]+)/g, (placeholder, key: string) =>
    Object.hasOwn(params, key) ? String(params[key]) : placeholder,
  );
}

export interface LoomiLocaleChangeDetail {
  locale: string;
}

declare global {
  interface WindowEventMap {
    "loomi-locale-change": CustomEvent<LoomiLocaleChangeDetail>;
  }
}

export function getLoomiLocale(): string {
  return activeLocale;
}

let localeRequest = 0;

function activateLocale(locale: LoomiLocale): void {
  activeLocale = normalizeLocale(locale);
  if (typeof globalThis.dispatchEvent === "function" && typeof CustomEvent !== "undefined") {
    globalThis.dispatchEvent(
      new CustomEvent("loomi-locale-change", { detail: { locale: activeLocale } }),
    );
  }
  notifyTranslationsChange();
}

/**
 * Make `locale` the shared default. A built-in locale other than `en` is fetched first
 * (once), and the switch — the `loomi-locale-change` event and the re-render of every
 * connected component — happens when it has arrived; await the returned promise to know
 * when. Locales that need no fetch (`en`, ones registered with `defineLoomiTranslations`,
 * unknown ones, which fall back to English) switch immediately. If calls overlap, the
 * last one wins.
 */
export function setLoomiLocale(locale: LoomiLocale): Promise<void> {
  const request = ++localeRequest;
  if (!unloadedBuiltins(locale).length) {
    activateLocale(locale);
    return Promise.resolve();
  }
  return loadLoomiLocale(locale).then(() => {
    if (request === localeRequest) activateLocale(locale);
  });
}

export function defineLoomiTranslations(
  locale: LoomiLocale,
  translations: LoomiTranslations,
): void {
  // Registration must preserve an exact regional key. Resolving `fr-CA` through
  // normalizeLocale() first would collapse it to the existing `fr` base locale,
  // causing regional overrides to mutate the base translations instead.
  const key = translationLocaleKey(locale);
  loomiTranslations[key] = mergeTranslations(
    loomiTranslations[key] ? { ...loomiTranslations[key] } : {},
    translations,
  );
  notifyTranslationsChange();
}

export function loomiT(
  path: string,
  params: Record<string, string | number> = {},
  locale?: LoomiLocale,
): string {
  const value = readLocalizedValue(path, locale);
  return typeof value === "string" ? formatTemplate(value, params) : path;
}

export function loomiDefaultText(
  value: string,
  defaultValue: string,
  path: string,
  locale?: LoomiLocale,
  params: Record<string, string | number> = {},
): string {
  return value === defaultValue ? loomiT(path, params, locale) : value;
}

export function loomiDateFormatter(
  locale: LoomiLocale | undefined,
  options: Intl.DateTimeFormatOptions,
): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat(intlLocale(locale), options);
}

export function loomiMonthName(
  locale: LoomiLocale | undefined,
  month: number,
  style: "short" | "long",
): string {
  const custom = readLocalizedValue(
    `datepicker.${style === "long" ? "monthsLong" : "monthsShort"}`,
    locale,
  );
  if (Array.isArray(custom) && typeof custom[month] === "string") return custom[month];
  return loomiDateFormatter(locale, { month: style }).format(new Date(2023, month, 1));
}

export function loomiWeekdayNames(
  locale: LoomiLocale | undefined,
  weekStarts: "sunday" | "monday",
): string[] {
  const custom = readLocalizedValue("datepicker.weekdaysShort", locale);
  if (
    Array.isArray(custom) &&
    custom.length >= 7 &&
    custom.every((item) => typeof item === "string")
  ) {
    return weekStarts === "monday" ? [...custom.slice(1), custom[0]] : [...custom];
  }
  const base = new Date(2023, 0, 1);
  return Array.from({ length: 7 }, (_value, i) => {
    const date = new Date(base);
    date.setDate(base.getDate() + i + (weekStarts === "monday" ? 1 : 0));
    return loomiDateFormatter(locale, { weekday: "short" }).format(date).slice(0, 2);
  });
}
