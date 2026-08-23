"use client";

import { Check, ChevronRight, Mail, ShieldCheck, UsersRound, X } from "lucide-react";
import { useState } from "react";
import type { AuthUser, DemoPermission, DemoRole } from "@/features/authentication/types";

type Person = { id: number; name: string; email: string; role: DemoRole; roleLabel: string; unit: string; permissions: DemoPermission[] };
const initialPeople: Person[] = [
  { id: 1, name: "An Nguyễn", email: "an.nguyen@thehegeo.com", role: "employee", roleLabel: "Nhân viên", unit: "Phòng Marketing", permissions: [] },
  { id: 2, name: "Lan Võ", email: "lan.vo@thehegeo.com", role: "employee", roleLabel: "Nhân viên", unit: "Phòng Marketing", permissions: [] },
  { id: 3, name: "Minh Nguyễn", email: "minh.nguyen@thehegeo.com", role: "manager", roleLabel: "Manager", unit: "Phòng Marketing", permissions: ["resource_usage", "cost", "people", "approval"] },
  { id: 4, name: "Hà Trần", email: "ha.tran@thehegeo.com", role: "resource_admin", roleLabel: "Admin tài nguyên", unit: "Văn phòng HCM", permissions: ["resource_usage", "cost", "approval"] },
  { id: 5, name: "Quang Lê", email: "quang.le@thehegeo.com", role: "executive", roleLabel: "CEO", unit: "Ban điều hành", permissions: ["resource_usage", "cost"] },
];
const roles: Array<[DemoRole, string]> = [["employee", "Nhân viên"], ["manager", "Manager"], ["resource_admin", "Admin tài nguyên"], ["system_admin", "Admin hệ thống"], ["executive", "CEO"]];
const permissionOptions: Array<[DemoPermission, string]> = [["resource_usage", "Xem báo cáo sử dụng"], ["cost", "Xem chi phí vận hành"], ["people", "Xem nhân sự và phân quyền"], ["approval", "Xử lý yêu cầu chờ duyệt"]];

export function PeoplePage({ user }: { user: AuthUser }) {
  const [people, setPeople] = useState(initialPeople);
  const [selectedId, setSelectedId] = useState<number>();
  const selected = people.find(person => person.id === selectedId);
  const canEdit = user.role === "system_admin";
  const visiblePeople = user.role === "manager" ? people.filter(person => person.unit === "Phòng Marketing") : people;

  function updateSelected(changes: Partial<Person>) {
    if (!selected || !canEdit) return;
    setPeople(current => current.map(person => person.id === selected.id ? { ...person, ...changes } : person));
  }
  function togglePermission(permission: DemoPermission) {
    if (!selected) return;
    updateSelected({ permissions: selected.permissions.includes(permission) ? selected.permissions.filter(item => item !== permission) : [...selected.permissions, permission] });
  }

  return <div><div className="mb-7"><p className="text-sm font-medium text-[#c71927]">Phạm vi quản lý</p><h1 className="mt-1 text-3xl font-bold uppercase tracking-wide">Nhân sự và phân quyền</h1><p className="mt-1 text-sm text-slate-500">{canEdit ? "Chọn thành viên để xem và cập nhật quyền trong bản demo." : "Bạn chỉ được xem thành viên trong phạm vi phụ trách."}</p></div><article className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><div className="flex items-center gap-2 border-b border-slate-100 p-5"><UsersRound size={19} className="text-[#c71927]" /><h2 className="font-semibold">{user.scope}</h2></div><div className="divide-y divide-slate-100">{visiblePeople.map(person => <button key={person.id} onClick={() => setSelectedId(person.id)} className="grid w-full gap-2 p-4 text-left text-sm transition hover:bg-slate-50 sm:grid-cols-[1fr_1fr_1fr_auto]"><span className="font-semibold">{person.name}</span><span className="flex items-center gap-1.5 text-slate-500"><ShieldCheck size={14} /> {person.roleLabel}</span><span className="text-slate-400">{person.unit}</span><ChevronRight size={16} className="text-slate-300" /></button>)}</div></article>
    {selected && <div className="fixed inset-0 z-[70] flex justify-end bg-black/30" onMouseDown={event => { if (event.target === event.currentTarget) setSelectedId(undefined); }}><aside className="h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl"><div className="flex items-start justify-between"><div><p className="text-xs font-semibold uppercase tracking-wider text-[#c71927]">Chi tiết thành viên</p><h2 className="mt-1 text-2xl font-bold">{selected.name}</h2><p className="mt-2 flex items-center gap-2 text-sm text-slate-500"><Mail size={15} /> {selected.email}</p></div><button onClick={() => setSelectedId(undefined)} className="rounded-lg p-2 hover:bg-slate-100" aria-label="Đóng"><X size={19} /></button></div><div className="mt-7 space-y-5"><label className="block"><span className="mb-2 block text-sm font-semibold">Vai trò</span><select disabled={!canEdit} value={selected.role} onChange={event => { const role = event.target.value as DemoRole; updateSelected({ role, roleLabel: roles.find(item => item[0] === role)?.[1] ?? role }); }} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm disabled:bg-slate-50">{roles.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><div><p className="text-sm font-semibold">Quyền theo feature</p><p className="mt-1 text-xs text-slate-400">Role cung cấp bộ quyền mặc định; checkbox dùng để mô phỏng quyền bổ sung.</p><div className="mt-3 space-y-2">{permissionOptions.map(([permission, label]) => <label key={permission} className={`flex items-center gap-3 rounded-xl border p-3 text-sm ${selected.permissions.includes(permission) ? "border-red-200 bg-red-50/40" : "border-slate-200"}`}><input type="checkbox" disabled={!canEdit} checked={selected.permissions.includes(permission)} onChange={() => togglePermission(permission)} className="accent-[#df1f2d]" /><span>{label}</span>{selected.permissions.includes(permission) && <Check size={15} className="ml-auto text-[#c71927]" />}</label>)}</div></div><div className="rounded-xl bg-blue-50 p-3 text-xs leading-5 text-blue-700">{canEdit ? "Thay đổi chỉ được lưu trong phiên demo, chưa gửi tới LibreBooking." : "Bạn không có quyền thay đổi role hoặc permission của thành viên này."}</div></div></aside></div>}
  </div>;
}
