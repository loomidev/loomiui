import { html, nothing } from "lit";
import { defineGridModule, type GridModule, type GridModuleContext } from "../grid-module.js";
import type { DataGridRecord } from "../types.js";

export interface VirtualScrollingModuleOptions {
  /** Pixel height of a single row. Must match the grid's actual row height. Defaults to `40`. */
  rowHeight?: number;
  /** Extra rows rendered above/below the visible viewport as scroll buffer. Defaults to `6`. */
  overscan?: number;
}

/**
 * Renders only the rows visible in the scroll viewport (plus overscan),
 * padding the rest with spacer rows so scrollbar size/position stay
 * accurate. Set `max-height` on the grid so `.grid-wrap` actually scrolls;
 * disables core pagination while active.
 *
 * ```ts
 * grid.maxHeight = "480px";
 * grid.pagination = false;
 * grid.modules = [virtualScrollingModule({ rowHeight: 44 })];
 * ```
 */
export function virtualScrollingModule<TRecord extends DataGridRecord = DataGridRecord>(
  options: VirtualScrollingModuleOptions = {},
): GridModule<TRecord> {
  const rowHeight = options.rowHeight ?? 40;
  const overscan = options.overscan ?? 6;

  let scrollTop = 0;
  let attachedEl: HTMLElement | null = null;
  let latestCtx: GridModuleContext<TRecord> | null = null;

  const onScroll = () => {
    if (!attachedEl) {
      return;
    }
    scrollTop = attachedEl.scrollTop;
    latestCtx?.requestUpdate();
  };

  function ensureScrollListener(ctx: GridModuleContext<TRecord>) {
    latestCtx = ctx;
    const wrap = ctx.grid.shadowRoot?.querySelector<HTMLElement>(".grid-wrap");
    if (!wrap || wrap === attachedEl) {
      return;
    }
    attachedEl?.removeEventListener("scroll", onScroll);
    attachedEl = wrap;
    attachedEl.addEventListener("scroll", onScroll, { passive: true });
  }

  return defineGridModule<TRecord>({
    name: "virtual-scrolling",

    detach() {
      attachedEl?.removeEventListener("scroll", onScroll);
      attachedEl = null;
      latestCtx = null;
    },

    renderBody(rows, columns, renderRow, ctx) {
      ensureScrollListener(ctx);

      const viewportHeight = attachedEl?.clientHeight || 480;
      const visibleCount = Math.ceil(viewportHeight / rowHeight) + overscan * 2;
      const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
      const endIndex = Math.min(rows.length, startIndex + visibleCount);
      const topHeight = startIndex * rowHeight;
      const bottomHeight = (rows.length - endIndex) * rowHeight;
      const colSpan = columns.length + (ctx.grid.selectable ? 1 : 0);

      return html`
        ${
          topHeight > 0
            ? html`<tr class="virtual-spacer" style=${`--loomi-data-grid-spacer-height:${topHeight}px`}>
              <td colspan=${colSpan}></td>
            </tr>`
            : nothing
        }
        ${rows.slice(startIndex, endIndex).map((row, offset) => renderRow(row, startIndex + offset))}
        ${
          bottomHeight > 0
            ? html`<tr class="virtual-spacer" style=${`--loomi-data-grid-spacer-height:${bottomHeight}px`}>
              <td colspan=${colSpan}></td>
            </tr>`
            : nothing
        }
      `;
    },
  });
}
