"use client";

import { Building2, Check, ChevronLeft, ChevronRight, Flag, LockKeyhole, Plus, UserRound, UsersRound } from "lucide-react";
import { useMemo, useState } from "react";
import type { AuthUser } from "@/features/authentication/types";
import type { ReservationSummary } from "@/features/reservations/types";
import { demoRooms } from "@/features/resources/mock";
import { demoCalendarEvents } from "../mock";
import type { CalendarEvent, CalendarSource } from "../types";
import { mapReservationsToCalendarEvents } from "../service";
import { CalendarGrid, type CalendarView } from "./calendar-grid";

const calendarSources: Array<{ id: CalendarSource; label: string; color: string; icon: typeof UserRound; locked?: boolean }> = [
  { id: "personal", label: "Lịch của tôi", color: "bg-violet-500", icon: UserRound },
  { id: "resource", label: "Phòng & thiết bị", color: "bg-blue-500", icon: Building2 },
  { id: "company", label: "Lịch công ty", color: "bg-emerald-500", icon: Building2 },
  { id: "team", label: "Nhóm của tôi", color: "bg-amber-500", icon: UsersRound },
  { id: "holiday", label: "Ngày lễ Việt Nam", color: "bg-[#df1f2d]", icon: Flag, locked: true },
];

function toDate(value: string) { return new Date(`${value}T12:00:00`); }
function toIsoDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function inView(date: string, selectedDate: string, view: CalendarView) {
  const candidate = toDate(date); const selected = toDate(selectedDate);
  if (view === "day") return date === selectedDate;
  if (view === "month") return candidate.getMonth() === selected.getMonth() && candidate.getFullYear() === selected.getFullYear();
  const weekday = (selected.getDay() + 6) % 7;
  const start = new Date(selected); start.setDate(selected.getDate() - weekday);
  const end = new Date(start); end.setDate(start.getDate() + 6);
  return candidate >= start && candidate <= end;
}

export function CalendarOverview({ user, reservations, onCreate, highlightedReservationId }: { user: AuthUser; reservations: ReservationSummary[]; onCreate: (resourceId?: string) => void; highlightedReservationId?: string }) {
  const [selectedDate, setSelectedDate] = useState(() => reservations.find(item => item.id === highlightedReservationId)?.date ?? "2026-08-20");
  const [view, setView] = useState<CalendarView>("week");
  const [sources, setSources] = useState<Record<CalendarSource, boolean>>({ personal: true, resource: true, company: true, team: true, holiday: true });
  const [resourceFilter, setResourceFilter] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent>();

  const events = useMemo(() => {
    const reservationEvents = mapReservationsToCalendarEvents(reservations);
    const unique = new Map<string, CalendarEvent>();
    for (const event of [...demoCalendarEvents, ...reservationEvents]) {
      if (!event.sources.some(source => sources[source]) || !inView(event.date, selectedDate, view)) continue;
      if (user.role === "resource_admin" && !event.sources.includes("resource")) continue;
      if (user.role === "resource_admin" && resourceFilter !== "all" && event.resourceId !== resourceFilter) continue;
      unique.set(event.reservationId ?? event.id, event);
    }
    return [...unique.values()].sort((a, b) => `${a.date}${a.startsAt ?? "00:00"}`.localeCompare(`${b.date}${b.startsAt ?? "00:00"}`));
  }, [reservations, resourceFilter, selectedDate, sources, user.role, view]);

  function moveDate(direction: -1 | 1) {
    const next = toDate(selectedDate);
    if (view === "month") next.setMonth(next.getMonth() + direction);
    else next.setDate(next.getDate() + direction * (view === "day" ? 1 : 7));
    setSelectedDate(toIsoDate(next));
  }
  function toggleSource(source: CalendarSource) {
    if (source === "holiday") return;
    setSources(current => ({ ...current, [source]: !current[source] }));
  }

  const selectedLabel = toDate(selectedDate).toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });

  return <article id="calendar-check" className="scroll-mt-24 overflow-hidden rounded-2xl border border-slate-200 bg-white">
    <header className="border-b border-slate-100 p-5 md:p-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div><h2 className="text-lg font-bold uppercase tracking-wide">Kiểm tra lịch</h2><p className="mt-1 text-xs text-slate-400">Xem lịch từ thứ Hai đến thứ Sáu · cuối tuần được ẩn mặc định</p></div>
        <div className="flex flex-wrap items-center gap-2"><button onClick={() => setSelectedDate("2026-08-20")} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold hover:bg-slate-50">Về ngày mẫu</button><div className="flex overflow-hidden rounded-lg border border-slate-200"><button onClick={() => moveDate(-1)} className="p-2 hover:bg-slate-50" aria-label="Khoảng thời gian trước"><ChevronLeft size={16} /></button><button onClick={() => moveDate(1)} className="border-l border-slate-200 p-2 hover:bg-slate-50" aria-label="Khoảng thời gian sau"><ChevronRight size={16} /></button></div><div className="flex rounded-lg bg-slate-100 p-1">{(["day", "week", "month"] as CalendarView[]).map(item => <button key={item} onClick={() => setView(item)} className={`rounded-md px-3 py-1.5 text-[11px] font-medium ${view === item ? "bg-white text-slate-800 shadow-sm" : "text-slate-500"}`}>{item === "day" ? "Ngày" : item === "week" ? "Tuần làm việc" : "Tháng"}</button>)}</div><button onClick={() => onCreate(resourceFilter === "all" ? undefined : resourceFilter)} className="flex items-center gap-1.5 rounded-lg bg-[#df1f2d] px-3 py-2 text-xs font-semibold text-white"><Plus size={14} /> {user.role === "resource_admin" ? "Đặt phòng hộ" : "Đặt tài nguyên"}</button></div>
      </div>
      <p className="mt-5 text-sm font-semibold capitalize text-slate-700">{selectedLabel}</p>
    </header>
    {user.role !== "resource_admin" && <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 bg-slate-50/70 px-4 py-3 md:px-6">
      <span className="mr-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">Nguồn lịch</span>
      {calendarSources.map(source => <button key={source.id} onClick={() => toggleSource(source.id)} aria-pressed={sources[source.id]} className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition ${sources[source.id] ? "border-slate-200 bg-white text-slate-700 shadow-sm" : "border-transparent text-slate-400"}`}><span className={`grid h-3.5 w-3.5 place-items-center rounded-full ${sources[source.id] ? source.color : "border border-slate-300"}`}>{sources[source.id] && <Check size={9} className="text-white" />}</span><span>{source.label}</span>{source.locked && <LockKeyhole size={10} className="text-slate-400" />}</button>)}
    </div>}
    {user.role === "resource_admin" && <div className="border-b border-slate-100 bg-blue-50/40 px-4 py-4 md:px-6"><div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"><div><p className="text-xs font-bold text-slate-700">Lọc lịch theo phòng</p><p className="mt-1 text-[11px] text-slate-400">Chọn một phòng để xem ai đang sử dụng và đặt phòng hộ trong đúng phạm vi.</p></div><div className="flex flex-wrap gap-2"><button onClick={() => setResourceFilter("all")} className={`rounded-lg border px-3 py-2 text-xs font-semibold ${resourceFilter === "all" ? "border-[#df1f2d] bg-red-50 text-[#c71927]" : "border-slate-200 bg-white text-slate-500"}`}>Tất cả phòng</button>{demoRooms.map(room => <button key={room.id} onClick={() => setResourceFilter(room.id)} className={`rounded-lg border px-3 py-2 text-xs font-semibold ${resourceFilter === room.id ? "border-[#df1f2d] bg-red-50 text-[#c71927]" : "border-slate-200 bg-white text-slate-500"}`}>{room.name.replace("Phòng họp ", "")}</button>)}</div></div></div>}
    <div className="min-h-80 overflow-hidden"><CalendarGrid view={view} selectedDate={selectedDate} events={events} highlightedReservationId={highlightedReservationId} onSelectEvent={setSelectedEvent} /></div>
    {selectedEvent && <div className="fixed inset-0 z-[70] grid place-items-center bg-black/35 p-4" onMouseDown={event => { if (event.target === event.currentTarget) setSelectedEvent(undefined); }}><section className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"><div className="flex justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-wider text-[#c71927]">Chi tiết lịch</p><h2 className="mt-1 text-xl font-bold">{selectedEvent.visibility === "private" && !selectedEvent.sources.includes("personal") ? "Lịch riêng tư" : selectedEvent.title}</h2></div><button onClick={() => setSelectedEvent(undefined)} className="h-9 rounded-lg px-3 text-sm text-slate-500 hover:bg-slate-100">Đóng</button></div><dl className="mt-5 grid grid-cols-[120px_1fr] gap-y-3 text-sm"><dt className="text-slate-400">Thời gian</dt><dd className="font-medium">{selectedEvent.date} · {selectedEvent.allDay ? "Cả ngày" : `${selectedEvent.startsAt}–${selectedEvent.endsAt}`}</dd><dt className="text-slate-400">Địa điểm</dt><dd className="font-medium">{selectedEvent.location ?? "Không có"}</dd><dt className="text-slate-400">Người đặt</dt><dd className="font-medium">{selectedEvent.bookedBy ?? "Không áp dụng"}</dd><dt className="text-slate-400">Trạng thái</dt><dd><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${selectedEvent.reservationStatus === "pending" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>{selectedEvent.reservationStatus === "pending" ? "Chờ duyệt" : selectedEvent.reservationStatus === "confirmed" ? "Đã xác nhận" : "Sự kiện tham khảo"}</span></dd><dt className="text-slate-400">Người tham gia</dt><dd className="break-words font-medium">{selectedEvent.participantEmails?.join(", ") || "Chưa thêm"}</dd><dt className="text-slate-400">Mã đặt chỗ</dt><dd className="font-medium">{selectedEvent.reservationId ?? "—"}</dd></dl></section></div>}
  </article>;
}
