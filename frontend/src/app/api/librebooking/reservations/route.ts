import { NextRequest, NextResponse } from "next/server";
import { proxyLibreBooking } from "@/lib/librebooking/server";

export async function GET(request: NextRequest) {
  try { return await proxyLibreBooking(request, "/Reservations/"); }
  catch (error) { return NextResponse.json({ message: error instanceof Error ? error.message : "Không thể tải booking." }, { status: 500 }); }
}

export async function POST(request: NextRequest) {
  try { return await proxyLibreBooking(request, "/Reservations/", { method: "POST", body: JSON.stringify(await request.json()) }); }
  catch (error) { return NextResponse.json({ message: error instanceof Error ? error.message : "Không thể tạo booking." }, { status: 500 }); }
}
