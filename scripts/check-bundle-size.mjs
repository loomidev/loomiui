// Browser performance regression guard and size report: bundles each package's public
// entry point the way a consumer's bundler would (tree-shaking-friendly ESM, minified,
// `lit` kept external since it's a shared peerDependency a consumer only pays for once),
// gzips the result, and compares it against a committed budget. Catches an accidental
// size regression — a stray dependency, an unminifiable pattern, dead code that should
// have been tree-shaken — before it ships.
//
// Budgets live in scripts/bundle-size-budget.json, one entry per package, in gzipped bytes.
// Regenerate after an intentional size change: `node scripts/check-bundle-size.mjs --write`.
// HARD_LIMITS below are fixed ceilings that `--write` can't raise.
//
// Every run prints a size table (and appends it to $GITHUB_STEP_SUMMARY in CI).
// `--readme` also rewrites each package README's "Bundle size" section from it.
import { build } from "esbuild";
import { gzipSync } from "node:zlib";
import { appendFileSync, readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packagesDir = path.join(rootDir, "packages");
const budgetPath = path.join(rootDir, "scripts", "bundle-size-budget.json");
const write = process.argv.includes("--write");
const writeReadmes = process.argv.includes("--readme");

// A size increase under this margin is noise (minifier/dependency-version churn), not a
// regression worth failing CI over.
const TOLERANCE = 1.1;

// Fixed ceilings, in gzipped bytes, with no tolerance on top. A package listed here fails
// even if its recorded budget was raised with --write.
const HARD_LIMITS = {
  // The most-used component: styles included, lit excluded, icons loaded on demand.
  button: 10 * 1024,
};

const budgets = existsSync(budgetPath) ? JSON.parse(readFileSync(budgetPath, "utf8")) : {};

const readJson = (file) => JSON.parse(readFileSync(file, "utf8"));

// custom-elements.json is the signal that a package ships browser components (as opposed
// to Node-only tooling like @loomidev/mcp-server, which bundling for the browser platform
// would fail on anyway — it imports node: builtins).
// core and theme ship no elements but are libraries every component pulls in, so they
// get a line (and a README section) too.
const SHARED_LIBRARIES = new Set(["core", "theme"]);
const packages = readdirSync(packagesDir)
  .filter(
    (name) =>
      existsSync(path.join(packagesDir, name, "dist", "index.js")) &&
      (existsSync(path.join(packagesDir, name, "custom-elements.json")) ||
        SHARED_LIBRARIES.has(name)),
  )
  .sort();

// A dynamic import() target loads lazily (e.g. an icon fetched on first use), so a
// consumer's browser doesn't pay for it until then and it shouldn't count against this
// package's up-front cost. Marking those targets external leaves them out of the bundle
// entirely — what Vite/webpack/Rollup ship on initial load, since they all split dynamic
// imports into their own chunks by default. (Code-splitting here and discarding the lazy
// chunks gives the same numbers, but an icon-consuming package splits into hundreds of
// per-icon chunks, which made the check several times slower.)
const lazyImportsExternal = {
  name: "lazy-imports-external",
  setup(pluginBuild) {
    pluginBuild.onResolve({ filter: /.*/ }, (args) =>
      args.kind === "dynamic-import" ? { path: args.path, external: true } : undefined,
    );
  },
};

async function gzippedSize(contents, resolveDir) {
  const bundled = await build({
    stdin: { contents, resolveDir, loader: "js" },
    bundle: true,
    minify: true,
    format: "esm",
    write: false,
    logLevel: "silent",
    external: ["lit", "lit/*", "@lit/*", "@lit-labs/*"],
    plugins: [lazyImportsExternal],
  });
  return gzipSync(bundled.outputFiles[0].contents).length;
}

/** Whether a package reaches @loomidev/icons, directly or through another @loomidev package. */
const usesIconsMemo = new Map();
function usesIcons(name) {
  if (usesIconsMemo.has(name)) return usesIconsMemo.get(name);
  usesIconsMemo.set(name, false); // cycle guard
  const pkgJson = path.join(packagesDir, name, "package.json");
  const deps = existsSync(pkgJson) ? Object.keys(readJson(pkgJson).dependencies ?? {}) : [];
  const result = deps.some(
    (dep) =>
      dep === "@loomidev/icons" ||
      (dep.startsWith("@loomidev/") && usesIcons(dep.slice("@loomidev/".length))),
  );
  usesIconsMemo.set(name, result);
  return result;
}

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

const results = {};
const withIcons = {};
const failures = [];

for (const name of packages) {
  const entry = `export * from ${JSON.stringify(path.join(packagesDir, name, "dist", "index.js"))};`;
  const resolveDir = path.join(packagesDir, name);
  // Re-exporting everything keeps the whole public API alive: the worst case for a
  // consumer, and the same numbers as bundling the entry point directly.
  const size = await gzippedSize(entry, resolveDir);
  results[name] = size;
  if (name !== "icons" && usesIcons(name)) {
    // By path: a package that reaches the icons only transitively can't resolve the specifier.
    const iconsAll = JSON.stringify(path.join(packagesDir, "icons", "dist", "all.js"));
    withIcons[name] = await gzippedSize(`${entry}\nimport ${iconsAll};`, resolveDir);
  }

  const hardLimit = HARD_LIMITS[name];
  if (hardLimit !== undefined && size > hardLimit) {
    failures.push(`${name}: ${size}B gzipped exceeds its hard limit of ${hardLimit}B.`);
  }

  const budget = budgets[name];
  if (write || budget === undefined) continue;
  if (size > budget * TOLERANCE) {
    failures.push(
      `${name}: ${size}B gzipped exceeds its ${budget}B budget (+${Math.round((TOLERANCE - 1) * 100)}% tolerance).`,
    );
  }
}

// ---- report ----
const table = [
  "| Package | min+gz | with all Heroicons eager |",
  "| --- | ---: | ---: |",
  ...packages.map(
    (name) =>
      `| \`@loomidev/${name}\` | ${kb(results[name])} | ${withIcons[name] ? kb(withIcons[name]) : "–"} |`,
  ),
].join("\n");
const report = `### Bundle size\n\nMinified and gzipped, \`lit\` excluded (a shared peer dependency), shared \`@loomidev/core\`/\`@loomidev/theme\` code included. Icons load on demand and are not counted; the last column adds \`import "@loomidev/icons/all"\`.\n\n${table}\n`;
console.log(report);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${report}\n`);

if (writeReadmes) {
  const iconsAllSize = await gzippedSize(
    `import ${JSON.stringify(path.join(packagesDir, "icons", "dist", "all.js"))};`,
    path.join(packagesDir, "icons"),
  );
  const START = "<!-- bundle-size:start -->";
  const END = "<!-- bundle-size:end -->";
  let updated = 0;
  for (const name of packages) {
    const readmePath = path.join(packagesDir, name, "README.md");
    if (!existsSync(readmePath)) continue;
    const icons = withIcons[name]
      ? ` Icons load one at a time, on first use, and aren't included. Importing \`@loomidev/icons/all\` to load every Heroicon up front makes it ${kb(withIcons[name])}.`
      : "";
    const summary =
      name === "icons"
        ? `The registry is about **${kb(results[name])}** minified and gzipped, excluding \`lit\`, and loads no icon data up front. Each Heroicon is its own module of a few hundred bytes, loaded the first time it renders. \`import "@loomidev/icons/all"\` loads every Heroicon eagerly instead: about ${kb(iconsAllSize)}.`
        : SHARED_LIBRARIES.has(name)
          ? `About **${kb(results[name])}** minified and gzipped if you import every export, excluding \`lit\`. It is tree-shakeable (\`"sideEffects": false\`), so a component bundles only the parts it uses.`
          : `About **${kb(results[name])}** minified and gzipped, including its styles and the shared \`@loomidev/core\` and \`@loomidev/theme\` code, and excluding \`lit\`.${icons}`;
    const body = `${START}\n\n## Bundle size\n\n${summary} Measured by \`pnpm check:bundle-size\`.\n\n${END}`;
    let readme = readFileSync(readmePath, "utf8");
    if (readme.includes(START)) {
      readme = readme.replace(new RegExp(`${START}[\\s\\S]*?${END}`), body);
    } else if (readme.includes("\n## Dependencies")) {
      readme = readme.replace("\n## Dependencies", `\n${body}\n\n## Dependencies`);
    } else {
      readme = `${readme.trimEnd()}\n\n${body}\n`;
    }
    writeFileSync(readmePath, readme);
    updated++;
  }
  console.log(`Updated the Bundle size section in ${updated} README(s).`);
}

if (write) {
  writeFileSync(budgetPath, JSON.stringify(results, null, 2) + "\n");
  console.log(
    `Wrote budgets for ${packages.length} package(s) to ${path.relative(rootDir, budgetPath)}.`,
  );
}

const newPackages = packages.filter((name) => budgets[name] === undefined);
if (!write && newPackages.length) {
  console.log(
    `No budget recorded yet for: ${newPackages.join(", ")}. Run with --write to add them.`,
  );
}

if (failures.length) {
  console.error(failures.join("\n"));
  console.error(
    "\nIf a budget increase is intentional, run `node scripts/check-bundle-size.mjs --write` (hard limits can't be raised that way).",
  );
  process.exit(1);
}

if (!write) {
  console.log(
    `Bundle size within budget for all ${packages.length - newPackages.length} tracked package(s).`,
  );
}
