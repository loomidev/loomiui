import { defineGridModule, type GridModule, type GridModuleContext } from "../grid-module.js";
import type { DataGridRecord, DataGridSort } from "../types.js";

interface PersistedGridState {
  sort?: DataGridSort | null;
  columnWidths?: Record<string, string>;
  page?: number;
  pageSize?: number;
  selectedKeys?: string[];
}

export type StatePersistenceField = "sort" | "columnWidths" | "page" | "pageSize" | "selectedKeys";

export interface StatePersistenceModuleOptions {
  /** Storage key the state is saved under. */
  key: string;
  /** Defaults to `localStorage`. Use `sessionStorage` for tab-scoped persistence. */
  storage?: Storage;
  /** Which pieces of state to persist. Defaults to everything except `selectedKeys`. */
  fields?: StatePersistenceField[];
}

const DEFAULT_FIELDS: StatePersistenceField[] = ["sort", "columnWidths", "page", "pageSize"];

/**
 * Persists sort, column widths, page, and page size (and optionally
 * selection) to `localStorage`/`sessionStorage`, restoring them the next
 * time a grid with the same `key` attaches.
 *
 * ```ts
 * grid.modules = [statePersistenceModule({ key: "members-grid" })];
 * ```
 */
export function statePersistenceModule<TRecord extends DataGridRecord = DataGridRecord>(
  options: StatePersistenceModuleOptions
): GridModule<TRecord> {
  const storage = options.storage ?? (typeof localStorage === "undefined" ? undefined : localStorage);
  const fields = new Set(options.fields ?? DEFAULT_FIELDS);

  function load(): PersistedGridState | null {
    if (!storage) return null;
    try {
      const raw = storage.getItem(options.key);
      return raw ? (JSON.parse(raw) as PersistedGridState) : null;
    } catch {
      return null;
    }
  }

  function save(ctx: GridModuleContext<TRecord>) {
    if (!storage) return;
    const state: PersistedGridState = {};
    if (fields.has("sort")) state.sort = ctx.grid.sort;
    if (fields.has("columnWidths")) state.columnWidths = ctx.grid.columnWidths;
    if (fields.has("page")) state.page = ctx.grid.page;
    if (fields.has("pageSize")) state.pageSize = ctx.grid.pageSize;
    if (fields.has("selectedKeys")) state.selectedKeys = ctx.grid.selectedKeys;
    try {
      storage.setItem(options.key, JSON.stringify(state));
    } catch {
      // Storage can throw (quota, privacy mode) — persistence is best-effort.
    }
  }

  return defineGridModule<TRecord>({
    name: "state-persistence",

    attach(ctx) {
      const saved = load();
      if (!saved) return;
      if (fields.has("sort") && saved.sort !== undefined) ctx.grid.sort = saved.sort;
      if (fields.has("columnWidths") && saved.columnWidths) ctx.grid.columnWidths = saved.columnWidths;
      if (fields.has("page") && saved.page) ctx.grid.page = saved.page;
      if (fields.has("pageSize") && saved.pageSize) ctx.grid.pageSize = saved.pageSize;
      if (fields.has("selectedKeys") && saved.selectedKeys) ctx.grid.selectedKeys = saved.selectedKeys;
      ctx.requestUpdate();
    },

    onGridEvent(name, _detail, ctx) {
      if (
        name === "loomi-sort-change" ||
        name === "loomi-column-resize" ||
        name === "loomi-page-change" ||
        name === "loomi-selection-change"
      ) {
        save(ctx);
      }
    }
  });
}
