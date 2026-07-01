export type CalendarEventColor = "primary" | "secondary" | "success" | "warning" | "error";

export type CalendarView = "month" | "week" | "day" | "agenda" | "resource";

export type CalendarWeekStarts = "sunday" | "monday";

export interface CalendarResource {
  id: string;
  label: string;
  color?: CalendarEventColor;
  description?: string;
}

export interface CalendarEventRecurrence {
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  label?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: CalendarEventColor;
  description?: string;
  isAllDay?: boolean;
  resourceId?: string;
  recurrence?: CalendarEventRecurrence;
  timezone?: string;
  editable?: boolean;
  draggable?: boolean;
}

export interface CalendarViewChangeDetail {
  view: CalendarView;
}

export interface CalendarDateChangeDetail {
  date: Date;
}

export interface CalendarEventClickDetail {
  event: CalendarEvent;
}

export interface CalendarEventChangeDetail {
  event: CalendarEvent;
  previousStart: Date;
  previousEnd: Date;
  previousResourceId?: string;
}

export interface CalendarSlotSelectDetail {
  start: Date;
  end: Date;
  resourceId?: string;
  allDay?: boolean;
}
