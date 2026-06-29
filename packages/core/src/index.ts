import { LitElement, type CSSResultGroup, type PropertyValues } from "lit";
import { themeStyles, type LoomiColor } from "@loomidev/theme";
export * from "./i18n.js";

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
 * Prepend the shared theme tokens to a component's own styles. Use it in
 * `static styles` so every `var(--loomi-*)` reference resolves in the Shadow DOM:
 *
 * ```ts
 * static styles = loomiStyles(componentStyles);
 * ```
 */
export function loomiStyles(...styles: CSSResultGroup[]): CSSResultGroup[] {
  return [themeStyles, ...styles];
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

function randomSuffix(): string {
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
 */
export function onClickOutside(el: Element, handler: () => void): () => void {
  const listener = (e: MouseEvent) => {
    if (!e.composedPath().includes(el)) handler();
  };
  document.addEventListener("click", listener, true);
  return () => document.removeEventListener("click", listener, true);
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
