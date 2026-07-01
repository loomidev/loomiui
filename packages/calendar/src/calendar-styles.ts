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
    --loomi-calendar-radius: 12px;
    --loomi-calendar-radius-sm: 8px;
    --loomi-calendar-shadow: 0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px rgba(15, 23, 42, 0.06);
    --loomi-calendar-transition: 160ms cubic-bezier(0.4, 0, 0.2, 1);
    display: block;
    color: var(--loomi-calendar-text);
    font-family: Inter, ui-sans-serif, system-ui, sans-serif;
    font-size: 14px;
    line-height: 1.4;
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
    border: 1px solid color-mix(in srgb, var(--loomi-calendar-border) 88%, transparent);
    border-radius: var(--loomi-calendar-radius);
    background: var(--loomi-calendar-surface);
    box-shadow: var(--loomi-calendar-shadow);
  }

  .layout {
    display: flex;
    flex: 1;
    min-height: 0;
  }

  .main {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
    min-height: 0;
  }

  .sidebar {
    width: 280px;
    flex: none;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
    border-right: 1px solid var(--loomi-calendar-border-subtle);
    background: color-mix(in srgb, var(--loomi-calendar-surface-muted) 55%, var(--loomi-calendar-surface));
    overflow: auto;
    transition:
      width var(--loomi-calendar-transition),
      padding var(--loomi-calendar-transition),
      opacity var(--loomi-calendar-transition);
  }

  .shell.sidebar-closed .sidebar {
    width: 0;
    padding: 0;
    opacity: 0;
    overflow: hidden;
    border-right: 0;
  }

  .sidebar-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .sidebar-events {
    flex: 1;
    min-height: 0;
  }

  .sidebar-heading {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--loomi-calendar-text-faint);
  }

  .mini-calendar {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px;
    border: 1px solid var(--loomi-calendar-border-subtle);
    border-radius: var(--loomi-calendar-radius-sm);
    background: var(--loomi-calendar-surface);
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  }

  .mini-calendar-header {
    display: grid;
    grid-template-columns: 34px 1fr 34px;
    align-items: center;
    gap: 4px;
  }

  .mini-calendar-title {
    justify-self: stretch;
    min-height: 34px;
    padding: 0 8px;
    border: 1px solid var(--loomi-calendar-border-subtle);
    border-radius: var(--loomi-calendar-radius-sm);
    background: var(--loomi-calendar-surface);
    color: inherit;
    font: inherit;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition:
      border-color var(--loomi-calendar-transition),
      background var(--loomi-calendar-transition);
  }

  .mini-calendar-title:hover {
    border-color: color-mix(in srgb, var(--loomi-calendar-accent) 35%, var(--loomi-calendar-border));
    background: var(--loomi-calendar-surface-hover);
  }

  .mini-weekdays,
  .mini-grid {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 2px;
  }

  .mini-weekday {
    text-align: center;
    font-size: 10px;
    font-weight: 700;
    color: var(--loomi-calendar-text-faint);
    text-transform: uppercase;
  }

  .mini-day {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    width: 100%;
    aspect-ratio: 1;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: var(--loomi-calendar-text-secondary);
    font: inherit;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    padding: 2px 0 0;
  }

  .mini-day-num {
    line-height: 1;
  }

  .mini-day-dot {
    width: 4px;
    height: 4px;
    border-radius: 999px;
    background: var(--loomi-calendar-accent);
  }

  .mini-day.other-month .mini-day-dot {
    background: var(--loomi-calendar-text-faint);
  }

  .mini-day.selected .mini-day-dot {
    background: var(--loomi-white, #ffffff);
  }

  .mini-day:hover {
    background: var(--loomi-calendar-surface-hover);
  }

  .mini-day.other-month {
    color: var(--loomi-calendar-text-faint);
  }

  .mini-day.today {
    box-shadow: inset 0 0 0 1px var(--loomi-calendar-accent-soft);
    color: var(--loomi-calendar-accent-strong);
  }

  .mini-day.selected {
    background: var(--loomi-calendar-accent);
    color: var(--loomi-white, #ffffff);
  }

  .sidebar-event-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: auto;
  }

  .sidebar-event {
    display: flex;
    flex-direction: column;
    gap: 2px;
    width: 100%;
    padding: 10px 12px;
    border: 1px solid var(--loomi-calendar-border-subtle);
    border-radius: var(--loomi-calendar-radius-sm);
    background: var(--loomi-calendar-surface);
    text-align: left;
    cursor: pointer;
    color: inherit;
    font: inherit;
  }

  .sidebar-event-time {
    font-size: 11px;
    font-weight: 600;
    color: var(--loomi-calendar-text-muted);
  }

  .sidebar-event-title {
    font-size: 13px;
    font-weight: 700;
  }

  .sidebar-empty {
    padding: 12px;
    border-radius: var(--loomi-calendar-radius-sm);
    background: color-mix(in srgb, var(--loomi-calendar-surface-muted) 70%, transparent);
    color: var(--loomi-calendar-text-muted);
    font-size: 13px;
  }

  .upcoming-detail {
    display: flex;
    flex-direction: column;
    gap: 18px;
    padding: 4px 2px 8px;
  }

  .upcoming-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }

  .upcoming-title {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.15;
    color: var(--loomi-calendar-text);
  }

  .upcoming-actions {
    display: flex;
    gap: 2px;
    flex: none;
  }

  .icon-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 0;
    border: 0;
    border-radius: 8px;
    background: transparent;
    color: var(--loomi-calendar-text-faint);
    cursor: pointer;
    transition:
      color var(--loomi-calendar-transition),
      background var(--loomi-calendar-transition);
  }

  .icon-btn:hover {
    color: var(--loomi-calendar-text-muted);
    background: color-mix(in srgb, var(--loomi-calendar-surface-muted) 80%, transparent);
  }

  .icon-btn:focus-visible {
    outline: 2px solid var(--loomi-calendar-accent);
    outline-offset: 2px;
  }

  .icon-btn svg {
    width: 1.15rem;
    height: 1.15rem;
  }

  .upcoming-meta {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .upcoming-meta-row {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--loomi-calendar-text-muted);
    font-size: 14px;
    line-height: 1.4;
  }

  .upcoming-meta-icon {
    flex: none;
    width: 1.125rem;
    height: 1.125rem;
    color: var(--loomi-calendar-text-faint);
  }

  .upcoming-guests {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .guest-avatars {
    display: flex;
    align-items: center;
  }

  .guest-avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    margin-left: -10px;
    border: 2px solid var(--loomi-calendar-surface);
    border-radius: 999px;
    background: color-mix(in srgb, var(--loomi-calendar-accent-soft) 75%, white);
    color: var(--loomi-calendar-accent-strong);
    font-size: 11px;
    font-weight: 700;
    overflow: hidden;
  }

  .guest-avatar:first-child {
    margin-left: 0;
  }

  .guest-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .guest-initials {
    background: var(--loomi-calendar-surface-muted);
    color: var(--loomi-calendar-text-muted);
  }

  .guest-add {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    margin-left: -10px;
    border: 1.5px dashed var(--loomi-calendar-border);
    border-radius: 999px;
    background: transparent;
    color: var(--loomi-calendar-text-faint);
    cursor: pointer;
    transition:
      border-color var(--loomi-calendar-transition),
      color var(--loomi-calendar-transition),
      background var(--loomi-calendar-transition);
  }

  .guest-add:hover {
    border-color: var(--loomi-calendar-accent-soft);
    color: var(--loomi-calendar-accent-strong);
    background: color-mix(in srgb, var(--loomi-calendar-accent-softer) 40%, transparent);
  }

  .guest-add svg {
    width: 1rem;
    height: 1rem;
  }

  .guest-summary {
    margin: 0;
    font-size: 13px;
    color: var(--loomi-calendar-text-muted);
  }

  .guest-summary strong {
    color: var(--loomi-calendar-text);
    font-weight: 700;
  }

  .upcoming-about-title {
    margin: 0 0 8px;
    font-size: 14px;
    font-weight: 700;
    color: var(--loomi-calendar-text);
  }

  .upcoming-description {
    display: flex;
    flex-direction: column;
    gap: 6px;
    color: var(--loomi-calendar-text-secondary);
    font-size: 13px;
    line-height: 1.55;
  }

  .upcoming-description p {
    margin: 0;
  }

  .upcoming-link {
    color: var(--loomi-calendar-text);
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  .upcoming-meeting-id {
    color: var(--loomi-calendar-text-faint);
    font-size: 12px;
  }

  .form-textarea {
    min-height: 96px;
    resize: vertical;
  }

  .btn-primary {
    background: var(--loomi-calendar-accent);
    border-color: var(--loomi-calendar-accent);
    color: var(--loomi-white, #ffffff);
    font-weight: 600;
  }

  .btn-primary:hover {
    background: var(--loomi-calendar-accent-strong);
    border-color: var(--loomi-calendar-accent-strong);
    color: var(--loomi-white, #ffffff);
  }

  .event-form {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .form-field,
  .form-check {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .form-check {
    flex-direction: row;
    align-items: center;
    gap: 8px;
    font-size: 14px;
  }

  .form-label {
    font-size: 12px;
    font-weight: 700;
    color: var(--loomi-calendar-text-muted);
  }

  .form-input {
    width: 100%;
    min-height: 38px;
    padding: 8px 12px;
    border: 1px solid var(--loomi-calendar-border);
    border-radius: var(--loomi-calendar-radius-sm);
    background: var(--loomi-calendar-surface);
    color: inherit;
    font: inherit;
  }

  .month-weeks {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
  }

  .month-week {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    border-bottom: 1px solid var(--loomi-calendar-border-subtle);
  }

  .month-week:last-child {
    border-bottom: 0;
  }

  .month-week-lanes {
    position: relative;
    min-height: calc(var(--lane-count, 1) * 24px + 8px);
    border-bottom: 1px solid var(--loomi-calendar-border-subtle);
    background: color-mix(in srgb, var(--loomi-calendar-surface-muted) 40%, transparent);
  }

  .month-week-days {
    flex: 1;
  }

  .spanning-event {
    position: absolute;
    box-sizing: border-box;
    min-height: 20px;
    padding: 2px 8px;
    border: 1px solid transparent;
    border-radius: 6px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12px;
    font-weight: 700;
    text-align: left;
    cursor: pointer;
    z-index: 2;
  }

  .spanning-event.draggable {
    cursor: grab;
  }

  .spanning-event.dragging {
    cursor: grabbing;
    opacity: 0.92;
    z-index: 5;
  }

  .all-day-track {
    position: relative;
    min-height: calc(var(--lane-count, 1) * 28px + 8px);
    padding: 4px 0;
  }

  .all-day-columns {
    position: absolute;
    inset: 0;
    display: grid;
    grid-template-columns: repeat(var(--day-count, 7), minmax(0, 1fr));
  }

  .all-day-column {
    border-right: 1px solid var(--loomi-calendar-border-subtle);
  }

  .all-day-column:last-child {
    border-right: 0;
  }

  .resize-handle.resize-start,
  .resize-handle.resize-end {
    top: 0;
    bottom: 0;
    width: 8px;
    height: auto;
    cursor: ew-resize;
  }

  .resize-handle.resize-start {
    left: 0;
    right: auto;
  }

  .resize-handle.resize-end {
    right: 0;
    left: auto;
  }

  .resize-handle.resize-bottom {
    top: auto;
    bottom: 0;
    height: 8px;
    cursor: ns-resize;
  }

  .toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 14px 16px;
    border-bottom: 1px solid var(--loomi-calendar-border-subtle);
    background: linear-gradient(
      180deg,
      color-mix(in srgb, var(--loomi-calendar-surface) 92%, var(--loomi-calendar-accent-softer)) 0%,
      var(--loomi-calendar-surface) 100%
    );
    backdrop-filter: blur(8px);
  }

  .toolbar-group {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
  }

  .view-switcher {
    max-width: 100%;
    overflow-x: auto;
  }

  .title {
    font-size: 1.125rem;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: var(--loomi-calendar-text);
    min-width: 0;
  }

  .timezone-badge {
    display: inline-flex;
    align-items: center;
    min-height: 28px;
    padding: 0 10px;
    border-radius: 999px;
    border: 1px solid var(--loomi-calendar-border-subtle);
    background: color-mix(in srgb, var(--loomi-calendar-surface-muted) 80%, transparent);
    color: var(--loomi-calendar-text-muted);
    font-size: 12px;
    font-weight: 600;
  }

  .btn,
  .seg-btn,
  .weekday-btn {
    transition:
      border-color var(--loomi-calendar-transition),
      background var(--loomi-calendar-transition),
      color var(--loomi-calendar-transition),
      box-shadow var(--loomi-calendar-transition),
      transform var(--loomi-calendar-transition);
  }

  .btn,
  .seg-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-height: 34px;
    padding: 0 12px;
    border: 1px solid var(--loomi-calendar-border);
    border-radius: var(--loomi-calendar-radius-sm);
    background: var(--loomi-calendar-surface);
    color: inherit;
    font: inherit;
    cursor: pointer;
  }

  .btn:hover,
  .seg-btn:hover {
    border-color: color-mix(in srgb, var(--loomi-calendar-accent) 35%, var(--loomi-calendar-border));
    background: var(--loomi-calendar-surface-hover);
  }

  .btn:focus-visible,
  .seg-btn:focus-visible,
  .weekday-btn:focus-visible,
  .day-num:focus-visible,
  .event-pill:focus-visible,
  .timed-event:focus-visible,
  .agenda-item:focus-visible {
    outline: 2px solid var(--loomi-calendar-accent);
    outline-offset: 2px;
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
    padding: 3px;
    border: 1px solid var(--loomi-calendar-border-subtle);
    border-radius: 10px;
    background: color-mix(in srgb, var(--loomi-calendar-surface-muted) 88%, transparent);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.55);
  }

  .seg-btn {
    border: 0;
    background: transparent;
    min-height: 30px;
    padding: 0 11px;
    border-radius: 7px;
    color: var(--loomi-calendar-text-muted);
    font-size: 13px;
    font-weight: 600;
  }

  .seg-btn.active {
    background: var(--loomi-calendar-surface);
    color: var(--loomi-calendar-accent-strong);
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);
  }

  .body {
    display: flex;
    flex: 1;
    min-height: 0;
    position: relative;
    background: linear-gradient(180deg, var(--loomi-calendar-surface) 0%, color-mix(in srgb, var(--loomi-calendar-surface-muted) 28%, transparent) 100%);
  }

  .loading-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: color-mix(in srgb, var(--loomi-calendar-surface) 78%, transparent);
    backdrop-filter: blur(2px);
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
    border-bottom: 1px solid var(--loomi-calendar-border-subtle);
    background: color-mix(in srgb, var(--loomi-calendar-surface-muted) 72%, transparent);
  }

  .weekday {
    padding: 10px 8px;
    text-align: center;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: var(--loomi-calendar-text-faint);
    text-transform: uppercase;
  }

  .weekday-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    width: 100%;
    padding: 8px 6px;
    border: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    cursor: pointer;
  }

  .weekday-btn:hover {
    background: color-mix(in srgb, var(--loomi-calendar-accent-softer) 65%, transparent);
  }

  .weekday-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--loomi-calendar-text-faint);
  }

  .weekday-date {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 28px;
    min-height: 28px;
    border-radius: 999px;
    font-size: 14px;
    font-weight: 700;
    color: var(--loomi-calendar-text-secondary);
  }

  .weekday-btn.is-today .weekday-label {
    color: var(--loomi-calendar-accent);
  }

  .weekday-btn.is-today .weekday-date {
    background: var(--loomi-calendar-accent);
    color: var(--loomi-white, #ffffff);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--loomi-calendar-accent-soft) 70%, transparent);
  }

  .month-grid {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    grid-auto-rows: minmax(112px, 1fr);
    flex: 1;
    min-height: 0;
  }

  .month-cell {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
    padding: 6px;
    border-right: 1px solid var(--loomi-calendar-border-subtle);
    border-bottom: 1px solid var(--loomi-calendar-border-subtle);
    background: var(--loomi-calendar-surface);
    transition: background var(--loomi-calendar-transition);
  }

  .month-cell.interactive,
  .month-cell.editable {
    cursor: pointer;
  }

  .month-cell.interactive:hover,
  .month-cell.editable:hover {
    background: color-mix(in srgb, var(--loomi-calendar-accent-softer) 55%, var(--loomi-calendar-surface));
  }

  .month-cell:nth-child(7n) {
    border-right: 0;
  }

  .month-cell.other-month {
    background: color-mix(in srgb, var(--loomi-calendar-surface-muted) 72%, transparent);
  }

  .month-cell.today {
    background: color-mix(in srgb, var(--loomi-calendar-accent-softer) 42%, var(--loomi-calendar-surface));
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--loomi-calendar-accent-soft) 70%, transparent);
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
    font-weight: 700;
    cursor: pointer;
    transition:
      background var(--loomi-calendar-transition),
      color var(--loomi-calendar-transition),
      box-shadow var(--loomi-calendar-transition);
  }

  .day-num:hover {
    background: var(--loomi-calendar-surface-hover);
  }

  .month-cell.today .day-num,
  .day-num.today {
    background: var(--loomi-calendar-accent);
    color: var(--loomi-white, #ffffff);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--loomi-calendar-accent-soft) 75%, transparent);
  }

  .month-cell.other-month .day-num {
    color: var(--loomi-calendar-text-faint);
  }

  .event-pill {
    position: relative;
    display: block;
    width: 100%;
    min-width: 0;
    padding: 3px 8px 3px 10px;
    border: 0;
    border-radius: 6px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
    font: inherit;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 1px 1px rgba(15, 23, 42, 0.04);
    transition:
      transform var(--loomi-calendar-transition),
      box-shadow var(--loomi-calendar-transition),
      filter var(--loomi-calendar-transition);
  }

  .event-pill::before {
    content: "";
    position: absolute;
    left: 0;
    top: 4px;
    bottom: 4px;
    width: 3px;
    border-radius: 999px;
    background: currentColor;
    opacity: 0.55;
  }

  .event-pill:hover {
    transform: translateY(-1px);
    box-shadow: 0 3px 8px rgba(15, 23, 42, 0.08);
    filter: saturate(1.05);
  }

  .event-pill.more {
    background: transparent;
    color: var(--loomi-calendar-accent-strong);
    cursor: pointer;
    font-weight: 600;
    box-shadow: none;
    padding-left: 8px;
  }

  .event-pill.more::before {
    display: none;
  }

  .event-pill.more:hover {
    background: color-mix(in srgb, var(--loomi-calendar-accent-softer) 70%, transparent);
    transform: none;
  }

  .time-layout {
    display: flex;
    flex: 1;
    min-height: 0;
    overflow: auto;
  }

  .time-axis {
    width: var(--loomi-calendar-time-axis-width, 72px);
    flex: none;
    border-right: 1px solid var(--loomi-calendar-border-subtle);
    background: color-mix(in srgb, var(--loomi-calendar-surface) 90%, transparent);
    position: sticky;
    left: 0;
    z-index: 3;
    padding-left: 10px;
    box-sizing: border-box;
  }

  .time-axis-label {
    height: var(--loomi-calendar-hour-height, 48px);
    padding: 0 10px 0 0;
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    transform: translateY(-8px);
    color: var(--loomi-calendar-text-faint);
    font-size: 11px;
    font-weight: 600;
  }

  .shell.sidebar-closed .body {
    padding-left: 4px;
  }

  .shell.sidebar-closed .time-layout {
    padding-left: 6px;
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
    border-bottom: 1px solid var(--loomi-calendar-border-subtle);
    background: color-mix(in srgb, var(--loomi-calendar-surface-muted) 72%, transparent);
  }

  .all-day-label {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 8px;
    color: var(--loomi-calendar-text-faint);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.05em;
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

  .time-slots.editable {
    cursor: crosshair;
  }

  .time-slot {
    height: var(--loomi-calendar-hour-height, 48px);
    border-bottom: 1px solid var(--loomi-calendar-border-subtle);
    box-sizing: border-box;
  }

  .slot-selection {
    position: absolute;
    left: 4px;
    right: 4px;
    border-radius: 8px;
    border: 1px dashed color-mix(in srgb, var(--loomi-calendar-accent) 55%, transparent);
    background: color-mix(in srgb, var(--loomi-calendar-accent-softer) 78%, transparent);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--loomi-calendar-accent-soft) 45%, transparent);
    pointer-events: none;
    z-index: 3;
  }

  .now-line {
    position: absolute;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--loomi-calendar-now);
    box-shadow: 0 0 0 1px color-mix(in srgb, var(--loomi-calendar-now) 20%, transparent), 0 0 8px color-mix(in srgb, var(--loomi-calendar-now) 35%, transparent);
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
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--loomi-calendar-now) 18%, transparent);
  }

  .timed-event {
    position: absolute;
    box-sizing: border-box;
    padding: 5px 8px 5px 11px;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid transparent;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.06), 0 4px 12px rgba(15, 23, 42, 0.04);
    cursor: pointer;
    z-index: 2;
    text-align: left;
    transition:
      transform var(--loomi-calendar-transition),
      box-shadow var(--loomi-calendar-transition);
  }

  .timed-event::before {
    content: "";
    position: absolute;
    left: 0;
    top: 6px;
    bottom: 6px;
    width: 3px;
    border-radius: 999px;
    background: currentColor;
    opacity: 0.5;
  }

  .timed-event:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(15, 23, 42, 0.08), 0 8px 18px rgba(15, 23, 42, 0.06);
  }

  .timed-event.draggable {
    cursor: grab;
  }

  .timed-event.dragging {
    cursor: grabbing;
    opacity: 0.92;
    z-index: 10;
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12);
  }

  .timed-event-title {
    font-size: 12px;
    font-weight: 700;
    line-height: 1.25;
  }

  .timed-event-meta {
    margin-top: 2px;
    font-size: 11px;
    opacity: 0.85;
    line-height: 1.25;
  }

  .resize-handle {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 8px;
    cursor: ns-resize;
  }

  .agenda-list {
    overflow: auto;
    flex: 1;
  }

  .agenda-day {
    border-bottom: 1px solid var(--loomi-calendar-border-subtle);
  }

  .agenda-day-header {
    padding: 12px 16px;
    background: color-mix(in srgb, var(--loomi-calendar-surface-muted) 72%, transparent);
    font-weight: 700;
    letter-spacing: -0.01em;
    color: var(--loomi-calendar-text-secondary);
  }

  .agenda-item {
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: 12px;
    width: 100%;
    padding: 14px 16px;
    border: 0;
    border-top: 1px solid var(--loomi-calendar-border-subtle);
    background: var(--loomi-calendar-surface);
    text-align: left;
    cursor: pointer;
    color: inherit;
    font: inherit;
    transition: background var(--loomi-calendar-transition);
  }

  .agenda-item:hover {
    background: color-mix(in srgb, var(--loomi-calendar-accent-softer) 45%, var(--loomi-calendar-surface-hover));
  }

  .agenda-time {
    color: var(--loomi-calendar-text-muted);
    font-size: 12px;
    font-weight: 600;
  }

  .agenda-title {
    font-weight: 700;
    letter-spacing: -0.01em;
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
    background: color-mix(in srgb, var(--loomi-calendar-surface-muted) 82%, transparent);
    border-bottom: 1px solid var(--loomi-calendar-border-subtle);
    backdrop-filter: blur(6px);
  }

  .resource-label,
  .resource-name {
    display: flex;
    align-items: center;
    padding: 10px 12px;
    border-right: 1px solid var(--loomi-calendar-border-subtle);
    background: color-mix(in srgb, var(--loomi-calendar-surface-muted) 72%, transparent);
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
    cursor: crosshair;
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

  .event-primary {
    background: color-mix(in srgb, var(--loomi-primary-100, #dbeafe) 88%, white);
    color: var(--loomi-primary-800, #1e40af);
    border-color: color-mix(in srgb, var(--loomi-primary-200, #bfdbfe) 80%, transparent);
  }

  .event-secondary {
    background: color-mix(in srgb, var(--loomi-secondary-100, #f3f4f6) 88%, white);
    color: var(--loomi-secondary-800, #1f2937);
    border-color: color-mix(in srgb, var(--loomi-secondary-200, #e5e7eb) 80%, transparent);
  }

  .event-success {
    background: color-mix(in srgb, var(--loomi-success-100, #d1fae5) 88%, white);
    color: var(--loomi-success-800, #065f46);
    border-color: color-mix(in srgb, var(--loomi-success-200, #a7f3d0) 80%, transparent);
  }

  .event-warning {
    background: color-mix(in srgb, var(--loomi-warning-100, #fef3c7) 88%, white);
    color: var(--loomi-warning-800, #92400e);
    border-color: color-mix(in srgb, var(--loomi-warning-200, #fde68a) 80%, transparent);
  }

  .event-error {
    background: color-mix(in srgb, var(--loomi-error-100, #fee2e2) 88%, white);
    color: var(--loomi-error-800, #991b1b);
    border-color: color-mix(in srgb, var(--loomi-error-200, #fecaca) 80%, transparent);
  }

  @media (max-width: 720px) {
    .toolbar {
      padding: 12px;
    }

    .title {
      font-size: 1rem;
    }

    .segmented {
      width: 100%;
      overflow-x: auto;
    }

    .seg-btn {
      flex: 1 0 auto;
      padding-inline: 9px;
    }

    .month-grid {
      grid-auto-rows: minmax(96px, 1fr);
    }

    .agenda-item {
      grid-template-columns: 1fr;
      gap: 6px;
    }
  }
`;
