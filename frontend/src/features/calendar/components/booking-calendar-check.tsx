"use client";

import { CalendarCheck2, Check, LockKeyhole } from "lucide-react";
import { useState } from "react";
import { demoCalendarEvents, nextVietnamHoliday } from "../mock";
import { getBookingConflicts, mapReservationsToCalendarEvents } from "../service";
import type { CalendarSource } from "../types";
import type { ReservationSummary } from "@/features/reservations/types";

const sources: Array<{ id: CalendarSource; label: string; color: string; locked?: boolean }> = [
  { id: "personal", label: "Của tôi", color: "bg-violet-500" },
  { id: "resource", label: "Phòng", color: "bg-blue-500" },
  { id: "company", label: "Công ty", color: "bg-emerald-500" },
  { id: "team", label: "Nhóm", color: "bg-amber-500" },
  { id: "holiday", label: "Ngày lễ VN", color: "bg-[#df1f2d]", locked: true },
];

export function BookingCalendarCheck({ date, startTime, endTime, resourceId, reservations }: { date: string; startTime: string; endTime: string; resourceId: string; reservations: ReservationSummary[] }) {
  const [visible, setVisible] = useState<Record<CalendarSource, boolean>>({ personal: true, resource: true, company: true, team: true, holiday: true });
  const events = [...demoCalendarEvents, ...mapReservationsToCalendarEvents(reservations)].filter(event => event.date === date && event.sources.some(source => visible[source]));
  const conflicts = getBookingConflicts(date, startTime, endTime, resourceId, reservations);
  const blockingCount = conflicts.filter(conflict => conflict.level === "block").length;
  const warningCount = conflicts.filter(conflict => conflict.level === "warn").length;

  function toggle(source: CalendarSource) {
    if (source === "holiday") return;
    setVisible(current => ({ ...current, [source]: !current[source] }));
  }

  return <section className="overflow-hidden rounded-2xl border border-slate-200">
    <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
      <div><div className="flex items-center gap-2 text-sm font-semibold"><CalendarCheck2 size={16} /> Kiểm tra lịch trống</div><p className="mt-1 text-[11px] text-slate-400">Ẩn một nguồn lịch không làm thay đổi kết quả kiểm tra</p></div>
      <div className="mt-3 flex flex-wrap gap-2">{sources.map(source => <button key={source.id} type="button" onClick={() => toggle(source.id)} aria-pressed={visible[source.id]} className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[10px] font-medium ${visible[source.id] ? "border-slate-200 bg-white text-slate-700" : "border-transparent bg-slate-100 text-slate-400"}`}><span className={`grid h-4 w-4 place-items-center rounded-full ${visible[source.id] ? source.color : "border border-slate-300"}`}>{visible[source.id] && <Check size={10} className="text-white" />}</span>{source.label}{source.locked && <LockKeyhole size={9} />}</button>)}</div>
    </div>
    <div className="p-4">
      {events.length > 0 ? <div className="space-y-2">{events.map(event => {
        const conflict = conflicts.find(item => item.event.id === event.id);
        const hidden = event.visibility === "private" && !event.sources.includes("personal");
        return <article key={event.reservationId ?? event.id} className={`flex items-start gap-3 rounded-xl border px-3 py-2.5 ${conflict?.level === "block" ? "border-red-200 bg-red-50" : conflict?.level === "warn" ? "border-amber-200 bg-amber-50" : "border-slate-100 bg-white"}`}><div className="w-20 shrink-0"><p className="text-xs font-semibold text-slate-700">{event.allDay ? "Cả ngày" : `${event.startsAt}–${event.endsAt}`}</p><p className="mt-0.5 text-[10px] text-slate-400">{event.type === "reservation" ? "Đặt chỗ" : event.type === "blackout" ? "Không khả dụng" : "Sự kiện"}</p></div><div className="min-w-0 flex-1"><p className="truncate text-xs font-medium">{hidden ? "Bận · Sự kiện riêng tư" : event.title}</p><p className="mt-0.5 truncate text-[10px] text-slate-400">{hidden ? "Nội dung được bảo mật" : event.location ?? event.sources.map(source => sources.find(item => item.id === source)?.label).join(" · ")}</p></div>{conflict && <span className={`rounded-full px-2 py-1 text-[9px] font-semibold ${conflict.level === "block" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{conflict.level === "block" ? "Trùng lịch" : "Cần lưu ý"}</span>}</article>;
      })}</div> : <p className="rounded-xl bg-emerald-50 px-3 py-3 text-xs text-emerald-700">Không có sự kiện nào trong các nguồn đang hiển thị.</p>}
      {blockingCount > 0 && <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-700">Không thể đặt: khung giờ trùng {blockingCount} đặt chỗ hoặc thời gian khóa của phòng.</p>}
      {blockingCount === 0 && warningCount > 0 && <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">Có {warningCount} lịch cá nhân/công ty/nhóm bị trùng. Bạn có thể tiếp tục sau khi kiểm tra.</p>}
      <div className="mt-3 flex flex-col gap-1 rounded-xl border border-dashed border-red-200 bg-red-50/40 px-3 py-2 text-[11px] sm:flex-row sm:items-center sm:justify-between"><span><strong>Ngày lễ Việt Nam luôn hiển thị</strong></span><span className="font-semibold text-[#c71927]">{nextVietnamHoliday.title} · {nextVietnamHoliday.date}</span></div>
    </div>
  </section>;
}
