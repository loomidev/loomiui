# @loomidev/icons

The shared icon registry used across loomi components, covering three sources:

- **`heroicons`** (default) - the official Heroicons 24px outline and solid sets, as plain
  Lit SVG templates. No React or Heroicons runtime dependency ships to consumers.
- **`iconsax`** and **`untitledui`** - disk-based sets, enabled per app with one import.

Every icon is its own module and loads the first time something renders it, so a page
that shows three icons downloads three icons, not a set. Nothing here costs you icon data
until an icon is on screen.

```bash
npm install @loomidev/icons lit
```

## Heroicons

Components that take an icon name (`<loomi-icon>`, `<loomi-button icon="…">`,
`<loomi-input prefix-icon="…">`, `<loomi-alert>`, `<loomi-tabs>`, …) all read from this one
registry, so an icon you register is available everywhere.

A named icon renders as soon as its module arrives, usually within the same frame on a
warm cache. A component's own built-in icons (a clear button, a chevron, the password
reveal eye) are imported statically by that component and render on first paint.

```ts
import { registerLoomiIcon, hasLoomiIcon, loadLoomiIcon } from "@loomidev/icons";
import { svg } from "lit";

registerLoomiIcon("rocket", svg`<path d="…" />`); // your own icon, or override a Heroicon
hasLoomiIcon("bell-alert"); // true: a known name, checked without loading anything
await loadLoomiIcon("bell-alert", "solid"); // load one ahead of time
```

### Load every Heroicon up front

If you'd rather pay for the whole set once than load icons one by one, for example in an
app that shows dozens of different icons on its first screen, import it eagerly:

```ts
import "@loomidev/icons/all";
```

Every named icon then renders synchronously. Icons you registered still win. This adds
the size shown under [Bundle size](#bundle-size).

### Importing one icon directly

Each Heroicon is also a subpath module you can import statically. It ships inside your
bundle with no lazy load:

```ts
import bell from "@loomidev/icons/heroicons/outline/bell.js";
import { provideLoomiIcons } from "@loomidev/icons";

provideLoomiIcons({ bell }); // `icon="bell"` now renders on first paint
```

### Rendering icons in your own Lit components

```ts
import { hasLoomiIcon, loomiIcon } from "@loomidev/icons";

render() {
  return hasLoomiIcon(this.icon)
    ? html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">${loomiIcon(this.icon)}</svg>`
    : nothing;
}
```

`loomiIcon(name, variant?)` is a Lit directive: it renders the icon right away when it's
available and otherwise fills it in once it loads.

| Export                                  | Description                                                                                                             |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `loomiIcon(name, variant?)`             | Lit directive that renders an icon's inner SVG, loading it on first use. `variant` is `outline` (default) or `solid`.   |
| `hasLoomiIcon(name, variant?)`          | Whether the name is a known icon (registered, provided, or a shipped Heroicon). Synchronous; loads nothing.             |
| `loadLoomiIcon(name, variant?)`         | Loads (once, then cached) and resolves the icon's inner SVG, or `undefined` for an unknown name or a failed load.       |
| `getLoomiIcon(name, variant?)`          | The icon's inner SVG if it's ready now (registered, provided or already loaded), else `undefined`. Never starts a load. |
| `registerLoomiIcon(name, svg, variant)` | Register or override an icon for `outline` or `solid`; default is `outline`.                                            |
| `provideLoomiIcons(icons, variant?)`    | Hand over statically imported icons so they render synchronously. Never replaces an icon you registered.                |
| `loomiIconNames(variant)`               | List every known icon name for a variant; default is `outline`.                                                         |

A solid icon that doesn't exist falls back to its outline version.

## Iconsax and Untitled UI (disk-based)

These sets are opt-in. Import each one you use once, anywhere in your app:

```ts
import "@loomidev/icons/iconsax";
import "@loomidev/icons/untitledui";
```

`<loomi-icon source="iconsax" name="home">` (see [`@loomidev/icon`](../icon)) and every
component with an `icon-source` attribute then render from it. Until a source is
imported, its names are unknown: the component shows its slot fallback and logs a
one-time warning naming the import to add. An app that never imports a set bundles none
of it, not even its name list.

| Source       | Types                                       | Icons |
| ------------ | ------------------------------------------- | ----- |
| `iconsax`    | `outline` (default), `solid`, `twotone`     | 2,686 |
| `untitledui` | `outline` (default; the only type it ships) | 1,173 |

Most consumers should just use `<loomi-icon>` rather than calling these directly.

| Export                                               | Description                                                                                                                                                                                                                 |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `loadLoomiDiskIcon(source, name, type?)`             | Loads (and caches) the icon, resolving to a value renderable directly inside a Lit `html` template: `` html`<svg>${await loadLoomiDiskIcon(...)}</svg>` ``. Resolves `undefined` for an unregistered name or a failed load. |
| `hasLoomiDiskIcon(source, name, type?)`              | Whether the name is a real icon. Synchronous - it only consults the source's name list, so it's `false` until the source is imported.                                                                                       |
| `registerLoomiDiskIcon(source, name, markup, type?)` | Register a statically imported icon so it renders with no network request and no dynamic chunk, even without importing its source. See [Static imports](#static-imports).                                                   |
| `isLoomiDiskIconSourceRegistered(source)`            | Whether `@loomidev/icons/<source>` has been imported.                                                                                                                                                                       |
| `setLoomiIconBasePath(path)`                         | Serve the raw `.svg` files from a path you control instead of loading the modules. See [Serving the SVGs yourself](#serving-the-svgs-yourself). Pass `undefined` to go back to modules.                                     |
| `getLoomiIconBasePath()`                             | The base path currently set, or `undefined` when icons load from the generated modules.                                                                                                                                     |
| `getLoomiDiskIconUrl(source, name, type?)`           | Resolves to the icon's `.svg` URL, or `undefined` if `name` isn't registered. An unavailable `type` for that source (e.g. `untitledui` + `"twotone"`) falls back to `outline` rather than failing.                          |
| `loomiDiskIconNames(source, type?)`                  | List all registered names for a source/type.                                                                                                                                                                                |
| `loomiDiskIconTypes(source)`                         | List the types a source actually ships, e.g. `["outline", "solid", "twotone"]` for `iconsax`.                                                                                                                               |
| `isLoomiDiskIconSource(source)`                      | Type guard - `true` for `"iconsax"` / `"untitledui"`, `false` for `"heroicons"`.                                                                                                                                            |

All disk-based icons are normalized to `fill`/`stroke="currentColor"` at import time (see
`scripts/import-icon-set.mjs`), so they theme exactly like Heroicons do - no per-icon
color prop needed.

### How an icon is resolved

`loadLoomiDiskIcon` tries three things, in order:

1. **A statically registered icon**, if you registered one for that name.
2. **A fetch from your base path**, if you called `setLoomiIconBasePath`.
3. **The generated per-icon module** - `import("./icons/iconsax/outline/home.js")`.

Step 3 is the default because it is the only one that survives a bundler. Every specifier
in the generated loader index is a string literal, so webpack, Vite, Rollup, esbuild, and
Parcel all trace and code-split them, and the consuming app needs no asset-copying step.

The raw `.svg` files still ship, and resolve on their own wherever the package keeps its
real module URL - a CDN, an import map, or a plain `<script type="module">`. What they
cannot survive is bundling: a bundler inlines this module into a chunk and never copies
`dist/svg/`, so a relative asset URL would 404. That is what steps 2 and 3 exist for.

### Static imports

Importing an icon directly is the leanest option - no runtime lookup, no dynamic chunk,
no source import needed, and dead icons drop out of the bundle:

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

## Fewer, bigger icon chunks

Because every icon is its own module, your bundler emits one small lazy chunk per icon it
can reach: 648 for Heroicons, plus one per icon in each disk-based set you import (about
3,900 for both). Only the icons a page renders are ever downloaded, but a long list of
files can slow builds and clutter deploys.

To trade that for one chunk per set, group them in your bundler config. A page then
downloads the whole set the first time it shows any icon from it: about 35 KB gzipped per
Heroicons variant, and up to about 375 KB for an Iconsax type, so this suits Heroicons far
better than the disk-based sets.

Vite (Rollup):

```js
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const match = id.match(/@loomidev\/icons\/dist\/(heroicons|icons\/[^/]+)\/([^/]+)\//);
          if (match) return `icons-${match[1].replace("icons/", "")}-${match[2]}`;
        },
      },
    },
  },
};
```

webpack:

```js
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      cacheGroups: {
        heroicons: {
          test: /@loomidev[\\/]icons[\\/]dist[\\/]heroicons[\\/]/,
          name: "icons-heroicons",
          chunks: "async",
        },
      },
    },
  },
};
```

For the disk-based sets, [serving the SVGs yourself](#serving-the-svgs-yourself) removes
their chunks entirely.

### Adding another disk-based source later

There's no source-specific code to touch. Vendor the new set with the generic import
script, pointed at a local export (one subfolder per type, full of flat `<name>.svg`
files):

```bash
node scripts/import-icon-set.mjs --source <name> --from /path/to/icons
pnpm build   # regenerates the source entry and copies the files into dist/svg/
```

Then widen `LoomiDiskIconSource` in `src/disk-icons.ts` to include the new name, and add
`./<name>` to `exports` in `package.json`.

<!-- bundle-size:start -->

## Bundle size

The registry is about **3.1 KB** minified and gzipped, excluding `lit`, and loads no icon data up front. Each Heroicon is its own module of a few hundred bytes, loaded the first time it renders. `import "@loomidev/icons/all"` loads every Heroicon eagerly instead: about 72.9 KB. Measured by `pnpm check:bundle-size`.

<!-- bundle-size:end -->

## Dependencies

- No LoomiUI package dependencies.
