// Scrapes every sibling component package's README.md + package.json into a single
// JSON manifest bundled into this package. This is what lets @loomidev/mcp-server work
// standalone once published — it never reads from the monorepo at runtime, only from
// this generated, self-contained manifest.

import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { builtinTranslations } from "../../core/dist/locales/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const packagesRoot = resolve(__dirname, "../..");
const selfDir = resolve(__dirname, "..");

const bundleNames = ["forms", "content", "navigation"];
const nonComponents = new Set([
  "core",
  "theme",
  "icons",
  "mcp-server",
  "components",
  ...bundleNames,
]);
const CATEGORY = Object.fromEntries(
  bundleNames.map((bundle) => {
    const pkg = JSON.parse(readFileSync(resolve(packagesRoot, bundle, "package.json"), "utf8"));
    return [
      bundle,
      Object.keys(pkg.dependencies ?? {})
        .filter((dependency) => dependency.startsWith("@loomidev/"))
        .map((dependency) => dependency.replace("@loomidev/", "")),
    ];
  }),
);
const categoryOf = (name) => {
  for (const [cat, names] of Object.entries(CATEGORY)) if (names.includes(name)) return cat;
  return "standalone";
};

function flattenTranslations(value, prefix = "", result = new Map()) {
  for (const [key, child] of Object.entries(value)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (child && typeof child === "object" && !Array.isArray(child)) {
      flattenTranslations(child, path, result);
    } else {
      result.set(path, Array.isArray(child) ? "array" : typeof child);
    }
  }
  return result;
}

const englishMessages = flattenTranslations(builtinTranslations.en);
const localeCoverage = [];
const errors = [];

for (const [locale, translations] of Object.entries(builtinTranslations)) {
  const messages = flattenTranslations(translations);
  const unknown = [...messages.keys()].filter((key) => !englishMessages.has(key));
  const wrongTypes = [...messages].filter(
    ([key, type]) => englishMessages.has(key) && englishMessages.get(key) !== type,
  );
  if (unknown.length) errors.push(`${locale} has keys absent from English: ${unknown.join(", ")}`);
  if (wrongTypes.length) {
    errors.push(
      `${locale} has incompatible value types: ${wrongTypes.map(([key]) => key).join(", ")}`,
    );
  }
  localeCoverage.push({
    locale,
    translated: messages.size,
    total: englishMessages.size,
    coverage: Number(((messages.size / englishMessages.size) * 100).toFixed(1)),
    fallback: locale === "en" ? null : "en",
  });
}

function firstParagraph(md) {
  const lines = md.split("\n");
  let started = false;
  const out = [];
  for (const line of lines) {
    if (/^#\s/.test(line)) continue; // skip the H1
    if (!line.trim()) {
      if (started) break;
      continue;
    }
    started = true;
    out.push(line.trim());
  }
  return out.join(" ");
}

const entries = readdirSync(packagesRoot, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .filter((name) => !nonComponents.has(name));

const components = [];
for (const name of entries) {
  const readmePath = resolve(packagesRoot, name, "README.md");
  const pkgPath = resolve(packagesRoot, name, "package.json");
  let readme, pkg;
  try {
    readme = readFileSync(readmePath, "utf8");
    pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  } catch {
    continue; // no README (e.g. theme/core/icons internals) — skip from the doc manifest
  }
  const tagMatch = readme.match(/<loomi-[a-z-]+>/);
  const tag = tagMatch?.[0];
  const description = firstParagraph(readme);
  if (pkg.name !== `@loomidev/${name}`) {
    errors.push(`${name} package name is ${pkg.name || "missing"}`);
  }
  if (!tag) errors.push(`${name} README has no <loomi-*> tag`);
  if (!description) errors.push(`${name} README has no introductory description`);
  if (!existsSync(resolve(packagesRoot, name, "custom-elements.json"))) {
    errors.push(`${name} has no custom-elements.json metadata`);
  }
  components.push({
    name,
    package: pkg.name,
    tag: tag ?? `<loomi-${name}>`,
    category: categoryOf(name),
    description,
    docUri: `loomi://docs/${name}`,
    markdown: readme,
  });
}

components.sort((a, b) => a.name.localeCompare(b.name));

const categorized = new Set(Object.values(CATEGORY).flat());
const duplicateCategories = Object.values(CATEGORY)
  .flat()
  .filter((name, index, all) => all.indexOf(name) !== index);
const unknownCategoryMembers = [...categorized].filter(
  (name) => !components.some((component) => component.name === name),
);
if (duplicateCategories.length) {
  errors.push(`components occur in multiple category bundles: ${duplicateCategories.join(", ")}`);
}
if (unknownCategoryMembers.length) {
  errors.push(
    `category bundles reference unknown components: ${unknownCategoryMembers.join(", ")}`,
  );
}
if (errors.length) {
  console.error(
    "MCP metadata completeness check failed:\n" + errors.map((error) => `  - ${error}`).join("\n"),
  );
  process.exit(1);
}

mkdirSync(resolve(selfDir, "src/generated"), { recursive: true });
writeFileSync(
  resolve(selfDir, "src/generated/manifest.json"),
  JSON.stringify({ generatedAt: new Date().toISOString(), localeCoverage, components }, null, 2),
);

console.log(
  `[@loomidev/mcp-server] bundled docs for ${components.length} components and checked ${localeCoverage.length} locales.`,
);
