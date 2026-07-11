// Generates a custom-elements.json manifest for every component package, so IDEs,
// docs tooling and framework integrations can discover tags, attributes, slots and
// events. Run from the repo root: `node scripts/generate-cem.mjs` (or `pnpm cem`).
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packagesDir = path.join(rootDir, "packages");
// No custom elements to document: infra, aggregators and the MCP server.
const skip = new Set(["core", "theme", "mcp-server", "components", "forms", "navigation", "content"]);

const cemBin = path.join(rootDir, "node_modules", ".bin", "cem");
let generated = 0;

for (const entry of readdirSync(packagesDir, { withFileTypes: true })) {
  if (!entry.isDirectory() || skip.has(entry.name)) continue;
  const pkgDir = path.join(packagesDir, entry.name);
  if (!existsSync(path.join(pkgDir, "src"))) continue;

  execFileSync(cemBin, ["analyze", "--litelement", "--globs", "src/**/*.ts", "--exclude", "src/generated/**"], {
    cwd: pkgDir,
    stdio: ["ignore", "ignore", "inherit"],
  });

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
