export type ReservationSummary = {
  id: string;
  time: string;
  date: string;
  endsAt?: string;
  title: string;
  resourceName: string;
  resourceId: string;
  colorClass: string;
  status?: "pending" | "confirmed";
  participantEmails?: string[];
  bookedBy?: string;
};

export type CreateReservationInput = {
  title: string;
  resourceId: string;
  resourceName: string;
  startsAt: string;
  endsAt: string;
  accessories: Array<{
    accessoryId: number;
    quantityRequested: number;
  }>;
  requiresApproval?: boolean;
  participantEmails?: string[];
};
