import type { CalendarEvent, CalendarEventInvitee, CalendarWeekStarts } from "./types.js";

export const HOUR_HEIGHT = 48;
export const MIN_EVENT_HEIGHT = 22;
export const ALL_DAY_HEIGHT = 36;
export const RESOURCE_LABEL_WIDTH = 160;
export const TIME_AXIS_WIDTH = 72;

export interface PositionedEvent {
  event: CalendarEvent;
  top: number;
  height: number;
  left: number;
  width: number;
  zIndex: number;
}

export interface AgendaGroup {
  date: Date;
  events: CalendarEvent[];
}

export function cloneDate(date: Date) {
  return new Date(date.getTime());
}

export function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function endOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}

export function addDays(date: Date, days: number) {
  const next = cloneDate(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function addMinutes(date: Date, minutes: number) {
  const next = cloneDate(date);
  next.setMinutes(next.getMinutes() + minutes);
  return next;
}

export function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isSameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export function isToday(date: Date, reference = new Date()) {
  return isSameDay(date, reference);
}

export function getWeekDays(date: Date, weekStarts: CalendarWeekStarts) {
  const anchor = cloneDate(date);
  const day = anchor.getDay();
  const offset = (day - (weekStarts === "monday" ? 1 : 0) + 7) % 7;
  anchor.setDate(anchor.getDate() - offset);

  return Array.from({ length: 7 }, (_, index) => addDays(anchor, index));
}

export function getVisibleWeekDays(date: Date, weekStarts: CalendarWeekStarts, showWeekends: boolean) {
  const days = getWeekDays(date, weekStarts);
  return showWeekends ? days : days.filter((day) => {
    const weekday = day.getDay();
    return weekday !== 0 && weekday !== 6;
  });
}

export function getMonthGridDays(date: Date, weekStarts: CalendarWeekStarts) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const offset = (firstDay.getDay() - (weekStarts === "monday" ? 1 : 0) + 7) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<{ date: Date; isOtherMonth: boolean }> = [];

  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let index = offset - 1; index >= 0; index -= 1) {
    cells.push({
      date: new Date(year, month - 1, prevMonthDays - index),
      isOtherMonth: true
    });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ date: new Date(year, month, day), isOtherMonth: false });
  }

  while (cells.length % 7 !== 0) {
    const nextDay = cells.length - offset - daysInMonth + 1;
    cells.push({ date: new Date(year, month + 1, nextDay), isOtherMonth: true });
  }

  while (cells.length < 42) {
    const nextDay = cells.length - offset - daysInMonth + 1;
    cells.push({ date: new Date(year, month + 1, nextDay), isOtherMonth: true });
  }

  return cells;
}

export function overlapsDay(event: CalendarEvent, date: Date) {
  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);
  return event.start <= dayEnd && event.end >= dayStart;
}

export function getEventsForDate(events: CalendarEvent[], date: Date) {
  return events
    .filter((event) => overlapsDay(event, date))
    .sort((left, right) => {
      if (left.isAllDay !== right.isAllDay) {
        return left.isAllDay ? -1 : 1;
      }
      return left.start.getTime() - right.start.getTime();
    });
}

export function getTimedEventsForDate(events: CalendarEvent[], date: Date) {
  return getEventsForDate(events, date).filter((event) => !event.isAllDay);
}

export function getAllDayEventsForDate(events: CalendarEvent[], date: Date) {
  return getEventsForDate(events, date).filter((event) => event.isAllDay);
}

export function clampEventToDay(event: CalendarEvent, date: Date) {
  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);
  const start = event.start < dayStart ? dayStart : event.start;
  const end = event.end > dayEnd ? dayEnd : event.end;
  return { start, end };
}

export function minutesFromDayStart(date: Date, startHour: number) {
  return (date.getHours() - startHour) * 60 + date.getMinutes();
}

export function layoutTimedEvents(
  events: CalendarEvent[],
  date: Date,
  startHour: number,
  endHour: number,
  hourHeight = HOUR_HEIGHT
): PositionedEvent[] {
  const timed = getTimedEventsForDate(events, date);
  if (!timed.length) {
    return [];
  }

  const segments = timed.map((event) => {
    const { start, end } = clampEventToDay(event, date);
    const startMinutes = Math.max(0, minutesFromDayStart(start, startHour));
    const endMinutes = Math.min((endHour - startHour) * 60, minutesFromDayStart(end, startHour));
    const duration = Math.max(15, endMinutes - startMinutes);
    return {
      event,
      startMinutes,
      endMinutes: startMinutes + duration
    };
  }).sort((left, right) => left.startMinutes - right.startMinutes || right.endMinutes - left.endMinutes);

  const clusters: Array<typeof segments> = [];

  for (const segment of segments) {
    const cluster = clusters.find((group) => group.some((item) => segment.startMinutes < item.endMinutes && segment.endMinutes > item.startMinutes));
    if (cluster) {
      cluster.push(segment);
    } else {
      clusters.push([segment]);
    }
  }

  const positioned: PositionedEvent[] = [];

  for (const cluster of clusters) {
    const columns: Array<typeof segments> = [];

    for (const segment of cluster.sort((left, right) => left.startMinutes - right.startMinutes)) {
      const column = columns.find((items) => items.every((item) => segment.startMinutes >= item.endMinutes || segment.endMinutes <= item.startMinutes));
      if (column) {
        column.push(segment);
      } else {
        columns.push([segment]);
      }
    }

    const columnCount = columns.length;

    columns.forEach((column, columnIndex) => {
      for (const segment of column) {
        const top = (segment.startMinutes / 60) * hourHeight;
        const height = Math.max(MIN_EVENT_HEIGHT, ((segment.endMinutes - segment.startMinutes) / 60) * hourHeight);
        positioned.push({
          event: segment.event,
          top,
          height,
          left: (columnIndex / columnCount) * 100,
          width: 100 / columnCount,
          zIndex: columnIndex + 1
        });
      }
    });
  }

  return positioned;
}

export function buildAgendaGroups(
  events: CalendarEvent[],
  rangeStart: Date,
  rangeEnd: Date
): AgendaGroup[] {
  const groups = new Map<string, AgendaGroup>();
  const cursor = startOfDay(rangeStart);
  const end = startOfDay(rangeEnd);

  while (cursor <= end) {
    const key = cursor.toISOString();
    groups.set(key, { date: cloneDate(cursor), events: [] });
    cursor.setDate(cursor.getDate() + 1);
  }

  for (const event of [...events].sort((left, right) => left.start.getTime() - right.start.getTime())) {
    const day = startOfDay(event.start);
    if (day < startOfDay(rangeStart) || day > startOfDay(rangeEnd)) {
      continue;
    }
    const key = day.toISOString();
    groups.get(key)?.events.push(event);
  }

  return [...groups.values()].filter((group) => group.events.length > 0);
}

export function snapMinutes(value: number, interval: number) {
  return Math.round(value / interval) * interval;
}

export function dateFromGridPosition(
  day: Date,
  offsetY: number,
  startHour: number,
  hourHeight: number,
  slotMinutes: number
) {
  const minutes = snapMinutes((offsetY / hourHeight) * 60, slotMinutes);
  const next = startOfDay(day);
  next.setHours(startHour, minutes, 0, 0);
  return next;
}

export function formatTime(date: Date, locale: string, timeZone?: string) {
  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
    timeZone: timeZone || undefined
  }).format(date);
}

export function formatEventRange(
  event: CalendarEvent,
  locale: string,
  timeZone?: string
) {
  if (event.isAllDay) {
    return "All day";
  }

  const zone = event.timezone || timeZone;
  return `${formatTime(event.start, locale, zone)} – ${formatTime(event.end, locale, zone)}`;
}

export function formatTimezoneLabel(timeZone: string, locale: string) {
  try {
    const parts = new Intl.DateTimeFormat(locale, {
      timeZone,
      timeZoneName: "shortOffset"
    }).formatToParts(new Date());
    const name = parts.find((part) => part.type === "timeZoneName")?.value;
    return name ? `${timeZone} (${name})` : timeZone;
  } catch {
    return timeZone;
  }
}

export function getNowOffset(startHour: number, endHour: number, hourHeight: number, reference = new Date()) {
  const minutes = minutesFromDayStart(reference, startHour);
  const totalMinutes = (endHour - startHour) * 60;
  if (minutes < 0 || minutes > totalMinutes) {
    return null;
  }
  return (minutes / 60) * hourHeight;
}

export function canDragEvent(event: CalendarEvent, editable: boolean) {
  if (event.draggable === false) {
    return false;
  }
  if (event.editable === false) {
    return false;
  }
  if (event.draggable === true) {
    return true;
  }
  return editable;
}

export function canEditEvent(event: CalendarEvent, editable: boolean) {
  if (event.editable === false) {
    return false;
  }
  if (event.editable === true) {
    return true;
  }
  return editable;
}

export interface PositionedResourceEvent {
  event: CalendarEvent;
  left: number;
  width: number;
}

export function layoutResourceDayEvents(
  events: CalendarEvent[],
  resourceId: string,
  date: Date,
  startHour: number,
  endHour: number
): PositionedResourceEvent[] {
  const totalMinutes = (endHour - startHour) * 60;

  return events
    .filter((event) => event.resourceId === resourceId && overlapsDay(event, date) && !event.isAllDay)
    .map((event) => {
      const { start, end } = clampEventToDay(event, date);
      const startMinutes = Math.max(0, minutesFromDayStart(start, startHour));
      const endMinutes = Math.min(totalMinutes, Math.max(startMinutes + 15, minutesFromDayStart(end, startHour)));
      return {
        event,
        left: (startMinutes / totalMinutes) * 100,
        width: Math.max(2, ((endMinutes - startMinutes) / totalMinutes) * 100)
      };
    })
    .sort((left, right) => left.event.start.getTime() - right.event.start.getTime());
}

export function dateFromResourcePosition(
  day: Date,
  offsetX: number,
  trackWidth: number,
  startHour: number,
  endHour: number,
  slotMinutes: number
) {
  const totalMinutes = (endHour - startHour) * 60;
  const ratio = Math.min(1, Math.max(0, offsetX / trackWidth));
  const minutes = snapMinutes(ratio * totalMinutes, slotMinutes);
  const next = startOfDay(day);
  next.setHours(startHour, minutes, 0, 0);
  return next;
}

export interface SpanningEventLayout {
  event: CalendarEvent;
  startIndex: number;
  endIndex: number;
  lane: number;
}

export function isMultiDayEvent(event: CalendarEvent) {
  return event.isAllDay || !isSameDay(startOfDay(event.start), startOfDay(event.end));
}

export function getDayIndex(days: Date[], date: Date) {
  return days.findIndex((day) => isSameDay(day, date));
}

export function layoutSpanningEvents(days: Date[], events: CalendarEvent[]): SpanningEventLayout[] {
  if (!days.length) {
    return [];
  }

  const rangeStart = startOfDay(days[0]);
  const rangeEnd = endOfDay(days[days.length - 1]);
  const candidates = events
    .filter((event) => event.start <= rangeEnd && event.end >= rangeStart && isMultiDayEvent(event))
    .sort((left, right) => left.start.getTime() - right.start.getTime() || right.end.getTime() - left.end.getTime());

  const lanes: Array<Array<{ startIndex: number; endIndex: number }>> = [];
  const positioned: SpanningEventLayout[] = [];

  for (const event of candidates) {
    const visibleStart = event.start < rangeStart ? rangeStart : startOfDay(event.start);
    const visibleEnd = event.end > rangeEnd ? rangeEnd : startOfDay(event.end);
    let startIndex = getDayIndex(days, visibleStart);
    let endIndex = getDayIndex(days, visibleEnd);
    if (startIndex === -1) {
      startIndex = 0;
    }
    if (endIndex === -1) {
      endIndex = days.length - 1;
    }
    if (startIndex > endIndex) {
      continue;
    }

    let laneIndex = lanes.findIndex((lane) =>
      lane.every((segment) => endIndex < segment.startIndex || startIndex > segment.endIndex)
    );
    if (laneIndex === -1) {
      laneIndex = lanes.length;
      lanes.push([]);
    }
    lanes[laneIndex].push({ startIndex, endIndex });
    positioned.push({ event, startIndex, endIndex, lane: laneIndex });
  }

  return positioned;
}

export function getUpcomingEvents(events: CalendarEvent[], from: Date, limit = 20) {
  const anchor = startOfDay(from).getTime();
  return [...events]
    .filter((event) => event.end.getTime() >= anchor)
    .sort((left, right) => left.start.getTime() - right.start.getTime())
    .slice(0, limit);
}

export function getNextUpcomingEvent(events: CalendarEvent[], from: Date) {
  return getUpcomingEvents(events, from, 1)[0] ?? null;
}

export function hasEventsOnDate(events: CalendarEvent[], date: Date) {
  return getEventsForDate(events, date).length > 0;
}

export function summarizeInvitees(invitees: CalendarEventInvitee[] = []) {
  const total = invitees.length;
  const yes = invitees.filter((invitee) => invitee.status === "yes").length;
  const awaiting = invitees.filter((invitee) => invitee.status === "awaiting" || !invitee.status).length;
  const no = invitees.filter((invitee) => invitee.status === "no").length;
  return { total, yes, awaiting, no };
}

export function getInviteeInitials(invitee: CalendarEventInvitee) {
  if (invitee.initials) {
    return invitee.initials.slice(0, 2).toUpperCase();
  }
  const parts = invitee.name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
  }
  return invitee.name.slice(0, 2).toUpperCase();
}

export function toInputDateTime(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function fromInputDateTime(value: string): Date | null {
  const match = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
  if (!match) {
    return null;
  }
  return new Date(+match[1], +match[2] - 1, +match[3], +match[4], +match[5], 0, 0);
}

export function toInputDate(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function parseInputDate(value: string): Date | null {
  const match = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    return null;
  }
  return new Date(+match[1], +match[2] - 1, +match[3], 0, 0, 0, 0);
}

export function formatTimepickerValue(date: Date, format: "12" | "24" = "12") {
  const pad = (value: number) => String(value).padStart(2, "0");
  const hours = date.getHours();
  const minutes = date.getMinutes();
  if (format === "24") {
    return `${pad(hours)}:${pad(minutes)}`;
  }
  const ampm = hours >= 12 ? "PM" : "AM";
  const hour = hours % 12 || 12;
  return `${hour}:${pad(minutes)}${ampm}`;
}

export function combineDateAndTime(dateValue: string, timeValue: string): Date | null {
  const date = parseInputDate(dateValue);
  if (!date) {
    return null;
  }

  const match = timeValue.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) {
    return null;
  }

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3]?.toUpperCase();
  if (meridiem === "PM" && hours < 12) {
    hours += 12;
  }
  if (meridiem === "AM" && hours === 12) {
    hours = 0;
  }

  date.setHours(hours, minutes, 0, 0);
  return date;
}

export function chunkMonthWeeks(date: Date, weekStarts: CalendarWeekStarts) {
  const cells = getMonthGridDays(date, weekStarts);
  const weeks: Date[][] = [];
  for (let index = 0; index < cells.length; index += 7) {
    weeks.push(cells.slice(index, index + 7).map((cell) => cell.date));
  }
  return weeks;
}

export function getSingleDayEventsForDate(events: CalendarEvent[], date: Date) {
  return getEventsForDate(events, date).filter((event) => !isMultiDayEvent(event));
}
