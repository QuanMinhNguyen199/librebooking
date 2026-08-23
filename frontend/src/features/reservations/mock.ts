import type { ReservationSummary } from "./types";

export const demoReservations: ReservationSummary[] = [
  { id: "daily-product", date: "2026-08-20", time: "09:00", endsAt: "09:30", title: "Daily Product", resourceId: "101", resourceName: "Phòng Saigon", colorClass: "bg-violet-500", status: "confirmed", bookedBy: "An Nguyễn" },
  { id: "nova-meeting", date: "2026-08-20", time: "10:30", endsAt: "11:30", title: "Gặp khách hàng Nova", resourceId: "102", resourceName: "Phòng Hanoi", colorClass: "bg-[#df1f2d]", status: "confirmed", bookedBy: "Lan Võ" },
  { id: "camera-event", date: "2026-08-20", time: "14:00", endsAt: "15:00", title: "Thiết bị quay sự kiện", resourceId: "101", resourceName: "Phòng Saigon", colorClass: "bg-amber-500", status: "pending", bookedBy: "Nam Đỗ" },
];
