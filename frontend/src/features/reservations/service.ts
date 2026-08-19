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
      time: input.startsAt.slice(11, 16),
      title: input.title,
      resourceName: input.resourceName,
      colorClass: "bg-[#df1f2d]",
    };
  }

  const result = await createReservation(input);
  return {
    id: result.referenceNumber,
    time: input.startsAt.slice(11, 16),
    title: input.title,
    resourceName: input.resourceName,
    colorClass: "bg-[#df1f2d]",
  };
}
