# @loomidev/icons

The shared icon registry used across loomi components, covering three sources:

- **`heroicons`** (default) — generated from the official Heroicons 24px outline and
  solid sets, then published as plain Lit SVG templates inlined directly into this
  package. No React or Heroicons runtime dependency ships to consumers.
- **`iconsax`** and **`untitledui`** — disk-based. Unlike Heroicons, these are loaded one
  icon at a time rather than inlined as JS strings. A consumer using one icon from a
  3,800-icon set only ever loads that one icon — resolved once, cached in memory for the
  rest of the page's lifetime — instead of every component on the page paying for the
  whole set up front. They ship twice: as per-icon ES modules under
  `dist/icons/<source>/<type>/<name>.js`, and as the original `.svg` files under
  `dist/svg/<source>/<type>/<name>.svg`.

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

| Export                                  | Description                                                                                                                       |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `getLoomiIcon(name, variant)`           | Returns the icon's inner SVG (a Lit `SVGTemplateResult`) or `undefined`. `variant` is `outline` or `solid`; default is `outline`. |
| `registerLoomiIcon(name, svg, variant)` | Register or override an icon for `outline` or `solid`; default is `outline`.                                                      |
| `loomiIconNames(variant)`               | List all registered icon names for a variant; default is `outline`.                                                               |

## Iconsax and Untitled UI (disk-based)

Most consumers should just use `<loomi-icon source="iconsax" name="…">` (see
[`@loomidev/icon`](../icon)) rather than calling these directly — they exist so other
components can adopt the same sources later the way they already do for Heroicons.

| Source       | Types                                       |
| ------------ | ------------------------------------------- |
| `iconsax`    | `outline` (default), `solid`, `twotone`     |
| `untitledui` | `outline` (default; the only type it ships) |

| Export                                               | Description                                                                                                                                                                                                                 |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `loadLoomiDiskIcon(source, name, type?)`             | Loads (and caches) the icon, resolving to a value renderable directly inside a Lit `html` template: `` html`<svg>${await loadLoomiDiskIcon(...)}</svg>` ``. Resolves `undefined` for an unregistered name or a failed load. |
| `hasLoomiDiskIcon(source, name, type?)`              | Whether the name is a real icon. Synchronous — it only consults the name manifest, and loads nothing.                                                                                                                       |
| `registerLoomiDiskIcon(source, name, markup, type?)` | Register a statically imported icon so it renders with no network request and no dynamic chunk. See [Static imports](#static-imports).                                                                                      |
| `setLoomiIconBasePath(path)`                         | Serve the raw `.svg` files from a path you control instead of loading the modules. See [Serving the SVGs yourself](#serving-the-svgs-yourself). Pass `undefined` to go back to modules.                                     |
| `getLoomiIconBasePath()`                             | The base path currently set, or `undefined` when icons load from the generated modules.                                                                                                                                     |
| `getLoomiDiskIconUrl(source, name, type?)`           | Resolves to the icon's `.svg` URL, or `undefined` if `name` isn't registered. An unavailable `type` for that source (e.g. `untitledui` + `"twotone"`) falls back to `outline` rather than failing.                          |
| `loomiDiskIconNames(source, type?)`                  | List all registered names for a source/type.                                                                                                                                                                                |
| `loomiDiskIconTypes(source)`                         | List the types a source actually ships, e.g. `["outline", "solid", "twotone"]` for `iconsax`.                                                                                                                               |
| `isLoomiDiskIconSource(source)`                      | Type guard — `true` for `"iconsax"` / `"untitledui"`, `false` for `"heroicons"`.                                                                                                                                            |

All disk-based icons are normalized to `fill`/`stroke="currentColor"` at import time (see
`scripts/import-icon-set.mjs`), so they theme exactly like Heroicons do — no per-icon
color prop needed.

### How an icon is resolved

`loadLoomiDiskIcon` tries three things, in order:

1. **A statically registered icon**, if you registered one for that name.
2. **A fetch from your base path**, if you called `setLoomiIconBasePath`.
3. **The generated per-icon module** — `import("./icons/iconsax/outline/home.js")`.

Step 3 is the default because it is the only one that survives a bundler. Every specifier
in the generated loader index is a string literal, so webpack, Vite, Rollup, esbuild, and
Parcel all trace and code-split them, and the consuming app needs no asset-copying step.

The raw `.svg` files still ship, and resolve on their own wherever the package keeps its
real module URL — a CDN, an import map, or a plain `<script type="module">`. What they
cannot survive is bundling: a bundler inlines this module into a chunk and never copies
`dist/svg/`, so a relative asset URL would 404. That is what steps 2 and 3 exist for.

### Static imports

Importing an icon directly is the leanest option — no runtime lookup, no dynamic chunk,
and dead icons drop out of the bundle:

```ts
import homeOutline from "@loomidev/icons/icons/iconsax/outline/home.js";
import { registerLoomiDiskIcon } from "@loomidev/icons";

registerLoomiDiskIcon("iconsax", "home", homeOutline, "outline");
```

`<loomi-icon source="iconsax" name="home">` then renders it without loading anything.
Each module default-exports the icon's inner SVG markup as a string.

### Serving the SVGs yourself

To keep icon data out of your JS entirely, copy the SVGs into whatever your app serves
and point the package at them:

```ts
import { setLoomiIconBasePath } from "@loomidev/icons";

setLoomiIconBasePath("/icons");  // or an absolute CDN URL
```

```bash
cp -R node_modules/@loomidev/icons/dist/svg public/icons
```

Relative paths resolve against the document. A failed fetch resolves to `undefined`
rather than throwing, so a wrong base path degrades to the component's slot fallback
instead of breaking the page.

### Adding another disk-based source later

There's no source-specific code to touch. Vendor the new set with the generic import
script, pointed at a local export (one subfolder per type, full of flat `<name>.svg`
files):

```bash
node scripts/import-icon-set.mjs --source <name> --from /path/to/icons
pnpm build   # regenerates the name manifest and copies the files into dist/svg/
```

Then widen `LoomiDiskIconSource` in `src/disk-icons.ts` to include the new name.

## Dependencies

- No LoomiUI package dependencies.
