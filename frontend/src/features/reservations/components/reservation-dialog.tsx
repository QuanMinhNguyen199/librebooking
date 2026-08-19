"use client";

import { CalendarDays, Check, CheckCircle2, Clock3, DoorOpen, Info, PackagePlus, UsersRound, X } from "lucide-react";
import { FormEvent, useState } from "react";
import { demoRooms } from "@/features/resources/mock";
import { submitReservation } from "../service";
import type { ReservationSummary } from "../types";

export function ReservationDialog({ open, onClose, onCreated, onError }: { open: boolean; onClose: () => void; onCreated: (reservation: ReservationSummary) => void; onError: (action: string, error: unknown) => void }) {
  const [title, setTitle] = useState("Họp dự án");
  const [resourceId, setResourceId] = useState(demoRooms[0].id);
  const [accessoryQuantities, setAccessoryQuantities] = useState<Record<number, number>>({});
  const [roomChanged, setRoomChanged] = useState(false);
  const [date, setDate] = useState("2026-08-20");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [attendees, setAttendees] = useState("6");
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const selectedRoom = demoRooms.find(item => item.id === resourceId) ?? demoRooms[0];
  if (!open) return null;

  function changeRoom(nextResourceId: string) {
    setResourceId(nextResourceId);
    setAccessoryQuantities({});
    setRoomChanged(true);
  }

  function setAccessoryQuantity(accessoryId: number, quantity: number) {
    setAccessoryQuantities(current => ({ ...current, [accessoryId]: quantity }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true);
    try {
      const accessories = Object.entries(accessoryQuantities)
        .filter(([, quantity]) => quantity > 0)
        .map(([accessoryId, quantityRequested]) => ({ accessoryId: Number(accessoryId), quantityRequested }));
      const reservation = await submitReservation({ title, resourceId, resourceName: selectedRoom.name, startsAt: `${date}T${startTime}:00`, endsAt: `${date}T${endTime}:00`, accessories });
      onCreated(reservation); setCompleted(true); window.setTimeout(() => { setCompleted(false); onClose(); }, 900);
    } catch (error) { onError("Tạo booking", error); }
    finally { setLoading(false); }
  }

  return <div className="fixed inset-0 z-[60] grid place-items-center bg-black/45 p-4 backdrop-blur-sm" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="max-h-[92vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
      <header className="flex items-start justify-between border-b border-slate-100 px-6 py-5"><div><p className="text-xs font-semibold uppercase tracking-widest text-[#c71927]">Lịch sử dụng mới</p><h2 className="mt-1 text-2xl font-bold uppercase tracking-wide">Đăng ký sử dụng tài nguyên</h2><p className="mt-1 text-sm text-slate-500">Chọn tài nguyên có sẵn và khoảng thời gian cần sử dụng.</p></div><button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100" aria-label="Đóng"><X size={19} /></button></header>
      {completed ? <div className="grid min-h-80 place-items-center p-8 text-center"><div><CheckCircle2 size={52} className="mx-auto text-[#df1f2d]" /><h3 className="mt-4 text-xl font-bold">Đăng ký thành công</h3><p className="mt-2 text-sm text-slate-500">Lịch sử dụng của bạn đã được cập nhật.</p></div></div> : <form onSubmit={submit} className="max-h-[calc(92vh-112px)] space-y-5 overflow-y-auto p-6">
        <label className="block"><span className="mb-2 block text-sm font-semibold">Mục đích sử dụng</span><input required value={title} onChange={event => setTitle(event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#df1f2d] focus:ring-4 focus:ring-red-600/10" /></label>
        <label className="block"><span className="mb-2 flex items-center gap-2 text-sm font-semibold"><DoorOpen size={16} /> Phòng</span><select value={resourceId} onChange={event => changeRoom(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#df1f2d]">{demoRooms.map(resource => <option key={resource.id} value={resource.id}>{resource.name} — {resource.description}</option>)}</select></label>
        {roomChanged && <div className="flex items-start gap-2 rounded-xl bg-blue-50 px-3 py-2.5 text-xs text-blue-700"><Info size={15} className="mt-0.5 shrink-0" /><span>Tiện nghi và thiết bị đã được cập nhật theo phòng mới. Các thiết bị đã chọn trước đó đã được bỏ chọn.</span></div>}
        <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold"><Check size={16} className="text-emerald-600" /> Tiện nghi có sẵn trong phòng</div>
          <div className="mt-3 flex flex-wrap gap-2">{selectedRoom.amenities?.map(amenity => <span key={amenity} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600">{amenity}</span>)}</div>
          <p className="mt-3 text-[11px] text-slate-400">Các tiện nghi này được trang bị cố định, không cần đăng ký thêm.</p>
        </section>
        <section>
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><PackagePlus size={16} /> Thiết bị đăng ký thêm</div>
          <div className="grid gap-2 sm:grid-cols-2">{selectedRoom.accessories?.map(accessory => {
            const quantity = accessoryQuantities[accessory.id] ?? 0;
            return <div key={accessory.id} className={`rounded-xl border p-3 transition ${quantity > 0 ? "border-red-300 bg-red-50/50" : "border-slate-200"}`}>
              <label className="flex cursor-pointer items-start gap-3"><input type="checkbox" checked={quantity > 0} onChange={event => setAccessoryQuantity(accessory.id, event.target.checked ? accessory.minQuantity : 0)} className="mt-1 accent-[#df1f2d]" /><span className="min-w-0 flex-1"><span className="block text-sm font-medium">{accessory.name}</span><span className="mt-0.5 block text-[11px] text-slate-400">Còn {accessory.quantityAvailable} thiết bị</span></span></label>
              {quantity > 0 && <label className="mt-3 flex items-center justify-between border-t border-red-100 pt-2 text-xs text-slate-500"><span>Số lượng</span><select value={quantity} onChange={event => setAccessoryQuantity(accessory.id, Number(event.target.value))} className="rounded-lg border border-slate-200 bg-white px-2 py-1 outline-none">{Array.from({ length: accessory.maxQuantity - accessory.minQuantity + 1 }, (_, index) => accessory.minQuantity + index).map(value => <option key={value} value={value}>{value}</option>)}</select></label>}
            </div>;
          })}</div>
        </section>
        <div className="grid gap-4 sm:grid-cols-2"><label><span className="mb-2 flex items-center gap-2 text-sm font-semibold"><CalendarDays size={16} /> Ngày sử dụng</span><input required type="date" value={date} onChange={event => setDate(event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#df1f2d]" /></label><label><span className="mb-2 flex items-center gap-2 text-sm font-semibold"><UsersRound size={16} /> Số người</span><input min="1" type="number" value={attendees} onChange={event => setAttendees(event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#df1f2d]" /></label></div>
        <div className="grid gap-4 sm:grid-cols-2"><label><span className="mb-2 flex items-center gap-2 text-sm font-semibold"><Clock3 size={16} /> Bắt đầu</span><input required type="time" value={startTime} onChange={event => setStartTime(event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#df1f2d]" /></label><label><span className="mb-2 flex items-center gap-2 text-sm font-semibold"><Clock3 size={16} /> Kết thúc</span><input required type="time" value={endTime} onChange={event => setEndTime(event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#df1f2d]" /></label></div>
        <footer className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5"><button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">Hủy</button><button disabled={loading} className="rounded-xl bg-[#df1f2d] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#b81521] disabled:opacity-60">{loading ? "Đang kiểm tra lịch..." : "Xác nhận đăng ký"}</button></footer>
      </form>}
    </section>
  </div>;
}
