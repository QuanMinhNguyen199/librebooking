import { demoCalendarEvents } from "./mock";
import type { CalendarEvent } from "./types";
import type { ReservationSummary } from "@/features/reservations/types";

export type BookingConflict = { event: CalendarEvent; level: "block" | "warn" };

export function mapReservationsToCalendarEvents(reservations: ReservationSummary[]): CalendarEvent[] {
  return reservations.map(item => ({
    id: `reservation-${item.id}`, reservationId: item.id, date: item.date, title: item.title,
    startsAt: item.time, endsAt: item.endsAt, sources: ["personal", "resource"], type: "reservation",
    conflictPolicy: "block", visibility: "private", resourceId: item.resourceId, location: item.resourceName,
    reservationStatus: item.status ?? "confirmed",
    participantEmails: item.participantEmails,
    bookedBy: item.bookedBy,
  }));
}

export function getBookingConflicts(date: string, startTime: string, endTime: string, resourceId: string, reservations: ReservationSummary[] = []): BookingConflict[] {
  const reservationEvents = mapReservationsToCalendarEvents(reservations);
  return [...demoCalendarEvents, ...reservationEvents].flatMap(event => {
    if (event.date !== date || event.allDay || !event.startsAt || !event.endsAt) return [];
    if (!(startTime < event.endsAt && endTime > event.startsAt)) return [];
    if ((event.type === "reservation" || event.type === "blackout") && event.resourceId !== resourceId) return [];
    if (event.conflictPolicy === "none") return [];
    return [{ event, level: event.conflictPolicy }];
  });
}
