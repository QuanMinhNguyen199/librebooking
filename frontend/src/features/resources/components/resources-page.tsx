"use client";

import { ArrowRight, Building2 } from "lucide-react";
import type { AuthUser } from "@/features/authentication/types";
import { demoRooms } from "../mock";

export function ResourcesPage({ user, onOpenDetail }: { user: AuthUser; onOpenDetail: (resourceId: string) => void }) {
  return <div><div className="mb-7"><p className="text-sm font-medium text-[#c71927]">Phòng họp</p><h1 className="mt-1 text-3xl font-bold uppercase tracking-wide">Danh mục phòng</h1><p className="mt-1 text-sm text-slate-500">Chọn một phòng để mở trang thông tin chi tiết trong phạm vi {user.scope}.</p></div><div className="grid gap-4 md:grid-cols-3">{demoRooms.map(room => <button key={room.id} onClick={() => onOpenDetail(room.id)} className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 text-left outline-none transition hover:-translate-y-0.5 hover:border-red-200 hover:shadow-md"><div className="flex items-start justify-between"><span className="grid h-11 w-11 place-items-center rounded-xl bg-slate-100 text-slate-600 group-hover:bg-red-50 group-hover:text-[#c71927]"><Building2 size={20} /></span><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-medium text-emerald-700">{room.status}</span></div><h2 className="mt-4 font-semibold">{room.name}</h2><p className="mt-1 text-xs text-slate-400">{room.description}</p><span className="mt-5 flex items-center gap-1 text-xs font-semibold text-[#c71927]">Xem thông tin phòng <ArrowRight size={14} /></span></button>)}</div></div>;
}
