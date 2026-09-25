// Drafts the notes for a single `vX.Y.Z` GitHub release from the package changelogs.
//
// Changesets already writes one GitHub release per package; this gathers the whole
// release into one place. The same changeset shows up in every package it touched, so
// entries are de-duplicated and listed once with the packages they apply to. The result
// is a starting point, not finished copy: the Release workflow saves it as a *draft*
// release, and a maintainer rewrites it in plain language before publishing.
//
// Usage: node scripts/draft-release-notes.mjs <version> > notes.md
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const version = process.argv[2];
if (!version) {
  console.error("Usage: node scripts/draft-release-notes.mjs <version>");
  process.exit(1);
}

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packagesDir = path.join(rootDir, "packages");

/** Entry text → { kind, packages } */
const entries = new Map();

for (const dir of readdirSync(packagesDir).sort()) {
  const changelogPath = path.join(packagesDir, dir, "CHANGELOG.md");
  const manifestPath = path.join(packagesDir, dir, "package.json");
  if (!existsSync(changelogPath) || !existsSync(manifestPath)) continue;
  const { name, private: isPrivate } = JSON.parse(readFileSync(manifestPath, "utf8"));
  if (isPrivate) continue;

  const lines = readFileSync(changelogPath, "utf8").split("\n");
  const start = lines.findIndex((line) => line.trim() === `## ${version}`);
  if (start === -1) continue;

  let kind = "";
  let current = null;
  const flush = () => {
    if (!current) return;
    const text = current.join(" ").replace(/\s+/g, " ").trim();
    current = null;
    // Dependency bumps are noise in a release summary.
    if (!text || text.startsWith("Updated dependencies") || /^@loomidev\/\S+@\S+$/.test(text)) {
      return;
    }
    const entry = entries.get(text) ?? { kind, packages: new Set() };
    entry.packages.add(name);
    entries.set(text, entry);
  };

  for (const line of lines.slice(start + 1)) {
    if (line.startsWith("## ")) break;
    if (line.startsWith("### ")) {
      flush();
      kind = line.slice(4).trim();
    } else if (line.startsWith("- ")) {
      flush();
      // Drop the short commit hash changesets prefixes each entry with.
      current = [line.slice(2).replace(/^[0-9a-f]{7,}: /, "")];
    } else if (current && /^\s+\S/.test(line) && !/^\s+- @loomidev\//.test(line)) {
      current.push(line.trim());
    }
    // Blank lines can sit inside a multi-paragraph entry; the next bullet or heading ends it.
  }
  flush();
}

const order = ["Major Changes", "Minor Changes", "Patch Changes"];
const headings = {
  "Major Changes": "Breaking changes",
  "Minor Changes": "New features",
  "Patch Changes": "Fixes",
};

const out = [
  "<!-- Draft generated from the package changelogs. Rewrite the summary and the lists",
  "     below in plain language, then publish. -->",
  "",
  "Summary: one or two sentences on what this release is about.",
  "",
];

for (const kind of order) {
  const items = [...entries].filter(([, entry]) => entry.kind === kind);
  if (!items.length) continue;
  out.push(`## ${headings[kind]}`, "");
  for (const [text, entry] of items) {
    const pkgs = [...entry.packages].map((pkg) => `\`${pkg.replace("@loomidev/", "")}\``);
    out.push(`- ${text} (${pkgs.join(", ")})`);
  }
  out.push("");
}

out.push(
  "## Upgrading",
  "",
  "```sh",
  `npm install @loomidev/components@^${version}`,
  "```",
  "",
  `If you install components one by one, change each \`@loomidev/*\` dependency to \`^${version}\`.`,
  "",
  "Every package's CHANGELOG has the full list of changes.",
  "",
);

process.stdout.write(out.join("\n"));
