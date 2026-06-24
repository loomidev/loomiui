import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const pkgRoot = join(root, "..");
const heroRoot = join(pkgRoot, "node_modules", "@heroicons", "react", "24");
const outFile = join(pkgRoot, "src", "index.ts");

const kebab = (name) =>
  name
    .replace(/Icon\.js$/, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .replace(/([A-Za-z])([0-9])/g, "$1-$2")
    .replace(/([0-9])([A-Za-z])/g, "$1-$2")
    .toLowerCase();

const attrName = (name) =>
  name
    .replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)
    .replace(/^class-name$/, "class");

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

const emitMap = (name, entries) =>
  `const ${name}: Record<string, SVGTemplateResult> = {\n${entries
    .map(([iconName, markup]) => `  ${JSON.stringify(iconName)}: svg\`${markup}\`,`)
    .join("\n")}\n};`;

const outline = buildMap("outline");
const solid = buildMap("solid");

const output = `import { svg, type SVGTemplateResult } from "lit";

export type LoomiIconVariant = "outline" | "solid";

/**
 * Shared loomi icon registry generated from Heroicons 24px outline and solid sets.
 * Icons render with currentColor, so they inherit the host's text color.
 *
 * Regenerate with: pnpm --filter @loomi/icons generate
 */
${emitMap("OUTLINE_ICONS", outline)}

${emitMap("SOLID_ICONS", solid)}

const ICONS: Record<LoomiIconVariant, Record<string, SVGTemplateResult>> = {
  outline: OUTLINE_ICONS,
  solid: SOLID_ICONS,
};

/** Register (or override) an icon by name so \`icon="<name>"\` can render it. */
export function registerLoomiIcon(
  name: string,
  path: SVGTemplateResult,
  variant: LoomiIconVariant = "outline",
): void {
  ICONS[variant][name] = path;
}

/** Returns the inner SVG for an icon name, or \`undefined\` if it isn't registered. */
export function getLoomiIcon(
  name: string,
  variant: LoomiIconVariant = "outline",
): SVGTemplateResult | undefined {
  return ICONS[variant][name] ?? (variant === "solid" ? ICONS.outline[name] : undefined);
}

/** Names of all currently-registered icons. */
export function loomiIconNames(variant: LoomiIconVariant = "outline"): string[] {
  return Object.keys(ICONS[variant]);
}
`;

writeFileSync(outFile, output);
console.log(`Generated ${outline.length} outline icons and ${solid.length} solid icons.`);
