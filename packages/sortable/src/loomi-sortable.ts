import { LitElement, html, nothing, svg, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { loomiStyles } from "@loomi/core";
import { getLoomiIcon } from "@loomi/icons";
import { componentStyles } from "./generated/styles.css.js";

export interface LoomiSortableItem {
  id: string;
  label: string;
  /** Optional secondary line rendered beneath the label (plain text, no markup). */
  meta?: string;
  /** Excluded from dragging — equivalent to BladewindUI's class-based `filter`. */
  locked?: boolean;
}

const GRIP = svg`<path d="M9 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 19a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM17 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM17 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM17 19a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" fill="currentColor" />`;

// Module-level — not per-instance — because a drag-and-drop gesture spans two
// different <loomi-sortable> elements (the one it started in, the one it's dropped
// on), and both need to agree on what's being dragged. Lives for the duration of one
// browser drag gesture only; cleared on drop or dragend. `items` is plural so a
// multidrag selection can move together as one gesture.
let activeDrag: { source: LoomiSortable; items: LoomiSortableItem[] } | null = null;

/**
 * `<loomi-sortable>` — a drag-and-drop reorderable list. Provide rows via the `items`
 * array (`{ id, label, meta?, locked? }`). Give two or more `type="shared"` lists the
 * same `group` to let users drag items between them — e.g. a Kanban board's
 * "To Do" / "In Progress" / "Done" columns.
 *
 * Form-associated: when `name` is set, the host submits the current order (JSON array
 * of ids) like a native form control.
 *
 * @fires reorder - `detail: { order }` after reordering within the same list.
 * @fires transfer - `detail: { order, items }` on BOTH lists involved, after item(s)
 *   move from one list to another (fired once on the list that lost them, once on the
 *   list that gained them — each with that list's own resulting `order`).
 * @fires item-click - `detail: { item }` when a row is clicked (not dragged) — native
 *   drag-and-drop suppresses the click event after an actual drag, so this only fires
 *   for genuine clicks.
 */
@customElement("loomi-sortable")
export class LoomiSortable extends LitElement {
  static override styles = loomiStyles(componentStyles);
  static formAssociated = true;

  private internals = this.attachInternals();
  private rowRects = new Map<string, DOMRect>();

  @property({ type: Array }) items: LoomiSortableItem[] = [];
  /** Form-control name; when set, the host submits the order as a JSON array of ids. */
  @property({ reflect: true }) name = "";
  /** `simple` lists only sort within themselves. `shared` lists exchange items with others in the same `group`. */
  @property() type: "simple" | "shared" = "simple";
  /** Group name used by `shared` lists to find each other. Ignored for `simple` lists. */
  @property() group = "";
  /** Leave the dragged item(s) in place when dropped into another (shared) list instead of moving them. */
  @property({ type: Boolean }) clone = false;
  /** Enable or disable dragging within (and out of) this list. The list still accepts incoming transfers when `false`. */
  @property({ type: Boolean }) sortable = true;
  /** Drag by a dedicated handle instead of the whole row surface. */
  @property({ type: Boolean, attribute: "has-handle" }) hasHandle = false;
  /** Icon name (from `@loomi/icons`) used for the drag handle when `has-handle` is set. */
  @property({ attribute: "handle-icon" }) handleIcon = "bars-3";
  /** Ctrl/Cmd + click to select multiple rows, then drag them together as a group. */
  @property({ type: Boolean }) multidrag = false;
  /** Swap the dropped row with the row it lands on instead of shifting rows in between. Ignored when `multidrag` selects more than one row. */
  @property({ type: Boolean }) swap = false;
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

  // FLIP animation: capture each row's position before the reorder (First), let Lit
  // re-render into the new order (Last), then animate from old to new position.
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

  private acceptsTransferFrom(other: LoomiSortable): boolean {
    return (
      other !== this &&
      this.type === "shared" &&
      other.type === "shared" &&
      !!this.group &&
      this.group === other.group
    );
  }

  private onRowClick(item: LoomiSortableItem, e: MouseEvent): void {
    if (this.multidrag && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      const next = new Set(this.selectedIds);
      if (next.has(item.id)) next.delete(item.id);
      else next.add(item.id);
      this.selectedIds = next;
      return;
    }
    if (this.multidrag && this.selectedIds.size > 0) this.selectedIds = new Set();
    this.dispatchEvent(new CustomEvent("item-click", { bubbles: true, composed: true, detail: { item } }));
  }

  private onDragStart(i: number): void {
    const item = this.items[i];
    if (item.locked || !this.sortable) return;
    const dragged =
      this.multidrag && this.selectedIds.has(item.id) && this.selectedIds.size > 1
        ? this.items.filter((it) => this.selectedIds.has(it.id))
        : [item];
    this.dragIndex = i;
    activeDrag = { source: this, items: dragged };
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

  private onDrop(i: number): void {
    if (!activeDrag) return;
    if (activeDrag.source === this) {
      const dragged = activeDrag.items;
      const draggedIds = new Set(dragged.map((it) => it.id));
      if (this.dragIndex === null || draggedIds.has(this.items[i].id)) {
        this.endDrag();
        return;
      }
      if (this.swap && !this.multidrag && dragged.length === 1) {
        const next = [...this.items];
        [next[this.dragIndex], next[i]] = [next[i], next[this.dragIndex]];
        this.items = next;
      } else {
        const targetId = this.items[i].id;
        const remaining = this.items.filter((it) => !draggedIds.has(it.id));
        const targetIdx = remaining.findIndex((it) => it.id === targetId);
        remaining.splice(targetIdx, 0, ...dragged);
        this.items = remaining;
      }
      this.selectedIds = new Set();
      this.endDrag();
      this.dispatchEvent(new CustomEvent("reorder", { bubbles: true, composed: true, detail: { order: this.order } }));
      return;
    }
    this.acceptTransfer(i);
  }

  private onContainerDrop(): void {
    if (!activeDrag || activeDrag.source === this) {
      this.endDrag();
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
    if (!source.clone) {
      const draggedIds = new Set(dragged.map((it) => it.id));
      source.items = source.items.filter((it) => !draggedIds.has(it.id));
    }
    const incoming = source.clone ? dragged.map((it) => ({ ...it })) : dragged;
    const next = [...this.items];
    next.splice(index, 0, ...incoming);
    this.items = next;
    this.selectedIds = new Set();
    this.endDrag();
    source.dispatchEvent(
      new CustomEvent("transfer", { bubbles: true, composed: true, detail: { order: source.order, items: dragged } }),
    );
    this.dispatchEvent(
      new CustomEvent("transfer", { bubbles: true, composed: true, detail: { order: this.order, items: incoming } }),
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
        const locked = !!item.locked || !this.sortable;
        const rowDraggable = !this.hasHandle && !locked;
        const handleDraggable = this.hasHandle && !locked;
        return html`<div
          class="loomi-row
            ${this.dragIndex === i ? "dragging" : ""}
            ${this.overIndex === i ? "over" : ""}
            ${this.selectedIds.has(item.id) ? "selected" : ""}
            ${locked ? "locked" : ""}"
          data-id=${item.id}
          draggable=${rowDraggable}
          @dragstart=${() => this.onDragStart(i)}
          @dragover=${(e: DragEvent) => this.onDragOver(i, e)}
          @drop=${(e: DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            this.onDrop(i);
          }}
          @dragend=${() => this.endDrag()}
          @click=${(e: MouseEvent) => this.onRowClick(item, e)}
        >
          ${this.hasHandle
            ? html`<span class="loomi-handle" draggable=${handleDraggable}
                ><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  ${handleSvg}
                </svg></span
              >`
            : nothing}
          <span class="loomi-text">
            <span class="loomi-label">${item.label}</span>
            ${item.meta ? html`<span class="loomi-meta">${item.meta}</span>` : nothing}
          </span>
          ${item.locked
            ? html`<svg class="loomi-lock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                ${getLoomiIcon("lock-closed")}
              </svg>`
            : nothing}
        </div>`;
      })}
      ${this.items.length === 0 ? html`<div class="loomi-empty-hint">Drop here</div>` : nothing}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-sortable": LoomiSortable;
  }
}
