// Guards the on-demand locale loading in @loomidev/core: bundles an app that only imports
// <loomi-input> the way Vite/Rollup/webpack would (ESM, code-splitting on) and checks that
// English is the only locale in the code that loads up front, while every other built-in
// locale still ships — each in a chunk of its own that `setLoomiLocale()` fetches lazily.
//
// A regression here is silent everywhere else: a static `import { fr } from "./fr.js"`
// slipped back into core still renders, still passes every test, and quietly makes every
// consumer download all ten languages.
//
// Reads compiled output — run `pnpm build` first.
import { build } from "esbuild";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const entry = path.join(rootDir, "packages", "input", "dist", "index.js");
const localesDir = path.join(rootDir, "packages", "core", "dist", "locales");

if (!existsSync(entry) || !existsSync(localesDir)) {
  console.error("packages/input/dist or packages/core/dist is missing — run `pnpm build` first.");
  process.exit(1);
}

const LOCALE_MODULE = /packages\/core\/dist\/locales\/([^/]+)\.js$/;
const NOT_LOCALES = new Set(["index", "types"]);
const localeOf = (input) => {
  const name = input.replaceAll("\\", "/").match(LOCALE_MODULE)?.[1];
  return name && !NOT_LOCALES.has(name) ? name : undefined;
};

const builtinLocales = readdirSync(localesDir)
  .map((file) => localeOf(`packages/core/dist/locales/${file}`))
  .filter(Boolean)
  .sort();

const { metafile } = await build({
  entryPoints: [entry],
  bundle: true,
  splitting: true,
  format: "esm",
  outdir: path.join(rootDir, "node_modules", ".cache", "check-locale-split"),
  write: false,
  metafile: true,
  logLevel: "silent",
  absWorkingDir: rootDir,
  external: ["lit", "lit/*", "@lit/*", "@lit-labs/*"],
});

// The entry chunk plus every chunk it pulls in statically is what loads up front;
// dynamic-import edges lead to the lazy chunks.
const outputs = metafile.outputs;
// (Every dynamic-import target is an entry point too, so match ours by its source path.)
const entryOutput = Object.keys(outputs).find(
  (file) => outputs[file].entryPoint === path.relative(rootDir, entry).replaceAll("\\", "/"),
);
const upFront = new Set();
const queue = [entryOutput];
while (queue.length) {
  const file = queue.pop();
  if (upFront.has(file)) continue;
  upFront.add(file);
  for (const edge of outputs[file].imports) {
    if (edge.kind === "import-statement" && outputs[edge.path]) queue.push(edge.path);
  }
}

const localesIn = (files) =>
  [
    ...new Set(
      files.flatMap((file) => Object.keys(outputs[file].inputs).map(localeOf).filter(Boolean)),
    ),
  ].sort();
const eager = localesIn([...upFront]);
const lazy = localesIn(Object.keys(outputs).filter((file) => !upFront.has(file)));

const failures = [];
if (eager.join() !== "en") {
  failures.push(`Locales loaded up front: ${eager.join(", ") || "none"} (expected only en).`);
}
const missing = builtinLocales.filter((locale) => locale !== "en" && !lazy.includes(locale));
if (missing.length) {
  failures.push(`Built-in locales with no lazy chunk: ${missing.join(", ")}.`);
}
for (const file of Object.keys(outputs).filter((file) => !upFront.has(file))) {
  const locales = localesIn([file]);
  if (locales.length > 1) {
    failures.push(`${locales.join(", ")} share one chunk; each locale should load on its own.`);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(
  `<loomi-input> bundles only en up front; ${lazy.length} locale(s) load on demand: ${lazy.join(", ")}.`,
);
