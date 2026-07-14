// Shared loomi component style build. Each component package's
// `scripts/build-styles.mjs` is a thin shim that calls `buildComponentStyles`
// with its own `import.meta.url` (so module resolution happens from the
// package, not from this file) plus optional per-package options.
//
// Compiles Tailwind utilities ONCE at build time and inlines the result into
// `src/generated/styles.css.ts` (a Lit CSSResult). Published packages therefore
// contain zero Tailwind runtime coupling and no global CSS — every class lives
// inside the component's Shadow DOM. Colors resolve through the overridable
// `--<prefix>-*` slots (never hardcoded hex).

import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * @param {string} callerUrl `import.meta.url` of the package shim, i.e.
 *   `packages/<name>/scripts/build-styles.mjs`. Dependency resolution
 *   (palette, Tailwind CLI) runs from there so each package keeps using its
 *   own installed versions.
 * @param {object} [options]
 * @param {{variants: string[], props: string[], shades: number[]}} [options.safelist]
 *   Emit an `@source inline(...)` safelist covering every palette color for
 *   these variant/prop/shade combinations. Needed when a component builds
 *   class names at runtime (`bg-${color}-600`), which Tailwind's scanner
 *   can't see.
 * @param {string[]} [options.sources] Authored source files (relative to the
 *   package root) to scan for statically-used utility classes.
 * @param {string} [options.exportName] Name of the exported CSSResult
 *   (default `componentStyles`).
 * @param {string} [options.styleDoc] JSDoc line for the exported CSSResult.
 */
export function buildComponentStyles(callerUrl, options = {}) {
  const require = createRequire(callerUrl);
  const scriptsDir = dirname(fileURLToPath(callerUrl));
  const pkgRoot = resolve(scriptsDir, "..");

  // --- palette (single source of truth, from @loomidev/theme) ---
  const palette = JSON.parse(readFileSync(require.resolve("@loomidev/theme/palette.json"), "utf8"));
  const { colors, shades } = palette;
  const prefix = palette.prefix ?? "loomi";

  // color mapping: Tailwind utilities -> overridable --<prefix>-* slots (no hex).
  // Public override slot first, private default (declared on :host by
  // @loomidev/theme) as the fallback. Declaring the public slot on :host would
  // block :root overrides, so it is referenced — never declared — here.
  const colorMap = [];
  for (const color of colors) {
    for (const shade of shades) {
      colorMap.push(
        `  --color-${color}-${shade}: var(--${prefix}-${color}-${shade}, var(--_${prefix}-${color}-${shade}-default));`,
      );
    }
  }

  let passthrough = readFileSync(resolve(pkgRoot, "src/styles.css"), "utf8");

  // Authors write the simple form `var(--<prefix>-red-400)` in plain CSS. The public
  // slot is intentionally undeclared (so :root overrides inherit through the shadow
  // boundary), so expand each bare color-token reference to the override chain
  // `var(--<prefix>-red-400, var(--_<prefix>-red-400-default))`. Refs that already
  // carry a fallback, and non-color tokens (font, white, accent, pad-*), are left as-is.
  const colorRe = new RegExp(`var\\(--${prefix}-(${colors.join("|")})-(\\d{2,3})\\)`, "g");
  passthrough = passthrough.replace(
    colorRe,
    (_m, c, s) => `var(--${prefix}-${c}-${s}, var(--_${prefix}-${c}-${s}-default))`,
  );

  // Safelist for runtime-interpolated class names (`bg-${color}-600`, etc.).
  let safelist = "";
  if (options.safelist) {
    const { variants, props, shades: safeShades } = options.safelist;
    safelist = `
/* Safelist for runtime-interpolated class names (bg-\${color}-600, etc.). */
@source inline("{${variants.join(",")}}{${props.join(",")}}-{${colors.join(",")}}-{${safeShades.join(",")}}");
`;
  }

  // Explicit authored sources to scan for statically-used utilities.
  // Tailwind 4.3's scanner silently ignores `@source` entries without a `**`
  // segment (bare file paths and single-star globs match nothing), so rewrite
  // `./src/foo.ts` to `./src/**/foo.ts`.
  let sourceScan = "";
  if (options.sources?.length) {
    const toScanGlob = (s) => {
      if (s.includes("**")) return s;
      const i = s.lastIndexOf("/");
      return i === -1 ? `**/${s}` : `${s.slice(0, i)}/**/${s.slice(i + 1)}`;
    };
    sourceScan = `
/* Scan only authored sources for statically-used utilities. */
${options.sources.map((s) => `@source ${JSON.stringify(toScanGlob(s))};`).join("\n")}
`;
  }

  // `source(none)` disables Tailwind's automatic content scan; components list
  // any needed sources explicitly instead (see @loomidev/button).
  const input = `@layer theme, base, components, utilities;
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/utilities.css" layer(utilities) source(none);

@theme inline {
${colorMap.join("\n")}
}
${safelist}${sourceScan}

/* ---- component-scoped plain CSS (passed through untouched) ---- */
${passthrough}
`;

  const inputPath = resolve(pkgRoot, ".loomi-tw-input.css");
  const outputPath = resolve(pkgRoot, ".loomi-tw-output.css");
  writeFileSync(inputPath, input);

  const cliPkgJson = require.resolve("@tailwindcss/cli/package.json");
  const cliDir = dirname(cliPkgJson);
  const cliManifest = JSON.parse(readFileSync(cliPkgJson, "utf8"));
  const binRel =
    typeof cliManifest.bin === "string" ? cliManifest.bin : cliManifest.bin.tailwindcss;
  const cliEntry = resolve(cliDir, binRel);

  const result = spawnSync(
    process.execPath,
    [cliEntry, "--input", inputPath, "--output", outputPath, "--minify"],
    { cwd: pkgRoot, stdio: ["ignore", "inherit", "inherit"] },
  );

  if (result.status !== 0) {
    rmSync(inputPath, { force: true });
    throw new Error(`Tailwind CLI failed with exit code ${result.status}`);
  }

  const compiled = readFileSync(outputPath, "utf8").trim();

  const pkgName = JSON.parse(readFileSync(resolve(pkgRoot, "package.json"), "utf8")).name;

  const exportName = options.exportName ?? "componentStyles";
  const styleDoc =
    options.styleDoc ??
    `Compiled, Shadow-DOM-scoped styles. Colors resolve via \`var(--${prefix}-*)\`.`;

  const generated = `// Generated by ${pkgName} — do not edit by hand. Run \`pnpm build\` to regenerate.
import { unsafeCSS } from "lit";

/** ${styleDoc} */
export const ${exportName} = unsafeCSS(${JSON.stringify(compiled)});
`;

  mkdirSync(resolve(pkgRoot, "src/generated"), { recursive: true });
  writeFileSync(resolve(pkgRoot, "src/generated/styles.css.ts"), generated);

  rmSync(inputPath, { force: true });
  if (existsSync(outputPath)) rmSync(outputPath, { force: true });

  const safelisted = options.safelist ? ` with ${colors.length} colors safelisted` : "";
  console.log(
    `[${pkgName}] compiled styles (${(compiled.length / 1024).toFixed(1)} kB)${safelisted}.`,
  );
}
