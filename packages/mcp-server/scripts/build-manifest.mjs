// Scrapes every sibling component package's README.md + package.json into a single
// JSON manifest bundled into this package. This is what lets @loomidev/mcp-server work
// standalone once published — it never reads from the monorepo at runtime, only from
// this generated, self-contained manifest.

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const packagesRoot = resolve(__dirname, "../..");
const selfDir = resolve(__dirname, "..");

// Category membership mirrors the @loomidev/forms, @loomidev/content and @loomidev/navigation
// grouping packages. Keep these lists in sync if a new component is added.
const CATEGORY = {
  standalone: ["button", "icon", "spinner", "alert", "bell", "modal", "drawer", "notification", "table"],
  forms: [
    "input", "textarea", "text-editor", "select", "checkbox", "radio", "toggle", "number", "slider",
    "code", "checkcards", "datepicker", "timepicker", "colorpicker", "filepicker", "countries",
  ],
  content: [
    "card", "avatar", "accordion", "tag", "tooltip", "popover", "empty-state", "statistic",
    "rating", "timeline", "progress", "listview", "contact-card", "centered-content",
    "sortable", "processing", "horizontal-line-graph", "chart",
  ],
  navigation: ["tab", "pagination", "dropmenu", "theme-switcher"],
};
const categoryOf = (name) => {
  for (const [cat, names] of Object.entries(CATEGORY)) if (names.includes(name)) return cat;
  return "other";
};

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
  .filter((name) => resolve(packagesRoot, name) !== selfDir);

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
  const category = categoryOf(name);
  if (category === "other") continue; // theme/core/icons/forms/content/navigation/components meta-pkgs

  const tagMatch = readme.match(/<loomi-[a-z-]+>/);
  components.push({
    name,
    package: pkg.name,
    tag: tagMatch ? tagMatch[0] : `<loomi-${name}>`,
    category,
    description: firstParagraph(readme),
    docUri: `loomi://docs/${name}`,
    markdown: readme,
  });
}

components.sort((a, b) => a.name.localeCompare(b.name));

mkdirSync(resolve(selfDir, "src/generated"), { recursive: true });
writeFileSync(
  resolve(selfDir, "src/generated/manifest.json"),
  JSON.stringify({ generatedAt: new Date().toISOString(), components }, null, 2),
);

console.log(`[@loomidev/mcp-server] bundled docs for ${components.length} components.`);
