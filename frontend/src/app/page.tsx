"use client";

import { Activity, AlertTriangle, ArrowUpRight, Bell, Bot, Bug, Building2, CalendarDays, Car, ChevronDown, Clock3, Eye, EyeOff, LayoutDashboard, Laptop, LockKeyhole, LogIn, Menu, MoreHorizontal, Plus, Search, Settings, Sparkles, Trash2, Users, WalletCards, X } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";

const nav = [
  { label: "Tổng quan", icon: LayoutDashboard }, { label: "Tài nguyên", icon: Building2 },
  { label: "Lịch đặt", icon: CalendarDays }, { label: "AI Usage", icon: Bot },
  { label: "Nhân sự", icon: Users }, { label: "Chi phí", icon: WalletCards },
];
const resources = [
  { name: "Phòng họp Saigon", meta: "Tầng 8 · 12 người", type: "room", status: "Đang trống", usage: 82 },
  { name: "Toyota Corolla Cross", meta: "Bãi xe B1 · 51A-239.18", type: "car", status: "Đang sử dụng", usage: 64 },
  { name: "MacBook Pro M3 #024", meta: "IT Pool · Nguyễn Minh An", type: "laptop", status: "Đã cấp phát", usage: 91 },
];
const bookings = [
  { time: "09:00", title: "Daily Product", place: "Phòng Saigon", color: "bg-violet-500" },
  { time: "10:30", title: "Gặp khách hàng Nova", place: "Phòng Hanoi", color: "bg-[#df1f2d]" },
  { time: "14:00", title: "Thiết bị quay sự kiện", place: "Sony A7 IV #02", color: "bg-amber-500" },
];

function ResourceIcon({ type }: { type: string }) {
  const Icon = type === "car" ? Car : type === "laptop" ? Laptop : Building2;
  return <Icon size={20} />;
}

type DebugEntry = { id: string; action: string; message: string; time: string };

function DebugConsole({ entries, onClear, onTestError }: { entries: DebugEntry[]; onClear: () => void; onTestError: () => void }) {
  const [open, setOpen] = useState(false);
  const previousCount = useRef(entries.length);

  useEffect(() => {
    if (entries.length > previousCount.current) setOpen(true);
    previousCount.current = entries.length;
  }, [entries.length]);

  return <div className="fixed bottom-5 left-5 z-[70]">
    {open && <section className="mb-3 w-[min(420px,calc(100vw-40px))] overflow-hidden rounded-2xl border border-slate-700 bg-[#111816] text-white shadow-2xl">
      <header className="flex items-center justify-between border-b border-white/10 px-4 py-3"><div className="flex items-center gap-2"><Bug size={16} className="text-red-300" /><span className="text-sm font-semibold">Debug log</span><span className="flex items-center gap-1 rounded-full bg-red-400/10 px-2 py-0.5 text-[10px] text-red-300"><Activity size={10} className="animate-pulse" /> LIVE</span></div><div className="flex items-center gap-1"><button onClick={onTestError} className="rounded-lg px-2 py-1.5 text-[10px] font-semibold text-amber-200 hover:bg-white/10">Tạo lỗi thử</button><button onClick={onClear} disabled={!entries.length} className="rounded-lg p-2 text-white/50 hover:bg-white/10 hover:text-white disabled:opacity-30" title="Xóa log"><Trash2 size={14} /></button><button onClick={() => setOpen(false)} className="rounded-lg p-2 text-white/50 hover:bg-white/10 hover:text-white" aria-label="Đóng debug log"><X size={14} /></button></div></header>
      <div className="max-h-72 overflow-auto p-3">{entries.length === 0 ? <div className="py-8 text-center"><p className="text-sm font-medium text-red-200">Không có lỗi</p><p className="mt-1 text-xs text-white/40">Action thành công sẽ không được ghi lại.</p></div> : <div className="space-y-2">{entries.map(entry => <article key={entry.id} className="rounded-xl bg-rose-400/10 p-3"><div className="flex items-start gap-2"><AlertTriangle size={14} className="mt-0.5 shrink-0 text-rose-300" /><div className="min-w-0"><div className="flex items-center gap-2"><p className="truncate text-xs font-semibold text-rose-200">{entry.action}</p><time className="shrink-0 text-[10px] text-white/30">{entry.time}</time></div><p className="mt-1 break-words text-xs leading-5 text-white/60">{entry.message}</p></div></div></article>)}</div>}</div>
    </section>}
    <button onClick={() => setOpen(value => !value)} className={`relative grid h-11 w-11 place-items-center rounded-xl shadow-lg transition ${entries.length ? "bg-[#df1f2d] text-white" : "bg-[#171717] text-red-200 hover:bg-[#292929]"}`} title="Mở debug log"><Bug size={18} />{entries.length > 0 && <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full border-2 border-white bg-amber-400 px-1 text-[9px] font-bold text-slate-900">{entries.length}</span>}</button>
  </div>;
}

function LoginScreen({ onLogin, onError }: { onLogin: () => void; onError: (action: string, error: unknown) => void }) {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("demo123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      if (username.trim().toLowerCase() === "admin" && ["demo123", "demoadmin"].includes(password)) onLogin();
      else { const message = "Tài khoản hoặc mật khẩu chưa đúng."; setError(message); onError("Đăng nhập", new Error(message)); }
    }, 650);
  }

  return (
    <main className="grid min-h-screen bg-[#f4f6f5] lg:grid-cols-[1.05fr_.95fr]">
      <section className="relative hidden overflow-hidden bg-[#141414] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-28 -top-28 h-96 w-96 rounded-full border border-white/10" />
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full border border-white/10" />
        <div className="relative flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-xl bg-[#df1f2d] text-white"><Sparkles size={21} /></div><div><p className="brand-font text-lg font-bold tracking-wide">THEHE<span className="text-[#ef2635]">GEO</span></p><p className="text-xs text-white/50">Resource workspace</p></div></div>
        <div className="relative max-w-xl"><div className="mb-6 grid h-12 w-12 place-items-center rounded-2xl bg-red-500/15 text-red-300"><Building2 size={24} /></div><h1 className="text-4xl font-semibold uppercase leading-tight tracking-wide xl:text-5xl">Mọi tài nguyên của công ty, trong một nơi.</h1><p className="mt-5 max-w-lg text-base leading-7 text-white/60">Đặt phòng và thiết bị, theo dõi chi phí, kiểm soát AI usage và làm việc cùng trợ lý MCP.</p><div className="mt-9 flex gap-8"><div><p className="text-2xl font-semibold">128</p><p className="mt-1 text-xs text-white/45">Tài nguyên</p></div><div><p className="text-2xl font-semibold">67%</p><p className="mt-1 text-xs text-white/45">Công suất</p></div><div><p className="text-2xl font-semibold">24/7</p><p className="mt-1 text-xs text-white/45">Khả dụng</p></div></div></div>
        <p className="relative text-xs text-white/35">Powered by LibreBooking · Next.js · MCP</p>
      </section>

      <section className="flex items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-9 flex items-center gap-3 lg:hidden"><div className="grid h-10 w-10 place-items-center rounded-xl bg-[#df1f2d] text-white"><Sparkles size={19} /></div><p className="brand-font text-lg font-bold tracking-wide">THEHE<span className="text-[#df1f2d]">GEO</span> Resource</p></div>
          <div className="mb-8"><p className="mb-3 text-sm font-semibold text-[#c71927]">Chào mừng trở lại</p><h2 className="text-3xl font-bold uppercase tracking-wide">Đăng nhập hệ thống</h2><p className="mt-2 text-sm leading-6 text-slate-500">Sử dụng tài khoản công ty để tiếp tục vào dashboard.</p></div>
          <form onSubmit={submit} className="space-y-5">
            <label className="block"><span className="mb-2 block text-sm font-semibold">Tên đăng nhập</span><input value={username} onChange={e => setUsername(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#df1f2d] focus:ring-4 focus:ring-red-600/10" autoComplete="username" /></label>
            <label className="block"><span className="mb-2 block text-sm font-semibold">Mật khẩu</span><div className="relative"><input value={password} onChange={e => setPassword(e.target.value)} type={showPassword ? "text" : "password"} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-11 text-sm outline-none transition focus:border-[#df1f2d] focus:ring-4 focus:ring-red-600/10" autoComplete="current-password" /><button type="button" onClick={() => setShowPassword(value => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400" aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label>
            <div className="flex items-center justify-between text-sm"><label className="flex items-center gap-2 text-slate-500"><input type="checkbox" defaultChecked className="accent-[#df1f2d]" /> Ghi nhớ đăng nhập</label><button type="button" className="font-semibold text-[#c71927]">Quên mật khẩu?</button></div>
            {error && <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
            <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#df1f2d] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#b81521] disabled:opacity-60">{loading ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Đang đăng nhập...</> : <><LogIn size={17} /> Đăng nhập</>}</button>
          </form>
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4"><LockKeyhole size={17} className="mt-0.5 shrink-0 text-[#df1f2d]" /><p className="text-xs leading-5 text-slate-500"><strong className="text-slate-700">Tài khoản demo:</strong> admin / demo123 (cũng chấp nhận mật khẩu LibreBooking `demoadmin`). Bản thật sẽ xác thực qua LibreBooking hoặc SSO công ty.</p></div>
        </div>
      </section>
    </main>
  );
}

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [debugEntries, setDebugEntries] = useState<DebugEntry[]>([]);
  const [active, setActive] = useState("Tổng quan");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState(false);
  function quickBook() { setToast(true); window.setTimeout(() => setToast(false), 2600); }

  function reportError(action: string, error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setDebugEntries(current => [{ id, action, message, time: new Date().toLocaleTimeString("vi-VN") }, ...current].slice(0, 50));
  }

  async function execute(action: string, operation: () => void | Promise<void>) {
    try { await operation(); } catch (error) { reportError(action, error); }
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
          <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-[#df1f2d] text-white"><Sparkles size={20} /></div><div><p className="brand-font text-base font-bold tracking-wide">THEHE<span className="text-[#df1f2d]">GEO</span></p><p className="text-[11px] text-slate-400">Resource workspace</p></div></div>
          <button className="lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Đóng menu"><X size={20} /></button>
        </div>
        <nav className="mt-8 space-y-1">{nav.map(({ label, icon: Icon }) => <button key={label} onClick={() => { setActive(label); setMobileOpen(false); }} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active === label ? "bg-red-50 text-[#c71927]" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}><Icon size={18} />{label}</button>)}</nav>
        <div className="absolute inset-x-4 bottom-5"><div className="mb-4 rounded-2xl bg-[#171717] p-4 text-white"><div className="mb-3 flex items-center gap-2 text-xs text-red-300"><Bot size={15} /> MCP đã kết nối</div><p className="text-sm font-medium">Đặt phòng bằng trợ lý AI</p><p className="mt-1 text-xs leading-5 text-white/60">“Tìm phòng 8 người lúc 2 giờ”</p></div><button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-500 hover:bg-slate-50"><Settings size={18} /> Cài đặt</button></div>
      </aside>

      <section className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-18 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur md:px-8">
          <div className="flex items-center gap-3"><button className="rounded-lg p-2 hover:bg-slate-100 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Mở menu"><Menu size={20} /></button><div className="relative hidden sm:block"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} /><input className="w-72 rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#df1f2d] focus:bg-white" placeholder="Tìm tài nguyên, nhân viên..." /></div></div>
          <div className="flex items-center gap-3"><button className="relative rounded-xl border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-50"><Bell size={18} /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#df1f2d]" /></button><button onClick={() => setIsLoggedIn(false)} title="Đăng xuất khỏi bản demo" className="flex items-center gap-2 rounded-xl border border-slate-200 px-2 py-1.5 hover:bg-slate-50"><div className="grid h-8 w-8 place-items-center rounded-lg bg-red-50 text-xs font-bold text-[#c71927]">MN</div><div className="hidden text-left md:block"><p className="text-xs font-semibold">Minh Nguyễn</p><p className="text-[10px] text-slate-400">Administrator</p></div><ChevronDown size={14} className="text-slate-400" /></button></div>
        </header>

        <div className="mx-auto max-w-[1500px] p-4 md:p-8">
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-1 text-sm font-medium text-[#c71927]">Thứ tư, 19 tháng 8</p><h1 className="text-2xl font-bold uppercase tracking-wide md:text-3xl">Chào buổi chiều, Minh</h1><p className="mt-1 text-sm text-slate-500">Đây là tình hình tài nguyên của công ty hôm nay.</p></div><button onClick={() => execute("Mở form đặt tài nguyên", quickBook)} className="flex items-center justify-center gap-2 rounded-xl bg-[#df1f2d] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#b81521]"><Plus size={17} /> Đặt tài nguyên</button></div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[
            ["Tài nguyên hoạt động", "128", "+6 tháng này", Building2, "text-[#c71927] bg-red-50"], ["Đang được sử dụng", "42", "67% công suất", Clock3, "text-blue-700 bg-blue-50"], ["Chi phí tháng này", "184,6 tr", "−8,4% so tháng trước", WalletCards, "text-violet-700 bg-violet-50"], ["Claude hôm nay", "$38.42", "12,8M tokens", Bot, "text-amber-700 bg-amber-50"],
          ].map(([label, value, note, Icon, tone]) => { const MetricIcon = Icon as typeof Building2; return <article key={label as string} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,.02)]"><div className="mb-4 flex items-start justify-between"><div className={`grid h-10 w-10 place-items-center rounded-xl ${tone}`}><MetricIcon size={19} /></div><ArrowUpRight size={16} className="text-slate-300" /></div><p className="text-sm text-slate-500">{label as string}</p><p className="mt-1 text-2xl font-bold tracking-tight">{value as string}</p><p className="mt-2 text-xs text-slate-400">{note as string}</p></article>; })}</div>

          <div className="mt-5 grid gap-5 xl:grid-cols-[1.55fr_1fr]">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6"><div className="mb-6 flex items-center justify-between"><div><h2 className="text-lg font-bold uppercase tracking-wide">Mức sử dụng tài nguyên</h2><p className="mt-1 text-xs text-slate-400">7 ngày gần nhất · booking đã check-in</p></div><button className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium">7 ngày <ChevronDown className="ml-2 inline" size={13} /></button></div><div className="flex h-56 items-end gap-3 border-b border-slate-100 px-1 md:gap-5">{[48, 62, 54, 76, 68, 42, 72].map((height, i) => <div key={i} className="flex h-full flex-1 items-end"><div className="w-full rounded-t-lg bg-red-100 transition hover:bg-[#df1f2d]" style={{ height: `${height}%` }} /></div>)}</div><div className="mt-3 grid grid-cols-7 text-center text-[11px] text-slate-400">{["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map(d => <span key={d}>{d}</span>)}</div></article>
            <article className="rounded-2xl border border-slate-200 bg-[#171717] p-5 text-white md:p-6"><div className="flex items-center justify-between"><div><p className="text-xs font-medium text-red-300">AI COST CONTROL</p><h2 className="mt-1 text-lg font-semibold uppercase tracking-wide">Claude usage</h2></div><div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10"><Bot size={20} /></div></div><div className="mt-7 flex items-end justify-between"><div><p className="text-3xl font-bold">$1,284.60</p><p className="mt-1 text-xs text-white/50">Ngân sách tháng: $2,000</p></div><p className="text-sm font-semibold text-red-300">64%</p></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[64%] rounded-full bg-[#df1f2d]" /></div><div className="mt-7 grid grid-cols-2 gap-3"><div className="rounded-xl bg-white/6 p-3"><p className="text-[11px] text-white/50">Input tokens</p><p className="mt-1 font-semibold">284.2M</p></div><div className="rounded-xl bg-white/6 p-3"><p className="text-[11px] text-white/50">Output tokens</p><p className="mt-1 font-semibold">42.8M</p></div></div></article>
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-[1.4fr_1fr]">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6"><div className="mb-4 flex items-center justify-between"><div><h2 className="text-lg font-bold uppercase tracking-wide">Tài nguyên nổi bật</h2><p className="mt-1 text-xs text-slate-400">Tình trạng và hiệu suất sử dụng</p></div><button className="text-xs font-semibold text-[#c71927]">Xem tất cả</button></div><div className="divide-y divide-slate-100">{resources.map(resource => <div key={resource.name} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 py-4"><div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-600"><ResourceIcon type={resource.type} /></div><div className="min-w-0"><p className="truncate text-sm font-semibold">{resource.name}</p><p className="mt-0.5 truncate text-xs text-slate-400">{resource.meta}</p></div><div className="hidden items-center gap-5 sm:flex"><div className="w-24"><div className="mb-1 flex justify-between text-[10px] text-slate-400"><span>Sử dụng</span><span>{resource.usage}%</span></div><div className="h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#df1f2d]" style={{ width: `${resource.usage}%` }} /></div></div><span className="w-24 rounded-full bg-slate-100 px-2.5 py-1 text-center text-[10px] font-medium text-slate-600">{resource.status}</span><MoreHorizontal size={17} className="text-slate-400" /></div></div>)}</div></article>
            <article className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6"><div className="mb-5 flex items-center justify-between"><div><h2 className="text-lg font-bold uppercase tracking-wide">Lịch hôm nay</h2><p className="mt-1 text-xs text-slate-400">3 booking sắp tới</p></div><CalendarDays size={19} className="text-[#c71927]" /></div><div className="space-y-5">{bookings.map(item => <div key={item.time} className="flex gap-3"><div className="w-11 text-xs font-semibold text-slate-500">{item.time}</div><div className={`mt-1 h-9 w-1 rounded-full ${item.color}`} /><div><p className="text-sm font-semibold">{item.title}</p><p className="mt-1 text-xs text-slate-400">{item.place}</p></div></div>)}</div><button onClick={() => execute("Thêm booking", quickBook)} className="mt-6 w-full rounded-xl border border-dashed border-slate-300 py-2.5 text-xs font-semibold text-slate-500 hover:border-[#df1f2d] hover:text-[#c71927]">+ Thêm booking</button></article>
          </div>
        </div>
      </section>
      {toast && <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl bg-[#171717] px-4 py-3 text-sm font-medium text-white shadow-xl"><span className="grid h-7 w-7 place-items-center rounded-lg bg-red-400/20 text-red-300"><CalendarDays size={15} /></span> Đã mở luồng đặt tài nguyên demo</div>}
      {debugConsole}
    </main>
  );
}
