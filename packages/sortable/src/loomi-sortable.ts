import { html, nothing, svg, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { LoomiElement, loomiStyles, loomiT } from "@loomidev/core";
import { getLoomiIcon } from "@loomidev/icons";
import { componentStyles } from "./generated/styles.css.js";

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

const GRIP = svg`<path d="M9 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 19a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM17 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM17 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM17 19a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" fill="currentColor" />`;

// Module-level because a drag-and-drop gesture can span two <loomi-sortable>
// elements, and both lists need to agree on what is currently being dragged.
let activeDrag: { source: LoomiSortable; items: LoomiSortableItem[] } | null = null;

/**
 * `<loomi-sortable>` — a SortableJS-inspired drag-and-drop list. Provide rows via
 * the `items` array (`{ id, label, meta?, locked?, filtered?, className? }`). Give
 * two or more lists the same non-empty `group` to let users drag items between them.
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

  /** Current order of ids. */
  get order(): string[] {
    return this.items.map((i) => i.id);
  }

  override willUpdate(changed: Map<string, unknown>): void {
    this.internals.setFormValue(this.name ? JSON.stringify(this.order) : null);
    if (changed.has("items")) this.captureRects();
  }

  override updated(changed: Map<string, unknown>): void {
    if (changed.has("items")) this.playFlip();
  }

  private captureRects(): void {
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

  private rowClasses(item: LoomiSortableItem, i: number, locked: boolean, filtered: boolean): string {
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
    this.dispatchEvent(new CustomEvent("loomi-filter", { bubbles: true, composed: true, detail: { item } }));
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
    this.dispatchEvent(new CustomEvent("loomi-item-click", { bubbles: true, composed: true, detail: { item } }));
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
      const targetIdx = targetId ? remaining.findIndex((it) => it.id === targetId) : remaining.length;
      remaining.splice(targetIdx === -1 ? remaining.length : targetIdx, 0, ...dragged);
      this.items = remaining;
    }
    this.selectedIds = new Set();
    this.endDrag();
    if (this.order.join("\u0000") !== before) {
      this.dispatchEvent(new CustomEvent("loomi-reorder", { bubbles: true, composed: true, detail: { order: this.order } }));
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
      new CustomEvent("loomi-transfer", { bubbles: true, composed: true, detail: { order: source.order, items: dragged } }),
    );
    this.dispatchEvent(
      new CustomEvent("loomi-transfer", { bubbles: true, composed: true, detail: { order: this.order, items: incoming } }),
    );
  }

  override render(): TemplateResult {
    const handleSvg = getLoomiIcon(this.handleIcon) ?? GRIP;
    return html`<div
      class="loomi-sortable ${this.dragOverContainer ? "drag-over" : ""}"
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
          ${this.handleMode
            ? html`<span class="loomi-handle" draggable=${handleDraggable} data-handle="true"
                ><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  ${handleSvg}
                </svg></span
              >`
            : nothing}
          <span class="loomi-text">
            <span class="loomi-label">${item.label}</span>
            ${item.meta ? html`<span class="loomi-meta">${item.meta}</span>` : nothing}
          </span>
          ${item.avatarLabel || item.avatarImage
            ? html`<span class="loomi-avatar-slot"
                ><loomi-avatar
                  size="tiny"
                  label=${item.avatarLabel ?? ""}
                  image=${item.avatarImage ?? ""}
                ></loomi-avatar
              ></span>`
            : nothing}
          ${item.locked || filtered
            ? html`<svg class="loomi-lock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                ${getLoomiIcon("lock-closed")}
              </svg>`
            : nothing}
        </div>`;
      })}
      ${this.items.length === 0 ? html`<div class="loomi-empty-hint">${loomiT("sortable.dropHere", {}, this.locale)}</div>` : nothing}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-sortable": LoomiSortable;
  }
}
