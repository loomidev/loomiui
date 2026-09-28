import type { SVGTemplateResult } from "lit";
import { HEROICON_NAMES } from "./heroicons/names.js";

export type LoomiIconVariant = "outline" | "solid";

/**
 * The Heroicons registry. Each icon is its own ES module (generated from
 * data/heroicons.json by scripts/build-heroicon-modules.mjs) and is only loaded
 * the first time something asks for it, so a component that supports
 * `icon="<name>"` costs a consumer only the icons actually rendered.
 *
 * Three ways an icon gets here, checked in this order:
 *
 * 1. `registerLoomiIcon()` — an app's own icon, or an override of a Heroicon.
 * 2. `provideLoomiIcons()` — icons imported statically and handed over up front
 *    (a component's own chrome icons, or everything via `@loomidev/icons/all`).
 * 3. `loadLoomiIcon()` — a dynamic import of that one icon's module.
 */

const VARIANTS: readonly LoomiIconVariant[] = ["outline", "solid"];

const registered: Record<LoomiIconVariant, Map<string, SVGTemplateResult>> = {
  outline: new Map(),
  solid: new Map(),
};
const provided: Record<LoomiIconVariant, Map<string, SVGTemplateResult>> = {
  outline: new Map(),
  solid: new Map(),
};
const pending = new Map<string, Promise<SVGTemplateResult | undefined>>();

const isVariant = (variant: string): variant is LoomiIconVariant =>
  (VARIANTS as readonly string[]).includes(variant);

let shipped: Record<LoomiIconVariant, Set<string>> | undefined;
const shipsHeroicon = (name: string, variant: LoomiIconVariant): boolean => {
  shipped ??= {
    outline: new Set(HEROICON_NAMES.outline.split(" ")),
    solid: new Set(HEROICON_NAMES.solid.split(" ")),
  };
  return shipped[variant].has(name);
};

// The name -> module map is itself loaded on first use: it costs ~4 KB gzipped, which
// an app that renders no dynamic icon (or only provided ones) should never pay.
let loaders: Promise<typeof import("./heroicons/loaders.js")> | undefined;
const loadersModule = () => (loaders ??= import("./heroicons/loaders.js"));

/** Register (or override) an icon by name so `icon="<name>"` can render it. */
export function registerLoomiIcon(
  name: string,
  path: SVGTemplateResult,
  variant: LoomiIconVariant = "outline",
): void {
  registered[variant].set(name, path);
}

/**
 * Hand over icons that are already imported, so they render synchronously with no
 * lazy load. Unlike {@link registerLoomiIcon}, this never replaces an icon an app
 * registered, so a component providing its own chrome icons can't clobber an
 * app's override.
 */
export function provideLoomiIcons(
  icons: Record<string, SVGTemplateResult>,
  variant: LoomiIconVariant = "outline",
): void {
  for (const [name, icon] of Object.entries(icons)) {
    if (!provided[variant].has(name)) provided[variant].set(name, icon);
  }
}

function lookup(name: string, variant: LoomiIconVariant): SVGTemplateResult | undefined {
  return registered[variant].get(name) ?? provided[variant].get(name);
}

/**
 * The variant a request for `(name, variant)` resolves to: `solid` falls back to
 * `outline` when no solid version exists, matching how `<loomi-icon>` treats an
 * unknown variant. `undefined` means no such icon.
 */
function resolveVariant(name: string, variant: LoomiIconVariant): LoomiIconVariant | undefined {
  if (lookup(name, variant) || shipsHeroicon(name, variant)) return variant;
  if (variant === "solid" && (lookup(name, "outline") || shipsHeroicon(name, "outline"))) {
    return "outline";
  }
  return undefined;
}

/**
 * The icon's inner SVG if it is ready to render right now — registered, provided,
 * or already loaded — else `undefined`. It never starts a load: use
 * {@link loadLoomiIcon}, or render through the `loomiIcon()` directive, which does
 * both. Use {@link hasLoomiIcon} to ask whether a name exists at all.
 */
export function getLoomiIcon(
  name: string,
  variant: LoomiIconVariant = "outline",
): SVGTemplateResult | undefined {
  const v = isVariant(variant) ? variant : "outline";
  const resolved = resolveVariant(name, v);
  return resolved ? lookup(name, resolved) : undefined;
}

/** Whether `name` is a known icon (registered, provided, or a shipped Heroicon). Loads nothing. */
export function hasLoomiIcon(name: string, variant: LoomiIconVariant = "outline"): boolean {
  return resolveVariant(name, isVariant(variant) ? variant : "outline") !== undefined;
}

/**
 * Loads (once, then cached) and resolves the icon's inner SVG, or `undefined` for an
 * unknown name or a failed load.
 */
export function loadLoomiIcon(
  name: string,
  variant: LoomiIconVariant = "outline",
): Promise<SVGTemplateResult | undefined> {
  const v = isVariant(variant) ? variant : "outline";
  const resolved = resolveVariant(name, v);
  if (!resolved) return Promise.resolve(undefined);
  const ready = lookup(name, resolved);
  if (ready) return Promise.resolve(ready);

  const key = `${resolved}/${name}`;
  let load = pending.get(key);
  if (!load) {
    load = loadersModule()
      .then(({ HEROICON_LOADERS }) => HEROICON_LOADERS[resolved][name]())
      .then((module) => {
        provideLoomiIcons({ [name]: module.default }, resolved);
        // An app may have registered an override while the module was in flight.
        return lookup(name, resolved);
      })
      .catch(() => {
        pending.delete(key); // let a later render retry, e.g. after a flaky network
        loaders = undefined;
        return undefined;
      });
    pending.set(key, load);
  }
  return load;
}

/** Names of every known icon for a variant: the shipped Heroicons plus any registered ones. */
export function loomiIconNames(variant: LoomiIconVariant = "outline"): string[] {
  const v = isVariant(variant) ? variant : "outline";
  return Array.from(
    new Set([...HEROICON_NAMES[v].split(" "), ...provided[v].keys(), ...registered[v].keys()]),
  ).sort();
}
