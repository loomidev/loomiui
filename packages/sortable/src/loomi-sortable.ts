import { LitElement, html, svg, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { loomiStyles } from "@loomi/core";
import { componentStyles } from "./generated/styles.css.js";

export interface LoomiSortableItem {
  id: string;
  label: string;
}

const GRIP = svg`<path d="M9 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 19a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM17 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM17 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM17 19a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" fill="currentColor" />`;

/**
 * `<loomi-sortable>` — a drag-and-drop reorderable list. Provide rows via the `items`
 * array (`{ id, label }`).
 *
 * @fires reorder - `detail: { order }` (array of ids) after a drop.
 */
@customElement("loomi-sortable")
export class LoomiSortable extends LitElement {
  static override styles = loomiStyles(componentStyles);

  @property({ type: Array }) items: LoomiSortableItem[] = [];

  @state() private dragIndex: number | null = null;
  @state() private overIndex: number | null = null;

  /** Current order of ids. */
  get order(): string[] {
    return this.items.map((i) => i.id);
  }

  private onDragStart(i: number): void {
    this.dragIndex = i;
  }
  private onDragOver(i: number, e: DragEvent): void {
    e.preventDefault();
    this.overIndex = i;
  }
  private onDrop(i: number): void {
    if (this.dragIndex === null || this.dragIndex === i) {
      this.dragIndex = this.overIndex = null;
      return;
    }
    const next = [...this.items];
    const [moved] = next.splice(this.dragIndex, 1);
    next.splice(i, 0, moved);
    this.items = next;
    this.dragIndex = this.overIndex = null;
    this.dispatchEvent(new CustomEvent("reorder", { bubbles: true, composed: true, detail: { order: this.order } }));
  }

  override render(): TemplateResult {
    return html`<div class="loomi-sortable">
      ${this.items.map(
        (item, i) => html`<div
          class="loomi-row ${this.dragIndex === i ? "dragging" : ""} ${this.overIndex === i ? "over" : ""}"
          draggable="true"
          @dragstart=${() => this.onDragStart(i)}
          @dragover=${(e: DragEvent) => this.onDragOver(i, e)}
          @drop=${() => this.onDrop(i)}
          @dragend=${() => { this.dragIndex = this.overIndex = null; }}
        >
          <span class="loomi-handle"><svg viewBox="0 0 24 24" aria-hidden="true">${GRIP}</svg></span>
          <span class="loomi-label">${item.label}</span>
        </div>`,
      )}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-sortable": LoomiSortable;
  }
}
