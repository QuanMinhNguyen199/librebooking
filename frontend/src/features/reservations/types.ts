export type ReservationSummary = {
  id: string;
  time: string;
  title: string;
  resourceName: string;
  colorClass: string;
};

export type CreateReservationInput = {
  title: string;
  resourceId: string;
  startsAt: string;
  endsAt: string;
};
