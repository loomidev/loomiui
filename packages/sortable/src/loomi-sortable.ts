import { html, nothing, svg, type TemplateResult, isServer } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { LoomiElement, loomiStyles, loomiT } from "@loomidev/core";
import { hasLoomiIcon, loomiIcon, provideLoomiIcons } from "@loomidev/icons";
import bars3Icon from "@loomidev/icons/heroicons/outline/bars-3.js";
import lockClosedIcon from "@loomidev/icons/heroicons/outline/lock-closed.js";
import { componentStyles } from "./generated/styles.css.js";

// This component's own icons ship inline so they render on first paint; any other
// `icon` name loads on demand.
provideLoomiIcons({ "bars-3": bars3Icon, "lock-closed": lockClosedIcon });

export interface LoomiSortableItem {
  id: string;
  label: string;
  /** Optional secondary line rendered beneath the label (plain text, no markup). */
  meta?: string;
  /** Initials shown in a trailing `<loomi-avatar>` when `avatarImage` is unset. */
  avatarLabel?: string;
  /** Image URL for a trailing `<loomi-avatar>`. */
  avatarImage?: string;
  /** Additional classes applied to the rendered row, useful with selector filters. */
  className?: string;
  /** Excluded from dragging, equivalent to SortableJS's selector-based `filter`. */
  filtered?: boolean;
  /** Excluded from dragging. */
  locked?: boolean;
}

export interface LoomiSortableGroup {
  name: string;
  pull?: boolean | "clone" | string | string[];
  put?: boolean | string | string[];
}

export type LoomiSortableGroupOption = string | LoomiSortableGroup;

const GRIP_D =
  "M9 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 19a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM17 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM17 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM17 19a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z";
const GRIP = svg`<path d=${GRIP_D} fill="currentColor" />`;

/** Elements inside a light-DOM row that must keep their own click/focus/selection behaviour
 * instead of starting a drag (when the list has no dedicated handle). */
const INTERACTIVE =
  'button, a, input, select, textarea, [contenteditable]:not([contenteditable="false"])';

// Module-level because a drag-and-drop gesture can span two <loomi-sortable>
// elements, and both lists need to agree on what is currently being dragged.
let activeDrag: { source: LoomiSortable; items: LoomiSortableItem[] } | null = null;

/**
 * `<loomi-sortable>` — a SortableJS-inspired drag-and-drop list. Provide rows via
 * the `items` array (`{ id, label, meta?, locked?, filtered?, className? }`). Give
 * two or more lists the same non-empty `group` to let users drag items between them.
 *
 * **Custom row content.** Instead of `items`, put your own markup in the light DOM:
 * `<loomi-sortable><div data-id="12">…</div>…</loomi-sortable>`. Direct children with a
 * `data-id` become rows; they stay in the light DOM (page CSS and third-party renderers
 * still reach them) and the component adds drag behaviour, an optional handle and
 * keyboard support around them. Reordering is shown with CSS `order` rather than by
 * moving nodes, so treat `loomi-reorder` as the source of truth and re-render. Light rows
 * support same-list reordering only (no groups, multi-drag or swap).
 *
 * Form-associated: when `name` is set, the host submits the current order (JSON array
 * of ids) like a native form control.
 *
 * @fires loomi-reorder - `detail: { order }` after reordering within the same list.
 * @fires loomi-transfer - `detail: { order, items }` on BOTH lists involved, after item(s)
 *   move from one list to another.
 * @fires loomi-item-click - `detail: { item }` when a row is clicked outside multi-drag mode.
 * @fires loomi-filter - `detail: { item }` when a filtered row is clicked or drag-started.
 */
@customElement("loomi-sortable")
export class LoomiSortable extends LoomiElement {
  static override styles = loomiStyles(componentStyles);
  static formAssociated = true;

  private internals = this.attachInternals();
  private rowRects = new Map<string, DOMRect>();
  private initialItems: LoomiSortableItem[] = [];

  @property({ type: Array }) items: LoomiSortableItem[] = [];
  /** Form-control name; when set, the host submits the order as a JSON array of ids. */
  @property({ reflect: true }) name = "";
  /** Kept for backwards compatibility; setting a non-empty `group` is enough to share lists. */
  @property() type: "simple" | "shared" = "simple";
  /** SortableJS-style group name or object (`{ name, pull, put }`) for shared lists. */
  @property() group: LoomiSortableGroupOption = "";
  /** Leave dragged item(s) in place when dropped into another shared list. Alias for `group.pull = "clone"`. */
  @property({ type: Boolean }) clone = false;
  /** Enable or disable drag-starting from this list. The list still accepts incoming transfers when `false`. */
  @property({ type: Boolean }) sortable = true;
  @property() locale = "";
  /** Enable or disable sorting within this list. Items may still be dragged out when `false`. */
  @property({ type: Boolean }) sort = true;
  /** SortableJS-style selector for rows/elements that cannot be dragged, e.g. `.filtered`. */
  @property() filter = "";
  /** SortableJS-style handle selector. Any non-empty value enables the built-in row handle. */
  @property() handle = "";
  /** Drag by a dedicated handle instead of the whole row surface. */
  @property({ type: Boolean, attribute: "has-handle" }) hasHandle = false;
  /** Icon name (from `@loomidev/icons`) used for the drag handle when handle mode is enabled. */
  @property({ attribute: "handle-icon" }) handleIcon = "bars-3";
  /** Backwards-compatible multi-drag flag. */
  @property({ type: Boolean }) multidrag = false;
  /** SortableJS-style camelCase multi-drag flag, exposed as the `multi-drag` attribute. */
  @property({ type: Boolean, attribute: "multi-drag" }) multiDrag = false;
  /** Extra class applied to selected rows in multi-drag mode. */
  @property({ attribute: "selected-class" }) selectedClass = "selected";
  /** Swap the dropped row with the row it lands on instead of shifting rows in between. */
  @property({ type: Boolean }) swap = false;
  /** Extra class applied to the hovered row in swap mode. */
  @property({ attribute: "swap-class" }) swapClass = "highlight";
  /** Reorder animation duration in ms. `0` disables the animation. */
  @property({ type: Number }) animation = 150;

  @state() private dragIndex: number | null = null;
  @state() private overIndex: number | null = null;
  @state() private dragOverContainer = false;
  @state() private selectedIds = new Set<string>();
  @state() private hasLightRows = false;
  @state() private announcement = "";

  private rowOrder: string[] | null = null;
  private pressTarget: Element | null = null;
  private lightDragId: string | null = null;
  private keyboardDrag: { id: string; origin: string[] } | null = null;
  private touchDrag: {
    id: string;
    handle: HTMLElement;
    startX: number;
    startY: number;
    active: boolean;
    overId: string | null;
  } | null = null;

  constructor() {
    super();
    this.addEventListener("dragstart", (e) => this.onLightDragStart(e));
    this.addEventListener("dragover", (e) => this.onLightDragOver(e));
    this.addEventListener("drop", (e) => this.onLightDrop(e));
    this.addEventListener("dragend", () => this.clearLightDrag());
    this.addEventListener("pointerdown", (e) => this.onLightPointerDown(e));
    this.addEventListener("keydown", (e) => this.onLightKeydown(e));
    this.addEventListener("focusin", (e) => this.onLightFocus(e, true));
    this.addEventListener("focusout", (e) => this.onLightFocus(e, false));
  }

  /** Current order of ids. */
  get order(): string[] {
    return [...this.items.map((i) => i.id), ...this.currentLightIds()];
  }

  override connectedCallback(): void {
    if (!this.hasUpdated) this.initialItems = [...this.items];
    super.connectedCallback();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.stopTouchDrag();
  }

  formResetCallback(): void {
    this.items = [...this.initialItems];
    this.selectedIds = new Set();
    this.endDrag();
    this.clearLightDrag();
    this.syncLightRows(true);
  }

  override firstUpdated(): void {
    this.syncLightRows(false);
  }

  override willUpdate(changed: Map<string, unknown>): void {
    this.internals.setFormValue(this.name ? JSON.stringify(this.order) : null);
    if (changed.has("items")) this.captureRects();
  }

  override updated(changed: Map<string, unknown>): void {
    if (changed.has("items")) this.playFlip();
    if (
      changed.has("hasHandle") ||
      changed.has("handle") ||
      changed.has("sortable") ||
      changed.has("locale")
    ) {
      this.syncLightRows(false);
    }
  }

  private captureRects(): void {
    // Measuring requires a live layout, which the server has no equivalent of.
    if (isServer) return;
    this.rowRects.clear();
    this.renderRoot.querySelectorAll<HTMLElement>(".loomi-row").forEach((el) => {
      const id = el.dataset.id;
      if (id) this.rowRects.set(id, el.getBoundingClientRect());
    });
  }

  private playFlip(): void {
    if (this.animation <= 0) return;
    this.renderRoot.querySelectorAll<HTMLElement>(".loomi-row").forEach((el) => {
      const id = el.dataset.id;
      const prev = id ? this.rowRects.get(id) : undefined;
      if (!prev) return;
      const next = el.getBoundingClientRect();
      const dx = prev.left - next.left;
      const dy = prev.top - next.top;
      if (!dx && !dy) return;
      el.style.transition = "none";
      el.style.transform = `translate(${dx}px, ${dy}px)`;
      requestAnimationFrame(() => {
        el.style.transition = `transform ${this.animation}ms ease`;
        el.style.transform = "";
      });
    });
  }

  private get isMultiDrag(): boolean {
    return this.multidrag || this.multiDrag;
  }

  private get handleMode(): boolean {
    return this.hasHandle || this.handle.trim() !== "";
  }

  private get normalizedGroup(): LoomiSortableGroup {
    if (!this.group) return { name: "" };
    return typeof this.group === "string" ? { name: this.group } : this.group;
  }

  private groupName(): string {
    return this.normalizedGroup.name?.trim() ?? "";
  }

  private optionAllows(
    option: boolean | "clone" | string | string[] | undefined,
    peerGroup: string,
    sameGroup: boolean,
  ): boolean {
    if (option === undefined) return sameGroup;
    if (option === true || option === "clone") return true;
    if (option === false) return false;
    if (Array.isArray(option)) return option.includes(peerGroup);
    return option === peerGroup;
  }

  private canPullTo(target: LoomiSortable): boolean {
    const sourceGroup = this.groupName();
    const targetGroup = target.groupName();
    if (!sourceGroup || !targetGroup) return false;
    return this.optionAllows(this.normalizedGroup.pull, targetGroup, sourceGroup === targetGroup);
  }

  private canPutFrom(source: LoomiSortable): boolean {
    const targetGroup = this.groupName();
    const sourceGroup = source.groupName();
    if (!targetGroup || !sourceGroup) return false;
    return this.optionAllows(this.normalizedGroup.put, sourceGroup, targetGroup === sourceGroup);
  }

  private shouldCloneTransfer(): boolean {
    return this.clone || this.normalizedGroup.pull === "clone";
  }

  private acceptsTransferFrom(other: LoomiSortable): boolean {
    return other !== this && other.canPullTo(this) && this.canPutFrom(other);
  }

  private rowClasses(
    item: LoomiSortableItem,
    i: number,
    locked: boolean,
    filtered: boolean,
  ): string {
    const classes = ["loomi-row"];
    if (this.dragIndex === i) classes.push("dragging");
    if (this.overIndex === i) {
      classes.push("over");
      if (this.swap && this.swapClass) classes.push(this.swapClass);
    }
    if (this.selectedIds.has(item.id)) {
      classes.push("selected");
      if (this.selectedClass && this.selectedClass !== "selected") classes.push(this.selectedClass);
    }
    if (locked) classes.push("locked");
    if (filtered) classes.push("filtered");
    if (item.className) classes.push(...item.className.split(/\s+/).filter(Boolean));
    return classes.join(" ");
  }

  private itemFilteredByData(item: LoomiSortableItem): boolean {
    if (item.filtered) return true;
    if (this.filter.trim() === ".filtered") {
      return item.className?.split(/\s+/).includes("filtered") ?? false;
    }
    return false;
  }

  private rowMatchesFilter(row: HTMLElement): boolean {
    const selector = this.filter.trim();
    if (!selector) return false;
    try {
      return row.matches(selector) || !!row.querySelector(selector);
    } catch {
      return false;
    }
  }

  private emitFilter(item: LoomiSortableItem): void {
    this.dispatchEvent(
      new CustomEvent("loomi-filter", { bubbles: true, composed: true, detail: { item } }),
    );
  }

  private onRowClick(item: LoomiSortableItem, e: MouseEvent): void {
    const row = e.currentTarget as HTMLElement;
    if (item.locked || this.itemFilteredByData(item) || this.rowMatchesFilter(row)) {
      this.emitFilter(item);
      return;
    }
    if (this.isMultiDrag) {
      e.preventDefault();
      const next = new Set(this.selectedIds);
      if (next.has(item.id)) next.delete(item.id);
      else next.add(item.id);
      this.selectedIds = next;
      return;
    }
    this.dispatchEvent(
      new CustomEvent("loomi-item-click", { bubbles: true, composed: true, detail: { item } }),
    );
  }

  private onDragStart(i: number, e: DragEvent): void {
    const item = this.items[i];
    const row = e.currentTarget as HTMLElement;
    if (this.handleMode && !(e.target as Element | null)?.closest(".loomi-handle")) {
      e.preventDefault();
      return;
    }
    if (item.locked || this.itemFilteredByData(item) || this.rowMatchesFilter(row)) {
      e.preventDefault();
      this.emitFilter(item);
      return;
    }
    if (!this.sortable) {
      e.preventDefault();
      return;
    }
    const dragged =
      this.isMultiDrag && this.selectedIds.has(item.id) && this.selectedIds.size > 1
        ? this.items.filter((it) => this.selectedIds.has(it.id))
        : [item];
    this.dragIndex = i;
    activeDrag = { source: this, items: dragged };
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = this.shouldCloneTransfer() ? "copyMove" : "move";
      e.dataTransfer.setData("text/plain", dragged.map((it) => it.id).join(","));
    }
  }

  private onDragOver(i: number, e: DragEvent): void {
    if (!activeDrag) return;
    if (activeDrag.source !== this && !this.acceptsTransferFrom(activeDrag.source)) return;
    e.preventDefault();
    this.overIndex = i;
  }

  private onContainerDragOver(e: DragEvent): void {
    if (!activeDrag) return;
    if (activeDrag.source !== this && !this.acceptsTransferFrom(activeDrag.source)) return;
    e.preventDefault();
    this.dragOverContainer = true;
  }

  private endDrag(): void {
    this.dragIndex = this.overIndex = null;
    this.dragOverContainer = false;
    activeDrag = null;
  }

  private reorderWithin(index: number): void {
    if (!activeDrag) return;
    const before = this.order.join("\u0000");
    const dragged = activeDrag.items;
    const draggedIds = new Set(dragged.map((it) => it.id));
    const target = this.items[index];
    if (!this.sort || this.dragIndex === null || (target && draggedIds.has(target.id))) {
      this.endDrag();
      return;
    }
    if (this.swap && target && dragged.length === 1) {
      const from = this.items.findIndex((it) => it.id === dragged[0].id);
      if (from !== -1) {
        const next = [...this.items];
        [next[from], next[index]] = [next[index], next[from]];
        this.items = next;
      }
    } else {
      const targetId = target?.id;
      const remaining = this.items.filter((it) => !draggedIds.has(it.id));
      const targetIdx = targetId
        ? remaining.findIndex((it) => it.id === targetId)
        : remaining.length;
      remaining.splice(targetIdx === -1 ? remaining.length : targetIdx, 0, ...dragged);
      this.items = remaining;
    }
    this.selectedIds = new Set();
    this.endDrag();
    if (this.order.join("\u0000") !== before) {
      this.dispatchEvent(
        new CustomEvent("loomi-reorder", {
          bubbles: true,
          composed: true,
          detail: { order: this.order },
        }),
      );
    }
  }

  private onDrop(i: number): void {
    if (!activeDrag) return;
    if (activeDrag.source === this) {
      this.reorderWithin(i);
      return;
    }
    this.acceptTransfer(i);
  }

  private onContainerDrop(): void {
    if (!activeDrag) {
      this.endDrag();
      return;
    }
    if (activeDrag.source === this) {
      this.reorderWithin(this.items.length);
      return;
    }
    this.acceptTransfer(this.items.length);
  }

  private acceptTransfer(index: number): void {
    if (!activeDrag) return;
    const { source, items: dragged } = activeDrag;
    if (!this.acceptsTransferFrom(source)) {
      this.endDrag();
      return;
    }
    if (!source.shouldCloneTransfer()) {
      const draggedIds = new Set(dragged.map((it) => it.id));
      source.items = source.items.filter((it) => !draggedIds.has(it.id));
    }
    const incoming = source.shouldCloneTransfer() ? dragged.map((it) => ({ ...it })) : dragged;
    const next = [...this.items];
    next.splice(index, 0, ...incoming);
    this.items = next;
    this.selectedIds = new Set();
    source.selectedIds = new Set();
    source.dragIndex = source.overIndex = null;
    source.dragOverContainer = false;
    this.endDrag();
    source.dispatchEvent(
      new CustomEvent("loomi-transfer", {
        bubbles: true,
        composed: true,
        detail: { order: source.order, items: dragged },
      }),
    );
    this.dispatchEvent(
      new CustomEvent("loomi-transfer", {
        bubbles: true,
        composed: true,
        detail: { order: this.order, items: incoming },
      }),
    );
  }

  // ── Light-DOM rows ─────────────────────────────────────────────────────────
  // Rows are the host's direct children with a `data-id`. They are never moved in the
  // DOM: the visual order is a CSS `order` per row, so a framework that owns those nodes
  // keeps a consistent tree and `loomi-reorder` stays the source of truth. Any change to
  // the host's children (an app re-render) resets the visual order to the DOM order.

  private domRows(): HTMLElement[] {
    if (isServer) return [];
    return Array.from(this.children).filter(
      (el): el is HTMLElement => el instanceof HTMLElement && el.hasAttribute("data-id"),
    );
  }

  private currentLightIds(): string[] {
    const domIds = this.domRows().map((r) => r.dataset.id!);
    if (!this.rowOrder) return domIds;
    const known = this.rowOrder.filter((id) => domIds.includes(id));
    return [...known, ...domIds.filter((id) => !known.includes(id))];
  }

  private lightRowOf(e: Event): HTMLElement | null {
    const t = e.target;
    if (!(t instanceof Element) || t === this || t.closest("loomi-sortable") !== this) return null;
    let node: Element = t;
    while (node.parentElement && node.parentElement !== this) node = node.parentElement;
    return node.parentElement === this && node.hasAttribute("data-id")
      ? (node as HTMLElement)
      : null;
  }

  private rowLocked(row: HTMLElement): boolean {
    return !this.sortable || row.hasAttribute("data-locked");
  }

  private handleFor(row: HTMLElement): HTMLElement | null {
    const custom = this.handle.trim();
    const selector = custom && custom !== ".loomi-handle" ? custom : "[data-handle]";
    try {
      return (
        row.querySelector<HTMLElement>(selector) ??
        row.querySelector<HTMLElement>(":scope > [data-loomi-injected]")
      );
    } catch {
      return row.querySelector<HTMLElement>(":scope > [data-loomi-injected]");
    }
  }

  private rowLabel(row: HTMLElement): string {
    return (
      row.dataset.label ||
      row.getAttribute("aria-label") ||
      (row.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 60) ||
      row.dataset.id ||
      ""
    );
  }

  /** Prepares light rows: handles, draggability and the empty-state flag. */
  private syncLightRows(resetOrder: boolean): void {
    if (isServer) return;
    const rows = this.domRows();
    if (resetOrder) {
      this.rowOrder = null;
      rows.forEach((r) => r.style.removeProperty("order"));
    }
    for (const row of rows) {
      const locked = this.rowLocked(row);
      if (this.handleMode) {
        const handle = this.ensureHandle(row, locked);
        row.draggable = false;
        handle.draggable = !locked;
        handle.tabIndex = locked ? -1 : 0;
      } else {
        row.querySelectorAll(":scope > [data-loomi-injected]").forEach((h) => h.remove());
        row.draggable = !locked;
      }
    }
    if (this.hasLightRows !== rows.length > 0) this.hasLightRows = rows.length > 0;
  }

  private ensureHandle(row: HTMLElement, locked: boolean): HTMLElement {
    let handle = this.handleFor(row);
    if (!handle) {
      handle = document.createElement("span");
      handle.dataset.handle = "true";
      handle.dataset.loomiInjected = "true";
      handle.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false"><path d="${GRIP_D}" fill="currentColor"/></svg>`;
      Object.assign(handle.style, {
        display: "inline-flex",
        flex: "none",
        alignItems: "center",
        alignSelf: "center",
        marginInlineEnd: "0.5rem",
        borderRadius: "0.25rem",
        color: "var(--loomi-text-faint, currentColor)",
        verticalAlign: "middle",
      });
      row.prepend(handle);
    }
    if (!handle.style.touchAction) handle.style.touchAction = "none";
    handle.style.cursor = locked ? "not-allowed" : "grab";
    if (!handle.hasAttribute("role") && handle.tagName !== "BUTTON") {
      handle.setAttribute("role", "button");
    }
    if (!handle.hasAttribute("aria-label")) {
      handle.setAttribute("aria-label", loomiT("sortable.reorderHandle", {}, this.locale));
    }
    return handle;
  }

  private onSlotChange(): void {
    this.syncLightRows(true);
  }

  private reflowFrom(before: Map<HTMLElement, DOMRect> | null): void {
    if (!before) return;
    for (const [el, prev] of before) {
      const next = el.getBoundingClientRect();
      const dx = prev.left - next.left;
      const dy = prev.top - next.top;
      if (!dx && !dy) continue;
      el.style.transition = "none";
      el.style.transform = `translate(${dx}px, ${dy}px)`;
      requestAnimationFrame(() => {
        el.style.transition = `transform ${this.animation}ms ease`;
        el.style.transform = "";
        setTimeout(() => el.style.removeProperty("transition"), this.animation + 50);
      });
    }
  }

  private applyLightOrder(ids: string[]): void {
    const rows = this.domRows();
    const before =
      this.animation > 0 ? new Map(rows.map((r) => [r, r.getBoundingClientRect()])) : null;
    this.rowOrder = ids;
    rows.forEach((r) => r.style.setProperty("order", String(ids.indexOf(r.dataset.id!))));
    this.reflowFrom(before);
    this.requestUpdate(); // refreshes the form value
  }

  private emitReorder(): void {
    this.dispatchEvent(
      new CustomEvent("loomi-reorder", {
        bubbles: true,
        composed: true,
        detail: { order: this.order },
      }),
    );
  }

  /** Moves a light row to `toIndex` in the visual order. Returns whether anything changed. */
  private moveLightRow(id: string, toIndex: number): boolean {
    if (!this.sort) return false;
    const ids = this.currentLightIds();
    const from = ids.indexOf(id);
    if (from === -1) return false;
    const to = Math.max(0, Math.min(ids.length - 1, toIndex));
    if (from === to) return false;
    ids.splice(from, 1);
    ids.splice(to, 0, id);
    this.applyLightOrder(ids);
    return true;
  }

  private markLight(id: string | null, attr: "dragging" | "over"): void {
    const name = `data-loomi-${attr}`;
    for (const row of this.domRows()) {
      if (id !== null && row.dataset.id === id) row.setAttribute(name, "");
      else row.removeAttribute(name);
    }
  }

  private clearLightDrag(): void {
    this.lightDragId = null;
    this.markLight(null, "dragging");
    this.markLight(null, "over");
  }

  private isInteractiveWithin(row: HTMLElement, el: Element | null): boolean {
    const hit = el?.closest(INTERACTIVE);
    return !!hit && hit !== row && row.contains(hit);
  }

  private onLightDragStart(e: DragEvent): void {
    const row = this.lightRowOf(e);
    if (!row) return;
    const target = e.target as Element;
    const refuse = (): void => e.preventDefault();
    if (this.rowLocked(row) || this.rowMatchesFilter(row)) return refuse();
    if (this.handleMode) {
      const handle = this.handleFor(row);
      if (!handle || !handle.contains(target)) return refuse();
    } else if (
      this.isInteractiveWithin(row, target) ||
      this.isInteractiveWithin(row, this.pressTarget)
    ) {
      return refuse();
    }
    const id = row.dataset.id!;
    this.lightDragId = id;
    row.setAttribute("data-loomi-dragging", "");
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", id);
      const rect = row.getBoundingClientRect();
      e.dataTransfer.setDragImage?.(row, e.clientX - rect.left, e.clientY - rect.top);
    }
  }

  private onLightDragOver(e: DragEvent): void {
    if (this.lightDragId === null) return;
    e.preventDefault();
    const row = this.lightRowOf(e);
    this.markLight(row?.dataset.id ?? null, "over");
  }

  private onLightDrop(e: DragEvent): void {
    const id = this.lightDragId;
    if (id === null) return;
    e.preventDefault();
    const row = this.lightRowOf(e);
    const ids = this.currentLightIds();
    const to = row ? ids.indexOf(row.dataset.id!) : ids.length - 1;
    this.clearLightDrag();
    if (this.moveLightRow(id, to)) this.emitReorder();
  }

  private onLightPointerDown(e: PointerEvent): void {
    this.pressTarget = e.target instanceof Element ? e.target : null;
    const row = this.lightRowOf(e);
    if (!row || this.rowLocked(row)) return;
    if (!this.handleMode) {
      // A press on a button/link/input must not turn into a native drag of the row.
      if (this.isInteractiveWithin(row, this.pressTarget)) {
        row.draggable = false;
        const restore = (): void => {
          row.draggable = !this.rowLocked(row);
          document.removeEventListener("pointerup", restore, true);
          document.removeEventListener("pointercancel", restore, true);
        };
        document.addEventListener("pointerup", restore, true);
        document.addEventListener("pointercancel", restore, true);
      }
      return;
    }
    // Touch has no reliable native drag-and-drop, so the handle drives its own pointer drag.
    const handle = this.handleFor(row);
    if (e.pointerType !== "touch" || !handle || !handle.contains(e.target as Node)) return;
    this.touchDrag = {
      id: row.dataset.id!,
      handle,
      startX: e.clientX,
      startY: e.clientY,
      active: false,
      overId: null,
    };
    handle.draggable = false;
    document.addEventListener("pointermove", this.onTouchMove);
    document.addEventListener("pointerup", this.onTouchEnd);
    document.addEventListener("pointercancel", this.onTouchEnd);
  }

  private onTouchMove = (e: PointerEvent): void => {
    const drag = this.touchDrag;
    if (!drag) return;
    if (!drag.active) {
      if (Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) < 4) return;
      drag.active = true;
      this.markLight(drag.id, "dragging");
    }
    e.preventDefault();
    const root = this.getRootNode() as Document | ShadowRoot;
    const hit = root.elementFromPoint(e.clientX, e.clientY);
    let node: Element | null = hit;
    while (node && node.parentElement !== this) node = node.parentElement;
    drag.overId = node?.hasAttribute("data-id") ? (node as HTMLElement).dataset.id! : null;
    this.markLight(drag.overId, "over");
  };

  private onTouchEnd = (e: PointerEvent): void => {
    const drag = this.touchDrag;
    this.stopTouchDrag();
    if (!drag?.active) return;
    const dropped = e.type === "pointerup" && drag.overId !== null;
    this.clearLightDrag();
    if (dropped && this.moveLightRow(drag.id, this.currentLightIds().indexOf(drag.overId!))) {
      this.emitReorder();
    }
  };

  private stopTouchDrag(): void {
    const drag = this.touchDrag;
    this.touchDrag = null;
    document.removeEventListener("pointermove", this.onTouchMove);
    document.removeEventListener("pointerup", this.onTouchEnd);
    document.removeEventListener("pointercancel", this.onTouchEnd);
    if (drag)
      drag.handle.draggable = !this.rowLocked(drag.handle.closest("[data-id]") as HTMLElement);
  }

  private announceMove(key: string, id: string, row: HTMLElement): void {
    const ids = this.currentLightIds();
    this.announcement = loomiT(
      key,
      { label: this.rowLabel(row), position: ids.indexOf(id) + 1, total: ids.length },
      this.locale,
    );
  }

  private onLightKeydown(e: KeyboardEvent): void {
    const row = this.lightRowOf(e);
    if (!row || !this.handleMode || !this.sort || this.rowLocked(row)) return;
    const handle = this.handleFor(row);
    if (!handle || !handle.contains(e.target as Node)) return;
    const id = row.dataset.id!;
    const kb = this.keyboardDrag?.id === id ? this.keyboardDrag : null;

    if (e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      if (kb) {
        this.keyboardDrag = null;
        this.markLight(null, "dragging");
        this.announceMove("sortable.dropped", id, row);
        if (this.currentLightIds().join("\0") !== kb.origin.join("\0")) this.emitReorder();
      } else {
        this.keyboardDrag = { id, origin: this.currentLightIds() };
        this.markLight(id, "dragging");
        this.announceMove("sortable.pickedUp", id, row);
      }
      return;
    }
    if (e.key === "Escape" && kb) {
      e.preventDefault();
      this.keyboardDrag = null;
      this.markLight(null, "dragging");
      this.applyLightOrder(kb.origin);
      this.announceMove("sortable.cancelled", id, row);
      return;
    }
    if ((e.key === "ArrowUp" || e.key === "ArrowDown") && (kb || e.altKey)) {
      e.preventDefault();
      const delta = e.key === "ArrowUp" ? -1 : 1;
      const moved = this.moveLightRow(id, this.currentLightIds().indexOf(id) + delta);
      if (moved) {
        row.scrollIntoView?.({ block: "nearest" });
        this.announceMove("sortable.moved", id, row);
        if (!kb) this.emitReorder();
      }
    }
  }

  private onLightFocus(e: FocusEvent, focused: boolean): void {
    const t = e.target;
    if (!(t instanceof HTMLElement) || !t.hasAttribute("data-loomi-injected")) return;
    if (focused) {
      if (t.matches(":focus-visible")) {
        t.style.outline = "2px solid var(--loomi-focus-ring-color, currentColor)";
        t.style.outlineOffset = "2px";
      }
      return;
    }
    t.style.removeProperty("outline");
    t.style.removeProperty("outline-offset");
    if (this.keyboardDrag) {
      // Leaving the handle mid-pickup abandons the move.
      const { origin } = this.keyboardDrag;
      this.keyboardDrag = null;
      this.markLight(null, "dragging");
      this.applyLightOrder(origin);
    }
  }

  override render(): TemplateResult {
    const handleSvg = hasLoomiIcon(this.handleIcon) ? loomiIcon(this.handleIcon) : GRIP;
    return html`<div
      class="loomi-sortable ${this.dragOverContainer ? "drag-over" : ""} ${this.handleMode ? "handle-mode" : ""}"
      @dragover=${(e: DragEvent) => this.onContainerDragOver(e)}
      @dragleave=${() => {
        this.dragOverContainer = false;
      }}
      @drop=${(e: DragEvent) => {
        e.preventDefault();
        this.onContainerDrop();
      }}
    >
      ${this.items.map((item, i) => {
        const filtered = this.itemFilteredByData(item);
        const locked = !!item.locked || !this.sortable || filtered;
        const rowDraggable = !this.handleMode && !locked;
        const handleDraggable = this.handleMode && !locked;
        return html`<div
          class=${this.rowClasses(item, i, locked, filtered)}
          data-id=${item.id}
          data-filtered=${filtered ? "true" : nothing}
          draggable=${rowDraggable}
          @dragstart=${(e: DragEvent) => this.onDragStart(i, e)}
          @dragover=${(e: DragEvent) => this.onDragOver(i, e)}
          @drop=${(e: DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            this.onDrop(i);
          }}
          @dragend=${() => this.endDrag()}
          @click=${(e: MouseEvent) => this.onRowClick(item, e)}
        >
          ${
            this.handleMode
              ? html`<span class="loomi-handle" draggable=${handleDraggable} data-handle="true"
                ><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  ${handleSvg}
                </svg></span
              >`
              : nothing
          }
          <span class="loomi-text">
            <span class="loomi-label">${item.label}</span>
            ${item.meta ? html`<span class="loomi-meta">${item.meta}</span>` : nothing}
          </span>
          ${
            item.avatarLabel || item.avatarImage
              ? html`<span class="loomi-avatar-slot"
                ><loomi-avatar
                  size="tiny"
                  label=${item.avatarLabel ?? ""}
                  image=${item.avatarImage ?? ""}
                ></loomi-avatar
              ></span>`
              : nothing
          }
          ${
            item.locked || filtered
              ? html`<svg class="loomi-lock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                ${loomiIcon("lock-closed")}
              </svg>`
              : nothing
          }
        </div>`;
      })}
      <slot @slotchange=${() => this.onSlotChange()}></slot>
      ${this.items.length === 0 && !this.hasLightRows ? html`<div class="loomi-empty-hint">${loomiT("sortable.dropHere", {}, this.locale)}</div>` : nothing}
      <div class="loomi-live" role="status" aria-live="assertive" aria-atomic="true">${this.announcement}</div>
    </div>`;
  }
}

export interface LoomiSortableItemDetail {
  item: LoomiSortableItem;
}

export interface LoomiSortableReorderDetail {
  order: string[];
}

export interface LoomiSortableTransferDetail {
  order: string[];
  items: LoomiSortableItem[];
}

/** Event map for `<loomi-sortable>`. These names are dispatched by several loomi
 * components with different detail shapes, so they are typed per package instead of
 * globally on `HTMLElementEventMap`. */
export interface LoomiSortableEventMap {
  "loomi-reorder": CustomEvent<LoomiSortableReorderDetail>;
  "loomi-filter": CustomEvent<LoomiSortableItemDetail>;
  "loomi-item-click": CustomEvent<LoomiSortableItemDetail>;
  "loomi-transfer": CustomEvent<LoomiSortableTransferDetail>;
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-sortable": LoomiSortable;
  }

  interface HTMLElementEventMap {
    "loomi-filter": CustomEvent<LoomiSortableItemDetail>;
    "loomi-item-click": CustomEvent<LoomiSortableItemDetail>;
    "loomi-reorder": CustomEvent<LoomiSortableReorderDetail>;
    "loomi-transfer": CustomEvent<LoomiSortableTransferDetail>;
  }
}
