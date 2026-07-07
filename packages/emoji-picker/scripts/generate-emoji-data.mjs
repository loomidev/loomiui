import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import emojis from "emojibase-data/en/data.json" with { type: "json" };

const root = dirname(fileURLToPath(import.meta.url));
const pkgRoot = join(root, "..");
const outFile = join(pkgRoot, "src", "emoji-data.gen.ts");

// Maps emojibase-data's numeric `group` to the categories this component already uses.
// Group 2 ("component") is skin-tone/hair modifiers, not standalone emoji - excluded.
const GROUP_TO_CATEGORY = {
  0: "smileys",
  1: "people",
  3: "nature",
  4: "food",
  5: "travel",
  6: "activity",
  7: "objects",
  8: "symbols",
  9: "flags",
};

const capitalize = (label) => label.charAt(0).toUpperCase() + label.slice(1);

// `skins` on an emojibase-data entry is an array of its 5 skin-tone variants, always
// ordered light -> dark (`tone` 1-5). Reduce each to just the emoji so a tone index
// (1-5) can look up the right variant at runtime.
const rows = emojis
  .filter((entry) => entry.group !== undefined && entry.group in GROUP_TO_CATEGORY)
  .sort((a, b) => a.order - b.order)
  .map((entry) => {
    const row = [
      entry.emoji,
      capitalize(entry.label),
      GROUP_TO_CATEGORY[entry.group],
      entry.tags ?? [],
    ];
    if (entry.skins?.length) {
      row.push(entry.skins.sort((a, b) => a.tone - b.tone).map((skin) => skin.emoji));
    }
    return row;
  });

const output = `// Generated from emojibase-data (CLDR-based, MIT licensed). Do not edit by hand.
// Regenerate with: pnpm --filter @loomidev/emoji-picker generate
import type { LoomiEmojiCategory } from "./loomi-emoji-picker.js";

/** [emoji, name, category, keywords, skins?] tuples for every standalone Unicode emoji,
 * grouped into this component's categories. \`skins\`, when present, holds the 5
 * skin-tone variants of \`emoji\` ordered light -> dark. */
export const GENERATED_EMOJIS: ReadonlyArray<
  readonly [string, string, LoomiEmojiCategory, readonly string[], (readonly string[])?]
> = ${JSON.stringify(rows)};
`;

writeFileSync(outFile, output);
console.log(`Generated ${rows.length} emoji across ${new Set(rows.map((r) => r[2])).size} categories.`);
