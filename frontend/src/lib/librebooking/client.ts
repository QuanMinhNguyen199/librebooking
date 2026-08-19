import { LibreBookingError } from "./errors";

export async function libreBookingRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`/api/librebooking${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new LibreBookingError(
      payload?.message ?? `LibreBooking API trả về HTTP ${response.status}`,
      response.status,
      payload,
    );
  }
  return payload as T;
}
