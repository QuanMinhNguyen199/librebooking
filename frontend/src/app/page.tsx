"use client";

import { Bell, Boxes, CalendarDays, CalendarPlus, ChartNoAxesCombined, CheckCircle2, ChevronDown, Gauge, LayoutGrid, Menu, Search, Settings, UserRoundCog, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { BrandMark } from "@/components/brand/brand-mark";
import { DebugConsole, type DebugEntry } from "@/components/debug/debug-console";
import { ApprovalsPage } from "@/features/approvals/components/approvals-page";
import { LoginScreen } from "@/features/authentication/components/login-screen";
import type { AuthSession, AuthUser, DemoPermission } from "@/features/authentication/types";
import { CalendarOverview } from "@/features/calendar/components/calendar-overview";
import { CostsPage } from "@/features/costs/components/costs-page";
import { RoleDashboard } from "@/features/dashboard/components/role-dashboard";
import { PeoplePage } from "@/features/people/components/people-page";
import { ReservationDialog } from "@/features/reservations/components/reservation-dialog";
import { demoReservations } from "@/features/reservations/mock";
import type { ReservationSummary } from "@/features/reservations/types";
import { ResourcesPage } from "@/features/resources/components/resources-page";
import { ResourceDetailPage } from "@/features/resources/components/resource-detail-page";
import { UsagePage } from "@/features/usage/components/usage-page";

type PageId = "dashboard" | "calendar" | "booking" | "resources" | "resource-detail" | "usage" | "costs" | "people" | "approvals";
type NavItem = { id: PageId; label: string; icon: typeof LayoutGrid; permission?: DemoPermission };

const navigation: NavItem[] = [
  { id: "dashboard", label: "Tổng quan", icon: LayoutGrid },
  { id: "calendar", label: "Kiểm tra lịch", icon: CalendarDays },
  { id: "booking", label: "Đặt tài nguyên", icon: CalendarPlus },
  { id: "resources", label: "Danh mục phòng", icon: Boxes },
  { id: "usage", label: "Báo cáo sử dụng", icon: Gauge, permission: "resource_usage" },
  { id: "costs", label: "Chi phí vận hành", icon: ChartNoAxesCombined, permission: "cost" },
  { id: "people", label: "Nhân sự & phân quyền", icon: UserRoundCog, permission: "people" },
  { id: "approvals", label: "Yêu cầu chờ duyệt", icon: CheckCircle2, permission: "approval" },
];

function canAccess(user: AuthUser, item: NavItem) {
  return !item.permission || user.permissions.includes(item.permission);
}

export default function Home() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [debugEntries, setDebugEntries] = useState<DebugEntry[]>([]);
  const [active, setActive] = useState<PageId>("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState(false);
  const [bookingResourceId, setBookingResourceId] = useState<string>();
  const [detailResourceId, setDetailResourceId] = useState<string>();
  const [highlightedReservationId, setHighlightedReservationId] = useState<string>();
  const [reservations, setReservations] = useState<ReservationSummary[]>(demoReservations);
  const visibleNavigation = useMemo(() => session ? navigation.filter(item => canAccess(session.user, item)) : [], [session]);

  function reservationCreated(reservation: ReservationSummary) {
    setReservations(current => [...current, reservation].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)));
    setHighlightedReservationId(reservation.id);
    setActive("calendar");
    setToast(true);
    window.setTimeout(() => setToast(false), 2600);
  }

  function startBooking(resourceId?: string) {
    setBookingResourceId(resourceId);
    setActive("booking");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openResourceDetail(resourceId: string) {
    setDetailResourceId(resourceId);
    setActive("resource-detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openReservation(reservationId: string) {
    setHighlightedReservationId(reservationId);
    setActive("calendar");
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function navigate(page: string) {
    const item = navigation.find(candidate => candidate.id === page);
    if (!session || !item || !canAccess(session.user, item)) return;
    if (item.id === "booking") setBookingResourceId(undefined);
    setHighlightedReservationId(undefined);
    setActive(item.id);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
  if (!session) return <><LoginScreen onLogin={value => { setSession(value); setActive("dashboard"); }} onError={reportError} />{debugConsole}</>;

  const user = session.user;
  const employeeView = user.role === "employee";
  const page = active === "dashboard" ? <RoleDashboard user={user} reservations={reservations} onNavigate={navigate} onOpenReservation={openReservation} />
    : active === "calendar" ? <CalendarOverview key={highlightedReservationId ?? "calendar"} user={user} reservations={reservations} highlightedReservationId={highlightedReservationId} onCreate={startBooking} />
      : active === "booking" ? <div><div className="mb-7"><p className="text-sm font-medium text-[#c71927]">Tạo yêu cầu mới</p><h1 className="mt-1 text-3xl font-bold uppercase tracking-wide">Đặt tài nguyên</h1><p className="mt-1 text-sm text-slate-500">Chọn thời gian và tài nguyên. Hệ thống sẽ kiểm tra tình trạng trống trước khi gửi yêu cầu.</p></div><ReservationDialog key={bookingResourceId ?? "empty"} open embedded initialResourceId={bookingResourceId} highlightResource={Boolean(bookingResourceId)} onClose={() => setActive("calendar")} onCreated={reservationCreated} onError={reportError} reservations={reservations} /></div>
        : active === "resources" ? <ResourcesPage user={user} onOpenDetail={openResourceDetail} />
          : active === "resource-detail" && detailResourceId ? <ResourceDetailPage resourceId={detailResourceId} onBack={() => setActive("resources")} onBook={startBooking} />
        : active === "usage" ? <UsagePage user={user} />
          : active === "costs" ? <CostsPage user={user} />
              : active === "people" ? <PeoplePage user={user} />
                : <ApprovalsPage user={user} />;

  const accountControls = <div className="flex items-center gap-3"><button className="relative rounded-xl border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-50"><Bell size={18} /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#df1f2d]" /></button><button onClick={() => setSession(null)} title="Đăng xuất khỏi bản demo" className="flex items-center gap-2 rounded-xl border border-slate-200 px-2 py-1.5 hover:bg-slate-50"><div className="grid h-8 w-8 place-items-center rounded-lg bg-red-50 text-xs font-bold text-[#c71927]">{user.initials}</div><div className="hidden text-left md:block"><p className="text-xs font-semibold">{user.name}</p><p className="text-[10px] text-slate-400">{user.roleLabel}</p></div><ChevronDown size={14} className="text-slate-400" /></button></div>;

  return <main className="min-h-screen bg-[#f5f6f8] text-[#172026]">
    {!employeeView && <aside className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-200 bg-white px-4 py-5 transition-transform lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="flex items-center justify-between px-2"><BrandMark /><button className="lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Đóng menu"><X size={20} /></button></div>
      <div className="mt-6 rounded-xl bg-slate-50 px-3 py-2"><p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Đang xem với vai trò</p><p className="mt-1 text-xs font-semibold text-slate-700">{user.roleLabel} · {user.scope}</p></div>
      <nav className="mt-5 space-y-1">{visibleNavigation.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => navigate(id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active === id || (id === "resources" && active === "resource-detail") ? "bg-red-50 text-[#c71927]" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}><Icon size={18} />{label}</button>)}</nav>
      <div className="absolute inset-x-4 bottom-5"><button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-500 hover:bg-slate-50"><Settings size={18} /> Cài đặt</button></div>
    </aside>}
    <section className={employeeView ? "" : "lg:pl-64"}>
      {employeeView ? <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 backdrop-blur"><div className="mx-auto flex min-h-18 max-w-[1500px] items-center justify-between gap-4 px-4 md:px-8"><div className="flex min-w-0 items-center gap-5"><div className="hidden shrink-0 md:block"><BrandMark /></div><nav className="flex min-w-0 items-center gap-1 overflow-x-auto">{visibleNavigation.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => navigate(id)} className={`flex h-18 shrink-0 items-center gap-2 border-b-2 px-3 text-sm font-medium transition ${active === id || (id === "resources" && active === "resource-detail") ? "border-[#c71927] text-[#c71927]" : "border-transparent text-slate-500 hover:text-slate-800"}`}><Icon size={17} />{label}</button>)}</nav></div>{accountControls}</div></header>
        : <header className="sticky top-0 z-20 flex h-18 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur md:px-8"><div className="flex items-center gap-3"><button className="rounded-lg p-2 hover:bg-slate-100 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Mở menu"><Menu size={20} /></button><div className="relative hidden sm:block"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} /><input className="w-72 rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#df1f2d] focus:bg-white" placeholder="Tìm trong trang hiện tại..." /></div></div>{accountControls}</header>}
      <div className="mx-auto max-w-[1500px] p-4 md:p-8">{page}</div>
    </section>
    {toast && <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl bg-[#171717] px-4 py-3 text-sm font-medium text-white shadow-xl"><CalendarDays size={16} className="text-red-300" /> Đặt chỗ đã xuất hiện trên lịch</div>}
    {debugConsole}
  </main>;
}
