import { css } from "lit";

export const calendarStyles = css`
  :host {
    --loomi-calendar-border: var(--loomi-surface-border, #d9dee3);
    --loomi-calendar-border-subtle: var(--loomi-surface-border-subtle, #edf0f2);
    --loomi-calendar-surface: var(--loomi-surface, #ffffff);
    --loomi-calendar-surface-muted: var(--loomi-surface-muted, #f6f8fa);
    --loomi-calendar-surface-hover: var(--loomi-surface-hover, #f9fbfc);
    --loomi-calendar-text: var(--loomi-text, #172026);
    --loomi-calendar-text-secondary: var(--loomi-text-secondary, #33424f);
    --loomi-calendar-text-muted: var(--loomi-text-muted, #62717d);
    --loomi-calendar-text-faint: var(--loomi-text-faint, #8a97a3);
    --loomi-calendar-accent: var(--loomi-primary-600, var(--_loomi-primary-600-default, #2563eb));
    --loomi-calendar-accent-strong: var(--loomi-primary-700, var(--_loomi-primary-700-default, #174ea6));
    --loomi-calendar-accent-soft: var(--loomi-primary-100, var(--_loomi-primary-100-default, #dbeafe));
    --loomi-calendar-accent-softer: var(--loomi-primary-50, var(--_loomi-primary-50-default, #eff6ff));
    --loomi-calendar-now: var(--loomi-error-500, #ef4444);
    display: block;
    color: var(--loomi-calendar-text);
    font-family: Inter, ui-sans-serif, system-ui, sans-serif;
    font-size: 14px;
  }

  :host([hidden]) {
    display: none;
  }

  .shell {
    display: flex;
    flex-direction: column;
    min-height: 420px;
    height: 100%;
    overflow: hidden;
    border: 1px solid var(--loomi-calendar-border);
    border-radius: 8px;
    background: var(--loomi-calendar-surface);
  }

  .toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px;
    border-bottom: 1px solid var(--loomi-calendar-border);
    background: var(--loomi-calendar-surface);
  }

  .toolbar-group {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
  }

  .title {
    font-size: 18px;
    font-weight: 600;
    color: var(--loomi-calendar-text);
    min-width: 0;
  }

  .timezone-badge {
    display: inline-flex;
    align-items: center;
    min-height: 28px;
    padding: 0 10px;
    border-radius: 999px;
    background: var(--loomi-calendar-surface-muted);
    color: var(--loomi-calendar-text-muted);
    font-size: 12px;
    font-weight: 600;
  }

  .btn,
  .seg-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-height: 34px;
    padding: 0 10px;
    border: 1px solid var(--loomi-calendar-border);
    border-radius: 6px;
    background: var(--loomi-calendar-surface);
    color: inherit;
    font: inherit;
    cursor: pointer;
  }

  .btn:hover,
  .seg-btn:hover {
    border-color: var(--loomi-calendar-accent);
    background: var(--loomi-calendar-surface-hover);
  }

  .btn.icon {
    width: 34px;
    padding: 0;
  }

  .btn svg,
  .seg-btn svg {
    width: 1.1rem;
    height: 1.1rem;
  }

  .segmented {
    display: inline-flex;
    padding: 2px;
    border: 1px solid var(--loomi-calendar-border);
    border-radius: 8px;
    background: var(--loomi-calendar-surface-muted);
  }

  .seg-btn {
    border: 0;
    background: transparent;
    min-height: 30px;
    border-radius: 6px;
    color: var(--loomi-calendar-text-muted);
    font-size: 13px;
    font-weight: 600;
  }

  .seg-btn.active {
    background: var(--loomi-calendar-surface);
    color: var(--loomi-calendar-accent-strong);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
  }

  .body {
    display: flex;
    flex: 1;
    min-height: 0;
    position: relative;
  }

  .loading-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.72);
    z-index: 20;
    color: var(--loomi-calendar-text-muted);
    font-weight: 600;
  }

  .month-view,
  .agenda-view,
  .resource-view {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
  }

  .weekdays {
    display: grid;
    border-bottom: 1px solid var(--loomi-calendar-border);
    background: var(--loomi-calendar-surface-muted);
  }

  .weekday {
    padding: 8px;
    text-align: center;
    font-size: 12px;
    font-weight: 600;
    color: var(--loomi-calendar-text-faint);
    text-transform: uppercase;
  }

  .weekday.is-today {
    color: var(--loomi-calendar-accent);
  }

  .month-grid {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    grid-auto-rows: minmax(108px, 1fr);
    flex: 1;
    min-height: 0;
  }

  .month-cell {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
    padding: 4px;
    border-right: 1px solid var(--loomi-calendar-border-subtle);
    border-bottom: 1px solid var(--loomi-calendar-border-subtle);
    background: var(--loomi-calendar-surface);
  }

  .month-cell:nth-child(7n) {
    border-right: 0;
  }

  .month-cell.other-month {
    background: var(--loomi-calendar-surface-muted);
  }

  .day-num {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    margin-left: auto;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: var(--loomi-calendar-text-secondary);
    font: inherit;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
  }

  .day-num:hover {
    background: var(--loomi-calendar-surface-hover);
  }

  .month-cell.today .day-num,
  .day-num.today {
    background: var(--loomi-calendar-accent);
    color: var(--loomi-white, #ffffff);
  }

  .month-cell.other-month .day-num {
    color: var(--loomi-calendar-text-faint);
  }

  .event-pill {
    display: block;
    width: 100%;
    min-width: 0;
    padding: 2px 6px;
    border: 0;
    border-radius: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
    font: inherit;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
  }

  .event-pill.more {
    background: transparent;
    color: var(--loomi-calendar-text-muted);
    cursor: default;
    font-weight: 500;
  }

  .time-layout {
    display: flex;
    flex: 1;
    min-height: 0;
    overflow: auto;
  }

  .time-axis {
    width: 64px;
    flex: none;
    border-right: 1px solid var(--loomi-calendar-border);
    background: var(--loomi-calendar-surface);
    position: sticky;
    left: 0;
    z-index: 3;
  }

  .time-axis-label {
    height: var(--loomi-calendar-hour-height, 48px);
    padding: 0 8px;
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    transform: translateY(-8px);
    color: var(--loomi-calendar-text-faint);
    font-size: 11px;
  }

  .time-grid-wrap {
    display: flex;
    flex: 1;
    min-width: 0;
  }

  .day-column {
    position: relative;
    flex: 1;
    min-width: 0;
    border-right: 1px solid var(--loomi-calendar-border-subtle);
  }

  .day-column:last-child {
    border-right: 0;
  }

  .all-day-row {
    display: grid;
    border-bottom: 1px solid var(--loomi-calendar-border);
    background: var(--loomi-calendar-surface-muted);
  }

  .all-day-label {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 8px;
    color: var(--loomi-calendar-text-faint);
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
  }

  .all-day-cell {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    min-height: 36px;
    padding: 4px;
    border-right: 1px solid var(--loomi-calendar-border-subtle);
  }

  .all-day-cell:last-child {
    border-right: 0;
  }

  .time-slots {
    position: relative;
  }

  .time-slot {
    height: var(--loomi-calendar-hour-height, 48px);
    border-bottom: 1px solid var(--loomi-calendar-border-subtle);
    box-sizing: border-box;
  }

  .time-slot-button {
    display: block;
    width: 100%;
    height: 100%;
    border: 0;
    padding: 0;
    background: transparent;
    cursor: pointer;
  }

  .time-slot-button:hover {
    background: color-mix(in srgb, var(--loomi-calendar-accent-softer) 70%, transparent);
  }

  .now-line {
    position: absolute;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--loomi-calendar-now);
    z-index: 4;
    pointer-events: none;
  }

  .now-line::before {
    content: "";
    position: absolute;
    left: 0;
    top: -4px;
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: var(--loomi-calendar-now);
  }

  .timed-event {
    position: absolute;
    box-sizing: border-box;
    padding: 4px 6px;
    border-radius: 6px;
    overflow: hidden;
    border: 1px solid transparent;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
    cursor: pointer;
    z-index: 2;
    text-align: left;
  }

  .timed-event.draggable {
    cursor: grab;
  }

  .timed-event.dragging {
    cursor: grabbing;
    opacity: 0.88;
    z-index: 10;
  }

  .timed-event-title {
    font-size: 12px;
    font-weight: 700;
    line-height: 1.2;
  }

  .timed-event-meta {
    margin-top: 2px;
    font-size: 11px;
    opacity: 0.85;
    line-height: 1.2;
  }

  .resize-handle {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 6px;
    cursor: ns-resize;
  }

  .agenda-list {
    overflow: auto;
    flex: 1;
  }

  .agenda-day {
    border-bottom: 1px solid var(--loomi-calendar-border);
  }

  .agenda-day-header {
    padding: 10px 12px;
    background: var(--loomi-calendar-surface-muted);
    font-weight: 700;
    color: var(--loomi-calendar-text-secondary);
  }

  .agenda-item {
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: 12px;
    width: 100%;
    padding: 12px;
    border: 0;
    border-top: 1px solid var(--loomi-calendar-border-subtle);
    background: var(--loomi-calendar-surface);
    text-align: left;
    cursor: pointer;
    color: inherit;
    font: inherit;
  }

  .agenda-item:hover {
    background: var(--loomi-calendar-surface-hover);
  }

  .agenda-time {
    color: var(--loomi-calendar-text-muted);
    font-size: 12px;
    font-weight: 600;
  }

  .agenda-title {
    font-weight: 700;
  }

  .agenda-description,
  .agenda-meta {
    margin-top: 4px;
    color: var(--loomi-calendar-text-muted);
    font-size: 12px;
  }

  .resource-view {
    overflow: auto;
  }

  .resource-grid {
    min-width: 100%;
  }

  .resource-header,
  .resource-row {
    display: grid;
    grid-template-columns: var(--loomi-calendar-resource-label-width, 160px) 1fr;
  }

  .resource-header {
    position: sticky;
    top: 0;
    z-index: 5;
    background: var(--loomi-calendar-surface-muted);
    border-bottom: 1px solid var(--loomi-calendar-border);
  }

  .resource-label,
  .resource-name {
    display: flex;
    align-items: center;
    padding: 10px 12px;
    border-right: 1px solid var(--loomi-calendar-border);
    background: var(--loomi-calendar-surface-muted);
    font-weight: 600;
  }

  .resource-name {
    background: var(--loomi-calendar-surface);
    color: var(--loomi-calendar-text-secondary);
  }

  .resource-timeline {
    position: relative;
    min-height: calc(var(--loomi-calendar-hour-height, 48px) * var(--loomi-calendar-hour-count, 12));
    border-bottom: 1px solid var(--loomi-calendar-border-subtle);
  }

  .resource-hours {
    display: grid;
    grid-template-columns: repeat(var(--loomi-calendar-hour-count, 12), minmax(80px, 1fr));
    height: 40px;
    border-bottom: 1px solid var(--loomi-calendar-border-subtle);
  }

  .resource-hour {
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 1px solid var(--loomi-calendar-border-subtle);
    color: var(--loomi-calendar-text-faint);
    font-size: 11px;
    font-weight: 600;
  }

  .resource-track {
    position: absolute;
    inset: 0;
    display: grid;
    grid-template-columns: repeat(var(--loomi-calendar-hour-count, 12), minmax(80px, 1fr));
  }

  .resource-slot {
    border-right: 1px solid var(--loomi-calendar-border-subtle);
  }

  .empty-state {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    padding: 32px;
    color: var(--loomi-calendar-text-muted);
    text-align: center;
  }

  .event-primary { background: var(--loomi-primary-100, #dbeafe); color: var(--loomi-primary-800, #1e40af); border-color: var(--loomi-primary-200, #bfdbfe); }
  .event-secondary { background: var(--loomi-secondary-100, #f3f4f6); color: var(--loomi-secondary-800, #1f2937); border-color: var(--loomi-secondary-200, #e5e7eb); }
  .event-success { background: var(--loomi-success-100, #d1fae5); color: var(--loomi-success-800, #065f46); border-color: var(--loomi-success-200, #a7f3d0); }
  .event-warning { background: var(--loomi-warning-100, #fef3c7); color: var(--loomi-warning-800, #92400e); border-color: var(--loomi-warning-200, #fde68a); }
  .event-error { background: var(--loomi-error-100, #fee2e2); color: var(--loomi-error-800, #991b1b); border-color: var(--loomi-error-200, #fecaca); }
`;
