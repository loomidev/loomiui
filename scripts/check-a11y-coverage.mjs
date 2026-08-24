// Every custom element the library defines must appear in the accessibility sweep at
// packages/components/test/a11y.test.ts. The sweep enumerates an explicit list rather
// than discovering tags at runtime (there is no registry API for that), so without this
// check a new component would silently opt out of accessibility testing.
import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packagesDir = path.join(rootDir, "packages");
const sweepPath = path.join(packagesDir, "components", "test", "a11y.test.ts");

const declared = new Set();
for (const name of readdirSync(packagesDir)) {
  const manifestPath = path.join(packagesDir, name, "custom-elements.json");
  if (!existsSync(manifestPath)) continue;
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  for (const module of manifest.modules ?? []) {
    for (const declaration of module.declarations ?? []) {
      if (declaration.customElement && declaration.tagName) declared.add(declaration.tagName);
    }
  }
}

const sweep = readFileSync(sweepPath, "utf8");
// Prettier wraps long entries across lines, so allow whitespace after the bracket. Only
// the tag in the first position of each `[tag, markup]` pair counts — tags that appear
// inside a fixture's markup are being used as scaffolding, not covered in their own right.
const covered = new Set(
  [...sweep.matchAll(/\[\s*"(loomi-[a-z0-9-]+)",/g)].map((match) => match[1]),
);

const missing = [...declared].filter((tag) => !covered.has(tag)).sort();
const stale = [...covered].filter((tag) => !declared.has(tag)).sort();

if (missing.length || stale.length) {
  if (missing.length) {
    console.error(
      `Accessibility sweep is missing ${missing.length} element(s): ${missing.join(", ")}`,
    );
  }
  if (stale.length) {
    console.error(
      `Accessibility sweep lists ${stale.length} unknown element(s): ${stale.join(", ")}`,
    );
  }
  console.error(`Add or remove the entries in ${path.relative(rootDir, sweepPath)}.`);
  process.exit(1);
}

console.log(`Accessibility sweep covers all ${declared.size} custom elements.`);
