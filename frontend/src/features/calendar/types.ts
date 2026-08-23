export type CalendarSource = "personal" | "resource" | "company" | "team" | "holiday";
export type CalendarItemType = "reservation" | "personal_event" | "company_event" | "team_event" | "blackout" | "holiday";
export type CalendarConflictPolicy = "block" | "warn" | "none";

export type CalendarEvent = {
  id: string;
  date: string;
  title: string;
  startsAt?: string;
  endsAt?: string;
  sources: CalendarSource[];
  type: CalendarItemType;
  conflictPolicy: CalendarConflictPolicy;
  visibility: "public" | "private";
  reservationId?: string;
  reservationStatus?: "pending" | "confirmed";
  resourceId?: string;
  location?: string;
  allDay?: boolean;
  participantEmails?: string[];
  bookedBy?: string;
};
