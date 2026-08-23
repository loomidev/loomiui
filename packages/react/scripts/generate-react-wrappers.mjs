import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { format, resolveConfig } from "prettier";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const packagesRoot = join(packageRoot, "..");
const outputPath = join(packageRoot, "src", "index.ts");

const skip = new Set([
  "core",
  "theme",
  "icons",
  "mcp-server",
  "components",
  "forms",
  "navigation",
  "content",
  "react-types",
  "react",
]);

// "loomi-accordion-item" -> "AccordionItem"
const tagToName = (tagName) =>
  tagName
    .slice("loomi-".length)
    .split("-")
    .map((p) => p[0].toUpperCase() + p.slice(1))
    .join("");

// "loomi-change" -> "onLoomiChange", "click" -> "onClick"
const eventToProp = (name) =>
  "on" +
  name
    .split("-")
    .map((p) => p[0].toUpperCase() + p.slice(1))
    .join("");

// "label-key" -> "labelKey"
const hyphenToCamel = (name) => name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

// Map CEM event type annotation to a TS callback type
const cemEventType = (text) => (text === "Event" ? "Event" : "CustomEvent");

// Read a package's TS source to find its exported EventMap interface.
// Returns { mapName, eventNames } or null.
const extractEventMap = async (packageName) => {
  const srcDir = join(packagesRoot, packageName, "src");
  const files = await readdir(srcDir).catch(() => []);
  for (const file of files) {
    if (!file.endsWith(".ts") || file === "index.ts") continue;
    const content = await readFile(join(srcDir, file), "utf8");
    const mapMatch = content.match(/export interface (Loomi\w+EventMap)\s*\{/);
    if (!mapMatch) continue;
    const mapName = mapMatch[1];
    const eventNames = new Set();
    const bodyMatch = content.match(
      new RegExp(`interface ${mapName}\\s*\\{([\\s\\S]+?)\\}`),
    );
    if (bodyMatch) {
      for (const m of bodyMatch[1].matchAll(/"([^"]+)":/g)) {
        eventNames.add(m[1]);
      }
    }
    return { mapName, eventNames };
  }
  return null;
};

const components = [];

for (const packageName of await readdir(packagesRoot)) {
  if (skip.has(packageName)) continue;

  const manifestPath = join(packagesRoot, packageName, "custom-elements.json");
  let manifest;
  try {
    manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  } catch (error) {
    if (error?.code === "ENOENT") continue;
    throw error;
  }

  const eventMap = await extractEventMap(packageName);

  for (const module of manifest.modules ?? []) {
    for (const declaration of module.declarations ?? []) {
      if (!declaration.customElement || !declaration.tagName?.startsWith("loomi-")) continue;

      // Build event descriptors: { domEventName: { propName, cbType } }
      // cbType is either "EventMapName[\"event-name\"]", "CustomEvent", or "Event"
      const events = {};
      for (const event of declaration.events ?? []) {
        if (!event.name || event.name === "name") continue;
        const inMap = eventMap?.eventNames.has(event.name);
        events[event.name] = {
          propName: eventToProp(event.name),
          cbType: inMap
            ? `${eventMap.mapName}[${JSON.stringify(event.name)}]`
            : cemEventType(event.type?.text),
        };
      }

      // camelCase aliases for every hyphenated attribute name
      const attrAliases = {};
      for (const attr of declaration.attributes ?? []) {
        if (typeof attr.name === "string" && attr.name.includes("-")) {
          attrAliases[hyphenToCamel(attr.name)] = attr.name;
        }
      }

      components.push({
        tagName: declaration.tagName,
        componentName: tagToName(declaration.tagName),
        packageName,
        events,
        attrAliases,
      });
    }
  }
}

components.sort((a, b) => a.tagName.localeCompare(b.tagName));

const dupe = components.find((c, i) => c.tagName === components[i - 1]?.tagName);
if (dupe) throw new Error(`Duplicate tagName in manifests: ${dupe.tagName}`);

// Collect EventMap type names that are actually used
const neededEventMaps = new Set();
for (const { events } of components) {
  for (const { cbType } of Object.values(events)) {
    const m = cbType.match(/^(Loomi\w+EventMap)/);
    if (m) neededEventMaps.add(m[1]);
  }
}

const sideEffectImports = [
  ...new Set(components.map((c) => `import "@loomidev/components/${c.packageName}";`)),
].join("\n");

const typeImport =
  neededEventMaps.size > 0
    ? `import type { ${[...neededEventMaps].sort().join(", ")} } from "@loomidev/components";`
    : "";

const componentExports = components
  .map(({ tagName, componentName, events, attrAliases }) => {
    const eventEntries = Object.entries(events);
    const aliasEntries = Object.entries(attrAliases);

    const eventsLiteral =
      eventEntries.length === 0
        ? "{}"
        : `{ ${eventEntries.map(([k, { propName }]) => `${JSON.stringify(k)}: ${JSON.stringify(propName)}`).join(", ")} }`;

    const aliasesLiteral =
      aliasEntries.length === 0
        ? "{}"
        : `{ ${aliasEntries.map(([camel, hyphen]) => `${JSON.stringify(camel)}: ${JSON.stringify(hyphen)}`).join(", ")} }`;

    const callbackLines = eventEntries
      .map(([, { propName, cbType }]) => `  ${propName}?: (e: ${cbType}) => void;`)
      .join("\n");

    const aliasLines = aliasEntries
      .map(
        ([camel, hyphen]) =>
          `  ${camel}?: JSX.IntrinsicElements[${JSON.stringify(tagName)}][${JSON.stringify(hyphen)}];`,
      )
      .join("\n");

    const omitKeys = eventEntries.map(([, { propName }]) => JSON.stringify(propName)).join(" | ");
    const base =
      eventEntries.length > 0
        ? `Omit<JSX.IntrinsicElements[${JSON.stringify(tagName)}], ${omitKeys}>`
        : `JSX.IntrinsicElements[${JSON.stringify(tagName)}]`;

    const extras = [callbackLines, aliasLines].filter(Boolean).join("\n");
    const typeBody = extras ? `${base} & {\n${extras}\n}` : base;

    return (
      `export const ${componentName}: ForwardRefExoticComponent<\n  ${typeBody}\n> = createComponent(\n` +
      `  ${JSON.stringify(tagName)},\n  ${eventsLiteral},\n  ${aliasesLiteral},\n` +
      `) as unknown as ForwardRefExoticComponent<\n  ${typeBody}\n>;`
    );
  })
  .join("\n\n");

const source = `\
// Generated by ${relative(packageRoot, fileURLToPath(import.meta.url))}. Do not edit directly.
import { type ForwardRefExoticComponent } from "react";
import type {} from "@loomidev/react-types";
${typeImport}
import { createComponent } from "./create-component.js";

${sideEffectImports}

${componentExports}
`;

const prettierConfig = (await resolveConfig(outputPath)) ?? {};
await writeFile(outputPath, await format(source, { ...prettierConfig, parser: "typescript" }));
console.log(`[react] Generated ${components.length} React wrapper components.`);
