// Verifies that every component's freshly-built style module matches the tracked
// output manifest. Generated modules stay ignored; the compact SHA-256 manifest is
// the reviewable freshness witness. Run with --write after intentionally changing
// component CSS, theme inputs, or the shared style compiler.
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packagesDir = path.join(rootDir, "packages");
const manifestPath = path.join(rootDir, "scripts", "generated-styles-manifest.json");
const write = process.argv.includes("--write");

const stylePackages = readdirSync(packagesDir, { withFileTypes: true })
  .filter(
    (entry) =>
      entry.isDirectory() && existsSync(path.join(packagesDir, entry.name, "src", "styles.css")),
  )
  .map((entry) => entry.name)
  .sort();

const actual = {};
const missing = [];

for (const packageName of stylePackages) {
  const generatedPath = path.join(packagesDir, packageName, "src", "generated", "styles.css.ts");
  if (!existsSync(generatedPath)) {
    missing.push(packageName);
    continue;
  }
  actual[packageName] = createHash("sha256").update(readFileSync(generatedPath)).digest("hex");
}

if (missing.length) {
  console.error(
    `Generated styles are missing for: ${missing.join(", ")}. Run pnpm build before this check.`,
  );
  process.exit(1);
}

if (write) {
  writeFileSync(manifestPath, `${JSON.stringify(actual, null, 2)}\n`);
  console.log(`[check-generated-styles] Wrote ${stylePackages.length} style hashes.`);
  process.exit(0);
}

if (!existsSync(manifestPath)) {
  console.error("Generated style manifest is missing. Run pnpm styles:manifest after pnpm build.");
  process.exit(1);
}

const expected = JSON.parse(readFileSync(manifestPath, "utf8"));
const stale = stylePackages.filter((packageName) => expected[packageName] !== actual[packageName]);
const removed = Object.keys(expected).filter((packageName) => !actual[packageName]);

if (stale.length || removed.length) {
  const details = [
    stale.length ? `changed or unrecorded: ${stale.join(", ")}` : "",
    removed.length ? `removed: ${removed.join(", ")}` : "",
  ].filter(Boolean);
  console.error(
    `Generated style manifest is stale (${details.join("; ")}). ` +
      "Run pnpm build && pnpm styles:manifest and commit the manifest update.",
  );
  process.exit(1);
}

console.log(`[check-generated-styles] OK — ${stylePackages.length} generated styles are current.`);
