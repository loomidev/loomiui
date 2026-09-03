// Reports translation coverage for every locale in packages/core/src/locales against `en`,
// the canonical key set. Partial locales are a supported, documented contribution path (see
// locales/index.ts), so this never fails the build over missing keys — only over keys that
// don't exist in `en` at all, which is a real bug: a stale leftover from a rename, or a typo
// that no consumer's fallback chain will ever reach.
//
// Reads compiled output (needs `pnpm build` first) rather than re-parsing TS source — the
// locale files are plain object-literal exports, so importing the built JS is the simplest
// correct way to get the real, evaluated key tree.
import { readdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcLocalesDir = path.join(rootDir, "packages", "core", "src", "locales");
const localesDir = path.join(rootDir, "packages", "core", "dist", "locales");

if (!existsSync(localesDir)) {
  console.error(`${path.relative(rootDir, localesDir)} does not exist — run \`pnpm build\` first.`);
  process.exit(1);
}

function flattenKeys(tree, prefix = "") {
  const keys = [];
  for (const [key, value] of Object.entries(tree)) {
    const full = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      keys.push(...flattenKeys(value, full));
    } else {
      keys.push(full);
    }
  }
  return keys;
}

async function loadLocale(file) {
  const mod = await import(path.join(localesDir, file));
  return mod.default ?? mod[path.basename(file, ".js")];
}

const localeFiles = readdirSync(srcLocalesDir)
  .filter((f) => f.endsWith(".ts"))
  .filter((f) => !["types.ts", "index.ts"].includes(f))
  .map((f) => f.replace(/\.ts$/, ".js"));

const enFile = "en.js";
if (!localeFiles.includes(enFile)) {
  console.error(`Canonical locale ${enFile} not found in ${path.relative(rootDir, localesDir)}.`);
  process.exit(1);
}

const en = await loadLocale(enFile);
const enKeys = new Set(flattenKeys(en));

let hasOrphans = false;
const report = [];

for (const file of localeFiles.sort()) {
  if (file === enFile) continue;
  const locale = await loadLocale(file);
  const keys = flattenKeys(locale);
  const orphans = keys.filter((k) => !enKeys.has(k));
  const covered = keys.filter((k) => enKeys.has(k)).length;
  const pct = ((covered / enKeys.size) * 100).toFixed(0);

  report.push({ file, pct, covered, total: enKeys.size, orphans });
  if (orphans.length) hasOrphans = true;
}

console.log(`Translation coverage against ${enFile} (${enKeys.size} keys):`);
for (const { file, pct, covered, total } of report) {
  console.log(`  ${file.padEnd(10)} ${String(covered).padStart(3)}/${total}  (${pct}%)`);
}

if (hasOrphans) {
  console.error(
    "\nLocale(s) with keys not present in en.ts (rename left a stale entry, or a typo):",
  );
  for (const { file, orphans } of report) {
    if (orphans.length) console.error(`  ${file}: ${orphans.join(", ")}`);
  }
  process.exit(1);
}
