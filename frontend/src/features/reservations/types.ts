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
  resourceName: string;
  startsAt: string;
  endsAt: string;
  accessories: Array<{
    accessoryId: number;
    quantityRequested: number;
  }>;
};
