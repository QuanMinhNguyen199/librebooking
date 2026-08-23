import type { CalendarEvent } from "./types";

export const demoCalendarEvents: CalendarEvent[] = [
  { id: "reservation-townhall", reservationId: "LB-1001", date: "2026-08-20", title: "Town hall tháng 8", startsAt: "09:30", endsAt: "10:30", sources: ["personal", "resource", "company"], type: "reservation", conflictPolicy: "block", visibility: "public", resourceId: "101", location: "Phòng họp Saigon", reservationStatus: "confirmed", bookedBy: "Hà Trần" },
  { id: "reservation-private", reservationId: "LB-1002", date: "2026-08-20", title: "Nội dung riêng tư", startsAt: "13:00", endsAt: "14:00", sources: ["resource", "team"], type: "reservation", conflictPolicy: "block", visibility: "private", resourceId: "101", location: "Phòng họp Saigon", reservationStatus: "pending", bookedBy: "Lan Võ" },
  { id: "reservation-product", reservationId: "LB-1003", date: "2026-08-20", title: "Product weekly", startsAt: "10:00", endsAt: "11:00", sources: ["resource", "team"], type: "reservation", conflictPolicy: "block", visibility: "public", resourceId: "102", location: "Phòng họp Hanoi", reservationStatus: "confirmed", bookedBy: "Minh Nguyễn" },
  { id: "company-training", date: "2026-08-20", title: "Đào tạo an toàn thông tin", startsAt: "11:30", endsAt: "12:00", sources: ["company"], type: "company_event", conflictPolicy: "warn", visibility: "public", location: "Online" },
  { id: "team-planning", date: "2026-08-20", title: "Marketing planning", startsAt: "14:30", endsAt: "15:30", sources: ["team"], type: "team_event", conflictPolicy: "warn", visibility: "public", location: "Google Meet" },
  { id: "personal-focus", date: "2026-08-20", title: "Focus time của tôi", startsAt: "15:00", endsAt: "16:00", sources: ["personal"], type: "personal_event", conflictPolicy: "warn", visibility: "private" },
  { id: "personal-review", date: "2026-08-20", title: "Review với quản lý", startsAt: "16:30", endsAt: "17:00", sources: ["personal"], type: "personal_event", conflictPolicy: "warn", visibility: "private", location: "Google Meet" },
  { id: "room-maintenance", date: "2026-08-21", title: "Bảo trì hệ thống trình chiếu", startsAt: "08:00", endsAt: "12:00", sources: ["resource"], type: "blackout", conflictPolicy: "block", visibility: "public", resourceId: "101", location: "Phòng họp Saigon" },
  { id: "holiday-national-day", date: "2026-09-02", title: "Quốc khánh Việt Nam", sources: ["holiday"], type: "holiday", conflictPolicy: "none", visibility: "public", allDay: true },
  { id: "holiday-new-year", date: "2027-01-01", title: "Tết Dương lịch", sources: ["holiday"], type: "holiday", conflictPolicy: "none", visibility: "public", allDay: true },
];

export const nextVietnamHoliday = { date: "02/09/2026", title: "Quốc khánh Việt Nam" };
