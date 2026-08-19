import { NextRequest, NextResponse } from "next/server";

export const SESSION_COOKIE = "librebooking_session";
export const USER_COOKIE = "librebooking_user_id";

export function getLibreBookingUrl(path: string) {
  const baseUrl = process.env.LIBREBOOKING_BASE_URL?.replace(/\/$/, "");
  if (!baseUrl) throw new Error("Thiếu LIBREBOOKING_BASE_URL trong cấu hình server.");
  return `${baseUrl}/Web/Services/index.php${path}`;
}

export async function proxyLibreBooking(
  request: NextRequest,
  path: string,
  init?: RequestInit,
) {
  const sessionToken = request.cookies.get(SESSION_COOKIE)?.value;
  const userId = request.cookies.get(USER_COOKIE)?.value;
  const response = await fetch(getLibreBookingUrl(path), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(sessionToken ? { "X-Booked-SessionToken": sessionToken } : {}),
      ...(userId ? { "X-Booked-UserId": userId } : {}),
      ...init?.headers,
    },
    cache: "no-store",
  });
  const text = await response.text();
  return new NextResponse(text || null, {
    status: response.status,
    headers: { "Content-Type": response.headers.get("Content-Type") ?? "application/json" },
  });
}
