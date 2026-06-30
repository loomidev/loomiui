# @loomidev/icons

The shared icon registry used across loomi components, covering three sources:

- **`heroicons`** (default) — generated from the official Heroicons 24px outline and
  solid sets, then published as plain Lit SVG templates inlined directly into this
  package. No React or Heroicons runtime dependency ships to consumers.
- **`iconsax`** and **`untitledui`** — disk-based. Unlike Heroicons, these ship as real
  `.svg` files under `dist/svg/<source>/<type>/<name>.svg`, not as JS strings. A consumer
  using one icon from a 3,800-icon set only ever downloads that one file — fetched once,
  cached in memory for the rest of the page's lifetime — instead of every component on
  the page paying for the whole set up front.

```bash
npm install @loomidev/icons lit
```

## Heroicons (inlined)

```ts
import { getLoomiIcon, registerLoomiIcon, loomiIconNames } from "@loomidev/icons";
import { svg } from "lit";

registerLoomiIcon("rocket", svg`<path d="…" />`);
getLoomiIcon("bell-alert", "solid");
loomiIconNames(); // -> ["arrow-path", "bell-alert", …]
```

Components that render icons (`<loomi-icon>`, `<loomi-button>`, `<loomi-input>`,
`<loomi-alert>`, `<loomi-tabs>`) all read from this one registry, so an icon you register
is available everywhere.

| Export | Description |
| --- | --- |
| `getLoomiIcon(name, variant)` | Returns the icon's inner SVG (a Lit `SVGTemplateResult`) or `undefined`. `variant` is `outline` or `solid`; default is `outline`. |
| `registerLoomiIcon(name, svg, variant)` | Register or override an icon for `outline` or `solid`; default is `outline`. |
| `loomiIconNames(variant)` | List all registered icon names for a variant; default is `outline`. |

## Iconsax and Untitled UI (disk-based)

Most consumers should just use `<loomi-icon source="iconsax" name="…">` (see
[`@loomidev/icon`](../icon)) rather than calling these directly — they exist so other
components can adopt the same sources later the way they already do for Heroicons.

| Source | Types |
| --- | --- |
| `iconsax` | `outline` (default), `solid`, `twotone` |
| `untitledui` | `outline` (default; the only type it ships) |

| Export | Description |
| --- | --- |
| `getLoomiDiskIconUrl(source, name, type?)` | Resolves to the icon's `.svg` URL, or `undefined` if `name` isn't registered. An unavailable `type` for that source (e.g. `untitledui` + `"twotone"`) falls back to `outline` rather than failing. |
| `loadLoomiDiskIcon(source, name, type?)` | Fetches (and caches) the icon, resolving to a value renderable directly inside a Lit `html` template: `` html`<svg>${await loadLoomiDiskIcon(...)}</svg>` ``. Resolves `undefined` for an unregistered name or a failed fetch. |
| `loomiDiskIconNames(source, type?)` | List all registered names for a source/type. |
| `loomiDiskIconTypes(source)` | List the types a source actually ships, e.g. `["outline", "solid", "twotone"]` for `iconsax`. |
| `isLoomiDiskIconSource(source)` | Type guard — `true` for `"iconsax"` / `"untitledui"`, `false` for `"heroicons"`. |

All disk-based icons are normalized to `fill`/`stroke="currentColor"` at import time (see
`scripts/import-icon-set.mjs`), so they theme exactly like Heroicons do — no per-icon
color prop needed.

### Adding another disk-based source later

There's no source-specific code to touch. Vendor the new set with the generic import
script, pointed at a local export (one subfolder per type, full of flat `<name>.svg`
files):

```bash
node scripts/import-icon-set.mjs --source <name> --from /path/to/icons
pnpm build   # regenerates the name manifest and copies the files into dist/svg/
```

Then widen `LoomiDiskIconSource` in `src/disk-icons.ts` to include the new name.
