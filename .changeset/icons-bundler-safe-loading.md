---
"@loomidev/icons": minor
"@loomidev/icon": minor
---

Fix `source="iconsax"` and `source="untitledui"` rendering blank in bundled apps.

Disk-based icons resolved their `.svg` files through `new URL("./svg/", import.meta.url)`.
A bundler inlines that module into a chunk and never copies `dist/svg/`, so the URL
pointed somewhere that does not exist and the fetch 404'd — silently, because a failed
fetch leaves the sized placeholder `<svg>` empty. Vite's dev server made it worse by
serving `node_modules` over HTTP, so it only broke in production builds.

Icons now load from per-icon ES modules generated into `dist/icons/`, referenced through
static literal specifiers that every bundler can trace and code-split. No configuration
and no asset-copying step.

Two additions for finer control:

- `registerLoomiDiskIcon(source, name, markup, type?)` renders a statically imported icon
  with no runtime lookup and no dynamic chunk, via the new
  `@loomidev/icons/icons/<source>/<type>/<name>.js` subpath.
- `setLoomiIconBasePath(path)` / `getLoomiIconBasePath()` serve the raw `.svg` files from
  a path you control — a copied folder or a CDN — keeping icon data out of your JS.

Also adds `hasLoomiDiskIcon(source, name, type?)`, a synchronous name check that loads
nothing. The raw `.svg` files still ship and still resolve wherever the package keeps its
real module URL (CDN, import map, plain `<script type="module">`).
