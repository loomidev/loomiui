import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const pkgRoot = join(root, "..");
const heroRoot = join(pkgRoot, "node_modules", "@heroicons", "react", "24");
// Raw data only: scripts/build-heroicon-modules.mjs turns it into one ES module per icon
// at build time, and src/heroicons.ts owns the (hand-written) registry around them.
const outFile = join(pkgRoot, "data", "heroicons.json");

const kebab = (name) =>
  name
    .replace(/Icon\.js$/, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .replace(/([A-Za-z])([0-9])/g, "$1-$2")
    .replace(/([0-9])([A-Za-z])/g, "$1-$2")
    .toLowerCase();

const attrName = (name) =>
  name.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`).replace(/^class-name$/, "class");

const unquote = (value) => {
  if (value.startsWith('"')) return JSON.parse(value);
  return value;
};

const attrsToMarkup = (source) => {
  const attrs = [];
  const attrPattern = /([A-Za-z_$][\w$]*|"[^"]+"):\s*("(?:\\.|[^"])*"|[\d.]+|true|false)/g;
  let match;
  while ((match = attrPattern.exec(source))) {
    const rawName = match[1].startsWith('"') ? JSON.parse(match[1]) : attrName(match[1]);
    if (rawName === "key") continue;
    attrs.push(`${rawName}="${unquote(match[2])}"`);
  }
  return attrs.length ? ` ${attrs.join(" ")}` : "";
};

const parseIcon = (file) => {
  const source = readFileSync(file, "utf8");
  const parts = [];
  const elementPattern = /React\.createElement\("(path|circle|rect)",\s*\{([\s\S]*?)\}\)/g;
  let match;
  while ((match = elementPattern.exec(source))) {
    parts.push(`<${match[1]}${attrsToMarkup(match[2])} />`);
  }
  if (!parts.length) throw new Error(`No SVG primitives found in ${file}`);
  return parts.join("");
};

const buildMap = (variant) => {
  const dir = join(heroRoot, variant);
  return readdirSync(dir)
    .filter((file) => file.endsWith("Icon.js"))
    .sort()
    .map((file) => [kebab(file), parseIcon(join(dir, file))]);
};

const outline = buildMap("outline");
const solid = buildMap("solid");

writeFileSync(
  outFile,
  `${JSON.stringify({ outline: Object.fromEntries(outline), solid: Object.fromEntries(solid) })}\n`,
);
console.log(`Generated ${outline.length} outline icons and ${solid.length} solid icons.`);
