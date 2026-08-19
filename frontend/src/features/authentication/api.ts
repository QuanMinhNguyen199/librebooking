import { libreBookingRequest } from "@/lib/librebooking/client";
import type { AuthSession, LoginInput } from "./types";

export function loginRequest(input: LoginInput) {
  return libreBookingRequest<AuthSession>("/authentication", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
