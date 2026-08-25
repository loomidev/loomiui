// Generates a custom-elements.json manifest for every component package, so IDEs,
// docs tooling and framework integrations can discover tags, attributes, slots and
// events. Run from the repo root: `node scripts/generate-cem.mjs` (or `pnpm cem`).
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packagesDir = path.join(rootDir, "packages");
// No custom elements to document: infra, aggregators, the MCP server, and
// react-types (a generated types-only package with no Lit declarations).
const skip = new Set([
  "core",
  "theme",
  "mcp-server",
  "components",
  "forms",
  "navigation",
  "content",
  "react-types",
  "react", // React wrapper package with no Lit declarations
]);

const cemBin = path.join(rootDir, "node_modules", ".bin", "cem");
let generated = 0;

for (const entry of readdirSync(packagesDir, { withFileTypes: true })) {
  if (!entry.isDirectory() || skip.has(entry.name)) continue;
  const pkgDir = path.join(packagesDir, entry.name);
  if (!existsSync(path.join(pkgDir, "src"))) continue;

  execFileSync(
    cemBin,
    ["analyze", "--litelement", "--globs", "src/**/*.ts", "--exclude", "src/generated/**"],
    {
      cwd: pkgDir,
      stdio: ["ignore", "ignore", "inherit"],
    },
  );

  pruneUnnamedEvents(pkgDir);

  // Point package consumers at the manifest and make sure it ships with the tarball.
  const pkgJsonPath = path.join(pkgDir, "package.json");
  const pkg = JSON.parse(readFileSync(pkgJsonPath, "utf8"));
  let dirty = false;
  if (pkg.customElements !== "custom-elements.json") {
    pkg.customElements = "custom-elements.json";
    dirty = true;
  }
  if (Array.isArray(pkg.files) && !pkg.files.includes("custom-elements.json")) {
    pkg.files.push("custom-elements.json");
    dirty = true;
  }
  if (dirty) writeFileSync(pkgJsonPath, JSON.stringify(pkg, null, 2) + "\n");
  generated += 1;
}

console.log(`[cem] generated custom-elements.json for ${generated} packages.`);

// The analyzer reads the first argument of `new CustomEvent(...)` literally, so a
// component that dispatches through a helper — `new CustomEvent(name, ...)` — gets a
// bogus event called `name` (or `type`, or whatever the parameter is called). Real event
// names always reach the manifest as string literals or through `@fires` JSDoc, so any
// event named after a dispatch variable, or left unnamed, is analyzer noise.
function pruneUnnamedEvents(pkgDir) {
  const manifestPath = path.join(pkgDir, "custom-elements.json");
  if (!existsSync(manifestPath)) return;

  const sources = collectSources(path.join(pkgDir, "src")).map((file) =>
    readFileSync(file, "utf8"),
  );
  const variableNames = new Set();
  const realNames = new Set();
  for (const src of sources) {
    for (const m of src.matchAll(/new (?:Custom)?Event(?:<[^>]*>)?\(\s*([A-Za-z_$][\w$]*)\s*,/g))
      variableNames.add(m[1]);
    for (const m of src.matchAll(/new (?:Custom)?Event(?:<[^>]*>)?\(\s*"([^"]+)"/g))
      realNames.add(m[1]);
    for (const m of src.matchAll(/@fires\s+([\w-]+)/g)) realNames.add(m[1]);
  }

  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  let removed = 0;
  for (const module of manifest.modules ?? []) {
    for (const declaration of module.declarations ?? []) {
      if (!Array.isArray(declaration.events)) continue;
      const kept = declaration.events.filter((event) => {
        if (!event?.name) return false;
        return realNames.has(event.name) || !variableNames.has(event.name);
      });
      removed += declaration.events.length - kept.length;
      if (kept.length) declaration.events = kept;
      else delete declaration.events;
    }
  }
  if (removed > 0) writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
}

function collectSources(dir) {
  if (!existsSync(dir)) return [];
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...collectSources(full));
    else if (entry.name.endsWith(".ts")) files.push(full);
  }
  return files;
}
