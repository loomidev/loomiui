import { unsafeSVG } from "lit/directives/unsafe-svg.js";

/**
 * Every icon source `<loomi-icon>` understands. `heroicons` is the default set
 * (see heroicons.ts); the rest are disk-based (this file).
 */
export type LoomiIconSource = "heroicons" | LoomiDiskIconSource;

/** Sources backed by real .svg files under dist/svg/. */
export type LoomiDiskIconSource = "iconsax" | "untitledui";

/** Visual finish of a disk-based icon. Not every source has every type. */
export type LoomiIconType = "outline" | "solid" | "twotone";

const DEFAULT_TYPE: LoomiIconType = "outline";

/** One lazily-imported icon set: name -> loader for that icon's module. */
export interface LoomiDiskIconSetModule {
  loaders: Record<string, () => Promise<{ default: string }>>;
}

/** What a source entry (`@loomidev/icons/<source>`) registers for each type it ships. */
export interface LoomiDiskIconSetEntry {
  names: readonly string[];
  load: () => Promise<LoomiDiskIconSetModule>;
}

type SourceRecord = Partial<
  Record<LoomiIconType, { names: Set<string>; load: LoomiDiskIconSetEntry["load"] }>
>;

/**
 * Sources are opt-in: nothing is known about a source until its entry module is
 * imported (`import "@loomidev/icons/iconsax"`). That keeps an app that never uses
 * a disk-based set from bundling its name list or emitting a chunk per icon.
 */
const SOURCES: Partial<Record<LoomiDiskIconSource, SourceRecord>> = {};

/**
 * Registers a disk-based source's names and lazy loaders. Called by the generated
 * `@loomidev/icons/<source>` entries; you shouldn't need to call it yourself.
 */
export function registerLoomiDiskIconSource(
  source: LoomiDiskIconSource,
  sets: Partial<Record<LoomiIconType, LoomiDiskIconSetEntry>>,
): void {
  const record: SourceRecord = {};
  for (const type of Object.keys(sets) as LoomiIconType[]) {
    const entry = sets[type]!;
    record[type] = { names: new Set(entry.names), load: entry.load };
  }
  SOURCES[source] = record;
}

/** Whether `@loomidev/icons/<source>` has been imported. */
export function isLoomiDiskIconSourceRegistered(source: LoomiDiskIconSource): boolean {
  return SOURCES[source] !== undefined;
}

const warned = new Set<string>();

function sourceRecord(source: LoomiDiskIconSource): SourceRecord {
  const record = SOURCES[source];
  if (!record && !warned.has(source)) {
    warned.add(source);
    console.warn(
      `[@loomidev/icons] Icon source "${source}" isn't loaded. Add \`import "@loomidev/icons/${source}";\` once in your app to use it.`,
    );
  }
  return record ?? {};
}

/** Base URL for this package's own `dist/svg/` folder, resolved relative to
 * the running module. Correct whenever the package keeps its real module URL
 * — a CDN, an import map, or plain `<script type="module">`. A bundler inlines
 * this module into a chunk and never copies `dist/svg/`, which is why bundled
 * apps resolve icons through the generated modules instead (see
 * `loadLoomiDiskIcon`), or point this somewhere real via
 * {@link setLoomiIconBasePath}. */
const PACKAGE_ASSET_BASE_URL = new URL("./svg/", import.meta.url);

let assetBaseUrl: URL | undefined;

/**
 * Serve the raw `.svg` files from somewhere you control — a folder you copied
 * `@loomidev/icons/dist/svg/` into, or a CDN — instead of loading icons from
 * the bundled JS modules. Trailing slash optional; relative paths resolve
 * against the document.
 *
 * ```js
 * setLoomiIconBasePath("/icons");                            // copied into public/
 * setLoomiIconBasePath("https://esm.sh/@loomidev/icons/dist/svg");
 * ```
 *
 * Pass `undefined` to go back to the default module-based loading. Only
 * affects icons not yet loaded — anything already cached stays cached.
 */
export function setLoomiIconBasePath(path: string | undefined): void {
  if (path === undefined) {
    assetBaseUrl = undefined;
    return;
  }
  const base = typeof document === "undefined" ? undefined : document.baseURI;
  assetBaseUrl = new URL(path.endsWith("/") ? path : `${path}/`, base);
}

/** The base path set by {@link setLoomiIconBasePath}, or `undefined` when
 * icons load from the generated modules. */
export function getLoomiIconBasePath(): string | undefined {
  return assetBaseUrl?.toString();
}

export function isLoomiDiskIconSource(source: string): source is LoomiDiskIconSource {
  return source === "iconsax" || source === "untitledui";
}

/** Names registered for a disk-based source/type. Falls back to `outline`
 * when `type` isn't available for that source (e.g. untitledui + "twotone"). */
export function loomiDiskIconNames(
  source: LoomiDiskIconSource,
  type: LoomiIconType = DEFAULT_TYPE,
): string[] {
  const record = sourceRecord(source);
  const names = (record[type] ?? record[DEFAULT_TYPE])?.names;
  return names ? Array.from(names) : [];
}

/** All icon types a disk-based source actually ships. */
export function loomiDiskIconTypes(source: LoomiDiskIconSource): LoomiIconType[] {
  return Object.keys(sourceRecord(source)) as LoomiIconType[];
}

/** Resolves `type` the way every lookup here does: an unavailable type (e.g.
 * `untitledui` + "twotone") falls back to `outline` rather than failing,
 * matching how `<loomi-icon>` already treats an unknown Heroicons `variant`. */
function resolveType(source: LoomiDiskIconSource, name: string, type: LoomiIconType) {
  const bySource = SOURCES[source];
  // A statically registered icon counts even when its source entry was never imported.
  const known = (t: LoomiIconType) =>
    registered.has(cacheKey(source, t, name)) || !!bySource?.[t]?.names.has(name);
  if (known(type)) return type;
  if (known(DEFAULT_TYPE)) return DEFAULT_TYPE;
  if (!bySource) sourceRecord(source); // warns once that the source isn't loaded
  return undefined;
}

/** Whether `(source, name)` is a real icon in this package. Cheap and
 * synchronous — it only consults the source's name list, so it is `false` for
 * every name until `@loomidev/icons/<source>` has been imported. */
export function hasLoomiDiskIcon(
  source: LoomiDiskIconSource,
  name: string,
  type: LoomiIconType = DEFAULT_TYPE,
): boolean {
  return resolveType(source, name, type) !== undefined;
}

/**
 * The `.svg` file's URL for `(source, name, type)`, or `undefined` if `name`
 * isn't registered. Points at whatever {@link setLoomiIconBasePath} was given,
 * falling back to this package's own `dist/svg/`.
 *
 * Only meaningful where those files are actually served: a bundled app that
 * never set a base path loads icons from the generated modules instead, and
 * this URL will not resolve there.
 */
export function getLoomiDiskIconUrl(
  source: LoomiDiskIconSource,
  name: string,
  type: LoomiIconType = DEFAULT_TYPE,
): string | undefined {
  const resolvedType = resolveType(source, name, type);
  if (!resolvedType) return undefined;
  return new URL(
    `${source}/${resolvedType}/${encodeURIComponent(name)}.svg`,
    assetBaseUrl ?? PACKAGE_ASSET_BASE_URL,
  ).toString();
}

type UnsafeSvgResult = ReturnType<typeof unsafeSVG>;

// One load per distinct icon per page, ever — every subsequent request for the
// same (source, name, type) reuses this cached, already-settled promise.
const markupCache = new Map<string, Promise<UnsafeSvgResult | undefined>>();

/** Inner markup registered ahead of time, by cache key. */
const registered = new Map<string, string>();

const cacheKey = (source: LoomiDiskIconSource, type: LoomiIconType, name: string) =>
  `${source}/${type}/${name}`;

/**
 * Register a statically imported icon so it renders with no network request
 * and no dynamic chunk — the tree-shakeable path:
 *
 * ```js
 * import home from "@loomidev/icons/icons/iconsax/outline/home.js";
 * registerLoomiDiskIcon("iconsax", "home", home, "outline");
 * ```
 */
export function registerLoomiDiskIcon(
  source: LoomiDiskIconSource,
  name: string,
  markup: string,
  type: LoomiIconType = DEFAULT_TYPE,
): void {
  const key = cacheKey(source, type, name);
  registered.set(key, markup);
  markupCache.delete(key);
}

async function fetchInnerMarkup(url: string): Promise<string | undefined> {
  try {
    const response = await fetch(url);
    if (!response.ok) return undefined;
    const raw = await response.text();
    return raw.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
  } catch {
    return undefined;
  }
}

async function importInnerMarkup(
  source: LoomiDiskIconSource,
  type: LoomiIconType,
  name: string,
): Promise<string | undefined> {
  try {
    const set = await SOURCES[source]?.[type]?.load();
    return await set?.loaders[name]?.().then((module) => module.default);
  } catch {
    return undefined;
  }
}

async function resolveMarkup(
  source: LoomiDiskIconSource,
  type: LoomiIconType,
  name: string,
): Promise<UnsafeSvgResult | undefined> {
  const preset = registered.get(cacheKey(source, type, name));
  if (preset !== undefined) return unsafeSVG(preset);

  // A base path means "these files are served, use them"; otherwise the
  // generated modules are the only thing guaranteed to resolve under a bundler.
  const inner = assetBaseUrl
    ? await fetchInnerMarkup(getLoomiDiskIconUrl(source, name, type)!)
    : await importInnerMarkup(source, type, name);

  return inner === undefined ? undefined : unsafeSVG(inner);
}

/**
 * Loads (and caches) the inner markup for a disk-based icon, ready to drop
 * into a Lit `html` template: `` html`<svg>${await loadLoomiDiskIcon(...)}</svg>` ``.
 * Resolves to `undefined` for an unregistered name or a failed load — callers
 * should fall back to their own placeholder/slot in that case.
 */
export function loadLoomiDiskIcon(
  source: LoomiDiskIconSource,
  name: string,
  type: LoomiIconType = DEFAULT_TYPE,
): Promise<UnsafeSvgResult | undefined> {
  const resolvedType = resolveType(source, name, type);
  if (!resolvedType) return Promise.resolve(undefined);

  const key = cacheKey(source, resolvedType, name);
  let pending = markupCache.get(key);
  if (!pending) {
    pending = resolveMarkup(source, resolvedType, name);
    markupCache.set(key, pending);
  }
  return pending;
}
