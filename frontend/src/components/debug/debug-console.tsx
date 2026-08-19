"use client";

import { Activity, AlertTriangle, Bug, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type DebugEntry = { id: string; action: string; message: string; time: string };

export function DebugConsole({ entries, onClear, onTestError }: { entries: DebugEntry[]; onClear: () => void; onTestError: () => void }) {
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
