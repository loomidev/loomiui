import { css, html, nothing, svg } from "lit";
import { customElement } from "lit/decorators.js";
import {
  LoomiElement,
  loomiDateFormatter,
  loomiMonthName,
  loomiStyles,
  loomiWeekdayNames
} from "@loomidev/core";
import "@loomidev/modal/loomi-modal.js";
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
  chunkMonthWeeks,
  cloneDate,
  dateFromGridPosition,
  dateFromResourcePosition,
  endOfDay,
  formatEventRange,
  formatTime,
  formatTimezoneLabel,
  fromInputDateTime,
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
  startOfDay,
  summarizeInvitees,
  toInputDateTime,
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

const VIEW_OPTIONS: Array<{ id: CalendarView; label: string; shortcut: string }> = [
  { id: "month", label: "Month", shortcut: "M" },
  { id: "week", label: "Week", shortcut: "W" },
  { id: "day", label: "Day", shortcut: "D" },
  { id: "agenda", label: "Agenda", shortcut: "A" },
  { id: "resource", label: "Resources", shortcut: "R" }
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
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  color: CalendarEventColor;
  description: string;
  resourceId: string;
  recurrenceFrequency: "" | "daily" | "weekly" | "monthly" | "yearly";
  recurrenceLabel: string;
  reminderLabel: string;
  inviteesText: string;
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
    showSidebar: { attribute: "show-sidebar", type: Boolean },
    sidebarOpen: { attribute: "sidebar-open", type: Boolean, reflect: true },
    _dragState: { state: true },
    _slotDragState: { state: true },
    _miniCalendarDate: { state: true },
    _eventDraft: { state: true }
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
  showWeekends = true;
  editable = false;
  loading = false;
  startHour = 6;
  endHour = 18;
  slotMinutes = 30;
  showSidebar = true;
  sidebarOpen = true;
  declare _dragState?: DragState;
  declare _slotDragState?: SlotDragState;
  declare _miniCalendarDate?: Date;
  declare _eventDraft?: EventDraft;

  private createModalName = "loomi-calendar-create-event";

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
    const cells = getMonthGridDays(miniDate, this.weekStarts);
    const weekdays = loomiWeekdayNames(this.resolvedLocale, this.weekStarts);

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
        <div class="mini-weekdays">
          ${weekdays.map((label) => html`<div class="mini-weekday">${label.slice(0, 2)}</div>`)}
        </div>
        <div class="mini-grid">
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

    return html`
      <loomi-modal
        name=${this.createModalName}
        title="New event"
        ok-button-label="Save"
        cancel-button-label="Cancel"
        size="medium"
        ?open=${true}
        @ok=${this.handleCreateEventSave}
        @cancel=${this.handleCreateEventCancel}
        @close=${this.handleCreateEventCancel}
      >
        <div class="event-form">
          <label class="form-field">
            <span class="form-label">Title</span>
            <input
              class="form-input"
              name="title"
              .value=${draft.title}
              @input=${(event: Event) => this.updateEventDraft("title", (event.target as HTMLInputElement).value)}
            />
          </label>
          <label class="form-field">
            <span class="form-label">Start</span>
            <input
              class="form-input"
              type=${draft.allDay ? "date" : "datetime-local"}
              .value=${draft.start}
              @input=${(event: Event) => this.updateEventDraft("start", (event.target as HTMLInputElement).value)}
            />
          </label>
          <label class="form-field">
            <span class="form-label">End</span>
            <input
              class="form-input"
              type=${draft.allDay ? "date" : "datetime-local"}
              .value=${draft.end}
              @input=${(event: Event) => this.updateEventDraft("end", (event.target as HTMLInputElement).value)}
            />
          </label>
          <label class="form-check">
            <input
              type="checkbox"
              .checked=${draft.allDay}
              @change=${(event: Event) => this.updateEventDraft("allDay", (event.target as HTMLInputElement).checked)}
            />
            All day
          </label>
          <label class="form-field">
            <span class="form-label">Color</span>
            <select
              class="form-input"
              .value=${draft.color}
              @change=${(event: Event) => this.updateEventDraft("color", (event.target as HTMLSelectElement).value as CalendarEventColor)}
            >
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
          </label>
          ${this.resources.length ? html`
            <label class="form-field">
              <span class="form-label">Resource</span>
              <select
                class="form-input"
                .value=${draft.resourceId}
                @change=${(event: Event) => this.updateEventDraft("resourceId", (event.target as HTMLSelectElement).value)}
              >
                <option value="">None</option>
                ${this.resources.map((resource) => html`
                  <option value=${resource.id}>${resource.label}</option>
                `)}
              </select>
            </label>
          ` : nothing}
          <label class="form-field">
            <span class="form-label">Recurrence</span>
            <select
              class="form-input"
              .value=${draft.recurrenceFrequency}
              @change=${(event: Event) => this.updateEventDraft("recurrenceFrequency", (event.target as HTMLSelectElement).value as EventDraft["recurrenceFrequency"])}
            >
              <option value="">Does not repeat</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </label>
          ${draft.recurrenceFrequency ? html`
            <label class="form-field">
              <span class="form-label">Recurrence label</span>
              <input
                class="form-input"
                .value=${draft.recurrenceLabel}
                placeholder="Repeats weekly"
                @input=${(event: Event) => this.updateEventDraft("recurrenceLabel", (event.target as HTMLInputElement).value)}
              />
            </label>
          ` : nothing}
          <label class="form-field">
            <span class="form-label">Reminder</span>
            <input
              class="form-input"
              .value=${draft.reminderLabel}
              placeholder="10 min before"
              @input=${(event: Event) => this.updateEventDraft("reminderLabel", (event.target as HTMLInputElement).value)}
            />
          </label>
          <label class="form-field">
            <span class="form-label">Invitees</span>
            <input
              class="form-input"
              .value=${draft.inviteesText}
              placeholder="Ada Lovelace, Grace Hopper"
              @input=${(event: Event) => this.updateEventDraft("inviteesText", (event.target as HTMLInputElement).value)}
            />
          </label>
          <label class="form-field">
            <span class="form-label">Description</span>
            <textarea
              class="form-input form-textarea"
              .value=${draft.description}
              rows="4"
              @input=${(event: Event) => this.updateEventDraft("description", (event.target as HTMLTextAreaElement).value)}
            ></textarea>
          </label>
        </div>
      </loomi-modal>
    `;
  }

  private renderToolbar() {
    return html`
      <div class="toolbar">
        <div class="toolbar-group">
          ${this.showSidebar ? html`
            <button
              class="icon-btn"
              type="button"
              aria-label=${this.sidebarOpen ? "Hide calendar list" : "Show calendar list"}
              title=${this.sidebarOpen ? "Hide calendar list" : "Show calendar list"}
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
        <div class="toolbar-group">
          ${this.editable ? html`
            <button class="btn btn-primary" type="button" @click=${() => this.openCreateEventModal()}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${PLUS}</svg>
              Add event
            </button>
          ` : nothing}
          <button class="btn" type="button" @click=${this.goToToday}>Today</button>
          <button class="icon-btn" type="button" aria-label="Previous" @click=${this.goPrev}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${PREV}</svg>
          </button>
          <button class="icon-btn" type="button" aria-label="Next" @click=${this.goNext}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${NEXT}</svg>
          </button>
          <div class="view-switcher segmented" role="group" aria-label="Calendar view">
            ${VIEW_OPTIONS.map((option) => html`
              <button
                class="seg-btn ${this.view === option.id ? "active" : ""}"
                type="button"
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
    const weekdays = loomiWeekdayNames(this.resolvedLocale, this.weekStarts);
    const weeks = chunkMonthWeeks(this.date, this.weekStarts);
    const cells = getMonthGridDays(this.date, this.weekStarts);
    const isOtherMonthMap = new Map(cells.map((cell) => [cell.date.toDateString(), cell.isOtherMonth]));

    return html`
      <div class="month-view">
        <div class="weekdays" style=${`grid-template-columns: repeat(7, minmax(0, 1fr))`}>
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
                <div class="month-grid month-week-days">
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
        class="spanning-event event-${event.color || "primary"} ${draggable ? "draggable" : ""} ${dragging ? "dragging" : ""}"
        style=${`left: calc(${left}% + 4px); width: calc(${width}% - 8px); top: calc(${lane * 24}px + 4px);`}
        @click=${(clickEvent: Event) => this.handleEventClick(clickEvent, event)}
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
      <div class="month-view">
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
        class="timed-event event-${event.color || "primary"} ${draggable ? "draggable" : ""} ${dragging ? "dragging" : ""}"
        style=${`top: ${displayTop}px; height: ${displayHeight}px; left: calc(${left}% + 2px); width: calc(${width}% - 4px);${displayTransform ? ` transform: ${displayTransform};` : ""}`}
        @click=${(clickEvent: Event) => this.handleEventClick(clickEvent, event)}
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
      ? chunkMonthWeeks(this.date, this.weekStarts).find((week) => week.some((day) => isSameDay(day, startOfDay(event.start)))) ?? [startOfDay(event.start)]
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
      ? chunkMonthWeeks(this.date, this.weekStarts).find((week) => week.some((day) => isSameDay(day, startOfDay(event.start)))) ?? [startOfDay(event.start)]
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
    this.dispatchEvent(new CustomEvent<CalendarSidebarToggleDetail>("loomi-sidebar-toggle", {
      detail: { open: this.sidebarOpen },
      bubbles: true,
      composed: true
    }));
  }

  private shiftMiniCalendar(deltaMonths: number) {
    const next = cloneDate(this._miniCalendarDate ?? this.date);
    next.setMonth(next.getMonth() + deltaMonths);
    this._miniCalendarDate = next;
  }

  private openCreateEventModal(start?: Date, end?: Date, allDay = false) {
    const defaultStart = start ?? this.getDefaultEventStart();
    const defaultEnd = end ?? addMinutes(defaultStart, this.slotMinutes);
    this._eventDraft = {
      title: "",
      start: allDay ? toInputDateTime(startOfDay(defaultStart)).slice(0, 10) : toInputDateTime(defaultStart),
      end: allDay ? toInputDateTime(startOfDay(defaultEnd)).slice(0, 10) : toInputDateTime(defaultEnd),
      allDay,
      color: "primary",
      description: "",
      resourceId: "",
      recurrenceFrequency: "",
      recurrenceLabel: "",
      reminderLabel: "",
      inviteesText: ""
    };
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

  private handleCreateEventSave(event: Event) {
    event.preventDefault();
    const draft = this._eventDraft;
    if (!draft || !draft.title.trim()) {
      return;
    }

    let start = draft.allDay
      ? fromInputDateTime(`${draft.start}T00:00`)
      : fromInputDateTime(draft.start);
    let end = draft.allDay
      ? fromInputDateTime(`${draft.end}T23:59`)
      : fromInputDateTime(draft.end);

    if (!start || !end) {
      return;
    }

    if (draft.allDay) {
      start = startOfDay(start);
      end = endOfDay(end);
    }

    if (end <= start) {
      end = draft.allDay ? endOfDay(start) : addMinutes(start, this.slotMinutes);
    }

    const created: CalendarEvent = {
      id: `evt_${Date.now()}`,
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
            label: draft.recurrenceLabel.trim() || undefined
          }
        : undefined,
      reminder: draft.reminderLabel.trim()
        ? { label: draft.reminderLabel.trim() }
        : undefined,
      invitees: draft.inviteesText
        .split(",")
        .map((name) => name.trim())
        .filter(Boolean)
        .map((name, index) => ({
          id: `inv_${Date.now()}_${index}`,
          name,
          status: "awaiting" as const
        }))
    };

    this.dispatchEvent(new CustomEvent<CalendarEventCreateDetail>("loomi-event-create", {
      detail: { event: created },
      bubbles: true,
      composed: true
    }));
    this._eventDraft = undefined;
  }

  private handleCreateEventCancel() {
    this._eventDraft = undefined;
  }

  private handleDeleteEvent(event: CalendarEvent) {
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
