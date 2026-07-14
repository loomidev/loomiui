import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { DISK_ICON_NAMES } from "./generated/disk-manifest.js";

/**
 * Every icon source `<loomi-icon>` understands. `heroicons` is the original,
 * inlined registry (see heroicons.ts); the rest are disk-based (this file).
 */
export type LoomiIconSource = "heroicons" | LoomiDiskIconSource;

/** Sources backed by real .svg files under dist/svg/, fetched on demand. */
export type LoomiDiskIconSource = "iconsax" | "untitledui";

/** Visual finish of a disk-based icon. Not every source has every type. */
export type LoomiIconType = "outline" | "solid" | "twotone";

const DEFAULT_TYPE: LoomiIconType = "outline";

function toNameSets(
  byType: Partial<Record<LoomiIconType, readonly string[]>>,
): Partial<Record<LoomiIconType, Set<string>>> {
  const out: Partial<Record<LoomiIconType, Set<string>>> = {};
  for (const type of Object.keys(byType) as LoomiIconType[]) {
    out[type] = new Set(byType[type]);
  }
  return out;
}

const NAME_SETS: Record<LoomiDiskIconSource, Partial<Record<LoomiIconType, Set<string>>>> = {
  iconsax: toNameSets(DISK_ICON_NAMES.iconsax),
  untitledui: toNameSets(DISK_ICON_NAMES.untitledui),
};

/** Base URL for this package's own `dist/svg/` folder, resolved relative to
 * the running module so asset URLs are correct whether this package was
 * installed from npm or loaded straight from a CDN like esm.sh. */
const ASSET_BASE_URL = new URL("./svg/", import.meta.url);

export function isLoomiDiskIconSource(source: string): source is LoomiDiskIconSource {
  return source === "iconsax" || source === "untitledui";
}

/** Names registered for a disk-based source/type. Falls back to `outline`
 * when `type` isn't available for that source (e.g. untitledui + "twotone"). */
export function loomiDiskIconNames(
  source: LoomiDiskIconSource,
  type: LoomiIconType = DEFAULT_TYPE,
): string[] {
  const names = NAME_SETS[source][type] ?? NAME_SETS[source][DEFAULT_TYPE];
  return names ? Array.from(names) : [];
}

/** All icon types a disk-based source actually ships. */
export function loomiDiskIconTypes(source: LoomiDiskIconSource): LoomiIconType[] {
  return Object.keys(NAME_SETS[source]) as LoomiIconType[];
}

/**
 * Resolves `(source, name, type)` to the .svg file's URL, or `undefined` if
 * `name` isn't registered. Lenient on `type`: an unavailable type (e.g.
 * `untitledui` + `"twotone"`) falls back to `"outline"` rather than failing,
 * matching how `<loomi-icon>` already treats an unknown Heroicons `variant`.
 */
export function getLoomiDiskIconUrl(
  source: LoomiDiskIconSource,
  name: string,
  type: LoomiIconType = DEFAULT_TYPE,
): string | undefined {
  const bySource = NAME_SETS[source];
  const resolvedType = bySource[type]?.has(name) ? type : DEFAULT_TYPE;
  if (!bySource[resolvedType]?.has(name)) return undefined;
  return new URL(
    `${source}/${resolvedType}/${encodeURIComponent(name)}.svg`,
    ASSET_BASE_URL,
  ).toString();
}

type UnsafeSvgResult = ReturnType<typeof unsafeSVG>;

// One fetch per distinct icon per page, ever — every subsequent request for
// the same (source, name, type) reuses this cached, already-settled promise.
const markupCache = new Map<string, Promise<UnsafeSvgResult | undefined>>();

async function fetchInnerMarkup(url: string): Promise<UnsafeSvgResult | undefined> {
  try {
    const response = await fetch(url);
    if (!response.ok) return undefined;
    const raw = await response.text();
    const inner = raw.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
    return unsafeSVG(inner);
  } catch {
    return undefined;
  }
}

/**
 * Fetches (and caches) the inner markup for a disk-based icon, ready to drop
 * into a Lit `html` template: `` html`<svg>${await loadLoomiDiskIcon(...)}</svg>` ``.
 * Resolves to `undefined` for an unregistered name or a failed fetch — callers
 * should fall back to their own placeholder/slot in that case.
 */
export function loadLoomiDiskIcon(
  source: LoomiDiskIconSource,
  name: string,
  type: LoomiIconType = DEFAULT_TYPE,
): Promise<UnsafeSvgResult | undefined> {
  const url = getLoomiDiskIconUrl(source, name, type);
  if (!url) return Promise.resolve(undefined);

  let pending = markupCache.get(url);
  if (!pending) {
    pending = fetchInnerMarkup(url);
    markupCache.set(url, pending);
  }
  return pending;
}
