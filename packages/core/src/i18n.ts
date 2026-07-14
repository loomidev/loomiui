import {
  builtinTranslations,
  type LoomiTranslations,
  type LoomiTranslationValue,
} from "./locales/index.js";

export type {
  LoomiTranslationTree,
  LoomiTranslationValue,
  LoomiTranslations,
} from "./locales/index.js";

export type LoomiLocale =
  "en" | "ar" | "de" | "es" | "fr" | "it" | "ml" | "pt_BR" | "tr" | "zh_CN" | string;

const DEFAULT_LOCALE = "en";
let activeLocale = DEFAULT_LOCALE;

export const loomiTranslations: Record<string, LoomiTranslations> = { ...builtinTranslations };

function normalizeLocale(locale?: string): string {
  const raw = (locale || activeLocale || DEFAULT_LOCALE).replace("-", "_");
  if (loomiTranslations[raw]) return raw;
  const lower = raw.toLowerCase();
  const match = Object.keys(loomiTranslations).find((key) => key.toLowerCase() === lower);
  if (match) return match;
  const base = raw.split("_")[0];
  return loomiTranslations[base] ? base : raw;
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
  let out = template;
  for (const [key, value] of Object.entries(params)) {
    out = out.replaceAll(`:${key}`, String(value));
  }
  return out;
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

export function setLoomiLocale(locale: LoomiLocale): void {
  activeLocale = normalizeLocale(locale);
  if (typeof globalThis.dispatchEvent === "function" && typeof CustomEvent !== "undefined") {
    globalThis.dispatchEvent(
      new CustomEvent("loomi-locale-change", { detail: { locale: activeLocale } }),
    );
  }
}

export function defineLoomiTranslations(
  locale: LoomiLocale,
  translations: LoomiTranslations,
): void {
  const key = normalizeLocale(locale);
  loomiTranslations[key] = mergeTranslations(
    loomiTranslations[key] ? { ...loomiTranslations[key] } : {},
    translations,
  );
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
