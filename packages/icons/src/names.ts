import { HEROICON_NAMES } from "./heroicons/names.js";
import {
  isLoomiIconAvailable,
  registeredLoomiIconNames,
  type LoomiIconVariant,
} from "./heroicons.js";

// The shipped Heroicon names (~1.3 KB gzipped), kept out of heroicons.ts so only code
// that asks whether a name exists pays for the list.

let shipped: Record<LoomiIconVariant, Set<string>> | undefined;
const shipsHeroicon = (name: string, variant: LoomiIconVariant): boolean => {
  shipped ??= {
    outline: new Set(HEROICON_NAMES.outline.split(" ")),
    solid: new Set(HEROICON_NAMES.solid.split(" ")),
  };
  return shipped[variant].has(name);
};

const known = (name: string, variant: LoomiIconVariant) =>
  isLoomiIconAvailable(name, variant) || shipsHeroicon(name, variant);

/**
 * Whether `name` is a known icon (registered, provided, or a shipped Heroicon). Loads
 * nothing. A `solid` name with only an outline version counts, since it renders that.
 */
export function hasLoomiIcon(name: string, variant: LoomiIconVariant = "outline"): boolean {
  return (
    known(name, variant === "solid" ? "solid" : "outline") ||
    (variant === "solid" && known(name, "outline"))
  );
}

/** Names of every known icon for a variant: the shipped Heroicons plus any registered ones. */
export function loomiIconNames(variant: LoomiIconVariant = "outline"): string[] {
  const v = variant === "solid" ? "solid" : "outline";
  return Array.from(
    new Set([...HEROICON_NAMES[v].split(" "), ...registeredLoomiIconNames(v)]),
  ).sort();
}
