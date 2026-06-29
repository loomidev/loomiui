// Generates `src/generated/countries-data.ts` — do not edit that file by hand.
//
// Source data:
//  - country-telephone-data (MIT) for the name / ISO 3166-1 alpha-2 code / dial code list
//  - circle-flags (MIT, HatScripts) for the matching circular SVG flag per ISO code.
//    Picked over the more detailed flag-icons set (~7.4kB/flag, one as large as 181kB)
//    because at the ~20px size these render at, the fine emblem detail is invisible —
//    circle-flags' simplified artwork averages ~0.7kB/flag. Circular crops also give
//    every row the same icon footprint regardless of a flag's native aspect ratio
//    (3:2, 1:1 for CH/VA, Nepal's non-rectangular shape, etc.), which keeps name text
//    aligned down a long alphabetical list.
// Both are devDependencies — this script runs at build time only; the published
// package ships the generated, self-contained TS module, not these packages.

import { createRequire } from "node:module";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolve(__dirname, "..");

const { allCountries } = require("country-telephone-data");
const flagsDir = resolve(dirname(require.resolve("circle-flags/package.json")), "flags");

// Native-script disambiguators in country-telephone-data's names (e.g. "Afghanistan
// (‫افغانستان‬‎)") are parenthetical and non-ASCII; strip them for a clean display name.
// English disambiguators (e.g. "Congo (DRC)") are ASCII and are intentionally kept.
function cleanName(raw) {
  let name = raw;
  for (;;) {
    const m = name.match(/\s*\(([^()]*)\)\s*$/);
    if (!m || !/[^\x00-\x7F]/.test(m[1])) break;
    name = name.slice(0, m.index);
  }
  return name.trim();
}

// `cleanName()` only strips *non-ASCII* trailing parens, so a Latin-script native
// endonym (e.g. "Ghana (Gaana)", "Italy (Italia)") survives unchanged — and one case
// ("Saint Martin (Saint-Martin (partie française))") nests parens, which the simple
// regex above can't unwind at all. These are display-quality fixes, not data
// corrections: each key is the *already cleaned* name, mapped to what should actually
// show in the list. Genuine English disambiguators (Congo (DRC) vs Congo (Republic),
// Macedonia (FYROM), Falkland Islands (Islas Malvinas), Cocos (Keeling) Islands) are
// deliberately left out of this map — they stay as cleanName() produced them.
const NAME_OVERRIDES = {
  "Brazil (Brasil)": "Brazil",
  "Burundi (Uburundi)": "Burundi",
  "Cameroon (Cameroun)": "Cameroon",
  "Cape Verde (Kabu Verdi)": "Cape Verde",
  "Chad (Tchad)": "Chad",
  "Congo (DRC) (Jamhuri ya Kidemokrasia ya Kongo)": "Congo (DRC)",
  "Congo (Republic) (Congo-Brazzaville)": "Congo (Republic)",
  "Croatia (Hrvatska)": "Croatia",
  "Denmark (Danmark)": "Denmark",
  "Equatorial Guinea (Guinea Ecuatorial)": "Equatorial Guinea",
  "Estonia (Eesti)": "Estonia",
  "Finland (Suomi)": "Finland",
  "Germany (Deutschland)": "Germany",
  "Ghana (Gaana)": "Ghana",
  "Greenland (Kalaallit Nunaat)": "Greenland",
  "Italy (Italia)": "Italy",
  "Latvia (Latvija)": "Latvia",
  "Lithuania (Lietuva)": "Lithuania",
  "Madagascar (Madagasikara)": "Madagascar",
  "Mauritius (Moris)": "Mauritius",
  "Moldova (Republica Moldova)": "Moldova",
  "Montenegro (Crna Gora)": "Montenegro",
  "Netherlands (Nederland)": "Netherlands",
  "Niger (Nijar)": "Niger",
  "Norway (Norge)": "Norway",
  "Poland (Polska)": "Poland",
  "Saint Martin (Saint-Martin (partie française))": "Saint Martin",
  "Saint Pierre and Miquelon (Saint-Pierre-et-Miquelon)": "Saint Pierre and Miquelon",
  "Slovakia (Slovensko)": "Slovakia",
  "Slovenia (Slovenija)": "Slovenia",
  "Somalia (Soomaaliya)": "Somalia",
  "Sweden (Sverige)": "Sweden",
  "Switzerland (Schweiz)": "Switzerland",
};

// Every circle-flags SVG masks its artwork to a circle via a single internal
// `id="a"` / `url(#a)` pair (`<mask id="a">...</mask><g mask="url(#a)">`). Rendering
// the same flag twice in one shadow root (the closed trigger + the highlighted row in
// an open panel both show the selected country) would duplicate that id and break the
// mask lookup for one of them. Replace it with a `{{U}}` placeholder; callers substitute
// a call-site-unique string at render time (see `flagMarkup()` in loomi-countries.ts).
// Also drop the explicit width/height="512" attributes so CSS fully controls sizing.
function sanitizeFlagSvg(svg) {
  return svg
    .replace(/\swidth="\d+"/, "")
    .replace(/\sheight="\d+"/, "")
    .replaceAll('id="a"', 'id="{{U}}"')
    .replaceAll("url(#a)", "url(#{{U}})")
    .replace(/\s+/g, " ")
    .replace(/> </g, "><")
    .trim();
}

// country-telephone-data's `format` (e.g. "+. (...) ...-...." for the US) uses "."
// for a digit and includes the dial code itself as a leading run of dots after "+".
// loomi-countries shows the dial code separately (`.loomi-dial-code`) and `value` is
// just the national number, so that leading run — and the one separator that usually
// follows it — has to come off before this is usable as a `<loomi-countries mask>`
// (same "9"/"a"/"*" wildcards as <loomi-input>'s mask; phone numbers only ever need "9").
//
// The leading dot-count is read from `format` itself, *not* derived from `dialCode`'s
// length: NANP entries (Bahamas, Jamaica, Puerto Rico, ...) inflate `dialCode` to
// "1242"-style values to disambiguate countries that all share the bare "+1" calling
// code, but their `format` strings still only lead with a single dot for that "1" —
// e.g. Bahamas is `dialCode: "1242"`, `format: "+.(...)...-...."`. Deriving N from
// `format` itself sidesteps that mismatch entirely.
function maskFromFormat(format) {
  if (!format) return "";
  const withoutDialCode = format.replace(/^\+\.+/, "");
  if (withoutDialCode === format) return ""; // didn't start with "+" + dots — unexpected shape, skip
  return withoutDialCode.replace(/^[ -]+/, "").replace(/\./g, "9");
}

const records = allCountries.map((c) => {
  const flagPath = resolve(flagsDir, `${c.iso2}.svg`);
  const flag = sanitizeFlagSvg(readFileSync(flagPath, "utf8"));
  const cleaned = cleanName(c.name);
  return {
    name: NAME_OVERRIDES[cleaned] ?? cleaned,
    code: c.iso2.toUpperCase(),
    dialCode: `+${c.dialCode}`,
    priority: c.priority || 0,
    mask: maskFromFormat(c.format),
    flag,
  };
});

records.sort((a, b) => a.name.localeCompare(b.name, "en"));

const generated = `// Generated by @loomidev/countries — do not edit by hand. Run \`pnpm build\` to regenerate.
// Source: country-telephone-data (names, ISO codes, dial codes, formats) + circle-flags (flag SVGs), both MIT.

export interface LoomiCountryRecord {
  /** Clean English display name, e.g. "Ghana". */
  readonly name: string;
  /** ISO 3166-1 alpha-2 code, e.g. "GH". */
  readonly code: string;
  /** E.164 calling code with leading "+", e.g. "+233". */
  readonly dialCode: string;
  /** Tie-breaker for ambiguous dial codes shared by multiple countries (lower wins). */
  readonly priority: number;
  /** Typical national-number mask ("9"/"a"/"*" wildcards, dial code already excluded), e.g. "(999)999-999". Empty when no typical format is known. */
  readonly mask: string;
  /** Sanitized inline <svg> markup; contains a "{{U}}" placeholder — see flagMarkup(). */
  readonly flag: string;
}

export const LOOMI_COUNTRIES: readonly LoomiCountryRecord[] = ${JSON.stringify(records, null, 2)};
`;

mkdirSync(resolve(pkgRoot, "src/generated"), { recursive: true });
writeFileSync(resolve(pkgRoot, "src/generated/countries-data.ts"), generated);

console.log(`[@loomidev/countries] generated data for ${records.length} countries.`);
