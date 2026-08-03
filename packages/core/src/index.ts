import { LitElement, type CSSResultGroup, type PropertyValues } from "lit";
import { themeStyles, type LoomiColor } from "@loomidev/theme";
import { elevationStyles } from "./elevation.js";
import { focusStyles } from "./focus.js";
import { motionStyles } from "./motion.js";
export * from "./dark-mode.js";
export * from "./elevation.js";
export * from "./field.js";
export * from "./focus.js";
export * from "./i18n.js";
export * from "./mention.js";
export * from "./menu-nav.js";
export * from "./motion.js";
export * from "./overlay.js";

// Re-export the shared theme surface so components import everything from @loomidev/core.
export {
  themeStyles,
  LOOMI_COLORS,
  LOOMI_SHADES,
  isLoomiColor,
  type LoomiColor,
  type LoomiShade,
} from "@loomidev/theme";

/**
 * Prepend the shared theme tokens, motion keyframes, elevation shadow, and focus-ring
 * color to a component's own styles. Use it in `static styles` so every `var(--loomi-*)`
 * reference resolves in the Shadow DOM, `animation: loomi-pop-in var(--loomi-motion-duration) var(--loomi-motion-ease);`
 * (see `motionStyles` in `./motion.ts`) is available without redefining the keyframes,
 * `box-shadow: var(--loomi-shadow-elevated);` (see `./elevation.ts`) is available
 * without retyping the shadow stack, and `outline: 2px solid var(--loomi-focus-ring-color);`
 * (see `./focus.ts`) always resolves to a real color:
 *
 * ```ts
 * static styles = loomiStyles(componentStyles);
 * ```
 */
export function loomiStyles(...styles: CSSResultGroup[]): CSSResultGroup[] {
  return [themeStyles, motionStyles, elevationStyles, focusStyles, ...styles];
}

function safeClassToken(value: string): string {
  return value
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^A-Za-z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function componentTypeFromTag(tagName: string): string {
  return safeClassToken(tagName.toLowerCase().replace(/^loomi-/, "")) || "component";
}

/** A short random id, e.g. for de-duplicating notification keys across component instances. */
export function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 7) || String(Date.now()).slice(-5);
}

/**
 * Shared base for loomi web components. Each host element receives a stable target
 * class using its explicit `name` when present, or `loomi-<component>-<suffix>`.
 */
export class LoomiElement extends LitElement {
  static override properties = {
    name: { type: String, reflect: true },
  };

  declare name: string;

  private generatedLoomiName = "";
  private appliedLoomiNameClass = "";

  override connectedCallback(): void {
    super.connectedCallback();
    this.syncLoomiNameClass();
  }

  protected override update(changedProperties: PropertyValues<this>): void {
    super.update(changedProperties);
    this.syncLoomiNameClass();
  }

  private get defaultLoomiName(): string {
    if (!this.generatedLoomiName) {
      this.generatedLoomiName = `loomi-${componentTypeFromTag(this.localName)}-${randomSuffix()}`;
    }
    return this.generatedLoomiName;
  }

  private get loomiNameClass(): string {
    return safeClassToken(this.name || "") || this.defaultLoomiName;
  }

  private syncLoomiNameClass(): void {
    const nextClass = this.loomiNameClass;
    if (this.appliedLoomiNameClass === nextClass) return;
    if (this.appliedLoomiNameClass) this.classList.remove(this.appliedLoomiNameClass);
    this.classList.add(nextClass);
    this.appliedLoomiNameClass = nextClass;
  }
}

/** A single token reference with its private-default fallback, e.g. `var(--loomi-red-600, var(--_loomi-red-600-default))`. */
function token(color: string, shade: number): string {
  return `var(--loomi-${color}-${shade}, var(--_loomi-${color}-${shade}-default))`;
}

/** A single themed color value (with private-default fallback) for inline use. */
export function cssColor(color: LoomiColor | string, shade: number): string {
  return token(color || "primary", shade);
}

/**
 * Build the per-instance accent variables for a color. Set the returned string as the
 * element's inline `style` and reference the slots from plain CSS:
 *
 * | slot | shade |
 * | --- | --- |
 * | `--_loomi-accent` | 600 |
 * | `--_loomi-accent-strong` | 700 |
 * | `--_loomi-accent-soft` | 100 |
 * | `--_loomi-accent-softer` | 50 |
 * | `--_loomi-accent-ring` | 200 |
 * | `--_loomi-accent-fg` | 700 |
 * | `--_loomi-accent-border` | 200 |
 *
 * Defaults flow from the global `--loomi-<color>-*` theme slots, so a single `:root`
 * override re-skins every component that uses an accent.
 */
export function accentVars(color: LoomiColor | string): string {
  const c = color || "primary";
  return [
    `--_loomi-accent:${token(c, 600)}`,
    `--_loomi-accent-strong:${token(c, 700)}`,
    `--_loomi-accent-soft:${token(c, 100)}`,
    `--_loomi-accent-softer:${token(c, 50)}`,
    `--_loomi-accent-ring:${token(c, 200)}`,
    `--_loomi-accent-fg:${token(c, 700)}`,
    `--_loomi-accent-border:${token(c, 200)}`,
    "",
  ].join(";");
}

/**
 * Call `handler` when a pointer event lands outside `el` (crossing shadow boundaries
 * via composedPath). Returns a cleanup function. Handy for selects, dropmenus, popovers.
 *
 * `contextmenu` counts as well as `click`: a right-click elsewhere is just as much "the
 * user has moved on" as a left-click, and an open panel left sitting under the browser's
 * own context menu — or under another component's — reads as stuck.
 */
export function onClickOutside(el: Element, handler: () => void): () => void {
  const listener = (e: Event) => {
    if (!e.composedPath().includes(el)) handler();
  };
  document.addEventListener("click", listener, true);
  document.addEventListener("contextmenu", listener, true);
  return () => {
    document.removeEventListener("click", listener, true);
    document.removeEventListener("contextmenu", listener, true);
  };
}

let scrollLockCount = 0;
let previousBodyOverflow = "";
let previousDocumentOverflow = "";

/**
 * Refcounted document scroll lock shared by every overlay component (modal, drawer,
 * …). A single counter — rather than one per component package — so e.g. closing a
 * confirm modal opened from within an open drawer doesn't prematurely unlock the page.
 */
export function lockBodyScroll(): void {
  if (scrollLockCount === 0) {
    previousBodyOverflow = document.body.style.overflow;
    previousDocumentOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
  }
  scrollLockCount += 1;
}

/** Releases one `lockBodyScroll()` call; only restores `overflow` once every caller has released. */
export function unlockBodyScroll(): void {
  if (scrollLockCount === 0) return;
  scrollLockCount -= 1;
  if (scrollLockCount === 0) {
    document.body.style.overflow = previousBodyOverflow;
    document.documentElement.style.overflow = previousDocumentOverflow;
  }
}
