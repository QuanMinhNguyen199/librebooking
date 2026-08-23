import type { CreateReservationInput } from "./types";

export function toLibreBookingReservation(input: CreateReservationInput) {
  return {
    title: input.title,
    resourceId: Number(input.resourceId),
    startDateTime: input.startsAt,
    endDateTime: input.endsAt,
    accessories: input.accessories,
    participantEmails: input.participantEmails,
  };
}
