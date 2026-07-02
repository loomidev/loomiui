import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packagesDir = path.join(rootDir, "packages");
const skip = new Set(["mcp-server", "icons", "components", "forms", "navigation", "content", "theme"]);

const requiredSections = ["## Accessibility", "## Responsive behavior", "## Dark mode"];
const errors = [];
const warnings = [];

function packageNames() {
  return readdirSync(packagesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !skip.has(entry.name))
    .map((entry) => entry.name)
    .filter((name) => existsSync(path.join(packagesDir, name, "src")));
}

function scanSource(packageName) {
  const srcDir = path.join(packagesDir, packageName, "src");
  const files = readdirSync(srcDir).filter(
    (file) => (file.endsWith(".ts") || file.endsWith(".css")) && file !== "brand-icons.ts"
  );
  let source = "";

  for (const file of files) {
    source += readFileSync(path.join(srcDir, file), "utf8");
  }

  return {
    hasAria: /aria-[a-z-]+=|role=/.test(source),
    hasMedia: /@media/.test(source),
    hasSemanticSurface: /--loomi-surface[^-]|var\(--loomi-text\)/.test(source),
    hardcodedSurface: /--loomi-gray-[0-9]{3}|#fff\b|#ffffff\b|bg-white/.test(source)
  };
}

for (const packageName of packageNames()) {
  const readmePath = path.join(packagesDir, packageName, "README.md");
  if (!existsSync(readmePath)) {
    warnings.push(`${packageName}: missing README.md`);
    continue;
  }

  const readme = readFileSync(readmePath, "utf8");
  for (const section of requiredSections) {
    if (!readme.includes(section)) {
      errors.push(`${packageName}: README missing "${section}"`);
    }
  }

  const scan = scanSource(packageName);
  if (scan.hardcodedSurface) {
    warnings.push(`${packageName}: source may use non-semantic gray/white tokens (see docs/COMPONENT_QUALITY.md)`);
  }
  if (scan.hasAria && !readme.includes("## Accessibility")) {
    errors.push(`${packageName}: implements ARIA but README lacks Accessibility section`);
  }
}

if (warnings.length > 0) {
  console.warn("Component quality warnings:");
  for (const warning of warnings) {
    console.warn(`- ${warning}`);
  }
}

if (errors.length > 0) {
  console.error("Component quality audit failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  console.error("\nRun `pnpm quality:readmes` to insert missing sections, then fix token issues.");
  process.exit(1);
}

console.log("Component quality audit passed.");
