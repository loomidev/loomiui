import { html, nothing, svg, type PropertyValues, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LoomiElement, loomiStyles, loomiT } from "@loomidev/core";
import "@loomidev/icon/loomi-icon.js";
import { componentStyles } from "./generated/styles.css.js";

type ResizeDir = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";
interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const RESIZE_DIRS: ResizeDir[] = ["n", "s", "e", "w", "ne", "nw", "se", "sw"];
const EDGE_DIRS = new Set<ResizeDir>(["n", "s", "e", "w"]);

const GRIP = svg`<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="9" cy="5" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="9" cy="19" r="1.5"/><circle cx="15" cy="5" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="15" cy="19" r="1.5"/></svg>`;

const booleanAttribute = {
  fromAttribute(value: string | null): boolean {
    return value !== null && value.toLowerCase() !== "false";
  },
  toAttribute(value: boolean): string | null {
    return value ? "" : null;
  },
};

/** Base z-index new panels stack above; each bring-to-front bumps a shared counter on top of it. */
const Z_BASE = 2147480000;
let topStackOffset = 0;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Walks into nested shadow roots to find the actually-focused element. */
function deepActiveElement(): Element | null {
  let el: Element | null = document.activeElement;
  while (el?.shadowRoot?.activeElement) el = el.shadowRoot.activeElement;
  return el;
}

const registry = new Map<string, LoomiFloatingPanel>();

/** Open a floating panel by its `name`. */
export function showLoomiFloatingPanel(name: string): void {
  registry.get(name)?.show();
}
/** Close a floating panel by its `name`. */
export function hideLoomiFloatingPanel(name: string): void {
  registry.get(name)?.hide();
}

// Exposed on `window` so plain `onclick="showLoomiFloatingPanel('name')"` markup works with
// no build step or module-scoped import, matching every other attribute-driven usage in
// this library.
declare global {
  interface Window {
    showLoomiFloatingPanel: typeof showLoomiFloatingPanel;
    hideLoomiFloatingPanel: typeof hideLoomiFloatingPanel;
  }
}
if (typeof window !== "undefined") {
  window.showLoomiFloatingPanel = showLoomiFloatingPanel;
  window.hideLoomiFloatingPanel = hideLoomiFloatingPanel;
}

/**
 * `<loomi-floating-panel>` — a draggable, resizable panel that floats above the page,
 * unanchored to any trigger. Open/close via `name` with `showLoomiFloatingPanel()` /
 * `hideLoomiFloatingPanel()`, or the instance `show()` / `hide()` methods.
 *
 * @slot - The panel body.
 * @fires open - Shown. @fires close - Dismissed.
 * @fires loomi-drag - `detail: { top, left }` after the panel is moved.
 * @fires loomi-resize - `detail: { top, left, width, height }` after the panel is resized.
 * @fires loomi-minimize - `detail: { minimized }` when the minimize button is toggled.
 * @fires loomi-maximize - `detail: { maximized }` when the maximize button (or header double-click) is toggled.
 */
@customElement("loomi-floating-panel")
export class LoomiFloatingPanel extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property() name = "";
  @property() title = "";
  @property() locale = "";
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: Boolean, attribute: "show-close-icon", converter: booleanAttribute })
  showCloseIcon = true;
  /** Enables the eight drag handles along the edges/corners. */
  @property({ type: Boolean, converter: booleanAttribute }) resizable = true;
  /** Disables moving the panel by dragging (or arrow-keying) its header. */
  @property({ type: Boolean, attribute: "no-drag" }) noDrag = false;
  /** Keeps the panel's edges within the viewport while dragging/resizing. */
  @property({ type: Boolean, converter: booleanAttribute }) bounded = true;
  /** Shows a header button that collapses the panel to just its title bar. */
  @property({ type: Boolean }) minimize = false;
  /** Shows a header button that expands the panel to fill the viewport. */
  @property({ type: Boolean }) maximize = false;
  /** Restricts dragging to a dedicated grip in the header instead of the whole header. */
  @property({ type: Boolean, attribute: "drag-handle" }) dragHandle = false;
  /** Whether the panel is currently collapsed to its title bar. */
  @property({ type: Boolean, reflect: true }) minimized = false;
  /** Whether the panel is currently filling the viewport. */
  @property({ type: Boolean, reflect: true }) maximized = false;
  /** Initial position; any CSS length. Left unset, the panel opens centered. */
  @property() top = "";
  @property() left = "";
  /** Initial size; any CSS length. Left unset, falls back to the stylesheet default. */
  @property() width = "";
  @property() height = "";
  @property({ type: Number, attribute: "min-width" }) minWidth = 220;
  @property({ type: Number, attribute: "min-height" }) minHeight = 140;
  @property({ type: Number, attribute: "max-width" }) maxWidth = Infinity;
  @property({ type: Number, attribute: "max-height" }) maxHeight = Infinity;
  /** Persists position/size to `localStorage` under this key across reloads. */
  @property({ attribute: "auto-save-id" }) autoSaveId = "";

  /** Explicit pixel rect once the panel has been dragged/resized (or restored); `null` while it's still following the `top`/`left`/`width`/`height` attributes (or centered). */
  private rect: Rect | null = null;
  private hasLoadedPersisted = false;
  /** The element focused before `show()` was called, restored when the panel closes. */
  private previouslyFocused: HTMLElement | null = null;
  private originalParent: Node | null = null;
  private originalNextSibling: ChildNode | null = null;

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.name) registry.set(this.name, this);
    document.addEventListener("keydown", this.onKey);
    this.addEventListener("pointerdown", this.bringToFront);
    if (!this.hasLoadedPersisted) {
      this.hasLoadedPersisted = true;
      this.rect = this.loadPersistedRect();
    }
    if (!this.hasAttribute("tabindex")) this.tabIndex = -1;
    this.setAttribute("role", "dialog");
    this.setAttribute("aria-modal", "false");
    this.syncPosition();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this.name) registry.delete(this.name);
    document.removeEventListener("keydown", this.onKey);
    this.removeEventListener("pointerdown", this.bringToFront);
  }

  protected override updated(changed: PropertyValues<this>): void {
    super.updated(changed);
    if (changed.has("title") || changed.has("locale")) {
      this.setAttribute(
        "aria-label",
        this.title || loomiT("floatingPanel.dialog", {}, this.locale),
      );
    }
    if (
      changed.has("top") ||
      changed.has("left") ||
      changed.has("width") ||
      changed.has("height")
    ) {
      this.syncPosition();
    }
  }

  show(): void {
    this.previouslyFocused = deepActiveElement() as HTMLElement | null;
    this.moveToDocumentBody();
    this.open = true;
    this.bringToFront();
    this.dispatchEvent(new Event("open", { bubbles: true, composed: true }));
    this.updateComplete.then(() => {
      const header = this.shadowRoot?.querySelector<HTMLElement>(".loomi-header");
      (header ?? this).focus();
    });
  }

  hide(): void {
    if (!this.open) return;
    this.open = false;
    this.dispatchEvent(new Event("close", { bubbles: true, composed: true }));
    this.restoreOriginalPosition();
    this.previouslyFocused?.focus();
    this.previouslyFocused = null;
  }

  private bringToFront = (): void => {
    topStackOffset += 1;
    this.style.zIndex = String(Z_BASE + topStackOffset);
  };

  private moveToDocumentBody(): void {
    if (this.parentNode === document.body) return;

    this.originalParent = this.parentNode;
    this.originalNextSibling = this.nextSibling;
    document.body.appendChild(this);
  }

  private restoreOriginalPosition(): void {
    if (!this.originalParent) return;

    const nextSibling =
      this.originalNextSibling?.parentNode === this.originalParent
        ? this.originalNextSibling
        : null;

    if (this.originalParent.isConnected) {
      this.originalParent.insertBefore(this, nextSibling);
    }

    this.originalParent = null;
    this.originalNextSibling = null;
  }

  private storageKey(): string | null {
    return this.autoSaveId ? `loomi-floating-panel:${this.autoSaveId}` : null;
  }

  private loadPersistedRect(): Rect | null {
    const key = this.storageKey();
    if (!key || typeof localStorage === "undefined") return null;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Partial<Rect>;
      const { top, left, width, height } = parsed;
      if (
        [top, left, width, height].every(
          (value) => typeof value === "number" && Number.isFinite(value),
        )
      ) {
        return { top, left, width, height } as Rect;
      }
    } catch {
      // Ignore invalid persisted rect and fall back to attribute/CSS defaults.
    }
    return null;
  }

  private persistRect(): void {
    const key = this.storageKey();
    if (!key || !this.rect || typeof localStorage === "undefined") return;
    try {
      localStorage.setItem(key, JSON.stringify(this.rect));
    } catch {
      // Storage unavailable/full — persistence is a nicety, not required for the panel to work.
    }
  }

  /** Applies `rect` (once the panel has moved/resized) or the raw `top`/`left`/`width`/`height` attributes directly to the host's inline style — the host itself is the visible, positioned box. */
  private syncPosition(): void {
    if (this.rect) {
      this.classList.remove("is-centered");
      this.style.top = `${this.rect.top}px`;
      this.style.left = `${this.rect.left}px`;
      this.style.width = `${this.rect.width}px`;
      this.style.height = `${this.rect.height}px`;
      return;
    }
    this.classList.toggle("is-centered", !this.top && !this.left);
    this.style.top = this.top || "";
    this.style.left = this.left || "";
    this.style.width = this.width || "";
    this.style.height = this.height || "";
  }

  private containsFocus(): boolean {
    const active = deepActiveElement();
    if (!active) return false;
    return active === this || this.contains(active) || (this.shadowRoot?.contains(active) ?? false);
  }

  private onKey = (e: KeyboardEvent): void => {
    if (!this.open || e.key !== "Escape" || !this.containsFocus()) return;
    this.hide();
  };

  /** Toggles the collapsed-to-title-bar state; turns off `maximized` first if it was on. */
  private toggleMinimize = (): void => {
    if (this.maximized) this.maximized = false;
    this.minimized = !this.minimized;
    this.dispatchEvent(
      new CustomEvent("loomi-minimize", {
        detail: { minimized: this.minimized },
        bubbles: true,
        composed: true,
      }),
    );
  };

  /** Toggles the fill-the-viewport state; turns off `minimized` first if it was on. */
  private toggleMaximize = (): void => {
    if (this.minimized) this.minimized = false;
    this.maximized = !this.maximized;
    this.dispatchEvent(
      new CustomEvent("loomi-maximize", {
        detail: { maximized: this.maximized },
        bubbles: true,
        composed: true,
      }),
    );
  };

  private onHeaderDoubleClick = (): void => {
    if (!this.maximize) return;
    this.toggleMaximize();
  };

  private onHeaderPointerDown = (e: PointerEvent): void => {
    if (this.dragHandle && !(e.currentTarget as HTMLElement).classList.contains("loomi-grip"))
      return;
    if (this.noDrag || this.maximized || e.button !== 0) return;
    if ((e.target as HTMLElement | null)?.closest(".loomi-header-btn")) return;
    e.preventDefault();
    const header = e.currentTarget as HTMLElement;
    header.setPointerCapture(e.pointerId);

    const start = this.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    this.classList.add("is-dragging");

    const onMove = (moveEvent: PointerEvent): void => {
      let top = start.top + (moveEvent.clientY - startY);
      let left = start.left + (moveEvent.clientX - startX);
      if (this.bounded) {
        top = clamp(top, 0, Math.max(0, window.innerHeight - start.height));
        left = clamp(left, 0, Math.max(0, window.innerWidth - start.width));
      }
      this.rect = { top, left, width: start.width, height: start.height };
      this.syncPosition();
    };
    const onUp = (): void => {
      header.removeEventListener("pointermove", onMove);
      header.removeEventListener("pointerup", onUp);
      header.removeEventListener("pointercancel", onUp);
      this.classList.remove("is-dragging");
      this.persistRect();
      if (this.rect) {
        this.dispatchEvent(
          new CustomEvent("loomi-drag", {
            detail: { top: this.rect.top, left: this.rect.left },
            bubbles: true,
            composed: true,
          }),
        );
      }
    };
    header.addEventListener("pointermove", onMove);
    header.addEventListener("pointerup", onUp);
    header.addEventListener("pointercancel", onUp);
  };

  private onHeaderKeyDown = (e: KeyboardEvent): void => {
    if (this.dragHandle && !(e.currentTarget as HTMLElement).classList.contains("loomi-grip"))
      return;
    if (this.noDrag || this.maximized) return;
    const step = e.shiftKey ? 10 : 1;
    let dx = 0;
    let dy = 0;
    switch (e.key) {
      case "ArrowLeft":
        dx = -step;
        break;
      case "ArrowRight":
        dx = step;
        break;
      case "ArrowUp":
        dy = -step;
        break;
      case "ArrowDown":
        dy = step;
        break;
      default:
        return;
    }
    e.preventDefault();
    const start = this.getBoundingClientRect();
    let top = start.top + dy;
    let left = start.left + dx;
    if (this.bounded) {
      top = clamp(top, 0, Math.max(0, window.innerHeight - start.height));
      left = clamp(left, 0, Math.max(0, window.innerWidth - start.width));
    }
    this.rect = { top, left, width: start.width, height: start.height };
    this.syncPosition();
    this.persistRect();
    this.dispatchEvent(
      new CustomEvent("loomi-drag", { detail: { top, left }, bubbles: true, composed: true }),
    );
  };

  /** Resizes from `start` by pointer/keyboard delta `(dx, dy)`, re-anchoring the edge opposite the drag direction so it doesn't move once width/height clamp. */
  private computeResizedRect(dir: ResizeDir, start: Rect, dx: number, dy: number): Rect {
    let { top, left, width, height } = start;
    if (dir.includes("e")) width = start.width + dx;
    if (dir.includes("w")) {
      width = start.width - dx;
    }
    if (dir.includes("s")) height = start.height + dy;
    if (dir.includes("n")) {
      height = start.height - dy;
    }

    width = clamp(width, this.minWidth, this.maxWidth);
    height = clamp(height, this.minHeight, this.maxHeight);
    if (dir.includes("w")) left = start.left + start.width - width;
    if (dir.includes("n")) top = start.top + start.height - height;

    if (this.bounded) {
      left = clamp(left, 0, Math.max(0, window.innerWidth - width));
      top = clamp(top, 0, Math.max(0, window.innerHeight - height));
      width = Math.min(width, window.innerWidth - left);
      height = Math.min(height, window.innerHeight - top);
    }
    return { top, left, width, height };
  }

  private onResizePointerDown = (dir: ResizeDir, e: PointerEvent): void => {
    if (!this.resizable || this.maximized || this.minimized || e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    const handle = e.currentTarget as HTMLElement;
    handle.setPointerCapture(e.pointerId);

    const rect = this.getBoundingClientRect();
    const start: Rect = { top: rect.top, left: rect.left, width: rect.width, height: rect.height };
    const startX = e.clientX;
    const startY = e.clientY;
    this.classList.add("is-resizing");

    const onMove = (moveEvent: PointerEvent): void => {
      this.rect = this.computeResizedRect(
        dir,
        start,
        moveEvent.clientX - startX,
        moveEvent.clientY - startY,
      );
      this.syncPosition();
    };
    const onUp = (): void => {
      handle.removeEventListener("pointermove", onMove);
      handle.removeEventListener("pointerup", onUp);
      handle.removeEventListener("pointercancel", onUp);
      this.classList.remove("is-resizing");
      this.persistRect();
      if (this.rect) {
        this.dispatchEvent(
          new CustomEvent("loomi-resize", {
            detail: { ...this.rect },
            bubbles: true,
            composed: true,
          }),
        );
      }
    };
    handle.addEventListener("pointermove", onMove);
    handle.addEventListener("pointerup", onUp);
    handle.addEventListener("pointercancel", onUp);
  };

  private onResizeKeyDown = (dir: ResizeDir, e: KeyboardEvent): void => {
    if (this.maximized || this.minimized) return;
    const step = e.shiftKey ? 10 : 1;
    let dx = 0;
    let dy = 0;
    switch (e.key) {
      case "ArrowLeft":
        dx = -step;
        break;
      case "ArrowRight":
        dx = step;
        break;
      case "ArrowUp":
        dy = -step;
        break;
      case "ArrowDown":
        dy = step;
        break;
      default:
        return;
    }
    e.preventDefault();
    const rect = this.getBoundingClientRect();
    const start: Rect = { top: rect.top, left: rect.left, width: rect.width, height: rect.height };
    this.rect = this.computeResizedRect(dir, start, dx, dy);
    this.syncPosition();
    this.persistRect();
    this.dispatchEvent(
      new CustomEvent("loomi-resize", { detail: { ...this.rect }, bubbles: true, composed: true }),
    );
  };

  override render(): TemplateResult | typeof nothing {
    if (!this.open) return nothing;
    const moveLabel = loomiT("floatingPanel.move", {}, this.locale);
    const resizeLabel = loomiT("floatingPanel.resize", {}, this.locale);
    const minimizeLabel = loomiT(
      this.minimized ? "floatingPanel.restore" : "floatingPanel.minimize",
      {},
      this.locale,
    );
    const maximizeLabel = loomiT(
      this.maximized ? "floatingPanel.restore" : "floatingPanel.maximize",
      {},
      this.locale,
    );
    const grabLabel = this.title ? `${this.title} — ${moveLabel}` : moveLabel;

    return html`
      <div
        class="loomi-header ${this.dragHandle ? "has-grip" : ""}"
        tabindex=${this.dragHandle ? nothing : "0"}
        aria-label=${this.dragHandle ? nothing : grabLabel}
        @pointerdown=${this.onHeaderPointerDown}
        @keydown=${this.onHeaderKeyDown}
        @dblclick=${this.onHeaderDoubleClick}
      >
        ${
          this.dragHandle
            ? html`<span
              class="loomi-grip"
              tabindex="0"
              role="button"
              aria-label=${grabLabel}
              @pointerdown=${this.onHeaderPointerDown}
              @keydown=${this.onHeaderKeyDown}
              >${GRIP}</span
            >`
            : nothing
        }
        <div class="loomi-title">${this.title}</div>
        <div class="loomi-header-actions">
          ${
            this.minimize
              ? html`<button
                class="loomi-header-btn loomi-minimize"
                aria-label=${minimizeLabel}
                @click=${this.toggleMinimize}
              >
                <loomi-icon name=${this.minimized ? "chevron-up" : "minus"} size="1.05rem" stroke-width="2"></loomi-icon>
              </button>`
              : nothing
          }
          ${
            this.maximize
              ? html`<button
                class="loomi-header-btn loomi-maximize"
                aria-label=${maximizeLabel}
                @click=${this.toggleMaximize}
              >
                <loomi-icon
                  name=${this.maximized ? "arrows-pointing-in" : "arrows-pointing-out"}
                  size="0.95rem"
                  stroke-width="2"
                ></loomi-icon>
              </button>`
              : nothing
          }
          ${
            this.showCloseIcon
              ? html`<button
                class="loomi-header-btn loomi-close"
                aria-label=${loomiT("common.close", {}, this.locale)}
                @click=${() => this.hide()}
              >
                <loomi-icon name="x-mark" size="1.05rem" stroke-width="2"></loomi-icon>
              </button>`
              : nothing
          }
        </div>
      </div>
      <div class="loomi-body"><slot></slot></div>
      ${
        this.resizable
          ? RESIZE_DIRS.map(
              (dir) => html`
              <div
                class="loomi-resize dir-${dir}"
                tabindex="0"
                role="separator"
                aria-orientation=${EDGE_DIRS.has(dir) ? (dir === "n" || dir === "s" ? "horizontal" : "vertical") : nothing}
                aria-label=${resizeLabel}
                @pointerdown=${(e: PointerEvent) => this.onResizePointerDown(dir, e)}
                @keydown=${(e: KeyboardEvent) => this.onResizeKeyDown(dir, e)}
              ></div>
            `,
            )
          : nothing
      }
    `;
  }
}

export interface LoomiFloatingPanelMinimizeDetail {
  minimized: boolean;
}

export interface LoomiFloatingPanelMaximizeDetail {
  maximized: boolean;
}

export interface LoomiFloatingPanelDragDetail {
  top: number;
  left: number;
}

export interface LoomiFloatingPanelResizeDetail {
  top: number;
  left: number;
  width: number;
  height: number;
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-floating-panel": LoomiFloatingPanel;
  }

  interface HTMLElementEventMap {
    "loomi-minimize": CustomEvent<LoomiFloatingPanelMinimizeDetail>;
    "loomi-maximize": CustomEvent<LoomiFloatingPanelMaximizeDetail>;
    "loomi-drag": CustomEvent<LoomiFloatingPanelDragDetail>;
    "loomi-resize": CustomEvent<LoomiFloatingPanelResizeDetail>;
  }
}
