import { libreBookingRequest } from "@/lib/librebooking/client";
import { toLibreBookingReservation } from "./mapper";
import type { CreateReservationInput } from "./types";

export function createReservation(input: CreateReservationInput) {
  return libreBookingRequest<{ referenceNumber: string }>("/reservations", {
    method: "POST",
    body: JSON.stringify(toLibreBookingReservation(input)),
  });
}
