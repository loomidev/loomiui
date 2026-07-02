import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { categoryQuality, qualityOverrides } from "./lib/quality-overrides.mjs";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packagesDir = path.join(rootDir, "packages");
const skip = new Set(["mcp-server", "icons"]);

function bullets(items) {
  return items.map((item) => `- ${item}`).join("\n");
}

function defaultSections(packageName, scan) {
  const accessibility = [];
  const responsive = [];
  const darkMode = [
    "Uses semantic `--loomi-surface`, `--loomi-surface-border`, and `--loomi-text` tokens where applicable.",
    "Respects `.dark` on `<html>` via `@loomidev/theme-switcher` or your app theme."
  ];

  if (scan.hasAria) {
    accessibility.push("Implements ARIA roles/states for custom interaction surfaces.");
  } else {
    accessibility.push("Prefer native HTML elements; add labels in your app shell where needed.");
  }
  accessibility.push("Supports keyboard focus with visible `:focus-visible` styling on interactive controls.");

  if (scan.hasMedia) {
    responsive.push("Includes layout breakpoints for narrow viewports (see component CSS).");
  } else {
    responsive.push("Fluid width (`width: 100%`, `min-width: 0`) within flex and grid layouts.");
  }

  if (scan.hardcodedSurface) {
    darkMode.push("⚠️ Audit raw `--loomi-gray-*` / hex fills and migrate to semantic tokens.");
  }

  return { accessibility, responsive, darkMode };
}

function renderBlock(sections) {
  return [
    "## Accessibility",
    bullets(sections.accessibility),
    "",
    "## Responsive behavior",
    bullets(sections.responsive),
    "",
    "## Dark mode",
    bullets(sections.darkMode),
    ""
  ].join("\n");
}

function scanSource(packageName) {
  const srcDir = path.join(packagesDir, packageName, "src");
  let source = "";

  for (const file of readdirSync(srcDir)) {
    if (!file.endsWith(".ts") && !file.endsWith(".css")) continue;
    source += readFileSync(path.join(srcDir, file), "utf8");
  }

  return {
    hasAria: /aria-[a-z-]+=|role=/.test(source),
    hasMedia: /@media/.test(source),
    hardcodedSurface: /--loomi-gray-[0-9]{3}|#fff\b|#ffffff\b|bg-white/.test(source)
  };
}

function insertSections(readme, block) {
  if (readme.includes("## Accessibility")) {
    return readme;
  }

  const anchor = readme.match(/^## Installation/m);
  if (anchor) {
    return readme.replace(/^## Installation/m, `${block}## Installation`);
  }

  const firstHeading = readme.indexOf("\n## ");
  if (firstHeading !== -1) {
    return `${readme.slice(0, firstHeading + 1)}\n${block}${readme.slice(firstHeading + 1)}`;
  }

  return `${readme.trim()}\n\n${block}`;
}

let updated = 0;

for (const packageName of readdirSync(packagesDir, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name)) {
  if (skip.has(packageName)) continue;

  const readmePath = path.join(packagesDir, packageName, "README.md");
  if (!existsSync(readmePath) || !existsSync(path.join(packagesDir, packageName, "src"))) {
    continue;
  }

  const override = qualityOverrides[packageName];
  const scan = scanSource(packageName);
  const sections = override
    ? {
        accessibility: override.accessibility,
        responsive: override.responsive,
        darkMode: override.darkMode
      }
    : defaultSections(packageName, scan);

  const next = insertSections(readFileSync(readmePath, "utf8"), renderBlock(sections));
  if (next !== readFileSync(readmePath, "utf8")) {
    writeFileSync(readmePath, next);
    updated += 1;
  }
}

for (const [category, sections] of Object.entries(categoryQuality)) {
  const readmePath = path.join(packagesDir, category, "README.md");
  if (!existsSync(readmePath)) continue;
  const next = insertSections(readFileSync(readmePath, "utf8"), renderBlock(sections));
  if (next !== readFileSync(readmePath, "utf8")) {
    writeFileSync(readmePath, next);
    updated += 1;
  }
}

console.log(`Updated ${updated} README file(s) with quality sections.`);
