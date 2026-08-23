import type { CalendarEvent, CalendarItemType } from "../types";
import { useEffect } from "react";

export type CalendarView = "day" | "week" | "month";

const START_HOUR = 8;
const END_HOUR = 18;
const HOUR_HEIGHT = 76;
const hours = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, index) => START_HOUR + index);

const eventStyle: Record<CalendarItemType, string> = {
  reservation: "border-blue-300 bg-blue-100 text-blue-950",
  personal_event: "border-violet-300 bg-violet-100 text-violet-950",
  company_event: "border-emerald-300 bg-emerald-100 text-emerald-950",
  team_event: "border-amber-300 bg-amber-100 text-amber-950",
  blackout: "border-slate-400 bg-slate-200 text-slate-800",
  holiday: "border-red-300 bg-red-100 text-red-900",
};

function dateFromIso(value: string) { return new Date(`${value}T12:00:00`); }
function isoDate(date: Date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; }
function addDays(date: Date, amount: number) { const next = new Date(date); next.setDate(next.getDate() + amount); return next; }
function mondayOf(date: Date) { return addDays(date, -((date.getDay() + 6) % 7)); }
function minutes(value?: string) { if (!value) return START_HOUR * 60; const [hour, minute] = value.split(":").map(Number); return hour * 60 + minute; }
function visibleTitle(event: CalendarEvent) { return event.visibility === "private" && !event.sources.includes("personal") ? "Bận" : event.title; }

function layoutEvents(events: CalendarEvent[]) {
  const sorted = [...events].sort((a, b) => minutes(a.startsAt) - minutes(b.startsAt));
  const positioned: Array<{ event: CalendarEvent; lane: number; laneCount: number }> = [];
  let group: CalendarEvent[] = [];
  let groupEnd = -1;

  function flushGroup() {
    if (!group.length) return;
    const laneEnds: number[] = [];
    const groupItems = group.map(event => {
      const start = minutes(event.startsAt);
      let lane = laneEnds.findIndex(end => end <= start);
      if (lane === -1) { lane = laneEnds.length; laneEnds.push(minutes(event.endsAt)); }
      else laneEnds[lane] = minutes(event.endsAt);
      return { event, lane };
    });
    const laneCount = Math.max(laneEnds.length, 1);
    positioned.push(...groupItems.map(item => ({ ...item, laneCount })));
    group = [];
  }

  for (const event of sorted) {
    const start = minutes(event.startsAt);
    if (group.length && start >= groupEnd) flushGroup();
    group.push(event);
    groupEnd = Math.max(groupEnd, minutes(event.endsAt));
  }
  flushGroup();
  return positioned;
}

function EventChip({ event, compact = false }: { event: CalendarEvent; compact?: boolean }) {
  const statusStyle = event.reservationStatus === "pending"
    ? "border-amber-400 bg-amber-50 text-amber-950 ring-1 ring-inset ring-amber-200"
    : eventStyle[event.type];
  return <div title={`${visibleTitle(event)}${event.location ? ` · ${event.location}` : ""}`} className={`h-full overflow-hidden rounded-md border-l-[3px] px-2 py-1.5 text-[10px] leading-tight ${statusStyle}`}>
    <p className="truncate font-semibold">{!event.allDay && event.startsAt ? `${event.startsAt} · ` : ""}{visibleTitle(event)}</p>
    {!compact && event.location && <p className="mt-0.5 truncate opacity-65">{event.location}</p>}
    {event.type === "reservation" && event.bookedBy && <p className="mt-0.5 truncate text-[9px] font-medium opacity-70">Người đặt: {event.bookedBy}</p>}
    {event.reservationStatus === "pending" && <p className="mt-0.5 truncate text-[9px] font-semibold text-amber-700">Chờ duyệt</p>}
    {!compact && event.reservationStatus === "confirmed" && <p className="mt-0.5 text-[9px] font-medium opacity-70">Đã xác nhận</p>}
  </div>;
}

function TimeGrid({ dates, events, highlightedReservationId, onSelectEvent }: { dates: Date[]; events: CalendarEvent[]; highlightedReservationId?: string; onSelectEvent: (event: CalendarEvent) => void }) {
  const allDayEvents = events.filter(event => event.allDay);
  const compactCards = dates.length > 1;
  useEffect(() => {
    if (!highlightedReservationId) return;
    window.setTimeout(() => document.querySelector(`[data-reservation-id="${CSS.escape(highlightedReservationId)}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
  }, [events, highlightedReservationId]);
  return <div className={compactCards ? "min-w-[860px]" : "min-w-[560px]"}>
    <div className="grid border-b border-slate-200 bg-white" style={{ gridTemplateColumns: `64px repeat(${dates.length}, minmax(110px, 1fr))` }}>
      <div />
      {dates.map(date => <div key={isoDate(date)} className="border-l border-slate-200 px-2 py-3 text-center"><p className="text-[10px] uppercase text-slate-400">{date.toLocaleDateString("vi-VN", { weekday: "short" })}</p><p className={`mt-1 inline-grid h-7 w-7 place-items-center rounded-full text-sm font-semibold ${isoDate(date) === "2026-08-20" ? "bg-[#df1f2d] text-white" : "text-slate-700"}`}>{date.getDate()}</p></div>)}
    </div>
    {allDayEvents.length > 0 && <div className="grid border-b border-slate-200 bg-slate-50" style={{ gridTemplateColumns: `64px repeat(${dates.length}, minmax(110px, 1fr))` }}><div className="p-2 text-[9px] text-slate-400">Cả ngày</div>{dates.map(date => <div key={isoDate(date)} className="min-h-9 space-y-1 border-l border-slate-200 p-1">{allDayEvents.filter(event => event.date === isoDate(date)).map(event => <button key={event.id} onClick={() => onSelectEvent(event)} className="block w-full text-left"><EventChip event={event} compact /></button>)}</div>)}</div>}
    <div className="grid" style={{ gridTemplateColumns: `64px repeat(${dates.length}, minmax(110px, 1fr))` }}>
      <div className="relative" style={{ height: (END_HOUR - START_HOUR) * HOUR_HEIGHT }}>{hours.slice(0, -1).map((hour, index) => <span key={hour} className="absolute right-2 -translate-y-2 text-[9px] text-slate-400" style={{ top: index * HOUR_HEIGHT }}>{String(hour).padStart(2, "0")}:00</span>)}</div>
      {dates.map(date => { const dayEvents = events.filter(event => event.date === isoDate(date) && !event.allDay); const positioned = layoutEvents(dayEvents); return <div key={isoDate(date)} className="relative border-l border-slate-200 bg-[linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[length:100%_76px]" style={{ height: (END_HOUR - START_HOUR) * HOUR_HEIGHT }}>{positioned.map(({ event, lane, laneCount }) => { const start = Math.max(minutes(event.startsAt), START_HOUR * 60); const end = Math.min(minutes(event.endsAt), END_HOUR * 60); if (end <= START_HOUR * 60 || start >= END_HOUR * 60) return null; const width = 100 / laneCount; const duration = end - start; const highlighted = Boolean(highlightedReservationId) && event.reservationId === highlightedReservationId; return <button type="button" data-reservation-id={event.reservationId} onClick={() => onSelectEvent(event)} key={event.id} className={`absolute px-1 py-0.5 text-left ${highlighted ? "result-highlight z-10" : ""}`} style={{ top: ((start - START_HOUR * 60) / 60) * HOUR_HEIGHT, height: Math.max(32, ((end - start) / 60) * HOUR_HEIGHT), left: `${lane * width}%`, width: `${width}%` }}><EventChip event={event} compact={compactCards || duration < 60} /></button>; })}</div>; })}
    </div>
  </div>;
}

function MonthGrid({ selectedDate, events, onSelectEvent }: { selectedDate: string; events: CalendarEvent[]; onSelectEvent: (event: CalendarEvent) => void }) {
  const selected = dateFromIso(selectedDate);
  const first = new Date(selected.getFullYear(), selected.getMonth(), 1, 12);
  const gridStart = mondayOf(first);
  const dates = Array.from({ length: 42 }, (_, index) => addDays(gridStart, index)).filter(date => date.getDay() !== 0 && date.getDay() !== 6);
  return <div className="min-w-[720px]"><div className="grid grid-cols-5 border-b border-slate-200 bg-slate-50">{["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6"].map(day => <div key={day} className="border-l border-slate-200 px-2 py-2 text-center text-[10px] font-semibold text-slate-500 first:border-l-0">{day}</div>)}</div><div className="grid grid-cols-5">{dates.map(date => { const dayEvents = events.filter(event => event.date === isoDate(date)); const outside = date.getMonth() !== selected.getMonth(); return <div key={isoDate(date)} className={`min-h-28 border-b border-l border-slate-200 p-1.5 first:border-l-0 ${outside ? "bg-slate-50/70" : "bg-white"}`}><p className={`mb-1 text-right text-[11px] ${outside ? "text-slate-300" : "text-slate-600"}`}>{date.getDate()}</p><div className="space-y-1">{dayEvents.slice(0, 3).map(event => <button key={event.id} onClick={() => onSelectEvent(event)} className="block w-full text-left"><EventChip event={event} compact /></button>)}{dayEvents.length > 3 && <p className="px-1 text-[9px] font-medium text-slate-500">+{dayEvents.length - 3} lịch khác</p>}</div></div>; })}</div></div>;
}

export function CalendarGrid({ view, selectedDate, events, highlightedReservationId, onSelectEvent }: { view: CalendarView; selectedDate: string; events: CalendarEvent[]; highlightedReservationId?: string; onSelectEvent: (event: CalendarEvent) => void }) {
  const selected = dateFromIso(selectedDate);
  const dates = view === "day" ? [selected] : Array.from({ length: 5 }, (_, index) => addDays(mondayOf(selected), index));
  return <div className="overflow-x-auto">{view === "month" ? <MonthGrid selectedDate={selectedDate} events={events} onSelectEvent={onSelectEvent} /> : <TimeGrid dates={dates} events={events} highlightedReservationId={highlightedReservationId} onSelectEvent={onSelectEvent} />}</div>;
}
