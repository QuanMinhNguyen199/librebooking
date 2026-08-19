import { NextRequest, NextResponse } from "next/server";
import { proxyLibreBooking } from "@/lib/librebooking/server";

export async function GET(request: NextRequest) {
  try { return await proxyLibreBooking(request, "/Resources/"); }
  catch (error) { return NextResponse.json({ message: error instanceof Error ? error.message : "Không thể tải tài nguyên." }, { status: 500 }); }
}
