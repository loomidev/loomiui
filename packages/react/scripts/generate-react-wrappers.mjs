import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { format, resolveConfig } from "prettier";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const packagesRoot = join(packageRoot, "..");
const srcDir = join(packageRoot, "src");
const componentsDir = join(srcDir, "components");
const indexPath = join(srcDir, "index.ts");
const generatorPath = relative(packageRoot, fileURLToPath(import.meta.url));

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
    // Most packages name theirs `Loomi<Component>EventMap`; data-grid's is
    // `DataGridEventMap<TRecord>`, so allow any name and any type parameters.
    const mapMatch = content.match(/export interface (\w+EventMap)(?:<[^>]*>)?\s*\{/);
    if (!mapMatch) continue;
    const mapName = mapMatch[1];
    const eventNames = new Set();
    const bodyMatch = content.match(
      new RegExp(`interface ${mapName}(?:<[^>]*>)?\\s*\\{([\\s\\S]+?)\\n\\}`),
    );
    if (bodyMatch) {
      // Keys may be quoted ("loomi-select") or bare (change) — prettier drops
      // quotes from identifier-safe names, so accept both.
      for (const m of bodyMatch[1].matchAll(/^\s*"?([\w-]+)"?\s*:/gm)) {
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

// One module per component so consumers can pull in a handful of wrappers —
// `import { DataGrid } from "@loomidev/react/data-grid"` — without registering
// every element in the library. `src/index.ts` re-exports all of them.
const moduleName = (tagName) => tagName.slice("loomi-".length);

const buildComponentModule = ({ tagName, componentName, packageName, events, attrAliases }) => {
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

  // Only the EventMap types this one component references
  const usedEventMaps = [
    ...new Set(
      eventEntries
        .map(([, { cbType }]) => cbType.match(/^(\w+EventMap)/)?.[1])
        .filter((name) => name !== undefined),
    ),
  ].sort();

  const typeImport =
    usedEventMaps.length > 0
      ? `import type { ${usedEventMaps.join(", ")} } from "@loomidev/components";\n`
      : "";

  return `\
// Generated by ${generatorPath}. Do not edit directly.
import { type ForwardRefExoticComponent } from "react";
import type {} from "@loomidev/react-types";
${typeImport}import { createComponent } from "../create-component.js";

import "@loomidev/components/${packageName}";

export const ${componentName}: ForwardRefExoticComponent<
  ${typeBody}
> = createComponent(
  ${JSON.stringify(tagName)},
  ${eventsLiteral},
  ${aliasesLiteral},
) as unknown as ForwardRefExoticComponent<
  ${typeBody}
>;
`;
};

const barrelSource = `\
// Generated by ${generatorPath}. Do not edit directly.
// Re-exports every wrapper. Importing from here registers all elements; for a
// smaller bundle import the component modules directly:
//   import { DataGrid } from "@loomidev/react/data-grid";
${components.map((c) => `export { ${c.componentName} } from "./components/${moduleName(c.tagName)}.js";`).join("\n")}
`;

const prettierConfig = (await resolveConfig(indexPath)) ?? {};
const write = async (path, source) =>
  writeFile(path, await format(source, { ...prettierConfig, parser: "typescript" }));

// Rebuilt from scratch so wrappers for deleted components do not linger
await rm(componentsDir, { recursive: true, force: true });
await mkdir(componentsDir, { recursive: true });

await Promise.all(
  components.map((component) =>
    write(
      join(componentsDir, `${moduleName(component.tagName)}.ts`),
      buildComponentModule(component),
    ),
  ),
);
await write(indexPath, barrelSource);

console.log(`[react] Generated ${components.length} React wrapper components.`);
