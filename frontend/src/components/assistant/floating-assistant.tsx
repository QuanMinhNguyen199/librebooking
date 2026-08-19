"use client";

import { Bot, CalendarPlus, Grip, Send, Sparkles, X } from "lucide-react";
import { FormEvent, PointerEvent, useEffect, useRef, useState } from "react";

type Point = { x: number; y: number };
type Message = { id: string; role: "assistant" | "user"; text: string };

const bubbleSize = 58;
const pageGap = 18;

export function FloatingAssistant({ onOpenBooking }: { onOpenBooking: () => void }) {
  const [position, setPosition] = useState<Point | null>(null);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "assistant", text: "Chào Minh, tôi có thể giúp tìm phòng và mở form đăng ký sử dụng." },
  ]);
  const drag = useRef({ offsetX: 0, offsetY: 0, moved: false });

  useEffect(() => {
    const placeAtDefault = () => setPosition(current => current ?? ({ x: window.innerWidth - bubbleSize - 24, y: window.innerHeight - bubbleSize - 92 }));
    const keepInViewport = () => setPosition(current => current ? ({
      x: Math.min(Math.max(pageGap, current.x), window.innerWidth - bubbleSize - pageGap),
      y: Math.min(Math.max(pageGap, current.y), window.innerHeight - bubbleSize - pageGap),
    }) : current);
    placeAtDefault();
    window.addEventListener("resize", keepInViewport);
    return () => window.removeEventListener("resize", keepInViewport);
  }, []);

  function startDrag(event: PointerEvent<HTMLButtonElement>) {
    if (!position) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { offsetX: event.clientX - position.x, offsetY: event.clientY - position.y, moved: false };
  }

  function moveBubble(event: PointerEvent<HTMLButtonElement>) {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    const x = Math.min(Math.max(pageGap, event.clientX - drag.current.offsetX), window.innerWidth - bubbleSize - pageGap);
    const y = Math.min(Math.max(pageGap, event.clientY - drag.current.offsetY), window.innerHeight - bubbleSize - pageGap);
    if (position && (Math.abs(x - position.x) > 3 || Math.abs(y - position.y) > 3)) drag.current.moved = true;
    setPosition({ x, y });
  }

  function finishDrag() {
    if (!drag.current.moved) setOpen(current => !current);
  }

  function sendMessage(text: string) {
    const value = text.trim();
    if (!value) return;
    const normalized = value.toLocaleLowerCase("vi-VN");
    const answer = normalized.includes("phòng")
      ? "Phòng Hanoi đang phù hợp cho 8 người và có webcam hội nghị. Bạn có thể mở form để chọn giờ và thiết bị."
      : normalized.includes("chi phí") || normalized.includes("claude")
        ? "Claude hôm nay đang dùng $38.42. Đây là dữ liệu mô phỏng trên dashboard."
        : "Bản demo hiện hỗ trợ tìm phòng, xem chi phí AI và mở form đăng ký sử dụng.";
    setMessages(current => [...current,
      { id: `user-${Date.now()}`, role: "user", text: value },
      { id: `assistant-${Date.now()}`, role: "assistant", text: answer },
    ]);
    setInput("");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage(input);
  }

  if (!position) return null;
  const panelLeft = Math.min(Math.max(12, position.x - 310), window.innerWidth - 356);
  const panelTop = position.y > 470 ? position.y - 410 : position.y + bubbleSize + 10;

  return <>
    {open && <section style={{ left: panelLeft, top: Math.max(12, panelTop) }} className="fixed z-[70] flex h-[390px] w-[344px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
      <header className="flex items-center justify-between bg-[#171717] px-4 py-3 text-white">
        <div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#df1f2d]"><Bot size={19} /></span><div><p className="text-sm font-semibold">GEO Assistant</p><p className="text-[10px] text-white/55">Chế độ mô phỏng</p></div></div>
        <button onClick={() => setOpen(false)} className="rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white" aria-label="Đóng trợ lý"><X size={17} /></button>
      </header>
      <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">{messages.map(message => <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}><p className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-5 ${message.role === "user" ? "rounded-br-md bg-[#df1f2d] text-white" : "rounded-bl-md border border-slate-200 bg-white text-slate-600"}`}>{message.text}</p></div>)}</div>
      <div className="border-t border-slate-100 bg-white p-3">
        <div className="mb-2 flex gap-2 overflow-x-auto pb-1"><button onClick={() => sendMessage("Tìm phòng cho 8 người")} className="shrink-0 rounded-full bg-slate-100 px-3 py-1.5 text-[10px] text-slate-600 hover:bg-red-50 hover:text-[#c71927]">Tìm phòng 8 người</button><button onClick={onOpenBooking} className="flex shrink-0 items-center gap-1 rounded-full bg-red-50 px-3 py-1.5 text-[10px] font-medium text-[#c71927]"><CalendarPlus size={12} /> Đăng ký phòng</button></div>
        <form onSubmit={submit} className="flex gap-2"><input value={input} onChange={event => setInput(event.target.value)} placeholder="Hỏi về phòng, chi phí..." className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-[#df1f2d]" /><button className="grid h-9 w-9 place-items-center rounded-xl bg-[#df1f2d] text-white" aria-label="Gửi"><Send size={15} /></button></form>
      </div>
    </section>}
    <button
      style={{ left: position.x, top: position.y, width: bubbleSize, height: bubbleSize, touchAction: "none" }}
      onPointerDown={startDrag}
      onPointerMove={moveBubble}
      onPointerUp={finishDrag}
      className="fixed z-[71] grid cursor-grab place-items-center rounded-full bg-[#171717] text-white shadow-[0_10px_30px_rgba(0,0,0,.28)] ring-4 ring-white active:cursor-grabbing"
      aria-label="Kéo hoặc mở trợ lý GEO"
      title="Kéo để di chuyển · Bấm để trò chuyện"
    >
      <Sparkles size={23} className="text-red-400" />
      <Grip size={11} className="absolute bottom-1 right-1 text-white/45" />
      <span className="absolute right-0 top-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
    </button>
  </>;
}
