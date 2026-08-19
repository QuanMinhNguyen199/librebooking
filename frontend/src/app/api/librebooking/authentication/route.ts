import { NextRequest, NextResponse } from "next/server";
import { getLibreBookingUrl, SESSION_COOKIE, USER_COOKIE } from "@/lib/librebooking/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const upstream = await fetch(getLibreBookingUrl("/Authentication/Authenticate"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const payload = await upstream.json().catch(() => ({ message: "LibreBooking trả về dữ liệu không hợp lệ." }));
    const response = NextResponse.json(payload, { status: upstream.status });
    if (upstream.ok && payload.sessionToken && payload.userId) {
      const cookieOptions = { httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/" };
      response.cookies.set(SESSION_COOKIE, payload.sessionToken, cookieOptions);
      response.cookies.set(USER_COOKIE, String(payload.userId), cookieOptions);
    }
    return response;
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Không thể đăng nhập LibreBooking." }, { status: 500 });
  }
}
