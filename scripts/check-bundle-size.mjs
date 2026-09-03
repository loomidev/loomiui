// Browser performance regression guard: bundles each package's public entry point the way
// a consumer's bundler would (tree-shaking-friendly ESM, minified, `lit` kept external since
// it's a shared peerDependency a consumer only pays for once), gzips the result, and compares
// it against a committed budget. Catches an accidental size regression — a stray dependency,
// an unminifiable pattern, dead code that should have been tree-shaken — before it ships.
//
// Budgets live in scripts/bundle-size-budget.json, one entry per package, in gzipped bytes.
// Regenerate after an intentional size change: `node scripts/check-bundle-size.mjs --write`.
import { build } from "esbuild";
import { gzipSync } from "node:zlib";
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packagesDir = path.join(rootDir, "packages");
const budgetPath = path.join(rootDir, "scripts", "bundle-size-budget.json");
const write = process.argv.includes("--write");

// A size increase under this margin is noise (minifier/dependency-version churn), not a
// regression worth failing CI over.
const TOLERANCE = 1.1;

const budgets = existsSync(budgetPath) ? JSON.parse(readFileSync(budgetPath, "utf8")) : {};

// custom-elements.json is the signal that a package ships browser components (as opposed
// to Node-only tooling like @loomidev/mcp-server, which bundling for the browser platform
// would fail on anyway — it imports node: builtins).
const packages = readdirSync(packagesDir)
  .filter(
    (name) =>
      existsSync(path.join(packagesDir, name, "dist", "index.js")) &&
      existsSync(path.join(packagesDir, name, "custom-elements.json")),
  )
  .sort();

const results = {};
let hasRegression = false;

for (const name of packages) {
  const entry = path.join(packagesDir, name, "dist", "index.js");
  const bundled = await build({
    entryPoints: [entry],
    bundle: true,
    minify: true,
    format: "esm",
    write: false,
    logLevel: "silent",
    external: ["lit", "lit/*", "@lit/*", "@lit-labs/*"],
  });
  const gzipSize = gzipSync(bundled.outputFiles[0].contents).length;
  results[name] = gzipSize;

  const budget = budgets[name];
  if (write || budget === undefined) continue;

  if (gzipSize > budget * TOLERANCE) {
    hasRegression = true;
    console.error(
      `${name}: ${gzipSize}B gzipped exceeds its ${budget}B budget (+${TOLERANCE - 1 === 0 ? 0 : Math.round((TOLERANCE - 1) * 100)}% tolerance).`,
    );
  }
}

if (write) {
  writeFileSync(budgetPath, JSON.stringify(results, null, 2) + "\n");
  console.log(
    `Wrote budgets for ${packages.length} package(s) to ${path.relative(rootDir, budgetPath)}.`,
  );
  process.exit(0);
}

const newPackages = packages.filter((name) => budgets[name] === undefined);
if (newPackages.length) {
  console.log(
    `No budget recorded yet for: ${newPackages.join(", ")}. Run with --write to add them.`,
  );
}

if (hasRegression) {
  console.error(
    "\nIf this size increase is intentional, run `node scripts/check-bundle-size.mjs --write`.",
  );
  process.exit(1);
}

console.log(
  `Bundle size within budget for all ${packages.length - newPackages.length} tracked package(s).`,
);
