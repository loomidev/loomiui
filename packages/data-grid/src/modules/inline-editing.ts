import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { defineGridModule, type GridModule } from "../grid-module.js";
import { formatCellValue, getRowMeta } from "../grid-utils.js";
import type { DataGridRecord } from "../types.js";

export interface InlineEditingModuleOptions {
  /** How editing starts on a cell whose column has `editable: true`. Defaults to `"both"`. */
  trigger?: "dblclick" | "enter" | "both";
}

/**
 * Lets users edit cells whose column declares `editable: true`. Start
 * editing by double-clicking a cell (or pressing Enter while it's focused),
 * commit with Enter/blur, cancel with Escape. Edits flow through
 * `grid.updateCellValue(...)`, which mutates `grid.data` and emits
 * `loomi-cell-edit`.
 *
 * ```ts
 * grid.columns = [{ key: "name", label: "Name", editable: true }, ...];
 * grid.modules = [inlineEditingModule()];
 * ```
 */
export function inlineEditingModule<TRecord extends DataGridRecord = DataGridRecord>(
  options: InlineEditingModuleOptions = {},
): GridModule<TRecord> {
  const trigger = options.trigger ?? "both";
  let editing: { rowKey: string; columnKey: string } | null = null;

  function isEditingCell(rowKey: string, columnKey: string): boolean {
    return editing?.rowKey === rowKey && editing.columnKey === columnKey;
  }

  return defineGridModule<TRecord>({
    name: "inline-editing",

    renderCell(value, cell, ctx) {
      if (!cell.column.editable || getRowMeta(cell.row)) {
        return undefined;
      }

      const rowKeyValue = ctx.getRowKey(cell.row);
      if (!isEditingCell(rowKeyValue, cell.column.key)) {
        return undefined;
      }

      const commit = (inputValue: string) => {
        editing = null;
        ctx.grid.updateCellValue(rowKeyValue, cell.column.key, inputValue);
        ctx.requestUpdate();
      };
      const cancel = () => {
        editing = null;
        ctx.requestUpdate();
      };

      return html`
        <input
          type="text"
          .value=${formatCellValue(value)}
          ${ref((el) => {
            if (!(el instanceof HTMLInputElement)) {
              return;
            }
            // Focused from a microtask, not from this callback.
            //
            // Lit runs `ref` while it builds the fragment, *before* inserting it
            // into the grid's shadow root, so the input is still disconnected
            // here and `focus()` is silently a no-op — which is why
            // double-clicking a cell used to open an editor nobody could type
            // into. A microtask runs after the commit, when the element is in
            // the document. `requestAnimationFrame` would also work but is
            // suspended while the page is hidden, so this stays a microtask.
            queueMicrotask(() => {
              if (!el.isConnected) {
                return;
              }
              const root = el.getRootNode() as Document | ShadowRoot;
              if (root.activeElement === el) {
                return;
              }
              el.focus();
              el.select();
            });
          })}
          @click=${(event: Event) => event.stopPropagation()}
          @keydown=${(event: KeyboardEvent) => {
            event.stopPropagation();
            if (event.key === "Enter") {
              commit((event.target as HTMLInputElement).value);
            } else if (event.key === "Escape") {
              cancel();
            }
          }}
          @blur=${(event: Event) => commit((event.target as HTMLInputElement).value)}
        />
      `;
    },

    getCellClass(cell, ctx) {
      return isEditingCell(ctx.getRowKey(cell.row), cell.column.key)
        ? "loomi-grid-cell-editing"
        : undefined;
    },

    onCellDblClick(cell, _event, ctx) {
      if (trigger === "enter" || !cell.column.editable || getRowMeta(cell.row)) {
        return;
      }
      editing = { rowKey: ctx.getRowKey(cell.row), columnKey: cell.column.key };
      ctx.requestUpdate();
    },

    onCellKeydown(event, cell, ctx) {
      if (
        trigger === "dblclick" ||
        event.key !== "Enter" ||
        !cell.column.editable ||
        getRowMeta(cell.row)
      ) {
        return false;
      }
      if (editing) {
        return false;
      }
      editing = { rowKey: ctx.getRowKey(cell.row), columnKey: cell.column.key };
      ctx.requestUpdate();
      return true;
    },
  });
}
