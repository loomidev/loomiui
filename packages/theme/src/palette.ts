import {
  LOOMI_COLORS,
  LOOMI_SHADES,
  type LoomiColor,
  type LoomiShade,
} from "./generated/palette.gen.js";

export { LOOMI_COLORS, LOOMI_SHADES };
export type { LoomiColor, LoomiShade };

/** Type guard: is `value` one of the supported loomi color names? */
export function isLoomiColor(value: unknown): value is LoomiColor {
  return (
    typeof value === "string" &&
    (LOOMI_COLORS as readonly string[]).includes(value)
  );
}
