import { AlertTriangle, BarChart3, CalendarClock, Clock3, DoorOpen, TrendingUp, UsersRound } from "lucide-react";
import type { AuthUser } from "@/features/authentication/types";

const baseRooms = [
  { name: "Phòng Saigon", capacity: 12, booked: 126, available: 147, usage: 86, bookings: 34, cancelled: 2, status: "Dùng nhiều" },
  { name: "Phòng Hanoi", capacity: 8, booked: 94, available: 149, usage: 63, bookings: 27, cancelled: 3, status: "Ổn định" },
  { name: "Phòng Workshop", capacity: 20, booked: 70, available: 149, usage: 47, bookings: 16, cancelled: 1, status: "Cần theo dõi" },
  { name: "Phòng Brainstorm", capacity: 6, booked: 31, available: 148, usage: 21, bookings: 11, cancelled: 4, status: "Dùng ít" },
];

export function UsagePage({ user }: { user: AuthUser }) {
  const executive = user.role === "executive";
  const manager = user.role === "manager";
  const rooms = executive || user.role === "system_admin" ? baseRooms : manager ? baseRooms.slice(0, 2) : baseRooms.filter(room => room.name !== "Phòng Workshop");
  const utilization = executive ? 67 : manager ? 61 : 58;
  const bookedHours = rooms.reduce((total, room) => total + room.booked, 0);
  const bookingCount = rooms.reduce((total, room) => total + room.bookings, 0);
  const cancelled = rooms.reduce((total, room) => total + room.cancelled, 0);
  const daily = executive ? [58, 66, 61, 73, 77] : manager ? [52, 64, 57, 69, 63] : [46, 59, 54, 68, 62];
  const peakHours = [["09:00–10:00", 82], ["10:00–11:00", 91], ["13:00–14:00", 68], ["14:00–15:00", 76], ["15:00–16:00", 57]] as const;
  const metrics = [
    ["Mức sử dụng trung bình", `${utilization}%`, TrendingUp, "Giờ đã đặt ÷ giờ phòng có thể phục vụ"],
    ["Tổng giờ đã đặt", `${bookedHours} giờ`, Clock3, "Tổng thời lượng reservation trong kỳ"],
    ["Số lượt đặt phòng", String(bookingCount), CalendarClock, "Gồm đã xác nhận và chờ duyệt"],
    ["Hủy hoặc không đến", String(cancelled), AlertTriangle, `${Math.round(cancelled / bookingCount * 100)}% tổng số lượt đặt`],
  ];

  return <div>
    <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-sm font-medium text-[#c71927]">Hiệu quả phòng họp</p><h1 className="mt-1 text-3xl font-bold uppercase tracking-wide">Báo cáo sử dụng</h1><p className="mt-1 text-sm text-slate-500">Dữ liệu minh họa trong phạm vi {user.scope}; chưa phải dữ liệu sử dụng thực tế từ LibreBooking.</p></div><div className="flex flex-wrap gap-2"><label htmlFor="usage-period" className="sr-only">Kỳ báo cáo</label><select id="usage-period" className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium"><option>Tháng 8/2026</option><option>Tháng 7/2026</option></select><label htmlFor="usage-room" className="sr-only">Phòng</label><select id="usage-room" className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium"><option>Tất cả phòng được phép xem</option>{rooms.map(room => <option key={room.name}>{room.name}</option>)}</select></div></div>

    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(([label, value, Icon, note]) => { const MetricIcon = Icon as typeof TrendingUp; return <article key={label as string} className="rounded-2xl border border-slate-200 bg-white p-5"><span className="grid h-10 w-10 place-items-center rounded-xl bg-red-50 text-[#c71927]"><MetricIcon size={19} /></span><p className="mt-4 text-sm text-slate-500">{label as string}</p><p className="mt-1 text-2xl font-bold">{value as string}</p><p className="mt-2 text-xs leading-5 text-slate-400">{note as string}</p></article>; })}</div>

    <div className="mt-5 grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
      <article className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6"><div className="flex items-start justify-between"><div><h2 className="font-bold">Mức sử dụng theo ngày</h2><p className="mt-1 text-xs text-slate-400">Tỷ lệ giờ đã được đặt trong tuần làm việc</p></div><BarChart3 size={19} className="text-[#c71927]" /></div><div className="mt-8 flex h-56 items-end gap-4 border-b border-slate-200">{daily.map((height, index) => <div key={index} className="flex h-full flex-1 flex-col justify-end text-center"><span className="mb-2 text-xs font-semibold text-slate-600">{height}%</span><div className={`w-full rounded-t-xl ${height === Math.max(...daily) ? "bg-[#df1f2d]" : "bg-red-100"}`} style={{ height: `${height}%` }} /></div>)}</div><div className="mt-3 grid grid-cols-5 text-center text-xs text-slate-400">{["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6"].map(day => <span key={day}>{day}</span>)}</div></article>
      <article className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6"><div><h2 className="font-bold">Khung giờ cao điểm</h2><p className="mt-1 text-xs text-slate-400">Tỷ lệ phòng có reservation theo giờ</p></div><div className="mt-6 space-y-4">{peakHours.map(([time, percent]) => <div key={time}><div className="flex justify-between text-xs"><span className="font-semibold">{time}</span><span className="text-slate-500">{percent}% số phòng</span></div><div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${percent >= 80 ? "bg-[#df1f2d]" : "bg-blue-500"}`} style={{ width: `${percent}%` }} /></div></div>)}</div><p className="mt-5 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-800">10:00–11:00 là khung giờ đông nhất. Khi nối API thật, có thể dùng thông tin này để gợi ý giờ hoặc phòng thay thế.</p></article>
    </div>

    <article className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white"><div className="flex flex-col gap-2 border-b border-slate-100 p-5 md:flex-row md:items-center md:justify-between md:p-6"><div><h2 className="font-bold">Hiệu quả sử dụng theo phòng</h2><p className="mt-1 text-xs text-slate-400">So sánh trong cùng phạm vi và kỳ báo cáo</p></div><span className="flex items-center gap-2 text-xs text-slate-500"><DoorOpen size={16} /> {rooms.length} phòng được phép xem</span></div><div className="overflow-x-auto"><table className="w-full min-w-[820px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400"><tr><th className="px-6 py-3">Phòng</th><th className="px-4 py-3">Sức chứa</th><th className="px-4 py-3">Giờ đã đặt</th><th className="px-4 py-3">Mức sử dụng</th><th className="px-4 py-3">Số lượt đặt</th><th className="px-4 py-3">Hủy/không đến</th><th className="px-6 py-3">Đánh giá</th></tr></thead><tbody className="divide-y divide-slate-100">{rooms.map(room => <tr key={room.name} className="hover:bg-slate-50"><td className="px-6 py-4 font-semibold">{room.name}</td><td className="px-4 py-4"><span className="flex items-center gap-1.5"><UsersRound size={14} className="text-slate-400" /> {room.capacity} người</span></td><td className="px-4 py-4">{room.booked}/{room.available} giờ</td><td className="px-4 py-4"><div className="flex items-center gap-2"><div className="h-2 w-20 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#df1f2d]" style={{ width: `${room.usage}%` }} /></div><span className="font-semibold">{room.usage}%</span></div></td><td className="px-4 py-4">{room.bookings}</td><td className="px-4 py-4">{room.cancelled}</td><td className="px-6 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${room.status === "Dùng nhiều" ? "bg-emerald-50 text-emerald-700" : room.status === "Ổn định" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"}`}>{room.status}</span></td></tr>)}</tbody></table></div></article>

    <div className="mt-5 grid gap-4 lg:grid-cols-2"><article className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5"><h2 className="text-sm font-bold text-emerald-900">Phòng được sử dụng hiệu quả</h2><p className="mt-2 text-sm leading-6 text-slate-600">Phòng Saigon đạt 86%, phù hợp để tiếp tục ưu tiên bảo trì thiết bị họp trực tuyến và giữ chất lượng phục vụ.</p></article><article className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5"><h2 className="text-sm font-bold text-amber-900">Phòng cần xem xét</h2><p className="mt-2 text-sm leading-6 text-slate-600">Phòng Brainstorm chỉ đạt 21% và có tỷ lệ hủy cao. Cần kiểm tra vị trí, công năng và thiết bị trước khi quyết định cải tạo.</p></article></div>
  </div>;
}
