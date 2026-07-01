import { css, html, nothing, svg } from "lit";
import { customElement } from "lit/decorators.js";
import {
  LoomiElement,
  loomiDateFormatter,
  loomiMonthName,
  loomiStyles,
  loomiWeekdayNames
} from "@loomidev/core";
import { calendarStyles } from "./calendar-styles.js";
import {
  ALL_DAY_HEIGHT,
  HOUR_HEIGHT,
  RESOURCE_LABEL_WIDTH,
  addMinutes,
  buildAgendaGroups,
  canDragEvent,
  cloneDate,
  dateFromGridPosition,
  dateFromResourcePosition,
  endOfDay,
  formatEventRange,
  formatTime,
  formatTimezoneLabel,
  getAllDayEventsForDate,
  getEventsForDate,
  getMonthGridDays,
  getNowOffset,
  getVisibleWeekDays,
  isSameDay,
  isToday,
  layoutResourceDayEvents,
  layoutTimedEvents,
  minutesFromDayStart,
  startOfDay
} from "./calendar-utils.js";
import type {
  CalendarEvent,
  CalendarEventChangeDetail,
  CalendarEventClickDetail,
  CalendarEventColor,
  CalendarResource,
  CalendarSlotSelectDetail,
  CalendarView,
  CalendarViewChangeDetail,
  CalendarDateChangeDetail,
  CalendarWeekStarts
} from "./types.js";

const PREV = svg`<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />`;
const NEXT = svg`<path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />`;

const VIEW_OPTIONS: Array<{ id: CalendarView; label: string; shortcut: string }> = [
  { id: "month", label: "Month", shortcut: "M" },
  { id: "week", label: "Week", shortcut: "W" },
  { id: "day", label: "Day", shortcut: "D" },
  { id: "agenda", label: "Agenda", shortcut: "A" },
  { id: "resource", label: "Resources", shortcut: "R" }
];

type DragMode = "move" | "resize";

interface DragState {
  eventId: string;
  mode: DragMode;
  pointerId: number;
  startPointerY: number;
  currentDeltaY: number;
  originalStart: Date;
  originalEnd: Date;
  originalResourceId?: string;
  day: Date;
  resourceId?: string;
}

interface SlotDragState {
  pointerId: number;
  day: Date;
  start: Date;
  end: Date;
  container: HTMLElement;
}

@customElement("loomi-calendar")
export class LoomiCalendar extends LoomiElement {
  static properties = {
    ...LoomiElement.properties,
    events: { attribute: false },
    resources: { attribute: false },
    view: { type: String, reflect: true },
    date: { attribute: false },
    locale: { type: String },
    weekStarts: { attribute: "week-starts" },
    timezone: { type: String },
    showTimezone: { attribute: "show-timezone", type: Boolean },
    showWeekends: { attribute: "show-weekends", type: Boolean },
    editable: { type: Boolean, reflect: true },
    loading: { type: Boolean, reflect: true },
    startHour: { attribute: "start-hour", type: Number },
    endHour: { attribute: "end-hour", type: Number },
    slotMinutes: { attribute: "slot-minutes", type: Number },
    _dragState: { state: true },
    _slotDragState: { state: true }
  };

  static override styles = loomiStyles(calendarStyles, css`
    :host {
      --loomi-calendar-hour-height: ${HOUR_HEIGHT}px;
      --loomi-calendar-hour-count: 12;
      --loomi-calendar-resource-label-width: ${RESOURCE_LABEL_WIDTH}px;
    }
  `);

  events: CalendarEvent[] = [];
  resources: CalendarResource[] = [];
  view: CalendarView = "month";
  date: Date = new Date();
  locale = "";
  weekStarts: CalendarWeekStarts = "sunday";
  timezone = "";
  showTimezone = false;
  showWeekends = true;
  editable = false;
  loading = false;
  startHour = 6;
  endHour = 18;
  slotMinutes = 30;
  declare _dragState?: DragState;
  declare _slotDragState?: SlotDragState;

  private boundPointerMove = (event: PointerEvent) => this.handlePointerMove(event);
  private boundPointerUp = (event: PointerEvent) => this.handlePointerUp(event);

  override connectedCallback() {
    super.connectedCallback();
    if (!this.hasAttribute("tabindex")) {
      this.tabIndex = 0;
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._dragState = undefined;
    this._slotDragState = undefined;
    this.detachPointerListeners();
  }

  override render() {
    const hourCount = Math.max(1, this.endHour - this.startHour);
    this.style.setProperty("--loomi-calendar-hour-count", String(hourCount));

    return html`
      <div class="shell" @keydown=${this.handleKeydown}>
        ${this.renderToolbar()}
        <div class="body">
          ${this.loading ? html`<div class="loading-overlay">Loading calendar…</div>` : nothing}
          ${this.view === "month" ? this.renderMonthView() : nothing}
          ${this.view === "agenda" ? this.renderAgendaView() : nothing}
          ${this.view === "resource" ? this.renderResourceView() : nothing}
          ${this.view === "week" || this.view === "day" ? this.renderTimeView() : nothing}
        </div>
      </div>
    `;
  }

  private renderToolbar() {
    return html`
      <div class="toolbar">
        <div class="toolbar-group">
          <div class="title">${this.getFormattedTitle()}</div>
          ${this.showTimezone && this.displayTimezone
            ? html`<span class="timezone-badge">${formatTimezoneLabel(this.displayTimezone, this.resolvedLocale)}</span>`
            : nothing}
        </div>
        <div class="toolbar-group">
          <button class="btn" @click=${this.goToToday}>Today</button>
          <button class="btn icon" aria-label="Previous" @click=${this.goPrev}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">${PREV}</svg>
          </button>
          <button class="btn icon" aria-label="Next" @click=${this.goNext}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">${NEXT}</svg>
          </button>
          <div class="segmented" role="tablist" aria-label="Calendar view">
            ${VIEW_OPTIONS.map((option) => html`
              <button
                class="seg-btn ${this.view === option.id ? "active" : ""}"
                role="tab"
                aria-selected=${this.view === option.id ? "true" : "false"}
                title=${`Shortcut: ${option.shortcut}`}
                @click=${() => this.changeView(option.id)}
              >${option.label}</button>
            `)}
          </div>
        </div>
      </div>
    `;
  }

  private renderMonthView() {
    const cells = getMonthGridDays(this.date, this.weekStarts);
    const weekdays = loomiWeekdayNames(this.resolvedLocale, this.weekStarts);

    return html`
      <div class="month-view">
        <div class="weekdays" style=${`grid-template-columns: repeat(7, minmax(0, 1fr))`}>
          ${weekdays.map((label) => html`<div class="weekday">${label}</div>`)}
        </div>
        <div class="month-grid">
          ${cells.map(({ date, isOtherMonth }) => this.renderMonthCell(date, isOtherMonth))}
        </div>
      </div>
    `;
  }

  private renderMonthCell(date: Date, isOtherMonth: boolean) {
    const dayEvents = getEventsForDate(this.events, date);
    const today = isToday(date);
    const hiddenCount = Math.max(0, dayEvents.length - 3);

    return html`
      <div
        class="month-cell ${isOtherMonth ? "other-month" : ""} ${today ? "today" : ""} ${this.editable ? "editable" : "interactive"}"
        @click=${(event: MouseEvent) => this.handleMonthCellClick(event, date)}
      >
        <button
          class="day-num ${today ? "today" : ""}"
          @click=${(event: Event) => {
            event.stopPropagation();
            this.openDayView(date);
          }}
          aria-label=${loomiDateFormatter(this.resolvedLocale, { dateStyle: "full" }).format(date)}
        >${date.getDate()}</button>
        ${dayEvents.slice(0, 3).map((event) => this.renderEventPill(event))}
        ${hiddenCount > 0
          ? html`
            <button
              class="event-pill more"
              @click=${(event: Event) => {
                event.stopPropagation();
                this.openDayView(date);
              }}
            >+${hiddenCount} more</button>
          `
          : nothing}
      </div>
    `;
  }

  private renderTimeView() {
    const days = this.view === "day"
      ? [startOfDay(this.date)]
      : getVisibleWeekDays(this.date, this.weekStarts, this.showWeekends);
    const hourCount = this.endHour - this.startHour;

    return html`
      <div class="month-view">
        <div
          class="weekdays"
          style=${`grid-template-columns: 64px repeat(${days.length}, minmax(0, 1fr))`}
        >
          <div class="weekday"></div>
          ${days.map((day) => {
            const weekdayIndex = (day.getDay() - (this.weekStarts === "monday" ? 1 : 0) + 7) % 7;
            const weekdayLabel = loomiWeekdayNames(this.resolvedLocale, this.weekStarts)[weekdayIndex];
            return html`
            <button
              type="button"
              class="weekday weekday-btn ${isToday(day) ? "is-today" : ""}"
              @click=${() => this.openDayView(day)}
              aria-label=${loomiDateFormatter(this.resolvedLocale, { weekday: "long", month: "long", day: "numeric" }).format(day)}
            >
              <span class="weekday-label">${weekdayLabel}</span>
              <span class="weekday-date">${day.getDate()}</span>
            </button>
          `;
          })}
        </div>
        ${this.renderAllDayRow(days)}
        <div class="time-layout">
          <div class="time-axis">
            ${Array.from({ length: hourCount }, (_, index) => {
              const hour = this.startHour + index;
              const labelDate = new Date(2023, 0, 1, hour, 0, 0);
              return html`<div class="time-axis-label">${formatTime(labelDate, this.resolvedLocale, this.displayTimezone)}</div>`;
            })}
          </div>
          <div class="time-grid-wrap">
            ${days.map((day) => this.renderDayColumn(day))}
          </div>
        </div>
      </div>
    `;
  }

  private renderAllDayRow(days: Date[]) {
    return html`
      <div
        class="all-day-row"
        style=${`grid-template-columns: 64px repeat(${days.length}, minmax(0, 1fr))`}
      >
        <div class="all-day-label">All day</div>
        ${days.map((day) => html`
          <div class="all-day-cell">
            ${getAllDayEventsForDate(this.events, day).map((event) => this.renderEventPill(event))}
          </div>
        `)}
      </div>
    `;
  }

  private renderDayColumn(day: Date) {
    const positioned = layoutTimedEvents(this.events, day, this.startHour, this.endHour);
    const nowOffset = isToday(day) ? getNowOffset(this.startHour, this.endHour, HOUR_HEIGHT) : null;
    const hourCount = this.endHour - this.startHour;

    return html`
      <div class="day-column">
        <div
          class="time-slots ${this.editable ? "editable" : ""}"
          style=${`height: ${hourCount * HOUR_HEIGHT}px`}
          @pointerdown=${this.editable ? (event: PointerEvent) => this.handleTimeSlotsPointerDown(event, day) : nothing}
        >
          ${Array.from({ length: hourCount }, () => html`<div class="time-slot"></div>`)}
          ${this.renderSlotSelection(day)}
          ${nowOffset !== null ? html`<div class="now-line" style=${`top: ${nowOffset}px`}></div>` : nothing}
          ${positioned.map((entry) => this.renderTimedEvent(entry.event, day, entry.top, entry.height, entry.left, entry.width))}
        </div>
      </div>
    `;
  }

  private renderSlotSelection(day: Date) {
    const preview = this.getSlotSelectionPreview(day);
    if (!preview) {
      return nothing;
    }

    return html`
      <div
        class="slot-selection"
        style=${`top: ${preview.top}px; height: ${preview.height}px`}
      ></div>
    `;
  }

  private getSlotSelectionPreview(day: Date): { top: number; height: number } | null {
    if (!this._slotDragState || !isSameDay(this._slotDragState.day, day)) {
      return null;
    }

    const { start, end } = this.normalizeSlotRange(this._slotDragState.start, this._slotDragState.end);
    const startMinutes = Math.max(0, minutesFromDayStart(start, this.startHour));
    const endMinutes = Math.max(startMinutes + this.slotMinutes, minutesFromDayStart(end, this.startHour));
    return {
      top: (startMinutes / 60) * HOUR_HEIGHT,
      height: Math.max(22, ((endMinutes - startMinutes) / 60) * HOUR_HEIGHT)
    };
  }

  private renderAgendaView() {
    const rangeStart = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
    const rangeEnd = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);
    const groups = buildAgendaGroups(this.events, rangeStart, rangeEnd);

    if (!groups.length) {
      return html`<div class="empty-state">No events scheduled for this range.</div>`;
    }

    return html`
      <div class="agenda-view">
        <div class="agenda-list">
          ${groups.map((group) => html`
            <section class="agenda-day">
              <div class="agenda-day-header">
                ${loomiDateFormatter(this.resolvedLocale, { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(group.date)}
              </div>
              ${group.events.map((event) => html`
                <button class="agenda-item" @click=${(clickEvent: Event) => this.handleEventClick(clickEvent, event)}>
                  <div class="agenda-time">${formatEventRange(event, this.resolvedLocale, this.displayTimezone)}</div>
                  <div>
                    <div class="agenda-title">${event.title}</div>
                    ${event.description ? html`<div class="agenda-description">${event.description}</div>` : nothing}
                    ${event.recurrence?.label
                      ? html`<div class="agenda-meta">${event.recurrence.label}</div>`
                      : nothing}
                    ${event.resourceId
                      ? html`<div class="agenda-meta">${this.getResourceLabel(event.resourceId)}</div>`
                      : nothing}
                  </div>
                </button>
              `)}
            </section>
          `)}
        </div>
      </div>
    `;
  }

  private renderResourceView() {
    const resources = this.resources.length
      ? this.resources
      : [{ id: "default", label: "Schedule", color: "primary" as CalendarEventColor }];
    const hourCount = this.endHour - this.startHour;
    const day = startOfDay(this.date);

    return html`
      <div class="resource-view">
        <div class="resource-grid">
          <div class="resource-header">
            <div class="resource-label">Resources</div>
            <div class="resource-hours">
              ${Array.from({ length: hourCount }, (_, index) => {
                const hour = this.startHour + index;
                const labelDate = new Date(2023, 0, 1, hour, 0, 0);
                return html`<div class="resource-hour">${formatTime(labelDate, this.resolvedLocale, this.displayTimezone)}</div>`;
              })}
            </div>
          </div>
          ${resources.map((resource) => this.renderResourceRow(resource, day, hourCount))}
        </div>
      </div>
    `;
  }

  private renderResourceRow(resource: CalendarResource, day: Date, hourCount: number) {
    const positioned = layoutResourceDayEvents(this.events, resource.id, day, this.startHour, this.endHour);

    return html`
      <div class="resource-row">
        <div class="resource-name">${resource.label}</div>
        <div
          class="resource-timeline"
          style=${`height: ${Math.max(ALL_DAY_HEIGHT, 72)}px`}
          @click=${(event: MouseEvent) => this.handleResourceTrackClick(event, day, resource.id)}
        >
          <div class="resource-track">
            ${Array.from({ length: hourCount }, () => html`<div class="resource-slot"></div>`)}
          </div>
          ${positioned.map(({ event, left, width }) => html`
            <button
              class="timed-event event-${event.color || resource.color || "primary"} ${canDragEvent(event, this.editable) ? "draggable" : ""}"
              style=${`left: ${left}%; width: ${width}%; top: 8px; height: calc(100% - 16px);`}
              @click=${(clickEvent: Event) => this.handleEventClick(clickEvent, event)}
              @pointerdown=${(pointerEvent: PointerEvent) => this.handleEventPointerDown(pointerEvent, event, day, resource.id)}
            >
              <div class="timed-event-title">${event.title}</div>
              <div class="timed-event-meta">${formatEventRange(event, this.resolvedLocale, this.displayTimezone)}</div>
            </button>
          `)}
        </div>
      </div>
    `;
  }

  private renderEventPill(event: CalendarEvent) {
    return html`
      <button
        class="event-pill event-${event.color || "primary"}"
        title=${event.title}
        @click=${(clickEvent: Event) => this.handleEventClick(clickEvent, event)}
      >
        ${event.isAllDay ? "" : `${formatTime(event.start, this.resolvedLocale, event.timezone || this.displayTimezone)} `}
        ${event.title}
        ${event.recurrence?.label ? ` · ${event.recurrence.label}` : ""}
      </button>
    `;
  }

  private renderTimedEvent(
    event: CalendarEvent,
    day: Date,
    top: number,
    height: number,
    left: number,
    width: number
  ) {
    const preview = this.getDragPreview(event);
    const displayTop = preview?.top ?? top;
    const displayHeight = preview?.height ?? height;
    const draggable = canDragEvent(event, this.editable);
    const dragging = this._dragState?.eventId === event.id;

    return html`
      <button
        class="timed-event event-${event.color || "primary"} ${draggable ? "draggable" : ""} ${dragging ? "dragging" : ""}"
        style=${`top: ${displayTop}px; height: ${displayHeight}px; left: calc(${left}% + 2px); width: calc(${width}% - 4px);`}
        @click=${(clickEvent: Event) => this.handleEventClick(clickEvent, event)}
        @pointerdown=${(pointerEvent: PointerEvent) => this.handleEventPointerDown(pointerEvent, event, day)}
      >
        <div class="timed-event-title">${event.title}</div>
        ${displayHeight >= 40
          ? html`<div class="timed-event-meta">${formatEventRange(event, this.resolvedLocale, this.displayTimezone)}</div>`
          : nothing}
        ${event.recurrence?.label && displayHeight >= 56
          ? html`<div class="timed-event-meta">${event.recurrence.label}</div>`
          : nothing}
        ${draggable ? html`<span class="resize-handle" @pointerdown=${(pointerEvent: PointerEvent) => this.handleResizePointerDown(pointerEvent, event, day)}></span>` : nothing}
      </button>
    `;
  }

  private getDragPreview(event: CalendarEvent): { top: number; height: number } | null {
    if (!this._dragState || this._dragState.eventId !== event.id) {
      return null;
    }

    const deltaMinutes = Math.round(((this._dragState.currentDeltaY / HOUR_HEIGHT) * 60) / this.slotMinutes) * this.slotMinutes;

    if (this._dragState.mode === "resize") {
      const nextEnd = addMinutes(this._dragState.originalEnd, deltaMinutes);
      const startMinutes = Math.max(0, (this._dragState.originalStart.getHours() - this.startHour) * 60 + this._dragState.originalStart.getMinutes());
      const endMinutes = Math.max(startMinutes + this.slotMinutes, (nextEnd.getHours() - this.startHour) * 60 + nextEnd.getMinutes());
      return {
        top: (startMinutes / 60) * HOUR_HEIGHT,
        height: Math.max(22, ((endMinutes - startMinutes) / 60) * HOUR_HEIGHT)
      };
    }

    const nextStart = addMinutes(this._dragState.originalStart, deltaMinutes);
    const durationMs = this._dragState.originalEnd.getTime() - this._dragState.originalStart.getTime();
    const nextEnd = new Date(nextStart.getTime() + durationMs);
    const startMinutes = Math.max(0, (nextStart.getHours() - this.startHour) * 60 + nextStart.getMinutes());
    const endMinutes = Math.max(startMinutes + this.slotMinutes, (nextEnd.getHours() - this.startHour) * 60 + nextEnd.getMinutes());
    return {
      top: (startMinutes / 60) * HOUR_HEIGHT,
      height: Math.max(22, ((endMinutes - startMinutes) / 60) * HOUR_HEIGHT)
    };
  }

  private handleEventPointerDown(pointerEvent: PointerEvent, event: CalendarEvent, day: Date, resourceId?: string) {
    if (!canDragEvent(event, this.editable)) {
      return;
    }

    pointerEvent.stopPropagation();
    this._dragState = {
      eventId: event.id,
      mode: "move",
      pointerId: pointerEvent.pointerId,
      startPointerY: pointerEvent.clientY,
      currentDeltaY: 0,
      originalStart: cloneDate(event.start),
      originalEnd: cloneDate(event.end),
      originalResourceId: event.resourceId,
      day,
      resourceId
    };

    this.attachPointerListeners();
    (pointerEvent.currentTarget as HTMLElement).setPointerCapture(pointerEvent.pointerId);
  }

  private handleResizePointerDown(pointerEvent: PointerEvent, event: CalendarEvent, day: Date) {
    if (!canDragEvent(event, this.editable)) {
      return;
    }

    pointerEvent.stopPropagation();
    this._dragState = {
      eventId: event.id,
      mode: "resize",
      pointerId: pointerEvent.pointerId,
      startPointerY: pointerEvent.clientY,
      currentDeltaY: 0,
      originalStart: cloneDate(event.start),
      originalEnd: cloneDate(event.end),
      originalResourceId: event.resourceId,
      day
    };

    this.attachPointerListeners();
    (pointerEvent.currentTarget as HTMLElement).setPointerCapture(pointerEvent.pointerId);
  }

  private handlePointerMove(pointerEvent: PointerEvent) {
    if (this._slotDragState && pointerEvent.pointerId === this._slotDragState.pointerId) {
      const rect = this._slotDragState.container.getBoundingClientRect();
      const offsetY = pointerEvent.clientY - rect.top;
      const end = dateFromGridPosition(
        this._slotDragState.day,
        offsetY,
        this.startHour,
        HOUR_HEIGHT,
        this.slotMinutes
      );
      this._slotDragState = {
        ...this._slotDragState,
        end
      };
      this.requestUpdate();
      return;
    }

    if (!this._dragState || pointerEvent.pointerId !== this._dragState.pointerId) {
      return;
    }

    this._dragState = {
      ...this._dragState,
      currentDeltaY: pointerEvent.clientY - this._dragState.startPointerY
    };
    this.requestUpdate();
  }

  private handlePointerUp(pointerEvent: PointerEvent) {
    if (this._slotDragState && pointerEvent.pointerId === this._slotDragState.pointerId) {
      const { start, end } = this.normalizeSlotRange(this._slotDragState.start, this._slotDragState.end);
      let nextStart = start;
      let nextEnd = end;
      if (nextEnd.getTime() - nextStart.getTime() < this.slotMinutes * 60 * 1000) {
        nextEnd = addMinutes(nextStart, this.slotMinutes);
      }
      this.dispatchSlotSelect({ start: nextStart, end: nextEnd, allDay: false });
      this._slotDragState = undefined;
      this.detachPointerListeners();
      this.requestUpdate();
      return;
    }

    if (!this._dragState || pointerEvent.pointerId !== this._dragState.pointerId) {
      return;
    }

    const event = this.events.find((entry) => entry.id === this._dragState!.eventId);
    if (event) {
      const deltaMinutes = Math.round(((this._dragState.currentDeltaY / HOUR_HEIGHT) * 60) / this.slotMinutes) * this.slotMinutes;
      const durationMs = this._dragState.originalEnd.getTime() - this._dragState.originalStart.getTime();
      let nextStart = this._dragState.originalStart;
      let nextEnd = this._dragState.originalEnd;

      if (this._dragState.mode === "move") {
        nextStart = addMinutes(this._dragState.originalStart, deltaMinutes);
        nextEnd = new Date(nextStart.getTime() + durationMs);
      } else {
        nextEnd = addMinutes(this._dragState.originalEnd, deltaMinutes);
        if (nextEnd <= nextStart) {
          nextEnd = addMinutes(nextStart, this.slotMinutes);
        }
      }

      const changed = nextStart.getTime() !== event.start.getTime() || nextEnd.getTime() !== event.end.getTime();
      if (changed) {
        const updated: CalendarEvent = {
          ...event,
          start: nextStart,
          end: nextEnd,
          resourceId: this._dragState.resourceId ?? event.resourceId
        };
        this.dispatchEvent(new CustomEvent<CalendarEventChangeDetail>("loomi-event-change", {
          detail: {
            event: updated,
            previousStart: this._dragState.originalStart,
            previousEnd: this._dragState.originalEnd,
            previousResourceId: this._dragState.originalResourceId
          },
          bubbles: true,
          composed: true
        }));
      }
    }

    this._dragState = undefined;
    this.detachPointerListeners();
    this.requestUpdate();
  }

  private attachPointerListeners() {
    window.addEventListener("pointermove", this.boundPointerMove);
    window.addEventListener("pointerup", this.boundPointerUp);
  }

  private detachPointerListeners() {
    window.removeEventListener("pointermove", this.boundPointerMove);
    window.removeEventListener("pointerup", this.boundPointerUp);
  }

  private handleTimeSlotsPointerDown(pointerEvent: PointerEvent, day: Date) {
    if (!this.editable || pointerEvent.button !== 0) {
      return;
    }

    const target = pointerEvent.target as HTMLElement;
    if (target.closest(".timed-event") || target.closest(".resize-handle")) {
      return;
    }

    const container = pointerEvent.currentTarget as HTMLElement;
    const rect = container.getBoundingClientRect();
    const offsetY = pointerEvent.clientY - rect.top;
    const start = dateFromGridPosition(day, offsetY, this.startHour, HOUR_HEIGHT, this.slotMinutes);

    pointerEvent.preventDefault();
    this._slotDragState = {
      pointerId: pointerEvent.pointerId,
      day,
      start,
      end: start,
      container
    };
    this.attachPointerListeners();
    container.setPointerCapture(pointerEvent.pointerId);
  }

  private handleMonthCellClick(event: MouseEvent, date: Date) {
    const target = event.target as HTMLElement;
    if (target.closest(".event-pill:not(.more)") || target.closest(".day-num")) {
      return;
    }

    if (this.editable) {
      this.dispatchSlotSelect({
        start: startOfDay(date),
        end: endOfDay(date),
        allDay: true
      });
      return;
    }

    this.openDayView(date);
  }

  private normalizeSlotRange(start: Date, end: Date) {
    if (start.getTime() <= end.getTime()) {
      return { start, end };
    }
    return { start: end, end: start };
  }

  private handleResourceTrackClick(event: MouseEvent, day: Date, resourceId: string) {
    if (!this.editable) {
      return;
    }

    const track = event.currentTarget as HTMLElement;
    const rect = track.getBoundingClientRect();
    const start = dateFromResourcePosition(day, event.clientX - rect.left, rect.width, this.startHour, this.endHour, this.slotMinutes);
    const end = addMinutes(start, this.slotMinutes);
    this.dispatchSlotSelect({ start, end, resourceId, allDay: false });
  }

  private dispatchSlotSelect(detail: CalendarSlotSelectDetail) {
    this.dispatchEvent(new CustomEvent<CalendarSlotSelectDetail>("loomi-slot-select", {
      detail,
      bubbles: true,
      composed: true
    }));
  }

  private handleEventClick(event: Event, calendarEvent: CalendarEvent) {
    event.stopPropagation();
    this.dispatchEvent(new CustomEvent<CalendarEventClickDetail>("loomi-event-click", {
      detail: { event: calendarEvent },
      bubbles: true,
      composed: true
    }));
  }

  private handleKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        this.goPrev();
        break;
      case "ArrowRight":
        event.preventDefault();
        this.goNext();
        break;
      case "t":
      case "T":
        event.preventDefault();
        this.goToToday();
        break;
      default: {
        const shortcut = VIEW_OPTIONS.find((option) => option.shortcut.toLowerCase() === event.key.toLowerCase());
        if (shortcut) {
          event.preventDefault();
          this.changeView(shortcut.id);
        }
      }
    }
  }

  private openDayView(date: Date) {
    this.date = startOfDay(date);
    this.changeView("day");
  }

  private changeView(view: CalendarView) {
    if (this.view === view) {
      return;
    }

    this.view = view;
    this.dispatchEvent(new CustomEvent<CalendarViewChangeDetail>("loomi-view-change", {
      detail: { view },
      bubbles: true,
      composed: true
    }));
  }

  private goPrev() {
    const next = cloneDate(this.date);
    if (this.view === "month" || this.view === "agenda") {
      next.setMonth(next.getMonth() - 1);
    } else if (this.view === "week") {
      next.setDate(next.getDate() - 7);
    } else {
      next.setDate(next.getDate() - 1);
    }
    this.updateDate(next);
  }

  private goNext() {
    const next = cloneDate(this.date);
    if (this.view === "month" || this.view === "agenda") {
      next.setMonth(next.getMonth() + 1);
    } else if (this.view === "week") {
      next.setDate(next.getDate() + 7);
    } else {
      next.setDate(next.getDate() + 1);
    }
    this.updateDate(next);
  }

  private goToToday() {
    this.updateDate(new Date());
  }

  private updateDate(date: Date) {
    this.date = date;
    this.dispatchEvent(new CustomEvent<CalendarDateChangeDetail>("loomi-date-change", {
      detail: { date },
      bubbles: true,
      composed: true
    }));
  }

  private getFormattedTitle() {
    if (this.view === "month" || this.view === "agenda") {
      return `${loomiMonthName(this.resolvedLocale, this.date.getMonth(), "long")} ${this.date.getFullYear()}`;
    }

    if (this.view === "day" || this.view === "resource") {
      return loomiDateFormatter(this.resolvedLocale, { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(this.date);
    }

    const days = getVisibleWeekDays(this.date, this.weekStarts, this.showWeekends);
    const start = days[0];
    const end = days[days.length - 1];

    if (isSameDay(start, end)) {
      return loomiDateFormatter(this.resolvedLocale, { month: "long", day: "numeric", year: "numeric" }).format(start);
    }

    if (start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth()) {
      return `${loomiMonthName(this.resolvedLocale, start.getMonth(), "long")} ${start.getDate()} – ${end.getDate()}, ${start.getFullYear()}`;
    }

    if (start.getFullYear() === end.getFullYear()) {
      return `${loomiMonthName(this.resolvedLocale, start.getMonth(), "short")} ${start.getDate()} – ${loomiMonthName(this.resolvedLocale, end.getMonth(), "short")} ${end.getDate()}, ${start.getFullYear()}`;
    }

    return `${loomiDateFormatter(this.resolvedLocale, { month: "short", day: "numeric", year: "numeric" }).format(start)} – ${loomiDateFormatter(this.resolvedLocale, { month: "short", day: "numeric", year: "numeric" }).format(end)}`;
  }

  private getResourceLabel(resourceId: string) {
    return this.resources.find((resource) => resource.id === resourceId)?.label ?? resourceId;
  }

  private get resolvedLocale() {
    return this.locale || "en";
  }

  private get displayTimezone() {
    if (this.timezone) {
      return this.timezone;
    }

    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return "";
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-calendar": LoomiCalendar;
  }
}
