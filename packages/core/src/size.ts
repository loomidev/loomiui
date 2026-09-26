/**
 * The one ordered size scale every loomi component's `size` (and `*-size`) attribute
 * draws from, smallest first. A name always means the same position on the scale:
 * `medium` is always larger than `regular`, `big` always larger than `medium`, and so on.
 *
 * A component may support only part of the scale (a card only has `small` and
 * `regular`), but never a name outside it, and every component defaults to `regular`.
 * Each component declares the names it supports in its static `supportedSizes`.
 *
 * For the form controls that share `controlSizeStyles` (button, input, select,
 * datepicker, ...) equal names also mean equal heights: a `regular` button and a
 * `regular` input line up.
 */
export const LOOMI_SIZES = ["tiny", "small", "regular", "medium", "big", "huge", "omg"] as const;

/** A name from the canonical {@link LOOMI_SIZES} scale. */
export type LoomiSize = (typeof LOOMI_SIZES)[number];

/** The size every component defaults to. */
export const LOOMI_DEFAULT_SIZE: LoomiSize = "regular";

/**
 * The subset of the scale each size-like property of a component supports, keyed by
 * property name (`size`, `blurSize`, `imageSize`, ...), listed in scale order.
 */
export type LoomiSizeSupport = Readonly<Record<string, readonly LoomiSize[]>>;

/** Whether `value` is a name on the canonical size scale. */
export function isLoomiSize(value: unknown): value is LoomiSize {
  return typeof value === "string" && (LOOMI_SIZES as readonly string[]).includes(value);
}

/**
 * Narrows a component's `size` value to the names it supports, falling back to
 * `regular` for any other name, so an unsupported size renders as the default instead
 * of as a missing style. `supported` is the component's `supportedSizes` entry.
 */
export function resolveLoomiSize<T extends LoomiSize>(value: string, supported: readonly T[]): T {
  return (supported as readonly string[]).includes(value)
    ? (value as T)
    : (LOOMI_DEFAULT_SIZE as T);
}
