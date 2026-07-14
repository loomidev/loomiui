// Generates the loomi design tokens.
//
//   1. src/generated/tokens.css.ts  -> `themeStyles` (a Lit CSSResult) containing the
//      `:host` block that declares every `--loomi-<color>-<shade>` slot with a sensible
//      default, plus a small base reset. This is what every component pulls in so the
//      `var(--loomi-*)` references in compiled utilities resolve inside the Shadow DOM.
//
//   2. src/tailwind-colors.css -> a `@theme inline { --color-*: var(--loomi-*) }` block
//      for authoring components against Tailwind. It contains NO hex values; it only maps
//      Tailwind color utilities onto the overridable `--loomi-*` slots.
//
// Default color VALUES are read straight from Tailwind's own default ramps so we never
// hand-type hex/oklch and never drift from a recognised palette.

import { createRequire } from "node:module";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolve(__dirname, "..");

const palette = JSON.parse(readFileSync(resolve(pkgRoot, "palette.json"), "utf8"));
const { colors, shades, ramps } = palette;
const prefix = palette.prefix ?? "loomi";
const pub = (color, shade) => `--${prefix}-${color}-${shade}`; // public override slot
const priv = (color, shade) => `--_${prefix}-${color}-${shade}-default`; // private default

// --- read Tailwind's default color ramps (oklch) as the source of default values ---
const twTheme = readFileSync(require.resolve("tailwindcss/theme.css"), "utf8");
const defaults = {}; // { ramp: { shade: value } }
const re = /--color-([a-z]+)-(\d+)\s*:\s*([^;]+);/g;
let m;
while ((m = re.exec(twTheme)) !== null) {
  const [, ramp, shade, value] = m;
  (defaults[ramp] ??= {})[shade] = value.trim();
}

function defaultFor(colorName, shade) {
  const ramp = ramps[colorName] ?? colorName;
  const value = defaults[ramp]?.[String(shade)];
  if (!value) {
    throw new Error(
      `No Tailwind default found for ramp "${ramp}" shade ${shade} (color "${colorName}"). ` +
        `Check packages/theme/palette.json against your installed tailwindcss version.`,
    );
  }
  return value;
}

// --- 1. tokens (:host defaults) ---
//
// IMPORTANT: defaults are declared as PRIVATE slots `--_loomi-<color>-<shade>` on
// :host, not as the public `--loomi-<color>-<shade>` slot. If we declared the public
// slot on :host, that element-local declaration would beat any value inherited from
// the consumer's :root/body, making global theme overrides impossible. Instead,
// utilities resolve `var(--loomi-X, var(--_loomi-X-default))`: the public slot is left
// undeclared (so a :root override inherits straight through the shadow boundary), and
// the private slot supplies the fallback default. No hex ever lands in a utility.
const tokenLines = [];
for (const color of colors) {
  for (const shade of shades) {
    tokenLines.push(`  ${priv(color, shade)}: ${defaultFor(color, shade)};`);
  }
}

// --- semantic surface/text tokens ---
//
// Every "white card" component (card, input, select, table, dropmenu, ...) repeats the
// same handful of roles: a surface background, a couple of border weights, a hover/muted
// background, and a few text-emphasis levels. Rather than hand-editing dark-mode
// overrides into every component's plain CSS, those roles are named once here and
// re-pointed at different `gray` shades under `:host-context(.dark)`. Components should
// reference `var(--loomi-surface)` / `var(--loomi-text)` etc., never raw gray shades, for
// anything that should flip with the consumer's dark-mode toggle.
//
// These are plain aliases (not their own override slot) — they compose from the
// already-overridable `--loomi-gray-*` tokens via the same public/private fallback
// chain, so re-theming the gray ramp re-themes dark-mode surfaces for free.
const gray = (shade) => `var(${pub("gray", shade)}, var(${priv("gray", shade)}))`;
const primary = (shade) => `var(${pub("primary", shade)}, var(${priv("primary", shade)}))`;

const SEMANTIC_LIGHT = {
  surface: null, // resolved to white by surfaceLines(); key kept here only for ordering
  "surface-border": gray(200),
  "surface-border-subtle": gray(100),
  "surface-hover": gray(100),
  "surface-hover-primary": primary(600),
  "surface-muted": gray(50),
  "focus-ring": primary(100),
  "focus-ring-color": primary(600),
  text: gray(900),
  "text-on-primary": `var(--${prefix}-white, #ffffff)`,
  "text-secondary": gray(700),
  "text-muted": gray(500),
  "text-faint": gray(400),
};
const SEMANTIC_DARK = {
  surface: gray(800),
  "surface-border": gray(700),
  "surface-border-subtle": gray(700),
  "surface-hover": gray(700),
  "surface-hover-primary": primary(600),
  "surface-muted": gray(900),
  "focus-ring": `color-mix(in srgb, ${primary(500)} 40%, transparent)`,
  "focus-ring-color": primary(500),
  text: gray(100),
  "text-on-primary": `var(--${prefix}-white, #ffffff)`,
  "text-secondary": gray(300),
  "text-muted": gray(400),
  "text-faint": gray(500),
};
const surfaceLines = (map, surfaceValue) =>
  Object.entries(map)
    .map(([name, value]) => `  --${prefix}-${name}: ${name === "surface" ? surfaceValue : value};`)
    .join("\n");

// --- dimension tokens (corner radius) ---
//
// Semantic radius scale — NOT one value for everything. Same public/private pattern as
// colors: the PUBLIC slot (e.g. `--loomi-control-radius`) is intentionally left undeclared
// on :host so a consumer's `:root { --loomi-control-radius: 0 }` inherits straight through
// the shadow boundary. The PRIVATE `--_loomi-<name>-default` slot below supplies the
// built-in default. Components consume `var(--loomi-<name>, var(--_loomi-<name>-default))`,
// so: a per-instance attribute (which declares the public slot on :host) wins over a global
// theme override, which wins over this default.
const RADIUS_DEFAULTS = {
  "control-radius": "0.5rem", // inputs, selects, buttons, small interactive controls
  "panel-radius": "0.875rem", // cards, modals, popovers, menus, drawers, sheets
  "pill-radius": "9999px", // fully-rounded/pill shapes — tags, badges, radius="full"
};
const SPACING_DEFAULTS = {
  // Vertical gap below a stacked form field (input, select, textarea, …). Doubles as the
  // room a field reserves for its validation/clear message. Set `:root { --loomi-field-spacing: 0 }`
  // to own spacing yourself via a flex/grid `gap` container.
  "field-spacing": "1rem",
};
const dimensionLines = Object.entries({ ...RADIUS_DEFAULTS, ...SPACING_DEFAULTS })
  .map(([name, value]) => `  --_${prefix}-${name}-default: ${value};`)
  .join("\n");

const tokensCss = `/* Generated by @loomidev/theme — do not edit by hand. */
:host {
  /* Base tokens */
  --${prefix}-font-sans: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto,
    Helvetica, Arial, sans-serif;
  --${prefix}-white: #ffffff;
  font-family: var(--${prefix}-font-sans);

  /* Private default values for each palette slot. Override the PUBLIC slot from your
     page instead, e.g. :root { ${pub("primary", 600)}: #16a34a; } (no build, no Tailwind).
     Public slots are intentionally NOT declared here so :root overrides inherit in. */
${tokenLines.join("\n")}

  /* Semantic surface/text tokens (light mode defaults) — see comment above. */
${surfaceLines(SEMANTIC_LIGHT, `var(--${prefix}-white)`)}

  /* Dimension tokens (corner radius + field spacing). Private defaults only — the public
     --${prefix}-* slots stay undeclared so :root overrides inherit in. */
${dimensionLines}
}

/* Dark mode: flips when any ancestor (typically <html>) has class="dark" — exactly what
   @loomidev/theme-switcher's applyLoomiTheme() toggles. Only the semantic aliases change;
   the underlying --loomi-gray-* tokens (and any other color) are untouched, so a
   per-instance accentVars() color still renders the same in both modes. */
:host-context(.dark) {
${surfaceLines(SEMANTIC_DARK, gray(800))}
}

/* Minimal, Shadow-DOM-scoped reset so components render predictably. */
*,
*::before,
*::after {
  box-sizing: border-box;
}
`;

const tokensTs = `// Generated by @loomidev/theme — do not edit by hand. Run \`pnpm build\` to regenerate.
import { unsafeCSS } from "lit";

/**
 * Shared loomi design tokens as a Lit \`CSSResult\`.
 *
 * Add this first in a component's \`static styles\` so every \`var(--loomi-*)\`
 * reference resolves inside the Shadow DOM. Consumers override any slot from
 * their own page CSS (e.g. \`:root { --loomi-primary-600: #16a34a; }\`); custom
 * properties inherit through the shadow boundary, so no rebuild is needed.
 */
export const themeStyles = unsafeCSS(${JSON.stringify(tokensCss)});
`;

mkdirSync(resolve(pkgRoot, "src/generated"), { recursive: true });
writeFileSync(resolve(pkgRoot, "src/generated/tokens.css.ts"), tokensTs);

// --- typed palette consts (so TS never imports the root JSON across rootDir) ---
const paletteTs = `// Generated by @loomidev/theme — do not edit by hand. Run \`pnpm build\` to regenerate.
export const LOOMI_COLORS = ${JSON.stringify(colors)} as const;
export const LOOMI_SHADES = ${JSON.stringify(shades)} as const;
export type LoomiColor = (typeof LOOMI_COLORS)[number];
export type LoomiShade = (typeof LOOMI_SHADES)[number];
`;
writeFileSync(resolve(pkgRoot, "src/generated/palette.gen.ts"), paletteTs);

// --- 2. Tailwind color mapping (no hex; maps utilities onto --loomi-* slots) ---
const mapLines = [];
for (const color of colors) {
  for (const shade of shades) {
    mapLines.push(`  --color-${color}-${shade}: var(${pub(color, shade)}, ${priv(color, shade)});`);
  }
}

const colorsCss = `/* Generated by @loomidev/theme — do not edit by hand.
 *
 * Tailwind color mapping for authoring loomi components. Using \`@theme inline\`
 * means the value is substituted directly into generated utilities
 * (\`.bg-primary-600 { background-color: var(--loomi-primary-600, var(--_loomi-primary-600-default)) }\`)
 * and Tailwind does NOT emit its own \`--color-*\` variables. The public \`--loomi-*\`
 * slot is the override hook; the private \`--_loomi-*-default\` slot (declared on :host
 * in tokens.css) supplies the default. No hex lands in a utility.
 *
 * Component build scripts read \`palette.json\` directly to embed this block, so
 * this file is primarily a reference for editor tooling / manual authoring.
 */
@theme inline {
${mapLines.join("\n")}
}
`;

writeFileSync(resolve(pkgRoot, "src/tailwind-colors.css"), colorsCss);

console.log(
  `[@loomidev/theme] generated ${colors.length} colors x ${shades.length} shades ` +
    `(${tokenLines.length} token slots).`,
);
