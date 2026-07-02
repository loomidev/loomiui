import { html } from "lit";
import { defineGridModule, type GridModule } from "../grid-module.js";
import { formatCellValue } from "../grid-utils.js";
import type { DataGridColumn, DataGridRecord } from "../types.js";

export type DataGridFilterOperator =
  | "contains"
  | "equals"
  | "startsWith"
  | "endsWith"
  | "gt"
  | "gte"
  | "lt"
  | "lte";

export interface DataGridFilter {
  key: string;
  operator: DataGridFilterOperator;
  value: string;
}

export interface FilteringModuleState {
  globalSearch: string;
  columnFilters: DataGridFilter[];
}

export interface FilteringModuleOptions {
  /** Placeholder for the global quick-search box. */
  searchPlaceholder?: string;
  /** Show the global quick-search input. Defaults to `true`. */
  showGlobalSearch?: boolean;
  /** Restrict global search to these column keys (defaults to every column). */
  searchableColumns?: string[];
}

export type FilteringModule<TRecord extends DataGridRecord = DataGridRecord> = GridModule<TRecord> & {
  getFilterState(): FilteringModuleState;
  setFilterState(state: Partial<FilteringModuleState>): void;
};

function matchesFilter<TRecord extends DataGridRecord>(row: TRecord, filter: DataGridFilter): boolean {
  const rawValue = row[filter.key];
  const value = formatCellValue(rawValue).toLowerCase();
  const filterValue = filter.value.toLowerCase();
  const numericValue = Number(rawValue);
  const numericFilter = Number(filter.value);

  switch (filter.operator) {
    case "equals":
      return value === filterValue;
    case "startsWith":
      return value.startsWith(filterValue);
    case "endsWith":
      return value.endsWith(filterValue);
    case "gt":
      return numericValue > numericFilter;
    case "gte":
      return numericValue >= numericFilter;
    case "lt":
      return numericValue < numericFilter;
    case "lte":
      return numericValue <= numericFilter;
    case "contains":
    default:
      return value.includes(filterValue);
  }
}

/**
 * Adds a global quick-search box plus per-column filter inputs (for columns
 * with `filterable: true`). Runs in the `"filter"` stage, before core
 * sorting, so it composes cleanly with row-grouping / tree-data / pivot.
 *
 * The returned module exposes `getFilterState()` / `setFilterState()` so
 * `savedViewsModule()` can restore filter presets.
 *
 * ```ts
 * grid.modules = [filteringModule({ searchPlaceholder: "Search users" })];
 * ```
 */
export function filteringModule<TRecord extends DataGridRecord = DataGridRecord>(
  options: FilteringModuleOptions = {}
): FilteringModule<TRecord> {
  let globalSearch = "";
  const columnFilters = new Map<string, DataGridFilter>();

  const module = defineGridModule<TRecord>({
    name: "filtering",
    stage: "filter",

    transformRows(rows, ctx) {
      const search = globalSearch.trim().toLowerCase();
      const searchableKeys = options.searchableColumns ?? ctx.columns.map((column) => column.key);

      return rows.filter((row) => {
        const matchesSearch =
          search.length === 0 ||
          searchableKeys.some((key) => formatCellValue(row[key]).toLowerCase().includes(search));

        const matchesColumnFilters = [...columnFilters.values()].every((filter) => matchesFilter(row, filter));

        return matchesSearch && matchesColumnFilters;
      });
    },

    renderToolbarStart(ctx) {
      if (options.showGlobalSearch === false) {
        return undefined;
      }
      return html`
        <input
          type="search"
          aria-label="Search rows"
          placeholder=${options.searchPlaceholder ?? "Search rows"}
          .value=${globalSearch}
          @input=${(event: Event) => {
            globalSearch = (event.target as HTMLInputElement).value;
            ctx.requestUpdate();
          }}
        />
      `;
    },

    renderHeaderExtra(column: DataGridColumn<TRecord>, ctx) {
      if (!column.filterable) {
        return undefined;
      }
      return html`
        <input
          type="text"
          class="column-filter"
          aria-label=${`Filter ${column.label}`}
          placeholder="Filter…"
          .value=${columnFilters.get(column.key)?.value ?? ""}
          @click=${(event: Event) => event.stopPropagation()}
          @input=${(event: Event) => {
            const value = (event.target as HTMLInputElement).value;
            if (value) {
              columnFilters.set(column.key, { key: column.key, operator: "contains", value });
            } else {
              columnFilters.delete(column.key);
            }
            ctx.requestUpdate();
          }}
        />
      `;
    }
  });

  return Object.assign(module, {
    getFilterState(): FilteringModuleState {
      return {
        globalSearch,
        columnFilters: [...columnFilters.values()]
      };
    },

    setFilterState(state: Partial<FilteringModuleState>): void {
      if (state.globalSearch !== undefined) {
        globalSearch = state.globalSearch;
      }
      if (state.columnFilters !== undefined) {
        columnFilters.clear();
        for (const filter of state.columnFilters) {
          columnFilters.set(filter.key, filter);
        }
      }
    }
  });
}
