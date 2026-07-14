// Guards the umbrella and category bundle packages against drift. Every real component
// package must be re-exported by @loomidev/components (index.ts + dependencies +
// per-component subpath export), and each category bundle (forms/content/navigation) must
// keep its `src/index.ts` re-exports in sync with its package.json `dependencies`.
// Run from the repo root: `node scripts/check-category-sync.mjs` (wired into CI).
import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packagesDir = path.join(rootDir, "packages");

// Infra / aggregators / tooling — these are not re-exportable leaf components.
const nonComponents = new Set([
  "core",
  "theme",
  "icons",
  "mcp-server",
  "components",
  "forms",
  "content",
  "navigation",
]);
const bundles = ["forms", "content", "navigation"];

const readJson = (p) => JSON.parse(readFileSync(p, "utf8"));
const scoped = (name) => `@loomidev/${name}`;

// Every workspace package that ships custom elements (has a src/ dir and isn't infra).
const componentDirs = readdirSync(packagesDir, { withFileTypes: true })
  .filter(
    (e) =>
      e.isDirectory() &&
      !nonComponents.has(e.name) &&
      existsSync(path.join(packagesDir, e.name, "src")),
  )
  .map((e) => e.name)
  .sort();

// Which @loomidev/* packages a bundle's index.ts re-exports (ignoring its own self-comment).
function reexportsOf(pkg) {
  const src = readFileSync(path.join(packagesDir, pkg, "src", "index.ts"), "utf8");
  const found = new Set();
  for (const m of src.matchAll(/from\s+["']@loomidev\/([a-z0-9-]+)["']/g)) found.add(m[1]);
  return found;
}

function depsOf(pkg) {
  const deps = readJson(path.join(packagesDir, pkg, "package.json")).dependencies || {};
  return new Set(
    Object.keys(deps)
      .filter((d) => d.startsWith("@loomidev/"))
      .map((d) => d.replace("@loomidev/", "")),
  );
}

const errors = [];

// 1. Umbrella completeness: index.ts, dependencies, and the exports subpath map must each
//    cover every component package.
const umbrellaPkg = readJson(path.join(packagesDir, "components", "package.json"));
const umbrellaIndex = reexportsOf("components");
const umbrellaDeps = new Set(
  Object.keys(umbrellaPkg.dependencies || {}).map((d) => d.replace("@loomidev/", "")),
);
const umbrellaExports = new Set(
  Object.keys(umbrellaPkg.exports || {})
    .filter((k) => k !== ".")
    .map((k) => k.slice(2)),
);

for (const c of componentDirs) {
  if (!umbrellaIndex.has(c))
    errors.push(`components/src/index.ts is missing "export * from \\"${scoped(c)}\\";"`);
  if (!umbrellaDeps.has(c))
    errors.push(`components/package.json dependencies is missing "${scoped(c)}"`);
  if (!umbrellaExports.has(c))
    errors.push(`components/package.json exports is missing subpath "./${c}"`);
}

// 2. Each category bundle: index.ts re-exports must exactly match its dependencies.
for (const bundle of bundles) {
  const idx = reexportsOf(bundle);
  const deps = depsOf(bundle);
  const missingDeps = [...idx].filter((c) => !deps.has(c));
  const missingExports = [...deps].filter((c) => !idx.has(c));
  if (missingDeps.length)
    errors.push(`${bundle}: re-exported but not a dependency: ${missingDeps.sort().join(", ")}`);
  if (missingExports.length)
    errors.push(
      `${bundle}: a dependency but not re-exported in src/index.ts: ${missingExports.sort().join(", ")}`,
    );
}

if (errors.length) {
  console.error(
    "Category/umbrella bundle drift detected:\n" + errors.map((e) => `  - ${e}`).join("\n"),
  );
  process.exit(1);
}

console.log(
  `[check-category-sync] OK — ${componentDirs.length} component packages, umbrella + ${bundles.length} bundles in sync.`,
);
