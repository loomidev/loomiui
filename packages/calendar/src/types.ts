export type CalendarEventColor = "primary" | "secondary" | "info" | "success" | "warning" | "error";

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

export type CalendarInviteeStatus = "yes" | "no" | "awaiting";

export interface CalendarEventInvitee {
  id?: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  initials?: string;
  status?: CalendarInviteeStatus;
}

export interface CalendarEventReminder {
  label: string;
  minutesBefore?: number;
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
  reminder?: CalendarEventReminder;
  invitees?: CalendarEventInvitee[];
  timezone?: string;
  editable?: boolean;
  draggable?: boolean;
}

export interface CalendarReminder {
  id: string;
  title: string;
  due: Date;
  color?: CalendarEventColor;
  description?: string;
  done?: boolean;
  editable?: boolean;
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

export interface CalendarEventCreateDetail {
  event: CalendarEvent;
}

export interface CalendarEventDeleteDetail {
  event: CalendarEvent;
}

export interface CalendarEventDuplicateDetail {
  event: CalendarEvent;
}

export interface CalendarReminderClickDetail {
  reminder: CalendarReminder;
}

export interface CalendarReminderCreateDetail {
  reminder: CalendarReminder;
}

export interface CalendarReminderChangeDetail {
  reminder: CalendarReminder;
  previousDue: Date;
}

export interface CalendarReminderDeleteDetail {
  reminder: CalendarReminder;
}

export interface CalendarSidebarToggleDetail {
  open: boolean;
}
