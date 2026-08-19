"use client";

import { ArrowUpRight, Bell, Bot, Boxes, Building2, CalendarDays, CalendarRange, Car, ChartNoAxesCombined, ChevronDown, CircleDot, Clock3, Gauge, Laptop, LayoutGrid, Menu, MoreHorizontal, Plus, Search, Settings, UserRoundCog, WalletCards, X } from "lucide-react";
import { useEffect, useState } from "react";
import { BrandMark } from "@/components/brand/brand-mark";
import { DebugConsole, type DebugEntry } from "@/components/debug/debug-console";
import { LoginScreen } from "@/features/authentication/components/login-screen";
import { demoResources } from "@/features/resources/mock";
import { ReservationDialog } from "@/features/reservations/components/reservation-dialog";
import { demoReservations } from "@/features/reservations/mock";
import type { ReservationSummary } from "@/features/reservations/types";

const nav = [
  { label: "Tổng quan", icon: LayoutGrid }, { label: "Tài nguyên", icon: Boxes },
  { label: "Lịch đặt", icon: CalendarRange }, { label: "AI Usage", icon: Gauge },
  { label: "Nhân sự", icon: UserRoundCog }, { label: "Chi phí", icon: ChartNoAxesCombined },
];
function ResourceIcon({ type }: { type: string }) {
  const Icon = type === "car" ? Car : type === "laptop" ? Laptop : Building2;
  return <Icon size={20} />;
}

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [debugEntries, setDebugEntries] = useState<DebugEntry[]>([]);
  const [active, setActive] = useState("Tổng quan");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [reservations, setReservations] = useState<ReservationSummary[]>(demoReservations);

  function reservationCreated(reservation: ReservationSummary) {
    setReservations(current => [...current, reservation].sort((a, b) => a.time.localeCompare(b.time)));
    setToast(true); window.setTimeout(() => setToast(false), 2600);
  }

  function navigate(label: string) {
    setActive(label);
    setMobileOpen(false);
    if (label === "Lịch đặt") {
      window.setTimeout(() => document.getElementById("booking-calendar")?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
    }
  }

  function reportError(action: string, error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setDebugEntries(current => [{ id, action, message, time: new Date().toLocaleTimeString("vi-VN") }, ...current].slice(0, 50));
  }

  useEffect(() => {
    const onError = (event: ErrorEvent) => reportError("Lỗi giao diện", event.error ?? event.message);
    const onRejection = (event: PromiseRejectionEvent) => reportError("Promise chưa xử lý", event.reason);
    const originalConsoleError = console.error;
    const originalFetch = window.fetch.bind(window);

    console.error = (...args: unknown[]) => {
      originalConsoleError(...args);
      reportError("Console error", args.map(value => value instanceof Error ? value.message : String(value)).join(" "));
    };

    window.fetch = async (...args: Parameters<typeof fetch>) => {
      const target = typeof args[0] === "string" ? args[0] : args[0] instanceof URL ? args[0].toString() : args[0].url;
      try {
        const response = await originalFetch(...args);
        if (!response.ok) reportError(`HTTP ${response.status}`, `${args[1]?.method ?? "GET"} ${target}`);
        return response;
      } catch (error) {
        reportError("Network error", `${args[1]?.method ?? "GET"} ${target}: ${error instanceof Error ? error.message : String(error)}`);
        throw error;
      }
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      console.error = originalConsoleError;
      window.fetch = originalFetch;
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  const debugConsole = <DebugConsole entries={debugEntries} onClear={() => setDebugEntries([])} onTestError={() => reportError("Kiểm tra debug", new Error("Debug console đang cập nhật real-time."))} />;

  if (!isLoggedIn) return <><LoginScreen onLogin={() => setIsLoggedIn(true)} onError={reportError} />{debugConsole}</>;

  return (
    <main className="min-h-screen bg-[#f5f6f8] text-[#172026]">
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-200 bg-white px-4 py-5 transition-transform lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between px-2">
          <BrandMark />
          <button className="lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Đóng menu"><X size={20} /></button>
        </div>
        <nav className="mt-8 space-y-1">{nav.map(({ label, icon: Icon }) => <button key={label} onClick={() => navigate(label)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active === label ? "bg-red-50 text-[#c71927]" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}><Icon size={18} />{label}</button>)}</nav>
        <div className="absolute inset-x-4 bottom-5"><div className="mb-4 rounded-2xl bg-[#171717] p-4 text-white"><div className="mb-3 flex items-center gap-2 text-xs text-red-300"><CircleDot size={15} /> MCP đã kết nối</div><p className="text-sm font-medium">Đặt phòng bằng trợ lý AI</p><p className="mt-1 text-xs leading-5 text-white/60">“Tìm phòng 8 người lúc 2 giờ”</p></div><button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-500 hover:bg-slate-50"><Settings size={18} /> Cài đặt</button></div>
      </aside>

      <section className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-18 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur md:px-8">
          <div className="flex items-center gap-3"><button className="rounded-lg p-2 hover:bg-slate-100 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Mở menu"><Menu size={20} /></button><div className="relative hidden sm:block"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} /><input className="w-72 rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#df1f2d] focus:bg-white" placeholder="Tìm tài nguyên, nhân viên..." /></div></div>
          <div className="flex items-center gap-3"><button className="relative rounded-xl border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-50"><Bell size={18} /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#df1f2d]" /></button><button onClick={() => setIsLoggedIn(false)} title="Đăng xuất khỏi bản demo" className="flex items-center gap-2 rounded-xl border border-slate-200 px-2 py-1.5 hover:bg-slate-50"><div className="grid h-8 w-8 place-items-center rounded-lg bg-red-50 text-xs font-bold text-[#c71927]">MN</div><div className="hidden text-left md:block"><p className="text-xs font-semibold">Minh Nguyễn</p><p className="text-[10px] text-slate-400">Administrator</p></div><ChevronDown size={14} className="text-slate-400" /></button></div>
        </header>

        <div className="mx-auto max-w-[1500px] p-4 md:p-8">
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-1 text-sm font-medium text-[#c71927]">Thứ tư, 19 tháng 8</p><h1 className="text-2xl font-bold uppercase tracking-wide md:text-3xl">Chào buổi chiều, Minh</h1><p className="mt-1 text-sm text-slate-500">Đây là tình hình tài nguyên của công ty hôm nay.</p></div><button onClick={() => setBookingOpen(true)} className="flex items-center justify-center gap-2 rounded-xl bg-[#df1f2d] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#b81521]"><Plus size={17} /> Đặt tài nguyên</button></div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[
            ["Tài nguyên hoạt động", "128", "+6 tháng này", Building2, "text-[#c71927] bg-red-50"], ["Đang được sử dụng", "42", "67% công suất", Clock3, "text-blue-700 bg-blue-50"], ["Chi phí tháng này", "184,6 tr", "−8,4% so tháng trước", WalletCards, "text-violet-700 bg-violet-50"], ["Claude hôm nay", "$38.42", "12,8M tokens", Bot, "text-amber-700 bg-amber-50"],
          ].map(([label, value, note, Icon, tone]) => { const MetricIcon = Icon as typeof Building2; return <article key={label as string} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,.02)]"><div className="mb-4 flex items-start justify-between"><div className={`grid h-10 w-10 place-items-center rounded-xl ${tone}`}><MetricIcon size={19} /></div><ArrowUpRight size={16} className="text-slate-300" /></div><p className="text-sm text-slate-500">{label as string}</p><p className="mt-1 text-2xl font-bold tracking-tight">{value as string}</p><p className="mt-2 text-xs text-slate-400">{note as string}</p></article>; })}</div>

          <div className="mt-5 grid gap-5 xl:grid-cols-[1.55fr_1fr]">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6"><div className="mb-6 flex items-center justify-between"><div><h2 className="text-lg font-bold uppercase tracking-wide">Mức sử dụng tài nguyên</h2><p className="mt-1 text-xs text-slate-400">7 ngày gần nhất · booking đã check-in</p></div><button className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium">7 ngày <ChevronDown className="ml-2 inline" size={13} /></button></div><div className="flex h-56 items-end gap-3 border-b border-slate-100 px-1 md:gap-5">{[48, 62, 54, 76, 68, 42, 72].map((height, i) => <div key={i} className="flex h-full flex-1 items-end"><div className="w-full rounded-t-lg bg-red-100 transition hover:bg-[#df1f2d]" style={{ height: `${height}%` }} /></div>)}</div><div className="mt-3 grid grid-cols-7 text-center text-[11px] text-slate-400">{["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map(d => <span key={d}>{d}</span>)}</div></article>
            <article className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6"><div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-widest text-[#c71927]">AI Cost Control</p><h2 className="mt-1 text-lg font-semibold uppercase tracking-wide text-slate-900">Claude usage</h2></div><div className="grid h-10 w-10 place-items-center rounded-xl bg-red-50 text-[#c71927]"><Bot size={20} /></div></div><div className="mt-7 flex items-end justify-between"><div><p className="text-3xl font-bold text-slate-900">$1,284.60</p><p className="mt-1 text-xs text-slate-400">Ngân sách tháng: $2,000</p></div><span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-[#c71927]">Đã dùng 64%</span></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full w-[64%] rounded-full bg-[#df1f2d]" /></div><div className="mt-7 grid grid-cols-2 gap-3"><div className="rounded-xl border border-slate-100 bg-slate-50 p-3"><p className="text-[11px] text-slate-400">Input tokens</p><p className="mt-1 font-semibold text-slate-800">284.2M</p></div><div className="rounded-xl border border-slate-100 bg-slate-50 p-3"><p className="text-[11px] text-slate-400">Output tokens</p><p className="mt-1 font-semibold text-slate-800">42.8M</p></div></div></article>
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-[1.4fr_1fr]">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6"><div className="mb-4 flex items-center justify-between"><div><h2 className="text-lg font-bold uppercase tracking-wide">Tài nguyên nổi bật</h2><p className="mt-1 text-xs text-slate-400">Tình trạng và hiệu suất sử dụng</p></div><button className="text-xs font-semibold text-[#c71927]">Xem tất cả</button></div><div className="divide-y divide-slate-100">{demoResources.map(resource => <div key={resource.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 py-4"><div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-600"><ResourceIcon type={resource.kind} /></div><div className="min-w-0"><p className="truncate text-sm font-semibold">{resource.name}</p><p className="mt-0.5 truncate text-xs text-slate-400">{resource.description}</p></div><div className="hidden items-center gap-5 sm:flex"><div className="w-24"><div className="mb-1 flex justify-between text-[10px] text-slate-400"><span>Sử dụng</span><span>{resource.usagePercent}%</span></div><div className="h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#df1f2d]" style={{ width: `${resource.usagePercent}%` }} /></div></div><span className="w-24 rounded-full bg-slate-100 px-2.5 py-1 text-center text-[10px] font-medium text-slate-600">{resource.status}</span><MoreHorizontal size={17} className="text-slate-400" /></div></div>)}</div></article>
            <article id="booking-calendar" className={`scroll-mt-24 rounded-2xl border bg-white p-5 transition md:p-6 ${active === "Lịch đặt" ? "border-[#df1f2d] shadow-[0_0_0_3px_rgba(223,31,45,.08)]" : "border-slate-200"}`}><div className="mb-5 flex items-center justify-between"><div><h2 className="text-lg font-bold uppercase tracking-wide">Lịch hôm nay</h2><p className="mt-1 text-xs text-slate-400">{reservations.length} booking sắp tới</p></div><CalendarDays size={19} className="text-[#c71927]" /></div><div className="max-h-64 space-y-5 overflow-auto pr-1">{reservations.map(item => <div key={item.id} className="flex gap-3"><div className="w-11 text-xs font-semibold text-slate-500">{item.time}</div><div className={`mt-1 h-9 w-1 rounded-full ${item.colorClass}`} /><div><p className="text-sm font-semibold">{item.title}</p><p className="mt-1 text-xs text-slate-400">{item.resourceName}</p></div></div>)}</div><button onClick={() => setBookingOpen(true)} className="mt-6 w-full rounded-xl border border-dashed border-slate-300 py-2.5 text-xs font-semibold text-slate-500 hover:border-[#df1f2d] hover:text-[#c71927]">+ Thêm booking</button></article>
          </div>
        </div>
      </section>
      {toast && <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl bg-[#171717] px-4 py-3 text-sm font-medium text-white shadow-xl"><span className="grid h-7 w-7 place-items-center rounded-lg bg-red-400/20 text-red-300"><CalendarDays size={15} /></span> Đã thêm booking vào lịch hôm nay</div>}
      <ReservationDialog open={bookingOpen} onClose={() => setBookingOpen(false)} onCreated={reservationCreated} onError={reportError} />
      {debugConsole}
    </main>
  );
}
