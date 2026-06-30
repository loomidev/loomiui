// One-off vendoring tool for disk-based icon sets (anything under src/svg/,
// see disk-icons.ts). Unlike Heroicons (parsed from the @heroicons/react
// devDependency on every `generate`), these sets have no npm package to pull
// from — they're vendored from a local export and normalized once, with the
// *output* committed to git as the real source of truth.
//
// Layout convention: <from>/<type>/<name>.svg — one flat folder of files per
// type. The folder name becomes the type (`outline`, `solid`, `twotone`, …),
// so adding a style the next time an icon set updates is just dropping in
// another folder and re-running this script. No code changes required.
//
// Usage:
//   node scripts/import-icon-set.mjs --source iconsax --from /path/to/iconsax/icons
//   node scripts/import-icon-set.mjs --source untitledui --from /path/to/untitledui/icons
//
// Re-run whenever the upstream set changes; it fully overwrites
// src/svg/<source>/ so deleted upstream icons disappear here too.

import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { normalizeSvgColors } from "./svg-normalize.mjs";

const root = dirname(fileURLToPath(import.meta.url));
const pkgRoot = join(root, "..");

function readArg(name) {
  const index = process.argv.indexOf(`--${name}`);
  return index !== -1 ? process.argv[index + 1] : undefined;
}

const source = readArg("source");
const fromDir = readArg("from");

if (!source || !fromDir) {
  console.error("Usage: node scripts/import-icon-set.mjs --source <name> --from <path>");
  process.exit(1);
}

const types = readdirSync(fromDir).filter((entry) => statSync(join(fromDir, entry)).isDirectory());
if (!types.length) {
  console.error(`No type subfolders found under ${fromDir} (expected e.g. <from>/outline/*.svg)`);
  process.exit(1);
}

const targetRoot = join(pkgRoot, "src", "svg", source);
rmSync(targetRoot, { recursive: true, force: true });

let total = 0;
for (const type of types.sort()) {
  const sourceDir = join(fromDir, type);
  const files = readdirSync(sourceDir).filter((file) => file.endsWith(".svg"));
  if (!files.length) continue;

  const targetDir = join(targetRoot, type);
  mkdirSync(targetDir, { recursive: true });

  for (const file of files) {
    const raw = readFileSync(join(sourceDir, file), "utf8");
    writeFileSync(join(targetDir, file), `${normalizeSvgColors(raw.trim())}\n`);
  }
  console.log(`${source}/${type}: imported ${files.length} icons`);
  total += files.length;
}

console.log(`Done — ${total} "${source}" icons imported into src/svg/${source}/.`);
console.log(`Next: pnpm --filter @loomidev/icons build (regenerates the name manifest).`);
