import { html, nothing } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { ref } from "lit/directives/ref.js";
import {
  defineGridModule,
  type GridCellCoordinates,
  type GridModule,
  type GridModuleContext,
} from "../grid-module.js";
import { formatCellValue, getRowMeta } from "../grid-utils.js";
import type { DataGridRecord } from "../types.js";

export interface InlineEditingModuleOptions {
  /** How editing starts on a cell whose column has `editable: true`. Defaults to `"both"`. */
  trigger?: "dblclick" | "enter" | "both";
  /**
   * `"on-demand"` (default) swaps a cell for an input while it's being edited.
   * `"always"` renders every editable cell's input permanently, spreadsheet-style:
   * Enter/ArrowDown move to the cell below, ArrowUp to the one above, Tab across,
   * and pasting several lines (or tab-separated cells) fills the cells below/right.
   * `trigger` has no effect in this mode.
   */
  mode?: "on-demand" | "always";
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
  const always = options.mode === "always";
  let editing: { rowKey: string; columnKey: string } | null = null;

  function isEditingCell(rowKey: string, columnKey: string): boolean {
    return editing?.rowKey === rowKey && editing.columnKey === columnKey;
  }

  function currentValue(
    rowKey: string,
    columnKey: string,
    grid: GridModuleContext<TRecord>["grid"],
  ) {
    const row = grid.data.find((candidate) => grid.getRowKey(candidate) === rowKey);
    return row ? formatCellValue((row as DataGridRecord)[columnKey]) : undefined;
  }

  /** Writes the input's text back to the grid, but only when it actually changed. */
  function commitIfChanged(
    input: HTMLInputElement,
    rowKey: string,
    columnKey: string,
    ctx: GridModuleContext<TRecord>,
  ): void {
    if (currentValue(rowKey, columnKey, ctx.grid) === input.value) {
      return;
    }
    ctx.grid.updateCellValue(rowKey, columnKey, input.value);
  }

  /** Spreads pasted multi-line / tab-separated text over the cells below and to the right. */
  function pasteBlock(
    text: string,
    cell: GridCellCoordinates<TRecord>,
    ctx: GridModuleContext<TRecord>,
  ): void {
    const lines = text.replace(/\r\n?/g, "\n").replace(/\n$/, "").split("\n");
    const rows = ctx.grid.getRenderedRows();
    // Resolve every target up front: each write re-renders, and a sorted/filtered
    // column could reorder rows underneath a half-finished paste.
    const writes: Array<{ rowKey: string; columnKey: string; value: string }> = [];
    lines.forEach((line, rowOffset) => {
      const target = rows[cell.rowIndex + rowOffset];
      if (!target || getRowMeta(target)) {
        return;
      }
      line.split("\t").forEach((value, columnOffset) => {
        const column = ctx.columns[cell.columnIndex + columnOffset];
        if (column?.editable) {
          writes.push({ rowKey: ctx.getRowKey(target), columnKey: column.key, value });
        }
      });
    });
    for (const write of writes) {
      ctx.grid.updateCellValue(write.rowKey, write.columnKey, write.value);
    }
  }

  function renderAlwaysInput(
    value: unknown,
    cell: GridCellCoordinates<TRecord>,
    rowKey: string,
    ctx: GridModuleContext<TRecord>,
  ) {
    const columnKey = cell.column.key;
    const move = (input: HTMLInputElement, rowDelta: number) => {
      commitIfChanged(input, rowKey, columnKey, ctx);
      void ctx.grid.focusCell(cell.rowIndex + rowDelta, columnKey);
    };

    const { column, row } = cell;
    const isInvalid = column.invalid?.(row) === true;
    const classes = [column.cellClass?.(row), isInvalid ? "is-invalid" : ""]
      .filter(Boolean)
      .join(" ");

    return html`
      <input
        part=${isInvalid ? "cell-input cell-input-invalid" : "cell-input"}
        type=${column.inputType ?? "text"}
        inputmode=${ifDefined(column.inputMode)}
        placeholder=${ifDefined(column.placeholder)}
        autocomplete=${ifDefined(column.autocomplete)}
        class=${classes || nothing}
        aria-invalid=${isInvalid ? "true" : nothing}
        aria-label=${cell.column.label ?? columnKey}
        .value=${formatCellValue(value)}
        @click=${(event: Event) => event.stopPropagation()}
        @change=${(event: Event) =>
          commitIfChanged(event.target as HTMLInputElement, rowKey, columnKey, ctx)}
        @paste=${(event: ClipboardEvent) => {
          const text = event.clipboardData?.getData("text") ?? "";
          if (!/[\n\t]/.test(text.replace(/\r?\n$/, ""))) {
            return;
          }
          event.preventDefault();
          pasteBlock(text, cell, ctx);
        }}
        @keydown=${(event: KeyboardEvent) => {
          // Everything typed in the box stays out of the grid's own arrow/Home/End/Space
          // navigation; the moves below are the only keys that leave the cell.
          event.stopPropagation();
          const input = event.target as HTMLInputElement;
          if (event.key === "Enter" || event.key === "ArrowDown") {
            event.preventDefault();
            move(input, 1);
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            move(input, -1);
          } else if (event.key === "Escape") {
            input.value = formatCellValue(value);
          }
        }}
      />
    `;
  }

  return defineGridModule<TRecord>({
    name: "inline-editing",

    renderCell(value, cell, ctx) {
      if (!cell.column.editable || getRowMeta(cell.row)) {
        return undefined;
      }

      const rowKeyValue = ctx.getRowKey(cell.row);
      if (always) {
        return renderAlwaysInput(value, cell, rowKeyValue, ctx);
      }
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
      if (always) {
        return cell.column.editable && !getRowMeta(cell.row) ? "loomi-grid-cell-always" : undefined;
      }
      return isEditingCell(ctx.getRowKey(cell.row), cell.column.key)
        ? "loomi-grid-cell-editing"
        : undefined;
    },

    onCellDblClick(cell, _event, ctx) {
      if (always) {
        return;
      }
      if (trigger === "enter" || !cell.column.editable || getRowMeta(cell.row)) {
        return;
      }
      editing = { rowKey: ctx.getRowKey(cell.row), columnKey: cell.column.key };
      ctx.requestUpdate();
    },

    onCellKeydown(event, cell, ctx) {
      if (always) {
        // Keys from inside the input are handled (and stopped) there; this only sees
        // the cell itself, e.g. after clicking its padding or Tab-ing onto it.
        if (event.key !== "Enter" || !cell.column.editable || getRowMeta(cell.row)) {
          return false;
        }
        void ctx.grid.focusCell(cell.rowIndex, cell.column.key);
        return true;
      }
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
