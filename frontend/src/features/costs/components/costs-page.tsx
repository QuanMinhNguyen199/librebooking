import { Building2, CalendarDays, CircleDollarSign, MonitorCog, TrendingDown, Wrench } from "lucide-react";
import type { AuthUser } from "@/features/authentication/types";

const costGroups = [
  { name: "Điện và điều hòa", amount: 68.2, percent: 37, color: "bg-[#df1f2d]" },
  { name: "Bảo trì phòng, thiết bị", amount: 46.1, percent: 25, color: "bg-amber-500" },
  { name: "Dịch vụ và vệ sinh", amount: 38.8, percent: 21, color: "bg-blue-500" },
  { name: "Khấu hao thiết bị", amount: 31.5, percent: 17, color: "bg-slate-500" },
];

const rooms = [
  { name: "Phòng Saigon", location: "Tầng 5", booked: 126, usage: "86%", cost: 31.8, status: "Hiệu quả" },
  { name: "Phòng Hanoi", location: "Tầng 4", booked: 94, usage: "63%", cost: 27.4, status: "Ổn định" },
  { name: "Phòng Workshop", location: "Tầng 3", booked: 61, usage: "47%", cost: 29.6, status: "Cần theo dõi" },
  { name: "Phòng Brainstorm", location: "Tầng 5", booked: 28, usage: "21%", cost: 22.1, status: "Cần xem xét" },
];

function million(value: number) { return `${value.toLocaleString("vi-VN", { maximumFractionDigits: 1 })} triệu`; }
function currency(value: number) { return `${Math.round(value / 1000) * 1000}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ"; }

export function CostsPage({ user }: { user: AuthUser }) {
  const executive = user.role === "executive";
  const manager = user.role === "manager";
  const total = executive ? 184.6 : manager ? 42.8 : 28.4;
  const scale = total / 184.6;
  const values = executive ? [million(total), "24,8 triệu", "1,46 triệu", "−8,4%"] : manager ? [million(total), "5,2 triệu", "338.000 đ", "+2,1%"] : [million(total), "6,8 triệu", "426.000 đ", "+4,2%"];
  const cards = [
    ["Tổng chi vận hành", values[0], CircleDollarSign, "Điện, dịch vụ, bảo trì và thiết bị"],
    ["Chi phí bảo trì", values[1], Wrench, "Đã chi trong tháng này"],
    ["Chi phí mỗi giờ được đặt", values[2], CalendarDays, "Tổng chi ÷ tổng số giờ phòng đã đặt"],
    ["So với tháng trước", values[3], TrendingDown, "Cùng phạm vi và cách tính"],
  ];
  const trend = [["Tháng 3", 171], ["Tháng 4", 181], ["Tháng 5", 176], ["Tháng 6", 201], ["Tháng 7", 194], ["Tháng 8", 184.6]].map(([month, amount]) => [month as string, Math.round((amount as number) * scale * 10) / 10] as const);
  const scopedRooms = executive ? rooms : manager ? rooms.slice(0, 2) : rooms.filter(room => room.name !== "Phòng Workshop");
  const scopeDescription = executive ? "Toàn công ty · phục vụ quyết định ngân sách và tối ưu không gian" : manager ? `${user.scope} · chỉ gồm chi phí được phân quyền cho team` : `${user.scope} · phục vụ vận hành, bảo trì phòng và thiết bị`;

  return <div>
    <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div><p className="text-sm font-medium text-[#c71927]">Phòng và thiết bị</p><h1 className="mt-1 text-3xl font-bold uppercase tracking-wide">Chi phí vận hành</h1><p className="mt-1 text-sm text-slate-500">{scopeDescription}</p></div>
      <div className="flex gap-2"><label className="sr-only" htmlFor="cost-period">Kỳ báo cáo</label><select id="cost-period" className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium"><option>Tháng 8/2026</option><option>Tháng 7/2026</option></select><label className="sr-only" htmlFor="cost-scope">Phạm vi</label><select id="cost-scope" className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium" disabled={!executive}><option>{executive ? "Toàn công ty" : user.scope}</option>{executive && <option>Văn phòng HCM</option>}</select></div>
    </div>

    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{cards.map(([label, value, Icon, note]) => { const CardIcon = Icon as typeof CircleDollarSign; return <article key={label as string} className="rounded-2xl border border-slate-200 bg-white p-5"><CardIcon size={21} className="text-[#c71927]" /><p className="mt-4 text-sm text-slate-500">{label as string}</p><p className="mt-1 text-2xl font-bold">{value as string}</p><p className="mt-2 text-xs leading-5 text-slate-400">{note as string}</p></article>; })}</div>

    <div className="mt-5 grid gap-5 xl:grid-cols-2">
      <article className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6"><div className="flex items-start justify-between"><div><h2 className="font-bold">Xu hướng chi phí</h2><p className="mt-1 text-xs text-slate-400">Đơn vị: triệu đồng · 6 tháng gần nhất · {user.scope}</p></div><TrendingDown size={20} className="text-emerald-600" /></div><div className="mt-7 flex h-48 items-end gap-3 border-b border-slate-200">{trend.map(([month, amount]) => <div key={month} className="flex h-full flex-1 flex-col justify-end text-center"><span className="mb-2 text-xs font-semibold text-slate-600">{amount}</span><div className={`mx-auto w-full max-w-12 rounded-t-lg ${month === "Tháng 8" ? "bg-[#df1f2d]" : "bg-red-100"}`} style={{ height: `${amount / Math.max(...trend.map(item => item[1])) * 75}%` }} /><span className="mt-2 whitespace-nowrap text-[10px] text-slate-400">{month.replace("Tháng ", "T")}</span></div>)}</div></article>
      <article className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6"><div className="flex items-start justify-between"><div><h2 className="font-bold">Chi phí đang dùng vào đâu?</h2><p className="mt-1 text-xs text-slate-400">Cơ cấu trong phạm vi được xem</p></div><CircleDollarSign size={20} className="text-[#c71927]" /></div><div className="mt-6 space-y-4">{costGroups.map(item => <div key={item.name}><div className="mb-2 flex items-center justify-between gap-4 text-sm"><span className="font-medium">{item.name}</span><span className="whitespace-nowrap text-slate-500">{million(item.amount * scale)} · {item.percent}%</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.percent}%` }} /></div></div>)}</div></article>
    </div>

    <article className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white"><div className="flex flex-col gap-2 border-b border-slate-100 p-5 md:flex-row md:items-center md:justify-between md:p-6"><div><h2 className="font-bold">Chi phí và hiệu quả theo phòng</h2><p className="mt-1 text-xs text-slate-400">Chỉ hiển thị phòng trong phạm vi {user.scope}</p></div><span className="flex items-center gap-2 text-xs text-slate-500"><Building2 size={16} /> Dữ liệu minh họa · Tháng 8/2026</span></div><div className="overflow-x-auto"><table className="w-full min-w-[780px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400"><tr><th className="px-6 py-3">Phòng</th><th className="px-4 py-3">Giờ đã đặt</th><th className="px-4 py-3">Mức sử dụng</th><th className="px-4 py-3">Chi phí phân bổ</th><th className="px-4 py-3">Chi phí/giờ</th><th className="px-6 py-3">Đánh giá</th></tr></thead><tbody className="divide-y divide-slate-100">{scopedRooms.map(room => { const scopedCost = room.cost * scale; return <tr key={room.name} className="hover:bg-slate-50"><td className="px-6 py-4"><p className="font-semibold">{room.name}</p><p className="text-xs text-slate-400">{room.location}</p></td><td className="px-4 py-4">{room.booked} giờ</td><td className="px-4 py-4">{room.usage}</td><td className="px-4 py-4">{million(scopedCost)}</td><td className="px-4 py-4 font-semibold">{currency(scopedCost * 1000000 / room.booked)}</td><td className="px-6 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${room.status === "Hiệu quả" ? "bg-emerald-50 text-emerald-700" : room.status === "Ổn định" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"}`}>{room.status}</span></td></tr>; })}</tbody></table></div></article>

    <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_auto]"><article className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5"><h2 className="text-sm font-bold text-slate-800">Cách tính chi phí mỗi giờ được đặt</h2><p className="mt-2 text-sm leading-6 text-slate-600">Chi phí được phân bổ cho các phòng trong phạm vi quyền xem ÷ tổng số giờ đã đặt. Đây là dữ liệu minh họa; chưa phản ánh thời gian sử dụng thực tế nếu chưa có check-in/check-out.</p></article><article className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5"><MonitorCog className="text-amber-700" /><div><p className="text-sm font-bold">{executive ? 12 : manager ? 3 : 5} thiết bị cần xử lý</p><p className="mt-1 text-xs text-slate-500">Trong phạm vi {user.scope}</p></div></article></div>
  </div>;
}
