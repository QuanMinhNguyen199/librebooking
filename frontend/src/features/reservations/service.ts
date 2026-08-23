import { createReservation } from "./api";
import type { CreateReservationInput, ReservationSummary } from "./types";

export async function submitReservation(input: CreateReservationInput): Promise<ReservationSummary> {
  if (new Date(input.endsAt) <= new Date(input.startsAt)) {
    throw new Error("Giờ kết thúc phải sau giờ bắt đầu.");
  }

  if (process.env.NEXT_PUBLIC_DEMO_MODE !== "false") {
    await new Promise(resolve => window.setTimeout(resolve, 500));
    return {
      id: `demo-${Date.now()}`,
      date: input.startsAt.slice(0, 10),
      time: input.startsAt.slice(11, 16),
      endsAt: input.endsAt.slice(11, 16),
      title: input.title,
      resourceName: input.resourceName,
      resourceId: input.resourceId,
      colorClass: "bg-[#df1f2d]",
      status: input.requiresApproval ? "pending" : "confirmed",
      participantEmails: input.participantEmails,
      bookedBy: "Người dùng hiện tại",
    };
  }

  const result = await createReservation(input);
  return {
    id: result.referenceNumber,
    date: input.startsAt.slice(0, 10),
    time: input.startsAt.slice(11, 16),
    endsAt: input.endsAt.slice(11, 16),
    title: input.title,
    resourceName: input.resourceName,
    resourceId: input.resourceId,
    colorClass: "bg-[#df1f2d]",
    status: input.requiresApproval ? "pending" : "confirmed",
    participantEmails: input.participantEmails,
    bookedBy: "Người dùng hiện tại",
  };
}
