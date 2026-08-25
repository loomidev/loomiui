import { html, nothing, svg, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { LoomiElement, loomiStyles } from "@loomidev/core";
import { componentStyles } from "./generated/styles.css.js";

export type ResizableOrientation = "horizontal" | "vertical";

export interface ResizableLayoutDetail {
  /** Panel sizes as percentages, in DOM order. */
  sizes: number[];
  /** Map of `panel-id` to size percentage when ids are provided. */
  layout: Record<string, number>;
}

const GRIP = svg`<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="9" cy="5" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="9" cy="19" r="1.5"/><circle cx="15" cy="5" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="15" cy="19" r="1.5"/></svg>`;

const RESIZABLE_ROLE = "data-resizable";

export function parsePercent(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  const text = String(value).trim();
  if (text.endsWith("%")) {
    const parsed = parseFloat(text);
    return Number.isFinite(parsed) ? parsed : null;
  }
  const parsed = parseFloat(text);
  return Number.isFinite(parsed) ? parsed : null;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function getDirectLayoutChildren(
  parent: Element,
): Array<LoomiResizablePanel | LoomiResizableHandle> {
  return Array.from(parent.children).filter(
    (child): child is LoomiResizablePanel | LoomiResizableHandle =>
      child instanceof LoomiResizablePanel || child instanceof LoomiResizableHandle,
  );
}

export function findResizablePanelGroup(el: Element | null): LoomiResizablePanelGroup | null {
  // The group's constructor is looked up through the registry rather than
  // referenced directly.
  //
  // `@customElement` registers each element as its class is evaluated, so
  // `<loomi-resizable-panel>` upgrades — and runs this from `connectedCallback`
  // — while `LoomiResizablePanelGroup`, declared later in this module, is still
  // in its temporal dead zone. Naming it here threw `ReferenceError: Cannot
  // access 'LoomiResizablePanelGroup' before initialization` on every load.
  //
  // `customElements.get` simply returns `undefined` until the group is defined,
  // so an early panel gets `null` and its optional call short-circuits; the
  // group syncs the layout itself once it upgrades a moment later. Keeping
  // `instanceof` against the registered constructor still excludes elements
  // that merely have the right tag but have not been upgraded yet.
  const groupConstructor = customElements.get("loomi-resizable-panel-group");
  if (!groupConstructor) return null;

  let node: Element | null = el;
  while (node) {
    if (node instanceof groupConstructor) return node as LoomiResizablePanelGroup;
    node = node.parentElement;
  }
  return null;
}

/**
 * `<loomi-resizable-panel>` — a resizable region inside `<loomi-resizable-panel-group>`.
 *
 * @slot - Panel content.
 */
@customElement("loomi-resizable-panel")
export class LoomiResizablePanel extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  /** Stable id used in `loomi-layout-change` payloads and `auto-save-id` persistence. */
  @property({ attribute: "panel-id" }) panelId = "";
  /** Initial size percentage (`50` or `50%`). */
  @property({ attribute: "default-size" }) defaultSize: string | number = "";
  /** Minimum size percentage. */
  @property({ type: Number, attribute: "min-size" }) minSize = 0;
  /** Maximum size percentage. */
  @property({ type: Number, attribute: "max-size" }) maxSize = 100;
  /** Allow collapsing via double-click on the adjacent handle. */
  @property({ type: Boolean }) collapsible = false;
  /** Size percentage when collapsed. */
  @property({ type: Number, attribute: "collapsed-size" }) collapsedSize = 0;
  /** Whether the panel is collapsed. */
  @property({ type: Boolean, reflect: true }) collapsed = false;

  /** Current size percentage managed by the parent group. */
  @state() size = 0;
  /** Size before collapsing, restored on expand. */
  @state() preCollapseSize = 0;

  override connectedCallback(): void {
    this.setAttribute(RESIZABLE_ROLE, "panel");
    super.connectedCallback();
    findResizablePanelGroup(this)?.requestLayoutSync();
  }

  override disconnectedCallback(): void {
    findResizablePanelGroup(this)?.requestLayoutSync();
    super.disconnectedCallback();
  }

  get effectiveSize(): number {
    return this.collapsed ? this.collapsedSize : this.size;
  }

  get effectiveMinSize(): number {
    return this.collapsed ? this.collapsedSize : this.minSize;
  }

  get effectiveMaxSize(): number {
    return this.collapsed ? this.collapsedSize : this.maxSize;
  }

  collapse(): void {
    if (!this.collapsible || this.collapsed) return;
    this.preCollapseSize = this.size;
    this.collapsed = true;
    findResizablePanelGroup(this)?.applyLayout();
  }

  expand(): void {
    if (!this.collapsed) return;
    this.collapsed = false;
    if (this.preCollapseSize > 0) this.size = this.preCollapseSize;
    findResizablePanelGroup(this)?.applyLayout();
  }

  toggleCollapsed(): void {
    if (this.collapsed) this.expand();
    else this.collapse();
  }

  override render(): TemplateResult {
    return html`<div class="loomi-panel"><slot></slot></div>`;
  }
}

/**
 * `<loomi-resizable-handle>` — draggable separator between two panels.
 */
@customElement("loomi-resizable-handle")
export class LoomiResizableHandle extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  /** Render a visible grip icon in the handle. */
  @property({ type: Boolean, attribute: "with-handle" }) withHandle = false;
  /** Disable resizing for this handle. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  override connectedCallback(): void {
    this.setAttribute(RESIZABLE_ROLE, "handle");
    super.connectedCallback();
    this.syncOrientation();
    findResizablePanelGroup(this)?.registerHandle(this);
  }

  override disconnectedCallback(): void {
    findResizablePanelGroup(this)?.unregisterHandle(this);
    super.disconnectedCallback();
  }

  override updated(changed: Map<string, unknown>): void {
    if (changed.has("withHandle")) this.syncOrientation();
  }

  syncOrientation(): void {
    const group = findResizablePanelGroup(this);
    const orientation = group?.orientation ?? "horizontal";
    this.dataset.orientation = orientation;
    this.setAttribute("aria-orientation", orientation === "horizontal" ? "vertical" : "horizontal");
    this.setAttribute("role", "separator");
    // A focusable separator is a window splitter, and ARIA requires a current value on
    // it. Panels are sized in percentages, so the handle reports how much of the group
    // the panel before it occupies. applyLayout() re-runs this for every registered
    // handle, so the value stays current through drags and programmatic layout changes.
    this.setAttribute("aria-valuenow", String(Math.round(this.valuePercent(group))));
    this.setAttribute("aria-valuemin", "0");
    this.setAttribute("aria-valuemax", "100");
    this.setAttribute("tabindex", this.disabled ? "-1" : "0");
  }

  /**
   * Size, in percent of the group, of the panel immediately before this handle — the
   * value a window splitter reports. Falls back to 50 for a handle that is not between
   * two panels yet (or at all), which keeps `aria-valuenow` present and in range rather
   * than emitting an invalid value.
   */
  private valuePercent(group: LoomiResizablePanelGroup | null): number {
    if (!group) return 50;
    const indexes = this.getAdjacentPanelIndexes(group);
    if (!indexes) return 50;
    return group.panels[indexes[0]]?.effectiveSize ?? 50;
  }

  getAdjacentPanelIndexes(group: LoomiResizablePanelGroup): [number, number] | null {
    const children = getDirectLayoutChildren(group);
    const index = children.indexOf(this);
    if (index <= 0) return null;
    const prev = children[index - 1];
    if (!(prev instanceof LoomiResizablePanel)) return null;
    const panels = group.panels;
    const leftIndex = panels.indexOf(prev);
    const right = children[index + 1];
    if (!(right instanceof LoomiResizablePanel)) return null;
    const rightIndex = panels.indexOf(right);
    if (leftIndex < 0 || rightIndex < 0) return null;
    return [leftIndex, rightIndex];
  }

  private onPointerDown = (event: PointerEvent): void => {
    if (this.disabled || event.button !== 0) return;
    const group = findResizablePanelGroup(this);
    const indexes = group ? this.getAdjacentPanelIndexes(group) : null;
    if (!group || !indexes) return;

    event.preventDefault();
    const handle = event.currentTarget as HTMLElement;
    handle.setPointerCapture(event.pointerId);

    const orientation = group.orientation;
    const startPos = orientation === "horizontal" ? event.clientX : event.clientY;
    const [leftIndex, rightIndex] = indexes;
    const startLeft = group.panels[leftIndex]?.effectiveSize ?? 0;
    const startRight = group.panels[rightIndex]?.effectiveSize ?? 0;

    const onMove = (moveEvent: PointerEvent): void => {
      const current = orientation === "horizontal" ? moveEvent.clientX : moveEvent.clientY;
      const rect = group.getLayoutRect();
      const total = orientation === "horizontal" ? rect.width : rect.height;
      if (total <= 0) return;
      const deltaPercent = ((current - startPos) / total) * 100;
      group.resizeAdjacentPanels(leftIndex, rightIndex, deltaPercent, startLeft, startRight);
    };

    const onUp = (): void => {
      handle.removeEventListener("pointermove", onMove);
      handle.removeEventListener("pointerup", onUp);
      handle.removeEventListener("pointercancel", onUp);
      group.emitLayoutChange();
      group.saveLayout();
    };

    handle.addEventListener("pointermove", onMove);
    handle.addEventListener("pointerup", onUp);
    handle.addEventListener("pointercancel", onUp);
  };

  private onDoubleClick = (): void => {
    const group = findResizablePanelGroup(this);
    const indexes = group ? this.getAdjacentPanelIndexes(group) : null;
    if (!group || !indexes) return;
    const [leftIndex, rightIndex] = indexes;
    const left = group.panels[leftIndex];
    const right = group.panels[rightIndex];
    if (left?.collapsible) left.toggleCollapsed();
    else if (right?.collapsible) right.toggleCollapsed();
    group.applyLayout();
    group.emitLayoutChange();
    group.saveLayout();
  };

  private onKeyDown = (event: KeyboardEvent): void => {
    if (this.disabled) return;
    const group = findResizablePanelGroup(this);
    const indexes = group ? this.getAdjacentPanelIndexes(group) : null;
    if (!group || !indexes) return;

    const horizontal = group.orientation === "horizontal";
    const step = event.shiftKey ? 10 : 1;
    let delta = 0;
    switch (event.key) {
      case "ArrowLeft":
        delta = horizontal ? -step : 0;
        break;
      case "ArrowRight":
        delta = horizontal ? step : 0;
        break;
      case "ArrowUp":
        delta = horizontal ? 0 : -step;
        break;
      case "ArrowDown":
        delta = horizontal ? 0 : step;
        break;
      case "Home":
        delta = -100;
        break;
      case "End":
        delta = 100;
        break;
      default:
        return;
    }
    if (delta === 0) return;
    event.preventDefault();
    const [leftIndex, rightIndex] = indexes;
    const left = group.panels[leftIndex];
    const right = group.panels[rightIndex];
    if (!left || !right) return;
    group.resizeAdjacentPanels(
      leftIndex,
      rightIndex,
      delta,
      left.effectiveSize,
      right.effectiveSize,
    );
    group.emitLayoutChange();
    group.saveLayout();
  };

  override render(): TemplateResult {
    return html`
      <div
        class="loomi-handle"
        @pointerdown=${this.onPointerDown}
        @dblclick=${this.onDoubleClick}
        @keydown=${this.onKeyDown}
      >
        ${this.withHandle ? html`<span class="loomi-grip">${GRIP}</span>` : nothing}
      </div>
    `;
  }
}

/**
 * `<loomi-resizable-panel-group>` — lays out resizable panels and handles.
 *
 * @slot - `<loomi-resizable-panel>` and `<loomi-resizable-handle>` children in order.
 * @fires loomi-layout-change - `detail: { sizes, layout }` when panel sizes change.
 */
@customElement("loomi-resizable-panel-group")
export class LoomiResizablePanelGroup extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property({ reflect: true }) orientation: ResizableOrientation = "horizontal";
  /** Persist layout in `localStorage` under this key. */
  @property({ attribute: "auto-save-id" }) autoSaveId = "";

  private layoutSyncQueued = false;
  private registeredHandles = new Set<LoomiResizableHandle>();

  override connectedCallback(): void {
    this.setAttribute(RESIZABLE_ROLE, "group");
    super.connectedCallback();
  }

  get panels(): LoomiResizablePanel[] {
    return getDirectLayoutChildren(this).filter(
      (child): child is LoomiResizablePanel => child instanceof LoomiResizablePanel,
    );
  }

  get handles(): LoomiResizableHandle[] {
    return getDirectLayoutChildren(this).filter(
      (child): child is LoomiResizableHandle => child instanceof LoomiResizableHandle,
    );
  }

  registerHandle(handle: LoomiResizableHandle): void {
    this.registeredHandles.add(handle);
    handle.syncOrientation();
  }

  unregisterHandle(handle: LoomiResizableHandle): void {
    this.registeredHandles.delete(handle);
  }

  requestLayoutSync(): void {
    if (this.layoutSyncQueued) return;
    this.layoutSyncQueued = true;
    queueMicrotask(() => {
      this.layoutSyncQueued = false;
      this.initializeSizes();
      this.applyLayout();
    });
  }

  getLayoutRect(): DOMRect {
    const inner = this.renderRoot.querySelector(".loomi-group") ?? this;
    return inner.getBoundingClientRect();
  }

  private initializeSizes(): void {
    const panels = this.panels;
    if (panels.length === 0) return;

    const specified = panels.map((panel) => parsePercent(panel.defaultSize));
    const hasSpecified = specified.some((value) => value !== null);
    let sizes: number[];

    if (hasSpecified) {
      sizes = specified.map((value) => value ?? 0);
      const total = sizes.reduce((sum, value) => sum + value, 0);
      if (total <= 0) {
        sizes = panels.map(() => 100 / panels.length);
      } else if (Math.abs(total - 100) > 0.01) {
        sizes = sizes.map((value) => (value / total) * 100);
      }
    } else {
      sizes = panels.map(() => 100 / panels.length);
    }

    this.loadSavedLayout(sizes);

    panels.forEach((panel, index) => {
      if (panel.size <= 0) panel.size = sizes[index] ?? 0;
    });
  }

  private loadSavedLayout(fallback: number[]): void {
    if (!this.autoSaveId || typeof localStorage === "undefined") return;
    try {
      const raw = localStorage.getItem(`loomi-resizable:${this.autoSaveId}`);
      if (!raw) return;
      const layout = JSON.parse(raw) as Record<string, number>;
      for (const panel of this.panels) {
        if (panel.panelId && layout[panel.panelId] != null) {
          panel.size = layout[panel.panelId]!;
        }
      }
    } catch {
      // Ignore invalid persisted layout and fall back to defaults.
    }

    for (const panel of this.panels) {
      if (panel.size <= 0) {
        const index = this.panels.indexOf(panel);
        panel.size = fallback[index] ?? 0;
      }
    }
  }

  saveLayout(): void {
    if (!this.autoSaveId || typeof localStorage === "undefined") return;
    localStorage.setItem(`loomi-resizable:${this.autoSaveId}`, JSON.stringify(this.getLayoutMap()));
  }

  getLayoutMap(): Record<string, number> {
    const layout: Record<string, number> = {};
    for (const panel of this.panels) {
      if (panel.panelId) layout[panel.panelId] = panel.effectiveSize;
    }
    return layout;
  }

  applyLayout(): void {
    const panels = this.panels;
    if (panels.length === 0) return;

    const total = panels.reduce((sum, panel) => sum + panel.effectiveSize, 0);
    const scale = total > 0 ? 100 / total : 1;

    for (const panel of panels) {
      const size = panel.effectiveSize * scale;
      panel.style.flex = `0 0 ${size}%`;
      panel.style.overflow = "hidden";
      panel.style.minWidth = "0";
      panel.style.minHeight = "0";
      if (this.orientation === "horizontal") {
        panel.style.height = "100%";
        panel.style.width = "";
      } else {
        panel.style.width = "100%";
        panel.style.height = "";
      }
    }

    for (const handle of this.registeredHandles) {
      handle.syncOrientation();
    }
  }

  resizeAdjacentPanels(
    leftIndex: number,
    rightIndex: number,
    deltaPercent: number,
    startLeft?: number,
    startRight?: number,
  ): void {
    const left = this.panels[leftIndex];
    const right = this.panels[rightIndex];
    if (!left || !right) return;

    const baseLeft = startLeft ?? left.effectiveSize;
    const baseRight = startRight ?? right.effectiveSize;

    if (left.collapsed && deltaPercent > 0) left.expand();
    if (right.collapsed && deltaPercent < 0) right.expand();

    let delta = deltaPercent;
    delta = Math.max(delta, left.effectiveMinSize - baseLeft);
    delta = Math.min(delta, left.effectiveMaxSize - baseLeft);
    delta = Math.max(delta, baseRight - right.effectiveMaxSize);
    delta = Math.min(delta, baseRight - right.effectiveMinSize);

    left.size = clamp(baseLeft + delta, left.effectiveMinSize, left.effectiveMaxSize);
    right.size = clamp(baseRight - delta, right.effectiveMinSize, right.effectiveMaxSize);
    this.applyLayout();
  }

  emitLayoutChange(): void {
    const sizes = this.panels.map((panel) => panel.effectiveSize);
    const detail: ResizableLayoutDetail = { sizes, layout: this.getLayoutMap() };
    this.dispatchEvent(
      new CustomEvent<ResizableLayoutDetail>("loomi-layout-change", {
        bubbles: true,
        composed: true,
        detail,
      }),
    );
  }

  override firstUpdated(): void {
    this.initializeSizes();
    this.applyLayout();
  }

  private onSlotChange = (): void => {
    this.requestLayoutSync();
  };

  override render(): TemplateResult {
    return html`<div class="loomi-group"><slot @slotchange=${this.onSlotChange}></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-resizable-panel-group": LoomiResizablePanelGroup;
    "loomi-resizable-panel": LoomiResizablePanel;
    "loomi-resizable-handle": LoomiResizableHandle;
  }

  interface HTMLElementEventMap {
    "loomi-layout-change": CustomEvent<ResizableLayoutDetail>;
  }
}
