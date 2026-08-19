export type ResourceKind = "room" | "car" | "laptop";

export type ResourceAccessory = {
  id: number;
  name: string;
  quantityAvailable: number;
  minQuantity: number;
  maxQuantity: number;
};

export type ResourceSummary = {
  id: string;
  name: string;
  description: string;
  kind: ResourceKind;
  status: string;
  usagePercent: number;
  amenities?: string[];
  accessories?: ResourceAccessory[];
};
