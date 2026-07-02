import { css } from "lit";

export const dataGridStyles = css`
  :host {
    --loomi-data-grid-border: var(--loomi-surface-border, #d9dee3);
    --loomi-data-grid-border-subtle: var(--loomi-surface-border-subtle, #edf0f2);
    --loomi-data-grid-muted: var(--loomi-text-muted, #62717d);
    --loomi-data-grid-faint: var(--loomi-text-faint, #8a97a3);
    --loomi-data-grid-surface: var(--loomi-surface, #ffffff);
    --loomi-data-grid-surface-muted: var(--loomi-surface-muted, #f6f8fa);
    --loomi-data-grid-surface-hover: var(--loomi-surface-hover, #f9fbfc);
    --loomi-data-grid-text: var(--loomi-text, #172026);
    --loomi-data-grid-text-secondary: var(--loomi-text-secondary, #33424f);
    --loomi-data-grid-accent: var(--loomi-primary-600, var(--_loomi-primary-600-default, #2563eb));
    --loomi-data-grid-accent-strong: var(--loomi-primary-700, var(--_loomi-primary-700-default, #174ea6));
    --loomi-data-grid-accent-soft: var(--loomi-primary-100, var(--_loomi-primary-100-default, #dbeafe));
    --loomi-data-grid-accent-softer: var(--loomi-primary-50, var(--_loomi-primary-50-default, #eff6ff));
    display: block;
    color: var(--loomi-data-grid-text);
    font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  }

  .shell {
    overflow: hidden;
    border: 1px solid var(--loomi-data-grid-border);
    border-radius: 8px;
    background: var(--loomi-data-grid-surface);
  }

  .toolbar,
  .footer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px;
    border-bottom: 1px solid var(--loomi-data-grid-border);
    background: var(--loomi-data-grid-surface);
  }

  .toolbar:empty {
    display: none;
  }

  .footer {
    border-top: 1px solid var(--loomi-data-grid-border);
    border-bottom: 0;
  }

  .toolbar-group,
  .pagination {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
  }

  input,
  select,
  button {
    min-height: 34px;
    border: 1px solid var(--loomi-data-grid-border);
    border-radius: 6px;
    background: var(--loomi-data-grid-surface);
    color: inherit;
    font: inherit;
  }

  input,
  select {
    padding: 0 10px;
  }

  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 0 10px;
    cursor: pointer;
  }

  button:hover {
    border-color: var(--loomi-data-grid-accent);
  }

  button[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .selection-count {
    min-height: 28px;
    display: inline-flex;
    align-items: center;
    border-radius: 999px;
    background: var(--loomi-data-grid-accent-soft);
    color: var(--loomi-data-grid-accent-strong);
    padding: 0 10px;
    font-size: 12px;
    font-weight: 600;
  }

  .saved-view-picker {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
  }

  .saved-view-label {
    color: var(--loomi-data-grid-muted);
    font-weight: 600;
  }

  .grid-wrap {
    overflow: auto;
    position: relative;
  }

  table {
    width: 100%;
    min-width: 720px;
    border-collapse: separate;
    border-spacing: 0;
    font-size: 14px;
    table-layout: fixed;
  }

  th,
  td {
    border-bottom: 1px solid var(--loomi-data-grid-border);
    padding: 12px;
    text-align: left;
    vertical-align: middle;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :host([density="compact"]) th,
  :host([density="compact"]) td {
    padding: 8px 10px;
  }

  :host([density="spacious"]) th,
  :host([density="spacious"]) td {
    padding: 16px;
  }

  th {
    position: relative;
    background: var(--loomi-data-grid-surface-muted);
    color: var(--loomi-data-grid-text-secondary);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0;
    text-transform: uppercase;
    user-select: none;
  }

  :host([sticky-header]) th {
    position: sticky;
    top: 0;
    z-index: 5;
  }

  .pin-select-column,
  .pinned-start,
  .pinned-end {
    position: sticky;
    z-index: 4;
    background: var(--loomi-data-grid-surface);
  }

  tbody tr:hover .pin-select-column,
  tbody tr:hover .pinned-start,
  tbody tr:hover .pinned-end {
    background: var(--loomi-data-grid-surface-hover);
  }

  tbody tr[data-selected="true"] .pin-select-column,
  tbody tr[data-selected="true"] .pinned-start,
  tbody tr[data-selected="true"] .pinned-end {
    background: var(--loomi-data-grid-accent-softer);
  }

  tbody tr.loomi-grid-row-group .pin-select-column,
  tbody tr.loomi-grid-row-group .pinned-start,
  tbody tr.loomi-grid-row-group .pinned-end {
    background: var(--loomi-data-grid-surface-muted);
  }

  th.pin-select-column,
  th.pinned-start,
  th.pinned-end {
    z-index: 7;
    background: var(--loomi-data-grid-surface-muted);
  }

  .pin-select-column {
    left: 0;
    width: 42px;
    min-width: 42px;
    max-width: 42px;
    text-align: center;
  }

  .pin-edge-start {
    box-shadow: 1px 0 0 var(--loomi-data-grid-border);
  }

  .pin-edge-end {
    box-shadow: -1px 0 0 var(--loomi-data-grid-border);
  }

  .th-content {
    display: flex;
    align-items: center;
    gap: 6px;
    width: 100%;
    overflow: hidden;
  }

  .sort-button {
    all: unset;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    min-height: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .sort-button:focus-visible {
    outline: 2px solid var(--loomi-data-grid-accent);
    outline-offset: 2px;
  }

  .sort-indicator {
    font-size: 10px;
    opacity: 0.8;
  }

  .column-filter {
    display: block;
    margin-top: 6px;
    width: 100%;
    min-height: 26px;
    font-size: 12px;
    font-weight: 400;
    text-transform: none;
  }

  .resize-handle {
    position: absolute;
    top: 0;
    right: -4px;
    width: 8px;
    height: 100%;
    cursor: col-resize;
    z-index: 6;
    touch-action: none;
  }

  .resize-handle::after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 3px;
    width: 2px;
    background: transparent;
  }

  .resize-handle:hover::after,
  .resize-handle.resizing::after {
    background: var(--loomi-data-grid-accent);
  }

  tbody tr {
    cursor: default;
  }

  tbody tr:hover {
    background: var(--loomi-data-grid-surface-hover);
  }

  tbody tr[data-selected="true"] {
    background: var(--loomi-data-grid-accent-softer);
  }

  tbody tr.loomi-grid-row-group {
    background: var(--loomi-data-grid-surface-muted);
    font-weight: 600;
  }

  tbody tr.loomi-grid-row-group:hover {
    background: var(--loomi-data-grid-surface-muted);
  }

  .group-toggle {
    all: unset;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    cursor: pointer;
    border-radius: 4px;
  }

  .group-toggle:hover {
    background: var(--loomi-data-grid-accent-soft);
  }

  .tree-indent {
    display: inline-block;
  }

  td.align-center,
  th .align-center {
    text-align: center;
  }

  td.align-end,
  th .align-end {
    text-align: right;
  }

  td[data-active-cell="true"] {
    outline: 2px solid var(--loomi-data-grid-accent);
    outline-offset: -2px;
  }

  td.loomi-grid-cell-selected {
    background: var(--loomi-data-grid-accent-softer);
    outline: 1px solid var(--loomi-data-grid-accent);
    outline-offset: -1px;
  }

  td.loomi-grid-cell-editing {
    padding: 4px;
  }

  td.loomi-grid-cell-editing input {
    width: 100%;
    min-height: 28px;
  }

  .empty,
  .loading {
    padding: 48px 24px;
    text-align: center;
    color: var(--loomi-data-grid-muted);
  }

  .empty strong,
  .loading strong {
    display: block;
    margin-bottom: 4px;
    color: var(--loomi-data-grid-text);
    font-size: 16px;
  }

  .row-count {
    color: var(--loomi-data-grid-muted);
    font-size: 13px;
  }

  .below-table {
    border-top: 1px solid var(--loomi-data-grid-border);
    padding: 12px;
  }

  .virtual-spacer {
    padding: 0 !important;
    border: 0 !important;
    height: var(--loomi-data-grid-spacer-height, 0px);
  }
`;
