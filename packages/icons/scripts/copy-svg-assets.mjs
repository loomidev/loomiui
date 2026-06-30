// tsc only emits compiled JS/d.ts — it never touches the real .svg files
// under src/svg/. This copies them into dist/svg/ verbatim so they ship with
// the published package and disk-icons.ts can resolve+fetch them at runtime
// from a URL relative to the compiled dist/index.js.

import { cpSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const pkgRoot = join(root, "..");

cpSync(join(pkgRoot, "src", "svg"), join(pkgRoot, "dist", "svg"), { recursive: true });
console.log("Copied src/svg/ -> dist/svg/");
