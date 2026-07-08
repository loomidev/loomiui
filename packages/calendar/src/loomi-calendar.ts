import { css, html, nothing, svg } from "lit";
import { customElement } from "lit/decorators.js";
import {
  LoomiElement,
  getLoomiLocale,
  loomiDateFormatter,
  loomiMonthName,
  loomiStyles,
  loomiT,
  loomiWeekdayNames
} from "@loomidev/core";
import "@loomidev/context-menu/loomi-context-menu.js";
import "@loomidev/datepicker/loomi-datepicker.js";
import "@loomidev/input/loomi-input.js";
import "@loomidev/modal/loomi-modal.js";
import "@loomidev/select/loomi-select.js";
import "@loomidev/tag-input/loomi-tag-input.js";
import "@loomidev/textarea/loomi-textarea.js";
import "@loomidev/timepicker/loomi-timepicker.js";
import "@loomidev/toggle/loomi-toggle.js";
import "@loomidev/tooltip/loomi-tooltip.js";
import { calendarStyles } from "./calendar-styles.js";
import {
  ALL_DAY_HEIGHT,
  HOUR_HEIGHT,
  RESOURCE_LABEL_WIDTH,
  TIME_AXIS_WIDTH,
  addDays,
  addMinutes,
  buildAgendaGroups,
  canDragEvent,
  canEditEvent,
  chunkMonthWeeks,
  cloneDate,
  combineDateAndTime,
  dateFromGridPosition,
  dateFromResourcePosition,
  endOfDay,
  formatEventRange,
  formatTime,
  formatTimepickerValue,
  formatTimezoneLabel,
  getInviteeInitials,
  getMonthGridDays,
  getNextUpcomingEvent,
  getNowOffset,
  getSingleDayEventsForDate,
  hasEventsOnDate,
  getVisibleWeekDays,
  isSameDay,
  isToday,
  layoutResourceDayEvents,
  layoutSpanningEvents,
  layoutTimedEvents,
  minutesFromDayStart,
  parseInputDate,
  startOfDay,
  summarizeInvitees,
  toInputDate,
  type SpanningEventLayout
} from "./calendar-utils.js";
import type {
  CalendarEvent,
  CalendarEventChangeDetail,
  CalendarEventClickDetail,
  CalendarEventColor,
  CalendarEventCreateDetail,
  CalendarEventDeleteDetail,
  CalendarEventDuplicateDetail,
  CalendarResource,
  CalendarSidebarToggleDetail,
  CalendarSlotSelectDetail,
  CalendarView,
  CalendarViewChangeDetail,
  CalendarDateChangeDetail,
  CalendarWeekStarts
} from "./types.js";

const PREV = svg`<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />`;
const NEXT = svg`<path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />`;
const PLUS = svg`<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />`;
const PANEL = svg`<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />`;
const ICON_CALENDAR = svg`<path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />`;
const ICON_CLOCK = svg`<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />`;
const ICON_BELL = svg`<path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />`;
const ICON_COPY = svg`<path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9.75a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />`;
const ICON_TRASH = svg`<path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />`;
const ICON_EDIT = svg`<path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />`;

const booleanAttribute = {
  fromAttribute(value: string | null): boolean {
    return value !== null && value.toLowerCase() !== "false";
  },
  toAttribute(value: boolean): string | null {
    return value ? "" : null;
  }
};

const SIDEBAR_STORAGE_KEY = "loomi-calendar-sidebar-open";

const VIEW_OPTIONS: Array<{ id: CalendarView; shortcut: string }> = [
  { id: "day", shortcut: "D" },
  { id: "week", shortcut: "W" },
  { id: "month", shortcut: "M" },
  { id: "agenda", shortcut: "A" },
  { id: "resource", shortcut: "R" }
];

type DragMode = "move" | "resize" | "resize-start" | "resize-end";

interface DragState {
  eventId: string;
  mode: DragMode;
  pointerId: number;
  startPointerX: number;
  startPointerY: number;
  currentDeltaX: number;
  currentDeltaY: number;
  originalStart: Date;
  originalEnd: Date;
  originalResourceId?: string;
  day: Date;
  resourceId?: string;
  visibleDays: Date[];
  columnWidth: number;
  spanning?: boolean;
}

interface EventDraft {
  eventId?: string;
  title: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  allDay: boolean;
  color: CalendarEventColor;
  description: string;
  resourceId: string;
  recurrenceFrequency: "" | "daily" | "weekly" | "monthly" | "yearly";
  reminderMinutes: string;
  invitees: string;
}

const EVENT_COLORS: CalendarEventColor[] = ["primary", "secondary", "success", "warning", "error"];
const REMINDER_MINUTES = ["0", "5", "10", "15", "30", "60", "1440"] as const;

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
    showTimezone: { attribute: "show-timezone", type: Boolean, converter: booleanAttribute },
    showWeekends: { attribute: "show-weekends", type: Boolean, converter: booleanAttribute },
    show_weekends: { attribute: "show_weekends", type: Boolean, converter: booleanAttribute },
    editable: { type: Boolean, reflect: true, converter: booleanAttribute },
    loading: { type: Boolean, reflect: true },
    startHour: { attribute: "start-hour", type: Number },
    endHour: { attribute: "end-hour", type: Number },
    slotMinutes: { attribute: "slot-minutes", type: Number },
    showSidebar: { attribute: "show-sidebar", type: Boolean },
    sidebarOpen: { attribute: "sidebar-open", type: Boolean, reflect: true },
    _dragState: { state: true },
    _slotDragState: { state: true },
    _miniCalendarDate: { state: true },
    _eventDraft: { state: true },
    _deleteEvent: { state: true },
    _contextEvent: { state: true },
    selectedEventId: { state: true }
  };

  static override styles = loomiStyles(calendarStyles, css`
    :host {
      --loomi-calendar-hour-height: ${HOUR_HEIGHT}px;
      --loomi-calendar-hour-count: 12;
      --loomi-calendar-resource-label-width: ${RESOURCE_LABEL_WIDTH}px;
      --loomi-calendar-time-axis-width: ${TIME_AXIS_WIDTH}px;
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
  showWeekends = false;
  editable = false;
  loading = false;
  startHour = 6;
  endHour = 17;
  slotMinutes = 30;
  showSidebar = true;
  sidebarOpen = false;
  declare _dragState?: DragState;
  declare _slotDragState?: SlotDragState;
  declare _miniCalendarDate?: Date;
  declare _eventDraft?: EventDraft;
  declare _deleteEvent?: CalendarEvent;
  declare _contextEvent?: CalendarEvent;
  selectedEventId = "";

  private createModalName = "loomi-calendar-create-event";
  private deleteModalName = "loomi-calendar-delete-event";

  private boundPointerMove = (event: PointerEvent) => this.handlePointerMove(event);
  private boundPointerUp = (event: PointerEvent) => this.handlePointerUp(event);
  private localeChangeHandler = () => {
    if (!this.locale) {
      this.requestUpdate();
    }
  };

  get show_weekends() {
    return this.showWeekends;
  }

  set show_weekends(value: boolean) {
    this.showWeekends = value;
  }

  override connectedCallback() {
    super.connectedCallback();
    if (!this.hasAttribute("tabindex")) {
      this.tabIndex = 0;
    }
    this.sidebarOpen = this.readSidebarPreference();
    globalThis.addEventListener("loomi-locale-change", this.localeChangeHandler);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._dragState = undefined;
    this._slotDragState = undefined;
    this.detachPointerListeners();
    globalThis.removeEventListener("loomi-locale-change", this.localeChangeHandler);
  }

  override render() {
    const hourCount = Math.max(1, this.endHour - this.startHour);
    this.style.setProperty("--loomi-calendar-hour-count", String(hourCount));

    return html`
      <div class="shell ${this.showSidebar ? "has-sidebar" : ""} ${this.sidebarOpen ? "sidebar-open" : "sidebar-closed"}" @keydown=${this.handleKeydown}>
        <div class="layout">
          ${this.showSidebar ? this.renderSidebar() : nothing}
          <div class="main">
            ${this.renderToolbar()}
            <div class="body">
              ${this.loading ? html`<div class="loading-overlay">Loading calendar…</div>` : nothing}
              ${this.view === "month" ? this.renderMonthView() : nothing}
              ${this.view === "agenda" ? this.renderAgendaView() : nothing}
              ${this.view === "resource" ? this.renderResourceView() : nothing}
              ${this.view === "week" || this.view === "day" ? this.renderTimeView() : nothing}
            </div>
          </div>
        </div>
        ${this.renderEventModal()}
        ${this.renderDeleteModal()}
        ${this.renderEventContextMenu()}
      </div>
    `;
  }

  private renderSidebar() {
    const miniDate = this._miniCalendarDate ?? this.date;
    const nextEvent = getNextUpcomingEvent(this.events, new Date());

    return html`
      <aside class="sidebar" aria-label="Calendar sidebar">
        <div class="sidebar-section">
          ${this.renderMiniCalendar(miniDate)}
        </div>
        <div class="sidebar-section sidebar-events">
          <div class="sidebar-heading">Upcoming</div>
          ${nextEvent ? this.renderUpcomingDetail(nextEvent) : html`<div class="sidebar-empty">No upcoming events</div>`}
        </div>
      </aside>
    `;
  }

  private renderUpcomingDetail(event: CalendarEvent) {
    const invitees = event.invitees ?? [];
    const summary = summarizeInvitees(invitees);
    const visibleInvitees = invitees.slice(0, 5);
    const overflowInvitee = invitees[5];
    const extraCount = Math.max(0, invitees.length - 6);
    const startDate = new Date(event.start);
    const dateLabel = loomiDateFormatter(this.resolvedLocale, {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric"
    }).format(startDate);

    return html`
      <article class="upcoming-detail">
        <header class="upcoming-header">
          <h3 class="upcoming-title">${event.title}</h3>
          ${this.editable ? html`
            <div class="upcoming-actions">
              <button class="icon-btn" type="button" aria-label="Duplicate event" title="Duplicate" @click=${() => this.handleDuplicateEvent(event)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${ICON_COPY}</svg>
              </button>
              <button class="icon-btn" type="button" aria-label="Delete event" title="Delete" @click=${() => this.handleDeleteEvent(event)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${ICON_TRASH}</svg>
              </button>
              <button class="icon-btn" type="button" aria-label="Edit event" title="Edit" @click=${(clickEvent: Event) => this.handleEventClick(clickEvent, event)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${ICON_EDIT}</svg>
              </button>
            </div>
          ` : nothing}
        </header>

        <div class="upcoming-meta">
          <div class="upcoming-meta-row">
            <svg class="upcoming-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${ICON_CALENDAR}</svg>
            <span>${dateLabel}</span>
          </div>
          <div class="upcoming-meta-row">
            <svg class="upcoming-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${ICON_CLOCK}</svg>
            <span>${formatEventRange(event, this.resolvedLocale, this.displayTimezone)}</span>
          </div>
          ${event.reminder?.label ? html`
            <div class="upcoming-meta-row">
              <svg class="upcoming-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${ICON_BELL}</svg>
              <span>${event.reminder.label}</span>
            </div>
          ` : nothing}
        </div>

        ${invitees.length ? html`
          <section class="upcoming-guests">
            <div class="guest-avatars">
              ${visibleInvitees.map((invitee) => html`
                <span class="guest-avatar" title=${invitee.name}>
                  ${invitee.avatarUrl
                    ? html`<img src=${invitee.avatarUrl} alt=${invitee.name} />`
                    : getInviteeInitials(invitee)}
                </span>
              `)}
              ${overflowInvitee ? html`
                <span class="guest-avatar guest-initials" title=${overflowInvitee.name}>
                  ${extraCount > 0 ? `+${extraCount + 1}` : getInviteeInitials(overflowInvitee)}
                </span>
              ` : nothing}
              ${this.editable ? html`
                <button class="guest-add" type="button" aria-label="Add guest" title="Add guest">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${PLUS}</svg>
                </button>
              ` : nothing}
            </div>
            <p class="guest-summary">
              <strong>${summary.total} guest${summary.total === 1 ? "" : "s"}</strong>
              ${summary.yes ? html` | ${summary.yes} yes` : nothing}
              ${summary.awaiting ? html` | ${summary.awaiting} awaiting` : nothing}
            </p>
          </section>
        ` : nothing}

        ${event.description ? html`
          <section class="upcoming-about">
            <h4 class="upcoming-about-title">About this event</h4>
            <div class="upcoming-description">${this.renderEventDescription(event.description)}</div>
          </section>
        ` : nothing}
      </article>
    `;
  }

  private renderEventDescription(description: string) {
    const lines = description.split(/\n+/).filter((line) => line.trim().length > 0);
    return lines.map((line) => {
      const meetingMatch = line.match(/^Meeting ID:\s*(.+)$/i);
      if (meetingMatch) {
        return html`<p class="upcoming-meeting-id">Meeting ID: ${meetingMatch[1]}</p>`;
      }

      const urlMatch = line.match(/(https?:\/\/[^\s]+)/);
      if (urlMatch) {
        const url = urlMatch[1];
        const prefix = line.slice(0, urlMatch.index);
        const suffix = line.slice((urlMatch.index ?? 0) + url.length);
        return html`<p>${prefix}<a class="upcoming-link" href=${url} target="_blank" rel="noopener noreferrer">${url}</a>${suffix}</p>`;
      }

      return html`<p>${line}</p>`;
    });
  }

  private renderMiniCalendar(miniDate: Date) {
    const cells = this.getVisibleMonthCells(miniDate);
    const weekdays = this.getVisibleWeekdayLabels();

    return html`
      <div class="mini-calendar">
        <div class="mini-calendar-header">
          <button class="icon-btn" type="button" aria-label="Previous month" @click=${() => this.shiftMiniCalendar(-1)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${PREV}</svg>
          </button>
          <button class="mini-calendar-title" type="button" @click=${() => this.updateDate(cloneDate(miniDate))}>
            ${loomiMonthName(this.resolvedLocale, miniDate.getMonth(), "short")} ${miniDate.getFullYear()}
          </button>
          <button class="icon-btn" type="button" aria-label="Next month" @click=${() => this.shiftMiniCalendar(1)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${NEXT}</svg>
          </button>
        </div>
        <div class="mini-weekdays" style=${`grid-template-columns: repeat(${weekdays.length}, minmax(0, 1fr))`}>
          ${weekdays.map((label) => html`<div class="mini-weekday">${label.slice(0, 2)}</div>`)}
        </div>
        <div class="mini-grid" style=${`grid-template-columns: repeat(${weekdays.length}, minmax(0, 1fr))`}>
          ${cells.map(({ date, isOtherMonth }) => {
            const selected = isSameDay(date, this.date);
            const today = isToday(date);
            const hasEvents = hasEventsOnDate(this.events, date);
            return html`
              <button
                class="mini-day ${isOtherMonth ? "other-month" : ""} ${today ? "today" : ""} ${selected ? "selected" : ""} ${hasEvents ? "has-events" : ""}"
                @click=${() => this.updateDate(startOfDay(date))}
                aria-label=${loomiDateFormatter(this.resolvedLocale, { dateStyle: "full" }).format(date)}
              >
                <span class="mini-day-num">${date.getDate()}</span>
                ${hasEvents ? html`<span class="mini-day-dot" aria-hidden="true"></span>` : nothing}
              </button>
            `;
          })}
        </div>
      </div>
    `;
  }

  private renderEventModal() {
    const draft = this._eventDraft;
    if (!draft) {
      return nothing;
    }

    const timeFormat = this.getTimepickerFormat();

    return html`
      <loomi-modal
        name=${this.createModalName}
        title=${draft.eventId ? "Edit event" : this.t("calendar.form.newEvent")}
        ok-button-label=${this.t("calendar.form.save")}
        .locale=${this.locale}
        size="medium"
        ?open=${true}
        .closeAfterAction=${false}
        @ok=${this.handleEventDraftSave}
        @cancel=${this.handleCreateEventCancel}
        @close=${this.handleCreateEventCancel}
      >
        <div class="event-form">
          <loomi-input
            name="title"
            .locale=${this.locale}
            label=${this.t("calendar.form.title")}
            .value=${draft.title}
            required
            @input=${this.handleDraftInput("title")}
          ></loomi-input>

          <loomi-toggle
            name="allDay"
            label=${this.t("calendar.form.allDay")}
            label-position="right"
            ?checked=${draft.allDay}
            @change=${this.handleAllDayToggle}
          ></loomi-toggle>

          <div class="event-form-row">
            <loomi-datepicker
              name="startDate"
              .locale=${this.locale}
              label=${this.t("calendar.form.startDate")}
              week-starts=${this.weekStarts}
              selected-value=${draft.startDate}
              required
              @change=${this.handleDraftDateChange("startDate")}
            ></loomi-datepicker>
            ${draft.allDay ? nothing : html`
              <loomi-timepicker
                name="startTime"
                .locale=${this.locale}
                label=${this.t("calendar.form.startTime")}
                format=${timeFormat}
                selected-value=${draft.startTime}
                required
                @change=${this.handleDraftTimeChange("startTime")}
              ></loomi-timepicker>
            `}
          </div>

          <div class="event-form-row">
            <loomi-datepicker
              name="endDate"
              .locale=${this.locale}
              label=${this.t("calendar.form.endDate")}
              week-starts=${this.weekStarts}
              selected-value=${draft.endDate}
              required
              @change=${this.handleDraftDateChange("endDate")}
            ></loomi-datepicker>
            ${draft.allDay ? nothing : html`
              <loomi-timepicker
                name="endTime"
                .locale=${this.locale}
                label=${this.t("calendar.form.endTime")}
                format=${timeFormat}
                selected-value=${draft.endTime}
                required
                @change=${this.handleDraftTimeChange("endTime")}
              ></loomi-timepicker>
            `}
          </div>

          <loomi-select
            name="color"
            .locale=${this.locale}
            label=${this.t("calendar.form.color")}
            .data=${this.getColorSelectOptions()}
            selected-value=${draft.color}
            @select=${this.handleDraftSelect("color")}
          ></loomi-select>

          ${this.resources.length ? html`
            <loomi-select
              name="resource"
              .locale=${this.locale}
              label=${this.t("calendar.form.resource")}
              .data=${this.getResourceSelectOptions()}
              selected-value=${draft.resourceId}
              @select=${this.handleDraftSelect("resourceId")}
            ></loomi-select>
          ` : nothing}

          <loomi-select
            name="recurrence"
            .locale=${this.locale}
            label=${this.t("calendar.form.recurrence")}
            .data=${this.getRecurrenceSelectOptions()}
            selected-value=${draft.recurrenceFrequency}
            @select=${this.handleDraftSelect("recurrenceFrequency")}
          ></loomi-select>

          <loomi-select
            name="reminder"
            .locale=${this.locale}
            label=${this.t("calendar.form.reminder")}
            .data=${this.getReminderSelectOptions()}
            selected-value=${draft.reminderMinutes}
            @select=${this.handleDraftSelect("reminderMinutes")}
          ></loomi-select>

          <loomi-tag-input
            name="invitees"
            .locale=${this.locale}
            label=${this.t("calendar.form.invitees")}
            placeholder=${this.t("calendar.form.inviteesPlaceholder")}
            .value=${draft.invitees}
            @change=${this.handleDraftInput("invitees")}
          ></loomi-tag-input>

          <loomi-textarea
            name="description"
            .locale=${this.locale}
            label=${this.t("calendar.form.description")}
            placeholder=${this.t("calendar.form.descriptionPlaceholder")}
            rows="4"
            .value=${draft.description}
            @input=${this.handleDraftInput("description")}
          ></loomi-textarea>
        </div>
      </loomi-modal>
    `;
  }

  private renderDeleteModal() {
    const event = this._deleteEvent;
    if (!event) {
      return nothing;
    }

    return html`
      <loomi-modal
        name=${this.deleteModalName}
        title="Delete event?"
        type="error"
        ok-button-label="Delete"
        cancel-button-label="Cancel"
        .locale=${this.locale}
        size="small"
        ?open=${true}
        .closeAfterAction=${false}
        @ok=${this.handleConfirmDeleteEvent}
        @cancel=${this.handleDeleteEventCancel}
        @close=${this.handleDeleteEventCancel}
      >
        <p class="delete-copy">Delete <strong>${event.title}</strong>?</p>
      </loomi-modal>
    `;
  }

  private renderEventContextMenu() {
    return html`
      <loomi-context-menu id="event-context-menu" ?disabled=${!this._contextEvent}>
        <loomi-context-menu-item icon="pencil-square" @click=${this.handleContextEdit}>Edit</loomi-context-menu-item>
        <loomi-context-menu-item icon="trash" @click=${this.handleContextDelete}>Delete</loomi-context-menu-item>
      </loomi-context-menu>
    `;
  }

  private renderToolbar() {
    const viewOptions = this.getViewSelectOptions();

    return html`
      <div class="toolbar">
        <div class="toolbar-start">
          ${this.showSidebar ? html`
            <button
              class="toolbar-btn icon-only"
              type="button"
              aria-label=${this.sidebarOpen ? this.t("calendar.hideSidebar") : this.t("calendar.showSidebar")}
              title=${this.sidebarOpen ? this.t("calendar.hideSidebar") : this.t("calendar.showSidebar")}
              @click=${this.toggleSidebar}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${PANEL}</svg>
            </button>
          ` : nothing}
          <div class="title">${this.getFormattedTitle()}</div>
          ${this.showTimezone && this.displayTimezone
            ? html`<span class="timezone-badge">${formatTimezoneLabel(this.displayTimezone, this.resolvedLocale)}</span>`
            : nothing}
        </div>
        <div class="toolbar-end">
          <button class="toolbar-btn icon-only" type="button" aria-label=${this.t("calendar.previous")} title=${this.t("calendar.previous")} @click=${this.goPrev}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${PREV}</svg>
          </button>
          <button class="toolbar-btn" type="button" @click=${this.goToToday}>${this.t("calendar.today")}</button>
          <button class="toolbar-btn icon-only" type="button" aria-label=${this.t("calendar.next")} title=${this.t("calendar.next")} @click=${this.goNext}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${NEXT}</svg>
          </button>
          <loomi-select
            class="toolbar-view-select"
            no-clearing
            size="small"
            .locale=${this.locale}
            .data=${viewOptions}
            selected-value=${this.view}
            aria-label=${this.t("calendar.viewLabel")}
            @select=${this.handleViewSelect}
          ></loomi-select>
          ${this.editable ? html`
            <loomi-tooltip content=${this.t("calendar.addEvent")} placement="bottom">
              <button class="toolbar-btn icon-only" type="button" aria-label=${this.t("calendar.addEvent")} @click=${() => this.openCreateEventModal()}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${PLUS}</svg>
              </button>
            </loomi-tooltip>
          ` : nothing}
        </div>
      </div>
    `;
  }

  private getViewSelectOptions() {
    return VIEW_OPTIONS.map((option) => ({
      value: option.id,
      label: this.t(`calendar.views.${option.id}`)
    }));
  }

  private handleViewSelect(event: CustomEvent<{ value: string }>) {
    const nextView = event.detail.value as CalendarView;
    if (VIEW_OPTIONS.some((option) => option.id === nextView)) {
      this.changeView(nextView);
    }
  }

  private t(path: string, params: Record<string, string | number> = {}) {
    return loomiT(path, params, this.locale);
  }

  private isVisibleDay(date: Date) {
    if (this.showWeekends) {
      return true;
    }
    const day = date.getDay();
    return day !== 0 && day !== 6;
  }

  private getVisibleWeekdayLabels() {
    const labels = loomiWeekdayNames(this.resolvedLocale, this.weekStarts);
    if (this.showWeekends) {
      return labels;
    }
    return labels.filter((_, index) => {
      const weekday = this.weekStarts === "monday" ? (index + 1) % 7 : index;
      return weekday !== 0 && weekday !== 6;
    });
  }

  private getVisibleMonthCells(date: Date) {
    return getMonthGridDays(date, this.weekStarts).filter((cell) => this.isVisibleDay(cell.date));
  }

  private getVisibleMonthWeeks(date: Date) {
    return chunkMonthWeeks(date, this.weekStarts)
      .map((week) => week.filter((day) => this.isVisibleDay(day)))
      .filter((week) => week.length > 0);
  }

  private renderMonthView() {
    const weekdays = this.getVisibleWeekdayLabels();
    const weeks = this.getVisibleMonthWeeks(this.date);
    const cells = getMonthGridDays(this.date, this.weekStarts);
    const isOtherMonthMap = new Map(cells.map((cell) => [cell.date.toDateString(), cell.isOtherMonth]));

    return html`
      <div class="month-view">
        <div class="weekdays" style=${`grid-template-columns: repeat(${weekdays.length}, minmax(0, 1fr))`}>
          ${weekdays.map((label) => html`<div class="weekday">${label}</div>`)}
        </div>
        <div class="month-weeks">
          ${weeks.map((weekDays) => {
            const spanning = layoutSpanningEvents(weekDays, this.events);
            const laneCount = spanning.reduce((max, entry) => Math.max(max, entry.lane + 1), 0);
            return html`
              <section class="month-week">
                ${laneCount > 0 ? html`
                  <div class="month-week-lanes" style=${`--lane-count: ${laneCount}; --day-count: ${weekDays.length}`}>
                    ${spanning.map((entry) => this.renderSpanningEvent(entry, weekDays.length))}
                  </div>
                ` : nothing}
                <div class="month-grid month-week-days" style=${`grid-template-columns: repeat(${weekDays.length}, minmax(0, 1fr))`}>
                  ${weekDays.map((date) => this.renderMonthCell(date, isOtherMonthMap.get(date.toDateString()) ?? false))}
                </div>
              </section>
            `;
          })}
        </div>
      </div>
    `;
  }

  private renderMonthCell(date: Date, isOtherMonth: boolean) {
    const dayEvents = getSingleDayEventsForDate(this.events, date);
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

  private renderSpanningEvent(entry: SpanningEventLayout, dayCount: number) {
    const { event, startIndex, endIndex, lane } = entry;
    const preview = this.getSpanningDragPreview(event, dayCount);
    const left = preview?.left ?? ((startIndex / dayCount) * 100);
    const width = preview?.width ?? (((endIndex - startIndex + 1) / dayCount) * 100);
    const draggable = canDragEvent(event, this.editable);
    const dragging = this._dragState?.eventId === event.id;

    return html`
      <button
        class="spanning-event event-${event.color || "primary"} ${draggable ? "draggable" : ""} ${dragging ? "dragging" : ""} ${this.isEventSelected(event) ? "selected" : ""}"
        style=${`left: calc(${left}% + 4px); width: calc(${width}% - 8px); top: calc(${lane * 24}px + 4px);`}
        @click=${(clickEvent: Event) => this.handleEventClick(clickEvent, event)}
        @dblclick=${(clickEvent: Event) => this.handleEventDoubleClick(clickEvent, event)}
        @contextmenu=${(contextEvent: MouseEvent) => this.handleEventContextMenu(contextEvent, event)}
        @pointerdown=${(pointerEvent: PointerEvent) => this.handleSpanningPointerDown(pointerEvent, event, entry)}
      >
        ${event.title}
        ${draggable ? html`
          <span class="resize-handle resize-start" @pointerdown=${(pointerEvent: PointerEvent) => this.handleSpanningResizePointerDown(pointerEvent, event, entry, "resize-start")}></span>
          <span class="resize-handle resize-end" @pointerdown=${(pointerEvent: PointerEvent) => this.handleSpanningResizePointerDown(pointerEvent, event, entry, "resize-end")}></span>
        ` : nothing}
      </button>
    `;
  }

  private renderTimeView() {
    const days = this.view === "day"
      ? [startOfDay(this.date)]
      : getVisibleWeekDays(this.date, this.weekStarts, this.showWeekends);
    const hourCount = this.endHour - this.startHour;

    return html`
      <div class="month-view time-view">
        <div class="time-view-header">
          <div
            class="weekdays"
            style=${`grid-template-columns: var(--loomi-calendar-time-axis-width, ${TIME_AXIS_WIDTH}px) repeat(${days.length}, minmax(0, 1fr))`}
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
        </div>
        <div class="time-view-scroll">
          <div class="time-layout">
            <div class="time-axis">
              ${Array.from({ length: hourCount }, (_, index) => {
                const hour = this.startHour + index;
                const labelDate = new Date(2023, 0, 1, hour, 0, 0);
                return html`<div class="time-axis-label">${formatTime(labelDate, this.resolvedLocale, this.displayTimezone)}</div>`;
              })}
            </div>
            <div class="time-grid-wrap">
              ${days.map((day) => this.renderDayColumn(day, days))}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private renderAllDayRow(days: Date[]) {
    const spanning = layoutSpanningEvents(days, this.events);
    const laneCount = Math.max(1, spanning.reduce((max, entry) => Math.max(max, entry.lane + 1), 0));

    return html`
      <div
        class="all-day-row"
        style=${`grid-template-columns: var(--loomi-calendar-time-axis-width, ${TIME_AXIS_WIDTH}px) repeat(${days.length}, minmax(0, 1fr))`}
      >
        <div class="all-day-label">All day</div>
        <div
          class="all-day-track"
          style=${`grid-column: span ${days.length}; --lane-count: ${laneCount}; --day-count: ${days.length}`}
        >
          <div class="all-day-columns">
            ${days.map(() => html`<div class="all-day-column"></div>`)}
          </div>
          ${spanning.map((entry) => this.renderSpanningEvent(entry, days.length))}
        </div>
      </div>
    `;
  }

  private renderDayColumn(day: Date, visibleDays: Date[]) {
    const positioned = layoutTimedEvents(this.events, day, this.startHour, this.endHour);
    const nowOffset = isToday(day) ? getNowOffset(this.startHour, this.endHour, HOUR_HEIGHT) : null;
    const hourCount = this.endHour - this.startHour;

    return html`
      <div class="day-column" data-day=${day.toISOString()}>
        <div
          class="time-slots ${this.editable ? "editable" : ""}"
          style=${`height: ${hourCount * HOUR_HEIGHT}px`}
          @pointerdown=${this.editable ? (event: PointerEvent) => this.handleTimeSlotsPointerDown(event, day) : nothing}
        >
          ${Array.from({ length: hourCount }, () => html`<div class="time-slot"></div>`)}
          ${this.renderSlotSelection(day)}
          ${nowOffset !== null ? html`<div class="now-line" style=${`top: ${nowOffset}px`}></div>` : nothing}
          ${positioned.map((entry) => this.renderTimedEvent(entry.event, day, visibleDays, entry.top, entry.height, entry.left, entry.width))}
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
                <button
                  class="agenda-item event-${event.color || "primary"} ${this.isEventSelected(event) ? "selected" : ""}"
                  @click=${(clickEvent: Event) => this.handleEventClick(clickEvent, event)}
                  @dblclick=${(clickEvent: Event) => this.handleEventDoubleClick(clickEvent, event)}
                  @contextmenu=${(contextEvent: MouseEvent) => this.handleEventContextMenu(contextEvent, event)}
                >
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
          class="resource-timeline ${this.editable ? "editable" : ""}"
          style=${`height: ${Math.max(ALL_DAY_HEIGHT, 72)}px`}
          @click=${(event: MouseEvent) => this.handleResourceTrackClick(event, day, resource.id)}
        >
          <div class="resource-track">
            ${Array.from({ length: hourCount }, () => html`<div class="resource-slot"></div>`)}
          </div>
          ${positioned.map(({ event, left, width }) => html`
            <button
              class="timed-event event-${event.color || resource.color || "primary"} ${canDragEvent(event, this.editable) ? "draggable" : ""} ${this.isEventSelected(event) ? "selected" : ""}"
              style=${`left: ${left}%; width: ${width}%; top: 8px; height: calc(100% - 16px);`}
              @click=${(clickEvent: Event) => this.handleEventClick(clickEvent, event)}
              @dblclick=${(clickEvent: Event) => this.handleEventDoubleClick(clickEvent, event)}
              @contextmenu=${(contextEvent: MouseEvent) => this.handleEventContextMenu(contextEvent, event)}
              @pointerdown=${(pointerEvent: PointerEvent) => this.handleResourceEventPointerDown(pointerEvent, event, day, resource.id)}
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
        class="event-pill event-${event.color || "primary"} ${this.isEventSelected(event) ? "selected" : ""}"
        title=${event.title}
        @click=${(clickEvent: Event) => this.handleEventClick(clickEvent, event)}
        @dblclick=${(clickEvent: Event) => this.handleEventDoubleClick(clickEvent, event)}
        @contextmenu=${(contextEvent: MouseEvent) => this.handleEventContextMenu(contextEvent, event)}
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
    visibleDays: Date[],
    top: number,
    height: number,
    left: number,
    width: number
  ) {
    const preview = this.getDragPreview(event, visibleDays.length);
    const displayTop = preview?.top ?? top;
    const displayHeight = preview?.height ?? height;
    const displayTransform = preview?.transform;
    const draggable = canDragEvent(event, this.editable);
    const dragging = this._dragState?.eventId === event.id;

    return html`
      <button
        class="timed-event event-${event.color || "primary"} ${draggable ? "draggable" : ""} ${dragging ? "dragging" : ""} ${this.isEventSelected(event) ? "selected" : ""}"
        style=${`top: ${displayTop}px; height: ${displayHeight}px; left: calc(${left}% + 2px); width: calc(${width}% - 4px);${displayTransform ? ` transform: ${displayTransform};` : ""}`}
        @click=${(clickEvent: Event) => this.handleEventClick(clickEvent, event)}
        @dblclick=${(clickEvent: Event) => this.handleEventDoubleClick(clickEvent, event)}
        @contextmenu=${(contextEvent: MouseEvent) => this.handleEventContextMenu(contextEvent, event)}
        @pointerdown=${(pointerEvent: PointerEvent) => this.handleEventPointerDown(pointerEvent, event, day, visibleDays)}
      >
        <div class="timed-event-title">${event.title}</div>
        ${displayHeight >= 40
          ? html`<div class="timed-event-meta">${formatEventRange(event, this.resolvedLocale, this.displayTimezone)}</div>`
          : nothing}
        ${event.recurrence?.label && displayHeight >= 56
          ? html`<div class="timed-event-meta">${event.recurrence.label}</div>`
          : nothing}
        ${draggable ? html`<span class="resize-handle resize-bottom" @pointerdown=${(pointerEvent: PointerEvent) => this.handleResizePointerDown(pointerEvent, event, day, visibleDays)}></span>` : nothing}
      </button>
    `;
  }

  private getSpanningDragPreview(event: CalendarEvent, dayCount: number): { left: number; width: number } | null {
    if (!this._dragState || this._dragState.eventId !== event.id || !this._dragState.spanning) {
      return null;
    }

    const dayOffset = Math.round(this._dragState.currentDeltaX / this._dragState.columnWidth);
    const originalStartDay = startOfDay(this._dragState.originalStart);
    const originalEndDay = startOfDay(this._dragState.originalEnd);
    const durationDays = Math.max(0, Math.round((originalEndDay.getTime() - originalStartDay.getTime()) / 86400000));

    if (this._dragState.mode === "move") {
      const nextStart = addDays(originalStartDay, dayOffset);
      const nextEnd = addDays(nextStart, durationDays);
      const startIndex = Math.max(0, this._dragState.visibleDays.findIndex((day) => isSameDay(day, nextStart)));
      const endIndex = Math.max(startIndex, this._dragState.visibleDays.findIndex((day) => isSameDay(day, nextEnd)));
      if (startIndex === -1) {
        return null;
      }
      const resolvedEnd = endIndex === -1 ? dayCount - 1 : endIndex;
      return {
        left: (startIndex / dayCount) * 100,
        width: ((resolvedEnd - startIndex + 1) / dayCount) * 100
      };
    }

    if (this._dragState.mode === "resize-start") {
      const nextStart = addDays(originalStartDay, dayOffset);
      const endIndex = this._dragState.visibleDays.findIndex((day) => isSameDay(day, originalEndDay));
      const startIndex = this._dragState.visibleDays.findIndex((day) => isSameDay(day, nextStart));
      if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) {
        return null;
      }
      return {
        left: (startIndex / dayCount) * 100,
        width: ((endIndex - startIndex + 1) / dayCount) * 100
      };
    }

    const nextEnd = addDays(originalEndDay, dayOffset);
    const startIndex = this._dragState.visibleDays.findIndex((day) => isSameDay(day, originalStartDay));
    const endIndex = this._dragState.visibleDays.findIndex((day) => isSameDay(day, nextEnd));
    if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
      return null;
    }
    return {
      left: (startIndex / dayCount) * 100,
      width: ((endIndex - startIndex + 1) / dayCount) * 100
    };
  }

  private getDragPreview(event: CalendarEvent, dayCount: number): { top: number; height: number; transform?: string } | null {
    if (!this._dragState || this._dragState.eventId !== event.id || this._dragState.spanning) {
      return null;
    }

    const deltaMinutes = Math.round(((this._dragState.currentDeltaY / HOUR_HEIGHT) * 60) / this.slotMinutes) * this.slotMinutes;
    const dayOffset = dayCount > 1 ? Math.round(this._dragState.currentDeltaX / this._dragState.columnWidth) : 0;

    if (this._dragState.mode === "resize") {
      const nextEnd = addMinutes(this._dragState.originalEnd, deltaMinutes);
      const startMinutes = Math.max(0, (this._dragState.originalStart.getHours() - this.startHour) * 60 + this._dragState.originalStart.getMinutes());
      const endMinutes = Math.max(startMinutes + this.slotMinutes, (nextEnd.getHours() - this.startHour) * 60 + nextEnd.getMinutes());
      return {
        top: (startMinutes / 60) * HOUR_HEIGHT,
        height: Math.max(22, ((endMinutes - startMinutes) / 60) * HOUR_HEIGHT),
        transform: dayOffset ? `translateX(${dayOffset * this._dragState.columnWidth}px)` : undefined
      };
    }

    const nextStart = addMinutes(this._dragState.originalStart, deltaMinutes);
    const durationMs = this._dragState.originalEnd.getTime() - this._dragState.originalStart.getTime();
    const nextEnd = new Date(nextStart.getTime() + durationMs);
    const startMinutes = Math.max(0, (nextStart.getHours() - this.startHour) * 60 + nextStart.getMinutes());
    const endMinutes = Math.max(startMinutes + this.slotMinutes, (nextEnd.getHours() - this.startHour) * 60 + nextEnd.getMinutes());
    return {
      top: (startMinutes / 60) * HOUR_HEIGHT,
      height: Math.max(22, ((endMinutes - startMinutes) / 60) * HOUR_HEIGHT),
      transform: dayOffset ? `translateX(${dayOffset * this._dragState.columnWidth}px)` : undefined
    };
  }

  private handleEventPointerDown(pointerEvent: PointerEvent, event: CalendarEvent, day: Date, visibleDays: Date[]) {
    if (!canDragEvent(event, this.editable)) {
      return;
    }

    pointerEvent.stopPropagation();
    const grid = pointerEvent.currentTarget as HTMLElement;
    const column = grid.closest(".day-column") as HTMLElement | null;
    const columnWidth = column?.getBoundingClientRect().width ?? 0;

    this._dragState = {
      eventId: event.id,
      mode: "move",
      pointerId: pointerEvent.pointerId,
      startPointerX: pointerEvent.clientX,
      startPointerY: pointerEvent.clientY,
      currentDeltaX: 0,
      currentDeltaY: 0,
      originalStart: cloneDate(event.start),
      originalEnd: cloneDate(event.end),
      originalResourceId: event.resourceId,
      day,
      resourceId: event.resourceId,
      visibleDays,
      columnWidth
    };

    this.attachPointerListeners();
    grid.setPointerCapture(pointerEvent.pointerId);
  }

  private handleSpanningPointerDown(pointerEvent: PointerEvent, event: CalendarEvent, _entry: SpanningEventLayout) {
    if (!canDragEvent(event, this.editable)) {
      return;
    }

    pointerEvent.stopPropagation();
    const track = pointerEvent.currentTarget as HTMLElement;
    const container = track.closest(".all-day-track, .month-week-lanes") as HTMLElement | null;
    const visibleDays = this.view === "month"
      ? this.getVisibleMonthWeeks(this.date).find((week) => week.some((day) => isSameDay(day, startOfDay(event.start)))) ?? [startOfDay(event.start)]
      : getVisibleWeekDays(this.date, this.weekStarts, this.showWeekends);
    const columnWidth = container ? container.clientWidth / visibleDays.length : 1;

    this._dragState = {
      eventId: event.id,
      mode: "move",
      pointerId: pointerEvent.pointerId,
      startPointerX: pointerEvent.clientX,
      startPointerY: pointerEvent.clientY,
      currentDeltaX: 0,
      currentDeltaY: 0,
      originalStart: cloneDate(event.start),
      originalEnd: cloneDate(event.end),
      originalResourceId: event.resourceId,
      day: startOfDay(event.start),
      visibleDays,
      columnWidth,
      spanning: true
    };

    this.attachPointerListeners();
    track.setPointerCapture(pointerEvent.pointerId);
  }

  private handleSpanningResizePointerDown(
    pointerEvent: PointerEvent,
    event: CalendarEvent,
    _entry: SpanningEventLayout,
    mode: "resize-start" | "resize-end"
  ) {
    if (!canDragEvent(event, this.editable)) {
      return;
    }

    pointerEvent.stopPropagation();
    const handle = pointerEvent.currentTarget as HTMLElement;
    const container = handle.closest(".all-day-track, .month-week-lanes") as HTMLElement | null;
    const visibleDays = this.view === "month"
      ? this.getVisibleMonthWeeks(this.date).find((week) => week.some((day) => isSameDay(day, startOfDay(event.start)))) ?? [startOfDay(event.start)]
      : getVisibleWeekDays(this.date, this.weekStarts, this.showWeekends);
    const columnWidth = container ? container.clientWidth / visibleDays.length : 1;

    this._dragState = {
      eventId: event.id,
      mode,
      pointerId: pointerEvent.pointerId,
      startPointerX: pointerEvent.clientX,
      startPointerY: pointerEvent.clientY,
      currentDeltaX: 0,
      currentDeltaY: 0,
      originalStart: cloneDate(event.start),
      originalEnd: cloneDate(event.end),
      originalResourceId: event.resourceId,
      day: startOfDay(event.start),
      visibleDays,
      columnWidth,
      spanning: true
    };

    this.attachPointerListeners();
    handle.setPointerCapture(pointerEvent.pointerId);
  }

  private handleResizePointerDown(pointerEvent: PointerEvent, event: CalendarEvent, day: Date, visibleDays: Date[]) {
    if (!canDragEvent(event, this.editable)) {
      return;
    }

    pointerEvent.stopPropagation();
    const handle = pointerEvent.currentTarget as HTMLElement;
    const column = handle.closest(".day-column") as HTMLElement | null;
    const columnWidth = column?.getBoundingClientRect().width ?? 0;

    this._dragState = {
      eventId: event.id,
      mode: "resize",
      pointerId: pointerEvent.pointerId,
      startPointerX: pointerEvent.clientX,
      startPointerY: pointerEvent.clientY,
      currentDeltaX: 0,
      currentDeltaY: 0,
      originalStart: cloneDate(event.start),
      originalEnd: cloneDate(event.end),
      originalResourceId: event.resourceId,
      day,
      visibleDays,
      columnWidth
    };

    this.attachPointerListeners();
    handle.setPointerCapture(pointerEvent.pointerId);
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
      currentDeltaX: pointerEvent.clientX - this._dragState.startPointerX,
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
      this.openCreateEventModal(nextStart, nextEnd, false);
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
      let nextStart = cloneDate(this._dragState.originalStart);
      let nextEnd = cloneDate(this._dragState.originalEnd);

      if (this._dragState.spanning) {
        const dayOffset = Math.round(this._dragState.currentDeltaX / this._dragState.columnWidth);
        const originalStartDay = startOfDay(this._dragState.originalStart);
        const originalEndDay = startOfDay(this._dragState.originalEnd);
        const durationDays = Math.max(0, Math.round((originalEndDay.getTime() - originalStartDay.getTime()) / 86400000));

        if (this._dragState.mode === "move") {
          nextStart = startOfDay(addDays(originalStartDay, dayOffset));
          nextStart.setHours(this._dragState.originalStart.getHours(), this._dragState.originalStart.getMinutes(), 0, 0);
          nextEnd = startOfDay(addDays(originalStartDay, dayOffset + durationDays));
          nextEnd.setHours(this._dragState.originalEnd.getHours(), this._dragState.originalEnd.getMinutes(), 0, 0);
          if (event.isAllDay) {
            nextStart = startOfDay(nextStart);
            nextEnd = endOfDay(nextEnd);
          }
        } else if (this._dragState.mode === "resize-start") {
          const resizedStart = startOfDay(addDays(originalStartDay, dayOffset));
          if (resizedStart.getTime() <= originalEndDay.getTime()) {
            nextStart = event.isAllDay ? startOfDay(resizedStart) : addDays(this._dragState.originalStart, dayOffset);
          }
        } else if (this._dragState.mode === "resize-end") {
          const resizedEnd = startOfDay(addDays(originalEndDay, dayOffset));
          if (resizedEnd.getTime() >= originalStartDay.getTime()) {
            nextEnd = event.isAllDay ? endOfDay(resizedEnd) : addDays(this._dragState.originalEnd, dayOffset);
          }
        }
      } else if (this._dragState.resourceId) {
        const deltaMinutes = Math.round((this._dragState.currentDeltaX / this._dragState.columnWidth) / this.slotMinutes) * this.slotMinutes;
        const durationMs = this._dragState.originalEnd.getTime() - this._dragState.originalStart.getTime();
        nextStart = addMinutes(this._dragState.originalStart, deltaMinutes);
        nextEnd = new Date(nextStart.getTime() + durationMs);
      } else {
        const deltaMinutes = Math.round(((this._dragState.currentDeltaY / HOUR_HEIGHT) * 60) / this.slotMinutes) * this.slotMinutes;
        const dayOffset = this._dragState.visibleDays.length > 1
          ? Math.round(this._dragState.currentDeltaX / this._dragState.columnWidth)
          : 0;
        const durationMs = this._dragState.originalEnd.getTime() - this._dragState.originalStart.getTime();

        if (this._dragState.mode === "move") {
          nextStart = addMinutes(addDays(this._dragState.originalStart, dayOffset), deltaMinutes);
          nextEnd = new Date(nextStart.getTime() + durationMs);
        } else {
          nextEnd = addMinutes(this._dragState.originalEnd, deltaMinutes);
          if (nextEnd <= nextStart) {
            nextEnd = addMinutes(nextStart, this.slotMinutes);
          }
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
      this.openCreateEventModal(startOfDay(date), endOfDay(date), true);
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
    this.selectedEventId = calendarEvent.id;
    this.dispatchEvent(new CustomEvent<CalendarEventClickDetail>("loomi-event-click", {
      detail: { event: calendarEvent },
      bubbles: true,
      composed: true
    }));
  }

  private handleEventDoubleClick(event: Event, calendarEvent: CalendarEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.selectedEventId = calendarEvent.id;
    if (canEditEvent(calendarEvent, this.editable)) {
      this.openEditEventModal(calendarEvent);
    }
  }

  private handleEventContextMenu(event: MouseEvent, calendarEvent: CalendarEvent) {
    if (!canEditEvent(calendarEvent, this.editable)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    this.selectedEventId = calendarEvent.id;
    this._contextEvent = calendarEvent;
    void this.updateComplete.then(() => {
      this.renderRoot
        .querySelector<HTMLElement & { showAt(clientX: number, clientY: number): void }>("#event-context-menu")
        ?.showAt(event.clientX, event.clientY);
    });
  }

  private handleContextEdit = () => {
    const event = this._contextEvent;
    if (event && canEditEvent(event, this.editable)) {
      this.openEditEventModal(event);
    }
    this._contextEvent = undefined;
  };

  private handleContextDelete = () => {
    const event = this._contextEvent;
    if (event && canEditEvent(event, this.editable)) {
      this.confirmDeleteEvent(event);
    }
    this._contextEvent = undefined;
  };

  private isEventSelected(event: CalendarEvent) {
    return this.selectedEventId === event.id;
  }

  private get selectedEvent() {
    return this.events.find((event) => event.id === this.selectedEventId);
  }

  private handleKeydown(event: KeyboardEvent) {
    if (this.isTypingTarget(event.composedPath()[0])) {
      return;
    }
    if ((event.key === "Backspace" || event.key === "Delete") && this.editable) {
      const selected = this.selectedEvent;
      if (selected && canEditEvent(selected, this.editable)) {
        event.preventDefault();
        this.confirmDeleteEvent(selected);
        return;
      }
    }
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

  private isTypingTarget(target: EventTarget | undefined): boolean {
    if (!(target instanceof HTMLElement)) {
      return false;
    }
    return Boolean(
      target.closest(
        "input, textarea, select, loomi-input, loomi-textarea, loomi-tag-input, loomi-select, loomi-datepicker, loomi-timepicker, [contenteditable='true']",
      ),
    );
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
    this._miniCalendarDate = cloneDate(date);
    this.dispatchEvent(new CustomEvent<CalendarDateChangeDetail>("loomi-date-change", {
      detail: { date },
      bubbles: true,
      composed: true
    }));
  }

  private handleResourceEventPointerDown(pointerEvent: PointerEvent, event: CalendarEvent, day: Date, resourceId: string) {
    if (!canDragEvent(event, this.editable)) {
      return;
    }

    pointerEvent.stopPropagation();
    const track = pointerEvent.currentTarget as HTMLElement;
    const timeline = track.closest(".resource-timeline") as HTMLElement | null;
    const columnWidth = timeline ? timeline.clientWidth / Math.max(1, this.endHour - this.startHour) : 0;

    this._dragState = {
      eventId: event.id,
      mode: "move",
      pointerId: pointerEvent.pointerId,
      startPointerX: pointerEvent.clientX,
      startPointerY: pointerEvent.clientY,
      currentDeltaX: 0,
      currentDeltaY: 0,
      originalStart: cloneDate(event.start),
      originalEnd: cloneDate(event.end),
      originalResourceId: event.resourceId,
      day,
      resourceId,
      visibleDays: [day],
      columnWidth
    };

    this.attachPointerListeners();
    track.setPointerCapture(pointerEvent.pointerId);
  }

  private toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
    this.persistSidebarPreference(this.sidebarOpen);
    this.dispatchEvent(new CustomEvent<CalendarSidebarToggleDetail>("loomi-sidebar-toggle", {
      detail: { open: this.sidebarOpen },
      bubbles: true,
      composed: true
    }));
  }

  private readSidebarPreference(): boolean {
    try {
      const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
      if (stored !== null) {
        return stored === "true";
      }
    } catch {
      // Ignore storage access errors (private mode, blocked storage, etc.).
    }
    return this.hasAttribute("sidebar-open");
  }

  private persistSidebarPreference(open: boolean) {
    try {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, open ? "true" : "false");
    } catch {
      // Ignore storage access errors.
    }
  }

  private shiftMiniCalendar(deltaMonths: number) {
    const next = cloneDate(this._miniCalendarDate ?? this.date);
    next.setMonth(next.getMonth() + deltaMonths);
    this._miniCalendarDate = next;
  }

  private openCreateEventModal(start?: Date, end?: Date, allDay = false) {
    const defaultStart = start ?? this.getDefaultEventStart();
    const defaultEnd = end ?? addMinutes(defaultStart, this.slotMinutes);
    const timeFormat = this.getTimepickerFormat();
    this._eventDraft = {
      title: "",
      startDate: toInputDate(defaultStart),
      startTime: allDay ? "" : formatTimepickerValue(defaultStart, timeFormat),
      endDate: toInputDate(defaultEnd),
      endTime: allDay ? "" : formatTimepickerValue(defaultEnd, timeFormat),
      allDay,
      color: "primary",
      description: "",
      resourceId: "",
      recurrenceFrequency: "",
      reminderMinutes: "",
      invitees: ""
    };
  }

  private openEditEventModal(event: CalendarEvent) {
    const timeFormat = this.getTimepickerFormat();
    const allDay = Boolean(event.isAllDay);
    this._eventDraft = {
      eventId: event.id,
      title: event.title,
      startDate: toInputDate(event.start),
      startTime: allDay ? "" : formatTimepickerValue(event.start, timeFormat),
      endDate: toInputDate(event.end),
      endTime: allDay ? "" : formatTimepickerValue(event.end, timeFormat),
      allDay,
      color: event.color || "primary",
      description: event.description || "",
      resourceId: event.resourceId || "",
      recurrenceFrequency: event.recurrence?.frequency || "",
      reminderMinutes: event.reminder?.minutesBefore != null ? String(event.reminder.minutesBefore) : "",
      invitees: (event.invitees ?? []).map((invitee) => invitee.name).join(", ")
    };
  }

  private getTimepickerFormat(): "12" | "24" {
    try {
      const hour12 = new Intl.DateTimeFormat(this.resolvedLocale.replace("_", "-"), { hour: "numeric" }).resolvedOptions().hour12;
      return hour12 === false ? "24" : "12";
    } catch {
      return "12";
    }
  }

  private getColorSelectOptions() {
    return EVENT_COLORS.map((color) => ({
      value: color,
      label: this.t(`calendar.form.colors.${color}`)
    }));
  }

  private getResourceSelectOptions() {
    return [
      { value: "", label: this.t("calendar.form.none") },
      ...this.resources.map((resource) => ({
        value: resource.id,
        label: resource.label
      }))
    ];
  }

  private getRecurrenceSelectOptions() {
    return [
      { value: "", label: this.t("calendar.form.recurrenceOptions.none") },
      { value: "daily", label: this.t("calendar.form.recurrenceOptions.daily") },
      { value: "weekly", label: this.t("calendar.form.recurrenceOptions.weekly") },
      { value: "monthly", label: this.t("calendar.form.recurrenceOptions.monthly") },
      { value: "yearly", label: this.t("calendar.form.recurrenceOptions.yearly") }
    ];
  }

  private getReminderSelectOptions() {
    return [
      { value: "", label: this.t("calendar.form.reminders.none") },
      { value: "0", label: this.t("calendar.form.reminders.atTime") },
      ...REMINDER_MINUTES.filter((minutes) => minutes !== "0").map((minutes) => ({
        value: minutes,
        label: this.getReminderOptionLabel(minutes)
      }))
    ];
  }

  private getReminderOptionLabel(minutes: string) {
    if (minutes === "0") {
      return this.t("calendar.form.reminders.atTime");
    }
    if (minutes === "60") {
      return this.t("calendar.form.reminders.hourBefore");
    }
    if (minutes === "1440") {
      return this.t("calendar.form.reminders.dayBefore");
    }
    return this.t("calendar.form.reminders.minutesBefore", { minutes });
  }

  private getReminderLabel(minutes: string) {
    return this.getReminderOptionLabel(minutes);
  }

  private getRecurrenceLabel(frequency: EventDraft["recurrenceFrequency"]) {
    if (!frequency) {
      return undefined;
    }
    return this.t(`calendar.form.recurrenceLabels.${frequency}`);
  }

  private handleDraftInput<K extends keyof EventDraft>(key: K) {
    return (event: Event) => {
      const source = event.currentTarget as { value?: EventDraft[K] };
      if (source.value !== undefined) {
        this.updateEventDraft(key, source.value as EventDraft[K]);
      }
    };
  }

  private handleDraftSelect<K extends keyof EventDraft>(key: K) {
    return (event: CustomEvent<{ value: string }>) => {
      this.updateEventDraft(key, event.detail.value as EventDraft[K]);
    };
  }

  private handleDraftDateChange(key: "startDate" | "endDate") {
    return (event: CustomEvent<{ dates?: string[] }>) => {
      const nextDate = event.detail.dates?.[0];
      if (nextDate) {
        this.updateEventDraft(key, nextDate);
      }
    };
  }

  private handleDraftTimeChange(key: "startTime" | "endTime") {
    return (event: CustomEvent<{ value: string }>) => {
      this.updateEventDraft(key, event.detail.value);
    };
  }

  private handleAllDayToggle(event: Event) {
    const checked = (event.currentTarget as { checked?: boolean }).checked ?? false;
    if (!this._eventDraft) {
      return;
    }

    const timeFormat = this.getTimepickerFormat();
    const next: EventDraft = { ...this._eventDraft, allDay: checked };
    if (checked) {
      next.startTime = "";
      next.endTime = "";
    } else {
      const defaultStartTime = timeFormat === "24" ? "09:00" : "9:00AM";
      const defaultEndTime = timeFormat === "24" ? "10:00" : "10:00AM";
      const baseStart = combineDateAndTime(next.startDate, defaultStartTime) ?? new Date();
      const baseEnd = combineDateAndTime(next.endDate, defaultEndTime) ?? addMinutes(baseStart, this.slotMinutes);
      next.startTime = formatTimepickerValue(baseStart, timeFormat);
      next.endTime = formatTimepickerValue(baseEnd, timeFormat);
    }
    this._eventDraft = next;
  }

  private getDefaultEventStart() {
    const next = cloneDate(this.date);
    const now = new Date();
    next.setHours(now.getHours(), Math.ceil(now.getMinutes() / this.slotMinutes) * this.slotMinutes, 0, 0);
    return next;
  }

  private updateEventDraft<K extends keyof EventDraft>(key: K, value: EventDraft[K]) {
    if (!this._eventDraft) {
      return;
    }
    this._eventDraft = { ...this._eventDraft, [key]: value };
  }

  private handleEventDraftSave(event: Event) {
    event.preventDefault();
    const draft = this._eventDraft;
    if (!draft || !draft.title.trim()) {
      return;
    }

    let start: Date | null;
    let end: Date | null;

    if (draft.allDay) {
      start = parseInputDate(draft.startDate);
      end = parseInputDate(draft.endDate);
      if (start) {
        start = startOfDay(start);
      }
      if (end) {
        end = endOfDay(end);
      }
    } else {
      start = combineDateAndTime(draft.startDate, draft.startTime);
      end = combineDateAndTime(draft.endDate, draft.endTime);
    }

    if (!start || !end) {
      return;
    }

    if (end <= start) {
      end = draft.allDay ? endOfDay(start) : addMinutes(start, this.slotMinutes);
    }

    const baseEvent = draft.eventId ? this.events.find((entry) => entry.id === draft.eventId) : undefined;
    const nextEvent: CalendarEvent = {
      ...(baseEvent ?? {}),
      id: draft.eventId || `evt_${Date.now()}`,
      title: draft.title.trim(),
      start,
      end,
      color: draft.color,
      isAllDay: draft.allDay,
      description: draft.description.trim() || undefined,
      resourceId: draft.resourceId || undefined,
      recurrence: draft.recurrenceFrequency
        ? {
            frequency: draft.recurrenceFrequency,
            label: this.getRecurrenceLabel(draft.recurrenceFrequency)
          }
        : undefined,
      reminder: draft.reminderMinutes
        ? {
            minutesBefore: Number(draft.reminderMinutes),
            label: this.getReminderLabel(draft.reminderMinutes)
          }
        : undefined,
      invitees: draft.invitees
        .split(",")
        .map((name) => name.trim())
        .filter(Boolean)
        .map((name, index) => ({
          id: `inv_${Date.now()}_${index}`,
          name,
          status: "awaiting" as const
        }))
    };

    if (draft.eventId && baseEvent) {
      this.dispatchEvent(new CustomEvent<CalendarEventChangeDetail>("loomi-event-change", {
        detail: {
          event: nextEvent,
          previousStart: baseEvent.start,
          previousEnd: baseEvent.end,
          previousResourceId: baseEvent.resourceId
        },
        bubbles: true,
        composed: true
      }));
    } else {
      this.dispatchEvent(new CustomEvent<CalendarEventCreateDetail>("loomi-event-create", {
        detail: { event: nextEvent },
        bubbles: true,
        composed: true
      }));
    }
    this._eventDraft = undefined;
  }

  private handleCreateEventCancel() {
    this._eventDraft = undefined;
  }

  confirmDeleteEvent(eventOrId: CalendarEvent | string): void {
    const event = typeof eventOrId === "string"
      ? this.events.find((entry) => entry.id === eventOrId)
      : eventOrId;
    if (!event) {
      return;
    }

    this.selectedEventId = event.id;
    this._deleteEvent = event;
  }

  deleteEvent(eventOrId: CalendarEvent | string): void {
    const event = typeof eventOrId === "string"
      ? this.events.find((entry) => entry.id === eventOrId)
      : eventOrId;
    if (!event) {
      return;
    }

    this.dispatchDeleteEvent(event);
  }

  private handleDeleteEvent(event: CalendarEvent) {
    this.confirmDeleteEvent(event);
  }

  private handleConfirmDeleteEvent = () => {
    const event = this._deleteEvent;
    if (!event) {
      return;
    }

    this.dispatchDeleteEvent(event);
    this._deleteEvent = undefined;
    if (this.selectedEventId === event.id) {
      this.selectedEventId = "";
    }
  };

  private handleDeleteEventCancel = () => {
    this._deleteEvent = undefined;
  };

  private dispatchDeleteEvent(event: CalendarEvent) {
    this.dispatchEvent(new CustomEvent<CalendarEventDeleteDetail>("loomi-event-delete", {
      detail: { event },
      bubbles: true,
      composed: true
    }));
  }

  private handleDuplicateEvent(event: CalendarEvent) {
    const duplicate: CalendarEvent = {
      ...event,
      id: `evt_${Date.now()}`,
      title: `${event.title} (copy)`,
      start: addMinutes(cloneDate(event.start), this.slotMinutes),
      end: addMinutes(cloneDate(event.end), this.slotMinutes)
    };
    this.dispatchEvent(new CustomEvent<CalendarEventDuplicateDetail>("loomi-event-duplicate", {
      detail: { event: duplicate },
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
    return this.locale || getLoomiLocale();
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
