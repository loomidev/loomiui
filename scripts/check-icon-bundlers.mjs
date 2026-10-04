// Builds a consumer app that renders dynamic Heroicons with Vite and with plain Rollup, then
// runs each build in Node and loads every shipped icon through it. Guards the shape of
// @loomidev/icons' dist/heroicons/loaders.js: its import() specifiers must stay string
// literals. A template import (`./${variant}/${name}.js`) is left untouched by both
// bundlers when it sits in node_modules — no icon chunks are emitted — so every icon
// would 404 in a consumer's app while every test against the workspace still passed.
//
// The package is copied into the fixture's own node_modules rather than resolved through
// the workspace symlink, because bundlers treat code under node_modules differently
// (Vite skips its dynamic-import-vars transform there by default).
//
// Reads compiled output — run `pnpm build` first.
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { rollup } from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { build as viteBuild } from "vite";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const iconsDir = path.join(rootDir, "packages", "icons");
// Under the repo's node_modules so the builds' external `lit` resolves when run.
const workDir = path.join(rootDir, "node_modules", ".cache", "check-icon-bundlers");
const appDir = path.join(workDir, "app");
const entry = path.join(appDir, "main.js");

if (!existsSync(path.join(iconsDir, "dist", "heroicons", "loaders.js"))) {
  console.error("packages/icons/dist is missing — run `pnpm build` first.");
  process.exit(1);
}

rmSync(workDir, { recursive: true, force: true });
const installed = path.join(appDir, "node_modules", "@loomidev", "icons");
mkdirSync(installed, { recursive: true });
cpSync(path.join(iconsDir, "package.json"), path.join(installed, "package.json"));
cpSync(path.join(iconsDir, "dist"), path.join(installed, "dist"), { recursive: true });
writeFileSync(
  entry,
  `import { loadLoomiIcon, loomiIconNames } from "@loomidev/icons";
export async function loadEverything() {
  const missing = [];
  let loaded = 0;
  for (const variant of ["outline", "solid"]) {
    for (const name of loomiIconNames(variant)) {
      if (await loadLoomiIcon(name, variant)) loaded++;
      else missing.push(variant + "/" + name);
    }
  }
  return { loaded, missing, unknown: await loadLoomiIcon("definitely-not-an-icon") };
}
`,
);

const external = [/^lit($|\/)/, /^@lit\//, /^@lit-labs\//];
const builds = {
  async vite(outDir) {
    await viteBuild({
      root: appDir,
      configFile: false,
      logLevel: "silent",
      build: {
        outDir,
        emptyOutDir: true,
        minify: false,
        // Its preload helper reads `document`; this check runs the build in Node.
        modulePreload: false,
        rollupOptions: {
          input: entry,
          preserveEntrySignatures: "strict",
          external,
          output: { entryFileNames: "main.js" },
        },
      },
    });
  },
  async rollup(outDir) {
    const bundle = await rollup({
      input: entry,
      external,
      plugins: [nodeResolve()],
      onwarn: () => {},
    });
    await bundle.write({ dir: outDir, format: "es", entryFileNames: "main.js" });
    await bundle.close();
  },
};

const failures = [];
for (const [name, bundle] of Object.entries(builds)) {
  const outDir = path.join(workDir, `out-${name}`);
  await bundle(outDir);
  const chunks = readdirSync(outDir, { recursive: true }).filter((file) => file.endsWith(".js"));
  const { loadEverything } = await import(pathToFileURL(path.join(outDir, "main.js")).href);
  const { loaded, missing, unknown } = await loadEverything();

  if (missing.length) {
    failures.push(
      `${name}: ${missing.length} icon(s) failed to load, e.g. ${missing.slice(0, 5).join(", ")}.`,
    );
  }
  if (unknown !== undefined)
    failures.push(`${name}: an unknown icon name didn't resolve undefined.`);
  // One lazy chunk per icon module: fewer means the build inlined or dropped them.
  if (chunks.length < loaded) {
    failures.push(`${name}: ${chunks.length} chunk(s) for ${loaded} icons; icons aren't split.`);
  }
  console.log(`${name}: loaded ${loaded} icons from ${chunks.length} chunks.`);
}

rmSync(workDir, { recursive: true, force: true });
if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log("Every shipped Heroicon loads in Vite and Rollup builds.");
