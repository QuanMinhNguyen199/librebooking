"use client";

import { Building2, Eye, EyeOff, LockKeyhole, LogIn, Sparkles } from "lucide-react";
import { FormEvent, useState } from "react";
import { login } from "../service";

export function LoginScreen({ onLogin, onError }: { onLogin: () => void; onError: (action: string, error: unknown) => void }) {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("demo123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setLoading(true);
    try { await login({ username, password }); onLogin(); }
    catch (caught) { const message = caught instanceof Error ? caught.message : "Không thể đăng nhập."; setError(message); onError("Đăng nhập", caught); }
    finally { setLoading(false); }
  }

  return <main className="grid min-h-screen bg-[#f4f6f5] lg:grid-cols-[1.05fr_.95fr]">
    <section className="relative hidden overflow-hidden bg-[#141414] p-12 text-white lg:flex lg:flex-col lg:justify-between">
      <div className="absolute -right-28 -top-28 h-96 w-96 rounded-full border border-white/10" /><div className="absolute -right-12 -top-12 h-64 w-64 rounded-full border border-white/10" />
      <div className="relative flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-xl bg-[#df1f2d] text-white"><Sparkles size={21} /></div><div><p className="brand-font text-lg font-bold tracking-wide">THEHE<span className="text-[#ef2635]">GEO</span></p><p className="text-xs text-white/50">Resource workspace</p></div></div>
      <div className="relative max-w-xl"><div className="mb-6 grid h-12 w-12 place-items-center rounded-2xl bg-red-500/15 text-red-300"><Building2 size={24} /></div><h1 className="text-4xl font-semibold uppercase leading-tight tracking-wide xl:text-5xl">Mọi tài nguyên của công ty, trong một nơi.</h1><p className="mt-5 max-w-lg text-base leading-7 text-white/60">Đặt phòng và thiết bị, theo dõi chi phí, kiểm soát AI usage và làm việc cùng trợ lý MCP.</p><div className="mt-9 flex gap-8"><div><p className="text-2xl font-semibold">128</p><p className="mt-1 text-xs text-white/45">Tài nguyên</p></div><div><p className="text-2xl font-semibold">67%</p><p className="mt-1 text-xs text-white/45">Công suất</p></div><div><p className="text-2xl font-semibold">24/7</p><p className="mt-1 text-xs text-white/45">Khả dụng</p></div></div></div>
      <p className="relative text-xs text-white/35">Powered by LibreBooking · Next.js · MCP</p>
    </section>
    <section className="flex items-center justify-center px-5 py-10 sm:px-10"><div className="w-full max-w-md">
      <div className="mb-9 flex items-center gap-3 lg:hidden"><div className="grid h-10 w-10 place-items-center rounded-xl bg-[#df1f2d] text-white"><Sparkles size={19} /></div><p className="brand-font text-lg font-bold tracking-wide">THEHE<span className="text-[#df1f2d]">GEO</span> Resource</p></div>
      <div className="mb-8"><p className="mb-3 text-sm font-semibold text-[#c71927]">Chào mừng trở lại</p><h2 className="text-3xl font-bold uppercase tracking-wide">Đăng nhập hệ thống</h2><p className="mt-2 text-sm leading-6 text-slate-500">Sử dụng tài khoản công ty để tiếp tục vào dashboard.</p></div>
      <form onSubmit={submit} className="space-y-5">
        <label className="block"><span className="mb-2 block text-sm font-semibold">Tên đăng nhập</span><input value={username} onChange={event => setUsername(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#df1f2d] focus:ring-4 focus:ring-red-600/10" autoComplete="username" /></label>
        <label className="block"><span className="mb-2 block text-sm font-semibold">Mật khẩu</span><div className="relative"><input value={password} onChange={event => setPassword(event.target.value)} type={showPassword ? "text" : "password"} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-11 text-sm outline-none transition focus:border-[#df1f2d] focus:ring-4 focus:ring-red-600/10" autoComplete="current-password" /><button type="button" onClick={() => setShowPassword(value => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400" aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label>
        <div className="flex items-center justify-between text-sm"><label className="flex items-center gap-2 text-slate-500"><input type="checkbox" defaultChecked className="accent-[#df1f2d]" /> Ghi nhớ đăng nhập</label><button type="button" className="font-semibold text-[#c71927]">Quên mật khẩu?</button></div>
        {error && <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
        <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#df1f2d] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#b81521] disabled:opacity-60">{loading ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Đang đăng nhập...</> : <><LogIn size={17} /> Đăng nhập</>}</button>
      </form>
      <div className="mt-6 flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4"><LockKeyhole size={17} className="mt-0.5 shrink-0 text-[#df1f2d]" /><p className="text-xs leading-5 text-slate-500"><strong className="text-slate-700">Tài khoản demo:</strong> admin / demo123 (cũng chấp nhận `demoadmin`).</p></div>
    </div></section>
  </main>;
}
